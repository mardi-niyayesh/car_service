import type {BaseException} from "@/types";
import {ConflictException} from "@nestjs/common";
import {Prisma} from "@/modules/prisma/generated/client";

export function checkConflict(e: Error, resource: string, field: string): never {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === 'P2002') throw new ConflictException({
      message: `${resource} already exists in database, please change ${field}`,
      error: `${resource} already exists`
    } as BaseException);
  }

  throw e;
}