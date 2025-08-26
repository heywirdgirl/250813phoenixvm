
import type { CartItem, User, Product as AppProduct, Variant } from './types';
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

// Fetches full details for a single product.
async function getProductDetails(productId: string, apiKey: string): Promise<any> {
    const response = await fetch(`${PRINTFUL_API_URL}/store/products/${productId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
        },
    });
    const data: any = await response.json();
    if (!response.ok) {
        const errorDetails = data.result ? JSON.stringify(data.result) : response.statusText;
        console.error(`Printful API Error fetching product details for ID ${productId}:`, errorDetails);
        throw new Error(`Printful API error for product ${productId}: ${data.error?.message || errorDetails}`);
    }
    return data.result;
}


export async function getStoreProducts(): Promise<AppProduct[]> {
    const { PRINTFUL_API_KEY } = process.env;
    if (!PRINTFUL_API_KEY) {
        throw new Error('The Printful API key is missing. Please check your environment variables.');
    }

    try {
        const listResponse = await fetch(`${PRINTFUL_API_URL}/store/products`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${PRINTFUL_API_KEY}` },
        });
        
        const listData: any = await listResponse.json();

        if (!listResponse.ok) {
            const errorDetails = listData.result ? JSON.stringify(listData.result) : listResponse.statusText;
            console.error('Printful API Error fetching products list:', errorDetails);
            throw new Error(`Printful API error: ${listData.error?.message || errorDetails}`);
        }
        
        if (!listData.result || listData.result.length === 0) {
            console.warn("Printful API returned no synced products.");
            return [];
        }

        // Fetch details for each product in parallel
        const productDetailsPromises = listData.result.map((p: any) => getProductDetails(String(p.id), PRINTFUL_API_KEY));
        const detailedProducts = await Promise.all(productDetailsPromises);
        
        // Transform Printful products to our app's Product type
        return detailedProducts.map((detailedProduct: any) => {
            const syncProduct = detailedProduct.sync_product;
            const syncVariants = detailedProduct.sync_variants;
            
            // Use the first variant's price as the default display price
            const defaultPrice = syncVariants.length > 0 ? parseFloat(syncVariants[0].retail_price) : 0;

            const variants: Variant[] = [];
            const colors = new Set<string>();
            const sizes = new Set<string>();

            syncVariants.forEach((variant: any) => {
                if (variant.color) colors.add(variant.color);
                if (variant.size) sizes.add(variant.size);
            });

            Array.from(colors).forEach((color, index) => variants.push({id: `c-${syncProduct.id}-${index}`, type: 'Color', name: color}));
            Array.from(sizes).forEach((size, index) => variants.push({id: `s-${syncProduct.id}-${index}`, type: 'Size', name: size}));


            return {
                id: String(syncProduct.id),
                name: syncProduct.name,
                description: syncVariants.length > 0 ? syncVariants[0].product.description || 'A high-quality product from our collection.' : 'A high-quality product from our collection.',
                price: defaultPrice,
                images: syncVariants.map((v: any) => v.files.find((f: any) => f.type === 'preview')?.preview_url).filter(Boolean) || [syncProduct.thumbnail_url],
                variants: variants,
            };
        });

    } catch (error) {
        console.error('Exception in getStoreProducts:', error);
        // In case of an exception (e.g., network error), throw it so the page can handle it.
        throw error;
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
