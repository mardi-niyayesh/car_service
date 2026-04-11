import {PERMISSIONS} from "@/common";
import {ApiOperationOptions} from "@nestjs/swagger/dist/decorators/api-operation.decorator";

export const categoryFindOneOperation: ApiOperationOptions = {
  summary: 'find one category',
  description: "find one category with id unique. **Access restricted for everyone**",
  operationId: 'get_one_categories',
};

export const categoryFindAllOperation: ApiOperationOptions = {
  summary: 'get all categories',
  description: 'get all categories. **Access restricted for everyone**',
  operationId: 'get_all_categories',
};

export const categoryCreateOperation: ApiOperationOptions = {
  summary: "create a new category",
  description: `
  - **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.CATEGORY_UPDATE}\`\n
  Create a category only roles with permission (owner.all or category.create) can accessibility to this route`
};

export const categoryDeleteOperation: ApiOperationOptions = {
  summary: 'delete a category',
  description: `
  - **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.CATEGORY_DELETE}\`\n    
  delete a category with id nd ownership. **only roles with permission (owner.all or category.delete) can accessibility to this route**`,
  operationId: 'delete_categories',
};

export const categoryUpdateOperation: ApiOperationOptions = {
  summary: 'update a category',
  description: `
  - **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.CATEGORY_UPDATE}\`\n
  
  update a category with id and ownership. **only roles with permission (owner.all or category.update) can accessibility to this route**`,
  operationId: 'update_categories',
};