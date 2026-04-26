import * as CartDto from "../dto";
import {applyDecorators} from "@nestjs/common";
import {getUnauthorizedResponse} from "@/common";
import {ApiBody, ApiUnauthorizedResponse} from "@nestjs/swagger";

export const GetCartDecorators = () => applyDecorators(
  ApiUnauthorizedResponse({type: getUnauthorizedResponse('carts')})
);

export const AddToCartDecorators = () => applyDecorators(
  ApiBody({type: CartDto.AddToCartDto}),
  ApiUnauthorizedResponse({type: getUnauthorizedResponse('carts')})
);