
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/clientApp";
import { collection, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";
import type { Order } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface EnrichedOrder extends Omit<Order, 'createdAt'> {
  createdAt: string; 
}


export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<EnrichedOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/profile");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        setLoadingOrders(true);
        try {
          const ordersRef = collection(db, "orders");
          const q = query(ordersRef, where("userId", "==", user.uid), orderBy("createdAt", "desc"));
          const querySnapshot = await getDocs(q);
          const userOrders = querySnapshot.docs.map(doc => {
              const data = doc.data() as Order;
              
              let createdAtString = 'Date not available';
              // Check if createdAt is a valid Firestore Timestamp object
              if (data.createdAt && typeof (data.createdAt as any).toMillis === 'function') {
                  const timestamp = data.createdAt as Timestamp;
                  createdAtString = new Date(timestamp.toMillis()).toLocaleDateString();
              } else if (data.createdAt) {
                  // Handle cases where it might be a different format, or provide a fallback.
                  // This part is defensive programming.
                  console.warn("Order has an invalid 'createdAt' field:", data);
                  createdAtString = 'Pending date...';
              }
              
              return {
                ...data,
                id: doc.id,
                createdAt: createdAtString,
              } as EnrichedOrder;
          });
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
        <div className="space-y-8">
            <Skeleton className="h-10 w-1/4" />
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-40 w-full" />
                </CardContent>
            </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-headline font-bold mb-8">My Profile</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>My Information</CardTitle>
                    <CardDescription>Your personal details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Name</span>
                        <span className="font-medium">{user.displayName || "Not set"}</span>
                    </div>
                     <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Email</span>
                        <span className="font-medium">{user.email}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>Here are all the orders you've placed with us.</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingOrders ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : orders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-primary truncate hover:text-clip">{order.id}</TableCell>
                        <TableCell>{order.createdAt}</TableCell>
                        <TableCell>
                          <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">${order.totalAmount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </Body>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>You haven't placed any orders yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
