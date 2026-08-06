import z from "zod";
import {paymentExample} from "./create.dto";
import type {ListPaymentResponse} from "@/types";
import {PaymentStatus} from "@/modules/prisma/generated/enums";
import {BasePaginationValidator, getBaseOkResponseSchema, getSafePaginationValidator} from "@/common";

export const FindAllValidator = getSafePaginationValidator(z.object({
  status: z.enum(PaymentStatus).optional(),
}).extend(BasePaginationValidator.shape));

export type FindAllValidatorType = z.infer<typeof FindAllValidator>;

export class OkFindAllPaymentRes extends getBaseOkResponseSchema<ListPaymentResponse>({
  statusCode: 200,
  path: "/payment/cart_id",
  response: {
    message: '',
    data: {
      count: 5,
      payments: Array.from({length: 5}, () => paymentExample)
    }
  }
}) {}