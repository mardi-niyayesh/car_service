import {Injectable} from "@nestjs/common";
import {PrismaService} from "@/modules/prisma/prisma.service";

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  payment(user_id: string, payment_id: string) {

  }
}
