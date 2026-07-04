import * as PaymentDto from "../dto";
import {Permission, PERMISSIONS, UUID4Dto} from "@/common";
import {ApiNotFoundResponse, ApiParam} from "@nestjs/swagger";
import {applyDecorators, HttpCode, HttpStatus} from "@nestjs/common";

export const PaymentDecorator = () => applyDecorators(
  Permission({
    permissions: [PERMISSIONS.USER_SELF],
  }),
  HttpCode(HttpStatus.OK),
  ApiParam(UUID4Dto("id")),
  ApiNotFoundResponse({type: PaymentDto.CreateNotFoundRes})
);
