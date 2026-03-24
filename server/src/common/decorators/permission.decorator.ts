import {SetMetadata} from "@nestjs/common";
import {PermissionsType, PrismaModels} from "@/common";

export const PERMISSION_METADATA = "PERMISSIONS";

export interface PermissionDecoratorParams {
  requiredAll?: boolean;
  permissions: PermissionsType[];
  owner?: boolean;
  resource?: PrismaModels;
}

export function Permission({requiredAll, permissions, owner, resource}: PermissionDecoratorParams) {
  return SetMetadata(PERMISSION_METADATA, {requiredAll, permissions, owner, resource});
}