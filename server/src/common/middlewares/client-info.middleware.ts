import geoip from "geoip-lite";
import {UAParser} from "ua-parser-js";
import {Injectable, NestMiddleware} from "@nestjs/common";
import type {NextFunction, Request, Response} from "express";

@Injectable()
export class ClientInfoMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const rawIp =
      req.headers["x-forwarded-for"] ||
      req.headers["cf-connection-ip"] ||
      req.ip ||
      req.socket.remoteAddress ||
      null;

    const ip = Array.isArray(rawIp) ? rawIp[0] : rawIp;

    const userAgent: string = req.headers["user-agent"] ?? "";
    const parser = new UAParser(userAgent);
    const ua = parser.getResult();

    const geo = typeof ip === "string" ? geoip.lookup(ip) : null;

    req.clientInfo = {
      ip,
      ua,
      geo,
      lang: req.headers["accept-language"] ?? null,
    };

    return next();
  }
}
