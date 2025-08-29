
"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ProductDetailsClientProps {
  product: Product;
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const colors = product.variants.filter(v => v.type === 'Color');
  const sizes = product.variants.filter(v => v.type === 'Size');
  
  const [selectedColor, setSelectedColor] = useState<string>(colors[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0]?.name || '');

  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if ((colors.length > 0 && !selectedColor) || (sizes.length > 0 && !selectedSize)) {
      toast({
        title: "Selection missing",
        description: "Please select a size and color.",
        variant: "destructive",
      });
      return;
    }
    addToCart(product, { Color: selectedColor, Size: selectedSize });
  };

  return (
    <div className="flex flex-col gap-6">
       <div className="space-y-4">
          {colors.length > 0 && (
            <div className="grid gap-2">
                <Label htmlFor="color-select">Color</Label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger id="color-select" className="w-full md:w-[200px]">
                        <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                    <SelectContent>
                        {colors.map(color => (
                            <SelectItem key={color.id} value={color.name}>{color.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
          )}

          {sizes.length > 0 && (
            <div className="grid gap-2">
                <Label htmlFor="size-select">Size</Label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger id="size-select" className="w-full md:w-[200px]">
                        <SelectValue placeholder="Select a size" />
                    </SelectTrigger>
                    <SelectContent>
                        {sizes.map(size => (
                            <SelectItem key={size.id} value={size.name}>{size.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
          )}
       </div>

      <Button onClick={handleAddToCart} size="lg" className="w-full md:w-auto">
        Add to Cart
      </Button>
    </div>
  );
}
