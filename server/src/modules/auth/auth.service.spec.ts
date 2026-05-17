import {Test} from "@nestjs/testing";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {ConfigMock, PrismaMock} from "@/types";
import {EventEmitter2} from "@nestjs/event-emitter";
import {afterEach, beforeEach, describe} from "vitest";
import {AuthService} from "@/modules/auth/auth.service";
import {EmailService} from "@/modules/email/email.service";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {DeepMockProxy, mockDeep, mockReset} from "vitest-mock-extended";

describe("AuthService", (): void => {
  let service: AuthService;
  let prisma: PrismaMock;
  let config: ConfigMock;
  let jwt: DeepMockProxy<JwtService>;
  let email: DeepMockProxy<EmailService>;
  let event: DeepMockProxy<EventEmitter2>;

  // Start Services
  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();
    config = mockDeep<ConfigService>();
    jwt = mockDeep<JwtService>();
    email = mockDeep<EmailService>();
    event = mockDeep<EventEmitter2>();

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prisma
        },
        {
          provide: ConfigService,
          useValue: config
        },
        {
          provide: JwtService,
          useValue: jwt
        },
        {
          provide: EmailService,
          useValue: email
        },
        {
          provide: EventEmitter2,
          useValue: event
        }
      ],
    }).compile();

    service = module.get(AuthService);
  });

  // Reset Services
  afterEach((): void => {
    mockReset(prisma);
    mockReset(config);
    mockReset(email);
    mockReset(jwt);
    mockReset(event);
  });
});