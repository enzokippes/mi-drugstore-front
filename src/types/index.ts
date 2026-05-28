export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  unlimitedStock: boolean;
  image?: string;
  categoryId: string;
  category?: Category;
  isCombo?: boolean;
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

export interface Order {
  id: string;
  total: number;
  deliveryType: 'PICKUP' | 'DELIVERY';
  address?: string;
  phone?: string;
  notes?: string;
  deliveryTime?: string;
  status: 'PENDING' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'REJECTED';
  paymentId?: string;
  createdAt: string;
  items: OrderItem[];
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
