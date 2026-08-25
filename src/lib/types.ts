export type Category = "men" | "women" | "kids" | "sports";

export type Style =
  | "formal"
  | "casual"
  | "heels"
  | "flats"
  | "sandals"
  | "sports"
  | "boots";

export type Collection = "LMB Heritage" | "LMB Édition" | "LMB Sport";

export type Tag = "new-arrival" | "bestseller" | "party-wear" | "daily-wear";

export type Product = {
  id: string;
  slug: string;
  title: string;
  category: Category;
  style: Style;
  collection: Collection;
  tags: Tag[];
  price: number;
  mrp: number;
  rating: number;
  reviewsCount: number;
  stock: number;
  sizes: number[];
  colorway: string;
  color: string;
  colorHex: string;
  swatch: [string, string];
  description: string;
  image?: string;
  images?: string[];
};

export type OrderStatus =
  | "ordered"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type OrderItem = {
  productId: string;
  title: string;
  price: number;
  qty: number;
  size: number;
  swatch: [string, string];
  image?: string;
};

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
};

export type ShipmentStatus =
  | "not_shipped"
  | "awb_assigned"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "rto";

export type Shipment = {
  orderId: string;
  courier: string | null;
  awbCode: string | null;
  status: ShipmentStatus;
  lastUpdate: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedAt: string;
  ordersCount: number;
  totalSpent: number;
  blocked: boolean;
};
