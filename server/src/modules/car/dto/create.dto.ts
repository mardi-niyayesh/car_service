import z from "zod";
import {exampleDate} from "@/lib";
import {createZodDto} from "nestjs-zod";
import type {CarResponse} from "@/types";
import {categoryExampleRes} from "@/modules/category/dto";
import {getBaseOkResponseSchema, getNormalErrorResponse, getZodErrorBody, OwnerShipValidator} from "@/common";

const NameRegex: RegExp = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FFa-zA-Z0-9۰-۹ _-]+$/;

/** create car validator */
export const CreateCarValidator = OwnerShipValidator.extend({
  name: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(NameRegex, {
      error: 'Characters allowed: Persian, Arabic, English, numbers, spaces, "-" and "_".',
    }),

  slug: z
    .string()
    .trim()
    .min(2)
    .max(150)
    .regex(/^(?!.*--)(?!.*__)[a-z][a-z0-9_-]*$/, {
      error:
        'Slug must start with a lowercase letter and contain only lowercase letters, numbers, "_" or "-". No spaces, no repeating "--" or "__".',
    }),

  company: z
    .string()
    .trim()
    .min(2)
    .max(150)
    .regex(NameRegex, {
      error:
        'Characters allowed: Persian, Arabic, English, numbers, spaces, "-" and "_".',
    }),

  price_at_hour: z
    .number()
    .min(0)
    .max(50_000_000),

  tags: z
    .array(
      z
        .string()
        .trim()
        .min(2)
        .max(50)
        .regex(/^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FFa-zA-Z0-9۰-۹_-]+$/, {
          error:
            'Tag can contain Persian, Arabic, English letters, numbers, "-" and "_", but no spaces.',
        })
    )
    .nonempty(),

  description: z
    .string()
    .trim()
    .min(5)
    .max(500)
    .optional(),

  can_rent: z
    .boolean()
    .optional()
    .default(true),

  category_id: z.uuidv4(),
});

/** type of create car validator */
export type CreateCarType = z.infer<typeof CreateCarValidator>;

/** body example create car validator for swagger */
export class CreateCarDto extends createZodDto(CreateCarValidator) {}

export const exampleCarRecord: CarResponse['car'] = {
  id: "c8217255-b4b2-4734-a10c-76a1b752693b",
  created_at: exampleDate,
  updated_at: exampleDate,
  name: "car",
  slug: "car",
  company: "car",
  price_at_hour: 200000,
  tags: [
    "car",
    "test"
  ],
  image: "c8217255-b4b2-4734-a10c-76a1b752693b.png",
  in_rent: false,
  can_rent: true,
  category_id: "ef85d0db-e822-4ec9-8009-da7925c965bd",
  creator_id: "c9e2d14b-c0ff-4d91-8cf5-999eded02757",
  description: "a test car",
  category: categoryExampleRes
};

/** create car ok example response */
export class CreateCarOkRes extends getBaseOkResponseSchema<CarResponse>({
  create: true,
  path: 'cars',
  response: {
    message: '',
    data: {
      car: exampleCarRecord
    }
  }
}) {}

/** bad request example response */
export class CreateCarBadReq extends getZodErrorBody({
  path: 'cars',
  errors: [
    {
      field: "ownership",
      error: "Invalid input: expected boolean, received number"
    },
    {
      field: "name",
      error: "Invalid input: expected string, received number"
    },
    {
      field: "slug",
      error: "Invalid input: expected string, received array"
    },
    {
      field: "slug",
      error: "Too small: expected array to have >=2 items"
    },
    {
      field: "company",
      error: "Invalid input: expected string, received number"
    },
    {
      field: "price_at_hour",
      error: "Invalid input: expected number, received string"
    },
    {
      field: "tags",
      error: "Invalid input: expected array, received boolean"
    }
  ]
}) {}

/** conflict car example response */
export class CreateConflictCarResponse extends getNormalErrorResponse({
  statusCode: 409,
  path: "/api/v1/cars",
  message: "car already exists in database, please change slug",
  error: "Car already exists"
}) {}