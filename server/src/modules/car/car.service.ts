import * as CarDto from "./dto";
import {checkPrismaConflict} from "@/lib";
import {PaginationValidatorType} from "@/common";
import {Prisma} from "@/modules/prisma/generated/client";
import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "@/modules/prisma/prisma.service";
import type {ApiResponse, BaseException, CarAndCategory, CarResponse, CarsResponse} from "@/types";

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
    const count = await this.prisma.car.count();

    const cars = await this.prisma.$queryRaw<CarResponse['car'][]>(
      Prisma.sql`
        SELECT cars.id,
            cars.created_at,
            cars.updated_at,
            cars.name,
            cars.slug,
            cars.price_at_hour,
            cars.description,
            cars.can_rent,
            cars.company,
            cars.in_rent,
            cars.tags,
            cars.image,
            JSON_BUILD_OBJECT(
                'id', c.id,
                'slug', c.slug,
                'created_at', c.created_at,
                'updated_at', c.updated_at,
                'description', c.description
        ) AS category
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
  }

  /** create a new car
   * - **only roles with permission (owner.all or product.create) can accessibility to this route**
   */
  async create(userId: string, data: CarDto.CreateCarType): Promise<ApiResponse<CarResponse>> {
    const {
      name,
      slug,
      tags,
      company,
      can_rent,
      ownership,
      category_id,
      description,
      price_at_hour,
    } = data;

    const category = await this.prisma.category.findUnique({
      where: {id: category_id}
    });

    if (!category) throw new NotFoundException({
      message: 'category not found in database, please make sure category exists',
      error: 'Category not found'
    } as BaseException);

    try {
      const car = await this.prisma.car.create({
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
    } catch (e) {
      checkPrismaConflict(e as Error, 'Car', 'slug');
    }
  }

  /** add image url to car record
   * - **only roles with permission (owner.all or product.create) can accessibility to this route**
   */
  async uploadImage(id: string, imageUrl: string, carRecord: CarAndCategory): Promise<ApiResponse<CarResponse>> {
    const message = 'Image uploaded successfully.';

    if (carRecord.image === imageUrl) return {
      message,
      data: {
        car: carRecord
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

  /** update a car record with id and ownership permission
   * - **only roles with permission (owner.all or product.update or product.update) can accessibility to this route**
   */
  update(carRecord: CarAndCategory, newData: CarDto.UpdateCarType) {
    console.log(newData);
    console.log(carRecord);

    return 'car successfully updated';
  }
}