import type {Request} from "express";
import {PaymentDecorator} from "./decorators";
import {Controller, Post, Req} from "@nestjs/common";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";

@ApiTags("Payments")
@Controller('payments')
@ApiBearerAuth("accessToken")
export class PaymentController {
  @Post()
  @PaymentDecorator()
  payment(
    @Req() req: Request
  ) {
    console.log(req.clientInfo);
    return "test payment.";
  }
}
