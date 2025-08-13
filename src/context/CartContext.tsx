"use client";

import type { CartItem, Product } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, variant: { Color: string; Size: string }) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, variant: { Color: string; Size: string }) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) =>
          item.product.id === product.id &&
          item.variant.Color === variant.Color &&
          item.variant.Size === variant.Size
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${variant.Color}-${variant.Size}`,
          product,
          variant,
          quantity: 1,
        };
        return [...prevItems, newItem];
      }
    });
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
     toast({
      title: "Item Removed",
      description: `An item has been removed from your cart.`,
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };
  
  const clearCart = () => {
    setCartItems([]);
  }

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const itemCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
