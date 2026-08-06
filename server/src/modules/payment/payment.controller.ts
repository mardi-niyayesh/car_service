import * as PaymentDto from "./dto";
import type {AccessRequest} from "@/types";
import * as PaymentDecorator from "./decorators";
import {UUIDv4Validator, ZodPipe} from "@/common";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {PaymentService} from "@/modules/payment/payment.service";
import {Controller, Get, Param, Post, Query, Req} from "@nestjs/common";

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
  constructor(private readonly paymentService: PaymentService) {}

  /**
   * Process payment for cart items or rental request.
   *
   * @param req - Authenticated user request object
   * @param id - Payment identifier (valid UUID v4)
   *
   * @returns Transaction details and payment status
   *
   * @example
   * POST /payments/550e8400-e29b-41d4-a716-446655440000
   */
  @Post(':id')
  @PaymentDecorator.CreateDecorators()
  payment(
    @Req() req: AccessRequest,
    @Param('id', new ZodPipe(UUIDv4Validator)) id: string,
  ) {
    return this.paymentService.payment(req.user.userId, id);
  }

  /**
   * Retrieve all payment transactions for the current user.
   *
   * @param id - cart id
   * @param pagination - Pagination parameters (page, limit, sort)
   *
   * @returns Array of payment transactions with pagination metadata
   *
   * @remarks
   * - Only returns transactions belonging to the authenticated user
   * - Default sorting: created date (descending)
   *
   * @example
   * GET /payments?page=1&limit=20&sortBy=createdAt&order=DESC
   */
  @Get(":id")
  @PaymentDecorator.FindAllDecorators()
  findAll(
    @Param('id', new ZodPipe(UUIDv4Validator)) id: string,
    @Query(new ZodPipe(PaymentDto.FindAllValidator)) pagination: PaymentDto.FindAllValidatorType
  ) {
    return this.paymentService.findAll(id, pagination);
  }
}
