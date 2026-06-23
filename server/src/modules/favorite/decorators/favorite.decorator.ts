import * as FavoriteDto from "../dto";
import {applyDecorators, HttpCode, HttpStatus} from "@nestjs/common";
import {Cacheable, CacheEvict, CacheEvictDecorator, getUnauthorizedResponse, PaginationDecoratorQueries, Permission, PERMISSIONS, UUID4Dto} from "@/common";
import {ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiUnauthorizedResponse} from "@nestjs/swagger";
import {ONE_HOUR_MS} from "@/lib";

const getListCacheableExtraKeys: string[] = ['self-favorite'];

const cacheEvictParams: CacheEvictDecorator = {
  self: true,
  resource: 'favorite',
  prefixAfterBuildKey: true,
  extraKeys: getListCacheableExtraKeys,
};

export const GetListDecorators = () => applyDecorators(
  Permission({
    permissions: [PERMISSIONS.USER_SELF]
  }),
  Cacheable({
    self: true,
    ttl: ONE_HOUR_MS,
    pagination: true,
    resource: 'favorite',
    extraKeys: getListCacheableExtraKeys,
  }),
  HttpCode(HttpStatus.OK),
  ApiOperation(FavoriteDto.favoriteFindAllOperation),
  PaginationDecoratorQueries(),
  ApiOkResponse(({type: FavoriteDto.OkGetFavoriteRes})),
  ApiUnauthorizedResponse({type: getUnauthorizedResponse('favorites')})
);

export const CreateDecorator = () => applyDecorators(
  Permission({
    permissions: [PERMISSIONS.USER_SELF],
  }),
  CacheEvict(cacheEvictParams),
  ApiParam(UUID4Dto("id")),
  HttpCode(HttpStatus.CREATED),
  ApiOperation(FavoriteDto.favoriteCreateOperation),
  ApiOkResponse({type: FavoriteDto.CreateOkRes}),
  ApiUnauthorizedResponse({type: getUnauthorizedResponse('favorites')}),
  ApiNotFoundResponse({type: FavoriteDto.CreateNotFoundRes}),
  ApiConflictResponse({type: FavoriteDto.CreateConflictRes}),
);

export const CheckDecorator = () => applyDecorators(
  Permission({
    permissions: [PERMISSIONS.USER_SELF],
  }),
  HttpCode(HttpStatus.OK),
  ApiParam(UUID4Dto('id')),
  ApiOperation(FavoriteDto.favoriteCheckOperation),
  ApiOkResponse({type: FavoriteDto.OkCheckRes}),
  ApiUnauthorizedResponse({type: getUnauthorizedResponse('favorites/check/id')}),
);

export const DeleteDecorator = () => applyDecorators(
  Permission({
    permissions: [PERMISSIONS.USER_SELF],
  }),
  CacheEvict(cacheEvictParams),
  HttpCode(HttpStatus.OK),
  ApiParam(UUID4Dto('id')),
  ApiOperation(FavoriteDto.favoriteDeleteOperation),
  ApiOkResponse({type: FavoriteDto.OkDeleteRes}),
  ApiNotFoundResponse({type: FavoriteDto.NotFoundDeleteRes}),
  ApiUnauthorizedResponse({type: getUnauthorizedResponse('favorites/id')}),
);
