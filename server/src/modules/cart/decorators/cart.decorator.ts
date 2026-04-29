import * as CartDto from "../dto";
import {getUnauthorizedResponse, UUID4Dto} from "@/common";
import {applyDecorators, HttpCode, HttpStatus} from "@nestjs/common";
import {ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiUnauthorizedResponse} from "@nestjs/swagger";

export const GetCartDecorators = () => applyDecorators(
  HttpCode(HttpStatus.OK),
  ApiOperation(CartDto.getCartOperation),
  ApiOkResponse({type: CartDto.GetCartOk}),
  ApiUnauthorizedResponse({type: getUnauthorizedResponse('carts')})
);

export const AddToCartDecorators = () => applyDecorators(
  HttpCode(HttpStatus.CREATED),
  ApiOperation(CartDto.addToCartOperation),
  ApiBody({type: CartDto.AddToCartDto}),
  ApiCreatedResponse({type: CartDto.AddToCartOk}),
  ApiUnauthorizedResponse({type: getUnauthorizedResponse('carts')}),
  ApiNotFoundResponse({type: CartDto.AddToCartNotFound}),
  ApiConflictResponse({type: CartDto.AddToCartConflict})
);

export const RemoveFromCartDecorators = () => applyDecorators(
  HttpCode(HttpStatus.OK),
   ApiOperation(CartDto.removeFromCartOperation),
  ApiParam(UUID4Dto('id')),
  ApiNotFoundResponse({type: CartDto.RemoveFromCartNotFound})
);