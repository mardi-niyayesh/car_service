import {PERMISSIONS} from "@/common";
import {ApiOperationOptions} from "@nestjs/swagger";

const createCarPermissionsRequired = [
  PERMISSIONS.PRODUCT_UPDATE,
  PERMISSIONS.PRODUCT_CREATE,
];

export const createCarOperation: ApiOperationOptions = {
  operationId: 'create_car',
  summary: "Create a new car with ownership permission",
  description: `
  - 🔐 PERMISSIONS REQUIRED: **any of** \`${createCarPermissionsRequired.join(", ")}\`\n
  Create a category only roles with permission (owner.all or category.create) can accessibility to this route`
};