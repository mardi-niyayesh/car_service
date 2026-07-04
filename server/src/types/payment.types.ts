import type {Payment} from "@/modules/prisma/generated/client";

export interface PaymentResponse {
  payment: Payment;
}
