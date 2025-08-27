
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
    
    const productDetailsPromises = listData.result.map((p: any) => getProductDetails(String(p.id), PRINTFUL_API_KEY));
    const detailedProducts = await Promise.all(productDetailsPromises);
    
    return detailedProducts.map((p: any): AppProduct => {
        const firstVariant = p.sync_variants?.[0];
        if (!firstVariant) {
          // Fallback for products with no variants, though unlikely
          return {
            id: String(p.sync_product.id),
            name: p.sync_product.name,
            description: "Product details are not available.",
            price: 0,
            images: [p.sync_product.thumbnail_url].filter(Boolean),
            variants: [],
            sku: p.sync_product.external_id || String(p.sync_product.id),
            mainImage: p.sync_product.thumbnail_url,
            thumbnail: p.sync_product.thumbnail_url,
            designImage: '',
            printType: '',
            designFilename: '',
            imageDimensions: null,
          };
        }

        const allVariants = p.sync_variants || [];
        const sizes = new Set<string>();
        const colors = new Set<string>();

        allVariants.forEach((v: any) => {
            if (v.product?.size) sizes.add(v.product.size);
            if (v.product?.color) colors.add(v.product.color);
        });
        
        const appVariants: Variant[] = [];
        Array.from(sizes).forEach((size, i) => appVariants.push({id: `s-${p.sync_product.id}-${i}`, type: 'Size', name: size}));
        Array.from(colors).forEach((color, i) => appVariants.push({id: `c-${p.sync_product.id}-${i}`, type: 'Color', name: color}));

        const designFile = firstVariant.files?.find((f: any) => f.visible);

        return {
            id: String(p.sync_product.id),
            name: firstVariant.product.name || p.sync_product.name,
            description: firstVariant.product.description || "A high-quality product from our collection.",
            price: parseFloat(firstVariant.retail_price) || 0,
            variants: appVariants,
            images: [firstVariant.product.image, designFile?.preview_url].filter(Boolean), // For legacy compatibility
            
            // New detailed fields
            sku: firstVariant.sku || '',
            mainImage: firstVariant.product.image || '',
            thumbnail: p.sync_product.thumbnail_url || designFile?.thumbnail_url || '',
            designImage: designFile?.preview_url || '',
            printType: designFile?.type || '',
            designFilename: designFile?.filename || '',
            imageDimensions: designFile ? { width: designFile.width, height: designFile.height } : null
        };
    });
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
