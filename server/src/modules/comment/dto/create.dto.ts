import z from "zod";
import {createZodDto} from "nestjs-zod";

/** Create Comment Validator */
export const CreateCommentValidator = z.object({
  content: z.string().trim().min(2).max(500),

  rate: z.number().min(1).max(5).optional().default(5),

  car_id: z.uuidv4(),

  parent_id: z.uuidv4().nullable().default(null),
});

/** Create Comment Validator type */
export type CreateCommentType = z.infer<typeof CreateCommentValidator>;

/** Create Comment schema swagger */
export class CreateCommentDto extends createZodDto(CreateCommentValidator) {}