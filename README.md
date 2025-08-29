# Printful Boutique - Kiến trúc và Hướng dẫn Dự án

Chào mừng bạn đến với Printful Boutique! Đây là một ứng dụng thương mại điện tử được xây dựng bằng Next.js, thể hiện kiến trúc hiện đại với App Router. Dự án tích hợp Firebase để xác thực người dùng và làm cơ sở dữ liệu, ShadCN UI và Tailwind CSS cho giao diện người dùng, và Genkit để triển khai các tính năng AI.

## Cây thư mục

Dưới đây là cấu trúc thư mục cốt lõi của dự án:

```
.
├── src
│   ├── ai
│   │   ├── flows
│   │   │   └── suggest-product-tags.ts  # Luồng Genkit AI để đề xuất thẻ sản phẩm.
│   │   └── genkit.ts                    # Cấu hình và khởi tạo Genkit.
│   ├── app
│   │   ├── (main)
│   │   │   ├── products
│   │   │   │   ├── [id]/page.tsx        # Trang chi tiết sản phẩm (động).
│   │   │   │   └── page.tsx             # Trang danh sách tất cả sản phẩm.
│   │   │   ├── cart/page.tsx            # Trang giỏ hàng.
│   │   │   ├── checkout/page.tsx        # Trang thanh toán.
│   │   │   └── order/[orderId]/page.tsx # Trang xác nhận đơn hàng.
│   │   ├── (auth)
│   │   │   ├── login/page.tsx           # Trang đăng nhập.
│   │   │   └── signup/page.tsx          # Trang đăng ký.
│   │   ├── (admin)
│   │   │   └── admin/suggest-tags/page.tsx # Trang quản trị cho tính năng AI.
│   │   ├── actions.ts                   # Server Actions cho các tác vụ backend.
│   │   ├── globals.css                  # CSS toàn cục và biến theme Tailwind.
│   │   ├── layout.tsx                   # Layout gốc của ứng dụng.
│   │   └── page.tsx                     # Trang chủ.
│   ├── components
│   │   ├── layout                       # Components layout (Header, Footer).
│   │   ├── ui                           # Components UI từ ShadCN (Button, Card, v.v.).
│   │   ├── ProductCard.tsx              # Component hiển thị sản phẩm trong danh sách.
│   │   └── ProductDetailsClient.tsx     # Component xử lý tương tác trên trang chi tiết sản phẩm.
│   ├── context
│   │   ├── AuthContext.tsx              # Quản lý trạng thái xác thực người dùng.
│   │   └── CartContext.tsx              # Quản lý trạng thái giỏ hàng.
│   ├── firebase
│   │   └── clientApp.ts                 # Khởi tạo và cấu hình Firebase client.
│   ├── hooks
│   │   ├── use-mobile.tsx               # Hook tùy chỉnh để phát hiện thiết bị di động.
│   │   └── use-toast.ts                 # Hook tùy chỉnh để hiển thị thông báo.
│   ├── lib
│   │   ├── paypal.ts                    # Logic tích hợp với PayPal API.
│   │   ├── products.ts                  # Logic lấy và xử lý dữ liệu sản phẩm từ Firestore.
│   │   ├── types.ts                     # Các định nghĩa TypeScript dùng chung.
│   │   └── utils.ts                     # Các hàm tiện ích.
├── .env                                 # Các biến môi trường.
├── next.config.ts                       # Tệp cấu hình Next.js.
├── package.json                         # Các phụ thuộc và script của dự án.
└── tsconfig.json                        # Tệp cấu hình TypeScript.
```

## Cách thức hoạt động của các tệp

### `src/app` - App Router
Đây là trung tâm của ứng dụng, sử dụng kiến trúc App Router của Next.js.

-   **`layout.tsx`**: Layout gốc, bao bọc tất cả các trang. Nó chứa `<html>`, `<body>`, và các Providers toàn cục.
-   **`page.tsx`**: Trang chủ của ứng dụng. Đây là một Server Component, lấy dữ liệu sản phẩm nổi bật trực tiếp trên máy chủ.
-   **`globals.css`**: Chứa các kiểu CSS nền tảng của Tailwind và các biến CSS cho theme màu sắc (sáng/tối) của ShadCN.
-   **`products/[id]/page.tsx`**: Trang chi tiết sản phẩm. Đây là một trang động (`[id]`) sử dụng Server Components để lấy dữ liệu cho một sản phẩm cụ thể từ Firestore. Nó sử dụng `generateStaticParams` để tạo các trang tĩnh tại thời điểm build, giúp tăng tốc độ tải trang.
-   **`cart/page.tsx`**: Trang giỏ hàng, một Client Component (`"use client"`) vì nó cần tương tác với trạng thái giỏ hàng được lưu trữ ở phía client (thông qua `CartContext`).
-   **`checkout/page.tsx`**: Trang thanh toán, tích hợp với PayPal SDK. Đây là một Client Component để xử lý các tương tác của người dùng và trạng thái thanh toán.
-   **`login/page.tsx` & `signup/page.tsx`**: Các trang xác thực người dùng, sử dụng Firebase Authentication. Chúng là các Client Component để xử lý trạng thái biểu mẫu và tương tác với Firebase.
-   **`actions.ts`**: Chứa các Server Actions. Đây là các hàm có thể được gọi từ Client Components nhưng thực thi an toàn trên máy chủ. Chúng được dùng để gọi các luồng AI của Genkit và tương tác với API PayPal, loại bỏ nhu cầu phải tạo các API endpoint riêng.

### `src/components` - React Components
Các thành phần giao diện có thể tái sử dụng.

-   **`layout/`**: Chứa các thành phần cấu trúc chính như `Header.tsx` và `Footer.tsx`.
-   **`ui/`**: Chứa các components được xây dựng sẵn từ thư viện ShadCN UI, giúp xây dựng giao diện nhanh chóng và nhất quán.
-   **`ProductCard.tsx`**: Một Server Component hiển thị thông tin tóm tắt của một sản phẩm.
-   **`ProductDetailsClient.tsx`**: Một Client Component (`"use client"`) được sử dụng bên trong trang chi tiết sản phẩm. Nó xử lý các tương tác phía client như chọn biến thể (màu sắc, kích thước) và thêm sản phẩm vào giỏ hàng.

### `src/context` - State Management
Quản lý trạng thái toàn cục của ứng dụng bằng React Context.

-   **`AuthContext.tsx`**: Theo dõi và cung cấp thông tin người dùng đang đăng nhập trên toàn bộ ứng dụng.
-   **`CartContext.tsx`**: Quản lý các sản phẩm trong giỏ hàng, bao gồm thêm, xóa, cập nhật số lượng. Trạng thái giỏ hàng được đồng bộ với `localStorage` để giữ lại dữ liệu giữa các phiên truy cập.

### `src/lib` - Logic nghiệp vụ và Tiện ích
Nơi chứa logic cốt lõi và các hàm hỗ trợ.

-   **`products.ts`**: Chịu trách nhiệm giao tiếp với Firestore. Nó chứa các hàm `getProducts` và `getProduct` để lấy dữ liệu và chuyển đổi chúng thành định dạng `Product` mà ứng dụng có thể sử dụng. Logic xử lý cấu trúc dữ liệu phức tạp từ Printful nằm ở đây.
-   **`paypal.ts`**: Chứa các hàm để tương tác với PayPal API, bao gồm tạo và xác nhận đơn hàng.
-   **`types.ts`**: Định nghĩa các kiểu dữ liệu TypeScript (interfaces) như `Product`, `CartItem`, `User`, giúp đảm bảo sự nhất quán dữ liệu trong toàn bộ dự án.

### `src/ai` - Generative AI
Tích hợp các tính năng AI sử dụng Genkit.

-   **`genkit.ts`**: Khởi tạo và cấu hình Genkit, chỉ định các plugin (ví dụ: `googleAI`) và mô hình sẽ sử dụng.
-   **`flows/suggest-product-tags.ts`**: Một ví dụ về "luồng" (flow) AI. Nó định nghĩa một prompt và một hàm `suggestProductTags` để nhận mô tả sản phẩm và trả về các thẻ SEO được đề xuất. Hàm này được gọi từ một Server Action trong `src/app/actions.ts`.