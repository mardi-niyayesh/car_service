import {getBaseOkResponseSchema} from "@/common";
import {commentConfirmedExample} from "@/modules/car/dto";
import type {CommentListAndUser, CommentListAndUserWithChildCount} from "@/types";

const exampleComments: CommentListAndUserWithChildCount = {
  ...commentConfirmedExample,
  parent_id: "parent_uuid"
};

export class FindRepliesOk extends getBaseOkResponseSchema<CommentListAndUser>({
  path: 'comments/id',
  response: {
    message: '',
    data: {
      count: 5,
      comments: Array.from({length: 5}, () => exampleComments)
    }
  }
}) {}