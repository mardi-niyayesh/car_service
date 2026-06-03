import {exampleDate} from "@/lib";
import type {User} from "@/modules/prisma/generated/client";

export const fakeUserTest = {
  id: "2a55bda6-e1fc-4047-9725-aeec8fcc9ec4",
  createdAt: exampleDate,
  updatedAt: exampleDate,
  email: "user@example.com",
  password: "example_password",
  display_name: "first user",
  age: 20,
  userRoles: [
    {
      role: {
        name: "self",
        rolePermissions: [
          {
            permission: {name: "user.self"}
          }
        ]
      }
    },
    {
      role: {
        name: "user_manager",
        rolePermissions: [
          {permission: {name: "role.revoke"}},
          {permission: {name: "role.assign"}},
          {permission: {name: "user.delete"}},
          {permission: {name: "user.view"}}
        ]
      }
    }
  ]
} as unknown as User;