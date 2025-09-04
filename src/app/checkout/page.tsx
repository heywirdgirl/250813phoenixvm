
"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { PayPalScriptProvider, PayPalButtons, type CreateOrderData, type OnApproveData } from "@paypal/react-paypal-js";
import { createOrderAction, captureOrderAction } from "@/app/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { db } from "@/firebase/clientApp";
import { collection, addDoc } from "firebase/firestore";
import type { Order } from "@/lib/types";


export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/checkout');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!loading && cartItems.length === 0) {
      const isOrderComplete = sessionStorage.getItem('order_complete');
      if (!isOrderComplete) {
         router.replace('/products');
      } else {
         sessionStorage.removeItem('order_complete');
      }
    }
  }, [cartItems, router, loading]);

  const shippingCost = 5.00;
  const grandTotal = cartTotal + shippingCost;
  
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  const createOrder = async (data: CreateOrderData) => {
    setError(null);
    try {
        const response = await createOrderAction(cartItems);
        if (response.id) {
            return response.id;
        }
        const errorMessage = (response as any).error || "Failed to create order ID.";
        console.error("Server Action Error (createOrder):", response);
        throw new Error(errorMessage);
    } catch (err: any) {
        console.error("Error in createOrderAction:", err);
        setError(err.message);
        return "";
    }
  };

  const onApprove = async (data: OnApproveData) => {
    setError(null);
    if (!user) {
        setError("You must be logged in to complete the purchase.");
        return;
    }

    startTransition(async () => {
        // Step 1: Capture the payment via Server Action
        const captureResponse = await captureOrderAction(data.orderID);

        if (!captureResponse.success) {
            setError(captureResponse.error || "An unknown error occurred while capturing your payment.");
            return;
        }

        // Step 2: If capture is successful, save the order to Firestore from the client
        try {
            // Create a new order object that complies with the new Firestore rules
            // We are NOT setting `status` or `createdAt` from the client.
            const newOrder: Omit<Order, 'id' | 'status' | 'createdAt'> = {
                userId: user.uid,
                userEmail: user.email,
                userName: user.displayName,
                items: cartItems.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    variant: item.variant,
                    product: {
                        id: item.product.id,
                        name: item.product.name,
                        price: item.product.price,
                        images: [item.product.images[0]],
                        description: item.product.description,
                        variants: []
                    }
                })),
                totalAmount: grandTotal,
                paypalOrderId: data.orderID,
                paypalTransactionId: captureResponse.transactionId,
            };

            const ordersCollectionRef = collection(db, 'orders');
            const docRef = await addDoc(ordersCollectionRef, newOrder);

            // Step 3: Redirect on successful save
            sessionStorage.setItem('order_complete', 'true');
            clearCart();
            router.push(`/order/${docRef.id}`);

        } catch (firestoreError: any) {
             console.error("Firestore save error:", firestoreError);
             const userMessage = firestoreError.code === 'permission-denied'
                ? `There was a problem saving your order. ${firestoreError.message}.`
                : `We failed to save your order details. Please contact support with transaction ID ${captureResponse.transactionId}.`;

             setError(`Payment was successful, but ${userMessage}`);
        }
    });
  };

  const onError = (err: any) => {
     setError("An error occurred with the PayPal transaction. Please try again.");
     console.error("PayPal onError callback:", err);
  };


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
  
  if (!paypalClientId) {
      return (
         <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Configuration Error</AlertTitle>
                <AlertDescription>
                    PayPal client ID is not configured. Please contact support.
                </AlertDescription>
            </Alert>
         </div>
      )
  }

  return (
    <PayPalScriptProvider options={{ clientId: paypalClientId, currency: "USD", intent: "capture" }}>
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
                                sizes="64px"
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
                 {error && (
                    <Alert variant="destructive" className="mt-4">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Payment Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                {isPending ? (
                    <div className="flex items-center justify-center w-full h-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="ml-4 text-muted-foreground">Processing your order...</p>
                    </div>
                ) : (
                    <PayPalButtons
                        style={{ layout: "vertical", color: "blue" }}
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                    />
                )}
            </CardFooter>
            </Card>
        </div>
        </div>
    </PayPalScriptProvider>
  );
}
