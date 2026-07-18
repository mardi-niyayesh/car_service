import {exampleDate} from "@/lib";
import type {CartResponse} from "@/types";
import {BasePaginationValidator, getBaseOkResponseSchema, getSafePaginationValidator} from "@/common";
import z from "zod";
import {exampleCarRent} from "./add-to-cart.dto";
import {RentStatus} from "@/modules/prisma/generated/enums";

export const GetCartValidator = getSafePaginationValidator(z.object({
  car_rent_status: z.enum(RentStatus).optional(),
}).extend(BasePaginationValidator.shape));

export type GetCartValidatorType = z.infer<typeof GetCartValidator>;

export class GetCartOk extends getBaseOkResponseSchema<CartResponse>({
  path: '/carts',
  response: {
    message: 'Cart successfully found',
    data: {
      count: 1,
      cart: {
        id: "33d944e3-480b-49d5-82d9-644d288347b0",
        created_at: exampleDate,
        updated_at: exampleDate,
        total_price: 40000000,
        user: {
          id: "1dbae5ed-a7bd-4d58-81b0-766e1a4191dd",
          display_name: "owner"
        },
        carRents: [exampleCarRent]
      }
    }
  }
}) {}
