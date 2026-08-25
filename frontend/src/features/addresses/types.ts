export type Address = {
  id?: string | number;
  _id?: string | number;
  title?: string;
  address?: string;
  instructions?: string;
  full_name?: string;
  city?: string;
  phone?: string;
  street_address?: string;
};

export type ApiErrorShape = {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
};
