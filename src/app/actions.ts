
"use server";

import { suggestProductTags, type SuggestProductTagsOutput } from '@/ai/flows/suggest-product-tags';
import { createPayPalOrder, capturePayPalOrder } from '@/lib/paypal';
import { createDraftOrder } from '@/lib/printful';
import type { CartItem, Recipient, OrderItem, Order, User } from '@/lib/types';
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


// This action captures the PayPal order and saves the order to Firestore.
export async function captureOrderAndSaveAction(
    orderID: string, 
    cartItems: CartItem[],
    grandTotal: number,
    user: User,
    shippingDetails: Recipient
) {
    try {
        const captureData = await capturePayPalOrder(orderID);
         if (!captureData || captureData.status !== 'COMPLETED') {
            const message = (captureData as any)?.details?.[0]?.description || 'PayPal payment not completed.';
            throw new Error(message);
        }

        const transactionId = captureData.purchase_units[0]?.payments?.captures[0]?.id || 'N/A';
        
        // Payment is successful, now save the order to Firestore.
        const newOrder: Omit<Order, 'id'> = {
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
                    description: '', 
                    variants: [] 
                }
            })),
            totalAmount: grandTotal,
            paypalOrderId: orderID,
            paypalTransactionId: transactionId,
            createdAt: serverTimestamp(),
            status: 'Pending', // Initial status
            recipient: shippingDetails
        };

        const ordersCollectionRef = collection(db, 'orders');
        const docRef = await addDoc(ordersCollectionRef, newOrder);

        return { 
            success: true, 
            firestoreOrderId: docRef.id,
        };

    } catch (error: any) {
        console.error("Server Action Exception (captureOrderAndSaveAction):", error);
        // Distinguish between payment and saving error
        if (error.message.includes("PayPal")) {
            return { success: false, error: `Payment capture failed: ${error.message}` };
        } else {
            return { success: false, error: `We failed to save your order. Please contact support. Error: ${error.message}` };
        }
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
        printfulCosts: printfulOrder.costs,
        printfulShippingMethod: `${printfulOrder.shipping} (${printfulOrder.shipping_service_name})`,
        status: 'draft', // Update status to reflect Printful's state
      });

      return { success: true, orderId: newOrderRef.id };
    } else {
      // If Printful API returns an error
      const errorMessage = typeof printfulResult.result === 'string' ? printfulResult.result : JSON.stringify(printfulResult.result);
      throw new Error(errorMessage || 'Failed to create Printful order');
    }

  } catch (e: any) {
    console.error("Failed to create Printful draft order:", e);
    return { success: false, error: e.message };
  }
}
