export type Category = {
  id: string;
  label: string;
  icon: string | null;
  sort_order: number;
};

export type Brand = {
  id: string;
  name: string;
  logo_url: string | null;
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  category_id: string | null;
  brand_id: string | null;
  price: number;
  old_price: number | null;
  stock: number;
  is_new: boolean;
  is_best_seller: boolean;
  is_active: boolean;
  rating: number;
  reviews_count: number;
  brands?: { name: string } | null;
  product_images?: { storage_path: string; sort_order: number }[];
};

export type Slide = {
  id: string;
  title: string;
  subtitle: string | null;
  storage_path: string;
  link_url: string | null;
  sort_order: number;
  is_active: boolean;
};

export type OrderStatus = "en_attente" | "confirmee" | "en_preparation" | "expediee" | "livree";
export type PaymentMethod = "wave" | "orange_money" | "a_la_livraison";
export type DeliveryZone = "dakar" | "regions";

export type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string | null;
  delivery_zone: DeliveryZone;
  delivery_fee: number;
  payment_method: PaymentMethod;
  subtotal: number;
  total: number;
  status: OrderStatus;
  created_at: string;
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imagePath: string | null;
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  en_attente: "En attente",
  confirmee: "Confirmée",
  en_preparation: "En préparation",
  expediee: "Expédiée",
  livree: "Livrée",
};
