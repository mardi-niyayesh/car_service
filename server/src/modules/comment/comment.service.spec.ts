import type {PrismaMock} from "@/types";
import {CommentService} from "./comment.service";
import {EventEmitter2} from "@nestjs/event-emitter";
import type {PaginationValidatorType} from "@/common";
import {RedisService} from "@/modules/redis/redis.service";
import {PrismaService} from "@/modules/prisma/prisma.service";
import type {Comment} from "@/modules/prisma/generated/client";
import {afterEach, beforeEach, describe, it, expect} from "vitest";
import {type DeepMockProxy, mockDeep, mockReset} from "vitest-mock-extended";

describe('CommentService', (): void => {
  let prisma: PrismaMock;
  let service: CommentService;
  let event: DeepMockProxy<EventEmitter2>;
  let redis: DeepMockProxy<RedisService>;

  beforeEach((): void => {
    redis = mockDeep<RedisService>();
    event = mockDeep<EventEmitter2>();
    prisma = mockDeep<PrismaService>();

    service = new CommentService(redis, prisma, event);
  });

  afterEach((): void => {
    mockReset(redis);
    mockReset(event);
    mockReset(prisma);
  });

  /** ================================================
   * Find Comment Replies
   * ================================================
   */
  describe('findCommentReplies()', (): void => {
    const mockParentCommentId = 'comment-123';
    const mockDate = new Date();

    const mockPaginationInput: PaginationValidatorType = {
      limit: 10,
      offset: 0,
      orderByLower: 'desc',
      page: 1,
      orderByUpper: 'DESC',
    };

    const mockReplies = [
      {
        id: 'reply-1',
        content: 'Thanks for the review! Very helpful.',
        created_at: mockDate,
        updated_at: mockDate,
        user_id: 'user-456',
        car_id: 'car-789',
        parent_id: mockParentCommentId,
        is_confirmed: true,
        user: {
          id: 'user-456',
          display_name: 'Jane Smith',
        },
        _count: {
          replies: 2, // replies to this reply
        },
      },
      {
        id: 'reply-2',
        content: 'How much does it cost per day?',
        created_at: mockDate,
        updated_at: mockDate,
        user_id: 'user-789',
        car_id: 'car-789',
        parent_id: mockParentCommentId,
        is_confirmed: true,
        user: {
          id: 'user-789',
          display_name: 'Mike Johnson',
        },
        _count: {
          replies: 0,
        },
      },
    ];

    // success
    it('should return paginated list of confirmed replies for a parent comment', async () => {
      prisma.comment.count.mockResolvedValue(2);
      prisma.comment.findMany.mockResolvedValue(mockReplies as unknown as Comment[]);

      const result = await service.findCommentReplies(mockParentCommentId, mockPaginationInput);

      // 1. Test response structure
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('count');
      expect(result.data).toHaveProperty('comments');

      // 2. Test message
      expect(result.message).toBe('replies comment successfully found.');

      // 3. Test count and comments array
      expect(result.data.count).toBe(2);
      expect(Array.isArray(result.data.comments)).toBe(true);
      expect(result.data.comments.length).toBe(2);

      // 4. Test each reply has parent_id = mockParentCommentId
      for (const reply of result.data.comments) {
        expect(reply.parent_id).toBe(mockParentCommentId);
        expect(reply.is_confirmed).toBe(true);
      }

      // 5. Test rate field is omitted
      for (const reply of result.data.comments) {
        expect(reply).not.toHaveProperty('rate');
      }

      // 6. Test user inclusion (only id and display_name)
      const [firstReply] = result.data.comments;
      expect(firstReply.user).toBeDefined();
      expect(firstReply.user).toHaveProperty('id');
      expect(firstReply.user).toHaveProperty('display_name');
      expect(firstReply.user).not.toHaveProperty('email');
      expect(firstReply.user).not.toHaveProperty('password');

      // 7. Test replies count (replies to this reply)
      expect(firstReply._count).toBeDefined();
      expect(firstReply._count.replies).toBe(2);

      // 8. Verify count call
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.comment.count).toHaveBeenCalledWith({
        where: {
          parent_id: mockParentCommentId,
          is_confirmed: true,
        }
      });

      // 9. Verify findMany call
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.comment.findMany).toHaveBeenCalledWith({
        where: {
          parent_id: mockParentCommentId,
          is_confirmed: true,
        },
        omit: {
          rate: true
        },
        include: {
          user: {
            select: {
              id: true,
              display_name: true,
            }
          },
          _count: {
            select: {
              replies: {
                where: {is_confirmed: true}
              }
            }
          }
        },
        take: mockPaginationInput.limit,
        skip: mockPaginationInput.offset,
        orderBy: {
          created_at: mockPaginationInput.orderByLower
        },
      });
    });

    // success: empty replies (parent comment has no replies)
    it('should return count 0 and empty array when parent comment has no replies', async () => {
      prisma.comment.count.mockResolvedValue(0);
      prisma.comment.findMany.mockResolvedValue([]);

      const result = await service.findCommentReplies(mockParentCommentId, mockPaginationInput);

      expect(result.data.count).toBe(0);
      expect(result.data.comments).toEqual([]);
      expect(result.message).toBe('replies comment successfully found.');
    });

    // success: with different pagination values (ascending order)
    it('should return replies in ascending order when orderByLower is asc', async () => {
      const paginationAsc: PaginationValidatorType = {
        limit: 5,
        offset: 0,
        orderByLower: 'asc',
        page: 1,
        orderByUpper: 'ASC',
      };

      prisma.comment.count.mockResolvedValue(1);
      prisma.comment.findMany.mockResolvedValue([mockReplies[0]] as unknown as Comment[]);

      await service.findCommentReplies(mockParentCommentId, paginationAsc);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.comment.findMany).toHaveBeenCalledWith({
        where: {
          parent_id: mockParentCommentId,
          is_confirmed: true,
        },
        omit: {rate: true},
        include: {
          user: {
            select: {id: true, display_name: true}
          },
          _count: {
            select: {replies: {where: {is_confirmed: true}}}
          }
        },
        take: 5,
        skip: 0,
        orderBy: {created_at: 'asc'}
      });
    });

    // success: parent comment exists but no confirmed replies (only unconfirmed)
    it('should only return confirmed replies (is_confirmed = true)', async () => {
      prisma.comment.count.mockResolvedValue(0);
      prisma.comment.findMany.mockResolvedValue([]);

      const result = await service.findCommentReplies(mockParentCommentId, mockPaginationInput);

      expect(result.data.count).toBe(0);

      // Verify where clause includes is_confirmed: true
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.comment.count).toHaveBeenCalledWith({
        where: {
          parent_id: mockParentCommentId,
          is_confirmed: true,
        }
      });
    });
  });
});