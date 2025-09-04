
"use server";

import { suggestProductTags, type SuggestProductTagsOutput } from '@/ai/flows/suggest-product-tags';
import { createPayPalOrder, capturePayPalOrder } from '@/lib/paypal';
import type { CartItem } from '@/lib/types';


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
  } catch (e: any) {
    console.error(e);
    return { error: 'Failed to suggest tags. Please try again later.', description: productDescription };
  }
}

// PayPal Actions
export async function createOrderAction(cartItems: CartItem[]) {
    try {
        const response = await createPayPalOrder(cartItems);
        // Successful response should have an 'id'
        if (response.id) {
            return { id: response.id };
        }
        // If not, there's an error in the response structure
        const errorMessage = (response as any).error || "Failed to create PayPal order.";
        console.error("Server Action Error (createOrderAction):", response);
        return { error: errorMessage };
    } catch (error: any) {
        console.error("Server Action Exception (createOrderAction):", error);
        // The error object might have a more specific message
        return { error: error.message || "Could not create PayPal order. Please try again." };
    }
}

export async function captureOrderAction(orderID: string) {
    try {
        const captureData = await capturePayPalOrder(orderID);
        
        // Check if payment was successful
        if (captureData && captureData.status === 'COMPLETED') {
             return {
                success: true,
                captureData: captureData,
            };
        } else {
            // Handle cases where capture was not completed, e.g. PENDING
            const message = (captureData as any)?.details?.[0]?.description || 'PayPal payment not completed.';
            console.error('PayPal capture not completed:', captureData);
            return { error: message };
        }
    } catch (error: any) {
        console.error("Server Action Exception (captureOrderAction): Failed to capture order.", error);
        return { error: error.message || "Payment could not be processed. Please try again." };
    }
}
