import * as FavoriteDto from "../dto";
import {applyDecorators, HttpCode, HttpStatus} from "@nestjs/common";
import {getUnauthorizedResponse, PaginationDecoratorQueries, Permission, PERMISSIONS, UUID4Dto} from "@/common";
import {ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiUnauthorizedResponse} from "@nestjs/swagger";
import {carSlugSwaggerParam} from "@/modules/car/decorators";

export const GetListDecorators = () => applyDecorators(
  Permission({
    permissions: [PERMISSIONS.USER_SELF]
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
  ApiParam(carSlugSwaggerParam),
);
