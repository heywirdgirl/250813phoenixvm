
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import type { Product } from "@/lib/types";
import { isFirebaseConfigValid } from "@/firebase/clientApp";

export const revalidate = 86400; // 24 hours in seconds

export default async function ProductsPage() {
  let products: Product[] = [];
  let error: string | null = null;
  let configError: string | null = null;

  if (!isFirebaseConfigValid()) {
      configError = `Cấu hình Firebase chưa hoàn tất. Vui lòng kiểm tra lại các biến môi trường NEXT_PUBLIC_... trong tệp .env của bạn và khởi động lại máy chủ phát triển.`;
  }

  if (!configError) {
    try {
      products = await getProducts();
    } catch (e: any) {
      console.error(e);
      error = `Không thể tải sản phẩm. Đây có thể là sự cố kết nối hoặc sự cố với Quy tắc bảo mật Firestore của bạn. Vui lòng đảm bảo bạn đã triển khai tệp firestore.rules. Chi tiết: ${e.message}`;
    }
  }


  if (configError) {
     return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Lỗi cấu hình</AlertTitle>
          <AlertDescription>
            <p>Có một sự cố với cấu hình Firebase.</p>
            <p className="mt-2 font-mono bg-red-900/20 p-2 rounded-md text-xs">{configError}</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Không thể tải sản phẩm</AlertTitle>
          <AlertDescription>
            <p>Chúng tôi không thể tìm nạp sản phẩm từ nguồn dữ liệu của mình. Vui lòng kiểm tra chi tiết lỗi bên dưới.</p>
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
          <AlertTitle>Không tìm thấy sản phẩm</AlertTitle>
          <AlertDescription>
            Kết nối với Firestore đã thành công, nhưng collection 'products' trống hoặc không tồn tại. Vui lòng thêm sản phẩm vào cơ sở dữ liệu Firestore của bạn.
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
