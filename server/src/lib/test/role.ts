export const fakePermissionsTest = [
  {
    id: "fd000532-1156-4453-ad75-4a69dec40134",
    name: "user.view",
    permission_type: "MANAGER",
    updated_at: "2026-05-06T22:00:43.687Z",
    created_at: "2026-05-06T22:00:43.687Z",
    description: "this permission allows view on user"
  },
  {
    id: "908cce6e-17fe-46f6-8247-a7a4374be5e6",
    name: "user.delete",
    permission_type: "MANAGER",
    updated_at: "2026-05-06T22:00:43.693Z",
    created_at: "2026-05-06T22:00:43.693Z",
    description: "this permission allows delete on user"
  },
  {
    id: "b0e23550-d856-41e9-9e61-6e33758b3571",
    name: "role.assign",
    permission_type: "MANAGER",
    updated_at: "2026-05-06T22:00:43.694Z",
    created_at: "2026-05-06T22:00:43.694Z",
    description: "this permission allows assign on role"
  },
  {
    id: "81a0b26e-a434-4414-8d79-7c08d521c9de",
    name: "role.revoke",
    permission_type: "MANAGER",
    updated_at: "2026-05-06T22:00:43.695Z",
    created_at: "2026-05-06T22:00:43.695Z",
    description: "this permission allows revoke on role"
  },
  {
    id: "b4816a4e-23b1-44f6-a356-e5d38e13e6c6",
    name: "role.view",
    permission_type: "MANAGER",
    updated_at: "2026-05-06T22:00:43.697Z",
    created_at: "2026-05-06T22:00:43.697Z",
    description: "this permission allows view on role"
  },
  {
    id: "9440efc2-644b-4bf9-9bde-f1f91cb2b699",
    name: "permission.view",
    permission_type: "MANAGER",
    updated_at: "2026-05-06T22:00:43.699Z",
    created_at: "2026-05-06T22:00:43.699Z",
    description: "this permission allows view on permission"
  }
] as const;

export const fakeRoleTest = {
  id: "6d64a06a-f1a2-44c1-bd47-e557bd57bcc8",
  name: "user_manager",
  updated_at: "2026-05-06T22:00:43.714Z",
  created_at: "2026-05-06T22:00:43.714Z",
  creator_id: null,
  description: "Full administrative access to manage all users in the system",
  role_type: "SYSTEM",
  rolePermissions: fakePermissionsTest.map(p => ({
    permission_id: p.id,
    permission: {
      ...p
    }
  })),
};