import z from "zod";
import {ApiParamOptions} from "@nestjs/swagger";

/** validate for uuid4 */
export const UUIDv4Validator = z.uuidv4().overwrite(id => (id));

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