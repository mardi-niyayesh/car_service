import * as CommentDto from "../dto";
import {ApiBody} from "@nestjs/swagger";
import {applyDecorators} from "@nestjs/common";
import {Permission, PERMISSIONS} from "@/common";

export const CreateCommentDecorator = () => applyDecorators(
  Permission({
    permissions: [PERMISSIONS.USER_SELF]
  }),
  ApiBody({type: CommentDto.CreateCommentDto})
);