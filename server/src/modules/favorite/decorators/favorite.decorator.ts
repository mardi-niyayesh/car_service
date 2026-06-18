import * as FavoriteDto from "../dto";
import {ApiNotFoundResponse, ApiOperation, ApiParam} from "@nestjs/swagger";
import {Permission, PERMISSIONS, UUID4Dto} from "@/common";
import {applyDecorators, HttpCode, HttpStatus} from "@nestjs/common";

export const GetListDecorators = () => applyDecorators(
  Permission({
    permissions: [PERMISSIONS.USER_SELF]
  }),
  HttpCode(HttpStatus.OK),
  ApiOperation(FavoriteDto.favoriteFindAllOperation)
);

export const CreateDecorator =  () => applyDecorators(
  Permission({
    permissions: [PERMISSIONS.USER_SELF],
  }),
  ApiParam(UUID4Dto("id")),
  HttpCode(HttpStatus.CREATED),
  ApiOperation(FavoriteDto.favoriteCreateOperation),
  ApiNotFoundResponse({type: FavoriteDto.CreateNotFoundRes})
);
