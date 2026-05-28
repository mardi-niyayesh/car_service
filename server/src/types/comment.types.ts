import type {SafeUser} from "@/types/user.types";
import type {ListWithCount} from "@/types/response.types";
import type {Car, Comment} from "@/modules/prisma/generated/client";

/** Comment with car and user response */
export type CommentNUserNCar = Comment & {
  car: Car;
  user: SafeUser;
};

/** Comment with user safe */
export type CommentAndUser = Comment & {
  user: Pick<SafeUser, "id" | 'display_name'>;
};

/** comment with car and user include in list with count */
export type CommentNUserNCarList = ListWithCount<{
  comments: CommentNUserNCar[];
}>;

export type CommentListAndUserWithChildCount = CommentAndUser & {
  _count: {
    replies: number;
  };
};

/** Comment list and safe user with count */
export type CommentListAndUser = ListWithCount<{
  comments: CommentListAndUserWithChildCount[];
}>;

/** Comment without rate with user safe */
type ReplyCommentAndUser = Omit<Comment, 'rate'> & {
  user: Pick<SafeUser, "id" | 'display_name'>;
};

export type ReplyCommentListAndUserWithChildCount = ReplyCommentAndUser & {
  _count: {
    replies: number;
  };
};

export type ReplyCommentListAndUser = ListWithCount<{
  comments: ReplyCommentListAndUserWithChildCount[];
}>;

/** create comment response */
export interface CreateCommentResponse {
  comment: Comment;
}

export interface UpdateCarRateEvent {
  car_id: string;
}