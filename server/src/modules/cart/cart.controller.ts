import {CartService} from "./cart.service";
import {ApiBearerAuth} from "@nestjs/swagger";
import * as CartDecorator from "./decorators";
import {Permission, PERMISSIONS} from "@/common";
import {Controller, Get, Req} from '@nestjs/common';
import type {AccessRequest, ApiResponse, CartResponse} from "@/types";

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
}