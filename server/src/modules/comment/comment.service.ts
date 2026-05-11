import * as CommentDto from "./dto";
import {checkPrismaError} from "@/lib";
import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "@/modules/prisma/prisma.service";
import type {BaseException, CreateCommentResponse, ApiResponse} from "@/types";

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * **Creates a new comment or reply on a car review.**
   *
   * @param user_id
   * @param data - Validated comment data
   * @returns Confirmation message
   *
   */
  async create(user_id: string, data: CommentDto.CreateCommentType): Promise<ApiResponse<CreateCommentResponse>> {
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
  async moderateComment(comment_id: string, action: 'reject' | 'confirm'):Promise<ApiResponse<CreateCommentResponse>> {
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
      const comment = await this.prisma.comment.delete({
        where: {
          id: comment_id,
          is_confirmed: false
        }
      });

      return {
        message: 'comment successfully deleted.',
        data: {
          comment
        }
      };
    } catch (_) {
      throw new NotFoundException(notFoundMessage);
    }
  }
}