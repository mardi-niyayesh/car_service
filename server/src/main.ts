import 'dotenv/config';
import helmet from "helmet";
import Redis from 'ioredis';
import path from "node:path";
import {Logger} from "@nestjs/common";
import {AppModule} from './app.module';
import {NestFactory} from '@nestjs/core';
import cookieParser from "cookie-parser";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {NestExpressApplication} from "@nestjs/platform-express";
import {ResponseInterceptors, ResponseException} from "./common";
import {asyncWrapProviders} from "node:async_hooks";
import {async} from "rxjs";

/** run application */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ["log", "error", "debug", "warn", "verbose", "fatal"],
  });

  // base url
  app.setGlobalPrefix('api/v1');

  // serve static files in public directory
  app.useStaticAssets(path.join(process.cwd(), "public"), {
    prefix: '/static/',
  });

  // global configs
  app.use(helmet());
  app.use(cookieParser());

  // change response structure
  app.useGlobalFilters(new ResponseException());
  app.useGlobalInterceptors(new ResponseInterceptors());

  // Swagger Version 1
  const swaggerConfigV1 = new DocumentBuilder()
    .setTitle("Car Service Api Document | server-side")
    .setDescription("Documentation of Car Service - server side(Back-end) | Zod + Nest.js + Swagger API + TypeScript")
    .setVersion("1.0.0")
    .addBearerAuth({
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT"
    }, "accessToken")
    .addCookieAuth("refreshToken", {
      type: "apiKey",
      in: "cookie",
      name: "refreshToken",
    })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfigV1);

  if (process.env.NODE_ENV !== "test") {
    SwaggerModule.setup("api/v1/docs", app, document, {
      swaggerOptions: {
        withCredentials: true,
        persistAuthorization: true,
      },
      customCssUrl: "/static/styles/swagger.css"
    });
  }

  const logger = new Logger("bootstrap");
  logger.log("Application started.");

  // listen app on default port
  await app.listen(process.env.PORT ?? 3000);
}

// bootstrap and run application
bootstrap()
  .then(() => console.log(`nest successfully started on http://localhost:${process.env.PORT ?? 3000}/api/v1/docs`))
  .catch(e => console.error(e));