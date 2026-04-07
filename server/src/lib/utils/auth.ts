import {BaseException} from "@/types";
import {PERMISSIONS, PermissionsType} from "@/common";
import {InternalServerErrorException} from "@nestjs/common";

interface IsAllowedActionParams {
  requiredAll?: boolean;
  actionPermissions: PermissionsType[];
  requiredPermissions: PermissionsType[];
}

export function isAllowedAction(
  {
    actionPermissions,
    requiredPermissions,
    requiredAll = false,
  }: IsAllowedActionParams
): boolean {
  if (!requiredPermissions.length) throw new InternalServerErrorException({
    message: "Required permissions cannot be empty",
    error: "requiredPermissions is empty",
  } as BaseException);

  const permissionSet = new Set(actionPermissions);

  // if owner
  if (permissionSet.has(PERMISSIONS.OWNER_ALL)) return true;

  if (requiredAll) return requiredPermissions.every(p => permissionSet.has(p));

  return requiredPermissions.some(p => permissionSet.has(p));
}