import * as dotenv from "dotenv";

dotenv.config();

import {ROLES} from "@/common";
import "tsconfig-paths/register";
import {formatZodError, hashSecret} from "@/lib";
import {NestFactory} from "@nestjs/core";
import {CliModule} from "@/modules/cli/cli.module";
import * as readline from "node:readline/promises";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {BaseUserSchema, BaseUserSchemaType} from "@/modules/user/dto/validators.dto";

async function ask<T extends keyof typeof BaseUserSchema.shape>(
  rl: readline.Interface,
  q: string,
  field: T,
): Promise<string> {
  while (true) {
    const answer: string = await rl.question(q);

    const validate = BaseUserSchema.shape[field].safeParse(answer);

    if (!validate.success) {
      console.log(`the ${field} not valid.`, validate.error.issues[0].message);
      continue;
    }

    return answer;
  }
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(CliModule);

  const prisma: PrismaService = app.get(PrismaService);

  try {
    await prisma.$transaction(async tx => {
      const ownerRole = await tx.role.findUnique({
        where: {name: ROLES.OWNER}
      });

      const selfRole = await tx.role.findUnique({
        where: {name: ROLES.SELF}
      });

      if (!ownerRole || !selfRole) {
        console.log("⚠ 'owner' or 'self' role not exists in database!");
        await app.close();
        process.exit(1);
      }

      const exist = await tx.userRole.findFirst({
        where: {role_id: ownerRole.id},
        include: {
          user: {
            omit: {password: true}
          }
        }
      });

      if (exist) {
        console.log("Owner already exists");
        console.log(exist.user);
        await app.close();
        process.exit(0);
      }

      console.log(`creating owner...`);

      let display_name = process.env.OWNER_NAME;
      let email = process.env.OWNER_EMAIL;
      let password = process.env.OWNER_PASSWORD;

      if (password && email) {
        const ownerData: BaseUserSchemaType = {
          email,
          password,
          display_name,
        };

        const validate = BaseUserSchema.safeParse(ownerData);

        if (!validate.success) {
          console.log(formatZodError(validate.error));
          console.log("Invalid Data!!");
          await app.close();
          process.exit(1);
        }
      }

      if (!email || !password) {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        display_name = await ask(rl, "enter name: ", "display_name");
        email = await ask(rl, "enter email: ", "email");
        password = await ask(rl, "enter password: ", "password");
      }

      const hashedPassword: string = await hashSecret(password);

      const owner = await tx.user.upsert({
        create: {
          email,
          password: hashedPassword,
          display_name: display_name || "owner",
        },
        where: {
          email
        },
        update: {
          display_name,
          password: hashedPassword,
        }
      });

      await tx.userRole.createMany({
        data: [
          {role_id: ownerRole.id, user_id: owner.id},
          {role_id: selfRole.id, user_id: owner.id},
        ],
        skipDuplicates: true
      });

      await tx.cart.upsert({
        create: {
          user_id: owner.id,
        },
        where: {
          user_id: owner.id,
        },
        update: {}
      });

      console.log(`✅ owner created:\nemail: ${owner.email}\nid: ${owner.id}\nrole: ${ownerRole.name}`);
    });
  } catch (e) {
    console.log(e);
    await app.close();
    process.exit(1);
  } finally {
    await app.close();
    process.exit(0);
  }
}

bootstrap()
  .then(() => console.log("running owner script..."))
  .catch(e => console.error(e));