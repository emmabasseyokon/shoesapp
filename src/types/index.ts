export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category_id: string | null;
  images: string[];
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  stock_quantity: number;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: "customer" | "admin";
  created_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  total: number;
  shipping_address: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  customer?: Profile;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  price: number;
  product?: Product;
  variant?: ProductVariant;
}

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}
