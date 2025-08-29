
import { collection, getDocs, doc, getDoc } from "firebase/firestore"; 
import { db } from '@/firebase/clientApp';
import type { Product, Variant } from './types';

// Helper function to transform Firestore doc data into our Product type
const transformDocToProduct = (docData: any, id: string): Product | null => {
    if (!docData) return null;

    const syncProduct = docData.sync_product;
    const syncVariants = docData.sync_variants;

    // Defensive check: Ensure essential data structures exist and are of the correct type.
    if (!syncProduct || !Array.isArray(syncVariants) || syncVariants.length === 0) {
        console.warn(`Skipping product with ID ${id} due to missing or invalid sync_product or sync_variants.`);
        return null;
    }
    
    const firstVariant = syncVariants[0];

    const allColors = [...new Set(syncVariants.map(v => v.color).filter(Boolean))];
    const allSizes = [...new Set(syncVariants.map(v => v.size).filter(Boolean))];

    const variants: Variant[] = [
        ...allColors.map((color, index) => ({ id: `c-${id}-${index}`, type: 'Color' as 'Color', name: color })),
        ...allSizes.map((size, index) => ({ id: `s-${id}-${index}`, type: 'Size' as 'Size', name: size })),
    ];
    
    // Extract mockup images from variants. These are the clean product photos.
    const images = syncVariants
      .flatMap((v: any) => v.files || []) // Ensure v.files exists
      .filter((file: any) => file && file.type === 'preview' && file.preview_url)
      .map((file: any) => file.preview_url);

    // Use the main product thumbnail as a fallback if no preview images are found.
    if (images.length === 0 && syncProduct.thumbnail_url) {
      images.push(syncProduct.thumbnail_url);
    }

    // If still no images, add a placeholder.
    if (images.length === 0) {
        images.push('https://placehold.co/600x600/E91E63/FFFFFF?text=No+Image');
    }

    // Remove duplicate images
    const uniqueImages = [...new Set(images)];

    return {
        id: id,
        name: syncProduct.name || 'Untitled Product',
        description: syncProduct.description || 'No description available.',
        price: parseFloat(firstVariant.retail_price) || 0,
        images: uniqueImages,
        variants: variants,
    };
};

// Function to fetch all products from Firestore
export async function getProducts(): Promise<Product[]> {
    try {
        const productsCol = collection(db, 'products');
        const productSnapshot = await getDocs(productsCol);
        const productList = productSnapshot.docs
            .map(doc => transformDocToProduct(doc.data(), doc.id))
            .filter((p): p is Product => p !== null); // Filter out any nulls from failed transformations
        return productList;
    } catch (error) {
        console.error("Error fetching products from Firestore: ", error);
        throw error;
    }
}

// Function to fetch a single product by its ID from Firestore
export async function getProduct(id: string): Promise<Product | undefined> {
    try {
        const productRef = doc(db, 'products', id);
        const productSnap = await getDoc(productRef);

        if (!productSnap.exists()) {
            console.warn(`Product with ID ${id} not found in Firestore.`);
            return undefined;
        }

        const product = transformDocToProduct(productSnap.data(), productSnap.id);
        return product ?? undefined;

    } catch (error) {
        console.error(`Error fetching product with ID ${id} from Firestore: `, error);
        // Instead of throwing, we return undefined to allow the page to render a 404.
        return undefined;
    }
}
