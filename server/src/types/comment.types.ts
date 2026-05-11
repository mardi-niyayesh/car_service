import type {SafeCar} from "@/types/car.types";
import type {SafeUser} from "@/types/user.types";
import {ListWithCount} from "@/types/response.types";
import type {Comment} from "@/modules/prisma/generated/client";

/** Comment with car and user response */
export type CommentNUserNCar = Comment & {
  car: SafeCar;
  user: SafeUser;
};

/** comment with car and user include in list with count */
export type CommentNUserNCarList = ListWithCount<{
  comments: CommentNUserNCar[];
}>

/** create comment response */
export interface CreateCommentResponse {
  comment: Comment;
}