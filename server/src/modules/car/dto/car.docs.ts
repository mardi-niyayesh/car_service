import {ApiOperationOptions} from "@nestjs/swagger";
import {ONE_MB_OF_BYTE, PERMISSIONS} from "@/common";
import {maxFileSize, allowedFileTypeSplit} from "../configs";

export const findOneCarOperation: ApiOperationOptions = {
  summary: "Find one car by slug",
  operationId: "find_one_car",
  description: `
  - ## Accessible to all users (public endpoint)
  - ## Returns detailed information about a car identified by its unique slug.`
};

export const findAllCarOperation: ApiOperationOptions = {
  summary: "Find list of cars with pagination",
  operationId: "find_all_cars",
  description: `
  ## 🚗 Get paginated list of cars

  ### 🔓 Access
  - **Public endpoint** - No authentication required

  ### 📊 Available Filters

  | Filter | Type | Description |
  | :--- | :--- | :--- |
  | \`category\` | string | Filter by category slug (e.g., "shiraz", "tehran") |
  | \`price_per_day_gte\` | integer | Minimum price per day (inclusive) |
  | \`price_per_day_lte\` | integer | Maximum price per day (inclusive) |
  | \`in_rent\` | boolean | Filter cars currently being rented |
  | \`can_rent\` | boolean | Filter cars available for rent |

  ### 📈 Sorting

  | Parameter | Values | Default |
  | :--- | :--- | :--- |
  | \`order_by_field\` | \`created_at\`, \`price_per_day\` | \`created_at\` |
  | \`order_by\` | \`asc\`, \`desc\` | \`desc\` |

  ### 📄 Pagination

  | Parameter | Type | Default | Description |
  | :--- | :--- | :--- | :--- |
  | \`page\` | integer | \`1\` | Page number |
  | \`limit\` | integer | \`10\` | Items per page |

  ### 📝 Example Request

  \`\`\`http
  GET /cars?category=suv&price_per_day_gte=500000&price_per_day_lte=1500000&order_by_field=price_per_day&order_by=asc&page=1&limit=10
  \`\`\`

  ### ✅ Example Response

  \`\`\`json
  {
    "message": "cars successfully found.",
    "data": {
      "count": 25,
      "cars": [...]
    }
  }
  \`\`\`
  `,
};

export const imageCarPermissionsRequired = [
  PERMISSIONS.PRODUCT_UPDATE,
  PERMISSIONS.PRODUCT_CREATE,
];

export const createCarOperation: ApiOperationOptions = {
  operationId: 'create_car',
  summary: "Create a new car with ownership permission",
  description: `
  - # **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.PRODUCT_CREATE}\`\n
  Create a Car only roles with permission (owner.all or product.create) can accessibility to this route`
};

export const uploadCarImageOperation: ApiOperationOptions = {
  operationId: 'upload_car_image',
  summary: "Upload a car image with ownership permission",
  description: `
  - # 🔐 PERMISSIONS REQUIRED: **any of** \`${imageCarPermissionsRequired.join(", ")}\`\n
  Create a category only roles with permission (owner.all or product.create or product.update) can accessibility to this route
  
  - ## File Type Allowed: ${allowedFileTypeSplit}
  - ## Max File Size: ${maxFileSize / ONE_MB_OF_BYTE} MB`
};

export const updateCarOperation: ApiOperationOptions = {
  operationId: 'update_car',
  summary: "Update a exist car with id and ownership permission",
  description: `
  - # **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.PRODUCT_UPDATE}\`\n
  Update a exist car with id and ownership permission (owner.all or product.update) can accessibility to this route`
};

export const deleteCarOperation: ApiOperationOptions = {
  operationId: 'delete_car',
  summary: "Delete a exist car with id and ownership permission",
  description: `
  - # **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.PRODUCT_UPDATE}\`\n
  Delete a exist car with id and ownership permission (owner.all or product.delete) can accessibility to this route`
};