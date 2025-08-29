
import { collection, getDocs, doc, getDoc } from "firebase/firestore"; 
import { db } from '@/firebase/clientApp';
import type { Product, Variant } from './types';

// Helper function to transform Firestore doc data into our Product type
const transformDocToProduct = (docData: any, id: string): Product | null => {
    if (!docData) return null;

    const syncProduct = docData.sync_product;
    const syncVariants = docData.sync_variants;

    if (!syncProduct || !Array.isArray(syncVariants) || syncVariants.length === 0) {
        console.warn(`Skipping product with ID ${id} due to missing sync_product or sync_variants.`);
        return null;
    }
    
    const firstVariant = syncVariants[0];

    const allColors = [...new Set(syncVariants.map(v => v.color).filter(Boolean))];
    const allSizes = [...new Set(syncVariants.map(v => v.size).filter(Boolean))];

    const variants: Variant[] = [
        ...allColors.map((color, index) => ({ id: `c-${id}-${index}`, type: 'Color' as 'Color', name: color })),
        ...allSizes.map((size, index) => ({ id: `s-${id}-${index}`, type: 'Size' as 'Size', name: size })),
    ];
    
    // Extract multiple images: one from the base product and preview URLs from variants
    const images: string[] = [];
    if (firstVariant.product?.image) {
        images.push(firstVariant.product.image);
    }
    syncVariants.forEach(v => {
        if (v.files && v.files[0]?.preview_url) {
            images.push(v.files[0].preview_url);
        }
    });
     // Use thumbnail_url as a fallback if no other images are found
    if (images.length === 0 && syncProduct.thumbnail_url) {
        images.push(syncProduct.thumbnail_url);
    }

    return {
        id: id,
        name: syncProduct.name || 'Untitled Product',
        description: firstVariant.product?.description || 'No description available.',
        price: parseFloat(firstVariant.retail_price) || 0,
        images: images,
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
        throw error;
    }
}
