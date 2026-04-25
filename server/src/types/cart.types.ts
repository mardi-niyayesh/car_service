import {UserAccess} from "@/types/request.types";
import {Prisma} from "@/modules/prisma/generated/client";

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