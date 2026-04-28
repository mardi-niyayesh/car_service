import {exampleDate} from "@/lib";
import type {CartResponse} from "@/types";
import {getBaseOkResponseSchema} from "@/common";
import {exampleCarRent} from "./add-to-cart.dto";

export class GetCartOk extends getBaseOkResponseSchema<CartResponse>({
  path: '/carts',
  response: {
    message: 'Cart successfully found',
    data: {
      cart: {
        id: "33d944e3-480b-49d5-82d9-644d288347b0",
        created_at: exampleDate,
        updated_at: exampleDate,
        total_price: 180000000,
        user: {
          id: "1dbae5ed-a7bd-4d58-81b0-766e1a4191dd",
          roles: [
            "self"
          ],
          permissions: [
            "user.self"
          ],
          display_name: "owner"
        },
        carRents: [exampleCarRent]
      }
    }
  }
}) {}