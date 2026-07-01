import {applyDecorators, HttpCode, HttpStatus} from "@nestjs/common";
import {Permission, PERMISSIONS} from "@/common";

export const PaymentDecorator = () => applyDecorators(
  Permission({
    permissions: [PERMISSIONS.USER_SELF],
  }),
  HttpCode(HttpStatus.OK),
);
