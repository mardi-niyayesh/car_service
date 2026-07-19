import * as dotenv from "dotenv";

dotenv.config();

import {INestApplicationContext} from "@nestjs/common";
import {NestFactory} from "@nestjs/core";
import {CliModule} from "@/modules";
import {PrismaService} from "@/modules/prisma/prisma.service";


async function main(): Promise<void> {
  const app: INestApplicationContext = await NestFactory.createApplicationContext(CliModule);
  const prisma: PrismaService = app.get(PrismaService);
}
