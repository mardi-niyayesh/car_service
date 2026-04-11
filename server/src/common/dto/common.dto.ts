import z from "zod";

/** base validator for ownership data */
export const OwnerShipValidator = z.object({
  ownership: z.boolean().optional().default(false),
});