Mô tả dự án
EProject-Phase-1 là một hệ thống thương mại điện tử được xây dựng theo kiến trúc microservices. Hệ thống bao gồm 4 services chính: API Gateway, Authentication Service, Product Service và Order Service, sử dụng MongoDB làm cơ sở dữ liệu và RabbitMQ để giao tiếp giữa các services.
Cấu trúc thư mục
EProject-Phase-1/
├── api-gateway/          # API Gateway service
│   ├── index.js         # Entry point
│   └── package.json     # Dependencies
├── auth/                # Authentication service
│   ├── src/
│   │   ├── app.js       # Main app
│   │   ├── config/      # Configuration
│   │   ├── controllers/ # Route controllers
│   │   ├── middlewares/ # Auth middleware
│   │   ├── models/      # User model
│   │   ├── repositories/# Data access layer
│   │   ├── services/    # Business logic
│   │   └── test/        # Unit tests
│   └── package.json
├── product/             # Product management service
│   ├── src/
│   │   ├── app.js       # Main app
│   │   ├── controllers/ # Product controllers
│   │   ├── models/      # Product model
│   │   ├── repositories/# Product repository
│   │   ├── routes/      # API routes
│   │   ├── services/    # Product services
│   │   ├── test/        # Unit tests
│   │   └── utils/       # Message broker utils
│   └── package.json
├── order/               # Order processing service
│   ├── src/
│   │   ├── app.js       # Main app
│   │   ├── models/      # Order model
│   │   └── utils/       # Authentication utils
│   └── package.json
└── utils/               # Shared utilities
    └── isAuthenticated.js
Authentication Service (/auth)
- `POST /auth/register` - Đăng ký tài khoản
- `POST /auth/login` - Đăng nhập
- `GET /auth/dashboard` - Dashboard (cần token)

Product Service (/products)
- `GET /products/api/products` - Lấy danh sách sản phẩm
- `POST /products/api/products` - Tạo sản phẩm mới
- `PUT /products/api/products/:id` - Cập nhật sản phẩm
- `DELETE /products/api/products/:id` - Xóa sản phẩm

Order Service (/orders)
- Nhận orders từ RabbitMQ queue
- Xử lý và lưu orders vào database
Đăng ký tài khoản
![alt text](screenshots/image.png)
![alt text](screenshots/image-1.png)
Đăng nhập
![alt text](screenshots/image-2.png)

Dashboard (Protected Route)
<!-- Thêm ảnh screenshot dashboard ở đây -->
![alt text](screenshots/image-3.png)

2. Product Management

Tạo sản phẩm mới
![alt text](screenshots/image-4.png)

Danh sách sản phẩm
![alt text](screenshots/image-5.png)

Mua sản phẩm
![alt text](screenshots/image-8.png)
![alt text](screenshots/image-7.png)

### 🎯 Tính năng chính

- ✅ **Authentication**: Đăng ký, đăng nhập với JWT
- ✅ **Product Management**: CRUD operations cho sản phẩm
- ✅ **Order Processing**: Xử lý đơn hàng qua message queue
- ✅ **API Gateway**: Single entry point cho tất cả requests
- ✅ **Microservices Architecture**: Loosely coupled services
- ✅ **Database Integration**: MongoDB với Mongoose ODM
- ✅ **Message Queuing**: RabbitMQ cho async communication
- ✅ **Unit Testing**: Test coverage cho core functionalities
