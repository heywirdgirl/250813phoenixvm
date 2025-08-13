"use client";

import { CartProvider } from "@/context/CartContext";
import { type ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      <Toaster />
    </CartProvider>
  );
}
