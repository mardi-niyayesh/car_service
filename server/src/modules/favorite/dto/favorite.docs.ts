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
