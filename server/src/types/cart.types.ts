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
            image: true;
            slug: true;
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