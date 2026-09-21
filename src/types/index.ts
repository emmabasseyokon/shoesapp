export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}
