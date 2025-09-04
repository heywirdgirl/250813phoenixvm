
"use server";

import { suggestProductTags, type SuggestProductTagsOutput } from '@/ai/flows/suggest-product-tags';
import { createPayPalOrder, capturePayPalOrder } from '@/lib/paypal';
import { createDraftOrder } from '@/lib/printful';
import type { CartItem, Recipient, OrderItem } from '@/lib/types';
import { db } from "@/firebase/clientApp";
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";


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
        if (response.id) {
            return { id: response.id };
        }
        const errorMessage = (response as any).error || "Failed to create PayPal order.";
        console.error("Server Action Error (createOrderAction):", response);
        return { error: errorMessage };
    } catch (error: any) {
        console.error("Server Action Exception (createOrderAction):", error);
        return { error: error.message || "Could not create PayPal order. Please try again." };
    }
}

export async function captureOrderAction(orderID: string) {
    try {
        const captureData = await capturePayPalOrder(orderID);
        
        if (captureData && captureData.status === 'COMPLETED') {
             return {
                success: true,
                captureData: captureData,
            };
        } else {
            const message = (captureData as any)?.details?.[0]?.description || 'PayPal payment not completed.';
            console.error('PayPal capture not completed:', captureData);
            return { error: message };
        }
    } catch (error: any) {
        console.error("Server Action Exception (captureOrderAction):", error);
        return { error: error.message || "Payment could not be processed. Please try again." };
    }
}


// Printful Server Action
export async function createPrintfulDraftOrder(
  { recipient, items }: { recipient: Recipient, items: OrderItem[] }
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    // Step 1: Create an initial order document in Firestore to get an ID
    const ordersCollectionRef = collection(db, "orders");
    const newOrderRef = await addDoc(ordersCollectionRef, {
      recipient,
      items, // Storing Printful items for reference
      status: 'pending_printful',
      createdAt: serverTimestamp(),
      // We don't have a user ID here, this action is for guest checkout
      // Or you could adapt it to take a userId
    });
    
    // Step 2: Call Printful API to create the draft order
    const printfulResult = await createDraftOrder(recipient, items);
    
    if (printfulResult.code === 200 && printfulResult.result) {
      const printfulOrder = printfulResult.result;
      
      // Step 3: Update the Firestore document with the Printful order ID and status
      const orderDocRef = doc(db, "orders", newOrderRef.id);
      await updateDoc(orderDocRef, {
        printfulOrderId: printfulOrder.id,
        printfulOrderStatus: printfulOrder.status,
        status: 'draft', // Update status to reflect Printful's state
      });

      return { success: true, orderId: newOrderRef.id };
    } else {
      // If Printful API returns an error
      throw new Error(printfulResult.result || 'Failed to create Printful order');
    }

  } catch (e: any) {
    console.error("Failed to create Printful draft order:", e);
    return { success: false, error: e.message };
  }
}
