import {PERMISSIONS} from "@/common";
import {ApiOperationOptions} from "@nestjs/swagger";

export const getCartOperation: ApiOperationOptions = {
  summary: 'Get current user\'s cart',
  description: `
  - # **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.USER_SELF}\`

  Retrieves the authenticated user's cart containing all pending rental items.

  **Features:**
  - Returns cart details including total price and all associated CarRent records
  - Each CarRent includes car information (slug, name, price_per_day, images, category)
  - Only accessible by the cart owner (enforced by \`user.self\` permission)
  - Pending rentals can be modified or removed; active/completed rentals are read-only

  **Response structure:**
  - \`cart\`: Cart object with \`id\`, \`total_price\`, and nested \`carRents\` array
  - Each \`carRent\` contains rental dates, status, price, and full car details

  **Access restricted to users with permission: \`user.self\` only.**`,
  operationId: 'get_cart'
};