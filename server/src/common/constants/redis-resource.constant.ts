export const RESOURCES = {
  USERS: "users",
  ROLES: "roles",
  PRODUCTS: "products",
  CATEGORIES: "categories",
} as const;

export type Resource = typeof RESOURCES[keyof typeof RESOURCES];