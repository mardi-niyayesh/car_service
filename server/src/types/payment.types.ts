import type {ListWithCount} from "@/types/response.types";
import type {Payment} from "@/modules/prisma/generated/client";

export interface PaymentResponse {
  payment: Payment;
}

export type ListPaymentResponse = ListWithCount<{
  payments: Payment[];
}>;
