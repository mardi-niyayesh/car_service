import {Module} from '@nestjs/common';
import {UsersService} from './users.service';
import {UsersController} from './users.controller';
import {CacheService} from "../cache/cache.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService, CacheService],
  exports: [UsersService],
})
export class UsersModule {}