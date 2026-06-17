import {Public} from "@/common";
import {ApiTags} from "@nestjs/swagger";
import {Controller, Get} from "@nestjs/common";

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
@Public()
@ApiTags("Favorites")
@Controller("favorites")
export class FavoriteController {
  @Get()
  get(): string {
    return "get favorites successfully.";
  }
}
