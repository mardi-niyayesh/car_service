import {Module} from '@nestjs/common';
import {CarController} from './car.controller';

@Module({
  controllers: [CarController]
})
export class CarModule {}