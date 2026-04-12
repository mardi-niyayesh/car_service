import z from "zod";
import {SetMetadata} from "@nestjs/common";
import {PermissionsType, PrismaModels} from "@/common";

export const PERMISSION_METADATA = "PERMISSIONS";

export interface PermissionDecoratorParams<T extends Record<string, unknown> = never, U extends z.ZodTypeAny = never> {
  owner?: boolean;
  requiredAll?: boolean;
  resource?: PrismaModels;
  permissions: PermissionsType[];
  include?: T extends never ? never : T;
  validatorParam?: U;
}

export function Permission<T extends Record<string, unknown> = never, U extends z.ZodTypeAny = never>(
  {
    requiredAll,
    permissions,
    owner,
    resource,
    include,
    validatorParam,
  }: PermissionDecoratorParams<T, U>
) {
  return SetMetadata(PERMISSION_METADATA, {requiredAll, permissions, owner, resource, include, validatorParam});
}