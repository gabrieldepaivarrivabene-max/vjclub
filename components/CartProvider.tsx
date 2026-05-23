'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ProductVariant, CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, variant: ProductVariant) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, variant) => {
        const items = get().items;
        const existingItem = items.find(
          (item) => item.product.id === product.id && item.variant.id === variant.id
        );
        if (existingItem) {
          set({
            items: items.map((item) =>
              item.product.id === product.id && item.variant.id === variant.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...items, { id: crypto.randomUUID(), product, variant, quantity: 1 }] });
        }
      },
      removeItem: (productId, variantId) => {
        set({ items: get().items.filter((item) => !(item.product.id === productId && item.variant.id === variantId)) });
      },
      updateQuantity: (productId, variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
        } else {
          set({
            items: get().items.map((item) =>
              item.product.id === productId && item.variant.id === variantId
                ? { ...item, quantity }
                : item
            ),
          });
        }
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },
    }),
    { name: 'vj-club-cart' }
  )
);
