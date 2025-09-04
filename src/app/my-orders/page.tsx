
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/clientApp";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import type { Order } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";

interface EnrichedOrder extends Omit<Order, 'createdAt' | 'items'> {
  id: string; 
  createdAt: string; 
  createdAtTimestamp: number;
  items: Array<{
      id: string;
      quantity: number;
      variant: { Color: string; Size: string };
      product: {
          id: string;
          name: string;
          price: number;
          images: string[];
      };
  }>;
}

export default function MyOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<EnrichedOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/my-orders");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        setLoadingOrders(true);
        try {
          const ordersRef = collection(db, "orders");
          const q = query(ordersRef, where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          
          const userOrders = querySnapshot.docs.map(doc => {
              const data = doc.data() as Order;
              
              let createdAtString = 'Date not available';
              let createdAtTimestamp = 0;
              
              if (data.createdAt && typeof (data.createdAt as Timestamp)?.toDate === 'function') {
                  const timestamp = data.createdAt as Timestamp;
                  createdAtString = timestamp.toDate().toLocaleString(); // Use toLocaleString for date and time
                  createdAtTimestamp = timestamp.toMillis();
              } else {
                  createdAtString = 'Processing...';
              }
              
              const safeItems = (data.items || []).map(item => ({
                ...item,
                product: {
                    ...item.product,
                    images: item.product.images?.length > 0 ? item.product.images : ['https://placehold.co/600x600/E91E63/FFFFFF?text=No+Image']
                }
              }));

              return {
                ...data,
                id: doc.id,
                items: safeItems,
                createdAt: createdAtString,
                createdAtTimestamp: createdAtTimestamp,
                status: data.status ?? 'Pending', 
              } as EnrichedOrder;
          });
          
          userOrders.sort((a, b) => b.createdAtTimestamp - a.createdAtTimestamp);

          setOrders(userOrders);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoadingOrders(false);
        }
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-10 w-1/4" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-headline font-bold mb-8">My Orders</h1>

        {loadingOrders ? (
             <div className="space-y-6">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-64 w-full rounded-lg" />
            </div>
        ) : orders.length > 0 ? (
            <div className="space-y-6">
                {orders.map(order => (
                    <Card key={order.id} className="overflow-hidden">
                        <CardHeader className="bg-muted/50 flex flex-row items-center justify-between py-4 px-6">
                           <div className="grid gap-1">
                             <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                             <CardDescription>Date: {order.createdAt}</CardDescription>
                           </div>
                           <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}>
                                {order.status}
                           </Badge>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {order.items.map(item => (
                                <div key={item.id} className="flex items-start gap-4">
                                    <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                                       <Image 
                                            src={item.product.images[0]} 
                                            alt={item.product.name} 
                                            fill
                                            sizes="80px"
                                            className="object-cover"
                                            data-ai-hint="product image"
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-semibold">{item.product.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {item.variant.Color} / {item.variant.Size}
                                        </p>
                                         <p className="text-sm text-muted-foreground">
                                            Quantity: {item.quantity}
                                        </p>
                                    </div>
                                    <p className="font-semibold text-right">${(item.product.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter className="bg-muted/50 py-4 px-6">
                            <div className="flex w-full justify-end font-bold">
                                <span className="mr-4">Total</span>
                                <span>${order.totalAmount.toFixed(2)}</span>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        ) : (
             <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
                <h2 className="mt-6 text-xl font-semibold">No Orders Yet</h2>
                <p className="mt-2 text-muted-foreground">You haven't placed any orders with us yet. Start shopping to see them here!</p>
             </div>
        )}
    </div>
  );
}
