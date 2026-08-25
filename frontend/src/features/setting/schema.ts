import { z } from "zod";

export const languageSchema = z.object({
  language: z.enum(['en', 'ar']),
});


export const appearanceSchema = z.object({
  theme: z.enum(['light', 'dark']),
});

export const notificationsSchema = z.object({
  order_updates: z.boolean(),
  promotion_emails: z.boolean(),
  nutrition_insights: z.boolean(),
  price_alerts: z.boolean(),
});


export type Language = z.infer<typeof languageSchema>;
export type Appearance = z.infer<typeof appearanceSchema>;
export type Notifications = z.infer<typeof notificationsSchema>;
