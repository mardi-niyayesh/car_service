import z from "zod";
import {ApiParamOptions} from "@nestjs/swagger";

/** validate for uuid4 */
export const UUIDv4Schema = z.uuidv4().overwrite(id => (id));

/** validate for uuid4 in params object */
export const UUIDv4Validator = z.object({
  id: UUIDv4Schema
});

/** type for validate uuidV4 in Params */
export type UUID4Type = z.infer<typeof UUIDv4Validator>;

/** Swagger Params UUIDv4 */
export function UUID4Dto(name: string): ApiParamOptions {
  return {
    name: "id",
    type: String,
    description: `${name} UUID version 4`,
    example: "d228cc19-b8c9-41c4-8c70-c2c6effb05ca",
    required: true,
  };
}