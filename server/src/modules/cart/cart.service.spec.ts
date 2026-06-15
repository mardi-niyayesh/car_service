import * as CartDto from "./dto";
import type {PrismaMock, UserAccess} from "@/types";
import {CarRent, Cart, Prisma} from "@/modules/prisma/generated/client";
import {CartService} from "@/modules/cart/cart.service";
import {mockDeep, mockReset} from "vitest-mock-extended";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {ConflictException, NotFoundException} from "@nestjs/common";
import {afterEach, beforeEach, describe, it, expect, vi} from "vitest";

describe('CartService', (): void => {
  let prisma: PrismaMock;
  let service: CartService;

  beforeEach((): void => {
    prisma = mockDeep<PrismaService>();
    service = new CartService(prisma);

    // mock transaction
    prisma.$transaction.mockImplementation(async (fn) => fn(prisma));
  });

  afterEach((): void => {
    mockReset(prisma);
  });

  /** ================================================
   * Get Cart
   *  ================================================
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

    // success: empty cart (no carRents)
    it('should return empty cart when user has no items in cart', async () => {
      const emptyCart = {
        id: 'cart-456',
        user_id: mockUserId,
        total_price: 0,
        created_at: mockDate,
        updated_at: mockDate,
        carRents: [],
      };

      prisma.cart.findUnique.mockResolvedValue(emptyCart as unknown as Cart);

      const result = await service.getCart(mockUserId, mockUserAccess);

      expect(result.data.cart.carRents).toEqual([]);
      expect(result.data.cart.total_price).toBe(0);
      expect(result.message).toBe('Cart successfully found');
    });

    // error: cart not found
    it('should throw NotFoundException when cart does not exist for user', async () => {
      prisma.cart.findUnique.mockResolvedValue(null);

      await expect(service.getCart(mockUserId, mockUserAccess))
        .rejects
        .toThrow(NotFoundException);

      await expect(service.getCart(mockUserId, mockUserAccess))
        .rejects
        .toMatchObject({
          response: {
            message: 'Cart not found in database, please contact to administrator',
            error: 'Cart not found.'
          }
        });

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

    // error: user_id doesn't match any cart
    it('should throw NotFoundException when user_id is invalid', async () => {
      const invalidUserId = 'non-existent-user';

      prisma.cart.findUnique.mockResolvedValue(null);

      await expect(service.getCart(invalidUserId, mockUserAccess))
        .rejects
        .toThrow(NotFoundException);
    });

    // edge case: cart exists but carRents have null car (should not happen but handle)
    it('should handle cart with carRents that have missing car data', async () => {
      const cartWithNullCar = {
        ...mockCart,
        carRents: [
          {
            ...mockCart.carRents[0],
            car: null,
          },
        ],
      };

      prisma.cart.findUnique.mockResolvedValue(cartWithNullCar as unknown as Cart);

      const result = await service.getCart(mockUserId, mockUserAccess);

      expect(result.data.cart.carRents[0].car).toBeNull();
    });
  });

  /** ================================================
   * Add To Cart
   *  ================================================
   */
  describe('addToCart()', (): void => {
    const mockUserId = 'user-123';
    const mockCartId = 'cart-456';
    const mockCarId = 'car-789';
    const mockDate = new Date();

    const mockAddToCartInput: CartDto.AddToCartType = {
      car_slug: 'bmw-x5',
      start_date: '2024-12-20',
      end_date: '2024-12-22',
      description: 'Need car for business trip',
      daysCount: 2,
    };

    const mockCar = {
      id: mockCarId,
      name: 'BMW X5',
      slug: 'bmw-x5',
      company: 'BMW',
      price_per_day: 200000,
      description: 'Luxury SUV',
      rate: 5,
      can_rent: true,
      in_rent: false,
      image: 'bmw-x5.png',
      category_id: 'cat-123',
      created_at: mockDate,
      updated_at: mockDate,
      category: {
        id: 'cat-123',
        name: 'SUV',
        slug: 'suv',
        description: 'SUV category',
      },
      carRents: [], // no conflicting rents
    };

    const mockUserWithCart = {
      id: mockUserId,
      email: 'john@example.com',
      display_name: 'John Doe',
      cart: {
        id: mockCartId,
      },
    };

    const mockCreatedCarRent = {
      id: 'rent-789',
      price: 400000, // 2 days * 200000
      description: 'Need car for business trip',
      car_id: mockCarId,
      end_date: new Date('2024-12-22'),
      start_date: new Date('2024-12-20'),
      cart_id: mockCartId,
      status: 'PENDING',
      created_at: mockDate,
      updated_at: mockDate,
    };

    // success
    it('should add car to cart successfully when no date conflicts exist', async () => {
      prisma.$transaction.mockImplementation(async (callback) => {
        const tx = {
          car: {
            findUnique: vi.fn().mockResolvedValue(mockCar),
          },
          user: {
            findUnique: vi.fn().mockResolvedValue(mockUserWithCart),
          },
          carRent: {
            create: vi.fn().mockResolvedValue(mockCreatedCarRent),
          },
          cart: {
            update: vi.fn().mockResolvedValue({}),
          },
        } as unknown as PrismaService;

        return callback(tx);
      });

      const result = await service.addToCart(mockUserId, mockAddToCartInput);

      // 1. Test response structure
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('carRent');

      // 2. Test message
      expect(result.message).toBe('car rent successfully add to your cart');

      // 3. Test carRent data
      const {carRent} = result.data;
      expect(carRent.id).toBe(mockCreatedCarRent.id);
      expect(carRent.price).toBe(400000);
      expect(carRent.description).toBe(mockAddToCartInput.description);
      expect(carRent.status).toBe('PENDING');

      // 4. Test car is included in response
      expect(carRent.car).toBeDefined();
      expect(carRent.car.id).toBe(mockCarId);
      expect(carRent.car.name).toBe('BMW X5');
      expect(carRent.car.slug).toBe('bmw-x5');
      expect(carRent.car).not.toHaveProperty('creator_id');
      expect(carRent.car.category).not.toHaveProperty('creator_id');
    });

    // error: car not found
    it('should throw NotFoundException when car slug does not exist', async () => {
      prisma.$transaction.mockImplementation(async (fn) => {
        const tx = {
          car: {findUnique: vi.fn().mockResolvedValue(null)},
        } as unknown as PrismaService;

        return fn(tx);
      });

      await expect(service.addToCart(mockUserId, mockAddToCartInput))
        .rejects
        .toThrow(NotFoundException);

      await expect(service.addToCart(mockUserId, mockAddToCartInput))
        .rejects
        .toMatchObject({
          response: {
            message: 'This car slug does not exist in database',
            error: 'Car slug not found.'
          }
        });
    });

    // error: date conflict (car already rented in period)
    it('should throw ConflictException when car has overlapping rental dates', async () => {
      const conflictingCar = {
        ...mockCar,
        carRents: [
          {
            id: 'existing-rent',
            start_date: new Date('2024-12-21'),
            end_date: new Date('2024-12-23'),
          },
        ],
      };

      prisma.$transaction.mockImplementation(async (fn) => {
        const tx = {
          car: {findUnique: vi.fn().mockResolvedValue(conflictingCar)},
        } as unknown as PrismaService;

        return fn(tx);
      });

      await expect(service.addToCart(mockUserId, mockAddToCartInput))
        .rejects
        .toThrow(ConflictException);

      await expect(service.addToCart(mockUserId, mockAddToCartInput))
        .rejects
        .toMatchObject({
          response: {
            message: 'The selected car is already rented for all or part of the requested period. Please choose different dates or another car.',
            error: 'Car Rental Conflict'
          }
        });
    });

    // error: user cart not found
    it('should throw NotFoundException when user has no cart', async () => {
      const userWithoutCart = {
        id: mockUserId,
        email: 'john@example.com',
        display_name: 'John Doe',
        cart: null,
      };

      prisma.$transaction.mockImplementation(async (fn) => {
        const tx = {
          car: {findUnique: vi.fn().mockResolvedValue(mockCar)},
          user: {findUnique: vi.fn().mockResolvedValue(userWithoutCart)},
        } as unknown as PrismaService;

        return fn(tx);
      });

      await expect(service.addToCart(mockUserId, mockAddToCartInput))
        .rejects
        .toThrow(NotFoundException);

      await expect(service.addToCart(mockUserId, mockAddToCartInput))
        .rejects
        .toMatchObject({
          response: {
            message: 'User Cart does not exist in database, please contact to administrator',
            error: 'User Cart not found.'
          }
        });
    });

    // error: user not found
    it('should throw NotFoundException when user does not exist', async () => {
      prisma.$transaction.mockImplementation(async (fn) => {
        const tx = {
          car: {findUnique: vi.fn().mockResolvedValue(mockCar)},
          user: {findUnique: vi.fn().mockResolvedValue(null)},
        } as unknown as PrismaService;

        return fn(tx);
      });

      await expect(service.addToCart(mockUserId, mockAddToCartInput))
        .rejects
        .toThrow(NotFoundException);
    });

    // success: without description
    it('should add car to cart without description when not provided', async () => {
      const inputWithoutDesc = {
        ...mockAddToCartInput,
        description: undefined,
      };

      const createdRentWithoutDesc = {
        ...mockCreatedCarRent,
        description: null,
      };

      prisma.$transaction.mockImplementation(async (fn) => {
        const tx = {
          car: {findUnique: vi.fn().mockResolvedValue(mockCar)},
          user: {findUnique: vi.fn().mockResolvedValue(mockUserWithCart)},
          carRent: {create: vi.fn().mockResolvedValue(createdRentWithoutDesc)},
          cart: {update: vi.fn().mockResolvedValue({})},
        } as unknown as PrismaService;

        return fn(tx);
      });

      const result = await service.addToCart(mockUserId, inputWithoutDesc);

      expect(result.data.carRent.description).toBeNull();
    });

    // verify price calculation
    it('should calculate price correctly as daysCount * car.price_per_day', async () => {
      const expectedPrice = mockAddToCartInput.daysCount * mockCar.price_per_day; // 2 * 200000 = 400000

      prisma.$transaction.mockImplementation(async (fn) => {
        const tx = {
          car: {findUnique: vi.fn().mockResolvedValue(mockCar)},
          user: {findUnique: vi.fn().mockResolvedValue(mockUserWithCart)},
          carRent: {create: vi.fn().mockResolvedValue(mockCreatedCarRent)},
          cart: {update: vi.fn().mockResolvedValue({})},
        } as unknown as PrismaService;

        return fn(tx);
      });

      const result = await service.addToCart(mockUserId, mockAddToCartInput);

      expect(result.data.carRent.price).toBe(expectedPrice);
    });

    // verify cart total_price increment
    it('should increment cart total_price by rent price', async () => {
      let cartUpdateCalledWith: null | object = null;

      prisma.$transaction.mockImplementation(async (fn) => {
        const tx = {
          car: {findUnique: vi.fn().mockResolvedValue(mockCar)},
          user: {findUnique: vi.fn().mockResolvedValue(mockUserWithCart)},
          carRent: {create: vi.fn().mockResolvedValue(mockCreatedCarRent)},
          cart: {
            update: vi.fn().mockImplementation(({data}: { data: object; }) => {
              cartUpdateCalledWith = data;
              return Promise.resolve({});
            })
          },
        } as unknown as PrismaService;

        return fn(tx);
      });

      await service.addToCart(mockUserId, mockAddToCartInput);

      expect(cartUpdateCalledWith).toEqual({
        total_price: {increment: 400000}
      });
    });
  });

  /** ================================================
   * Remove From Cart
   *  ================================================
   */
  describe('removeFromCart()', (): void => {
    const mockUserId = 'user-123';
    const mockRentId = 'rent-789';
    const mockCartId = 'cart-456';
    const mockDate = new Date();

    const mockCarRent = {
      id: mockRentId,
      price: 400000,
      description: 'Need car for business trip',
      car_id: 'car-789',
      end_date: new Date('2024-12-22'),
      start_date: new Date('2024-12-20'),
      cart_id: mockCartId,
      status: 'PENDING',
      created_at: mockDate,
      updated_at: mockDate,
    };

    // success
    it('should remove car rent from cart and decrement total_price', async () => {
      prisma.carRent.delete.mockResolvedValue(mockCarRent as unknown as CarRent);
      prisma.cart.update.mockResolvedValue({} as unknown as Cart);

      const result = await service.removeFromCart(mockUserId, mockRentId);

      // 1. Test response structure
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('carRent');

      // 2. Test message
      expect(result.message).toBe('car rent successfully removed from the cart');

      // 3. Test returned carRent data
      const {carRent} = result.data;
      expect(carRent.id).toBe(mockRentId);
      expect(carRent.price).toBe(400000);
      expect(carRent.status).toBe('PENDING');

      // 4. Verify delete call with correct where clause
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.carRent.delete).toHaveBeenCalledWith({
        where: {
          id: mockRentId,
          cart: {
            user_id: mockUserId
          }
        }
      });

      // 5. Verify cart update with decrement
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.cart.update).toHaveBeenCalledWith({
        where: {
          user_id: mockUserId
        },
        data: {
          total_price: {
            decrement: mockCarRent.price
          }
        }
      });
    });

    // success: rent removed and cart total_price updated correctly
    it('should decrement cart total_price by exact rent price', async () => {
      prisma.carRent.delete.mockResolvedValue(mockCarRent as unknown as CarRent);

      const updateSpy = vi.fn().mockResolvedValue({
        id: mockCartId,
        user_id: mockUserId,
        total_price: 150000,
        created_at: mockDate,
        updated_at: mockDate,
      });

      prisma.cart.update.mockImplementation(updateSpy);

      await service.removeFromCart(mockUserId, mockRentId);

      expect(updateSpy).toHaveBeenCalledWith({
        where: {user_id: mockUserId},
        data: {total_price: {decrement: 400000}}
      });
    });

    // error: rent not found in user's cart
    it('should throw NotFoundException when rent does not belong to user or does not exist', async () => {
      const prismaError = new Error('Record not found');
      (prismaError as Prisma.PrismaClientKnownRequestError).code = 'P2025';

      prisma.carRent.delete.mockRejectedValue(prismaError);

      await expect(service.removeFromCart(mockUserId, mockRentId))
        .rejects
        .toThrow(NotFoundException);

      await expect(service.removeFromCart(mockUserId, mockRentId))
        .rejects
        .toMatchObject({
          response: {
            message: 'Car Rent not found in your cart, please check later.',
            error: 'Car Rent not found'
          }
        });

      // Verify cart.update was NOT called
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.cart.update).not.toHaveBeenCalled();
    });

    // error: rent belongs to different user
    it('should throw NotFoundException when rent belongs to another user', async () => {
      // The where clause includes cart.user_id, so Prisma won't find it
      const prismaError = new Error('Record not found');
      (prismaError as Prisma.PrismaClientKnownRequestError).code = 'P2025';

      prisma.carRent.delete.mockRejectedValue(prismaError);

      const differentUserId = 'user-456';

      await expect(service.removeFromCart(differentUserId, mockRentId))
        .rejects
        .toThrow(NotFoundException);
    });

    // error: invalid rent_id format
    it('should throw NotFoundException when rent_id does not exist', async () => {
      const invalidRentId = 'non-existent-rent';
      const prismaError = new Error('Record not found');
      (prismaError as Prisma.PrismaClientKnownRequestError).code = 'P2025';

      prisma.carRent.delete.mockRejectedValue(prismaError);

      await expect(service.removeFromCart(mockUserId, invalidRentId))
        .rejects
        .toThrow(NotFoundException);
    });
  });
});