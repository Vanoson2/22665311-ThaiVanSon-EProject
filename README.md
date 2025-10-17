Mô tả dự án
EProject-Phase-1 là một hệ thống thương mại điện tử được xây dựng theo kiến trúc microservices. Hệ thống bao gồm 4 services chính: API Gateway, Authentication Service, Product Service và Order Service, sử dụng MongoDB làm cơ sở dữ liệu và RabbitMQ để giao tiếp giữa các services.
Authentication Service (/auth)
- `POST /auth/register` - Đăng ký tài khoản
- `POST /auth/login` - Đăng nhập
- `GET /auth/dashboard` - Dashboard (cần token)

Product Service (/products - Port 3001)
- `GET /products/api/products` - Lấy danh sách sản phẩm
- `POST /products/api/products` - Tạo sản phẩm mới
- `POST /products/api/buy` - Mua sản phẩm (tạo order)
- `GET /products/api/buy/:orderId` - Lấy trạng thái order

Order Service (/orders - Port 3002) - **MỚI: Service độc lập**
- `GET /orders/api/orders` - Lấy tất cả orders
- `GET /orders/api/orders/:orderId` - Lấy order theo ID
- `GET /orders/api/orders/user/:username` - Lấy orders theo user
- `GET /orders/api/orders/stats` - Thống kê orders
- Message consumer: Nhận orders từ RabbitMQ queue và lưu vào database
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
