import {PermissionType} from "@/modules/prisma/generated/enums";

export type PermissionStructure = Record<string, {
  name: string;
  permission_type: PermissionType;
}>;

export const BASE_PERMISSIONS = {
  OWNER_ALL: {
    name: "owner.all",
    permission_type: PermissionType.MANAGER
  },
  USER_SELF: {
    name: "user.self",
    permission_type: PermissionType.CORE
  },
} as const satisfies PermissionStructure;

export const USER_PERMISSIONS = {
  USER_VIEW: {
    name: 'user.view',
    permission_type: PermissionType.MANAGER
  },
  USER_DELETE: {
    name: 'user.delete',
    permission_type: PermissionType.MANAGER
  },
  ROLE_ASSIGN: {
    name: "role.assign",
    permission_type: PermissionType.MANAGER
  },
  ROLE_REVOKE: {
    name: "role.revoke",
    permission_type: PermissionType.MANAGER
  },
} as const satisfies PermissionStructure;

export const ROLE_PERMISSIONS = {
  ROLE_CREATE: {
    name: "role.create",
    permission_type: PermissionType.MANAGER
  },
  ROLE_VIEW: {
    name: 'role.view',
    permission_type: PermissionType.MANAGER
  },
  ROLE_UPDATE: {
    name: 'role.update',
    permission_type: PermissionType.MANAGER
  },
  ROLE_DELETE: {
    name: 'role.delete',
    permission_type: PermissionType.MANAGER
  },
  PERMISSION_VIEW: {
    name: 'permission.view',
    permission_type: PermissionType.MANAGER
  },
} as const satisfies PermissionStructure;

const CATEGORY_PERMISSIONS = {
  CATEGORY_UPDATE: {
    name: 'category.update',
    permission_type: PermissionType.STANDARD
  },
  CATEGORY_DELETE: {
    name: 'category.delete',
    permission_type: PermissionType.STANDARD
  },
  CATEGORY_CREATE: {
    name: "category.create",
    permission_type: PermissionType.STANDARD
  },
} as const satisfies PermissionStructure;

const PRODUCT_PERMISSIONS = {
  PRODUCT_UPDATE: {
    name: 'product.update',
    permission_type: PermissionType.STANDARD
  },
  PRODUCT_DELETE: {
    name: 'product.delete',
    permission_type: PermissionType.STANDARD
  },
  PRODUCT_CREATE: {
    name: "product.create",
    permission_type: PermissionType.STANDARD
  },
} as const satisfies PermissionStructure;

export const RAW_PERMISSIONS_OBJECT = {
  ...BASE_PERMISSIONS,
  ...USER_PERMISSIONS,
  ...ROLE_PERMISSIONS,
  ...CATEGORY_PERMISSIONS,
  ...PRODUCT_PERMISSIONS,
} as const satisfies PermissionStructure;

type ReturnPermissionObject = {
  [K in keyof typeof RAW_PERMISSIONS_OBJECT]: typeof RAW_PERMISSIONS_OBJECT[K]['name'];
};

export const PERMISSIONS = Object.fromEntries(
  Object.entries(RAW_PERMISSIONS_OBJECT)
    .map(([key, value]) => ([key, value.name]))
) as ReturnPermissionObject;

export const permissionsManagerStrict = [
  PERMISSIONS.OWNER_ALL,
  ...Object.values(USER_PERMISSIONS).map(p => p.name),
  ...Object.values(ROLE_PERMISSIONS).map(p => p.name),
];

export const basePermissions = [
  BASE_PERMISSIONS.OWNER_ALL.name,
  BASE_PERMISSIONS.USER_SELF.name,
];

export type PermissionsKeyType = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];