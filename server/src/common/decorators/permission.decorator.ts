import {SetMetadata} from "@nestjs/common";
import {PermissionsType, PrismaModels} from "@/common";

export const PERMISSION_METADATA = "PERMISSIONS";

export interface PermissionDecoratorParams<T extends object = never> {
  owner?: boolean;
  requiredAll?: boolean;
  resource?: PrismaModels;
  permissions: PermissionsType[];
  include?: T extends never ? never : T;
}

export function Permission<T extends object = never>({requiredAll, permissions, owner, resource, include}: PermissionDecoratorParams<T>) {
  return SetMetadata(PERMISSION_METADATA, {requiredAll, permissions, owner, resource, include});
}