import type {PrismaMock} from "@/types";
import {CommentService} from "./comment.service";
import {NotFoundException} from "@nestjs/common";
import * as CommentDto from "@/modules/comment/dto";
import {EventEmitter2} from "@nestjs/event-emitter";
import type {PaginationValidatorType} from "@/common";
import {RedisService} from "@/modules/redis/redis.service";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {afterEach, beforeEach, describe, it, expect} from "vitest";
import type {Comment, Prisma} from "@/modules/prisma/generated/client";
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

    // edge case: pagination with offset (page 2)
    it('should apply correct offset when page is 2', async () => {
      const paginationPage2: PaginationValidatorType = {
        limit: 10,
        offset: 10,
        orderByLower: 'desc',
        page: 2,
        orderByUpper: 'DESC',
      };

      prisma.comment.count.mockResolvedValue(15);
      prisma.comment.findMany.mockResolvedValue([mockReplies[0]] as unknown as Comment[]);

      await service.findCommentReplies(mockParentCommentId, paginationPage2);

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
        take: 10,
        skip: 10,
        orderBy: {created_at: 'desc'}
      });
    });
  });

  /** ================================================
   * Create
   * ================================================
   */
  describe('create()', (): void => {
    const mockCarId = 'car-789';
    const mockUserId = 'user-123';
    const mockDate = new Date();

    const mockCreateCommentInput = {
      content: 'This car is amazing! Very comfortable ride.',
      rate: 5,
      parent_id: null,
    };

    const mockCreatedComment = {
      id: 'comment-456',
      content: 'This car is amazing! Very comfortable ride.',
      rate: 5,
      parent_id: null,
      creator_id: mockUserId,
      car_id: mockCarId,
      is_confirmed: false, // needs admin approval
      created_at: mockDate,
      updated_at: mockDate,
    };

    // success: create top-level comment (no parent)
    it('should create a top-level comment successfully when parent_id is null', async () => {
      prisma.comment.create.mockResolvedValue(mockCreatedComment as unknown as Comment);

      const result = await service.create(mockCarId, mockUserId, mockCreateCommentInput);

      // 1. Test response structure
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('comment');

      // 2. Test success message
      expect(result.message).toBe('comment created successfully.');

      // 3. Test created comment data
      const {comment} = result.data;
      expect(comment.id).toBe(mockCreatedComment.id);
      expect(comment.content).toBe(mockCreateCommentInput.content);
      expect(comment.rate).toBe(mockCreateCommentInput.rate);
      expect(comment.parent_id).toBeNull();
      expect(comment.creator_id).toBe(mockUserId);
      expect(comment.car_id).toBe(mockCarId);
      expect(comment.is_confirmed).toBe(false);

      // 4. Verify Prisma create call
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.comment.create).toHaveBeenCalledWith({
        data: {
          ...mockCreateCommentInput,
          creator_id: mockUserId,
          car_id: mockCarId
        }
      });
    });

    // success: create reply to existing parent comment
    it('should create a reply successfully when parent_id exists and is valid', async () => {
      const mockParentCommentId = 'parent-123';
      const mockReplyInput = {
        content: 'Thanks for the review!',
        rate: 4,
        parent_id: mockParentCommentId,
      };

      const mockParentComment = {
        id: mockParentCommentId,
        content: 'Original comment',
        parent_id: null,
        is_confirmed: true,
      };

      const mockCreatedReply = {
        id: 'reply-456',
        content: 'Thanks for the review!',
        rate: 4,
        parent_id: mockParentCommentId,
        creator_id: mockUserId,
        car_id: mockCarId,
        is_confirmed: false,
        created_at: mockDate,
        updated_at: mockDate,
      };

      prisma.comment.findUnique.mockResolvedValue(mockParentComment as unknown as Comment);
      prisma.comment.create.mockResolvedValue(mockCreatedReply as unknown as Comment);

      const result = await service.create(mockCarId, mockUserId, mockReplyInput);

      // 1. Verify parent comment check was called
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.comment.findUnique).toHaveBeenCalledWith({
        where: {id: mockParentCommentId}
      });

      // 2. Test reply data
      expect(result.data.comment.parent_id).toBe(mockParentCommentId);
      expect(result.data.comment.content).toBe(mockReplyInput.content);

      // 3. Verify create call with reply data
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.comment.create).toHaveBeenCalledWith({
        data: {
          ...mockReplyInput,
          creator_id: mockUserId,
          car_id: mockCarId
        }
      });
    });

    // success: create comment without rate (uses default 5)
    it('should use default rate 5 when rate is not provided', async () => {
      const inputWithoutRate = {
        content: 'Good car.',
        parent_id: null,
      } as CommentDto.CreateCommentType;

      const commentWithDefaultRate = {
        ...mockCreatedComment,
        content: 'Good car.',
        rate: 5, // default
      };

      prisma.comment.create.mockResolvedValue(commentWithDefaultRate as unknown as Comment);

      const result = await service.create(mockCarId, mockUserId, inputWithoutRate);

      expect(result.data.comment.rate).toBe(5);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.comment.create).toHaveBeenCalledWith({
        data: {
          ...inputWithoutRate,
          creator_id: mockUserId,
          car_id: mockCarId
        }
      });
    });

    // error: parent comment not found
    it('should throw NotFoundException when parent_id does not exist in database', async () => {
      const invalidParentId = 'non-existent-parent';
      const replyInput = {
        content: 'This is a reply',
        parent_id: invalidParentId,
      } as CommentDto.CreateCommentType;

      prisma.comment.findUnique.mockResolvedValue(null);

      await expect(service.create(mockCarId, mockUserId, replyInput))
        .rejects
        .toThrow(NotFoundException);

      await expect(service.create(mockCarId, mockUserId, replyInput))
        .rejects
        .toMatchObject({
          response: {
            message: 'parent comment not found in database, please try again and sure parent_id is exist',
            error: 'parent comment not found'
          }
        });

      // Verify create was NOT called
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.comment.create).not.toHaveBeenCalled();
    });

    // error: car not found (foreign key constraint P2003)
    it('should throw NotFoundException when car_id does not exist', async () => {
      const prismaError = new Error('Foreign key constraint failed');
      (prismaError as Prisma.PrismaClientKnownRequestError).code = 'P2003';
      (prismaError as Prisma.PrismaClientKnownRequestError).meta = {field_name: 'car_id'};

      prisma.comment.create.mockRejectedValue(prismaError);

      await expect(service.create(mockCarId, mockUserId, mockCreateCommentInput))
        .rejects
        .toMatchObject({
          code: 'P2003',
          meta: {field_name: 'car_id'}
        });
    });

    // error: reply to parent that doesn't exist (combined scenario)
    it('should check parent existence before creating reply', async () => {
      const replyInput = {
        content: 'Reply to nowhere',
        parent_id: 'fake-parent-id',
      } as CommentDto.CreateCommentType;

      prisma.comment.findUnique.mockResolvedValue(null);

      await service.create(mockCarId, mockUserId, replyInput).catch(() => {});

      // Verify findUnique was called but create was NOT
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.comment.findUnique).toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.comment.create).not.toHaveBeenCalled();
    });
  });

  /** ================================================
   * Find All Unconfirmed Comments
   * ================================================
   */
  describe('findAllUnconfirmed()', (): void => {
    const mockDate = new Date();
    const mockCarId = 'car-789';

    const mockPaginationInput: CommentDto.FindUnconfirmedValidatorType = {
      limit: 10,
      offset: 0,
      orderByLower: 'desc',
      page: 1,
      order: 'desc',
    };

    const mockUnconfirmedComments = [
      {
        id: 'comment-1',
        content: 'This car looks great!',
        rate: 5,
        parent_id: null,
        creator_id: 'user-123',
        car_id: mockCarId,
        is_confirmed: false,
        created_at: mockDate,
        updated_at: mockDate,
        user: {
          id: 'user-123',
          display_name: 'John Doe',
          email: 'john@example.com',
          password: 'hashed-password', // should be omitted
        },
        car: {
          id: mockCarId,
          name: 'BMW X5',
          slug: 'bmw-x5',
          company: 'BMW',
          price_per_day: 200000,
        },
      },
      {
        id: 'comment-2',
        content: 'Is this available for long term?',
        rate: 4,
        parent_id: null,
        creator_id: 'user-456',
        car_id: 'car-456',
        is_confirmed: false,
        created_at: mockDate,
        updated_at: mockDate,
        user: {
          id: 'user-456',
          display_name: 'Jane Smith',
          email: 'jane@example.com',
          password: 'hashed-password', // should be omitted
        },
        car: {
          id: 'car-456',
          name: 'Tesla Model 3',
          slug: 'tesla-model-3',
          company: 'Tesla',
          price_per_day: 350000,
        },
      },
    ];
  });
});