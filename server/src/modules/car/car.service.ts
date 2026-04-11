import * as CarDto from "./dto";
import {ConflictException, Injectable} from '@nestjs/common';
import {PrismaService} from "@/modules/prisma/prisma.service";
import type {ApiResponse, BaseException, CarResponse} from "@/types";

@Injectable()
export class CarService {
  constructor(private readonly prisma: PrismaService) {}

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
  ): Promise<ApiResponse<CarResponse>> {
    return this.prisma.$transaction(async (tx) : Promise<ApiResponse<CarResponse>> => {
      const carExist = await tx.car.findUnique({
        where: {
          slug
        }
      });

      if (carExist) throw new ConflictException({
        message: 'car already exists in database, please change slug',
        error: 'Car already exists'
      } as BaseException);

      const car = await tx.car.create({
        data: {
          name,
          slug,
          tags,
          company,
          can_rent,
          description,
          category_id,
          price_at_hour,
          in_rent: false,
          creator_id: ownership ? userId : null,
        },
        include: {
          category: true
        }
      });

      console.log(car);

      return {
        message: 'Car Successfully created.',
        data: {
          car
        }
      };
    });
  }
}