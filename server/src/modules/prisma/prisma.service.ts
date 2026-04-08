import {PrismaPg} from '@prisma/adapter-pg';
import {ConfigService} from "@nestjs/config";
import {ONE_MINUTE_MS} from '@/lib/utils/date';
import {PrismaClient} from './generated/client';
import {Injectable, OnModuleInit, OnModuleDestroy} from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

  private static initialize: boolean = false;

  constructor(readonly config: ConfigService) {
    const connectionString: string = config.get<string>("DATABASE_URL") ?? "";

    const adapter: PrismaPg = new PrismaPg({
      connectionString,
    });
    super({
      adapter,
      errorFormat: 'minimal',
      log: ['info', 'error', 'warn'],
      transactionOptions: {
        timeout: ONE_MINUTE_MS,
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