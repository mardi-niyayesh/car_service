import 'dotenv/config';
import helmet from "helmet";
import path from "node:path";
import {getPath} from "@/lib";
import {AppModule} from './app.module';
import {NestFactory} from '@nestjs/core';
import cookieParser from "cookie-parser";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {NestExpressApplication} from "@nestjs/platform-express";
import {ResponseInterceptors, ResponseException, UPLOAD_PATH, UPLOAD_PATH_PREFIX} from "./common";

const HOST: string = process.env.HOST || '0.0.0.0';
const BASE_URL: string = process.env.BASE_URL ?? "api/v1";
const PORT: number = parseInt(process.env.PORT ?? '3000', 10);

/** run application */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ["log", "error", "debug", "warn", "verbose", "fatal"],
  });

  // base url
  app.setGlobalPrefix(BASE_URL);

  // serve static files in public directory
  app.useStaticAssets(path.join(process.cwd(), "public"), {
    prefix: '/static/',
  });

  // serve uploads files in public directory
  app.useStaticAssets(getPath(UPLOAD_PATH), {
    prefix: UPLOAD_PATH_PREFIX,
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
    .setDescription("Documentation of Car Service - server side(Back-end) | PostgreSQL + Zod + Nest.js + Swagger API + TypeScript")
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
    SwaggerModule.setup(`${BASE_URL}/docs`, app, document, {
      swaggerOptions: {
        withCredentials: true,
        persistAuthorization: true,
        defaultModelsExpandDepth: -1,
      },
      customCssUrl: "/static/styles/swagger.css"
    });
  }

  // listen app on default port
  await app.listen(PORT, HOST);
}

const colors = {
  green: '\x1b[32m',
  blue: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  underline: '\x1b[4m',
};

// bootstrap and run application
bootstrap()
  .then(() => {
    const baseUrl = `http://localhost:${PORT}/${BASE_URL}`;

    console.log(`
${colors.bold}${colors.cyan}╔════════════════════════════════════════════════════════════════╗${colors.reset}
${colors.bold}${colors.cyan}║${colors.reset}  ${colors.bold}${colors.green}✨ NESTJS APPLICATION STARTED SUCCESSFULLY ✨${colors.reset}      ${colors.bold}${colors.cyan}║${colors.reset}
${colors.bold}${colors.cyan}╚════════════════════════════════════════════════════════════════╝${colors.reset}

${colors.dim}${colors.gray}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}

${colors.bold}${colors.white}📊 SYSTEM INFO${colors.reset}
${colors.dim}${colors.gray}────────────────────────────────────────────────────────────────${colors.reset}

${colors.cyan}●${colors.reset} ${colors.bold}Environment${colors.reset}         ${colors.green}${process.env.NODE_ENV || 'development'}${colors.reset}
${colors.cyan}●${colors.reset} ${colors.bold}Process ID${colors.reset}           ${colors.yellow}${process.pid}${colors.reset}
${colors.cyan}●${colors.reset} ${colors.bold}Node Version${colors.reset}         ${colors.magenta}${process.version}${colors.reset}
${colors.cyan}●${colors.reset} ${colors.bold}Platform${colors.reset}             ${colors.blue}${process.platform}${colors.reset}
${colors.cyan}●${colors.reset} ${colors.bold}Started At${colors.reset}           ${colors.gray}${new Date().toLocaleString()}${colors.reset}

${colors.dim}${colors.gray}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}

${colors.bold}${colors.green}✅ All endpoints are ready to serve${colors.reset}

${colors.bold}${colors.white}📍 ENDPOINTS${colors.reset}
${colors.dim}${colors.gray}────────────────────────────────────────────────────────────────${colors.reset}

${colors.green}●${colors.reset} ${colors.bold}Server Address${colors.reset}     ${colors.cyan}${colors.underline}http://localhost:${PORT}${colors.reset}
${colors.blue}●${colors.reset} ${colors.bold}API Base Path${colors.reset}      ${colors.blue}${colors.underline}${baseUrl}${colors.reset}
${colors.yellow}●${colors.reset} ${colors.bold}Swagger JSON${colors.reset}       ${colors.yellow}${colors.underline}${baseUrl}/docs-json${colors.reset}
${colors.red}●${colors.reset} ${colors.bold}Swagger YAML${colors.reset}       ${colors.red}${colors.underline}${baseUrl}/docs-yaml${colors.reset}
${colors.magenta}●${colors.reset} ${colors.bold}Swagger UI${colors.reset}         ${colors.magenta}${colors.underline}${baseUrl}/docs${colors.reset}

${colors.dim}${colors.gray}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}

${colors.dim}${colors.gray}💡 Press Ctrl+C to shut down the server${colors.reset}

`);
  })
  .catch(e => console.error(`
${colors.bold}${colors.red}╔════════════════════════════════════════════════════════════════╗${colors.reset}
${colors.bold}${colors.red}║${colors.reset}  ${colors.bold}${colors.red}❌ FAILED TO START NESTJS APPLICATION ❌${colors.reset}        ${colors.bold}${colors.red}║${colors.reset}
${colors.bold}${colors.red}╚════════════════════════════════════════════════════════════════╝${colors.reset}

${colors.bold}${colors.red}Error Details:${colors.reset}
${colors.dim}${colors.gray}────────────────────────────────────────────────────────────────${colors.reset}

${colors.red}●${colors.reset} ${colors.bold}Message:${colors.reset} ${colors.white}${e}${colors.reset}

${colors.dim}${colors.gray}────────────────────────────────────────────────────────────────${colors.reset}
`));
