import {
  ApiBody,
  ApiParam,
  ApiOperation,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

import * as CommentDto from "../dto";
import {applyDecorators} from "@nestjs/common";
import {getForbiddenResponse, getNormalErrorResponse, getUnauthorizedResponse, Permission, PERMISSIONS, UUID4Dto} from "@/common";

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

export const FindAllNotConfirmedCommentDecorator = () => applyDecorators(
  Permission({
    permissions: [PERMISSIONS.COMMENT_VIEW]
  })
);

export const ConfirmCommentDecorator = () => applyDecorators(
  Permission({
    permissions: [PERMISSIONS.COMMENT_CONFIRM]
  }),
  ApiParam(UUID4Dto('id')),
  ApiOperation(CommentDto.confirmCommentOperation),
  ApiUnauthorizedResponse({type: getUnauthorizedResponse("comments/id/confirm")}),
  ApiForbiddenResponse({
    type: getForbiddenResponse("comments/id/confirm", {
      resource: 'comment',
      required_mode: 'ALL',
      required_permissions: [PERMISSIONS.COMMENT_CONFIRM],
      missing_permissions: [PERMISSIONS.COMMENT_CONFIRM],
    })
  }),
  ApiNotFoundResponse({
    type: getNormalErrorResponse({
      path: "comment/id/confirm",
      statusCode: 404,
      message: 'comment not found in database, or already is confirmed',
      error: 'comment not found'
    })
  })
);