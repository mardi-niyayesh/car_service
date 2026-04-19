import {
  Public,
  UUID4Dto,
  Cacheable,
  CacheEvict,
  Permission,
  PERMISSIONS,
  UUIDv4Validator,
  pagePaginationDto,
  limitPaginationDto,
  orderByPaginationDto,
  getForbiddenResponse,
  CAR_IMAGE_UPLOAD_PATH,
  getUnauthorizedResponse,
  getBaseOkResponseSchema,
} from "@/common";

import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiConsumes,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

import z from "zod";
import * as CarDto from "../dto";
import {getPath, ONE_HOUR_MS} from "@/lib";
import * as CarConfig from "@/modules/car/configs";
import {FileInterceptor} from "@nestjs/platform-express";
import {Prisma} from "@/modules/prisma/generated/client";
import {applyDecorators, HttpCode, HttpStatus, UseInterceptors} from "@nestjs/common";

export const FindOneDecorators = () => {
  return applyDecorators(
    Public(),
    Cacheable({
      resource: 'car',
      paramsKey: ['slug'],
      ttl: ONE_HOUR_MS,
    }),
    HttpCode(HttpStatus.OK),
    ApiOperation(CarDto.findOneCarOperation),
    ApiOkResponse({type: CarDto.FindOneCarOkRes}),
    ApiBadRequestResponse({type: CarDto.FindOneCarBadReq}),
    ApiNotFoundResponse({type: CarDto.NotFoundOneCarRes}),
  );
};

export const FindAllDecorators = () => {
  return applyDecorators(
    Public(),
    Cacheable({
      resource: 'car',
      pagination: true,
      ttl: ONE_HOUR_MS,
      query: CarDto.findAllCarsQuery,
    }),
    HttpCode(HttpStatus.OK),
    ApiOperation(CarDto.findAllCarOperation),
    ApiOkResponse({type: CarDto.FindAllCarOkRes}),
    ApiQuery(pagePaginationDto),
    ApiQuery(limitPaginationDto),
    ApiQuery(orderByPaginationDto),
    ApiQuery(CarDto.orderByFieldFindAllCarQuery),
    ApiQuery(CarDto.categoryFindAllCarQuery),
    ApiQuery(CarDto.inRentFindAllCarQuery),
    ApiQuery(CarDto.canRentFindAllCarQuery),
    ApiQuery(CarDto.priceLteFindAllCarQuery),
    ApiQuery(CarDto.priceGteFindAllCarQuery),
  );
};

export const CreateDecorator = () => {
  return applyDecorators(
    Permission({
      permissions: [PERMISSIONS.PRODUCT_CREATE]
    }),
    ApiBearerAuth("accessToken"),
    CacheEvict({
      prefix: '*car:list*'
    }),
    HttpCode(HttpStatus.CREATED),
    ApiOperation(CarDto.createCarOperation),
    ApiBody({type: CarDto.CreateCarDto}),
    ApiOkResponse({type: CarDto.CreateCarOkRes}),
    ApiBadRequestResponse({type: CarDto.CreateCarBadReq}),
    ApiUnauthorizedResponse({type: getUnauthorizedResponse('cars')}),
    ApiForbiddenResponse({
      type: getForbiddenResponse('cars', {
        resource: 'car',
        required_mode: 'ANY',
        missing_permissions: [PERMISSIONS.PRODUCT_CREATE],
        required_permissions: [PERMISSIONS.PRODUCT_CREATE],
      })
    }),
    ApiConflictResponse({type: CarDto.CreateConflictCarResponse}),
  );
};

export const UploadImageDecorator = () => {
  return applyDecorators(
    Permission({
      permissions: CarDto.imageCarPermissionsRequired,
      owner: true,
      resource: "car",
      validatorParam: UUIDv4Validator
    }),
    HttpCode(HttpStatus.OK),
    CacheEvict({
      force: true,
      resource: "car"
    }),
    ApiBearerAuth("accessToken"),
    ApiParam(UUID4Dto('cars/id/image')),
    ApiConsumes('multipart/form-data'),
    ApiOperation(CarDto.uploadCarImageOperation),
    ApiBody(CarDto.carUploadApiBody),
    ApiOkResponse({type: CarDto.UploadImageOkRes}),
    ApiBadRequestResponse({type: CarDto.UploadImageBadReq}),
    ApiUnauthorizedResponse({type: getUnauthorizedResponse('cars')}),
    ApiForbiddenResponse({
      type: getForbiddenResponse('cars/id/image', {
        resource: 'car',
        required_mode: 'ANY',
        missing_permissions: CarDto.imageCarPermissionsRequired,
        required_permissions: CarDto.imageCarPermissionsRequired,
      })
    }),
    ApiNotFoundResponse({type: CarDto.UploadImageNotFound}),
    UseInterceptors(FileInterceptor(
      CarConfig.CAR_FILE_FIELD_NAME,
      CarConfig.getMulterOptions(getPath(CAR_IMAGE_UPLOAD_PATH)))
    ),
  );
};

export const UpdateDecorator = () => {
  return applyDecorators(
    Permission<Prisma.CarInclude, z.ZodUUID>({
      owner: true,
      resource: 'car',
      include: {category: true},
      validatorParam: UUIDv4Validator,
      permissions: [PERMISSIONS.PRODUCT_UPDATE],
    }),
    ApiBearerAuth("accessToken"),
    CacheEvict({
      force: true,
      resource: 'car',
    }),
    HttpCode(HttpStatus.OK),
    ApiParam(UUID4Dto('id')),
    ApiBody({type: CarDto.UpdateCarDto}),
    ApiOperation(CarDto.updateCarOperation),
    ApiOkResponse({type: CarDto.OkResponseUpdateCar}),
    ApiBadRequestResponse({type: CarDto.CreateCarBadReq}),
    ApiUnauthorizedResponse({type: getUnauthorizedResponse('cars/id')}),
    ApiForbiddenResponse({
      type: getForbiddenResponse('api/v1/cars/id', {
        resource: 'car',
        required_mode: 'ANY',
        missing_permissions: [PERMISSIONS.PRODUCT_UPDATE],
        required_permissions: [PERMISSIONS.PRODUCT_UPDATE],
      })
    }),
    ApiNotFoundResponse({type: CarDto.NotFoundUpdateCarRes}),
    ApiConflictResponse({type: CarDto.ConflictUpdateCarRes}),
  );
};

export const DeleteDecorator = () => {
  return applyDecorators(
    Permission({
      owner: true,
      resource: 'car',
      validatorParam: UUIDv4Validator,
      permissions: [PERMISSIONS.PRODUCT_DELETE],
    }),
    ApiBearerAuth("accessToken"),
    CacheEvict({
      force: true,
      resource: 'car',
    }),
    HttpCode(HttpStatus.OK),
    ApiParam(UUID4Dto('id')),
    ApiOperation(CarDto.deleteCarOperation),
    ApiNoContentResponse({
      type: getBaseOkResponseSchema<void>({
        path: 'cars/id',
        response: {message: 'Car successfully deleted.'}
      })
    }),
    ApiUnauthorizedResponse({type: getUnauthorizedResponse('cars/id')}),
    ApiNotFoundResponse({type: CarDto.NotFoundUpdateCarRes}),
    ApiForbiddenResponse({
      type: getForbiddenResponse('cars/id', {
        resource: 'car',
        required_mode: 'ANY',
        missing_permissions: [PERMISSIONS.PRODUCT_DELETE],
        required_permissions: [PERMISSIONS.PRODUCT_DELETE],
      })
    }),
  );
};