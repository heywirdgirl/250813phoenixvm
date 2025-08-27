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
  id: string;
  items: CartItem[];
  total: number;
  createdAt: Date;
  status: 'Pending' | 'Shipped' | 'Delivered';
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}
