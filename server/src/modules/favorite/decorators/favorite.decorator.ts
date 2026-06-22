import * as FavoriteDto from "../dto";
import {applyDecorators, HttpCode, HttpStatus} from "@nestjs/common";
import {PaginationDecoratorQueries, Permission, PERMISSIONS, UUID4Dto} from "@/common";
import {ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam} from "@nestjs/swagger";

export const GetListDecorators = () => applyDecorators(
  Permission({
    permissions: [PERMISSIONS.USER_SELF]
  }),
  HttpCode(HttpStatus.OK),
  ApiOperation(FavoriteDto.favoriteFindAllOperation),
  PaginationDecoratorQueries(),
);

export const CreateDecorator = () => applyDecorators(
  Permission({
    permissions: [PERMISSIONS.USER_SELF],
  }),
  ApiParam(UUID4Dto("id")),
  HttpCode(HttpStatus.CREATED),
  ApiOperation(FavoriteDto.favoriteCreateOperation),
  ApiOkResponse({type: FavoriteDto.CreateOkRes}),
  ApiNotFoundResponse({type: FavoriteDto.CreateNotFoundRes}),
  ApiConflictResponse({type: FavoriteDto.CreateConflictRes}),
);
