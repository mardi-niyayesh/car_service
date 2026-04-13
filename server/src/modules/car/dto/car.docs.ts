import {ApiOperationOptions} from "@nestjs/swagger";
import {ONE_MB_OF_BYTE, PERMISSIONS} from "@/common";
import {allowedFileType, maxFileSize} from "@/modules/car/configs";

const imageCarPermissionsRequired = [
  PERMISSIONS.PRODUCT_UPDATE,
  PERMISSIONS.PRODUCT_CREATE,
];

export const createCarOperation: ApiOperationOptions = {
  operationId: 'create_car',
  summary: "Create a new car with ownership permission",
  description: `
  - **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.PRODUCT_CREATE}\`\n
  Create a Car only roles with permission (owner.all or product.create) can accessibility to this route`
};

export const uploadCarImageOperation: ApiOperationOptions = {
  operationId: 'upload_car_image',
  summary: "Upload a car image with ownership permission",
  description: `
  - 🔐 PERMISSIONS REQUIRED: **any of** \`${imageCarPermissionsRequired.join(", ")}\`\n
  Create a category only roles with permission (owner.all or product.create or product.update) can accessibility to this route
  
  - # File Type Allowed: ${allowedFileType.source.split("|").join(", ")}
  - # Max File Size: ${maxFileSize / ONE_MB_OF_BYTE} MB`
};