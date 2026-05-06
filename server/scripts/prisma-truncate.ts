import * as dotenv from "dotenv";

dotenv.config();

import "tsconfig-paths/register";
import {NestFactory} from "@nestjs/core";
import {CliModule} from "@/modules/cli/cli.module";
import {INestApplicationContext} from "@nestjs/common";
import {PrismaService} from "@/modules/prisma/prisma.service";

async function bootstrap(): Promise<void> {
  const app: INestApplicationContext = await NestFactory.createApplicationContext(CliModule);

  const prisma: PrismaService = app.get(PrismaService);

  try {
    console.log("🔄 Connecting to Prisma and Running TRUNCATE script...");

    await prisma.$executeRawUnsafe(
      `
    DO $$ DECLARE
        r RECORD;
    BEGIN
        -- Disable triggers
        SET session_replication_role = replica;
    
        -- Truncate all tables in public schema
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
            EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
    
        -- Re-enable triggers
        SET session_replication_role = origin;
    END $$;`);

    console.log("✅ TRUNCATE completed successfully!");

  } catch (error) {
    console.error("❌ Error during TRUNCATE:", error);
    process.exit(1);
  } finally {
    await app.close();
    process.exit(0);
  }
}

bootstrap()
  .then(() => console.log("running roles script"))
  .catch(e => console.error(e));