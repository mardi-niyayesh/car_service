import {ListWithCount} from "@/types/response.types";
import {Permission} from "@/modules/prisma/generated/client";

export type FindOnePermission = { permission: Permission };
export type PermissionsResponse = ListWithCount<{ permissions: Permission[] }>;