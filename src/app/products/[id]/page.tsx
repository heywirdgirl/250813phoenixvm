import { getStoreProducts } from "@/lib/printful";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ProductDetailsClient from "@/components/ProductDetailsClient";
import type { Product } from "@/lib/types";

interface ProductPageProps {
  params: {
    id: string;
  };
}

async function getProduct(id: string): Promise<Product | undefined> {
  const products = await getStoreProducts();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return undefined;
  }
  
  // In a real app, you would fetch detailed product info here, including variants and price.
  // For now, we'll use the basic info and add some mock variants/price.
  return {
      ...product,
      description: `High-quality and durable, the ${product.name} is a must-have for your collection. Printed on demand with the finest materials.`,
      price: 29.99, // Placeholder price
      variants: [ // Placeholder variants
        { id: 'v1', type: 'Color', name: 'Black' },
        { id: 'v2', type: 'Color', name: 'White' },
        { id: 'v4', type: 'Size', name: 'S' },
        { id: 'v5', type: 'Size', name: 'M' },
        { id: 'v6', type: 'Size', name: 'L' },
      ]
  }
}


export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
           <Carousel className="w-full">
            <CarouselContent>
              {(product.images.length > 0 ? product.images : ['https://picsum.photos/600/600']).map((image, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-square relative bg-card rounded-lg overflow-hidden border">
                    <Image
                      src={image}
                      alt={`${product.name} image ${index + 1}`}
                      fill
                      className="object-cover"
                      data-ai-hint="product image"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-headline font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold text-primary mb-6">${product.price.toFixed(2)}</p>
          <div className="prose prose-lg text-muted-foreground mb-8">
            <p>{product.description}</p>
          </div>
          <ProductDetailsClient product={product} />
        </div>
      </div>
    </div>
  );
}
