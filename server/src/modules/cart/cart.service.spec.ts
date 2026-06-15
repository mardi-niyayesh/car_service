import type {PrismaMock, UserAccess} from "@/types";
import {afterEach, beforeEach, describe, it, expect} from "vitest";
import {CartService} from "@/modules/cart/cart.service";
import {mockDeep, mockReset} from "vitest-mock-extended";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {Cart} from "@/modules/prisma/generated/client";

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
      total_price: 550_000,
      created_at: mockDate,
      updated_at: mockDate,
      carRents: [
        {
          id: 'rent-1',
          cart_id: 'cart-456',
          car_id: 'car-789',
          days: 2,
          price_per_day: 200_000,
          total_price: 400_000,
          created_at: mockDate,
          updated_at: mockDate,
          car: {
            name: 'BMW X5',
            slug: 'bmw-x5',
            image: 'bmw-x5.png',
            company: 'BMW',
            price_per_day: 200_000,
          },
        },
        {
          id: 'rent-2',
          cart_id: 'cart-456',
          car_id: 'car-101',
          days: 1,
          price_per_day: 150_000,
          total_price: 150_000,
          created_at: mockDate,
          updated_at: mockDate,
          car: {
            name: 'Tesla Model 3',
            slug: 'tesla-model-3',
            image: 'tesla.png',
            company: 'Tesla',
            price_per_day: 150_000,
          },
        },
      ],
    };

    // success
    it('should return cart with carRents and car details for authenticated user', async () => {
      prisma.cart.findUnique.mockResolvedValue(mockCart as unknown as Cart);

      const result = await service.getCart(mockUserId, mockUserAccess);

      // 1. Test response structure
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('cart');

      // 2. Test message
      expect(result.message).toBe('Cart successfully found');

      // 3. Test cart data
      const {cart} = result.data;
      expect(cart.id).toBe(mockCart.id);
      expect(cart.total_price).toBe(550_000);
      expect(cart.created_at).toBe(mockDate);
      expect(cart.updated_at).toBe(mockDate);

      // 4. Test user data in response
      expect(cart.user).toBeDefined();
      expect(cart.user.id).toBe(mockUserAccess.userId);
      expect(cart.user.roles).toEqual(mockUserAccess.roles);
      expect(cart.user.permissions).toEqual(mockUserAccess.permissions);
      expect(cart.user.display_name).toBe(mockUserAccess.display_name);

      // 5. Test carRents array
      expect(Array.isArray(cart.carRents)).toBe(true);
      expect(cart.carRents.length).toBe(2);

      // 6. Test each carRent structure
      const [firstRent] = cart.carRents;
      expect(firstRent.id).toBe('rent-1');
      expect(firstRent.car.price_per_day).toBe(200_000);

      // 7. Test car details in each rent
      expect(firstRent.car).toBeDefined();
      expect(firstRent.car.name).toBe('BMW X5');
      expect(firstRent.car.slug).toBe('bmw-x5');
      expect(firstRent.car.image).toBe('bmw-x5.png');
      expect(firstRent.car.company).toBe('BMW');
      expect(firstRent.car.price_per_day).toBe(200_000);

      // 8. Test car does NOT have extra fields
      expect(firstRent.car).not.toHaveProperty('category_id');
      expect(firstRent.car).not.toHaveProperty('description');
      expect(firstRent.car).not.toHaveProperty('rate');

      // 9. Verify Prisma call
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.cart.findUnique).toHaveBeenCalledWith({
        where: {user_id: mockUserId},
        include: {
          carRents: {
            include: {
              car: {
                select: {
                  name: true,
                  slug: true,
                  image: true,
                  company: true,
                  price_per_day: true,
                }
              }
            }
          }
        }
      });
    });
  });
});