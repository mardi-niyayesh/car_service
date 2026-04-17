import * as CarDto from "./dto";
import {PREFIX_PUBLIC_PATH} from "@/common";
import {Car, Prisma} from "@/modules/prisma/generated/client";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {checkConflictRecord, checkPrismaError, deleteOneFile} from "@/lib";
import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
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
  async findAll(pagination: CarDto.FindAllCarValidatorType): Promise<ApiResponse<CarsResponse>> {
    const {
      limit,
      offset,
      in_rent,
      can_rent,
      orderByLower,
      order_by_field,
      price_at_hour_lte,
      price_at_hour_gte,
    } = pagination;

    console.log(pagination);

    const where: Prisma.CarWhereInput = {
      can_rent,
      in_rent,
      price_at_hour: {
        gte: price_at_hour_gte,
        lte: price_at_hour_lte,
      },
    };

    const count: number = await this.prisma.car.count({
      where
    });

    const cars = await this.prisma.car.findMany({
      include: {
        category: true
      },
      where,
      take: limit,
      skip: offset,
      orderBy: {
        [order_by_field]: orderByLower,
      },
    });

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
      checkPrismaError({
        e: e as Error,
        mainResource: 'Car',
        conflictField: 'slug',
        notFoundResource: 'Category',
        notFoundField: 'category_id',
      });
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
  async update(carRecord: CarAndCategory, newData: CarDto.UpdateCarType): Promise<ApiResponse<CarResponse>> {
    const {hasConflict, conflictData} = checkConflictRecord(newData, carRecord);

    if (hasConflict) throw new ConflictException({
      error: 'Conflict new car data',
      message: `conflict in new car data, please change new car data. conflict fields: ${conflictData.join(", ")}`,
    } as BaseException);

    const {
      name,
      slug,
      tags,
      company,
      can_rent,
      ownership,
      description,
      category_id,
      price_at_hour,
    } = newData;

    try {
      const newCarRecord = await this.prisma.car.update({
        where: {id: carRecord.id},
        data: {
          name,
          slug,
          tags,
          company,
          can_rent,
          description,
          category_id,
          price_at_hour,
          creator_id: ownership === false ? null : undefined,
        },
        include: {category: true}
      });

      return {
        message: 'Car Successfully Updated.',
        data: {
          car: newCarRecord
        }
      };
    } catch (e) {
      checkPrismaError({
        e: e as Error,
        mainResource: 'Car',
        conflictField: 'slug',
        notFoundResource: 'Category',
        notFoundField: 'category_id',
      });
    }
  }

  /** delete a car record with id and ownership permission
   * - **only roles with permission (owner.all or product.delete or product.update) can accessibility to this route**
   */
  async delete(id: string, car: Car): Promise<ApiResponse<void>> {
    try {
      await this.prisma.car.delete({
        where: {id}
      });

      const fullPathImage  = `${PREFIX_PUBLIC_PATH}/${car.image}`;

      deleteOneFile(fullPathImage);

      return {
        message: 'Car deleted successfully.',
      };
    } catch (e) {
      checkPrismaError({
        e: e as Error,
        mainResource: '',
        conflictField: '',
        notFoundField: 'id',
        notFoundResource: 'Car',
      });
    }
  }
}