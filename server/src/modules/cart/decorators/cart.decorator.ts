import {applyDecorators} from "@nestjs/common";
import {ApiUnauthorizedResponse} from "@nestjs/swagger";
import {getUnauthorizedResponse} from "@/common";

export const GetCartDecorators = () => applyDecorators(
  ApiUnauthorizedResponse({type: getUnauthorizedResponse('carts')})
);