import {Permission, PERMISSIONS} from "@/common";
import {applyDecorators, HttpCode, HttpStatus} from "@nestjs/common";

export const PaymentDecorator = () => applyDecorators(
  Permission({
    permissions: [PERMISSIONS.USER_SELF],
  }),
  HttpCode(HttpStatus.OK),
);
