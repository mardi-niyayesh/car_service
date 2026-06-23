import * as FavoriteDecorator from "./decorators";
import {FavoriteService} from "./favorite.service";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {Controller, Delete, Get, Param, Post, Query, Req} from "@nestjs/common";
import type {AccessRequest, ApiResponse, FavoriteResponse, ListFavoriteResponse} from "@/types";
import {PaginationValidator, type PaginationValidatorType, UUIDv4Validator, ZodPipe} from "@/common";

/**
 * Controller for managing authenticated user's favorite cars.
 *
 * Provides a complete set of endpoints to handle user-specific favorite operations.
 * All endpoints are secured with Bearer token authentication and follow RESTful conventions.
 *
 * @remarks
 * - All routes require a valid JWT access token in the `Authorization` header.
 * - UUID validation is applied to all `carId` parameters.
 * - Responses are wrapped in a standard `ApiResponse` structure.
 *
 * @features
 * - **GET** `/favorites` → Retrieve a paginated list of the user's favorite cars.
 * - **POST** `/favorites/{carId}` → Add a car to the user's favorites.
 * - **DELETE** `/favorites/{carId}` → Remove a car from the user's favorites.
 * - **GET** `/favorites/{carId}` → Get a single favorite record by car ID.
 * - **GET** `/favorites/check/{carId}` → Check if a specific car is favorite.
 *
 * @example
 * // Get paginated favorites
 * GET /favorites?page=1&limit=10
 *
 * // Add a car to favorites
 * POST /favorites/550e8400-e29b-41d4-a716-446655440000
 *
 * // Remove a car from favorites
 * DELETE /favorites/550e8400-e29b-41d4-a716-446655440000
 *
 * // Check favorite status
 * GET /favorites/check/550e8400-e29b-41d4-a716-446655440000
 *
 * @security Requires Bearer token with `user.self` permission.
 */
@ApiTags("Favorites")
@Controller("favorites")
@ApiBearerAuth("accessToken")
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  /**
   * Retrieves all favorite cars for the authenticated user.
   *
   * @remarks
   * Returns full car details including id, name, slug, company, price, and image.
   * Requires a valid access token in the Authorization header.
   *
   * @returns Promise resolving to a list of favorite cars.
   *
   * @example
   * GET /favorites
   * Response:
   * {
   *   "message": "Favorites retrieved successfully.",
   *   "data": {
   *     "favorites": [
   *       { "id": "abc123", "name": "Tesla Model S", "slug": "tesla-model-s", ... }
   *     ]
   *   }
   * }
   */
  @Get()
  @FavoriteDecorator.GetListDecorators()
  get(
    @Req() req: AccessRequest,
    @Query(new ZodPipe(PaginationValidator)) pagination: PaginationValidatorType
  ): Promise<ApiResponse<ListFavoriteResponse>> {
    return this.favoriteService.get(req.user.userId, pagination);
  }

  /**
   * Adds a car to the authenticated user's favorites list.
   *
   * @remarks
   * If the car is already in favorites, the request will be idempotent.
   * The car must exist in the database.
   *
   * @param req - Express request containing authenticated user data.
   * @param id - UUID of the car to be added to favorites.
   *
   * @returns Promise resolving to the created favorite record with car details.
   *
   * @example
   * POST /favorites/550e8400-e29b-41d4-a716-446655440000
   * Response:
   * {
   *   "message": "Favorite added successfully.",
   *   "data": {
   *     "favorite": { "id": "fav123", "carId": "550e...", "userId": "user456" }
   *   }
   * }
   */
  @Post(":id")
  @FavoriteDecorator.CreateDecorator()
  create(
    @Req() req: AccessRequest,
    @Param("id", new ZodPipe(UUIDv4Validator)) id: string,
  ): Promise<ApiResponse<FavoriteResponse>> {
    return this.favoriteService.create(req.user.userId, id);
  }

  /**
   * Checks if a car is in the authenticated user's favorites list by id.
   *
   * @remarks
   * This endpoint checks the existence of a favorite record for the given car id.
   * Returns a boolean indicating whether the car is favorite.
   *
   * @param req - Express request containing authenticated user data.
   * @param id
   *
   * @returns Promise resolving to an object with `isFavorite` boolean.
   *
   * @example
   * GET /favorites/check/uuid
   * Response:
   * {
   *   "message": "Favorite status checked successfully.",
   *   "data": {
   *     "isFavorite": true
   *   }
   * }
   */
  @Get("check/:id")
  @FavoriteDecorator.CheckDecorator()
  checkByID(
    @Req() req: AccessRequest,
    @Param("id", new ZodPipe(UUIDv4Validator)) id: string,
  ) {
    return this.favoriteService.checkByID(req.user.userId, id);
  }

  /**
   * Removes a car from the authenticated user's favorites list by ID.
   *
   * @remarks
   * This endpoint deletes a favorite record for the authenticated user.
   * The car must exist in the user's favorites list.
   * Only the owner of the favorite can delete it.
   *
   * @param req - Express request containing authenticated user data.
   * @param id - UUID of the car to be removed from favorites.
   *
   * @returns Promise resolving to a success message.
   *
   * @example
   * DELETE /favorites/550e8400-e29b-41d4-a716-446655440000
   * Response:
   * {
   *   "message": "Favorite removed successfully.",
   *   "data": {
   *     "id": "550e8400-e29b-41d4-a716-446655440000"
   *   }
   * }
   */
  @Delete(':id')
  @FavoriteDecorator.DeleteDecorator()
  delete(
    @Req() req: AccessRequest,
    @Param("id", new ZodPipe(UUIDv4Validator)) id: string,
  ): Promise<ApiResponse<FavoriteResponse>> {
    return this.favoriteService.delete(req.user.userId, id);
  }
}
