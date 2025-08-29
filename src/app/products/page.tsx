
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import type { Product } from "@/lib/types";

export default async function ProductsPage() {
  let products: Product[] = [];
  let error: string | null = null;

  try {
    products = await getProducts();
  } catch (e: any) {
    console.error(e);
    error = `Failed to load products. This could be a connection issue or a problem with your Firestore Security Rules. Please make sure you have deployed the firestore.rules file. Details: ${e.message}`;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Could Not Load Products</AlertTitle>
          <AlertDescription>
            <p>We couldn't fetch products from our data source. Please check the error details below.</p>
            <p className="mt-2 font-mono bg-red-900/20 p-2 rounded-md text-xs">{error}</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (products.length === 0) {
     return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>No Products Found</AlertTitle>
          <AlertDescription>
            The connection to Firestore was successful, but the 'products' collection is empty or does not exist. Please add products to your Firestore database.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
            Our Collection
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Browse our curated selection of high-quality, print-on-demand products.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
