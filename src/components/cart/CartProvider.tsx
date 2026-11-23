"use client";

import { createContext, use, useEffect, useMemo, useState } from "react";
import { getProduct, MIN_ORDER_UNITS } from "@/content/products";

// quantity son unidades; el pedido mínimo por producto es MIN_ORDER_UNITS.
export type CartItem = { slug: string; quantity: number };

type CartContextValue = {
  items: CartItem[];
  count: number;
  loaded: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (slug: string, quantity?: number) => void;
  update: (slug: string, quantity: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
// Clave nueva: los carritos guardados antes estaban en docenas y no se pueden leer como unidades.
const STORAGE_KEY = "ce-cart-units";

// El carrito vive en el navegador hasta enviar la cotización por WhatsApp.
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
      loaded,
      open,
      setOpen,
      add: (slug, quantity = MIN_ORDER_UNITS) => {
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
          quantity < MIN_ORDER_UNITS
            ? current.filter((item) => item.slug !== slug)
            : current.map((item) => (item.slug === slug ? { ...item, quantity } : item)),
        ),
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
