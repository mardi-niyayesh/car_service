import type {UserAccess, SafeCarNCategory} from "./";
import type {CarRent, Prisma} from "@/modules/prisma/generated/client";

type CartIncludeResponseType = Prisma.CartGetPayload<{
  omit: {
    user_id: true;
  };

  include: {
    carRents: {
      include: {
        car: {
          select: {
            name: true;
            slug: true;
            image: true;
            company: true;
            price_per_day: true;
          }
        }
      }
    }
  }
}>;

export interface CreateCartSignup {
  id: string;
}

/** cart api response */
export interface CartResponse {
  cart: CartIncludeResponseType & {
    total_price: number;
    user: Pick<UserAccess, 'permissions' | 'roles' | 'display_name'> & {
      id: string;
    }
  };
}

/** typeof car rent response */
export interface CarRentResponse {
  carRent: CarRent & SafeCarNCategory;
}

/** typeof remove car rent response */
export interface RemoveCarRentResponse {
  carRent: CarRent;
}
