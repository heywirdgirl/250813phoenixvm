import type { Product } from './types';

// This file is now a fallback and is not actively used to display products
// if the Printful API call is successful.
export const products: Product[] = [
  {
    id: '1',
    name: 'Classic Unisex T-Shirt',
    description:
      'A timeless classic. This unisex t-shirt is perfect for any occasion. Made from 100% premium cotton, it offers both comfort and style. The fabric is pre-shrunk to maintain its shape after washing, and the double-needle stitching on the neckline and sleeves add more durability to what is sure to be a favorite!',
    price: 24.99,
    images: ['https://picsum.photos/seed/tshirt-black/600/600', 'https://picsum.photos/seed/tshirt-model/600/600', 'https://picsum.photos/seed/tshirt-detail/600/600'],
    variants: [
      { id: 'v1', type: 'Color', name: 'Black' },
      { id: 'v2', type: 'Color', name: 'White' },
      { id: 'v3', type: 'Color', name: 'Heather Grey' },
      { id: 'v4', type: 'Size', name: 'S' },
      { id: 'v5', type: 'Size', name: 'M' },
      { id: 'v6', type: 'Size', name: 'L' },
      { id: 'v7', type: 'Size', name: 'XL' },
    ],
  },
  {
    id: '2',
    name: 'Premium Embroidered Hoodie',
    description:
      'Stay cozy and stylish with our premium hoodie. It features a high-quality embroidered logo, a soft fleece interior, and a comfortable fit. Perfect for chilly evenings and casual outings.',
    price: 59.99,
    images: ['https://picsum.photos/seed/hoodie-navy/600/600', 'https://picsum.photos/seed/hoodie-model/600/600', 'https://picsum.photos/seed/hoodie-detail/600/600'],
    variants: [
      { id: 'v8', type: 'Color', name: 'Navy Blue' },
      { id: 'v9', type: 'Color', name: 'Maroon' },
      { id: 'v10', type: 'Color', name: 'Charcoal' },
      { id: 'v11', type: 'Size', name: 'S' },
      { id: 'v12', type: 'Size', name: 'M' },
      { id: 'v13', type: 'Size', name: 'L' },
      { id: 'v14', type: 'Size', name: 'XL' },
    ],
  }
];
