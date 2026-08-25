/** Product row for smart-list item picker (normalized from API). */
export type ProductOption = {
  id: string;
  name: string;
};

type SmartList = {
  id: string;
  name: string;
  updatedAt: Date | string | number;
  image_url?: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
}

export type { SmartList };
