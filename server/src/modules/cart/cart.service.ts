import {eventsEmitter} from "@/common";
import {Injectable} from '@nestjs/common';
import {OnEvent} from "@nestjs/event-emitter";
import type {CreateCartSignup} from "@/types";
import {PrismaService} from "@/modules/prisma/prisma.service";

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
}