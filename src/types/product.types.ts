export type Discount = {
  amount: number;
  percentage: number;
};

export type Product = {
  id: number | string;
  title: string;
  category: string;
  srcUrl: string;
  gallery?: string[];
  price: number;
  discount: Discount;
  rating: number;
  sku?: string;
  slug?: string;
  description?: string;
};
