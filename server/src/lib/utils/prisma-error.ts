import type {BaseException} from "@/types";
import {Prisma} from "@/modules/prisma/generated/client";
import {BadRequestException, ConflictException, NotFoundException} from "@nestjs/common";

interface CheckPrismaErrorParams {
  e: Error;
  mainResource: string;
  conflictField: string;
  notFoundField?: string;
  notFoundResource?: string;
  restrictResource?: string;
  restrictForeignKey?: string;
}

export function checkPrismaError(data: CheckPrismaErrorParams): never {
  const {restrictForeignKey, restrictResource, conflictField, notFoundField, notFoundResource, mainResource, e} = data;

  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    switch (e.code) {
      case 'P2002': {
        throw new ConflictException({
          message: `${mainResource} already exists in database, please change ${conflictField}`,
          error: `${mainResource} already exists`
        } as BaseException);
      }

      case 'P2003': {
        if (restrictForeignKey && restrictResource) {
          throw new BadRequestException({
            message: `Cannot delete ${mainResource} because it has related ${restrictResource}(s). Please remove ${restrictForeignKey} first.`,
            error: `Foreign key constraint failed on ${restrictForeignKey}`
          } as BaseException);
        }

        throw new NotFoundException({
          message: `${notFoundResource || mainResource} not found or has related records, please check ${notFoundField || 'id'}`,
          error: `${notFoundResource || mainResource} not found or has dependencies`
        } as BaseException);
      }

      case 'P2025': {
        throw new NotFoundException({
          message: `${notFoundResource || mainResource} not found in database, please check ${notFoundField || 'id'}`,
          error: `${notFoundResource || mainResource} not found`
        } as BaseException);
      }
    }
  }

  throw e;
}

/** check conflict in object data
 * @record<string, unknown>
 *   */
export function checkConflictRecord(newData: Record<string, unknown>, recordData: Record<string, unknown>) {
  const conflictData: string[] = [];

  for (const d in newData) {
    if (JSON.stringify(newData[d]) === JSON.stringify(recordData[d])) {
      conflictData.push(d);
    }
  }

  return {
    conflictData,
    hasConflict: !!conflictData.length,
  };
}
