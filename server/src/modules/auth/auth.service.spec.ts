// import {JwtService} from "@nestjs/jwt";
// import type {PrismaMock} from "@/types";
// import {ConfigService} from "@nestjs/config";
// import {EventEmitter2} from "@nestjs/event-emitter";
// import {afterEach, beforeEach, describe} from "vitest";
// import {AuthService} from "@/modules/auth/auth.service";
// import {EmailService} from "@/modules/email/email.service";
// import {PrismaService} from "@/modules/prisma/prisma.service";
// import {DeepMockProxy, mockDeep, mockReset} from "vitest-mock-extended";
//
// describe("AuthService", (): void => {
//   let service: AuthService;
//   let prisma: PrismaMock;
//   let config: DeepMockProxy<ConfigService>;
//   let jwtService: DeepMockProxy<JwtService>;
//   let emailService: DeepMockProxy<EmailService>;
//   let eventEmitter: DeepMockProxy<EventEmitter2>;
//
//   // Start All Services
//   beforeEach((): void => {
//     prisma = mockDeep<PrismaService>();
//     config = mockDeep<ConfigService>();
//     jwtService = mockDeep<JwtService>();
//     emailService = mockDeep<EmailService>();
//     eventEmitter = mockDeep<EventEmitter2>();
//
//     service = new AuthService(
//       config,
//       prisma,
//       jwtService,
//       emailService,
//       eventEmitter
//     );
//   });
//
//   afterEach((): void => {
//     mockReset(prisma);
//   });
// });

import {beforeEach, describe} from "vitest";
import {AuthService} from "@/modules/auth/auth.service";
import {Test} from "@nestjs/testing";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {mockDeep} from "vitest-mock-extended";
import {ConfigService} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";
import {EmailService} from "@/modules/email/email.service";
import {EventEmitter2} from "@nestjs/event-emitter";

describe("AuthService", (): void => {
  let service: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockDeep<PrismaService>()
        },
        {
          provide: ConfigService,
          useValue: mockDeep<ConfigService>()
        },
        {
          provide: JwtService,
          useValue: mockDeep<JwtService>()
        },
        {
          provide: EmailService,
          useValue: mockDeep<EmailService>()
        },
        {
          provide: EventEmitter2,
          useValue: mockDeep<EventEmitter2>()
        }
      ],
    }).compile();

    service = module.get(AuthService);
  });
});