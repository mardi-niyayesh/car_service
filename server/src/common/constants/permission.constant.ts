export const BASE_PERMISSIONS = {
  OWNER_ALL: "owner.all",
  USER_SELF: "user.self",
} as const;

export const USER_PERMISSIONS = {
  USER_VIEW: 'user.view',
  USER_DELETE: 'user.delete',
  ROLE_ASSIGN: "role.assign",
  ROLE_REVOKE: "role.revoke",
} as const;

export const ROLE_PERMISSIONS = {
  ROLE_CREATE: "role.create",
  ROLE_VIEW: 'role.view',
  ROLE_UPDATE: 'role.update',
  ROLE_DELETE: 'role.delete',
  PERMISSION_VIEW: 'permission.view',
} as const;

const CATEGORY_PERMISSIONS = {
  CATEGORY_UPDATE: 'category.update',
  CATEGORY_DELETE: 'category.delete',
  CATEGORY_CREATE: "category.create",
} as const;

const PRODUCT_PERMISSIONS = {
  PRODUCT_UPDATE: 'product.update',
  PRODUCT_DELETE: 'product.delete',
  PRODUCT_CREATE: "product.create",
} as const;

export const PERMISSIONS = {
  ...BASE_PERMISSIONS,
  ...USER_PERMISSIONS,
  ...ROLE_PERMISSIONS,
  ...CATEGORY_PERMISSIONS,
  ...PRODUCT_PERMISSIONS,
} as const;

export const permissionsManagerStrict: string[] = [
  PERMISSIONS.OWNER_ALL,
  ...Object.values(USER_PERMISSIONS),
  ...Object.values(ROLE_PERMISSIONS),
] as const;

export const basePermissions: string[] = Object.values(BASE_PERMISSIONS);

export type PermissionsType = typeof PERMISSIONS[keyof typeof PERMISSIONS];