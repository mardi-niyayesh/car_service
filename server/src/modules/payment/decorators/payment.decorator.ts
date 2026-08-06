import * as PaymentDto from "../dto";
import {PaymentStatus} from "@/modules/prisma/generated/enums";
import {applyDecorators, HttpCode, HttpStatus} from "@nestjs/common";
import {getUnauthorizedResponse, PaginationDecoratorQueries, Permission, PERMISSIONS, UUID4Dto} from "@/common";
import {ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiUnauthorizedResponse} from "@nestjs/swagger";

export const CreateDecorators = () => applyDecorators(
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

export const FindAllDecorators = () => applyDecorators(
  Permission({
    permissions: [PERMISSIONS.USER_SELF],
  }),
  HttpCode(HttpStatus.OK),
  PaginationDecoratorQueries(),
  ApiQuery({
    type: 'string',
    name: 'status',
    required: false,
    enum: PaymentStatus,
    anyOf: [
      {
        type: PaymentStatus.FAILED,
        example: PaymentStatus.FAILED,
      },
      {
        type: PaymentStatus.SUCCESS,
        example: PaymentStatus.SUCCESS,
      }
    ],
    description: 'FAILED or SUCCESS or empty for get all'
  }),
  ApiOkResponse({type: PaymentDto.OkFindAllPaymentRes})
);
