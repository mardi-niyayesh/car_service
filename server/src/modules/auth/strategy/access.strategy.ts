import {Injectable} from "@nestjs/common";
import {Strategy, ExtractJwt} from "passport-jwt";
import {PassportStrategy} from "@nestjs/passport";
import type {AccessTokenPayload, UserAccess} from "@/types";

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, "jwt-access") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  validate(payload: AccessTokenPayload): UserAccess {
    return {
      userId: payload.sub,
      permissions: payload.permissions,
      roles: payload.roles,
      exp: payload.exp,
      iat: payload.iat,
      jti: payload.jti,
      display_name: payload.display_name ?? "",
    };
  }
}