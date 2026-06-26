import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      login: (user, accessToken) => {
        localStorage.setItem('accessToken', accessToken);
        set({ user, accessToken, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
      setUser: (user) => set({ user }),
    }),
    { name: 'aavritty-auth' },
  ),
);

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.id === product.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i,
            ),
          });
        } else {
          set({ items: [...items, { ...product, quantity }] });
        }
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      getCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'aavritty-cart' },
  ),
);

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) => {
        const exists = get().items.find((i) => i.id === product.id);
        if (exists) {
          set({ items: get().items.filter((i) => i.id !== product.id) });
        } else {
          set({ items: [...get().items, product] });
        }
      },
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      isInWishlist: (id) => get().items.some((i) => i.id === id),
    }),
    { name: 'aavritty-wishlist' },
  ),
);

export const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
