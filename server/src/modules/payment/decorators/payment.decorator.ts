import * as PaymentDto from "../dto";
import {applyDecorators, HttpCode, HttpStatus} from "@nestjs/common";
import {getUnauthorizedResponse, Permission, PERMISSIONS, UUID4Dto} from "@/common";
import {ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiUnauthorizedResponse} from "@nestjs/swagger";

export const PaymentDecorator = () => applyDecorators(
  Permission({
    permissions: [PERMISSIONS.USER_SELF],
  }),
  HttpCode(HttpStatus.OK),
  ApiParam(UUID4Dto("id")),
  ApiOkResponse({type: PaymentDto.CreateOkRes}),
  ApiUnauthorizedResponse({type: getUnauthorizedResponse('payments')}),
  ApiNotFoundResponse({type: PaymentDto.CreateNotFoundRes}),
  ApiConflictResponse({type: PaymentDto.CreateConflictRes})
);
