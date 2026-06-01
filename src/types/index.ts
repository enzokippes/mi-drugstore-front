export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

export interface Category {
  id: string;
  name: string;
  parentId?: string | null;
  parent?: Category | null;
  children?: Category[];
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  unlimitedStock: boolean;
  image?: string;
  categoryId: string;
  category?: Category;
  isCombo?: boolean;
  isFeatured?: boolean;
  totalSold?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  productName?: string;
  product?: Product | null;
}

export interface DeliveryZone {
  id: string;
  name: string;
  basePrice: number;
  surcharge: number;
  maxDistanceKm?: number;
  active: boolean;
}

export interface Order {
  id: string;
  total: number;
  deliveryType: 'PICKUP' | 'DELIVERY';
  deliveryCost?: number;
  address?: string;
  phone?: string;
  notes?: string;
  deliveryTime?: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'REJECTED';
  paymentId?: string;
  createdAt: string;
  items: OrderItem[];
  deliveryZone?: DeliveryZone | null;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  image?: string;
  price: number;
  originalPrice?: number;
  active: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export interface Settings {
  trackInventory: string;
  [key: string]: string;
}

export interface LoyaltyPointEntry {
  id: string;
  userId: string;
  points: number;
  reason: string;
  orderId?: string;
  createdAt: string;
}

export interface UserPoints {
  totalPoints: number;
}

export interface PointReward {
  id: string;
  name: string;
  description?: string;
  pointsCost: number;
  productId?: string;
  product?: {
    id: string;
    name: string;
    image?: string;
    stock: number;
  } | null;
  image?: string;
  active: boolean;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  number: string;
  notes?: string;
  zoneId?: string;
  zone?: DeliveryZone | null;
  isDefault: boolean;
}

export interface AdminStats {
  revenue: {
    today: number;
    week: number;
    month: number;
  };
  orders: {
    today: number;
    week: number;
    month: number;
    pending: number;
    confirmed: number;
    inTransit: number;
    delivered: number;
  };
  users: number;
  products: {
    total: number;
    lowStock: Product[];
  };
  dailySales: {
    date: string;
    revenue: number;
    orders: number;
  }[];
  topProducts: Product[];
}
