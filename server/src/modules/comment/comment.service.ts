import * as CommentDto from "./dto";
import {checkPrismaError} from "@/lib";
import {Prisma} from "@/modules/prisma/generated/client";
import {RedisService} from "@/modules/redis/redis.service";
import {EventEmitter2, OnEvent} from "@nestjs/event-emitter";
import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {eventsEmitter, PaginationValidatorType} from "@/common";
import type {CommentWhereInput} from "@/modules/prisma/generated/models/Comment";
import type {BaseException, CreateCommentResponse, ApiResponse, CommentNUserNCarList, UpdateCarRateEvent, CommentListAndUser} from "@/types";

@Injectable()
export class CommentService {
  constructor(
    private readonly redis: RedisService,
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  /**
   * **find all replies parent comment with pagination.**
   *
   * @param id - parent comment uuid
   * @param pagination - pagination queries
   * @returns CommentListAndUser
   */
  async findCommentReplies(id: string, pagination: PaginationValidatorType): Promise<ApiResponse<CommentListAndUser>> {
    const where: CommentWhereInput = {
      parent_id: id,
      is_confirmed: true,
    };

    const count: number = await this.prisma.comment.count({where});

    const {offset, limit, orderByLower} = pagination;

    const comments = await this.prisma.comment.findMany({
      where,
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
      take: limit,
      skip: offset,
      orderBy: {
        created_at: orderByLower
      },
    });

    return {
      message: 'replies comment successfully found.',
      data: {
        count,
        comments
      }
    };
  }

  /**
   * **Creates a new comment or reply on a car review.**
   *
   * @param car_id - car uuid
   * @param user_id - user uuid
   * @param data - Validated comment data
   * @returns Confirmation message
   *
   */
  async create(car_id: string, user_id: string, data: CommentDto.CreateCommentType): Promise<ApiResponse<CreateCommentResponse>> {
    if (data.parent_id) {
      const parentComment = await this.prisma.comment.findUnique({
        where: {
          id: data.parent_id,
        }
      });

      if (!parentComment) throw new NotFoundException({
        message: 'parent comment not found in database, please try again and sure parent_id is exist',
        error: 'parent comment not found'
      } as BaseException);
    }

    try {
      const comment = await this.prisma.comment.create({
        data: {
          ...data,
          creator_id: user_id,
          car_id
        }
      });

      return {
        message: 'comment created successfully.',
        data: {
          comment
        }
      };
    } catch (e) {
      checkPrismaError({
        e: e as Error,
        notFoundResource: 'car',
        notFoundField: 'car_id',
        mainResource: 'comment',
        conflictField: ''
      });
    }
  }

  /**
   * Retrieves a paginated list of unconfirmed comments.
   * Only accessible by users with `comment.view` permission.
   *
   * @param pagination - Pagination parameters (page, limit, sort order)
   * @returns List of unconfirmed comments with associated user (excl. password) and car data
   *
   * @queryParams
   * - `page`: number, default 1, min 1
   * - `limit`: number, default 10, min 1, max 100
   * - `order`: "asc" | "desc", default "desc" (sort by created_at)
   *
   * @permission `comment.view`
   *
   * @example
   * GET /comments/unconfirmed?page=2&limit=20&order=asc
   */
  async findAllUnconfirmed(pagination: PaginationValidatorType): Promise<ApiResponse<CommentNUserNCarList>> {
    const {offset, limit, orderByLower} = pagination;

    const where: Prisma.CommentWhereInput = {
      is_confirmed: false,
    };

    const comments = await this.prisma.comment.findMany({
      where,
      orderBy: {
        created_at: orderByLower
      },
      skip: offset,
      take: limit,
      include: {
        user: {
          omit: {
            password: true
          }
        },
        car: true
      }
    });

    const count: number = await this.prisma.comment.count({
      where
    });

    return {
      message: 'unconfirmed comments successfully find.',
      data: {
        count,
        comments,
      }
    };
  }

  /**
   * Moderation action on existing comment.
   *
   * @param comment_id - Target comment UUID
   * @param action    - Moderation action: 'confirm' (approve) or 'reject' (decline)
   * @returns Success message after moderation
   *
   * @example
   * commentService.moderateComment('uuid-1234', 'confirm');
   * commentService.moderateComment('uuid-5678', 'reject');
   */
  async moderateComment(comment_id: string, action: 'reject' | 'confirm'): Promise<ApiResponse<CreateCommentResponse | void>> {
    const notFoundMessage: BaseException = {
      message: 'comment not found in database, or already is confirmed',
      error: 'comment not found'
    };

    if (action === 'confirm') {
      try {
        const comment = await this.prisma.comment.update({
          where: {
            id: comment_id,
            is_confirmed: false
          },
          data: {
            is_confirmed: true
          },
        });

        this.eventEmitter.emit(eventsEmitter.UPDATE_CAR_RATE, {
          car_id: comment.car_id
        } as UpdateCarRateEvent);

        return {
          message: 'comment successfully confirmed.',
          data: {
            comment
          }
        };
      } catch (_) {
        throw new NotFoundException(notFoundMessage);
      }
    }

    try {
      await this.prisma.comment.delete({
        where: {
          id: comment_id,
          is_confirmed: false
        }
      });

      return {
        message: 'comment successfully deleted.'
      };
    } catch (_) {
      throw new NotFoundException(notFoundMessage);
    }
  }

  /**
   * Updates a car's average rating based on all confirmed comments.
   *
   * @event UPDATE_CAR_RATE
   * @param car_id - ID of the car to update
   */
  @OnEvent(eventsEmitter.UPDATE_CAR_RATE)
  async updateCarRateEvent({car_id}: UpdateCarRateEvent) {
    const rates = await this.prisma.comment.aggregate({
      where: {
        car_id,
        is_confirmed: true,
        parent_id: null,
      },
      _avg: {
        rate: true
      }
    });

    const rate: number = rates._avg.rate ?? 0.0;

    await this.prisma.car.update({
      where: {
        id: car_id,
      },
      data: {rate}
    });

    await this.redis.deletePrefix("*car:list*");
  }
}