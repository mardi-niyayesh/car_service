import * as CommentDto from "../dto";
import {applyDecorators} from "@nestjs/common";
import {getUnauthorizedResponse, Permission, PERMISSIONS} from "@/common";
import {ApiBadRequestResponse, ApiBody, ApiOperation, ApiUnauthorizedResponse} from "@nestjs/swagger";

export const CreateCommentDecorator = () => applyDecorators(
  Permission({
    permissions: [PERMISSIONS.USER_SELF]
  }),
  ApiBody({type: CommentDto.CreateCommentDto}),
  ApiOperation(CommentDto.createCommentOperation),
  ApiBadRequestResponse({type: CommentDto.CreateCommentBadReq}),
  ApiUnauthorizedResponse({type: getUnauthorizedResponse("comments")}),
);