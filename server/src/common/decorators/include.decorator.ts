import {SetMetadata} from "@nestjs/common";
import {Prisma} from "@/modules/prisma/generated/client";

export const INCLUDE_MODEL_KEY = 'INCLUDE_MODEL_KEY';

type IncludeModelsType = {
  CarInclude: Prisma.CarInclude;
  RoleInclude: Prisma.RoleInclude;
  UserInclude: Prisma.UserInclude;
  CarRentInclude: Prisma.CarRentInclude;
  CategoryInclude: Prisma.CategoryInclude;
  PermissionInclude: Prisma.PermissionInclude;
  RefreshTokenInclude: Prisma.RefreshTokenInclude;
  PasswordTokenInclude: Prisma.PasswordTokenInclude;
};

type IncludeDecoratorParam<T extends keyof IncludeModelsType> = IncludeModelsType[T];

export function IncludeDecorator<T extends keyof IncludeModelsType>(include: IncludeDecoratorParam<T>) {
  return SetMetadata(INCLUDE_MODEL_KEY, include);
}