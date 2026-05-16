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
  Public,
  UUID4Dto,
  Permission,
  PERMISSIONS,
  pagePaginationDto,
  limitPaginationDto,
  orderByPaginationDto,
  getForbiddenResponse,
  getUnauthorizedResponse,
} from "@/common";

import * as CommentDto from "../dto";
import {applyDecorators, HttpCode, HttpStatus} from "@nestjs/common";

export const FindCommentRepliesDecorator = () => applyDecorators(
  HttpCode(HttpStatus.OK),
  ApiOperation(CommentDto.findCommentRepliesOperation),
  Public(),
  ApiParam(UUID4Dto('id')),
  ApiQuery(pagePaginationDto),
  ApiQuery(limitPaginationDto),
  ApiQuery(orderByPaginationDto),
  ApiOkResponse({type: CommentDto.FindRepliesOk}),
);

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
  ApiUnauthorizedResponse({type: getUnauthorizedResponse("comments/unconfirmed")}),
  ApiForbiddenResponse({
    type: getForbiddenResponse("comments/unconfirmed", {
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
  ApiNotFoundResponse({type: CommentDto.ConfirmCommentNotFound})
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
    type: getForbiddenResponse("comments/id/reject", {
      resource: 'comment',
      required_mode: 'ANY',
      required_permissions: [PERMISSIONS.COMMENT_REJECT],
      missing_permissions: [PERMISSIONS.COMMENT_REJECT],
    })
  }),
  ApiNotFoundResponse({type: CommentDto.RejectCommentNotFound})
);