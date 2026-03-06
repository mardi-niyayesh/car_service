import {UserRoleIncludeType, UserResponse, RoleIncludeType} from "@/types";

export function getSafeRoles(allRoles: RoleIncludeType[]) {
  const roles: string[] = allRoles.map(r => r.name);

  const rolePermissions = allRoles.map(r => r.rolePermissions);

  const permissions: string[] = [...new Set(
    rolePermissions.map(rp => rp
      .map(p => p.permission.name)
    ).flat()
  )];

  return {
    roles,
    permissions,
  };
}

/** get users info and receive */
export function getSafeUser(user: UserRoleIncludeType): UserResponse {
  const allRoles = user.userRoles.map(r => r.role);
  const roleAndPermissions = getSafeRoles(allRoles);

  return {
    user: {
      updated_at: user.updated_at,
      created_at: user.created_at,
      age: user.age,
      id: user.id,
      email: user.email,
      display_name: user.display_name,
      ...roleAndPermissions
    }
  };
}