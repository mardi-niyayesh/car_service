import {ROLES} from "@/common";
import * as AuthDto from "./dto";
import type {StringValue} from "ms";
import {randomUUID} from "node:crypto";
import {JwtService} from "@nestjs/jwt";
import {User} from "../prisma/generated/client";
import {EventEmitter2} from "@nestjs/event-emitter";
import {PrismaService} from "../prisma/prisma.service";
import {EmailService} from "@/modules/email/email.service";
import {buildEmailHtml, compareSecret, generateRandomToken, getSafeUser, hashSecret, hashSecretToken} from "@/lib";
import type {AccessTokenPayload, RefreshTokenPayload, ApiResponse, UserResponse, LoginResponse, BaseException, NormalizedClientInfo} from "@/types";
import {BadRequestException, ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException} from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  /** generate new accessToken with payload */
  generateAccessToken(payload: AccessTokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET!,
      expiresIn: process.env.JWT_EXPIRES as StringValue,
    });
  }

  /** create user in db */
  async register(createData: AuthDto.CreateUserInput, clientInfo: NormalizedClientInfo): Promise<ApiResponse<UserResponse>> {
    return this.prisma.$transaction(async tx => {
      const user: User | null = await tx.user.findUnique({
        where: {
          email: createData.email,
        }
      });

      if (user) throw new ConflictException({
        message: 'User already exists in database',
        error: 'Conflict Users'
      } as BaseException);

      const hashPassword: string = await hashSecret(createData.password);

      const selfRole = await tx.role.findUnique({
        where: {
          name: ROLES.SELF
        }
      });

      if (!selfRole) throw new InternalServerErrorException({
        message: 'self role not exist in database',
        error: 'Self Role not exist'
      } as BaseException);

      const newUser = await tx.user.create({
        data: {
          ...createData,
          password: hashPassword
        }
      });

      const roles = await tx.userRole.create({
        data: {
          role_id: selfRole.id,
          user_id: newUser.id
        },
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {permission: true}
              }
            }
          }
        }
      });

      const permissions: string[] = [...new Set(
        roles.role.rolePermissions.map(p => p.permission.name)
      )];

      const data: UserResponse = {
        user: {
          updated_at: newUser.updated_at,
          created_at: newUser.created_at,
          age: newUser.age,
          id: newUser.id,
          email: newUser.email,
          display_name: newUser.display_name,
          roles: [roles.role.name],
          permissions,
        }
      };

      try {
        this.eventEmitter.emit("signup.welcome", {
          email: data.user.email,
          html: buildEmailHtml({
            title: `Welcome To ${process.env.CLIENT_NAME!}`,
            clientInfo,
            contentName: "welcome",
            extra: {
              titleText: "Welcome to " + process.env.CLIENT_NAME!,
              messageText: "Your account has been successfully created.",
              dashboardLink: process.env.CLIENT_DASHBOARD!,
            }
          })
        });
      } catch (_) { /* empty */ }

      return {
        message: "user created successfully",
        data
      };
    });
  }

  /** login users */
  async login(loginData: AuthDto.LoginUserInput, clientInfo: NormalizedClientInfo): Promise<LoginResponse & { refreshToken: string }> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginData.email,
      },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {permission: true}
                }
              }
            }
          }
        }
      }
    });

    if (!user) throw new UnauthorizedException({
      message: "Invalid user credentials",
      error: "Invalid Credentials"
    } as BaseException);

    const isValidPassword: boolean = await compareSecret(loginData.password, user.password);

    if (!isValidPassword) throw new UnauthorizedException({
      message: "Invalid user credentials",
      error: "Invalid Credentials"
    } as BaseException);

    const {user: userData} = getSafeUser(user);

    const accessTokenPayload: AccessTokenPayload = {
      sub: user.id,
      jti: randomUUID() + Date.now(),
      display_name: user.display_name ?? "",
      roles: userData.roles,
      permissions: userData.permissions,
    };

    const refreshToken: string = generateRandomToken();
    const accessToken: string = this.generateAccessToken(accessTokenPayload);

    const expires_at: Date = new Date(
      Date.now() + (
        loginData.remember
          ? 7 * 24 * 60 * 60 * 1000 // 7 days
          : 12 * 60 * 60 * 1000     // 12 hours
      )
    );

    const hashedRefreshToken: string = hashSecretToken(refreshToken);

    await this.prisma.refreshToken.create({
      data: {
        expires_at,
        user_id: user.id,
        revoked_at: null,
        token: hashedRefreshToken,
        remember: loginData.remember,
      }
    });

    try {
      this.eventEmitter.emit("login.welcome", {
        email: user.email,
        html: buildEmailHtml({
          title: `New Login Detected`,
          clientInfo,
          contentName: "welcome",
          extra: {
            titleText: "New Login Detected",
            messageText: "Your account was just accessed. If this was you, no action is needed.",
            dashboardLink: process.env.CLIENT_DASHBOARD!,
          }
        })
      });
    } catch (_) {/* empty */}

    return {
      user: {
        id: user.id,
        age: user.age,
        email: user.email,
        display_name: user.display_name,
        created_at: user.created_at,
        updated_at: user.updated_at,
        roles: userData.roles,
        permissions: userData.permissions,
      },
      accessToken,
      refreshToken,
    };
  }

  /** endpoint for refresh accessToken */
  refresh(refreshPayload: RefreshTokenPayload): string {
    const payload: AccessTokenPayload = {
      sub: refreshPayload.user.id,
      jti: randomUUID() + Date.now(),
      roles: refreshPayload.user.roles,
      permissions: refreshPayload.user.permissions,
      display_name: refreshPayload.user.display_name ?? "",
    };

    return this.generateAccessToken(payload);
  };

  /** revoked refresh token and logout */
  async logout(refreshPayload: RefreshTokenPayload): Promise<ApiResponse<void>> {
    await this.prisma.refreshToken.update({
      where: {
        id: refreshPayload.refreshRecord.id
      },
      data: {
        revoked_at: new Date()
      }
    });

    return {
      message: "user logout successfully"
    };
  }

  /** send email to user for reset password */
  async forgotPassword(to: string, clientInfo: NormalizedClientInfo): Promise<ApiResponse<AuthDto.ForgotApiResponse>> {
    return this.prisma.$transaction(async tx => {
      const user = await tx.user.findUnique({
        where: {
          email: to
        },
        include: {
          passwordToken: true
        }
      });

      if (!user) throw new NotFoundException({
        message: 'User not found in database',
        error: 'User Not Found'
      } as BaseException);

      const expireMinutes: number = 15;

      if (user.passwordToken) throw new ConflictException({
        message: `A password reset token is already active. Please check your Inbox Email or spam. or try again ${expireMinutes} minutes later`,
        error: 'Email Already Send'
      } as BaseException);

      const token: string = generateRandomToken();
      const hashedToken: string = hashSecretToken(token);

      const resetLink: string = `${process.env.CLIENT_RESET_PASSWORD}?token=${token}`;

      const html: string = buildEmailHtml({
        contentName: "forgot-password",
        clientInfo,
        extra: {
          resetLink,
          expireMinutes: expireMinutes.toString()
        },
        title: "Reset Your Password",
      });

      try {
        await tx.passwordToken.create({
          data: {
            user_id: user.id,
            token: hashedToken,
            expires_at: new Date(Date.now() + expireMinutes * 60 * 1000)
          }
        });

        await this.emailService.forgotPassword(to, html);

        return {
          message: "Email sent successfully, Please check your inbox",
          data: {
            email: to,
            time: `${expireMinutes} minutes left`,
            timeNumber: expireMinutes
          }
        };
      } catch (e) {
        throw new InternalServerErrorException({
          message: (e as Error).message || 'Failed to send reset password email',
          error: (e as Error).name || "Internal Server Error",
        } as BaseException);
      }
    });
  }

  /** Reset password with token */
  async resetPassword(token: string, password: string, clientInfo: NormalizedClientInfo): Promise<ApiResponse<void>> {
    const result = await this.prisma.$transaction(async tx => {
      const hashedToken: string = hashSecretToken(token);

      const findToken = await tx.passwordToken.findFirst({
        where: {token: hashedToken},
        include: {user: true}
      });

      if (!findToken) throw new NotFoundException({
        message: 'Reset password token is invalid or has expired.',
        error: "Token Not Found"
      } as BaseException);

      if (findToken.expires_at < new Date()) throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'The reset password token has expired. Please request a new one.',
        error: 'Token Expired'
      });

      const newPassword: string = await hashSecret(password);

      await tx.user.update({
        where: {
          id: findToken.user.id
        },
        data: {
          password: newPassword
        }
      });

      await tx.passwordToken.delete({
        where: {id: findToken.id}
      });

      return {
        message: "Password reset successfully",
        email: findToken.user.email
      };
    });

    try {
      const html: string = buildEmailHtml({
        clientInfo,
        contentHtml:
          `<h1>Password Updated</h1>
          <p>Your password has been changed successfully.</p>`,
        title: "Your Password Updated",
      });

      this.eventEmitter.emit("password.changed", {
        email: result.email,
        html
      });
    } catch (_) {/* empty */}

    return {
      message: result.message,
    };
  }
}