export const Language = {
  en: 'English',
  ar: 'Arabic',
};

export const Appearance = {
  light: 'Light',
  dark: 'Dark',
};

export const Notifications = {
  order_updates: 'Order Updates',
  promotion_emails: 'Promotion Emails',
  nutrition_insights: 'Nutrition Insights',
  price_alerts: 'Price Alerts',
};

export type Language = keyof typeof Language;
export type Appearance = keyof typeof Appearance;
export type Notifications = keyof typeof Notifications;