import {Injectable} from '@nestjs/common';
import {Cron, CronExpression} from "@nestjs/schedule";
import {RentStatus} from "@/modules/prisma/generated/enums";
import {PrismaService} from "@/modules/prisma/prisma.service";

/** revoked all tokens when expiresAt <= now */
@Injectable()
export class CleanerJobs {
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_5_MINUTES) // five minutes
  async cleanExpiresToken(): Promise<void> {
    const now: Date = new Date();

    // delete all refresh token when (expires < now)
    await this.prisma.refreshToken.deleteMany({
      where: {
        expires_at: {lt: now},
      }
    });

    // delete all passwords token when (expires < now)
    await this.prisma.passwordToken.deleteMany({
      where: {
        expires_at: {lt: now},
      }
    });
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  async cleanCarRentCart() {
    const now: Date = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    await this.prisma.carRent.deleteMany({
      where: {
        status: RentStatus.PENDING,
        created_at: {
          gte: twoHoursAgo
        }
      }
    });
  }
}