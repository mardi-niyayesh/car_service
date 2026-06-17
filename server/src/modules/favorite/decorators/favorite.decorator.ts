import * as FavoriteDto from "../dto";
import {ApiOperation} from "@nestjs/swagger";
import {applyDecorators} from "@nestjs/common";
import {Permission, PERMISSIONS} from "@/common";

export const GetListDecorators = () => applyDecorators(
  Permission({
    permissions: [PERMISSIONS.USER_SELF]
  }),
  ApiOperation(FavoriteDto.favoriteFindAllOperation)
);
