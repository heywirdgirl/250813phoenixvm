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
  
  // New detailed fields from Printful
  sku: string;
  mainImage: string;
  thumbnail: string;
  designImage: string;
  printType: string;
  designFilename: string;
  imageDimensions: { width: number; height: number } | null;
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
