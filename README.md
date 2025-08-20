# Printful Boutique - Kiến trúc dự án

Chào mừng bạn đến với Printful Boutique! Đây là một ứng dụng thương mại điện tử Next.js được xây dựng bằng Firebase, ShadCN UI, PayPal, Printful và Genkit cho các tính năng AI.

## Cây thư mục

```
.
├── src
│   ├── ai
│   │   ├── flows
│   │   │   └── suggest-product-tags.ts  # Luồng Genkit AI để đề xuất các thẻ sản phẩm.
│   │   ├── dev.ts                       # Điểm vào cho máy chủ phát triển Genkit.
│   │   └── genkit.ts                    # Cấu hình và khởi tạo Genkit.
│   ├── app
│   │   ├── admin
│   │   │   └── suggest-tags
│   │   │       └── page.tsx             # Trang dành cho tính năng đề xuất thẻ của AI.
│   │   ├── cart
│   │   │   └── page.tsx                 # Trang giỏ hàng.
│   │   ├── checkout
│   │   │   └── page.tsx                 # Trang thanh toán với tích hợp PayPal.
│   │   ├── login
│   │   │   └── page.tsx                 # Trang đăng nhập người dùng.
│   │   ├── order
│   │   │   └── [orderId]
│   │   │       └── page.tsx             # Trang xác nhận đơn hàng sau khi thanh toán.
│   │   ├── products
│   │   │   ├── [id]
│   │   │   │   └── page.tsx             # Trang chi tiết cho một sản phẩm.
│   │   │   └── page.tsx                 # Trang hiển thị danh sách tất cả sản phẩm.
│   │   ├── signup
│   │   │   └── page.tsx                 # Trang đăng ký người dùng.
│   │   ├── actions.ts                   # Các Server Action (xử lý AI, tạo đơn hàng PayPal/Printful).
│   │   ├── globals.css                  # Các kiểu CSS toàn cục và biến theme của Tailwind.
│   │   ├── layout.tsx                   # Layout gốc của ứng dụng.
│   │   └── page.tsx                     # Trang chủ của ứng dụng.
│   ├── components
│   │   ├── layout
│   │   │   ├── Footer.tsx               # Component footer của trang web.
│   │   │   └── Header.tsx               # Component header của trang web.
│   │   ├── ui                           # Các component UI từ ShadCN.
│   │   ├── ProductCard.tsx              # Component thẻ để hiển thị một sản phẩm.
│   │   ├── ProductDetailsClient.tsx     # Component phía máy khách để xử lý tương tác (thêm vào giỏ hàng).
│   │   ├── Providers.tsx                # Gộp các nhà cung cấp ngữ cảnh (Auth, Cart, v.v.).
│   │   └── SuggestTagsForm.tsx          # Biểu mẫu để sử dụng tính năng AI đề xuất thẻ.
│   ├── context
│   │   ├── AuthContext.tsx              # Quản lý trạng thái xác thực người dùng.
│   │   └── CartContext.tsx              # Quản lý trạng thái giỏ hàng.
│   ├── firebase
│   │   └── clientApp.ts                 # Khởi tạo và cấu hình ứng dụng khách Firebase.
│   ├── hooks
│   │   ├── use-mobile.tsx               # Hook để phát hiện thiết bị di động.
│   │   └── use-toast.ts                 # Hook để hiển thị thông báo toast.
│   ├── lib
│   │   ├── paypal.ts                    # Chứa logic để tương tác với PayPal API (tạo/nhận đơn hàng).
│   │   ├── printful.ts                  # Chứa logic để tương tác với Printful API (tạo đơn hàng in).
│   │   ├── products.ts                  # Dữ liệu sản phẩm giả.
│   │   ├── types.ts                     # Các định nghĩa TypeScript cho toàn bộ ứng dụng.
│   │   └── utils.ts                     # Các hàm tiện ích.
├── .env                                 # Các biến môi trường (khóa API Firebase, PayPal, Printful).
├── next.config.ts                       # Tệp cấu hình Next.js.
├── package.json                         # Các phụ thuộc và tập lệnh của dự án.
├── tailwind.config.ts                   # Tệp cấu hình Tailwind CSS.
└── tsconfig.json                        # Tệp cấu hình TypeScript.
```

## Chức năng của tệp

- **`src/ai`**: Chứa tất cả logic liên quan đến AI sử dụng Genkit.
- **`src/app`**: Cốt lõi của ứng dụng, tuân theo App Router của Next.js.
- **`src/components`**: Các component React có thể tái sử dụng.
- **`src/context`**: Các React Context để quản lý trạng thái toàn cục (xác thực, giỏ hàng).
- **`src/firebase`**: Cấu hình để kết nối ứng dụng với Firebase.
- **`src/hooks`**: Các React Hook tùy chỉnh.
- **`src/lib`**: Thư viện hỗ trợ.
    - **`paypal.ts`**: Tích hợp với PayPal API để xử lý các giao dịch thanh toán.
    - **`printful.ts`**: Tích hợp với Printful API để tự động hóa việc thực hiện đơn hàng in ấn theo yêu cầu.
    - **`products.ts`**: Dữ liệu sản phẩm mẫu.
    - **`types.ts`**: Các định nghĩa TypeScript.
    - **`utils.ts`**: Các hàm tiện ích.
- **`.env`**: Lưu trữ các thông tin nhạy cảm như khóa API của Firebase, PayPal và Printful.
- **`next.config.ts`**: Cho phép bạn tùy chỉnh cấu hình Next.js, bao gồm cả việc tải các biến môi trường.
- **`package.json`**: Định nghĩa các tập lệnh và quản lý các phụ thuộc của Node.js.
- **`tailwind.config.ts`**: Tùy chỉnh theme mặc định của Tailwind CSS.
```