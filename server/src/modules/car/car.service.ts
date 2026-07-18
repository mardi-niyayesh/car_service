import * as CarDto from "./dto";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {type Car, Prisma} from "@/modules/prisma/generated/client";
import {PaginationValidatorType, PREFIX_PUBLIC_PATH} from "@/common";
import {checkConflictRecord, checkPrismaError, deleteOneFile} from "@/lib";
import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import type {CommentWhereInput} from "@/modules/prisma/generated/models/Comment";
import {ApiResponse, BaseException, CarAndCategory, CarResponse, CarsResponse, CommentListAndUser, GetRentedDatesCarResponse, SafeCarNCategory} from "@/types";

@Injectable()
export class CarService {constructor(private readonly prisma: PrismaService) {}

  /**
   * Find a single car by its unique slug.
   * - **Accessible to all users (public endpoint)**
   */
  async findOne(slug: string): Promise<ApiResponse<SafeCarNCategory>> {
    const car = await this.prisma.car.findUnique({
      where: {slug},
      include: {
        _count: {
          select: {
            comments: {
              where: {
                is_confirmed: true
              }
            },
            users_favorites: true,
          }
        },
        category: {
          omit: {creator_id: true}
        },
      },
      omit: {creator_id: true}
    });

    if (!car) throw new NotFoundException({
      message: 'Car does not exists in database, please make sure and try again',
      error: 'Car not found'
    });

    return {
      message: "car successfully found.",
      data: {
        car: {
          ...car,
          rate: parseFloat(car.rate.toFixed(1))
        }
      }
    };
  }

  /**
   * get list of car by pagination query.
   * - **Accessible to all users (public endpoint)**
   */
  async findAll(pagination: CarDto.FindAllCarValidatorType): Promise<ApiResponse<CarsResponse>> {
    const where: Prisma.CarWhereInput = {
      can_rent: pagination.can_rent,
      price_per_day: {
        gte: pagination.price_per_day_gte,
        lte: pagination.price_per_day_lte,
      },
      category: {
        slug: pagination.category,
      }
    };

    const count: number = await this.prisma.car.count({
      where
    });

    const cars = await this.prisma.car.findMany({
      include: {
        _count: {
          select: {
            comments: {
              where: {
                is_confirmed: true
              }
            },
            users_favorites: true,
          }
        },
        category: {
          omit: {creator_id: true}
        }
      },
      where,
      take: pagination.limit,
      skip: pagination.offset,
      orderBy: {
        [pagination.order_by_field]: pagination.orderByLower,
      },
      omit: {creator_id: true}
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
      price_per_day,
    } = data;

    try {
      const car = await this.prisma.car.create({
        data: {
          name,
          slug,
          tags,
          company,
          rate: 5,
          can_rent,
          description,
          category_id,
          price_per_day,
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
      price_per_day,
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
          price_per_day,
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
  async delete(id: string, car: Car): Promise<ApiResponse> {
    try {
      await this.prisma.car.delete({
        where: {id}
      });

      const fullPathImage = `${PREFIX_PUBLIC_PATH}/${car.image}`;

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

  /**
   * Find all comment with pagination by its unique id car.
   * - **Accessible to all users (public endpoint)**
   */
  async findAllComments(car_id: string, {limit, offset, orderByLower}: PaginationValidatorType): Promise<ApiResponse<CommentListAndUser>> {
    const where: CommentWhereInput = {
      car_id,
      parent_id: null,
      is_confirmed: true,
    };

    const count: number = await this.prisma.comment.count({where});

    const comments = await this.prisma.comment.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: {
        created_at: orderByLower
      },
      include: {
        user: {
          select: {
            id: true,
            display_name: true,
          },
        },
        _count: {
          select: {
            replies: {
              where: {is_confirmed: true}
            }
          }
        }
      }
    });

    return {
      message: 'comments find successfully.',
      data: {
        count,
        comments,
      }
    };
  }

  /**
   * Get all rental dates for a specific car.
   *
   * @param car_id - Car UUID
   * @returns Object with total count and list of rental dates (id, status, start_date, end_date)
   *
   * @throws {NotFoundException} If car doesn't exist
   */
  async getRentedDatesCar(car_id: string): Promise<ApiResponse<GetRentedDatesCarResponse>> {
    const count: number = await this.prisma.carRent.count({
      where: {
        car_id,
      },
    });

    const dates = await this.prisma.carRent.findMany({
      where: {
        car_id,
      },
      select: {
        id: true,
        status: true,
        end_date: true,
        start_date: true,
      },
    });

    return {
      message: "Get dates successfully.",
      data: {
        count,
        dates,
      }
    };
  }
}
