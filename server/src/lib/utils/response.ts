import z, {output} from 'zod';
import {ZodException, ZodFieldError} from "@/types";
import {BadRequestException, HttpStatus} from "@nestjs/common";

/** get Default message with status code */
export function getDefaultMessage(status: HttpStatus): string {
  const defaultMessages: Partial<Record<HttpStatus, string>> = {
    [HttpStatus.OK]: 'Request Successful',
    [HttpStatus.CREATED]: 'Resource Created',
    [HttpStatus.NO_CONTENT]: 'Resource Deleted',
    [HttpStatus.BAD_REQUEST]: 'Bad Request',
    [HttpStatus.UNAUTHORIZED]: 'Unauthorized',
    [HttpStatus.FORBIDDEN]: 'Forbidden',
    [HttpStatus.NOT_FOUND]: 'Not Found',
    [HttpStatus.CONFLICT]: 'Conflict',
    [HttpStatus.TOO_MANY_REQUESTS]: "Too Many Requests",
    [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
  };
  return defaultMessages[status] || 'Unknown';
}

/** get structure format for zod errors */
export function formatZodError(zodError: z.ZodError): ZodFieldError[] {
  return zodError?.issues?.map(i => ({
    field: i.path.join(", "),
    error: i.message,
  }));
}

/** safe zod body */
export function checkZod<T extends z.ZodTypeAny>(schema: T, value: unknown): output<T> {
  const result = schema.safeParse(value);

  if (!result.success) {
    throw new BadRequestException({
      errors: formatZodError(result.error),
      message: "Invalid request.",
    } as ZodException);
  }

  return result.data;
}