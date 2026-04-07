import {ConfigModule} from "@nestjs/config";
import {Global, Module} from '@nestjs/common';
import {PrismaService} from './prisma.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}