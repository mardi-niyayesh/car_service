import * as CartDto from "./dto";
import {CartService} from "./cart.service";
import {ApiBearerAuth} from "@nestjs/swagger";
import * as CartDecorator from "./decorators";
import {Permission, PERMISSIONS, UUIDv4Validator, ZodPipe} from "@/common";
import {Body, Controller, Delete, Get, Param, Post, Req} from '@nestjs/common';
import type {AccessRequest, ApiResponse, CarRentResponse, CartResponse, RemoveCarRentResponse} from "@/types";

/**
 * Cart and rental management endpoints.
 *
 * @description
 * This controller handles:
 * - Retrieving the authenticated user's cart with all active rental items
 * - Adding a new car rental to the current user's cart (automatically validates date conflicts and car availability)
 * - Creating an empty cart for new users upon signup (via event listener, not direct endpoint)
 *
 * **Security rules:**
 * - All endpoints require authentication (Bearer token)
 * - Users can only access their own cart (user.self permission)
 * - Cart creation during signup is handled automatically, no manual endpoint needed
 *
 * **Date validation:**
 * - `start_date` must be today or later
 * - `end_date` must be at least one day after today
 * - Maximum rental period is 30 days from today
 * - `end_date` must be after `start_date`
 *
 * **Conflict detection:**
 * - Prevents adding a rental if the car is already booked for any overlapping date range
 * - Returns `409 Conflict` with appropriate error message
 *
 * @see {@link CartService} for business logic implementation
 * @see {@link AddToCartValidator} for date validation rules
 * @module CartController
 * @version 1.0
 */
@Controller('carts')
@ApiBearerAuth("accessToken")
@Permission({
  permissions: [PERMISSIONS.USER_SELF]
})
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /**
   * Retrieves the current user's cart with all active rental items.
   *
   * @param req - Authenticated request object containing user info
   * @returns Promise containing cart details with all rental items
   *
   * @example
   * GET /api/v1/carts
   * Authorization: Bearer <token>
   *
   * @throws {Unauthorized Exception} If token is missing or invalid
   * @see {@link CartService.getCart}
   */
  @Get()
  @CartDecorator.GetCartDecorators()
  getCart(
    @Req() req: AccessRequest
  ): Promise<ApiResponse<CartResponse>> {
    return this.cartService.getCart(req.user.userId, req.user);
  }

  /** add rent of car to cart
   * - **only roles with permission (user.self) can accessibility to this route**
   */
  @Post()
  @CartDecorator.AddToCartDecorators()
  async addToCart(
    @Req() req: AccessRequest,
    @Body(new ZodPipe(CartDto.AddToCartValidator)) data: CartDto.AddToCartType
  ): Promise<ApiResponse<CarRentResponse>> {
    return this.cartService.addToCart(req.user.userId, data);
  }

  /** remove rent of car from cart
   * - **only roles with permission (user.self) can accessibility to this route**
   */
  @Delete(':id')
  @CartDecorator.RemoveFromCartDecorators()
  removeFromCart(
    @Req() req: AccessRequest,
    @Param('id', new ZodPipe(UUIDv4Validator)) id: string
  ): Promise<ApiResponse<RemoveCarRentResponse>> {
    return this.cartService.removeFromCart(req.user.userId, id);
  }
}