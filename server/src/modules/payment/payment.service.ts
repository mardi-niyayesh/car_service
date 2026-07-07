import * as PaymentDto from "./dto";
import {selfCartCacheKey} from "@/modules/cart/decorators";
import {RedisService} from "@/modules/redis/redis.service";
import {PrismaService} from "@/modules/prisma/prisma.service";
import type {Payment} from "@/modules/prisma/generated/client";
import type {ApiResponse, BaseException, PaymentResponse} from "@/types";
import {PaymentStatus, RentStatus} from "@/modules/prisma/generated/enums";
import {Injectable, NotFoundException, ConflictException} from "@nestjs/common";
import {PaymentWhereInput} from "@/modules/prisma/generated/models/Payment";

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  /**
   * Payment car rent with user_id and car_rent_id
   * @param user_id - The ID of the user making the payment
   * @param car_rent_id - The ID of the car rent record
   * @param successRate - Percentage of success (0-100), default is 80%
   */
  async payment(user_id: string, car_rent_id: string, successRate: number = 80): Promise<ApiResponse<PaymentResponse>> {
    // Find the car rent record
    const carRent = await this.prisma.carRent.findUnique({
      where: {
        id: car_rent_id,
        cart: {
          user_id
        }
      },
      include: {
        payment: true
      }
    });

    if (!carRent) {
      throw new NotFoundException({
        message: "Car rent not found in database, please try again later.",
        error: "Car Rent Not Found"
      } as BaseException);
    }

    // Check if already paid
    if (carRent.payment && carRent.payment.status === PaymentStatus.SUCCESS) {
      throw new ConflictException({
        message: "This car rent has already been paid.",
        error: "Payment Already Exists"
      } as BaseException);
    }

    // Simulate payment logic with success rate
    const random: number = Math.random() * 100; // 0 to 100
    const isSuccess: boolean = random <= successRate;

    let payment: Payment;

    if (carRent.payment && carRent.payment.status === PaymentStatus.FAILED) {
      payment = await this.prisma.payment.update({
        where: {id: carRent.payment.id},
        data: {
          status: isSuccess
            ? PaymentStatus.SUCCESS
            : PaymentStatus.FAILED,
          transaction_id: isSuccess
            ? `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
            : null,
        }
      });
    } else {
      // Create payment record
      payment = await this.prisma.payment.create({
        data: {
          status: isSuccess ? PaymentStatus.SUCCESS : PaymentStatus.FAILED,
          amount: carRent.price,
          transaction_id: isSuccess ? `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}` : null,
          car_rent_id: carRent.id
        }
      });
    }

    // Optional: Update car rent status if payment is successful
    if (isSuccess) {
      await this.prisma.carRent.update({
        where: {id: carRent.id},
        data: {
          status: RentStatus.ACTIVE
        }
      });
    }

    const key = `*cart:${selfCartCacheKey}:user-id=${user_id}*`;
    await this.redis.deletePrefix(key);

    // Return response
    return {
      message: isSuccess
        ? "Payment completed successfully."
        : "Payment failed. Please try again.",
      data: {payment}
    };
  }

  /**
   * Retrieve all payment transactions with optional filtering.
   *
   * @param cart_id - Filter payments by user ID (optional)
   * @param pagination - Filter by payment status, page and limit
   *
   * @returns List of payment transactions with total count
   *
   * @example
   * GET /payments?status=SUCCESS&limit=10&offset=20
   */
  async findAll(cart_id: string, pagination: PaymentDto.FindAllValidatorType) {
    const where: PaymentWhereInput = {
      status: pagination.status,
      car_rent: {
        cart_id
      }
    };

    const payments = await this.prisma.payment.findMany({
      where,
      include: {
        car_rent: {
          include: {
            payment: true
          },
          select: {
            car_id: true,
          }
        }
      },
      take: pagination.limit,
      skip: pagination.offset,
      orderBy: {
        created_at: pagination.orderByLower
      }
    });

    console.log(payments);

    return 'payment find all';
  }
}
