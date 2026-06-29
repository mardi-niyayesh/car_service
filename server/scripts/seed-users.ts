import * as dotenv from "dotenv";

dotenv.config();

import "tsconfig-paths/register";
import {ROLES} from "@/common";
import {hashSecret} from "@/lib";
import {NestFactory} from "@nestjs/core";
import {CliModule} from "@/modules/cli/cli.module";
import {INestApplicationContext} from "@nestjs/common";
import {User} from "@/modules/prisma/generated/client";
import {PrismaService} from "@/modules/prisma/prisma.service";

type CreateUser = Omit<User, 'id' | 'created_at' | 'updated_at'>;

const usersData: Pick<User, 'display_name' | 'age'>[] = [
  {display_name: "homow", age: 25},
  {display_name: "reza", age: 32},
  {display_name: "ali", age: 19},
  {display_name: "sara", age: 24},
  {display_name: "hoda", age: 20},
  {display_name: "mahsa", age: 22},
  {display_name: "sasan", age: 30},
  {display_name: "mahtab", age: 21},
  {display_name: "amir", age: 20},
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
  {display_name: "nvidia", age: 42},
  {display_name: "aws", age: 42},
];

async function bootstrap(): Promise<void> {
  const app: INestApplicationContext = await NestFactory.createApplicationContext(CliModule);

  const prisma: PrismaService = app.get(PrismaService);

  const rawPassword = "123qwe".trim();
  const password: string = await hashSecret(rawPassword);

  const users: CreateUser[] = usersData.map(({display_name, age}) => ({
    age,
    password,
    display_name,
    email: display_name + "@example.com",
  }));

  await prisma.$transaction(async (tx) => {
    const selfRole = await tx.role.findUnique({
      where: {
        name: ROLES.SELF
      }
    });

    if (!selfRole) {
      console.error("❌ Role 'self' not found in database.");
      console.error("👉 Please run: npm run seed:roles");
      console.error("👉 Then run this script again.");
      await app.close();
      process.exit(1);
    }

    await tx.user.createMany({
      data: users,
      skipDuplicates: true
    });

    const users_id = await tx.user.findMany({
      where: {
        email: {
          in: users.map(u => u.email)
        }
      },
    });

    console.log(users_id);

    await tx.userRole.createMany({
      data: users_id.map(({id}) => ({
        user_id: id,
        role_id: selfRole.id
      })),
      skipDuplicates: true,
    });

    await tx.cart.createMany({
      skipDuplicates: true,
      data: users_id.map(u => ({
        user_id: u.id,
      }))
    });

    console.log(`✅ ${users_id.length} users seeded with 'self' role.`);
    console.log("all users password is: ", rawPassword);
    await app.close();
    process.exit(0);
  });
}

bootstrap()
  .then(() => console.log("running roles script"))
  .catch(e => console.error(e));
