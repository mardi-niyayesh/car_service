import {Public} from "@/common";
import {Controller, Post} from "@nestjs/common";

@Public()
@Controller('payments')
export class PaymentController {
  @Post()
  test() {
    return "test payment.";
  }
}
