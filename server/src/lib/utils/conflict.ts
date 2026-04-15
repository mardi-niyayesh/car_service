import type {BaseException} from "@/types";
import {Prisma} from "@/modules/prisma/generated/client";
import {ConflictException, NotFoundException} from "@nestjs/common";

interface CheckPrismaConflictParams {
  e: Error;
  mainResource: string;
  conflictField: string;
  notFoundField?: string;
  notFoundResource?: string;
}

export function checkPrismaConflict(data: CheckPrismaConflictParams): never {
  const {conflictField, notFoundField, notFoundResource, mainResource, e} = data;

  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === 'P2002') throw new ConflictException({
      message: `${mainResource} already exists in database, please change ${conflictField}`,
      error: `${mainResource} already exists`
    } as BaseException);

    if (e.code === 'P2003') throw new NotFoundException({
      message: `${notFoundResource} not exist exists in database, please change ${notFoundField}`,
      error: `${notFoundResource} not exists`
    } as BaseException);
  }

  throw e;
}

/** check conflict in object data
 * @record<string, unknown>
 *   */
export function checkConflictRecord(newData: Record<string, unknown>, recordData: Record<string, unknown>) {
  const conflictData: string[] = [];

  for (const d in newData) {
    if (newData[d] === recordData[d]) {
      conflictData.push(d);
    }
  }

  return {
    conflictData,
    hasConflict: !!conflictData.length,
  };
}