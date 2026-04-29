import {PERMISSIONS} from "@/common";
import {ApiOperationOptions} from "@nestjs/swagger";

export const getCartOperation: ApiOperationOptions = {
  summary: 'Get current user\'s cart',
  description: `
  - # **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.USER_SELF}\`

  Retrieves the authenticated user's cart containing all pending rental items.

  Features:
  - Returns cart details including total price and all associated CarRent records
  - Each CarRent includes car information (slug, name, price_per_day, images, category)
  - Only accessible by the cart owner (enforced by user.self permission)
  - Pending rentals can be modified or removed; active/completed rentals are read-only

  Response structure:
  - cart: Cart object with id, total_price, and nested carRents array
  - Each carRent contains rental dates, status, price, and full car details

  Access restricted to users with permission: user.self only.
  `,
  operationId: 'get_cart'
};

export const addToCartOperation: ApiOperationOptions = {
  summary: 'Add car rental to cart',
  description: `
  - # **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.USER_SELF}\`

  Adds a new car rental request to the current user's cart.

  Date validation rules:
  - start_date must be today or later
  - end_date must be at least one day after today
  - Maximum rental period is 30 days from today
  - end_date must be after start_date

  Conflict detection:
  - Automatically checks if the selected car is already rented for any overlapping date range
  - Returns 409 Conflict with appropriate message if overlap detected
  - Overlap detection uses strict date range comparison (end_date > newStart AND start_date < newEnd)

  Car validation:
  - car_slug must exist in database
  - Returns 404 Not Found if car slug is invalid
  - Car must be available for rent (can_rent: true)

  Cart behavior:
  - Creates a new CarRent record with status PENDING
  - Associates the rental with user's existing cart
  - Automatically updates cart total_price (sum of all pending rentals)
  - Multiple rentals can be added to the same cart
  - Each CarRent is independent and can be removed separately

  Note: This endpoint does not process payment. It only reserves the rental request.
  Payment and final confirmation are handled separately.

  Access restricted to users with permission: user.self only.
  `,
  operationId: 'add_to_cart'
};

export const removeFromCartOperation: ApiOperationOptions = {
  summary: 'Remove rental item from cart',
  description: `
  - # **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.USER_SELF}\`

  Removes a specific rental item from the current user's cart by its ID.

  The cart total price is automatically recalculated after removal.

  **Rules:**
  - Only items with status PENDING can be removed
  - Active or completed rentals cannot be removed
  - The item must belong to the authenticated user
  - Returns 404 Not Found if the item does not exist or does not belong to the user

  **Path parameter:**
  - id: UUID of the CarRent record to remove

  Access restricted to users with permission: user.self only.
  `,
  operationId: 'remove_from_cart'
};