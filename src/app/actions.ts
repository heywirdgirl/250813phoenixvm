"use server";

import { suggestProductTags, type SuggestProductTagsOutput } from '@/ai/flows/suggest-product-tags';
import { createPayPalOrder, capturePayPalOrder } from '@/lib/paypal';
import type { CartItem, User } from '@/lib/types';

export interface SuggestTagsState {
  tags?: string[];
  error?: string;
  description?: string;
}

export async function handleSuggestTags(
  prevState: SuggestTagsState,
  formData: FormData,
): Promise<SuggestTagsState> {
  const productDescription = formData.get('description') as string;
  
  if (!productDescription || productDescription.trim().length < 10) {
    return { error: 'Please enter a product description of at least 10 characters.', description: productDescription };
  }

  try {
    const result: SuggestProductTagsOutput = await suggestProductTags({ productDescription });
    return { tags: result.tags, description: productDescription };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to suggest tags. Please try again later.', description: productDescription };
  }
}

// PayPal Actions
export async function createOrderAction(cartItems: CartItem[]) {
    try {
        return await createPayPalOrder(cartItems);
    } catch (error) {
        console.error("Failed to create PayPal order:", error);
        return { error: "Could not create PayPal order. Please try again." };
    }
}

export async function captureOrderAction(orderID: string, cartItems: CartItem[], user: User) {
    try {
        const captureData = await capturePayPalOrder(orderID);
        
        // Check if payment was successful
        if (captureData && captureData.status === 'COMPLETED') {
            // The Printful order creation has been removed.
            // You can add logic here to save the order to your own database.
            const mockOrderId = `MOCK-${Date.now()}`;
            
            // Return relevant data to the client
            return {
                success: true,
                orderId: mockOrderId,
                trackingNumber: mockOrderId, 
            };
        } else {
            throw new Error('PayPal payment not completed.');
        }
    } catch (error) {
        console.error("Failed to capture order:", error);
        return { error: "Payment could not be processed. Please try again." };
    }
}
