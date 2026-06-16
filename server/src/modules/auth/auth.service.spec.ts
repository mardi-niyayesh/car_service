import * as AuthDto from "./dto";
import {exampleDate} from "@/lib";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {EventEmitter2} from "@nestjs/event-emitter";
import {UnauthorizedException} from "@nestjs/common";
import {AuthService} from "@/modules/auth/auth.service";
import {EmailService} from "@/modules/email/email.service";
import {PERMISSIONS, ROLES, eventsEmitter} from "@/common";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {DeepMockProxy, mockDeep, mockReset} from "vitest-mock-extended";
import {compareSecret, generateRandomToken, hashSecretToken} from "@/lib";
import {afterEach, beforeEach, describe, expect, it, vi, type Mock} from "vitest";
import type {ConfigMock, NormalizedClientInfo, PrismaMock, RefreshTokenPayload} from "@/types";
import type {Prisma__RefreshTokenClient} from "@/modules/prisma/generated/models/RefreshToken";
import {PermissionType, RefreshToken, Role, RoleType, User, UserRole} from "@/modules/prisma/generated/client";
import {UUID} from "node:crypto";

vi.mock('@/lib/utils/crypto', () => ({
  compareSecret: vi.fn(),
  generateRandomToken: vi.fn(),
  hashSecretToken: vi.fn(),
  hashSecret: vi.fn(),
}));

vi.mock('node:crypto', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:crypto')>();
  // noinspection JSUnusedGlobalSymbols
  return {
    ...actual,
    randomUUID: () => 'fixed-uuid-for-test',
  };
});

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
  // Register
  // ======================================================
  describe("register", () => {
    const mockSelfRole: Role = {
      id: "self_role_uuid",
      name: ROLES.SELF,
      updated_at: exampleDate,
      created_at: exampleDate,
      role_type: RoleType.BASE,
      creator_id: null,
      description: "description",
    };

    const clientInfo: NormalizedClientInfo = {
      browser: "firefox",
      city: "city",
      country: "country",
      device: "gigabyte",
      os: "linux",
      lang: "en",
      ip: "188.124.23.122",
    };

    it('should successfully create a new user', async () => {
      const mockCreatedUser = {
        id: "new_user_uuid",
        email: fakeAuthUser.email,
        display_name: fakeAuthUser.display_name,
        age: fakeAuthUser.age,
        password: "hashed_password",
        created_at: new Date(),
        updated_at: new Date(),
      };

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.role.findUnique.mockResolvedValue(mockSelfRole);
      prisma.user.create.mockResolvedValue(mockCreatedUser);
      prisma.userRole.create.mockResolvedValue({
        id: "new_user_role_uuid",
        user_id: mockCreatedUser.id,
        role_id: mockSelfRole.id,
        created_at: new Date(),
        updated_at: new Date(),
        role: {
          id: mockSelfRole.id,
          name: ROLES.SELF,
          created_at: exampleDate,
          updated_at: exampleDate,
          role_type: RoleType.BASE,
          creator_id: null,
          description: "description",
          rolePermissions: [
            {
              id: "rp_uuid",
              role_id: mockSelfRole.id,
              permission_id: "perm_uuid",
              created_at: exampleDate,
              updated_at: exampleDate,
              permission: {
                id: "perm_uuid",
                name: PERMISSIONS.USER_SELF,
                created_at: exampleDate,
                updated_at: exampleDate,
                description: "self permission",
                permission_type: PermissionType.CORE,
              }
            }
          ]
        }
      } as unknown as UserRole);

      const result = await service.register({
        email: fakeAuthUser.email,
        password: fakeAuthUser.password,
        age: fakeAuthUser.age as number,
        display_name: fakeAuthUser.display_name as string,
      }, clientInfo);

      expect(result.data.user.permissions).toEqual([PERMISSIONS.USER_SELF]);
      expect(result.data.user.roles).toEqual([ROLES.SELF]);
      expect((result.data.user as unknown as User).password).toBeUndefined();
    });
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

  // ======================================================
  // Refresh
  // ======================================================
  describe("refresh", () => {
    const mockRefreshPayload: RefreshTokenPayload = {
      refreshRecord: {
        id: 'refresh-token-456',
        token: 'hashed_refresh_token',
        expires_at: new Date(),
        revoked_at: null,
        remember: false,
        user_id: 'user-123',
        created_at: new Date(),
        updated_at: new Date(),
      },
      user: {
        id: 'user-123',
        email: 'john@example.com',
        display_name: 'John Doe',
        age: 25,
        roles: ['self', 'admin'],
        permissions: ['user.self', 'user.view', 'user.edit'],
        created_at: new Date(),
        updated_at: new Date(),
      },
    };

    const mockAccessToken = 'new_access_token_xyz';
    const mockUUID = 'fixed-uuid-for-test';

    beforeEach((): void => {
      vi.clearAllMocks();
    });

    // success
    it('should generate new access token from refresh payload', () => {
      // Mock JWT sign
      jwt.sign.mockReturnValue(mockAccessToken);

      const result = service.refresh(mockRefreshPayload);

      // 1. Test returns string (access token)
      expect(typeof result).toBe('string');
      expect(result).toBe(mockAccessToken);

      // 2. Verify JWT sign called with correct payload
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: mockRefreshPayload.user.id,
          jti: expect.stringContaining(mockUUID),
          roles: mockRefreshPayload.user.roles,
          permissions: mockRefreshPayload.user.permissions,
          display_name: mockRefreshPayload.user.display_name,
        }),
        expect.objectContaining({
          secret: expect.any(String),
          expiresIn: "1h",
        })
      );

      // 3. Verify jti format
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const jtiArg = (jwt.sign as Mock).mock.calls[0][0].jti;
      expect(jtiArg).toMatch(new RegExp(`^${mockUUID}\\d+$`));
    });

    it('should use empty string for display_name when not provided', () => {
      const payloadWithoutDisplayName = {
        ...mockRefreshPayload,
        display_name: undefined as unknown as string,
      };

      jwt.sign.mockReturnValue(mockAccessToken);

      service.refresh(payloadWithoutDisplayName);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          display_name: mockRefreshPayload.user.display_name,
        }),
        expect.anything()
      );
    });

    it('should include all roles and permissions in JWT payload', () => {
      const payloadWithManyPermissions = {
        ...mockRefreshPayload,
        user: {
          ...mockRefreshPayload.user,
          roles: ['self', 'user_manager', 'role_manager'],
          permissions: ['user.self', 'user.view', 'user.delete', 'role.create', 'role.delete'],
        },
      };

      jwt.sign.mockReturnValue(mockAccessToken);

      service.refresh(payloadWithManyPermissions);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          roles: ['self', 'user_manager', 'role_manager'],
          permissions: ['user.self', 'user.view', 'user.delete', 'role.create', 'role.delete'],
        }),
        expect.anything()
      );
    });

    // ======================================================
    // Logout
    // ======================================================
    describe("logout", () => {
      const mockRefreshPayload: RefreshTokenPayload = {
        user: {
          id: 'user-123',
          email: 'john@example.com',
          display_name: 'John Doe',
          age: 25,
          roles: ['self'],
          permissions: ['user.self'],
          created_at: new Date(),
          updated_at: new Date(),
        },
        refreshRecord: {
          id: 'refresh-token-456',
          token: 'hashed_refresh_token',
          expires_at: new Date(),
          revoked_at: null,
          remember: false,
          user_id: 'user-123',
          created_at: new Date(),
          updated_at: new Date(),
        },
      };
    });
  });
});