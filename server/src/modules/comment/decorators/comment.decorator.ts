import * as CommentDto from "../dto";
import {applyDecorators} from "@nestjs/common";
import {getUnauthorizedResponse, Permission, PERMISSIONS, UUID4Dto} from "@/common";
import {ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOperation, ApiParam, ApiUnauthorizedResponse} from "@nestjs/swagger";

export const CreateCommentDecorator = () => applyDecorators(
  Permission({
    permissions: [PERMISSIONS.USER_SELF]
  }),
  ApiBody({type: CommentDto.CreateCommentDto}),
  ApiOperation(CommentDto.createCommentOperation),
  ApiCreatedResponse({type: CommentDto.CreateCommentOk}),
  ApiBadRequestResponse({type: CommentDto.CreateCommentBadReq}),
  ApiUnauthorizedResponse({type: getUnauthorizedResponse("comments")}),
  ApiNotFoundResponse({type: CommentDto.CreateCommentNotFound})
);

export const ConfirmCommentDecorator = () => applyDecorators(
  Permission({
    permissions: [PERMISSIONS.COMMENT_CONFIRM]
  }),
  ApiParam(UUID4Dto),
  ApiOperation(CommentDto.confirmCommentOperation)
);