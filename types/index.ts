export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'sneakers' | 'shirts' | 'cleats';
  image_url: string;
  created_at: string;
  product_variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  stock: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  total_amount: number;
  payment_status: string;
  pagseguro_transaction_id?: string;
  created_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  price_at_time: number;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  sender_type: 'customer' | 'admin';
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface CartItem {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
}
