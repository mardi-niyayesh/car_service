import {PERMISSIONS} from "@/common";
import {ApiOperationOptions} from "@nestjs/swagger/dist/decorators/api-operation.decorator";

export const findOneRoleOperation: ApiOperationOptions = {
  summary: "find one role with id or name",
  operationId: 'find_role',
  description: `- **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.ROLE_VIEW}\``,
};

export const findAllRoleOperation: ApiOperationOptions = {
  summary: "Get all roles from the list of pagination",
  operationId: 'get_all_role',
  description: `- **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.ROLE_VIEW}\``,
};

export const createRoleOperation: ApiOperationOptions = {
  summary: 'Create a new custom role with specific permission',
  description: `
  - **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.ROLE_CREATE}\`\n
  
  Creates a new role and assigns a set of existing permissions to it with strict security and validation enforcement:
  
  - **Access control**: This endpoint is strictly accessible only to users who possess the 
    **"role.create"** or **"owner.all"** permission.
  - **Uniqueness guarantee**: The role name must be globally unique. The system will reject 
    the request with a conflict error if a role with the same name already exists.
  - **Strict existence validation**: All requested permission IDs must already exist in the database. 
    The entire operation will abort if even a single permission ID is invalid or missing.
  - **Base permissions restriction**: Custom roles cannot be created containing core/base permissions 
    (e.g., "owner.all", "user.self"). This prevents unauthorized users from accidentally or 
    maliciously creating backdoor owner accounts or overriding fundamental system behaviors.
  - **Management-level protection (Anti-Privilege Escalation)**: Creating roles that include 
    sensitive administrative permissions (such as those starting with "role." or "user.") is 
    exclusively reserved for users with the **"owner.all"** privilege. Standard role creators 
    cannot forge roles with higher clearances than their own.
  - **Atomic execution**: Role creation and permission binding are executed inside a unified 
    database transaction. This ensures absolute data integrity—preventing scenarios where a 
    role is created but its permissions fail to attach.
  
  This endpoint is designed to safely expand the system's Role-Based Access Control (RBAC) 
  while strictly preventing privilege escalation and structural manipulation.`,
  operationId: 'create_role'
};

export const deleteRoleOperation: ApiOperationOptions = {
  summary: 'Delete an existing role from the system',
  description: `
  - **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.ROLE_DELETE}\`\n
    
  Deletes a role from the system while enforcing strict security policies to preserve the integrity 
  of the Role‑Based Access Control (RBAC) model.
  
  - **Access control**: This endpoint is accessible only to users who possess the 
    **"role.delete"** or **"owner.all"** permission.
  
  - **Strict existence validation**: The system first verifies that the specified role exists 
    in the database. If the role does not exist, the operation immediately fails with a 
    **Role Not Found** error.
  
  - **Core system role protection**: Fundamental system roles (base roles) are permanently 
    protected and cannot be deleted under any circumstances. These roles are essential for 
    maintaining the core authorization structure of the platform.
  
  - **Role ownership protection**: If a role was created by another user, only a user with the 
    **"owner.all"** permission is allowed to delete it. Standard role managers cannot remove 
    roles created by other administrators. This rule prevents unauthorized modification of 
    roles owned by other privileged users.
  
  - **Management‑level permission protection (Anti‑Privilege Escalation)**: Roles that contain 
    sensitive or high‑level administrative permissions are considered critical. Deleting such 
    roles is strictly restricted to users who possess the **"owner.all"** privilege.
  
  - **Security safeguard**: These restrictions ensure that administrators cannot weaken the 
    system’s authorization model by deleting protected or high‑privilege roles.
  
  - **Atomic execution**: The deletion process runs inside a database transaction to guarantee 
    consistency and prevent partial operations that could compromise RBAC integrity.
  
  This endpoint ensures that role deletion is performed safely while protecting critical roles 
  and preventing privilege abuse or structural manipulation of the authorization system.`,
  operationId: 'delete_role'
};

export const updateRoleOperation: ApiOperationOptions = {
  summary: 'Update an existing role',
  description: `
  - **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.ROLE_UPDATE}\`\n
  
  Updates the metadata and permissions of an existing role while enforcing strict security rules to preserve the integrity of the Role‑Based Access Control (RBAC) model.
  
  - **Access control**: This endpoint is accessible only to users who possess the **"role.update"** permission or the **"owner.all"** privilege. Ownership rules are enforced automatically to ensure that role modifications respect administrative boundaries.
  
  - **Strict role existence validation**: The system verifies that the specified role exists and is accessible to the acting user. If the role cannot be resolved, the operation fails immediately.
  
  - **Core system role protection**: Fundamental system roles (base roles) are permanently protected and **cannot be modified under any circumstances**. These roles are essential for maintaining the platform’s authorization structure.
  
  - **High‑level permission protection (Anti‑Privilege Escalation)**: Roles that contain **management‑level or sensitive administrative permissions** are considered critical. Updating such roles is **restricted exclusively to users with the "owner.all" privilege**.
  
  - **Administrative permission assignment protection**: When adding new permissions to a role, the system validates the security level of each permission. If the requested permissions include **high‑level management permissions**, only users with the **"owner.all"** privilege are allowed to assign them.
  
  - **Permission integrity validation**:
    - Permissions scheduled for **removal must already exist in the role**.
    - Permissions scheduled for **addition must exist in the database**.
    - Duplicate or inconsistent permission assignments are rejected.
  
  - **Change integrity validation**: At least **one field must differ from the existing role data**. If all provided values match the current role state, the request fails with a **Role Update Conflict** error.
  
  - **Atomic execution**: The entire update process runs inside a **database transaction** to guarantee consistency and prevent partial updates that could compromise RBAC integrity.
  
  These safeguards ensure that role updates remain secure while preventing privilege escalation and protecting critical authorization structures.
`,
  operationId: 'update_role'
};