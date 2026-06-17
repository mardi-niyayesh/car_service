import * as FavoriteDto from "../dto";
import {ApiOperation} from "@nestjs/swagger";
import {applyDecorators} from "@nestjs/common";

export const GetListDecorators = () => applyDecorators(
  ApiOperation(FavoriteDto.favoriteFindAllOperation)
);