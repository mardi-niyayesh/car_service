import * as CommentDto from "./dto";
import {checkPrismaError} from "@/lib";
import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "@/modules/prisma/prisma.service";
import type {AppResponse, BaseException, CreateCommentResponse} from "@/types";

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user_id: string, data: CommentDto.CreateCommentType): AppResponse<CreateCommentResponse> {
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