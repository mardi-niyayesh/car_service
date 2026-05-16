import {getBaseOkResponseSchema} from "@/common";
import {exampleComment} from "@/modules/comment/dto/create.dto";
import type {CommentListAndUser, CommentListAndUserWithChildCount} from "@/types";

const exampleComments: CommentListAndUserWithChildCount = {
  ...exampleComment,
  is_confirmed: true,
  user: {
    id: "user_id",
    display_name: "user name"
  },
  _count: {
    replies: 2
  },
  parent_id: "parent_uuid"
};

export class FindRepliesOk extends getBaseOkResponseSchema<CommentListAndUser>({
  path: 'comments/id/replies',
  response: {
    message: 'replies comment successfully found.',
    data: {
      count: 5,
      comments: Array.from({length: 5}, () => exampleComments)
    }
  }
}) {}