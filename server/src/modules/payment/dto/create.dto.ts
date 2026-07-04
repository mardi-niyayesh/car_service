import {getNormalErrorResponse} from "@/common";

export class CreateNotFoundRes extends getNormalErrorResponse({
  statusCode: 404,
  path: "/payments/id",
  message: "Car rent not found in database, please try again later.",
  error: "Car Rent Not Found"
}) {}
