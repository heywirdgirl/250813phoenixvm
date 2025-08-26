import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const featuredProducts = products.slice(0, 3);

  return (
    <>
      <section className="relative bg-card text-center py-20 md:py-32">
        <div className="absolute inset-0">
            <Image 
                src="https://picsum.photos/seed/hero/1600/800" 
                alt="Hero background" 
                fill
                priority 
                className="object-cover opacity-10"
                data-ai-hint="fashion boutique"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary mb-4">
            Elegance, Printed for You
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover unique, high-quality apparel and accessories, customized just for you.
          </p>
          <Button size="lg" asChild>
            <Link href="/products">Shop All Products</Link>
          </Button>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
