import type {AccessRequest} from "@/types";
import * as FavoriteDecorator from "./decorators";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {Controller, Get, Post, Req} from "@nestjs/common";

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

  @Get()
  @FavoriteDecorator.GetListDecorators()
  get(){
    return "get favorites successfully.";
  }

  @Post()
  @FavoriteDecorator.CreateDecorator()
  create(
    @Req() req: AccessRequest
  ) {
    console.log(req);
    return "create favorite successfully.";
  }
}
