import type {SafeCar} from "@/types/car.types";
import type {SafeUser} from "@/types/user.types";
import type {Comment} from "@/modules/prisma/generated/client";

/** Comment with car and user response */
export type CommentNUserNCar = Comment & {
  car: SafeCar;
  user: SafeUser;
};

/** create comment response */
export interface CreateCommentResponse {
  comment: Comment;
}