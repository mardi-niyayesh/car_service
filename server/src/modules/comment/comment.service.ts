import {ApiResponse} from "@/types";
import * as CommentDto from "./dto";
import {Injectable} from "@nestjs/common";
import {Comment} from "@/modules/prisma/generated/client";
import {PrismaService} from "@/modules/prisma/prisma.service";

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user_id: string, data: CommentDto.CreateCommentType): Promise<ApiResponse<{comment: Comment}>> {
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
      console.log(e);

      throw e;
    }
  }
}