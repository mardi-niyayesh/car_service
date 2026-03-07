import "dotenv/config";
import {defineConfig, env} from "prisma/config";

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    // seed: "npm run db:setup",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});