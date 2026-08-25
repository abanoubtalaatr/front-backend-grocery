import { z } from "zod";

export const createAddressSchema = z.object({
  full_name: z.string().trim().min(2, "Full name is required"),
  city: z.string().trim().min(2, "City is required"),
  phone: z.string().trim().min(7, "Phone is required"),
  street_address: z.string().trim().min(2, "Street address is required"),
  address: z.string().trim().min(2, "Address is required"),
});

export type CreateAddressValues = z.infer<typeof createAddressSchema>;
