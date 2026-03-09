import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {Strategy, ExtractJwt} from "passport-jwt";
import {PassportStrategy} from "@nestjs/passport";
import type {AccessTokenPayload, UserAccess} from "@/types";

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, "jwt-access") {
  constructor(readonly config: ConfigService) {
    const secretOrKey: string = config.get<string>("JWT_SECRET") ?? "JWT_SECRET";

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: false,
      secretOrKey,
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