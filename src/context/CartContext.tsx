import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import type { Product, CartItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  cartTotal: number;
  cartCount: number;
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function getCartKey(userId?: string): string {
  return userId ? `barbanegra_cart_${userId}` : 'barbanegra_cart';
}

function loadCart(userId?: string): CartItem[] {
  try {
    const key = getCartKey(userId);
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveCart(cart: CartItem[], userId?: string) {
  try {
    const key = getCartKey(userId);
    localStorage.setItem(key, JSON.stringify(cart));
  } catch {
    // storage full
  }
}

function clearCartKey(userId?: string) {
  try {
    const key = getCartKey(userId);
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

function mergeCarts(guestCart: CartItem[], userCart: CartItem[]): CartItem[] {
  const merged = [...userCart];
  for (const guestItem of guestCart) {
    const existing = merged.find(item => item.product.id === guestItem.product.id);
    if (existing) {
      existing.quantity += guestItem.quantity;
    } else {
      merged.push({ ...guestItem });
    }
  }
  return merged;
}

interface CartProviderProps {
  children: ReactNode;
  userId?: string;
}

export const CartProvider = ({ children, userId }: CartProviderProps) => {
  const [cart, setCart] = useState<CartItem[]>(() => loadCart(userId));
  const prevUserId = useRef<string | undefined>(userId);
  const isInitialMount = useRef(true);
  const pendingWriteRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (prevUserId.current !== userId) {
      if (userId && !prevUserId.current) {
        const guestCart = loadCart();
        const userCart = loadCart(userId);
        const merged = mergeCarts(guestCart, userCart);
        setCart(merged);
        saveCart(merged, userId);
        clearCartKey();
      } else if (!userId && prevUserId.current) {
        setCart([]);
      } else if (userId && prevUserId.current && userId !== prevUserId.current) {
        const newCart = loadCart(userId);
        setCart(newCart);
      }
      prevUserId.current = userId;
    }
  }, [userId]);

  useEffect(() => {
    if (!isInitialMount.current) {
      if (pendingWriteRef.current) {
        clearTimeout(pendingWriteRef.current);
      }
      pendingWriteRef.current = setTimeout(() => {
        saveCart(cart, userId);
        pendingWriteRef.current = null;
      }, 50);
    }
    return () => {
      if (pendingWriteRef.current) {
        clearTimeout(pendingWriteRef.current);
      }
    };
  }, [cart, userId]);

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((productId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );
  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  return (
    <CartContext.Provider value={{ cart, cartTotal, cartCount, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};