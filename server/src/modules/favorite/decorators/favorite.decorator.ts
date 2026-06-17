import * as FavoriteDto from "../dto";
import {ApiOperation} from "@nestjs/swagger";
import {Permission, PERMISSIONS} from "@/common";
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
  HttpCode(HttpStatus.CREATED),
  ApiOperation(FavoriteDto.favoriteCreateOperation)
);