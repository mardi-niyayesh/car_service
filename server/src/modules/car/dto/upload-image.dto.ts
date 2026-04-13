import {ApiBodyOptions} from "@nestjs/swagger";
import {CAR_FILE_FIELD_NAME} from "../configs";
import {getNormalErrorResponse} from "@/common";

export const carUploadApiBody: ApiBodyOptions = {
  schema: {
    type: 'object',
    properties: {
      [CAR_FILE_FIELD_NAME]: {
        type: 'string',
        format: 'binary',
      }
    }
  }
};

/** bad request example response */
export class UploadImageBadReq extends getNormalErrorResponse({
  statusCode: 400,
  path: "cars/id/image",
  message: "Only /jpg|jpeg|png|webp/ allowed",
  error: "Invalid file format"
}) {}

/** not found example response */
export class UploadImageNotFound extends getNormalErrorResponse({
  statusCode: 404,
  path: "cars/id/image",
  message: "this car does not exist in database",
  error: "car not found"
}) {}