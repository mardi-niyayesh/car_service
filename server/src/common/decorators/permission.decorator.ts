import {SetMetadata} from "@nestjs/common";
import {PermissionsType, Resource} from "@/common";

export const PERMISSION_METADATA = "PERMISSIONS";

export interface PermissionDecoratorParams {
  requiredAll?: boolean;
  permissions: PermissionsType[];
  owner?: boolean;
  resource?: Resource;
}

export function Permission({requiredAll, permissions, owner, resource}: PermissionDecoratorParams) {
  return SetMetadata(PERMISSION_METADATA, {requiredAll, permissions, owner, resource});
}