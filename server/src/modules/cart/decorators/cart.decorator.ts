import {applyDecorators} from "@nestjs/common";
import {getUnauthorizedResponse} from "@/common";
import {ApiUnauthorizedResponse} from "@nestjs/swagger";

export const GetCartDecorators = () => applyDecorators(
  ApiUnauthorizedResponse({type: getUnauthorizedResponse('carts')})
);

export const AddToCartDecorators = () => applyDecorators(
  ApiUnauthorizedResponse({type: getUnauthorizedResponse('carts')})
);