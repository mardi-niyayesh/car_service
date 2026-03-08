import {ONE_MINUTE_MS} from '@/lib';
import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from './generated/client';
import {Injectable, OnModuleInit, OnModuleDestroy} from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

  private static initialize: boolean = false;

  constructor() {
    const adapter: PrismaPg = new PrismaPg({
      connectionString: process.env.DATABASE_URL as string,
    });
    super({
      adapter,
      errorFormat: 'minimal',
      log: ['info', 'error', 'warn'],
      transactionOptions: {
        timeout: ONE_MINUTE_MS / 2,
      }
    });
  }

  // noinspection JSUnusedGlobalSymbols
  async onModuleInit(): Promise<void> {
    if (!PrismaService.initialize) {
      PrismaService.initialize = true;
      await this.$connect();
    }
  }

  // noinspection JSUnusedGlobalSymbols
  async onModuleDestroy(): Promise<void> {
    if (PrismaService.initialize) {
      PrismaService.initialize = false;
      await this.$disconnect();
    }
  }
}