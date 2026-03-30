import * as dotenv from "dotenv";

dotenv.config();

import "tsconfig-paths/register";
import {NestFactory} from "@nestjs/core";
import {CliModule} from "@/modules/cli/cli.module";
import {INestApplicationContext} from "@nestjs/common";
import {DefaultArgs} from "@prisma/client/runtime/client";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {PrismaClient} from "@/modules/prisma/generated/client";
import {PERMISSIONS, ROLES, RolesType, PermissionsType} from "@/common";

interface SeedCreateRoleParams {
  app: INestApplicationContext;
  prisma: Omit<PrismaClient<never, undefined, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"> | PrismaService;
  role: RolesType;
  permissions: PermissionsType;
  not?: PermissionsType[];
  advanced?: PermissionsType[];
  description: string;
}

/** create roles */
async function createNewRole(data: SeedCreateRoleParams): Promise<void> {
  const {app, prisma, role, permissions, not, advanced, description} = data;

  if (role === ROLES.OWNER || role === ROLES.SELF) {
    console.log(`Cannot create a new role with name: ${role} in ${createNewRole.name}, Cause this route create in ${bootstrap.name}`);
    await app.close();
    process.exit(1);
  }

  const newRole = await prisma.role.upsert({
    where: {
      name: role,
    },
    update: {},
    create: {
      name: role,
      description
    }
  });

  if (!newRole) {
    console.log(`⚠ Something went wrong in Server! ${role} not created!`);
    await app.close();
    process.exit(1);
  }

  type Exact = { name: PermissionsType }[];
  type Contains = { name: { contains: PermissionsType } }[];

  const NOT: Contains = (not || []).map(n => ({name: {contains: n}}));

  const exactPermissions: Exact = (advanced || []).map(p => ({name: p}));

  const newRolePermissions = await prisma.permission.findMany({
    where: {
      AND: [
        {
          OR: [
            {name: {startsWith: permissions.split(".")[0]}},
            ...exactPermissions
          ]
        },
        ...(NOT.length > 0 ? [{NOT}] : []),
      ]
    }
  });

  if (!newRolePermissions) {
    console.log(`⚠ Something went wrong in Server! permissions for ${role} not created`);
    await app.close();
    process.exit(1);
  }

  if (newRolePermissions.length) {
    await prisma.rolePermission.createMany({
      data: newRolePermissions.map(p => ({
        role_id: newRole.id,
        permission_id: p.id,
      })),
      skipDuplicates: true
    });
  }

  console.log(`✅ Role "${role}" created with ${newRolePermissions.length} permissions`);
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(CliModule);

  const prisma = app.get(PrismaService);

  const permissions = Object.entries(PERMISSIONS)
    .filter(p => p[1] !== PERMISSIONS.USER_SELF && p[1] !== PERMISSIONS.OWNER_ALL)
    .map(p => p[1]);

  try {
    await prisma.$transaction(async tx => {
      for (const p of permissions) {
        await tx.permission.upsert({
          where: {
            name: p
          },
          update: {},
          create: {
            name: p,
            description: `this permission allows ${p.split(".")[1]} on ${p.split(".")[0]}`,
          }
        });
      }

      const selfPermission = await tx.permission.upsert({
        where: {
          name: PERMISSIONS.USER_SELF
        },
        update: {},
        create: {
          name: PERMISSIONS.USER_SELF,
          description: "Basic permission for users to view and update their own personal information"
        }
      });

      const ownerPermission = await tx.permission.upsert({
        where: {
          name: PERMISSIONS.OWNER_ALL
        },
        update: {},
        create: {
          name: PERMISSIONS.OWNER_ALL,
          description: "this permission allows to access all routes"
        }
      });

      const selfRole = await tx.role.upsert({
        where: {
          name: ROLES.SELF
        },
        update: {},
        create: {
          name: ROLES.SELF,
          description: "Basic role for users to view and update their own personal information",
        }
      });

      const ownerRole = await tx.role.upsert({
        where: {
          name: ROLES.OWNER
        },
        update: {},
        create: {
          name: ROLES.OWNER,
          description: "System owner with full access to all resources"
        }
      });

      if (!ownerRole || !selfPermission || !selfRole || !ownerRole) {
        console.log("⚠ Something went wrong in Server! ownerRole or selfPermission or selfRole or userManagerRole not created");
        await app.close();
        process.exit(1);
      }

      await tx.rolePermission.create({
        data: {
          role_id: selfRole.id,
          permission_id: selfPermission.id,
        }
      });

      await tx.rolePermission.create({
        data: {
          role_id: ownerRole.id,
          permission_id: ownerPermission.id
        }
      });

      await createNewRole({
        app,
        prisma: tx,
        role: ROLES.USER_MANAGER,
        permissions: PERMISSIONS.USER_VIEW,
        not: [PERMISSIONS.USER_SELF],
        advanced: [PERMISSIONS.ROLE_ASSIGN, PERMISSIONS.ROLE_REVOKE, PERMISSIONS.PERMISSION_VIEW],
        description: "Full administrative access to manage all users in the system",
      });

      await createNewRole({
        app,
        prisma: tx,
        role: ROLES.ROLE_MANAGER,
        permissions: PERMISSIONS.ROLE_VIEW,
        not: [PERMISSIONS.ROLE_ASSIGN, PERMISSIONS.ROLE_REVOKE],
        advanced: [PERMISSIONS.PERMISSION_VIEW],
        description: "Full administrative access to manage all roles in the system",
      });

      await createNewRole({
        app,
        prisma: tx,
        role: ROLES.CATEGORY_MANAGER,
        permissions: PERMISSIONS.CATEGORY_CREATE,
        description: "Full administrative access to manage all categories in the system",
      });

      await createNewRole({
        app,
        prisma: tx,
        role: ROLES.PRODUCT_MANAGER,
        permissions: PERMISSIONS.PRODUCT_CREATE,
        description: "Full administrative access to manage all products in the system",
      });

      console.log("✅ Seed completed: Default roles and permission have been created successfully.");
    });
  } catch (e) {
    console.error(e);
    await app.close();
    process.exit(1);
  } finally {
    await app.close();
    process.exit(0);
  }
}

bootstrap()
  .then(() => console.log("running roles script"))
  .catch(e => console.error(e));