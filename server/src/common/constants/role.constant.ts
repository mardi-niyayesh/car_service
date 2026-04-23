export const ROLES = {
  OWNER: "owner",
  SELF: "self",
  USER_MANAGER: "user_manager",
  ROLE_MANAGER: "role_manager",
  CATEGORY_MANAGER: "category_manager",
  PRODUCT_MANAGER: "product_manager",
} as const;

export type RolesType = typeof ROLES[keyof typeof ROLES];