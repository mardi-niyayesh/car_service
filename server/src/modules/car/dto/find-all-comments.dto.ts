import {getBaseOkResponseSchema} from "@/common";
import {exampleComment} from "@/modules/comment/dto";
import {CommentAndUser, CommentListAndUser} from "@/types";

const commentConfirmedExample: CommentAndUser = {
  ...exampleComment,
  is_confirmed: true,
  user: {
    id: "user_id",
    display_name: "user name"
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