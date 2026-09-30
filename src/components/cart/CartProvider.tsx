"use client";

import { createContext, use, useEffect, useMemo, useState } from "react";
import { getProduct } from "@/content/products";

// quantity se mide en docenas: es la única unidad de venta.
export type CartItem = { slug: string; quantity: number };

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  loaded: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (slug: string, quantity?: number) => void;
  update: (slug: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "ce-cart-dozens";

// El carrito vive en el navegador hasta el checkout; el pedido se guarda en DB
// y el servidor recalcula precios desde el catálogo (order-service).
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as CartItem[];
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratar desde localStorage solo es posible tras el montaje
      setItems(stored.filter((item) => getProduct(item.slug)));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, loaded]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      total: items.reduce(
        (sum, item) => sum + (getProduct(item.slug)?.dozenPrice ?? 0) * item.quantity,
        0,
      ),
      loaded,
      open,
      setOpen,
      add: (slug, quantity = 1) => {
        setItems((current) => {
          const existing = current.find((item) => item.slug === slug);
          if (!existing) return [...current, { slug, quantity }];
          return current.map((item) =>
            item.slug === slug ? { ...item, quantity: item.quantity + quantity } : item,
          );
        });
        setOpen(true);
      },
      update: (slug, quantity) =>
        setItems((current) =>
          quantity <= 0
            ? current.filter((item) => item.slug !== slug)
            : current.map((item) => (item.slug === slug ? { ...item, quantity } : item)),
        ),
      clear: () => setItems((current) => (current.length ? [] : current)),
    }),
    [items, loaded, open],
  );

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart() {
  const context = use(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de <CartProvider>.");
  return context;
}
