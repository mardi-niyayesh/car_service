import {getNormalErrorResponse} from "@/common";

/** bad request example response */
export class UploadImageBadReq extends getNormalErrorResponse({
  statusCode: 400,
  path: "cars/id/image",
  message: "Only /jpg|jpeg|png|webp/ allowed",
  error: "Invalid file format"
}) {}