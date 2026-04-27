import * as CartDto from "../dto";
import {getUnauthorizedResponse} from "@/common";
import {applyDecorators, HttpCode, HttpStatus} from "@nestjs/common";
import {ApiBody, ApiNotFoundResponse, ApiUnauthorizedResponse} from "@nestjs/swagger";

export const GetCartDecorators = () => applyDecorators(
  HttpCode(HttpStatus.OK),
  ApiUnauthorizedResponse({type: getUnauthorizedResponse('carts')})
);

export const AddToCartDecorators = () => applyDecorators(
  HttpCode(HttpStatus.OK),
  ApiBody({type: CartDto.AddToCartDto}),
  ApiUnauthorizedResponse({type: getUnauthorizedResponse('carts')}),
  ApiNotFoundResponse({type: CartDto.AddToCartNotFound})
);