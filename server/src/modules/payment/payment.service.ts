import type {BaseException} from "@/types";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {PaymentStatus, RentStatus} from "@/modules/prisma/generated/enums";
import {Injectable, NotFoundException, ConflictException} from "@nestjs/common";
import {Payment} from "@/modules/prisma/generated/client";

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Payment car rent with user_id and car_rent_id
   * @param user_id - The ID of the user making the payment
   * @param car_rent_id - The ID of the car rent record
   * @param successRate - Percentage of success (0-100), default is 80%
   */
  async payment(user_id: string, car_rent_id: string, successRate: number = 80) {
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
    const random = Math.random() * 100; // 0 to 100
    const isSuccess = random <= successRate;

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

    // Return response
    return {
      success: isSuccess,
      message: isSuccess
        ? "Payment completed successfully."
        : "Payment failed. Please try again.",
      payment
    };
  }
}
