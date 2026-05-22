import {getBaseOkResponseSchema} from "@/common";
import {exampleComment} from "@/modules/comment/dto/create.dto";
import {ReplyCommentListAndUser, ReplyCommentListAndUserWithChildCount} from "@/types";

const {rate, ...othersData} = exampleComment;

void rate;

const exampleComments: ReplyCommentListAndUserWithChildCount = {
  ...othersData,
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

export class FindRepliesOk extends getBaseOkResponseSchema<ReplyCommentListAndUser>({
  path: 'comments/id/replies',
  response: {
    message: 'replies comment successfully found.',
    data: {
      count: 5,
      comments: Array.from({length: 5}, () => exampleComments)
    }
  }
}) {}