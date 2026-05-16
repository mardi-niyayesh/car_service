import {getBaseOkResponseSchema} from "@/common";
import {exampleComment} from "@/modules/comment/dto";
import {CommentListAndUser, CommentListAndUserWithChildCount} from "@/types";

export const commentConfirmedExample: CommentListAndUserWithChildCount = {
  ...exampleComment,
  is_confirmed: true,
  user: {
    id: "user_id",
    display_name: "user name"
  },
  _count: {
    replies: 2
  }
};

export class FindAllCommentsOk extends getBaseOkResponseSchema<CommentListAndUser>({
  path: 'cars/id/comments',
  response: {
    message: '',
    data: {
      count: 5,
      comments: Array.from({length: 5}, () => commentConfirmedExample)
    }
  }
}) {}