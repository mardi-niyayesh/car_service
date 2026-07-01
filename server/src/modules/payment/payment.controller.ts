import {Public} from "@/common";
import type {Request} from "express";
import {Controller, Post, Req} from "@nestjs/common";

@Public()
@Controller('payments')
export class PaymentController {
  @Post()
  test(
    @Req() req: Request
  ) {
    console.log(req.clientInfo);
    return "test payment.";
  }
}
