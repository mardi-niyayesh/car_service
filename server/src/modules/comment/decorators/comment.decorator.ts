import * as CommentDto from "../dto";
import {applyDecorators} from "@nestjs/common";
import {Permission, PERMISSIONS} from "@/common";
import {ApiBody, ApiOperation} from "@nestjs/swagger";

export const CreateCommentDecorator = () => applyDecorators(
  Permission({
    permissions: [PERMISSIONS.USER_SELF]
  }),
  ApiBody({type: CommentDto.CreateCommentDto}),
  ApiOperation(CommentDto.createCommentOperation)
);