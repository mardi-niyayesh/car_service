import {Module} from "@nestjs/common";
import {RedisModule} from "@/modules";
import {PaymentService} from "./payment.service";
import {PaymentController} from "./payment.controller";

@Module({
  imports: [RedisModule],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
