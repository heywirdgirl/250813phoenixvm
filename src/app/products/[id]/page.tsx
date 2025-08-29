
import Image from "next/image";
import { notFound } from "next/navigation";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductDetailsClient from "@/components/ProductDetailsClient";
import type { Product } from "@/lib/types";
import { getProduct } from "@/lib/products";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }
  
  const allImages = product.images;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
           <Carousel className="w-full">
            <CarouselContent>
              {allImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-square relative bg-card rounded-lg overflow-hidden border">
                    <Image
                      src={image}
                      alt={`${product.name} image ${index + 1}`}
                      fill
                      className="object-cover"
                      data-ai-hint="product photo"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {allImages.length > 1 && (
                <>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                </>
            )}
          </Carousel>
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-headline font-bold mb-2">{product.name}</h1>
          <p className="text-3xl font-semibold text-primary mb-6">${product.price.toFixed(2)}</p>
          
          <ProductDetailsClient product={product} />

          <div className="mt-8">
            <Tabs defaultValue="description">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="prose prose-lg text-muted-foreground mt-4">
                 <p>{product.description}</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
