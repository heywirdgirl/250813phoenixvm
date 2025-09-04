
// src/components/OrderForm.tsx
"use client";

import { useState, useTransition } from 'react';
import { createPrintfulDraftOrder } from '@/app/actions';
import type { Recipient, OrderItem } from '@/lib/types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal, CheckCircle } from 'lucide-react';

export default function OrderForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult(null);

    // Sample data - in a real app, you would get this from the cart state
    // IMPORTANT: These sync_variant_id values are examples and will NOT work.
    // You must replace them with actual variant IDs from YOUR Printful products.
    const items: OrderItem[] = [
      {
        sync_variant_id: 7679, // Example ID for a "Bella + Canvas 3001" T-Shirt, size L, color Black
        quantity: 1,
      },
      {
        sync_variant_id: 7675, // Example ID for a "Bella + Canvas 3001" T-Shirt, size S, color White
        quantity: 2,
      },
    ];

    // Get data from the form
    const formData = new FormData(event.currentTarget);
    const recipient: Recipient = {
      name: formData.get('name') as string,
      address1: formData.get('address1') as string,
      city: formData.get('city') as string,
      state_code: formData.get('state_code') as string,
      country_code: formData.get('country_code') as string,
      zip: formData.get('zip') as string,
    };

    startTransition(async () => {
      const response = await createPrintfulDraftOrder({ recipient, items });
      if (response.success) {
        setResult({ success: true, message: `Successfully created draft order! Firestore Order ID: ${response.orderId}` });
      } else {
        setResult({ success: false, message: `Failed to create order: ${response.error}` });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Information</CardTitle>
        <CardDescription>Enter the recipient's details to create a draft order.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input name="name" id="name" required defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address1">Address Line 1</Label>
              <Input name="address1" id="address1" required defaultValue="19749 Dearborn St" />
            </div>
          </div>
          <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input name="city" id="city" required defaultValue="Chatsworth" />
          </div>
          <div className="grid grid-cols-3 gap-4">
             <div className="space-y-2">
              <Label htmlFor="state_code">State Code</Label>
              <Input name="state_code" id="state_code" required defaultValue="CA" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="country_code">Country Code</Label>
              <Input name="country_code" id="country_code" required defaultValue="US" />
            </div>
             <div className-="space-y-2">
              <Label htmlFor="zip">ZIP Code</Label>
              <Input name="zip" id="zip" required defaultValue="91311" />
            </div>
          </div>
           {result && (
              <Alert variant={result.success ? "default" : "destructive"}>
                {result.success ? <CheckCircle className="h-4 w-4" /> : <Terminal className="h-4 w-4" />}
                <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>
                  {result.message}
                </AlertDescription>
              </Alert>
          )}

        </CardContent>
        <CardFooter>
            <Button type="submit" disabled={isPending}>
                {isPending ? 'Processing...' : 'Create Draft Order'}
            </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
