import type {SafeUser} from "@/types/user.types";
import type {ListWithCount} from "@/types/response.types";
import type {Car, Comment} from "@/modules/prisma/generated/client";

/** Comment with car and user response */
export type CommentNUserNCar = Comment & {
  car: Car;
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

export interface UpdateCarRateEvent {
  car_id: string;
}