# Printful Boutique - Kiến trúc dự án

# 250814 0925


Chào mừng bạn đến với Printful Boutique! Đây là một ứng dụng thương mại điện tử Next.js được xây dựng bằng Firebase, ShadCN UI và Genkit cho các tính năng AI.

## Cây thư mục

```
.
├── src
│   ├── ai
│   │   ├── flows
│   │   │   └── suggest-product-tags.ts  # Luồng Genkit AI để đề xuất các thẻ sản phẩm dựa trên mô tả.
│   │   ├── dev.ts                       # Điểm vào cho máy chủ phát triển Genkit.
│   │   └── genkit.ts                    # Cấu hình và khởi tạo Genkit.
│   ├── app
│   │   ├── admin
│   │   │   └── suggest-tags
│   │   │       └── page.tsx             # Trang dành cho tính năng đề xuất thẻ của AI.
│   │   ├── cart
│   │   │   └── page.tsx                 # Trang giỏ hàng.
│   │   ├── checkout
│   │   │   └── page.tsx                 # Trang thanh toán.
│   │   ├── login
│   │   │   └── page.tsx                 # Trang đăng nhập người dùng.
│   │   ├── order
│   │   │   └── [orderId]
│   │   │       └── page.tsx             # Trang xác nhận đơn hàng.
│   │   ├── products
│   │   │   ├── [id]
│   │   │   │   └── page.tsx             # Trang chi tiết cho một sản phẩm.
│   │   │   └── page.tsx                 # Trang hiển thị danh sách tất cả sản phẩm.
│   │   ├── signup
│   │   │   └── page.tsx                 # Trang đăng ký người dùng.
│   │   ├── actions.ts                   # Các Server Action của Next.js (ví dụ: xử lý gửi biểu mẫu).
│   │   ├── globals.css                  # Các kiểu CSS toàn cục và biến theme của Tailwind.
│   │   ├── layout.tsx                   # Layout gốc của ứng dụng.
│   │   └── page.tsx                     # Trang chủ của ứng dụng.
│   ├── components
│   │   ├── layout
│   │   │   ├── Footer.tsx               # Component footer của trang web.
│   │   │   └── Header.tsx               # Component header của trang web.
│   │   ├── ui                           # Các component UI từ ShadCN (nút, thẻ, v.v.).
│   │   ├── ProductCard.tsx              # Component thẻ để hiển thị một sản phẩm trong danh sách.
│   │   ├── ProductDetailsClient.tsx     # Component phía máy khách để xử lý các tương tác chi tiết sản phẩm (ví dụ: thêm vào giỏ hàng).
│   │   ├── Providers.tsx                # Gộp các nhà cung cấp ngữ cảnh (Auth, Cart, v.v.).
│   │   └── SuggestTagsForm.tsx          # Biểu mẫu để nhập mô tả sản phẩm cho AI.
│   ├── context
│   │   ├── AuthContext.tsx              # Quản lý trạng thái xác thực người dùng.
│   │   └── CartContext.tsx              # Quản lý trạng thái giỏ hàng.
│   ├── firebase
│   │   └── clientApp.ts                 # Khởi tạo và cấu hình ứng dụng khách Firebase.
│   ├── hooks
│   │   ├── use-mobile.tsx               # Hook để phát hiện thiết bị di động.
│   │   └── use-toast.ts                 # Hook để hiển thị thông báo toast.
│   ├── lib
│   │   ├── products.ts                  # Dữ liệu sản phẩm giả.
│   │   ├── types.ts                     # Các định nghĩa TypeScript cho toàn bộ ứng dụng.
│   │   └── utils.ts                     # Các hàm tiện ích (ví dụ: `cn` để hợp nhất các lớp Tailwind).
├── .env                                 # Các biến môi trường (bao gồm các khóa API Firebase).
├── next.config.ts                       # Tệp cấu hình Next.js.
├── package.json                         # Các phụ thuộc và tập lệnh của dự án.
├── tailwind.config.ts                   # Tệp cấu hình Tailwind CSS.
└── tsconfig.json                        # Tệp cấu hình TypeScript.
```

## Chức năng của tệp

- **`src/ai`**: Chứa tất cả logic liên quan đến AI sử dụng Genkit.
- **`src/app`**: Cốt lõi của ứng dụng, tuân theo App Router của Next.js. Mỗi thư mục con tương ứng với một phân đoạn URL.
- **`src/components`**: Các component React có thể tái sử dụng được sử dụng trong toàn bộ ứng dụng.
- **`src/context`**: Các nhà cung cấp React Context để quản lý trạng thái toàn cục như xác thực người dùng và giỏ hàng.
- **`src/firebase`**: Cấu hình để kết nối ứng dụng của bạn với Firebase.
- **`src/hooks`**: Các React Hook tùy chỉnh để chứa logic có thể tái sử dụng.
- **`src/lib`**: Thư viện hỗ trợ, bao gồm các định nghĩa loại TypeScript, dữ liệu sản phẩm và các hàm tiện ích.
- **`.env`**: Lưu trữ các thông tin nhạy cảm như khóa API Firebase.
- **`next.config.ts`**: Cho phép bạn tùy chỉnh cấu hình Next.js.
- **`package.json`**: Định nghĩa các tập lệnh (`dev`, `build`, `start`) và quản lý các phụ thuộc của Node.js.
- **`tailwind.config.ts`**: Tùy chỉnh theme mặc định của Tailwind CSS.
