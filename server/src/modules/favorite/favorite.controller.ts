import type {AccessRequest} from "@/types";
import * as FavoriteDecorator from "./decorators";
import {UUIDv4Validator, ZodPipe} from "@/common";
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

  @Get()
  @FavoriteDecorator.GetListDecorators()
  get() {
    return "get favorites successfully.";
  }

  @Post(":id")
  @FavoriteDecorator.CreateDecorator()
  create(
    @Req() req: AccessRequest,
    @Param("id", new ZodPipe(UUIDv4Validator)) id: string,
  ) {
    console.log(req.user);
    console.log(id);
    return "create favorite successfully.";
  }
}
