import type {PrismaMock} from "@/types";
import {afterEach, beforeEach, describe} from "vitest";
import {CartService} from "@/modules/cart/cart.service";
import {mockDeep, mockReset} from "vitest-mock-extended";
import {PrismaService} from "@/modules/prisma/prisma.service";

describe('CartService', (): void => {
  let prisma: PrismaMock;
  let service: CartService;

  beforeEach((): void => {
    prisma = mockDeep<PrismaService>();
    service = new CartService(prisma);
  });

  afterEach((): void => {
    mockReset(prisma);
  });

  /** ================================================
   * Get Cart
   * ================================================
   */
  describe('getCart()', (): void => {
    const mockUserId = 'user-123';
    const mockDate = new Date();

    const mockUserAccess: UserAccess = {
      userId: mockUserId,
      roles: ['user'],
      permissions: ['user.self'],
      display_name: 'John Doe',
    };

    const mockCart = {
      id: 'cart-456',
      user_id: mockUserId,
      total_price: 550000,
      created_at: mockDate,
      updated_at: mockDate,
      carRents: [
        {
          id: 'rent-1',
          cart_id: 'cart-456',
          car_id: 'car-789',
          days: 2,
          price_per_day: 200000,
          total_price: 400000,
          created_at: mockDate,
          updated_at: mockDate,
          car: {
            name: 'BMW X5',
            slug: 'bmw-x5',
            image: 'bmw-x5.png',
            company: 'BMW',
            price_per_day: 200000,
          },
        },
        {
          id: 'rent-2',
          cart_id: 'cart-456',
          car_id: 'car-101',
          days: 1,
          price_per_day: 150000,
          total_price: 150000,
          created_at: mockDate,
          updated_at: mockDate,
          car: {
            name: 'Tesla Model 3',
            slug: 'tesla-model-3',
            image: 'tesla.png',
            company: 'Tesla',
            price_per_day: 150000,
          },
        },
      ],
    };

  });
});