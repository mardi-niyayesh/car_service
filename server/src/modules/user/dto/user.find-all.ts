import {UserResponse} from "@/types";
import {getBaseOkResponseSchema} from "@/common";
import {UsersListResponse} from "@/modules/users/users.service";
import {createUserResponse} from "@/modules/auth/dto/auth.register";

/** ok example for get one user by id */
export class GetMeOkResponse extends getBaseOkResponseSchema<UserResponse>({
  path: "users/profile",
  create: false,
  response: {
    message: "User found successfully",
    data: createUserResponse.data
  }
}) {}

/** ok response example swagger for findAll users */
export class FindAllUsersOKRes extends getBaseOkResponseSchema<UsersListResponse>({
  path: "users?orderBy=desc&limit=5&page=1",
  response: {
    message: "Users Successfully find.",
    data: {
      count: 100,
      users: Array.from({length: 5}, () => createUserResponse.data.user),
    }
  }
}) {}