import type {PrismaMock} from "@/types";
import {PaymentService} from "./payment.service";
import {RedisService} from "@/modules/redis/redis.service";
import {PrismaService} from "@/modules/prisma/prisma.service";
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

    prisma.$transaction.mockImplementation(async (fn) => fn(prisma));
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
  });
});
