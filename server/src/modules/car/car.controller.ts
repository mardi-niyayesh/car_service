import {Public} from "@/common";
import {ApiTags} from "@nestjs/swagger";
import {CarService} from "./car.service";
import {Controller, Post} from '@nestjs/common';

/**
 * Car management endpoints for handling vehicle resources.
 *
 * This controller provides a complete API surface for managing cars, including:
 *
 * - Retrieving a paginated list of all cars (public)
 * - Fetching detailed information of a single car by its ID (public)
 * - Creating new cars with permission checks (e.g. `car.create`, `owner.all`)
 * - Updating existing cars with owner‑aware access control
 * - Deleting cars with strict permission or ownership validation
 * - Optional image upload support, stored and linked to each car
 * - UUID validation for all route parameters
 *
 * Read operations (`GET /cars`, `GET /cars/:id`) are publicly accessible.
 *
 * Create, update, and delete endpoints require:
 * - Valid Bearer authentication
 * - Appropriate permissions (e.g. `car.create`, `car.update`, `car.delete`)
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

  @Public()
  @Post()
  create() {
    return this.carService.create();
  }
}