import z from "zod";
import {formatZodError} from "@/lib";
import {ZodException} from "@/types";
import {Injectable, PipeTransform, BadRequestException} from '@nestjs/common';

@Injectable()
export class ZodPipe<T extends z.ZodTypeAny> implements PipeTransform {
  constructor(private readonly schema: T) {}

  transform(value: unknown): z.infer<T> {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException({
        errors: formatZodError(result.error),
        message: "Invalid request.",
      } as ZodException);
    }

    return result.data;
  }
}