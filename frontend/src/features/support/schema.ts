import { z } from 'zod';

export const createSupportSchema = z.object({
  issue_type: z.string().trim().min(2, 'Issue type is required'),
  order_number: z.string().trim().optional(),
  message: z.string().trim().min(10, 'Message must be at least 10 characters'),
});

export type CreateSupportValues = z.infer<typeof createSupportSchema>;
