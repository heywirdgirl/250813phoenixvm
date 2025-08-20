import type { CartItem, User } from './types';
import fetch from 'node-fetch';

const PRINTFUL_API_URL = 'https://api.printful.com';

interface PrintfulOrderItem {
    // This is a placeholder, you need to find the correct variant_id from Printful's catalog
    // for each product size/color combination you sell.
    variant_id: number; 
    quantity: number;
    files: { url: string }[];
}

interface PrintfulOrderPayload {
    recipient: {
        name: string;
        // In a real app, you would collect address from the user during checkout.
        // Using a placeholder address for now.
        address1: string;
        city: string;
        state_code: string;
        country_code: string;
        zip: string;
    };
    items: PrintfulOrderItem[];
}

// This function maps your internal product IDs to Printful's variant IDs.
// THIS IS A PLACEHOLDER. You MUST replace this with your actual product data mapping.
// You can find variant IDs via the Printful API's "Product Catalog" endpoint.
// https://www.printful.com/docs/catalog
function getPrintfulVariantId(productName: string, size: string, color: string): number {
    // Example mapping:
    if (productName.includes('T-Shirt')) {
        if (size === 'L' && color === 'Black') return 1; // Replace with actual ID
    }
     if (productName.includes('Hoodie')) {
        if (size === 'M' && color === 'Navy Blue') return 2; // Replace with actual ID
    }
    // Add more mappings for all your products...
    
    // Default/fallback variant ID. It's better to throw an error if no mapping is found.
    console.warn(`No Printful variant ID found for ${productName} - ${size} - ${color}. Using placeholder ID 1.`);
    return 1;
}


export async function createPrintfulOrder(cartItems: CartItem[], paypalOrder: any, user: User) {
    const { PRINTFUL_API_KEY } = process.env;
    if (!PRINTFUL_API_KEY) {
        throw new Error('Printful API key is not configured.');
    }

    const orderItems: PrintfulOrderItem[] = cartItems.map(item => ({
        variant_id: getPrintfulVariantId(item.product.name, item.variant.Size, item.variant.Color),
        quantity: item.quantity,
        files: [
            // Placeholder for the design file. You would typically have a specific design
            // for each product.
            { url: 'https://placehold.co/1500x1800.png' } 
        ]
    }));

    // In a real app, you would collect shipping info. Using PayPal info or a default.
    const recipientName = user.displayName || 'John Doe';

    const payload: PrintfulOrderPayload = {
        recipient: {
            name: recipientName,
            address1: '19749 Dearborn St',
            city: 'Chatsworth',
            state_code: 'CA',
            country_code: 'US',
            zip: '91311',
        },
        items: orderItems,
    };

    const response = await fetch(`${PRINTFUL_API_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        },
        body: JSON.stringify(payload),
    });

    const data: any = await response.json();

    if (response.ok) {
        return data.result;
    } else {
        console.error('Printful API Error:', data);
        throw new Error(`Failed to create Printful order: ${data.result || 'Unknown error'}`);
    }
}
