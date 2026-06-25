import {PERMISSIONS} from "@/common";
import {ApiOperationOptions} from "@nestjs/swagger";

export const favoriteFindAllOperation: ApiOperationOptions = {
  summary: 'get user favorites list',
  description: `
  - # **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.USER_SELF}\`\n
  
  Retrieves the complete list of favorite cars for the authenticated user. 
  **Access restricted to users with permission: (user.self) only.**
  
  - Returns an empty array if the user has no favorites.
  - Includes full car details (id, name, slug, company, price_per_day, image).
  - Favorites are ordered by creation date (newest first).
  - This endpoint only returns the current user's own favorites and cannot be used 
    to view other users' favorites.
  
  The response includes the car details embedded within each favorite entry 
  to avoid additional API calls.`,
  operationId: 'get_user_favorites'
};

export const favoriteCreateOperation: ApiOperationOptions = {
  summary: 'add car to user favorites',
  description: `
  - # **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.USER_SELF}\`\n
  
  Adds a specific car to the authenticated user's favorites list.
  **Access restricted to users with permission: (user.self) only.**
  
  - Validates that the car exists before adding.
  - Prevents duplicate favorites (each car can be favorite only once per user).
  - Returns the created favorite record with car details.
  - If the car is already in favorites, returns a conflict error.
  - The user can only add cars to their own favorites list.
  
  This endpoint ensures data integrity and prevents duplicate entries 
  by enforcing a unique constraint on (user_id, car_id).`,
  operationId: 'add_user_favorite'
};

export const favoriteCheckOperation: ApiOperationOptions = {
  summary: 'check if car is favorite by id',
  description: `
  - # **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.USER_SELF}\`\n
  
  Checks whether a specific car is in the authenticated user's favorites list using the car id.
  **Access restricted to users with permission: (user.self) only.**
  
  - Returns **true** if the car is in the user's favorites.
  - Returns **false** if the car is not in the user's favorites.
  - Validates that the car exists before checking.
  - This endpoint only checks the current user's own favorites and cannot be used 
    to check other users' favorites.
  
  The response includes a boolean **isFavorite** field indicating the favorite status.`,
  operationId: 'check_user_favorite_by_id'
};

export const favoriteDeleteOperation: ApiOperationOptions = {
  summary: 'remove car from user favorites',
  description: `
  - # **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.USER_SELF}\`\n
  
  Removes a specific car from the authenticated user's favorites list.
  **Access restricted to users with permission: (user.self) only.**
  
  - Validates that the favorite exists before removal.
  - Returns the removed favorite record upon successful deletion.
  - If the favorite does not exist, returns a not found error.
  - The user can only remove cars from their own favorites list.
  
  This endpoint ensures that users can only manage their own favorites 
  and cannot affect other users' data.`,
  operationId: 'remove_user_favorite'
};
