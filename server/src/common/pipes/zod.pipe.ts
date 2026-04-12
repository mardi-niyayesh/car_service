import z from "zod";
import {checkZod} from "@/lib";
import {Injectable, PipeTransform} from '@nestjs/common';

@Injectable()
export class ZodPipe<T extends z.ZodTypeAny> implements PipeTransform {
  constructor(private readonly schema: T) {}

  transform(value: unknown): z.infer<T> {
    return checkZod(this.schema, value);
  }
}