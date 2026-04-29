import * as CartDto from "../dto";
import {ONE_HOUR_MS} from "@/lib";
import {applyDecorators, HttpCode, HttpStatus} from "@nestjs/common";
import {Cacheable, CacheEvict, getUnauthorizedResponse, UUID4Dto} from "@/common";
import {ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiUnauthorizedResponse} from "@nestjs/swagger";

const cartCacheKey = ['self_cart'];

export const GetCartDecorators = () => applyDecorators(
  HttpCode(HttpStatus.OK),
  Cacheable({
    self: true,
    ttl: ONE_HOUR_MS,
    resource: 'cart',
    extraKeys: cartCacheKey
  }),
  ApiOperation(CartDto.getCartOperation),
  ApiOkResponse({type: CartDto.GetCartOk}),
  ApiUnauthorizedResponse({type: getUnauthorizedResponse('carts')})
);

export const AddToCartDecorators = () => applyDecorators(
  HttpCode(HttpStatus.CREATED),
  CacheEvict({
    self: true,
    resource: 'cart',
    extraKeys: cartCacheKey
  }),
  ApiOperation(CartDto.addToCartOperation),
  ApiBody({type: CartDto.AddToCartDto}),
  ApiCreatedResponse({type: CartDto.AddToCartOk}),
  ApiUnauthorizedResponse({type: getUnauthorizedResponse('carts')}),
  ApiNotFoundResponse({type: CartDto.AddToCartNotFound}),
  ApiConflictResponse({type: CartDto.AddToCartConflict})
);

export const RemoveFromCartDecorators = () => applyDecorators(
  HttpCode(HttpStatus.OK),
  CacheEvict({
    self: true,
    resource: 'cart',
    extraKeys: cartCacheKey
  }),
  ApiOperation(CartDto.removeFromCartOperation),
  ApiParam(UUID4Dto('id')),
  ApiOkResponse({type: CartDto.RemoveFromCartOk}),
  ApiUnauthorizedResponse({type: getUnauthorizedResponse('carts/id')}),
  ApiNotFoundResponse({type: CartDto.RemoveFromCartNotFound})
);