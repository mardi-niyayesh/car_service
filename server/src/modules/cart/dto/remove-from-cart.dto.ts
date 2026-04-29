import {getNormalErrorResponse} from "@/common";

/** example response for remove car rent from cart */
export class RemoveFromCartNotFound extends getNormalErrorResponse({
  statusCode: 404,
  path: 'carts/id',
  error: 'Car Rent not found',
  message: 'Car Rent not found in database, please check later.',
}) {}