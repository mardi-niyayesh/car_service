import {ApiResponse, BaseException} from "@/types";
import * as CommentDto from "./dto";
import {Injectable, NotFoundException} from "@nestjs/common";
import {Comment} from "@/modules/prisma/generated/client";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {checkPrismaError} from "@/lib";

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user_id: string, data: CommentDto.CreateCommentType): Promise<ApiResponse<{ comment: Comment }>> {
    if (data.parent_id) {
      const parentComment = await this.prisma.comment.findUnique({
        where: {
          id: data.parent_id,
        }
      });

      if (!parentComment) throw new NotFoundException({
        message: 'parent_id of comment not found in database, please try again and sure parent_id is exist',
        error: 'parent comment not found'
      } as BaseException);
    }

    try {
      const comment = await this.prisma.comment.create({
        data: {
          ...data,
          user_id
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
}