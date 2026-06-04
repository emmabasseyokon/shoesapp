export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
