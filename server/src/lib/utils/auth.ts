import {PERMISSIONS, PermissionsType} from "@/common";

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
  const permissionSet = new Set(actionPermissions);

  // if owner
  if (permissionSet.has(PERMISSIONS.OWNER_ALL)) return true;

  if (requiredAll) return requiredPermissions.every(p => permissionSet.has(p));

  return requiredPermissions.some(p => permissionSet.has(p));
}