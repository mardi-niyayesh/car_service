import {eventsEmitter} from "@/common";
import {OnEvent} from "@nestjs/event-emitter";
import {Cart} from "@/modules/prisma/generated/client";
import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "@/modules/prisma/prisma.service";
import type {ApiResponse, BaseException, CreateCartSignup} from "@/types";

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  /** Create a cart Record for user after signup
   * - **create for all users**
   * */
  @OnEvent(eventsEmitter.SIGNUP_CREATE_CART)
  async create(data: CreateCartSignup) {
    await this.prisma.cart.create({
      data: {
        total_price: 0,
        user_id: data.id,
      }
    });
  }

  async getCart(id: string): Promise<ApiResponse<{ cart: Cart; }>> {
    const cart = await this.prisma.cart.findUnique({
      where: {
        user_id: id
      }
    });

    if (!cart) throw new NotFoundException({
      message: 'Cart not found in database, please contact to administrator',
      error: 'Cart not found.'
    } as BaseException);

    return {
      message: `Cart successfully found`,
      data: {
        cart
      }
    };
  }
}