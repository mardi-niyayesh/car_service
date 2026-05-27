import z from "zod";
import {exampleDate} from "@/lib";
import {createZodDto} from "nestjs-zod";
import type {CreateCommentResponse} from "@/types";
import {getBaseOkResponseSchema, getNormalErrorResponse, getZodErrorBody} from "@/common";

/** Create Comment Validator */
export const CreateCommentValidator = z.object({
  content: z.string().trim().min(2).max(500),

  rate: z.number().min(1).max(5).optional().default(5),

  parent_id: z.uuidv4().nullable().default(null),
});

/** Create Comment Validator type */
export type CreateCommentType = z.infer<typeof CreateCommentValidator>;

/** Create Comment schema swagger */
export class CreateCommentDto extends createZodDto(CreateCommentValidator) {}

export const exampleComment: CreateCommentResponse['comment'] = {
  id: "a84f3f67-f724-47a0-a01c-8becd85d050e",
  created_at: exampleDate,
  updated_at: exampleDate,
  content: "string",
  is_confirmed: false,
  rate: 5,
  parent_id: null,
  creator_id: "303e820e-0779-4e4f-9304-c209634d163d",
  car_id: "05d9a623-640a-4969-bb89-5f5edf31115a"
};

/** example success response */
export class CreateCommentOk extends getBaseOkResponseSchema<CreateCommentResponse>({
  create: true,
  path: "comments/id",
  response: {
    message: "comment created successfully.",
    data: {
      comment: exampleComment
    }
  }
}) {}

/** example bad request response */
export class CreateCommentBadReq extends getZodErrorBody({
  path: "comments/id",
  errors: [
    {
      field: "content",
      error: "Invalid input: expected string, received number"
    },
    {
      field: "rate",
      error: "Invalid input: expected number, received string"
    },
    {
      field: "car_id",
      error: "Invalid input: expected string, received number"
    },
    {
      field: "parent_id",
      error: "Invalid UUID"
    }
  ]
}) {}

/** example not found response */
export class CreateCommentNotFound extends getNormalErrorResponse({
  statusCode: 404,
  path: "comments/id",
  message: "car not exist exists in database, please change car_id",
  error: "car not exists"
}) {}