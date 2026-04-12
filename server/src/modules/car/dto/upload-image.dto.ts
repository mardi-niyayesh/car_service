import {getNormalErrorResponse} from "@/common";

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