
"use server";

import { suggestProductTags, type SuggestProductTagsOutput } from '@/ai/flows/suggest-product-tags';
import { createPayPalOrder, capturePayPalOrder } from '@/lib/paypal';
import { createDraftOrder } from '@/lib/printful';
import type { CartItem, Recipient, OrderItem, Order } from '@/lib/types';
import { db } from "@/firebase/clientApp"; // This should be a server-initialized admin instance in a real-world secure app
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

interface CaptureOrderAndSaveToFirestoreParams {
    orderID: string;
    cartItems: CartItem[];
    user: {
      uid: string;
      email: string | null;
      displayName: string | null;
    };
    shippingCost: number;
}

export async function captureOrderAndSaveToFirestore(params: CaptureOrderAndSaveToFirestoreParams) {
    const { orderID, cartItems, user, shippingCost } = params;

    // 1. Capture the PayPal Order
    let captureData;
    try {
        captureData = await capturePayPalOrder(orderID);
        if (!captureData || captureData.status !== 'COMPLETED') {
            const message = (captureData as any)?.details?.[0]?.description || 'PayPal payment not completed.';
            throw new Error(message);
        }
    } catch (error: any) {
        console.error("Server Action Exception (captureOrderAction):", error);
        return { success: false, error: `Payment capture failed: ${error.message}` };
    }

    // 2. Save the order to Firestore
    try {
        const cartTotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
        const grandTotal = cartTotal + shippingCost;
        
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
                    images: item.product.images,
                    description: item.product.description,
                    variants: [],
                }
            })),
            totalAmount: grandTotal,
            paypalOrderId: orderID,
            paypalTransactionId: captureData.purchase_units[0]?.payments?.captures[0]?.id || 'N/A',
            status: 'Pending',
            createdAt: serverTimestamp(),
        };

        const ordersCollectionRef = collection(db, 'orders');
        const docRef = await addDoc(ordersCollectionRef, newOrder);
        
        return { success: true, firestoreOrderId: docRef.id };

    } catch (error: any) {
        console.error("Firestore save error:", error);
        const transactionId = captureData.purchase_units[0]?.payments?.captures[0]?.id || 'N/A';
        return { 
            success: false, 
            error: `Payment was successful, but we failed to save your order. Please contact support with transaction ID ${transactionId}. Error: ${error.message}`
        };
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
