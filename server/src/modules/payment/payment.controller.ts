import type {Request} from "express";
import {Controller, Post, Req} from "@nestjs/common";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";

@ApiTags("Payments")
@Controller('payments')
@ApiBearerAuth("accessToken")
export class PaymentController {
  @Post()
  test(
    @Req() req: Request
  ) {
    console.log(req.clientInfo);
    return "test payment.";
  }
}
