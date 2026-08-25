import { z } from 'zod'

export const taskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(4, 'Enter a task title at least 4 characters.')
    .max(200, 'Title must be at most 200 characters.'),
  description: z
    .string()
    .trim()
    .min(1, 'Enter a description.')
    .max(2000, 'Description must be at most 2000 characters.'),
})

export type TaskFormValues = z.infer<typeof taskFormSchema>
