
import { collection, getDocs, doc, getDoc } from "firebase/firestore"; 
import { db } from '@/firebase/clientApp';
import type { Product } from './types';

// Function to fetch all products from Firestore
export async function getProducts(): Promise<Product[]> {
    try {
        const productsCol = collection(db, 'products');
        const productSnapshot = await getDocs(productsCol);
        const productList = productSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name || '',
                description: data.description || '',
                price: data.price || 0,
                images: data.images || [],
                variants: data.variants || [],
            } as Product;
        });
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

        const data = productSnap.data();
        return {
            id: productSnap.id,
            name: data.name || '',
            description: data.description || '',
            price: data.price || 0,
            images: data.images || [],
            variants: data.variants || [],
        } as Product;

    } catch (error) {
        console.error(`Error fetching product with ID ${id} from Firestore: `, error);
        throw error;
    }
}
