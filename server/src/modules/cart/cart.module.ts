import {Module} from '@nestjs/common';
import {CartController} from './cart.controller';

@Module({
  providers: [],
  controllers: [CartController],
})
export class CartModule {}