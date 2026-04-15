import * as CarDto from "./dto";
import {PaginationValidatorType} from "@/common";
import {Prisma} from "@/modules/prisma/generated/client";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import type {ApiResponse, BaseException, CarResponse, CarsResponse} from "@/types";

@Injectable()
export class CarService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find a single car by its unique slug.
   * - **Accessible to all users (public endpoint)**
   */
  async findOne(slug: string): Promise<ApiResponse<CarResponse>> {
    const car = await this.prisma.car.findUnique({
      where: {slug},
      include: {category: true}
    });

    if (!car) throw new NotFoundException({
      message: 'Car does not exists in database, please make sure and try again',
      error: 'Car not found'
    });

    return {
      message: "car successfully found.",
      data: {
        car
      }
    };
  }

  /**
   * get list of car by pagination query.
   * - **Accessible to all users (public endpoint)**
   */
  async findAll(pagination: PaginationValidatorType): Promise<ApiResponse<CarsResponse>> {
    return this.prisma.$transaction(async (tx): Promise<ApiResponse<CarsResponse>> => {
      const count = await tx.car.count();

      const cars = await tx.$queryRaw<CarResponse['car'][]>(
        Prisma.sql`
        SELECT *,
        JSON_BUILD_OBJECT('category', c) as category
        FROM cars
        INNER JOIN public.categories c ON c.id = cars.category_id
        ORDER BY cars.created_at ${Prisma.sql([pagination.orderByUpper])}
        LIMIT ${pagination.limit} OFFSET ${pagination.offset};`
      );

      return {
        message: "cars successfully found.",
        data: {
          count,
          cars
        }
      };
    });
  }

  /** create a new car
   * - **only roles with permission (owner.all or product.create) can accessibility to this route**
   */
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
    return this.prisma.$transaction(async (tx): Promise<ApiResponse<CarResponse>> => {
      const carExist = await tx.car.findUnique({
        where: {
          slug
        }
      });

      if (carExist) throw new ConflictException({
        message: 'car already exists in database, please change slug',
        error: 'Car already exists'
      } as BaseException);

      const category = await tx.category.findUnique({
        where: {
          id: category_id
        }
      });

      if (!category) throw new NotFoundException({
        message: 'category not found in database, please make sure category exists',
        error: 'Category not found'
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

      return {
        message: 'Car Successfully created.',
        data: {
          car
        }
      };
    });
  }

  /** add image url to car record
   * - **only roles with permission (owner.all or product.create) can accessibility to this route**
   */
  async uploadImage(id: string, imageUrl: string, oldCar: CarResponse["car"]): Promise<ApiResponse<CarResponse>> {
    const message = 'Image uploaded successfully.';

    if (oldCar.image === imageUrl) return {
      message,
      data: {
        car: oldCar
      }
    };

    const car = await this.prisma.car.update({
      where: {id},
      data: {
        image: imageUrl
      },
      include: {category: true}
    });

    return {
      message,
      data: {
        car
      }
    };
  }
}