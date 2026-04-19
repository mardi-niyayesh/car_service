import {applyDecorators, HttpCode, HttpStatus} from "@nestjs/common";
import {
  Cacheable,
  CacheEvict,
  getForbiddenResponse,
  getUnauthorizedResponse,
  limitPaginationDto,
  orderByPaginationDto,
  pagePaginationDto,
  Permission,
  PERMISSIONS,
  Public,
  UUID4Dto, UUIDv4Validator
} from "@/common";
import {ONE_MINUTE_MS} from "@/lib";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody, ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";
import * as CategoryDto from "@/modules/category/dto";

export const FindOneDecorators = () => {
  return applyDecorators(
    Public(),
    Cacheable({
      resource: 'category',
      paramsKey: ['id'],
      ttl: ONE_MINUTE_MS * 60
    }),
    HttpCode(HttpStatus.OK),
    ApiOperation(CategoryDto.categoryFindOneOperation),
    ApiParam(UUID4Dto('id')),
    ApiOkResponse({type: CategoryDto.FindOneCategoryOkRes}),
    ApiBadRequestResponse({type: CategoryDto.FindOneBadRequest}),
    ApiNotFoundResponse({type: CategoryDto.FindOneCategoryNotFound}),
  );
};

export const FindAllDecorators = () => {
  return applyDecorators(
    Public(),
    Cacheable({
      resource: 'category',
      pagination: true,
      ttl: ONE_MINUTE_MS * 60
    }),
    HttpCode(HttpStatus.OK),
    ApiOperation(CategoryDto.categoryFindAllOperation),
    ApiQuery(pagePaginationDto),
    ApiQuery(limitPaginationDto),
    ApiQuery(orderByPaginationDto),
    ApiOkResponse({type: CategoryDto.FindAllCategoriesRes}),
  );
};

export const CreateDecorators = () => {
  return applyDecorators(
    Permission({
      permissions: [PERMISSIONS.CATEGORY_CREATE]
    }),
    ApiBearerAuth("accessToken"),
    CacheEvict({
      prefix: `*category:list*`,
    }),
    ApiOperation(CategoryDto.categoryCreateOperation),
    ApiBody({type: CategoryDto.CreateCategoryDto}),
    ApiOkResponse({type: CategoryDto.CreateCategoryOkRes}),
    ApiBadRequestResponse({type: CategoryDto.CreateCategoryBadReq}),
    ApiUnauthorizedResponse({type: getUnauthorizedResponse('categories')}),
    ApiForbiddenResponse({type: getForbiddenResponse('categories')}),
    ApiConflictResponse({type: CategoryDto.CrateCategoryConflict}),
  );
};

export const DeleteDecorators = () => {
  return applyDecorators(
    Permission({
      permissions: [PERMISSIONS.CATEGORY_DELETE],
      owner: true,
      resource: "category",
      validatorParam: UUIDv4Validator
    }),
    ApiBearerAuth("accessToken"),
    CacheEvict({
      force: true,
      resource: "category",
    }),
    HttpCode(HttpStatus.OK),
    ApiOperation(CategoryDto.categoryDeleteOperation),
    ApiParam(UUID4Dto('id')),
    ApiOkResponse({type: CategoryDto.DeleteCategoryOkRes}),
    ApiUnauthorizedResponse({type: getUnauthorizedResponse('categories/id')}),
    ApiForbiddenResponse({type: CategoryDto.DeleteForbiddenResponse}),
    ApiNotFoundResponse({type: CategoryDto.DeleteCategoryNotFound}),
  );
};

export const UpdateDecorators = () => {
  return applyDecorators(
    Permission({
      permissions: [PERMISSIONS.CATEGORY_UPDATE],
      owner: true,
      resource: "category",
      validatorParam: UUIDv4Validator
    }),
    ApiBearerAuth("accessToken"),
    CacheEvict({
      force: true,
      resource: "category",
    }),
    HttpCode(HttpStatus.OK),
    ApiOperation(CategoryDto.categoryUpdateOperation),
    ApiBody({type: CategoryDto.UpdateCategoryDto}),
    ApiParam(UUID4Dto('id')),
    ApiOkResponse({type: CategoryDto.UpdateCategoryOkRes}),
    ApiForbiddenResponse({type: CategoryDto.ForbiddenUpdateCategoryRes}),
    ApiNotFoundResponse({type: CategoryDto.NotFoundUpdateCategoryRes}),
    ApiConflictResponse({type: CategoryDto.UpdateCategoryConflictRes}),
  );
};