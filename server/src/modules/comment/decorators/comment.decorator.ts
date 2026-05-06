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
  ApiUnauthorizedResponse({type: getUnauthorizedResponse("comments")}),
  ApiBadRequestResponse({type: CommentDto.CreateCommentBadReq})
);