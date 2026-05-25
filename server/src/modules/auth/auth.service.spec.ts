import {exampleDate} from "@/lib";
import {JwtService} from "@nestjs/jwt";
import {PERMISSIONS, ROLES, eventsEmitter} from "@/common";
import {ConfigService} from "@nestjs/config";
import {EventEmitter2} from "@nestjs/event-emitter";
import {AuthService} from "@/modules/auth/auth.service";
import {EmailService} from "@/modules/email/email.service";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {afterEach, beforeEach, describe, expect, it, vi, type Mock} from "vitest";
import {ConfigMock, NormalizedClientInfo, PrismaMock} from "@/types";
import {DeepMockProxy, mockDeep, mockReset} from "vitest-mock-extended";
import {RefreshToken, User} from "@/modules/prisma/generated/client";
import {compareSecret, generateRandomToken, hashSecretToken} from "@/lib";
import {UnauthorizedException} from "@nestjs/common";
import * as AuthDto from "./dto";
import {Prisma__RefreshTokenClient} from "@/modules/prisma/generated/models/RefreshToken";

vi.mock('@/lib/utils/crypto', () => ({
  compareSecret: vi.fn(),
  generateRandomToken: vi.fn(),
  hashSecretToken: vi.fn(),
  hashSecret: vi.fn(),
}));

const fakeAuthUser = {
  id: "existing_user_uuid",
  email: "existing@example.com",
  display_name: "existing_user",
  age: 25,
  password: "hashed_password",
  created_at: exampleDate,
  updated_at: exampleDate,
  userRoles: [
    {
      role: {
        name: ROLES.SELF,
        rolePermissions: [
          {
            permission: {
              name: PERMISSIONS.USER_SELF
            }
          }
        ]
      }
    }
  ]
} as unknown as User;

describe(AuthService.name, (): void => {
  let service: AuthService;
  let prisma: PrismaMock;
  let config: ConfigMock;
  let jwt: DeepMockProxy<JwtService>;
  let email: DeepMockProxy<EmailService>;
  let event: DeepMockProxy<EventEmitter2>;

  beforeEach(() => {
    prisma = mockDeep<PrismaService>();
    config = mockDeep<ConfigService>();
    jwt = mockDeep<JwtService>();
    email = mockDeep<EmailService>();
    event = mockDeep<EventEmitter2>();

    service = new AuthService(
      config,
      prisma,
      jwt,
      email,
      event,
    );

    prisma.$transaction.mockImplementation(async (fn) => fn(prisma));

    // Mock default config values
    config.get.mockImplementation((key: string) => {
      if (key === "JWT_SECRET") return "test_secret";
      if (key === "JWT_EXPIRES") return "1h";
      if (key === "CLIENT_DASHBOARD") return "https://dashboard.example.com";
      return null;
    });
  });

  afterEach((): void => {
    mockReset(prisma);
    mockReset(config);
    mockReset(email);
    mockReset(jwt);
    mockReset(event);
    vi.clearAllMocks();
  });

  // ======================================================
  // Login
  // ======================================================
  describe("login", () => {
    const clientInfo: NormalizedClientInfo = {
      browser: "chrome",
      city: "Tehran",
      country: "Iran",
      device: "laptop",
      os: "windows",
      lang: "fa",
      ip: "192.168.1.1",
    };

    const loginInput: AuthDto.LoginUserInput = {
      email: fakeAuthUser.email,
      password: "plain_password",
      remember: false,
    };

    const mockAccessToken = "mock_access_token_xyz";
    const mockRefreshToken = "mock_refresh_token_abc";
    const mockHashedRefreshToken = "hashed_refresh_token_abc";

    it('should successfully login and return user with tokens', async () => {
      // Mock user lookup
      prisma.user.findUnique.mockResolvedValue(fakeAuthUser);

      // Mock password comparison
      (compareSecret as Mock).mockResolvedValue(true);

      // Mock refresh token generation
      (generateRandomToken as Mock).mockReturnValue(mockRefreshToken);
      (hashSecretToken as Mock).mockReturnValue(mockHashedRefreshToken);

      // Mock refresh token creation
      prisma.refreshToken.create.mockResolvedValue({
        id: "rt_uuid",
        token: mockHashedRefreshToken,
        expires_at: new Date(),
        user_id: fakeAuthUser.id,
        revoked_at: null,
        remember: loginInput.remember,
        created_at: exampleDate,
        updated_at: exampleDate,
      });

      // Mock JWT sign
      jwt.sign.mockReturnValue(mockAccessToken);

      // Mock event emitter
      event.emit.mockImplementation(() => true);

      const result = await service.login(loginInput, clientInfo);

      // Verify user data (no password)
      expect((result.user as unknown as User).password).toBeUndefined();
      expect(result.user.id).toBe(fakeAuthUser.id);
      expect(result.user.email).toBe(fakeAuthUser.email);
      expect(result.user.display_name).toBe(fakeAuthUser.display_name);
      expect(result.user.age).toBe(fakeAuthUser.age);
      expect(result.user.roles).toEqual([ROLES.SELF]);
      expect(result.user.permissions).toEqual([PERMISSIONS.USER_SELF]);

      // Verify tokens
      expect(result.accessToken).toBe(mockAccessToken);
      expect(result.refreshToken).toBe(mockRefreshToken);

      // Verify refresh token was created
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.refreshToken.create).toHaveBeenCalledWith({
        /* eslint-disable @typescript-eslint/no-unsafe-assignment */
        data: expect.objectContaining({
          user_id: fakeAuthUser.id,
          token: mockHashedRefreshToken,
          remember: loginInput.remember,
          revoked_at: null,
        })
      });

      // Verify event was emitted
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(event.emit).toHaveBeenCalledWith(
        eventsEmitter.LOGIN_WELCOME,
        expect.objectContaining({
          email: fakeAuthUser.email,
          /* eslint-disable @typescript-eslint/no-unsafe-assignment */
          html: expect.stringContaining("New Login Detected")
        })
      );

      // Verify JWT was signed with correct payload
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: fakeAuthUser.id,
          display_name: fakeAuthUser.display_name,
          roles: [ROLES.SELF],
          permissions: [PERMISSIONS.USER_SELF],
        }),
        expect.objectContaining({
          secret: "test_secret",
          expiresIn: "1h",
        })
      );
    });

    it('should throw UnauthorizedException when user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      // noinspection ES6RedundantAwait
      await expect(service.login(loginInput, clientInfo)).rejects.toThrow(UnauthorizedException);

      // noinspection ES6RedundantAwait
      await expect(service.login(loginInput, clientInfo)).rejects.toMatchObject({
        response: {
          message: "Invalid user credentials",
          error: "Invalid Credentials"
        }
      });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.refreshToken.create).not.toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(event.emit).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      prisma.user.findUnique.mockResolvedValue(fakeAuthUser);
      (compareSecret as Mock).mockResolvedValue(false);

      // noinspection ES6RedundantAwait
      await expect(service.login(loginInput, clientInfo)).rejects.toThrow(UnauthorizedException);

      // noinspection ES6RedundantAwait
      await expect(service.login(loginInput, clientInfo)).rejects.toMatchObject({
        response: {
          message: "Invalid user credentials",
          error: "Invalid Credentials"
        }
      });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.refreshToken.create).not.toHaveBeenCalled();
    });

    it('should set 7 days expiration when remember is true', async () => {
      const rememberLoginInput = {...loginInput, remember: true};
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

      prisma.user.findUnique.mockResolvedValue(fakeAuthUser);
      (compareSecret as Mock).mockResolvedValue(true);
      (generateRandomToken as Mock).mockReturnValue(mockRefreshToken);
      (hashSecretToken as Mock).mockReturnValue(mockHashedRefreshToken);
      jwt.sign.mockReturnValue(mockAccessToken);

      prisma.refreshToken.create.mockImplementation((args) => {
        const expiresAt = args.data.expires_at as Date;

        // Check it's roughly 7 days
        const dayDiff = Math.abs(expiresAt.getDate() - sevenDaysFromNow.getDate());
        expect(dayDiff).toBeLessThanOrEqual(1);

        return {} as Prisma__RefreshTokenClient<RefreshToken>;
      });

      await service.login(rememberLoginInput, clientInfo);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.refreshToken.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          remember: true,
        })
      });
    });

    it('should continue (not throw) if event emitter fails', async () => {
      prisma.user.findUnique.mockResolvedValue(fakeAuthUser);
      (compareSecret as Mock).mockResolvedValue(true);
      (generateRandomToken as Mock).mockReturnValue(mockRefreshToken);
      (hashSecretToken as Mock).mockReturnValue(mockHashedRefreshToken);
      prisma.refreshToken.create.mockResolvedValue({} as RefreshToken);
      jwt.sign.mockReturnValue(mockAccessToken);

      // Simulate event emitter throwing error
      event.emit.mockImplementation(() => {
        throw new Error("Event failed");
      });

      // Should not throw, just continue
      const result = await service.login(loginInput, clientInfo);

      expect(result.accessToken).toBe(mockAccessToken);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(event.emit).toHaveBeenCalled();
    });
  });
});