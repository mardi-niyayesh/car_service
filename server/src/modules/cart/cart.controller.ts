import {CartService} from "./cart.service";
import type {AccessRequest} from "@/types";
import {ApiBearerAuth} from "@nestjs/swagger";
import {Permission, PERMISSIONS} from "@/common";
import {Controller, Get, Req} from '@nestjs/common';

@Controller('carts')
@ApiBearerAuth("accessToken")
@Permission({
  permissions: [PERMISSIONS.USER_SELF]
})
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(
    @Req() req: AccessRequest
  ) {
    return this.cartService.getCart(req.user.userId);
  }
}