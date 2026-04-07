import {FindOneRoleRes, RoleIncludeType} from "@/types";

export function getSafeRole(role: RoleIncludeType): FindOneRoleRes["role"] {
  return {
    id: role.id,
    name: role.name,
    updated_at: role.updated_at,
    created_at: role.created_at,
    creator_id: role.creator_id,
    description: role.description,
    permissions: role.rolePermissions.map(rp => rp.permission.name)
  };
}