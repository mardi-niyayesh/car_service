import type {BaseException} from "@/types";
import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "@/modules/prisma/prisma.service";

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async payment(user_id: string, car_rent_id: string) {
    const payment = await this.prisma.carRent.findUnique({
      where: {
        id: car_rent_id,
        cart: {
          user_id
        }
      }
    });

    if (!payment) throw new NotFoundException({
      message: "Car rent not found in database, please try again later.",
      error: "Car Rent Not Found"
    } as BaseException);
  }
}
