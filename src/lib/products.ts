import type { Product } from './types';

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
  },
  {
    id: '3',
    name: 'Designer All-Over Print Backpack',
    description:
      'This medium size backpack is just what you need for daily use or sports activities! The pockets (including one for your laptop) give plenty of room for all your necessities, while the water-resistant material will protect them from the weather.',
    price: 45.0,
    images: ['https://picsum.photos/seed/backpack-galaxy/600/600', 'https://picsum.photos/seed/backpack-model/600/600', 'https://picsum.photos/seed/backpack-detail/600/600'],
    variants: [
      { id: 'v15', type: 'Color', name: 'Galaxy' },
      { id: 'v16', type: 'Color', name: 'Geometric' },
      { id: 'v17', type: 'Size', name: 'One Size' },
    ],
  },
  {
    id: '4',
    name: 'Customizable Phone Case',
    description:
      'Protect your phone in style with our durable and sleek phone case. Available for various models, this case offers a perfect fit and easy access to all buttons and ports. The tough polycarbonate material protects your phone from scratches, drops, and dust.',
    price: 19.99,
    images: ['https://picsum.photos/seed/phonecase-matte/600/600', 'https://picsum.photos/seed/phonecase-model/600/600', 'https://picsum.photos/seed/phonecase-detail/600/600'],
    variants: [
      { id: 'v18', type: 'Color', name: 'Matte Black' },
      { id: 'v19', type: 'Color', name: 'Clear' },
      { id: 'v20', type: 'Size', name: 'iPhone 15' },
      { id: 'v21', type: 'Size', name: 'Pixel 8' },
      { id: 'v22', type: 'Size', name: 'Galaxy S24' },
    ],
  },
  {
    id: '5',
    name: 'Elegant Framed Poster',
    description:
      'Make a statement in any room with this framed poster, printed on thick, durable, matte paper. The matte black frame that\'s made from wood from renewable forests adds an extra touch of class.',
    price: 32.5,
    images: ['https://picsum.photos/seed/poster-art/600/600', 'https://picsum.photos/seed/poster-room/600/600', 'https://picsum.photos/seed/poster-detail/600/600'],
    variants: [
      { id: 'v23', type: 'Color', name: 'Black Frame' },
      { id: 'v24', type: 'Color', name: 'White Frame' },
      { id: 'v25', type: 'Size', name: '12x18 inches' },
      { id: 'v26', type: 'Size', name: '18x24 inches' },
      { id: 'v27', type: 'Size', name: '24x36 inches' },
    ],
  },
  {
    id: '6',
    name: 'Cozy Embroidered Beanie',
    description:
      'This beanie is a snug, form-fitting, and comfortable accessory. Not only will it keep you warm, but it will also add a stylish touch to any outfit. The 100% Turbo Acrylic fabric is hypoallergenic and built to last.',
    price: 21.99,
    images: ['https://picsum.photos/seed/beanie-green/600/600', 'https://picsum.photos/seed/beanie-model/600/600', 'https://picsum.photos/seed/beanie-detail/600/600'],
    variants: [
      { id: 'v28', type: 'Color', name: 'Forest Green' },
      { id: 'v29', type: 'Color', name: 'Mustard' },
      { id: 'v30', type: 'Color', name: 'Red' },
      { id: 'v31', type: 'Size', name: 'One Size' },
    ],
  },
];
