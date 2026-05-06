import * as dotenv from "dotenv";

dotenv.config();

import "tsconfig-paths/register";
import {NestFactory} from "@nestjs/core";
import {CliModule} from "@/modules/cli/cli.module";
import {INestApplicationContext} from "@nestjs/common";
import {User} from "@/modules/prisma/generated/client";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {hashSecret} from "@/lib";
import {ROLES} from "@/common";

type CreateUser = Omit<User, 'id' | 'created_at' | 'updated_at'>;

const usersName: {
  display_name: string;
  age: number;
}[] = [
  {display_name: "homow", age: 25},
  {display_name: "reza", age: 32},
  {display_name: "ali", age: 19},
  {display_name: "sara", age: 24},
  {display_name: "mozhdeh", age: 28},
  {display_name: "yas", age: 22},
  {display_name: "fati", age: 21},
  {display_name: "roza", age: 27},
  {display_name: "deepseek", age: 26},
  {display_name: "copilot", age: 30},
  {display_name: "gemeni", age: 29},
  {display_name: "grok", age: 23},
  {display_name: "claude", age: 31},
  {display_name: "openai", age: 33},
  {display_name: "microsoft", age: 45},
  {display_name: "google", age: 42},
];

async function bootstrap(): Promise<void> {
  const app: INestApplicationContext = await NestFactory.createApplicationContext(CliModule);

  const prisma: PrismaService = app.get(PrismaService);

  const password: string = await hashSecret("123qwe");

  const users: CreateUser[] = usersName.map(({display_name, age}) => ({
    age,
    password,
    display_name,
    email: display_name + "@example.com",
  }));

  const selfRole = await prisma.role.findUnique({
    where: {
      name: ROLES.SELF
    }
  });

  if (!selfRole) {
    console.error("❌ Role 'self' not found. Run seed-roles.ts first.");
    await app.close();
    process.exit(1);
  }

  const users_id = await prisma.user.createManyAndReturn({
    data: users,
    skipDuplicates: true,
    select: {
      id: true
    }
  });

  await prisma.userRole.createMany({
    data: users_id.map(({id}) => ({
      user_id: id,
      role_id: selfRole.id
    })),
    skipDuplicates: true,
  });

  console.log(`✅ ${users_id.length} users seeded with 'self' role.`);
  await app.close();
  process.exit(0);
}

bootstrap()
  .then(() => console.log("running roles script"))
  .catch(e => console.error(e));