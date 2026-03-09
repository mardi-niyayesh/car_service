import {getSafeUser, hashSecretToken} from '@/lib';
import type {BaseException, RefreshRequest} from '@/types';
import {PrismaService} from '@/modules/prisma/prisma.service';
import {CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException} from '@nestjs/common';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const req: RefreshRequest = context.switchToHttp().getRequest<RefreshRequest>();

    const rawToken: string | null = this.getTokenFromReq(req);

    if (!rawToken) throw new UnauthorizedException('Refresh token missing');

    const hashed: string = hashSecretToken(rawToken);

    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: {token: hashed},
      include: {
        user: {
          omit: {password: true},
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
        }
      }
    });

    if (!tokenRecord) throw new UnauthorizedException({
      message: 'Invalid or expired refresh token',
      error: 'Invalid refreshToken'
    } as BaseException);

    if (tokenRecord.revoked_at) {
      await this.prisma.refreshToken.updateMany({
        where: {user_id: tokenRecord.user.id},
        data: {revoked_at: new Date()}
      });

      throw new ForbiddenException({
        message: 'Refresh token already revoked.',
        error: 'RefreshToken is Revoked',
      } as BaseException);
    }

    const getUserInfo = getSafeUser(tokenRecord.user);

    req.refreshPayload = {
      refreshRecord: {
        id: tokenRecord.id,
        created_at: tokenRecord.created_at,
        updated_at: tokenRecord.updated_at,
        expires_at: tokenRecord.expires_at,
        revoked_at: tokenRecord.revoked_at,
        remember: tokenRecord.remember,
        user_id: tokenRecord.user_id,
        token: tokenRecord.token,
      },
      user: getUserInfo.user,
    };

    return true;
  }

  private getTokenFromReq(req: RefreshRequest): string | null {
    const cookies = req.cookies as { refreshToken?: string };
    const header = req.headers['x-refresh-token'];

    return cookies?.refreshToken || (Array.isArray(header) ? header[0] : header) || null;
  }
}