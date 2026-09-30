"use client";

import { useEffect } from "react";
import { useCart } from "./CartProvider";

// Se monta en la confirmación del pedido: el carrito ya quedó guardado en DB.
export function ClearCart() {
  const { loaded, clear } = useCart();
  useEffect(() => {
    if (loaded) clear();
  }, [loaded, clear]);
  return null;
}
