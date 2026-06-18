import type {AccessRequest, ApiResponse, FavoriteResponse} from "@/types";
import * as FavoriteDecorator from "./decorators";
import {UUIDv4Validator, ZodPipe} from "@/common";
import {FavoriteService} from "./favorite.service";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {Controller, Get, Param, Post, Req} from "@nestjs/common";

/**
 * Favorite management controller for handling user's favorite cars.
 *
 * This controller provides endpoints for managing the authenticated user's
 * favorite cars list, including adding, removing, retrieving, and checking
 * favorite status of cars.
 *
 * @remarks
 * All endpoints are currently public for development purposes.
 * Authentication will be enforced in production.
 *
 * @example
 * // Get all favorites
 * GET /favorites
 * // Response: { message: "Favorites retrieved successfully." }
 */
@ApiTags("Favorites")
@Controller("favorites")
@ApiBearerAuth("accessToken")
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  /**
   * Retrieve all favorite cars for the authenticated user.
   *
   * @returns List of favorite cars with full details (id, name, slug, company, price, image)
   *
   * @example GET /favorites
   */
  @Get()
  @FavoriteDecorator.GetListDecorators()
  get() {
    return "get favorites successfully.";
  }

  /**
   * Add a car to the authenticated user's favorites list.
   *
   * @param req - Express request with user payload
   * @param id - UUID of the car to be favorite
   * @returns Created favorite record with car details
   *
   * @example POST /favorites/550e8400-e29b-41d4-a716-446655440000
   */
  @Post(":id")
  @FavoriteDecorator.CreateDecorator()
  create(
    @Req() req: AccessRequest,
    @Param("id", new ZodPipe(UUIDv4Validator)) id: string,
  ): Promise<ApiResponse<FavoriteResponse>> {
    return this.favoriteService.create(req.user.userId, id);
  }
}
