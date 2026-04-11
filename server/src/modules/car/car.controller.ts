import {CarService} from "./car.service";
import {Controller, Post} from '@nestjs/common';

@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  create() {
    return this.carService.create();
  }
}