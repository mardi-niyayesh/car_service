import * as CartDto from "../dto";
import {getUnauthorizedResponse} from "@/common";
import {applyDecorators, HttpCode, HttpStatus} from "@nestjs/common";
import {ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOperation, ApiUnauthorizedResponse} from "@nestjs/swagger";

export const GetCartDecorators = () => applyDecorators(
  HttpCode(HttpStatus.OK),
  ApiOperation(CartDto.getCartOperation),
  ApiUnauthorizedResponse({type: getUnauthorizedResponse('carts')})
);

export const AddToCartDecorators = () => applyDecorators(
  HttpCode(HttpStatus.CREATED),
  ApiBody({type: CartDto.AddToCartDto}),
  ApiCreatedResponse({type: CartDto.AddToCartOk}),
  ApiUnauthorizedResponse({type: getUnauthorizedResponse('carts')}),
  ApiNotFoundResponse({type: CartDto.AddToCartNotFound}),
  ApiConflictResponse({type: CartDto.AddToCartConflict})
);