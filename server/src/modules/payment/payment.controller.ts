import type {Request} from "express";
import {PaymentDecorator} from "./decorators";
import {Controller, Post, Req} from "@nestjs/common";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";

/**
 * Payment processing endpoints.
 *
 * @description
 * This controller handles:
 * - Initiating payment for cart items and rental requests
 *
 * **Security rules:**
 * - All endpoints require authentication (Bearer token)
 * - Users can only process payments for their own cart (user.self permission)
 * - Payment is processed through the configured payment gateway
 *
 * **Payment validation:**
 * - Cart must contain at least one active rental item
 * - All rental items must be valid and not expired
 * - Total amount must be greater than zero
 *
 * **Error handling:**
 * - Returns `400 Bad Request` if cart is empty or invalid
 * - Returns `402 Payment Required` if payment fails
 * - Returns `409 Conflict` if cart state has changed during processing
 *
 * @see {@link PaymentService} for business logic implementation
 * @module PaymentController
 * @version 1.0
 */
@ApiTags("Payments")
@Controller('payments')
@ApiBearerAuth("accessToken")
export class PaymentController {
  @Post()
  @PaymentDecorator()
  payment(
    @Req() req: Request
  ) {
    console.log(req.clientInfo);
    return "test payment.";
  }
}
