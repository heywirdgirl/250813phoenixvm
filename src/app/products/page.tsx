import ProductCard from "@/components/ProductCard";
import { getStoreProducts } from "@/lib/printful";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default async function ProductsPage() {
  const products = await getStoreProducts();

  if (!products || products.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Could Not Load Products</AlertTitle>
          <AlertDescription>
            We couldn't fetch products from our supplier. This might be due to a configuration issue (e.g., missing API key) or a temporary problem. Please check back later.
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
