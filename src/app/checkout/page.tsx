"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/checkout');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (cartItems.length === 0) {
      router.replace('/products');
    }
  }, [cartItems, router]);

  const handlePayment = () => {
    // Simulate payment processing and order submission
    console.log("Simulating payment with PayPal...");
    console.log("Submitting order to Printful API with items:", cartItems);
    
    // Generate a mock order ID
    const orderId = Math.random().toString(36).substr(2, 9);
    
    // Clear the cart
    clearCart();

    // Redirect to order confirmation page
    router.push(`/order/${orderId}`);
  };

  const shippingCost = 5.00;
  const grandTotal = cartTotal + shippingCost;

  if (loading || !user) {
    return (
       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-headline font-bold text-center mb-8">Checkout</h1>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                   <Skeleton className="h-24 w-full" />
                   <Skeleton className="h-8 w-full" />
                </CardContent>
                <CardFooter>
                    <Skeleton className="h-12 w-full" />
                </CardFooter>
            </Card>
        </div>
      </div>
    );
  }

  if(cartItems.length === 0) return null;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-headline font-bold text-center mb-8">Checkout</h1>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                   <div className="flex items-center gap-4">
                     <div className="w-16 h-16 relative flex-shrink-0">
                        <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="rounded-md object-cover"
                            data-ai-hint="product image"
                        />
                     </div>
                     <div>
                        <p className="font-semibold">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                     </div>
                   </div>
                  <p>${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <Separator />
               <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handlePayment} size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
              Pay with PayPal
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}