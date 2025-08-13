"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Badge } from "../ui/badge";

export default function Header() {
  const { itemCount } = useCart();

  return (
    <header className="bg-card border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-headline font-bold text-primary">
              Printful Boutique
            </Link>
          </div>
          <nav className="hidden md:flex md:space-x-8">
            <Link
              href="/"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              Products
            </Link>
            <Link
              href="/admin/suggest-tags"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              AI Tagger
            </Link>
          </nav>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart" aria-label="Open shopping cart">
                <div className="relative">
                  <ShoppingCart className="h-6 w-6" />
                  {itemCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 justify-center p-0">{itemCount}</Badge>
                  )}
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
