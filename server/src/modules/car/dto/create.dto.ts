import z from "zod";
import {createZodDto} from "nestjs-zod";
import {OwnerShipValidator} from "@/common";

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