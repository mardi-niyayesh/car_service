import {FindOneRoleRes, RoleIncludeType} from "@/types";

export function getSafeRole(role: RoleIncludeType): FindOneRoleRes["role"] {
  return {
    id: role.id,
    name: role.name,
    updated_at: role.updated_at,
    created_at: role.created_at,
    creator_id: role.creator_id,
    description: role.description,
    role_type: role.role_type,
    permissions: role.rolePermissions.map(rp => ({
      id: rp.permission_id,
      name: rp.permission.name,
      permission_type: rp.permission.permission_type,
      updated_at: rp.permission.updated_at,
      created_at: rp.permission.created_at,
      description: rp.permission.description,
    }))
  };
}