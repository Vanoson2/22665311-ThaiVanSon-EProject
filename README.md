# EProject-Phase-1 - E-Commerce Microservices System

## 📋 Mô tả dự án

EProject-Phase-1 là một hệ thống thương mại điện tử được xây dựng theo kiến trúc **microservices**. Hệ thống bao gồm 4 services chính:
- **API Gateway** - Cổng trung tâm cho tất cả requests
- **Authentication Service** - Quản lý đăng ký, đăng nhập
- **Product Service** - Quản lý sản phẩm và mua hàng
- **Order Service** - Xử lý và lưu trữ đơn hàng

**Công nghệ sử dụng:**
- Node.js + Express
- MongoDB với Mongoose ODM
- RabbitMQ cho message queuing
- JWT cho authentication
- HTTP Proxy cho API Gateway

---

## 🏗️ Kiến trúc hệ thống

```
Client
  ↓
API Gateway (Port 3003)
  ↓
  ├─→ Auth Service (Port 3000)
  ├─→ Product Service (Port 3001) → RabbitMQ → Order Service (Port 3002)
  └─→ Order Service (Port 3002)
```

---

## 🚀 Hướng dẫn cài đặt

### 1. Yêu cầu hệ thống

- Node.js >= 14.x
- MongoDB >= 4.x
- RabbitMQ >= 3.x
- npm hoặc yarn

### 2. Clone project

```bash
git clone https://github.com/Vanoson2/22665311-ThaiVanSon-EProject.git
cd EProject-Phase-1
```

### 3. Cài đặt dependencies

Cài đặt cho từng service:

```bash
# Auth Service
cd auth
npm install

# API Gateway
cd ../api-gateway
npm install

# Product Service
cd ../product
npm install

# Order Service
cd ../order
npm install
```

### 4. Cấu hình môi trường

Tạo file `.env` trong mỗi service (nếu cần):

**auth/.env**
```env
PORT=3000
MONGODB_URI=mongodb://localhost/auth
JWT_SECRET=your-secret-key
```

**product/.env**
```env
PORT=3001
MONGODB_PRODUCT_URI=mongodb://localhost/products
RABBITMQ_URI=amqp://localhost:5672
```

**order/.env**
```env
PORT=3002
MONGODB_URI=mongodb://localhost/orders
RABBITMQ_URI=amqp://localhost:5672
```
## 📡 API Endpoints

### Base URL
- **API Gateway**: `http://localhost:3003`
- **Direct Access**: `http://localhost:{PORT}`

### Authentication Service (`/auth`)

#### 1. Đăng ký tài khoản
```http
POST /auth/register
Content-Type: application/json

{
  "username": "admin",
  "password": "123456"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "...",
    "username": "admin"
  }
}
```

#### 2. Đăng nhập
```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "123456"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin"
}
```

#### 3. Dashboard (Protected)
```http
GET /auth/dashboard
Authorization: Bearer {token}
```

---

### Product Service (`/products`)

#### 1. Lấy danh sách sản phẩm
```http
GET /products/api/products
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "_id": "...",
    "name": "Laptop",
    "price": 1000,
    "description": "Gaming laptop",
    "inventory": 10
  }
]
```

**Lưu ý:** Chỉ hiển thị sản phẩm có `inventory > 0`

#### 2. Thêm sản phẩm mới
```http
POST /products/api/products
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Laptop",
  "price": 1000,
  "description": "Gaming laptop",
  "inventory": 10
}
```

**Tính năng đặc biệt:**
- Nếu sản phẩm **cùng tên đã tồn tại** → Tăng inventory
- Nếu **chưa tồn tại** → Tạo sản phẩm mới

**Response:**
```json
{
  "_id": "...",
  "name": "Laptop",
  "price": 1000,
  "description": "Gaming laptop",
  "inventory": 15
}
```

#### 3. Mua sản phẩm (Tạo order)
```http
POST /products/api/buy
Authorization: Bearer {token}
Content-Type: application/json

[
  {
    "productId": "68f23e21e73d3253f0305856",
    "quantity": 2
  },
  {
    "productId": "68f23e3be73d3253f0305858",
    "quantity": 1
  }
]
```

**Flow xử lý:**
1. Validate inventory đủ không
2. Nếu đủ → Publish message → RabbitMQ (orders queue)
3. Order Service nhận → Lưu vào database → Gửi response
4. Product Service nhận response → Giảm inventory
5. Return order completed

**Response:**
```json
{
  "orderId": "7b09392b-8c65-493c-b732-759477987da5",
  "user": "admin",
  "orderItems": [
    {
      "productId": "68f23e21e73d3253f0305856",
      "productName": "Laptop",
      "price": 1000,
      "quantity": 2,
      "subtotal": 2000
    }
  ],
  "totalPrice": 2000,
  "_id": "68f24949849729964b1d3cd9",
  "status": "completed"
}
```
#### 4. Kiểm tra trạng thái order
```http
GET /products/api/buy/:orderId
Authorization: Bearer {token}
```

---

### Order Service (`/orders`)

#### 1. Lấy tất cả orders
```http
GET /orders/api/orders
Authorization: Bearer {token}
```

#### 2. Lấy order theo ID
```http
GET /orders/api/orders/:orderId
Authorization: Bearer {token}
```

#### 3. Lấy orders theo username
```http
GET /orders/api/orders/user/:username
Authorization: Bearer {token}
```

#### 4. Thống kê orders
```http
GET /orders/api/orders/stats
Authorization: Bearer {token}
```

**Response:**
```json
{
  "totalOrders": 10,
  "totalRevenue": 50000
}
```

---

## 🎯 Tính năng chính

### ✅ Authentication & Authorization
- Đăng ký tài khoản với username/password
- Đăng nhập và nhận JWT token
- Protected routes với Bearer token

### ✅ Product Management
- Thêm sản phẩm (tự động tăng inventory nếu trùng tên)
- Lấy danh sách sản phẩm (chỉ hiển thị còn hàng)
- Quản lý inventory tự động

### ✅ Order Processing
- Mua sản phẩm với validation inventory
- Xử lý đơn hàng bất đồng bộ qua RabbitMQ
- Tự động giảm inventory sau khi order thành công
- Tracking order status

### ✅ Microservices Architecture
- Loosely coupled services
- Message-driven communication
- Independent deployment
- Scalable design

### 1. Đăng ký
```
POST http://localhost:3003/auth/register
Body: { "username": "test", "password": "123456" }
```

### 2. Đăng nhập và lưu token
```
POST http://localhost:3003/auth/login
Body: { "username": "test", "password": "123456" }
→ Copy token từ response
```

### 3. Thêm sản phẩm
```
POST http://localhost:3003/products/api/products
Headers: Authorization: Bearer {token}
Body: { "name": "Laptop", "price": 1000, "inventory": 10 }
```

### 4. Xem sản phẩm
```
GET http://localhost:3003/products/api/products
Headers: Authorization: Bearer {token}
```

### 5. Mua sản phẩm
```
POST http://localhost:3003/products/api/buy
Headers: Authorization: Bearer {token}
Body: [{ "productId": "...", "quantity": 2 }]
```

---

## 👨‍💻 Author

- **Name:** Thai Van Son
- **Student ID:** 22665311
- **GitHub:** [Vanoson2](https://github.com/Vanoson2)

---

## 📄 License

This project is for educational purposes.

---

## 🙏 Acknowledgments

- Node.js community
- Express.js framework
- MongoDB
- RabbitMQ
- Mongoose ODM
- ✅ **Unit Testing**: Test coverage cho core functionalities
