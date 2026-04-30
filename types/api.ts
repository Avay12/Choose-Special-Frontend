export interface User {
  id: number;
  email: string;
  name: string;
  role: "user" | "admin";
  credit: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Card {
  id: number;
  template_id: string;
  title: string;
  description?: string;
  image_url: string;
  occasion: string;
  price: number;
  custom_data: string; // JSON string
  user_id: number;
  user?: User;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  user_id: number;
  user?: User;
  total_amount: number;
  status: "pending" | "paid" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  card_id: number;
  card?: Card;
  price: number;
  quantity: number;
  created_at: string;
  updated_at: string;
}
export interface CategoryPrice {
  id: number;
  category: string;
  price: number;
  created_at: string;
  updated_at: string;
}
