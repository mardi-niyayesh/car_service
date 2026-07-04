import * as PaymentDto from "../dto";
import {Permission, PERMISSIONS, UUID4Dto} from "@/common";
import {applyDecorators, HttpCode, HttpStatus} from "@nestjs/common";
import {ApiNotFoundResponse, ApiParam} from "@nestjs/swagger";

export const PaymentDecorator = () => applyDecorators(
  Permission({
    permissions: [PERMISSIONS.USER_SELF],
  }),
  HttpCode(HttpStatus.OK),
  ApiParam(UUID4Dto("id")),
  ApiNotFoundResponse({type: PaymentDto.CreateNotFoundRes})
);
