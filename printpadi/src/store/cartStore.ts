// ============================================================
// PrintPadi – Cart Store
// Exact port of features/cart/store/cart-store.ts
// Uses Zustand + Capacitor Preferences for native persistence
// ============================================================

import { create } from 'zustand';
import { Preferences } from '@capacitor/preferences';
import type { Cart, CartItem, CartItemOption, Money, Product } from '../models/domain';
import {
  clampQuantity,
  getMinQuantity,
  getStockCeiling,
} from '../lib/pricing';

// ── Types ────────────────────────────────────────────────────

type AddItemInput = {
  product:      Product;
  quantity:     number;
  options?:     CartItemOption;
  unitPrice?:   number;
  minQuantity?: number;
  maxQuantity?: number;
  image?:       string;
};

type CartState = {
  cart:          Cart;
  addItem:       (input: AddItemInput) => void;
  removeItem:    (itemId: string) => void;
  incrementItem: (itemId: string) => void;
  decrementItem: (itemId: string) => void;
  clearCart:     () => void;
  subtotal:      () => Money;
  itemCount:     () => number;
  /** Persist to device storage (called after every mutation) */
  _persist:      () => Promise<void>;
  /** Rehydrate from device storage on app launch */
  hydrate:       () => Promise<void>;
};

// ── Constants ─────────────────────────────────────────────────

const CART_STORAGE_KEY  = 'printpadi:cart';
const cartCurrency: Money['currency'] = 'NGN';

// ── Helpers ───────────────────────────────────────────────────

const toMoney = (amount: number): Money => ({ amount, currency: cartCurrency });

/**
 * Builds a deterministic cart item ID from the product + selected options.
 * Exact replica of createCartItemId() in cart-store.ts.
 */
const createCartItemId = (input: AddItemInput): string => {
  const choices   = input.options?.choiceSelections;
  const choicesKey = choices
    ? Object.keys(choices)
        .sort()
        .map(k => `${k}:${choices[k] ?? ''}`)
        .join('|')
    : '';
  return [
    input.product.id,
    input.options?.colorId ?? input.options?.colorHex ?? input.options?.color ?? 'default-color',
    input.options?.sizeOptionId ?? input.options?.size ?? 'default-size',
    choicesKey || 'default-choices',
    input.options?.designMethod   ?? 'default-design-method',
    input.options?.designFileUrl  ?? 'no-design-file',
  ].join(':');
};

const emptyCart = (): Cart => ({ items: [], currency: cartCurrency });

// ── Store ─────────────────────────────────────────────────────

export const useCartStore = create<CartState>((set, get) => ({
  cart: emptyCart(),

  // ── Hydrate from Capacitor Preferences (replaces localStorage) ──
  hydrate: async () => {
    try {
      const { value } = await Preferences.get({ key: CART_STORAGE_KEY });
      if (!value) return;
      const parsed = JSON.parse(value) as Cart;
      if (parsed && Array.isArray(parsed.items)) {
        set({ cart: parsed });
      }
    } catch {
      // corrupted – start fresh
    }
  },

  // ── Internal: write to Capacitor Preferences ──
  _persist: async () => {
    try {
      await Preferences.set({
        key:   CART_STORAGE_KEY,
        value: JSON.stringify(get().cart),
      });
    } catch {
      /* non-fatal */
    }
  },

  // ── addItem: exact port ──────────────────────────────────────
  addItem: ({ product, quantity, options, unitPrice, minQuantity, maxQuantity, image }) => {
    const itemId = createCartItemId({ product, quantity, options });

    set(state => {
      const resolvedMinQuantity = Math.max(
        1,
        Math.floor(minQuantity ?? getMinQuantity(product)),
      );

      const requestedMaxQuantity = options?.colorId
        ? getStockCeiling(product, options.color, options.colorId)
        : options?.color
          ? getStockCeiling(product, options.color)
          : getStockCeiling(product);

      const resolvedMaxQuantity = Math.max(
        0,
        Math.floor(maxQuantity ?? requestedMaxQuantity),
      );

      // Guard: can't add if stock ceiling is below MOQ
      if (resolvedMaxQuantity < resolvedMinQuantity) return state;

      const safeUnitPrice = Number.isFinite(unitPrice)
        ? Math.max(0, Math.floor(unitPrice as number))
        : product.price[0] ?? 0;

      const existing = state.cart.items.find(item => item.id === itemId);

      if (existing) {
        // Merge into existing line
        const mergedQuantity = clampQuantity(
          existing.quantity + quantity,
          resolvedMinQuantity,
          resolvedMaxQuantity,
        );
        return {
          cart: {
            ...state.cart,
            items: state.cart.items.map(item =>
              item.id === itemId
                ? {
                    ...item,
                    quantity:    mergedQuantity,
                    unitPrice:   toMoney(safeUnitPrice),
                    minQuantity: resolvedMinQuantity,
                    maxQuantity: resolvedMaxQuantity,
                  }
                : item,
            ),
          },
        };
      }

      // New line item
      const safeQuantity = clampQuantity(quantity, resolvedMinQuantity, resolvedMaxQuantity);

      const newItem: CartItem = {
        id:          itemId,
        productId:   product.id,
        name:        product.name.trim(),
        image:       image ?? product.images[0] ?? '/shirts.svg',
        unitPrice:   toMoney(safeUnitPrice),
        quantity:    safeQuantity,
        minQuantity: resolvedMinQuantity,
        maxQuantity: resolvedMaxQuantity,
        options:     options ? { ...options } : undefined,
      };

      return {
        cart: {
          ...state.cart,
          items: [...state.cart.items, newItem],
        },
      };
    });

    void get()._persist();
  },

  // ── removeItem ───────────────────────────────────────────────
  removeItem: itemId => {
    set(state => ({
      cart: {
        ...state.cart,
        items: state.cart.items.filter(item => item.id !== itemId),
      },
    }));
    void get()._persist();
  },

  // ── incrementItem ────────────────────────────────────────────
  incrementItem: itemId => {
    set(state => ({
      cart: {
        ...state.cart,
        items: state.cart.items.map(item =>
          item.id === itemId
            ? {
                ...item,
                quantity:
                  item.maxQuantity != null
                    ? Math.min(item.maxQuantity, item.quantity + 1)
                    : item.quantity + 1,
              }
            : item,
        ),
      },
    }));
    void get()._persist();
  },

  // ── decrementItem ────────────────────────────────────────────
  decrementItem: itemId => {
    set(state => ({
      cart: {
        ...state.cart,
        items: state.cart.items
          .map(item =>
            item.id === itemId
              ? {
                  ...item,
                  quantity: Math.max(item.minQuantity ?? 1, item.quantity - 1),
                }
              : item,
          )
          .filter(item => item.quantity > 0),
      },
    }));
    void get()._persist();
  },

  // ── clearCart ────────────────────────────────────────────────
  clearCart: () => {
    set({ cart: emptyCart() });
    void get()._persist();
  },

  // ── Derived ─────────────────────────────────────────────────
  subtotal: () => {
    const amount = get().cart.items.reduce(
      (sum, item) => sum + item.unitPrice.amount * item.quantity,
      0,
    );
    return toMoney(amount);
  },

  itemCount: () =>
    get().cart.items.reduce((count, item) => count + item.quantity, 0),

  // ── Convenience accessor for items ───────────────────────────
  items: [] as CartItem[],

  // ── Total price ──────────────────────────────────────────────
  totalPrice: () => {
    const amount = get().cart.items.reduce(
      (sum, item) => sum + item.unitPrice.amount * item.quantity,
      0,
    );
    return amount;
  },
}));
