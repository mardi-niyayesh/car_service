import {
  Public,
  ZodPipe,
  UUID4Dto,
  Cacheable,
  CacheEvict,
  Permission,
  PERMISSIONS,
  UUIDv4Validator,
  PREFIX_PUBLIC_PATH,
  getForbiddenResponse,
  CAR_IMAGE_UPLOAD_PATH,
  getBaseOkResponseSchema,
  getUnauthorizedResponse,
} from "@/common";

import {
  ApiTags,
  ApiBody,
  ApiParam,
  ApiConsumes,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

import {
  Put,
  Get,
  Req,
  Body,
  Post,
  Param,
  Query,
  Delete,
  HttpCode,
  HttpStatus,
  Controller,
  UploadedFile,
  UseInterceptors,
  applyDecorators,
  BadRequestException,
} from '@nestjs/common';

import z from "zod";
import * as CarDto from "./dto";
import * as CarConfig from "./configs";
import {CarService} from "./car.service";
import {getPath, ONE_HOUR_MS} from "@/lib";
import {FileInterceptor} from "@nestjs/platform-express";
import {Car, Prisma} from "@/modules/prisma/generated/client";
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
  @Public()
  @Cacheable({
    resource: 'car',
    paramsKey: ['slug'],
    ttl: ONE_HOUR_MS,
  })
  @Get(":slug")
  @HttpCode(HttpStatus.OK)
  @ApiOperation(CarDto.findOneCarOperation)
  @ApiOkResponse({type: CarDto.FindOneCarOkRes})
  @ApiBadRequestResponse({type: CarDto.FindOneCarBadReq})
  @ApiNotFoundResponse({type: CarDto.NotFoundOneCarRes})
  findOne(
    @Param("slug", new ZodPipe(CarDto.CarSlugValidator)) slug: string,
  ): Promise<ApiResponse<CarResponse>> {
    return this.carService.findOne(slug);
  }

  /**
   * get list of car by pagination query.
   * - **Accessible to all users (public endpoint)**
   */
  @Public()
  @Cacheable({
    resource: 'car',
    pagination: true,
    ttl: ONE_HOUR_MS,
    query: CarDto.findAllCarsQuery,
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation(CarDto.findAllCarOperation)
  @ApiOkResponse({type: CarDto.FindAllCarOkRes})
  @applyDecorators(...CarDto.findAllCarPaginationDecorators)
  findAll(
    @Query(new ZodPipe(CarDto.FindAllCarValidator)) pagination: CarDto.FindAllCarValidatorType
  ): Promise<ApiResponse<CarsResponse>> {
    return this.carService.findAll(pagination);
  }

  /** create a new car
   * - **only roles with permission (owner.all or product.create) can accessibility to this route**
   */
  @Permission({
    permissions: [PERMISSIONS.PRODUCT_CREATE]
  })
  @ApiBearerAuth("accessToken")
  @Post()
  @CacheEvict({
    prefix: '*car:list*'
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation(CarDto.createCarOperation)
  @ApiBody({type: CarDto.CreateCarDto})
  @ApiOkResponse({type: CarDto.CreateCarOkRes})
  @ApiBadRequestResponse({type: CarDto.CreateCarBadReq})
  @ApiUnauthorizedResponse({type: getUnauthorizedResponse('cars')})
  @ApiForbiddenResponse({
    type: getForbiddenResponse('cars', {
      resource: 'car',
      required_mode: 'ANY',
      missing_permissions: [PERMISSIONS.PRODUCT_CREATE],
      required_permissions: [PERMISSIONS.PRODUCT_CREATE],
    })
  })
  @ApiConflictResponse({type: CarDto.CreateConflictCarResponse})
  create(
    @Req() req: AccessRequest,
    @Body(new ZodPipe(CarDto.CreateCarValidator)) body: CarDto.CreateCarType
  ): Promise<ApiResponse<CarResponse>> {
    return this.carService.create(req.user.userId, body);
  }

  /** add image url to car record
   * - **only roles with permission (owner.all or product.create or product.update) can accessibility to this route**
   */
  @Permission({
    permissions: CarDto.imageCarPermissionsRequired,
    owner: true,
    resource: "car",
    validatorParam: UUIDv4Validator
  })
  @Post(':id/image')
  @HttpCode(HttpStatus.OK)
  @CacheEvict({
    force: true,
    resource: "car"
  })
  @ApiBearerAuth("accessToken")
  @ApiParam(UUID4Dto('cars/id/image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation(CarDto.uploadCarImageOperation)
  @ApiBody(CarDto.carUploadApiBody)
  @ApiOkResponse({type: CarDto.UploadImageOkRes})
  @ApiBadRequestResponse({type: CarDto.UploadImageBadReq})
  @ApiUnauthorizedResponse({type: getUnauthorizedResponse('cars')})
  @ApiForbiddenResponse({
    type: getForbiddenResponse('cars/id/image', {
      resource: 'car',
      required_mode: 'ANY',
      missing_permissions: CarDto.imageCarPermissionsRequired,
      required_permissions: CarDto.imageCarPermissionsRequired,
    })
  })
  @ApiNotFoundResponse({type: CarDto.UploadImageNotFound})
  @UseInterceptors(FileInterceptor(
    CarConfig.CAR_FILE_FIELD_NAME,
    CarConfig.getMulterOptions(getPath(CAR_IMAGE_UPLOAD_PATH)))
  )
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
  @Permission<Prisma.CarInclude, z.ZodUUID>({
    owner: true,
    resource: 'car',
    include: {category: true},
    validatorParam: UUIDv4Validator,
    permissions: [PERMISSIONS.PRODUCT_UPDATE],
  })
  @ApiBearerAuth("accessToken")
  @Put(':id')
  @CacheEvict({
    force: true,
    resource: 'car',
  })
  @HttpCode(HttpStatus.OK)
  @ApiParam(UUID4Dto('id'))
  @ApiBody({type: CarDto.UpdateCarDto})
  @ApiOperation(CarDto.updateCarOperation)
  @ApiOkResponse({type: CarDto.OkResponseUpdateCar})
  @ApiBadRequestResponse({type: CarDto.CreateCarBadReq})
  @ApiUnauthorizedResponse({type: getUnauthorizedResponse('cars/id')})
  @ApiForbiddenResponse({
    type: getForbiddenResponse('api/v1/cars/id', {
      resource: 'car',
      required_mode: 'ANY',
      missing_permissions: [PERMISSIONS.PRODUCT_UPDATE],
      required_permissions: [PERMISSIONS.PRODUCT_UPDATE],
    })
  })
  @ApiNotFoundResponse({type: CarDto.NotFoundUpdateCarRes})
  @ApiConflictResponse({type: CarDto.ConflictUpdateCarRes})
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
  @Permission({
    owner: true,
    resource: 'car',
    validatorParam: UUIDv4Validator,
    permissions: [PERMISSIONS.PRODUCT_DELETE],
  })
  @ApiBearerAuth("accessToken")
  @Delete(':id')
  @CacheEvict({
    force: true,
    resource: 'car',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam(UUID4Dto('id'))
  @ApiOperation(CarDto.deleteCarOperation)
  @ApiNoContentResponse({
    type: getBaseOkResponseSchema<void>({
      path: 'cars/id',
      statusCode: 204,
      response: {message: 'Car successfully deleted.'}
    })
  })
  @ApiUnauthorizedResponse({type: getUnauthorizedResponse('cars/id')})
  @ApiNotFoundResponse({type: CarDto.NotFoundUpdateCarRes})
  @ApiForbiddenResponse({
    type: getForbiddenResponse('cars/id', {
      resource: 'car',
      required_mode: 'ANY',
      missing_permissions: [PERMISSIONS.PRODUCT_DELETE],
      required_permissions: [PERMISSIONS.PRODUCT_DELETE],
    })
  })
  delete(
    @Param("id") id: string,
    @Req() req: OwnershipRequest<Car>
  ) {
    return this.carService.delete(id, req.ownershipData);
  }
}