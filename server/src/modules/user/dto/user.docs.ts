import {PERMISSIONS} from "@/common";
import {ApiOperationOptions} from "@nestjs/swagger/dist/decorators/api-operation.decorator";

export const userGetProfileOperation: ApiOperationOptions = {
  summary: 'get user info by self',
  description: `
  - # **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.USER_SELF}\`\n
  get user info accessToken. **Access restricted to users with permission: (user.self) only.**`,
  operationId: 'get_profile'
};

export const userUpdateProfileOperation: ApiOperationOptions = {
  summary: 'update user info by self',
  description: `
  - # **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.USER_SELF}\`\n
  
  update user info accessToken. **Access restricted to users with permission: (user.self) only.**`,
  operationId: 'update_profile'
};

export const userUpdatePasswordOperation: ApiOperationOptions = {
  summary: 'update password',
  description: `
  - # **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.USER_SELF}\`\n
  
  update password with accessToken. **Access restricted to users with permission: (user.self) only.**`,
  operationId: 'update_password'
};

export const userFindOneOperation: ApiOperationOptions = {
  summary: 'get user info',
  description: `
  - # **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.USER_VIEW}\`\n
  
  get user info with id or email. **Access restricted to users with permission: (owner.all or user.view) only.**`,
  operationId: 'get_user'
};

export const userFindAllOperation: ApiOperationOptions = {
  summary: 'get all user info',
  description: `
  - # **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.USER_VIEW}\`\n
  
  get all users info. **Access restricted to users with permission: (owner.all or user.view) only.**`,
  operationId: 'get_users'
};

export const userRoleAssignOperation: ApiOperationOptions = {
  summary: 'Assign roles to a user',
  description: `
  - # **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.ROLE_ASSIGN}\`\n
  
  Assigns one or more roles to a target user with strict validation rules:

  - **Self-assignment is forbidden** (a user cannot assign roles to themselves).
  - **Restricted roles** ("owner", "self") cannot be assigned under any circumstances.
  - **Duplicate prevention**: roles already held by the user cannot be reassigned.
  - **Management-level protection**: assigning or modifying critical management roles 
  ("role_manager", "user_manager") is exclusively reserved for the "owner". 
  Other managers cannot grant these specific privileges to prevent peer-level 
  escalation, though they may assign other authorized management roles.
  - All roles must exist; invalid role IDs will result in a 404 error.
  - **Access control**: This endpoint is only accessible to users who have the 
    **"role.assign"** or **"owner.all"** permission in their permissions list.

  This endpoint ensures role integrity, prevents privilege escalation, 
  and enforces organizational security policies.`,
  operationId: 'assign_role'
};

export const userRoleRevokeOperation: ApiOperationOptions = {
  summary: 'Revoke roles from a user',
  description: `
  - # **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.ROLE_REVOKE}\`\n
  
  Removes one or more roles from a target user with strict security enforcement:
  
  - **Self-revocation is forbidden**: Users cannot remove their own roles to prevent 
    accidental lockout or "account suicide."
  - **Restricted roles protection**: The "owner" and "self" roles cannot be revoked 
    via this endpoint to maintain system stability and root-level access.
  - **Existence validation**: Only roles currently held by the user can be revoked; 
    attempting to remove a role the user doesn't have will be ignored or flagged.
  - **Management-level protection**: Revoking critical management roles 
    ("role_manager", "user_manager") is exclusively reserved for the "owner". 
    This prevents unauthorized managers from de-authorizing their peers or superiors.
  - **Atomic updates**: The system ensures that role removal is reflected immediately 
    across all associated permissions.
    - **Access control**: This endpoint is only accessible to users who have the 
    **"role.revoke"** or **"owner.all"** permission in their permissions list.
  
  This endpoint maintains the principle of least privilege and prevents 
  unauthorized restructuring of the organizational hierarchy.`,
  operationId: 'revoke_role'
};