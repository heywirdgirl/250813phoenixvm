
import type { FieldValue, Timestamp } from "firebase/firestore";

export interface Variant {
  id: string;
  type: 'Color' | 'Size';
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  variants: Variant[];
}

export interface CartItem {
  id: string;
  product: Product;
  variant: {
    Color: string;
    Size: string;
  };
  quantity: number;
}

// Interface for Printful cost details
export interface PrintfulCosts {
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  currency: string;
}

export interface Order {
  id: string; // Firestore document ID
  userId: string;
  userEmail: string | null;
  userName: string | null;
  items: CartItem[];
  totalAmount: number;
  paypalOrderId: string;
  paypalTransactionId: string;
  createdAt: FieldValue;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'; // User-facing status
  recipient: Recipient;
  // Printful-specific fields
  printfulOrderId?: number;
  printfulOrderStatus?: string; // e.g., 'draft', 'pending'
  printfulCosts?: PrintfulCosts;
  printfulShippingMethod?: string;
}


export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

// Types for Printful Server Action
export interface Recipient {
  name: string;
  address1: string;
  city: string;
  state_code: string;
  country_code: string;
  zip: string;
}

export interface OrderItem {
  sync_variant_id: number;
  quantity: number;
}
