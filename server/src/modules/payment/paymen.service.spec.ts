import type {PrismaMock} from "@/types";
import {PaymentService} from "./payment.service";
import {describe, beforeEach, afterEach} from "vitest";
import {RedisService} from "@/modules/redis/redis.service";
import {PrismaService} from "@/modules/prisma/prisma.service";
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

  });
});
