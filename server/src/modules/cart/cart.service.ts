import * as CartDto from "./dto";
import {eventsEmitter} from "@/common";
import {OnEvent} from "@nestjs/event-emitter";
import {RentStatus} from "@/modules/prisma/generated/enums";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import type {ApiResponse, BaseException, CartResponse, CreateCartSignup, UserAccess, CarRentResponse, RemoveCarRentResponse} from "@/types";

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
  async getCart(user_id: string, user: UserAccess): Promise<ApiResponse<CartResponse>> {
    const cart = await this.prisma.cart.findUnique({
      where: {user_id},
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

  /** add rent of car to cart
   * - **only roles with permission (user.self) can accessibility to this route**
   */
  async addToCart(user_id: string, data: CartDto.AddToCartType): Promise<ApiResponse<CarRentResponse>> {
    return this.prisma.$transaction(async (tx): Promise<ApiResponse<CarRentResponse>> => {
      const newEnd: Date = new Date(data.end_date);
      const newStart: Date = new Date(data.start_date);

      const car = await tx.car.findUnique({
        where: {slug: data.car_slug},
        include: {
          category: {
            omit: {
              creator_id: true
            }
          },
          carRents: {
            where: {
              AND: [
                {end_date: {gt: newStart}},
                {start_date: {lt: newEnd}},
              ],
            }
          }
        },
        omit: {creator_id: true}
      });

      if (!car) throw new NotFoundException({
        message: 'This car slug does not exist in database',
        error: 'Car slug not found.'
      } as BaseException);


      const {carRents, ...carData} = car;

      if (carRents.length) throw new ConflictException({
        message: 'The selected car is already rented for all or part of the requested period. Please choose different dates or another car.',
        error: 'Car Rental Conflict'
      } as BaseException);

      const {description, daysCount} = data;
      const price: number = daysCount * car.price_per_day;

      const user = await tx.user.findUnique({
        where: {id: user_id},
        include: {
          cart: {
            select: {
              id: true
            }
          }
        }
      });

      if (!user || !user.cart) throw new NotFoundException({
        message: 'User Cart does not exist in database, please contact to administrator',
        error: 'User Cart not found.'
      });

      const carRent = await tx.carRent.create({
        data: {
          price,
          description,
          car_id: car.id,
          end_date: newEnd,
          start_date: newStart,
          cart_id: user.cart.id,
          status: RentStatus.PENDING,
        }
      });

      await tx.cart.update({
        where: {id: user.cart.id},
        data: {
          total_price: {
            increment: price
          }
        }
      });

      return {
        message: 'car rent successfully add to your cart',
        data: {
          carRent: {
            ...carRent,
            car: carData
          }
        }
      };
    });
  }

  /** remove rent of car from cart
   * - **only roles with permission (user.self) can accessibility to this route**
   */
  async removeFromCart(rent_id: string): Promise<ApiResponse<RemoveCarRentResponse>> {
    try {
      const carRent = await this.prisma.carRent.delete({
        where: {
          id: rent_id,
        }
      });

      return {
        message: 'car rent successfully removed from the cart',
        data: {
          carRent
        }
      };
    } catch (_) {
      throw new NotFoundException({
        message: 'Car Rent not found in database, please check later.',
        error: 'Car Rent not found'
      } as BaseException);
    }
  }
}