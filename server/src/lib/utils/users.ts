import {UserFullType, UserResponse} from "@/types";

/** get users info and receive */
export function getSafeUser(user: UserFullType): UserResponse {
  const roles = user.userRoles.map(r => r.role.name);

  const rolePermissions = user.userRoles.map(r => r.role.rolePermissions);

  const permissions = [...new Set(
    rolePermissions.map(rp => rp
      .map(p => p.permission.name)
    ).flat()
  )];

  return {
    user: {
      updated_at: user.updated_at,
      created_at: user.created_at,
      age: user.age,
      id: user.id,
      email: user.email,
      display_name: user.display_name,
      roles,
      permissions
    }
  };
}