import * as CartDto from "./dto";
import {CartService} from "./cart.service";
import {ApiBearerAuth} from "@nestjs/swagger";
import * as CartDecorator from "./decorators";
import {Permission, PERMISSIONS, ZodPipe} from "@/common";
import {Body, Controller, Get, Post, Req} from '@nestjs/common';
import type {AccessRequest, ApiResponse, CarRentResponse, CartResponse} from "@/types";

/**
 * Cart and rental management endpoints.
 *
 * This controller handles:
 * - Retrieving the authenticated user's cart with all active rental items
 * - Adding a new car rental to the current user's cart
 *   (automatically validates date conflicts and car availability)
 * - Creating an empty cart for new users upon signup (via event listener, not direct endpoint)
 *
 * Security rules:
 * - All endpoints require authentication (Bearer token)
 * - Users can only access their own cart (user.self permission)
 * - Cart creation during signup is handled automatically, no manual endpoint needed
 *
 * Date validation:
 * - start_date must be today or later
 * - end_date must be at least one day after today
 * - Maximum rental period is 30 days from today
 * - end_date must be after start_date
 *
 * Conflict detection:
 * - Prevents adding a rental if the car is already booked for any overlapping date range
 * - Returns 409 Conflict with appropriate error message
 *
 * @see CartService for business logic implementation
 * @see AddToCartValidator for date validation rules
 */
@Controller('carts')
@ApiBearerAuth("accessToken")
@Permission({
  permissions: [PERMISSIONS.USER_SELF]
})
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /** get self cart
   * - **only roles with permission (user.self) can accessibility to this route**
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
}