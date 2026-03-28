import {UserModule} from "../user";
import {EmailModule} from "../email";
import {JwtModule} from "@nestjs/jwt";
import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {PassportModule} from "@nestjs/passport";
import {AuthController} from './auth.controller';
import {AccessStrategy} from "./strategy/access.strategy";

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({}),
    EmailModule
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessStrategy],
})
export class AuthModule {}