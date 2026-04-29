import {exampleDate} from "@/lib";
import type {RemoveCarRentResponse} from "@/types";
import {getBaseOkResponseSchema, getNormalErrorResponse} from "@/common";

/** example ok response for remove car rent from cart */
export class RemoveFromCartOk extends getBaseOkResponseSchema<RemoveCarRentResponse>({
  path: 'carts/id',
  statusCode: 200,
  response: {
    message: "car rent successfully removed from the cart",
    data: {
      carRent: {
        id: "4effb7f7-c37c-4efe-be95-822b14e81afb",
        created_at: exampleDate,
        updated_at: exampleDate,
        description: "string",
        price: 20000000,
        status: "PENDING",
        start_date: exampleDate,
        end_date: exampleDate,
        car_id: "05d9a623-640a-4969-bb89-5f5edf31115a",
        cart_id: "33d944e3-480b-49d5-82d9-644d288347b0"
      }
    }
  }
}) {}

/** example not found response for remove car rent from cart */
export class RemoveFromCartNotFound extends getNormalErrorResponse({
  statusCode: 404,
  path: 'carts/id',
  error: 'Car Rent not found',
  message: 'Car Rent not found in your cart, please check later.',
}) {}