import { z } from "zod";

export const smartListSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  /** Undefined when editing and keeping the server image; required on create (validated in submit). */
  image: z.union([z.instanceof(File), z.undefined()]),
  items: z
    .array(z.string())
    .min(1, "Select at least one item"),
});

export type SmartListValues = z.infer<typeof smartListSchema>;
