import {ApiOperationOptions} from "@nestjs/swagger";
import {ONE_MB_OF_BYTE, PERMISSIONS} from "@/common";
import {maxFileSize, allowedFileTypeSplit} from "../configs";

export const findOneCarOperation: ApiOperationOptions = {
  summary: "Find one car by slug",
  operationId: "find_one_car",
  description: `
  - ## Accessible to all users (public endpoint)
  - ## Returns detailed information about a car identified by its unique slug.`
};

export const findAllCarOperation: ApiOperationOptions = {
  summary: "Find list of cars with pagination",
  operationId: "find_all_cars",
  description: `
  - ## Accessible to all users (public endpoint)
  - ## Returns detailed information about a car identified by its unique slug.`
};

export const imageCarPermissionsRequired = [
  PERMISSIONS.PRODUCT_UPDATE,
  PERMISSIONS.PRODUCT_CREATE,
];

export const createCarOperation: ApiOperationOptions = {
  operationId: 'create_car',
  summary: "Create a new car with ownership permission",
  description: `
  - # **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.PRODUCT_CREATE}\`\n
  Create a Car only roles with permission (owner.all or product.create) can accessibility to this route`
};

export const uploadCarImageOperation: ApiOperationOptions = {
  operationId: 'upload_car_image',
  summary: "Upload a car image with ownership permission",
  description: `
  - # 🔐 PERMISSIONS REQUIRED: **any of** \`${imageCarPermissionsRequired.join(", ")}\`\n
  Create a category only roles with permission (owner.all or product.create or product.update) can accessibility to this route
  
  - ## File Type Allowed: ${allowedFileTypeSplit}
  - ## Max File Size: ${maxFileSize / ONE_MB_OF_BYTE} MB`
};