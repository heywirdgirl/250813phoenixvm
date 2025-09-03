
"use server";

import { suggestProductTags, type SuggestProductTagsOutput } from '@/ai/flows/suggest-product-tags';
import { createPayPalOrder, capturePayPalOrder } from '@/lib/paypal';
import type { CartItem, User, Order } from '@/lib/types';
import { db } from '@/firebase/clientApp';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';


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
        const response = await createPayPalOrder(cartItems);
        // Successful response should have an 'id'
        if (response.id) {
            return { id: response.id };
        }
        // If not, there's an error in the response structure
        return { error: response.error || "Failed to create PayPal order." };
    } catch (error: any) {
        console.error("Server Action: Failed to create PayPal order:", error);
        // The error object might have a more specific message
        return { error: error.message || "Could not create PayPal order. Please try again." };
    }
}

export async function captureOrderAction(orderID: string, cartItems: CartItem[], user: User) {
    try {
        const captureData = await capturePayPalOrder(orderID);
        
        // Check if payment was successful
        if (captureData && captureData.status === 'COMPLETED') {
            const shippingCost = 5.00;
            const cartTotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
            const grandTotal = cartTotal + shippingCost;
            
            // This is the order data that will be saved to Firestore.
            const newOrder: Omit<Order, 'id'> = {
                userId: user.uid,
                userEmail: user.email,
                userName: user.displayName,
                items: cartItems.map(item => ({
                    ...item,
                    product: {
                        id: item.product.id,
                        name: item.product.name,
                        price: item.product.price,
                        description: '', 
                        images: [],
                        variants: []
                    }
                })),
                totalAmount: grandTotal,
                paypalOrderId: orderID,
                paypalTransactionId: captureData.purchase_units[0]?.payments?.captures[0]?.id || 'N/A',
                status: 'Pending', // Initial status, to be processed by a backend service
                createdAt: serverTimestamp(),
            };

            // Save the order to Firestore
            const ordersCollectionRef = collection(db, 'orders');
            const docRef = await addDoc(ordersCollectionre, newOrder);

            // Return relevant data to the client, including our new Firestore Order ID
            return {
                success: true,
                orderId: docRef.id, // Use the Firestore document ID as our official order ID
            };
        } else {
            // Handle cases where capture was not completed, e.g. PENDING
            const message = captureData?.details?.[0]?.description || 'PayPal payment not completed.';
            console.error('PayPal capture not completed:', captureData);
            return { error: message };
        }
    } catch (error: any) {
        console.error("Server Action: Failed to capture order and save to Firestore:", error);
        return { error: error.message || "Payment could not be processed. Please try again." };
    }
}
