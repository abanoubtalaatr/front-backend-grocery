export interface Faq {
  id: number;
  question: string;
  answer: string;
  category?: string;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FaqMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number | null;
  to: number | null;
}

export interface FaqLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginatedFaqs {
  data: Faq[];
  meta: FaqMeta;
  links: FaqLinks;
}

export interface SupportReport {
  id: number;
  issue_type: string;
  order_number: string | null;
  message: string;
  status: string;
  created_at?: string;
}
