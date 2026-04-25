import {eventsEmitter} from "@/common";
import {OnEvent} from "@nestjs/event-emitter";
import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "@/modules/prisma/prisma.service";
import type {ApiResponse, BaseException, CartResponse, CreateCartSignup, UserAccess} from "@/types";

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

  /** get self cart
   * - **only roles with permission (user.self) can accessibility to this route**
   */
  async getCart(id: string, user: UserAccess): Promise<ApiResponse<CartResponse>> {
    const cart = await this.prisma.cart.findUnique({
      where: {
        user_id: id
      },
      include: {
        carRents: {
          include: {
            car: {
              select: {
                image: true,
                slug: true,
              }
            }
          }
        }
      }
    });

    if (!cart) throw new NotFoundException({
      message: 'Cart not found in database, please contact to administrator',
      error: 'Cart not found.'
    } as BaseException);

    return {
      message: `Cart successfully found`,
      data: {
        cart: {
          id: cart.id,
          created_at: cart.created_at,
          updated_at: cart.updated_at,
          total_price: cart.total_price,
          carRents: cart.carRents,
          user: {
            id: user.userId,
            roles: user.roles,
            permissions: user.permissions,
            display_name: user.display_name,
          }
        }
      }
    };
  }
}