import * as CarDto from "./dto";
import {Injectable} from '@nestjs/common';

@Injectable()
export class CarService {
  create(
    userId: string,
    {
      name,
      slug,
      tags,
      company,
      can_rent,
      ownership,
      category_id,
      description,
      price_at_hour,
    }: CarDto.CreateCarType
  ) {
    console.log(
      name,
      slug,
      tags,
      company,
      can_rent,
      ownership,
      category_id,
      description,
      price_at_hour,
    );
    return 'create test';
  }
}