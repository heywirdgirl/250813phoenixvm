
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";


export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/profile");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8 max-w-lg mx-auto">
            <Skeleton className="h-10 w-1/4" />
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-20 w-full" />
                </CardContent>
            </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-lg mx-auto">
         <h1 className="text-4xl font-headline font-bold mb-8">My Profile</h1>
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
                   <Button asChild className="mt-4">
                      <Link href="/my-orders">View My Orders</Link>
                   </Button>
              </CardContent>
          </Card>
        </div>
    </div>
  );
}
