import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CartItem, MenuItem } from '../constants/menu';

// ── Types ─────────────────────────────────────────────────────────────────────
interface CartContextType {
  cart: Record<string, CartItem>;
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  myOrders: string[];
  addOrderId: (id: string) => void;
  removeOrderId: (id: string) => void;
  deviceId: string;
}

// ── Context ───────────────────────────────────────────────────────────────────
const CartContext = createContext<CartContextType | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [myOrders, setMyOrders] = useState<string[]>([]);
  const [deviceId, setDeviceId] = useState<string>('');

  useEffect(() => {
    const initDevice = async () => {
      try {
        let id = await AsyncStorage.getItem('device_id');
        if (!id) {
          id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
          await AsyncStorage.setItem('device_id', id);
        }
        setDeviceId(id);
      } catch (e) {
        setDeviceId(`usr_${Date.now()}`); // fallback
      }
    };
    initDevice();
  }, []);

  const addOrderId = useCallback((id: string) => setMyOrders(p => [id, ...p.filter(x => x !== id)]), []);
  const removeOrderId = useCallback((id: string) => setMyOrders(p => p.filter(x => x !== id)), []);

  const addToCart = useCallback((item: MenuItem) => {
    setCart(prev => {
      const cur = prev[item.id];
      return { ...prev, [item.id]: cur ? { ...cur, quantity: cur.quantity + 1 } : { ...item, quantity: 1 } };
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart(prev => {
      if (!prev[itemId]) return prev;
      const next = { ...prev };
      if (next[itemId].quantity > 1) next[itemId] = { ...next[itemId], quantity: next[itemId].quantity - 1 };
      else delete next[itemId];
      return next;
    });
  }, []);

  const clearCart = useCallback(() => setCart({}), []);

  const cartItems = useMemo(() => Object.values(cart), [cart]);
  const cartCount = useMemo(() => cartItems.reduce((s, i) => s + i.quantity, 0), [cartItems]);
  const cartTotal = useMemo(() => cartItems.reduce((s, i) => s + i.price * i.quantity, 0), [cartItems]);

  return (
    <CartContext.Provider value={{ cart, cartItems, cartCount, cartTotal, addToCart, removeFromCart, clearCart, myOrders, addOrderId, removeOrderId, deviceId }}>
      {children}
    </CartContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
