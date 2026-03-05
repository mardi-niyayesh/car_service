const OWNER = {
  OWNER_ALL: "owner.all",
} as const;

const USER = {
  USER_SELF: "user.self",
  USER_VIEW: 'user.view',
  USER_DELETE: 'user.delete',
  ROLE_ASSIGN: "role.assign",
  ROLE_REVOKE: "role.revoke",
} as const;

const ROLE = {
  ROLE_CREATE: "role.create",
  ROLE_VIEW: 'role.view',
  ROLE_UPDATE: 'role.update',
  ROLE_DELETE: 'role.delete',
} as const;

const CATEGORY = {
  CATEGORY_UPDATE: 'category.update',
  CATEGORY_DELETE: 'category.delete',
  CATEGORY_CREATE: "category.create",
} as const;

const PRODUCT = {
  PRODUCT_UPDATE: 'product.update',
  PRODUCT_DELETE: 'product.delete',
  PRODUCT_CREATE: "product.create",
} as const;

export const PERMISSIONS = {
  ...OWNER,
  ...USER,
  ...ROLE,
  ...CATEGORY,
  ...PRODUCT,
} as const;

export type PermissionsType = typeof PERMISSIONS[keyof typeof PERMISSIONS];