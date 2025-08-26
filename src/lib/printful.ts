import type { CartItem, User, Product as AppProduct } from './types';
import fetch from 'node-fetch';

const PRINTFUL_API_URL = 'https://api.printful.com';

interface PrintfulOrderItem {
    variant_id: number; 
    quantity: number;
    files: { url: string }[];
}

interface PrintfulOrderPayload {
    recipient: {
        name: string;
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
function getPrintfulVariantId(productName: string, size: string, color: string): number {
    console.warn(`No Printful variant ID found for ${productName} - ${size} - ${color}. Using placeholder ID 1.`);
    return 1;
}

export async function getStoreProducts(): Promise<AppProduct[]> {
    const { PRINTFUL_API_KEY } = process.env;
    if (!PRINTFUL_API_KEY) {
        throw new Error('Printful API key is not configured.');
    }

    try {
        const response = await fetch(`${PRINTFUL_API_URL}/store/products`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
            },
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Printful API Error fetching products:', errorData);
            throw new Error(`Failed to fetch Printful products: ${errorData.result || response.statusText}`);
        }

        const data: any = await response.json();
        
        // Transform Printful products to our app's Product type
        return data.result.map((product: any) => ({
            id: String(product.id),
            name: product.name,
            description: 'A high-quality product from our collection.', // Placeholder description
            price: 0, // Placeholder price, will be fetched later
            images: [product.thumbnail_url],
            variants: [], // Placeholder variants, will be fetched later
        }));

    } catch (error) {
        console.error('Error in getStoreProducts:', error);
        return [];
    }
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
            { url: 'https://picsum.photos/seed/design/1500/1800' } 
        ]
    }));

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
