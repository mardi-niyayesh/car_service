import {exampleDate} from "@/lib";
import type {PaymentResponse} from "@/types";
import type {Payment} from "@/modules/prisma/generated/client";
import {getBaseOkResponseSchema, getNormalErrorResponse} from "@/common";

/** Example payment data for successful transaction response */
export const paymentExample: Payment = {
  id: "payment_id",
  created_at: exampleDate,
  updated_at: exampleDate,
  status: "SUCCESS",
  amount: 2500000,
  transaction_id: "TXN-1783218276799-FUZWLW",
  car_rent_id: "example_car_rent_id"
};

/** 200 OK response schema for payment endpoint */
export class CreateOkRes extends getBaseOkResponseSchema<PaymentResponse>({
  statusCode: 200,
  path: "/payments/id",
  response: {
    message: "Payment completed successfully.",
    data: {
      payment: paymentExample
    }
  }
}) {}

/** 404 Not Found response when car rent record doesn't exist */
export class CreateNotFoundRes extends getNormalErrorResponse({
  statusCode: 404,
  path: "/payments/id",
  message: "Car rent not found in database, please try again later.",
  error: "Car Rent Not Found"
}) {}

/** 409 Conflict response when payment already exists for this rent */
export class CreateConflictRes extends getNormalErrorResponse({
  statusCode: 409,
  path: "/payments/id",
  error: "Payment Already Exists",
  message: "This car rent has already been paid.",
}) {}
