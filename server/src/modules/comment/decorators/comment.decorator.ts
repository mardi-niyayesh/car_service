import {
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

import {
  UUID4Dto,
  Permission,
  PERMISSIONS,
  pagePaginationDto,
  limitPaginationDto,
  orderByPaginationDto,
  getForbiddenResponse,
  getNormalErrorResponse,
  getUnauthorizedResponse,
} from "@/common";

import * as CommentDto from "../dto";
import {applyDecorators, HttpCode, HttpStatus} from "@nestjs/common";

export const CreateCommentDecorator = () => applyDecorators(
  HttpCode(HttpStatus.CREATED),
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

export const FindAllUnconfirmedCommentDecorator = () => applyDecorators(
  HttpCode(HttpStatus.OK),
  Permission({
    permissions: [PERMISSIONS.COMMENT_VIEW]
  }),
  ApiOperation(CommentDto.findAllUnconfirmedCommentsOperation),
  ApiQuery(pagePaginationDto),
  ApiQuery(limitPaginationDto),
  ApiQuery(orderByPaginationDto),
  ApiOkResponse({type: CommentDto.FindAllUnconfirmedOk}),
  ApiUnauthorizedResponse({type: getUnauthorizedResponse("comments/id/confirm")}),
  ApiForbiddenResponse({
    type: getForbiddenResponse("comments/id/confirm", {
      resource: 'comment',
      required_mode: 'ALL',
      required_permissions: [PERMISSIONS.COMMENT_VIEW],
      missing_permissions: [PERMISSIONS.COMMENT_VIEW],
    })
  }),
);

export const ConfirmCommentDecorator = () => applyDecorators(
  HttpCode(HttpStatus.OK),
  Permission({
    permissions: [PERMISSIONS.COMMENT_CONFIRM]
  }),
  ApiParam(UUID4Dto('id')),
  ApiOperation(CommentDto.confirmCommentOperation),
  ApiOkResponse({type: CommentDto.ConfirmedCommentOk}),
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

export const RejectCommentDecorator = () => applyDecorators(
  HttpCode(HttpStatus.OK),
  Permission({
    permissions: [PERMISSIONS.COMMENT_REJECT],
  }),
  ApiParam(UUID4Dto('id')),
  ApiOperation(CommentDto.rejectCommentOperation),
  ApiOkResponse({type: CommentDto.RejectCommentOk}),
  ApiUnauthorizedResponse({type: getUnauthorizedResponse("comments/id/reject")}),
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
      path: "comment/id/reject",
      statusCode: 404,
      message: 'comment not found in database, or already is confirmed',
      error: 'comment not found'
    })
  })
);