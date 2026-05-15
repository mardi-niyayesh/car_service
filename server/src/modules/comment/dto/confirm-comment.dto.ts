import {exampleDate} from "@/lib";
import {CreateCommentResponse} from "@/types";
import {getBaseOkResponseSchema, getNormalErrorResponse} from "@/common";
import {Comment} from "@/modules/prisma/generated/client";

export const confirmedCommentExample: Comment = {
  id: "6d813935-0fbb-4ebd-943d-25c1dc572efb",
  created_at: exampleDate,
  updated_at: exampleDate,
  content: "test comment",
  is_confirmed: true,
  rate: 3,
  parent_id: null,
  creator_id: "7e1d66d6-0823-43af-8a6e-737b6923778c",
  car_id: "9e4f7159-ab7f-4ac8-96d8-52be77108105"
};

export class ConfirmedCommentOk extends getBaseOkResponseSchema<CreateCommentResponse>({
  path: 'comments/id/confirm',
  response: {
    message: 'comment successfully confirmed.',
    data: {
      comment: confirmedCommentExample
    }
  }
}) {}

export class ConfirmCommentNotFound extends getNormalErrorResponse({
  path: "comment/id/confirm",
  statusCode: 404,
  message: 'comment not found in database, or already is confirmed',
  error: 'comment not found'
}) {}