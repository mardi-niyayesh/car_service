import {getBaseOkResponseSchema, getNormalErrorResponse} from "@/common";

export class RejectCommentOk extends getBaseOkResponseSchema<void>({
  path: "comments/id/reject",
  response: {
    message: "comment successfully deleted.",
  }
}) {}

export class RejectCommentNotFound extends getNormalErrorResponse({
  path: "comment/id/reject",
  statusCode: 404,
  message: 'comment not found in database, or already is confirmed',
  error: 'comment not found'
}) {}