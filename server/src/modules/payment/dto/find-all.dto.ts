import {BasePaginationValidator, getSafePaginationValidator} from "@/common";
import z from "zod";
import {PaymentStatus} from "@/modules/prisma/generated/enums";

export const FindAllValidator = getSafePaginationValidator(z.object({
  status: z.enum(PaymentStatus).optional(),
}).extend(BasePaginationValidator.shape));

export type FindAllValidatorType = z.infer<typeof FindAllValidator>;
