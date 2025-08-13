import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export default function ProductsPage() {
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
