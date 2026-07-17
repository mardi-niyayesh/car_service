import type {PrismaMock} from "@/types";
import {PaymentService} from "./payment.service";
import {RedisService} from "@/modules/redis/redis.service";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {ConflictException, NotFoundException} from "@nestjs/common";
import {describe, beforeEach, afterEach, expect, it, vi} from "vitest";
import {type DeepMockProxy, mockDeep, mockReset} from "vitest-mock-extended";
import {CarRent, Payment, PaymentStatus, RentStatus} from "@/modules/prisma/generated/client";

describe('PaymentService', (): void => {
  let prisma: PrismaMock;
  let service: PaymentService;
  let redis: DeepMockProxy<RedisService>;

  // Start All
  beforeEach((): void => {
    redis = mockDeep<RedisService>();
    prisma = mockDeep<PrismaService>();
    service = new PaymentService(prisma, redis);
  });

  afterEach((): void => {
    mockReset(redis);
    mockReset(prisma);
  });

  const mockDate = new Date();
  const mockUserId = 'user-123';
  const mockCarRentId = 'rent-789';
  const mockPaymentId = 'pay-456';

  const mockCarRent: CarRent = {
    id: mockCarRentId,
    price: 400000,
    description: 'Need car for business trip',
    car_id: 'car-789',
    end_date: new Date('2024-12-22'),
    start_date: new Date('2024-12-20'),
    cart_id: 'cart-456',
    status: RentStatus.PENDING,
    created_at: mockDate,
    updated_at: mockDate,
  };

  const mockPayment: Payment = {
    id: mockPaymentId,
    status: PaymentStatus.SUCCESS,
    amount: 400000,
    transaction_id: 'TXN-1234567890-abc123',
    car_rent_id: mockCarRentId,
    created_at: mockDate,
    updated_at: mockDate,
  };

  /** ================================================
   * Payment
   * ================================================
   */
  describe('payment()', (): void => {
    // success: payment successful
    it('should process payment successfully when successRate is high enough', async (): Promise<void> => {
      const carRentWithPayment = {
        ...mockCarRent,
        payment: null,
      };

      prisma.carRent.findUnique.mockResolvedValue(carRentWithPayment as unknown as CarRent);
      prisma.payment.create.mockResolvedValue(mockPayment);
      prisma.carRent.update.mockResolvedValue({
        ...mockCarRent,
        status: RentStatus.ACTIVE,
      } as unknown as CarRent);

      // Mock Math.random to return a value that ensures success (<= 80)
      const mockMathRandom = vi.spyOn(Math, 'random').mockReturnValue(0.5);

      const result = await service.payment(mockUserId, mockCarRentId, 80);

      // 1. Test response structure
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('payment');

      // 2. Test success message
      expect(result.message).toBe('Payment completed successfully.');

      // 3. Test payment data
      const {payment} = result.data;
      expect(payment.id).toBe(mockPayment.id);
      expect(payment.status).toBe(PaymentStatus.SUCCESS);
      expect(payment.amount).toBe(mockCarRent.price);
      expect(payment.transaction_id).toBeDefined();

      // 4. Verify Prisma calls
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.carRent.findUnique).toHaveBeenCalledWith({
        where: {
          id: mockCarRentId,
          cart: {
            user_id: mockUserId
          }
        },
        include: {
          payment: true
        }
      });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.payment.create).toHaveBeenCalledWith({
        data: {
          status: PaymentStatus.SUCCESS,
          amount: mockCarRent.price,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          transaction_id: expect.stringContaining('TXN-'),
          car_rent_id: mockCarRent.id
        }
      });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.carRent.update).toHaveBeenCalledWith({
        where: {id: mockCarRent.id},
        data: {
          status: RentStatus.ACTIVE
        }
      });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(redis.deletePrefix).toHaveBeenCalledWith(expect.stringContaining('cart'));

      mockMathRandom.mockRestore();
    });

    // success: payment failed
    it('should process payment as failed when successRate is too low', async (): Promise<void> => {
      const carRentWithPayment = {
        ...mockCarRent,
        payment: null,
      };

      const failedPayment = {
        ...mockPayment,
        status: PaymentStatus.FAILED,
        transaction_id: null,
      };

      prisma.carRent.findUnique.mockResolvedValue(carRentWithPayment as unknown as CarRent);
      prisma.payment.create.mockResolvedValue(failedPayment as unknown as Payment);

      // Mock Math.random to return a value that ensures failure (> 80)
      const mockMathRandom = vi.spyOn(Math, 'random').mockReturnValue(0.9);

      const result = await service.payment(mockUserId, mockCarRentId, 80);

      expect(result.message).toBe('Payment failed. Please try again.');
      expect(result.data.payment.status).toBe(PaymentStatus.FAILED);
      expect(result.data.payment.transaction_id).toBeNull();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.carRent.update).not.toHaveBeenCalled();

      mockMathRandom.mockRestore();
    });

    // error: already paid
    it('should throw ConflictException when payment already exists and is successful', async (): Promise<void> => {
      const carRentWithExistingPayment = {
        ...mockCarRent,
        payment: {
          ...mockPayment,
          status: PaymentStatus.SUCCESS,
        },
      };

      prisma.carRent.findUnique.mockResolvedValue(carRentWithExistingPayment as unknown as CarRent);

      // noinspection ES6RedundantAwait
      await expect(service.payment(mockUserId, mockCarRentId))
        .rejects
        .toThrow(ConflictException);

      await expect(service.payment(mockUserId, mockCarRentId))
        .rejects
        .toMatchObject({
          response: {
            message: 'This car rent has already been paid.',
            error: 'Payment Already Exists'
          }
        });
    });

    // success: retry failed payment
    it('should retry payment when previous payment failed', async (): Promise<void> => {
      const carRentWithFailedPayment = {
        ...mockCarRent,
        payment: {
          ...mockPayment,
          id: mockPaymentId,
          status: PaymentStatus.FAILED,
          transaction_id: null,
        },
      };

      const updatedPayment = {
        ...mockPayment,
        status: PaymentStatus.SUCCESS,
        transaction_id: 'TXN-1234567890-xyz789',
      };

      prisma.carRent.findUnique.mockResolvedValue(carRentWithFailedPayment as unknown as CarRent);
      prisma.payment.update.mockResolvedValue(updatedPayment as unknown as Payment);
      prisma.carRent.update.mockResolvedValue({
        ...mockCarRent,
        status: RentStatus.ACTIVE,
      } as unknown as CarRent);

      const mockMathRandom = vi.spyOn(Math, 'random').mockReturnValue(0.5);

      const result = await service.payment(mockUserId, mockCarRentId, 80);

      expect(result.message).toBe('Payment completed successfully.');
      expect(result.data.payment.status).toBe(PaymentStatus.SUCCESS);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.payment.update).toHaveBeenCalledWith({
        where: {id: mockPaymentId},
        data: {
          status: PaymentStatus.SUCCESS,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          transaction_id: expect.stringContaining('TXN-'),
        }
      });

      mockMathRandom.mockRestore();
    });

    // edge case: retry failed payment with failure again
    it('should keep payment as failed when retry also fails', async (): Promise<void> => {
      const carRentWithFailedPayment = {
        ...mockCarRent,
        payment: {
          ...mockPayment,
          id: mockPaymentId,
          status: PaymentStatus.FAILED,
          transaction_id: null,
        },
      };

      const updatedPayment = {
        ...mockPayment,
        status: PaymentStatus.FAILED,
        transaction_id: null,
      };

      prisma.carRent.findUnique.mockResolvedValue(carRentWithFailedPayment as unknown as CarRent);
      prisma.payment.update.mockResolvedValue(updatedPayment as unknown as Payment);

      const mockMathRandom = vi.spyOn(Math, 'random').mockReturnValue(0.9);

      const result = await service.payment(mockUserId, mockCarRentId, 80);

      expect(result.message).toBe('Payment failed. Please try again.');
      expect(result.data.payment.status).toBe(PaymentStatus.FAILED);
      expect(result.data.payment.transaction_id).toBeNull();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.carRent.update).not.toHaveBeenCalled();

      mockMathRandom.mockRestore();
    });

    // edge case: car rent belongs to different user
    it('should throw NotFoundException when car rent belongs to another user', async (): Promise<void> => {
      prisma.carRent.findUnique.mockResolvedValue(null);

      const differentUserId = 'user-456';

      // noinspection ES6RedundantAwait
      await expect(service.payment(differentUserId, mockCarRentId))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  /** ================================================
   * Find All Payments
   * ================================================
   */
  describe('findAll()', (): void => {
    const mockCartId = 'cart-456';
    const mockDate = new Date();

    const mockPayments = [
      {
        id: 'pay-1',
        status: PaymentStatus.SUCCESS,
        amount: 400000,
        transaction_id: 'TXN-123-abc',
        car_rent_id: 'rent-1',
        created_at: mockDate,
        updated_at: mockDate,
      },
      {
        id: 'pay-2',
        status: PaymentStatus.FAILED,
        amount: 150000,
        transaction_id: null,
        car_rent_id: 'rent-2',
        created_at: new Date(mockDate.getTime() - 86400000), // yesterday
        updated_at: new Date(mockDate.getTime() - 86400000),
      },
    ];

    const mockPaginationInput = {
      limit: 10,
      offset: 0,
      page: 1,
      orderByLower: 'desc',
      orderByUpper: 'DESC',
      status: PaymentStatus.SUCCESS,
    };

    // success
    it('should return paginated list of payments with filters applied', async (): Promise<void> => {
      prisma.payment.count.mockResolvedValue(2);
      prisma.payment.findMany.mockResolvedValue(mockPayments as unknown as Payment[]);

      const result = await service.findAll(mockCartId, mockPaginationInput);

      // 1. Test response structure
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('count');
      expect(result.data).toHaveProperty('payments');

      // 2. Test message
      expect(result.message).toBe('Payments find successfully.');

      // 3. Test count and payments array
      expect(result.data.count).toBe(2);
      expect(Array.isArray(result.data.payments)).toBe(true);
      expect(result.data.payments.length).toBe(2);

      // 4. Test payment structure
      const [firstPayment] = result.data.payments;
      expect(firstPayment.id).toBe(mockPayments[0].id);
      expect(firstPayment.status).toBe(PaymentStatus.SUCCESS);
      expect(firstPayment.amount).toBe(400000);
      expect(firstPayment.transaction_id).toBeDefined();
      expect(firstPayment.car_rent_id).toBe('rent-1');

      // 5. Verify count call
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.payment.count).toHaveBeenCalledWith({
        where: {
          status: mockPaginationInput.status,
          car_rent: {
            cart_id: mockCartId
          }
        }
      });

      // 6. Verify findMany call
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.payment.findMany).toHaveBeenCalledWith({
        where: {
          status: mockPaginationInput.status,
          car_rent: {
            cart_id: mockCartId
          }
        },
        take: mockPaginationInput.limit,
        skip: mockPaginationInput.offset,
        orderBy: {
          created_at: mockPaginationInput.orderByLower
        }
      });
    })
  });
});
