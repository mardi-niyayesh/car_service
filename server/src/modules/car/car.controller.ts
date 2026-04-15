import {
  Public,
  ZodPipe,
  UUID4Dto,
  Cacheable,
  CacheEvict,
  Permission,
  PERMISSIONS,
  UUIDv4Validator,
  pagePaginationDto,
  limitPaginationDto,
  UPLOAD_PATH_PREFIX,
  PaginationValidator,
  orderByPaginationDto,
  getForbiddenResponse,
  CAR_IMAGE_UPLOAD_PATH,
  getUnauthorizedResponse,
  type PaginationValidatorType,
} from "@/common";

import {
  ApiTags,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiConsumes,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

import * as CarDto from "./dto";
import * as CarConfig from "./configs";
import {CarService} from "./car.service";
import {getPath, ONE_MINUTE_MS} from "@/lib";
import {FileInterceptor} from "@nestjs/platform-express";
import type {AccessRequest, ApiResponse, BaseException, CarResponse, CarsResponse, OwnershipRequest} from "@/types";
import {BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req, UploadedFile, UseInterceptors} from '@nestjs/common';

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
    ttl: ONE_MINUTE_MS * 60,
  })
  @Get(":slug")
  @HttpCode(HttpStatus.OK)
  @ApiOperation(CarDto.findOneCarOperation)
  @ApiOkResponse({type: CarDto.FindOneOkRes})
  @ApiBadRequestResponse({type: CarDto.FindOneCarBadReq})
  findOne(
    @Param("slug", new ZodPipe(CarDto.CreateCarValidator.shape.slug)) slug: string,
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
    ttl: ONE_MINUTE_MS * 60,
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery(pagePaginationDto)
  @ApiQuery(limitPaginationDto)
  @ApiQuery(orderByPaginationDto)
  findAll(
    @Query(new ZodPipe(PaginationValidator)) pagination: PaginationValidatorType
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
    @Req() req: OwnershipRequest<CarResponse["car"]>
  ): Promise<ApiResponse<CarResponse>> {
    if (!file) throw new BadRequestException({
      error: 'File not found',
      message: "File is Required, Please Try again and send File",
    } as BaseException);

    return this.carService.uploadImage(id, `${UPLOAD_PATH_PREFIX}/${file.filename}`, req.ownershipData);
  }
}