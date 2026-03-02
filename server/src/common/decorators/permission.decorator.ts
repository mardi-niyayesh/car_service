import {PermissionsType} from "@/common";
import {SetMetadata} from "@nestjs/common";

export const PERMISSION_METADATA = "PERMISSIONS";

export interface PermissionDecoratorParams {
  requiredAll?: boolean;
  permissions: PermissionsType[];
}

export function Permission({requiredAll = false, permissions}: PermissionDecoratorParams) {
  return SetMetadata(PERMISSION_METADATA, {requiredAll, permissions});
}