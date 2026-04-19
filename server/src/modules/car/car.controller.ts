import * as CarDto from "./dto";
import {ApiTags} from "@nestjs/swagger";
import {CarService} from "./car.service";
import * as CarDecorator from "./decorators";
import {Car} from "@/modules/prisma/generated/client";
import {ZodPipe, PREFIX_PUBLIC_PATH, CAR_IMAGE_UPLOAD_PATH} from "@/common";
import {Put, Get, Req, Body, Post, Param, Query, Delete, Controller, UploadedFile, BadRequestException} from '@nestjs/common';
import type {AccessRequest, ApiResponse, BaseException, CarAndCategory, CarResponse, CarsResponse, OwnershipRequest} from "@/types";

/**
 * Car management endpoints for handling vehicle resources.
 *
 * This controller provides a complete API surface for managing cars, including:
 *
 * - Retrieving a paginated list of all cars (public)
 * - Fetching detailed information of a single car by its ID (public)
 * - Creating new cars with permission checks (e.g. `product.create`, `owner.all`)
 * - Updating existing cars with owner‑aware access control
 * - Deleting cars with strict permission or ownership validation
 * - Optional image upload support, stored and linked to each car
 * - UUID validation for all route parameters
 *
 * Read operations (`GET /cars`, `GET /cars/:id`) are publicly accessible.
 *
 * Create, update, and delete endpoints require:
 * - Valid Bearer authentication
 * - Appropriate permissions (e.g. `product.create`, `product.update`, `product.delete`)
 * - OR ownership when the authenticated user is the creator of the car
 *
 * All modifying operations trigger cache invalidation if caching is used,
 * while read operations may benefit from response caching layers.
 *
 * The controller is designed to integrate seamlessly with:
 * - Prisma ORM for data persistence
 * - PermissionGuard and OwnershipGuard for access control
 * - Multer for image upload handling via multipart/form‑data
 *
 * This ensures a robust, production‑ready foundation for the car module,
 * supporting both administrative workflows and public catalog surfing.
 */
@ApiTags('Cars')
@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  /**
   * Find a single car by its unique slug.
   * - **Accessible to all users (public endpoint)**
   */
  @Get(":slug")
  @CarDecorator.FindOneDecorators()
  findOne(
    @Param("slug", new ZodPipe(CarDto.CarSlugValidator)) slug: string,
  ): Promise<ApiResponse<CarResponse>> {
    return this.carService.findOne(slug);
  }

  /**
   * get list of car by pagination query.
   * - **Accessible to all users (public endpoint)**
   */
  @Get()
  @CarDecorator.FindAllDecorators()
  findAll(
    @Query(new ZodPipe(CarDto.FindAllCarValidator)) pagination: CarDto.FindAllCarValidatorType
  ): Promise<ApiResponse<CarsResponse>> {
    return this.carService.findAll(pagination);
  }

  /** create a new car
   * - **only roles with permission (owner.all or product.create) can accessibility to this route**
   */
  @Post()
  @CarDecorator.CreateDecorator()
  create(
    @Req() req: AccessRequest,
    @Body(new ZodPipe(CarDto.CreateCarValidator)) body: CarDto.CreateCarType
  ): Promise<ApiResponse<CarResponse>> {
    return this.carService.create(req.user.userId, body);
  }

  /** add image url to car record
   * - **only roles with permission (owner.all or product.create or product.update) can accessibility to this route**
   */
  @Post(':id/image')
  @CarDecorator.UploadImageDecorator()
  uploadImage(
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: OwnershipRequest<CarAndCategory>
  ): Promise<ApiResponse<CarResponse>> {
    if (!file) throw new BadRequestException({
      error: 'File not found',
      message: "File is Required, Please Try again and send File",
    } as BaseException);

    return this.carService.uploadImage(id, `${CAR_IMAGE_UPLOAD_PATH.slice(PREFIX_PUBLIC_PATH.length + 1)}/${file.filename}`, req.ownershipData);
  }

  /** update a car record with id and ownership permission
   * - **only roles with permission (owner.all or product.update or product.update) can accessibility to this route**
   */
  @Put(':id')
  @CarDecorator.UpdateDecorator()
  update(
    @Param("id") _id: string,
    @Body(new ZodPipe(CarDto.UpdateCarValidator)) data: CarDto.UpdateCarType,
    @Req() req: OwnershipRequest<CarAndCategory>
  ): Promise<ApiResponse<CarResponse>> {
    return this.carService.update(req.ownershipData, data);
  }

  /** delete a car record with id and ownership permission
   * - **only roles with permission (owner.all or product.delete or product.update) can accessibility to this route**
   */
  @Delete(':id')
  @CarDecorator.DeleteDecorator()
  delete(
    @Param("id") id: string,
    @Req() req: OwnershipRequest<Car>
  ) {
    return this.carService.delete(id, req.ownershipData);
  }
}