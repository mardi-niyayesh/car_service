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
    console.log("name: ", name);
    console.log("slug: ", slug);
    console.log("tags: ", tags);
    console.log("userId: ", userId);
    console.log("company: ", company);
    console.log("can_rent: ", can_rent);
    console.log("ownership: ", ownership);
    console.log("category_id: ", category_id);
    console.log("description: ", description);
    console.log("price_at_hour: ", price_at_hour);
    return 'create test';
  }
}