
import type { FieldValue } from "firebase/firestore";

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

export interface Order {
  id: string; // Firestore document ID
  userId: string;
  userEmail: string | null;
  userName: string | null;
  items: CartItem[];
  totalAmount: number;
  paypalOrderId: string;
  paypalTransactionId: string;
  createdAt: FieldValue; // Use FieldValue for serverTimestamp
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}
