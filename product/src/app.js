const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");
const MessageBroker = require("./utils/messageBroker");
const ProductsService = require("./services/productsService");
const productsRouter = require("./routes/productRoutes");
const buyRoutes = require("./routes/buyRoutes");
require("dotenv").config();

class App {
  constructor() {
    this.app = express();
    this.ordersMap = new Map(); // Track pending orders - moved from BuyController
    this.productsService = new ProductsService();
    this.connectDB();
    this.setMiddlewares();
    this.setRoutes();
    this.setupMessageBroker();
  }

  async connectDB() {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  }

  async disconnectDB() {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }

  setMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  setRoutes() {
    // Pass ordersMap to buyRoutes so BuyController can access it
    this.app.use("/api/products", productsRouter);
    this.app.use("/api/buy", buyRoutes(this.ordersMap));
  }

  async setupMessageBroker() {
    try {
      await MessageBroker.connect();
      
      // Setup consumer for products queue
      await MessageBroker.consumeProductMessages(async (data) => {
        const orderData = JSON.parse(JSON.stringify(data));
        const { orderId, orderItems } = orderData;
        console.log("Looking for order:", orderId);
        const order = this.ordersMap.get(orderId);
        if (order) {
          // Decrease inventory for each product
          console.log("Decreasing inventory for order items...");
          for (const item of orderItems) {
            await this.productsService.decreaseInventory(item.productId, item.quantity);
            console.log(`Decreased inventory for ${item.productName}: -${item.quantity}`);
          }
          
          // Update the order in the map
          this.ordersMap.set(orderId, { ...order, ...orderData, status: 'completed' });
          console.log("Order completed:", orderId);
        } else {
          console.log("Order not found in map:", orderId);
        }
      });
    } catch (error) {
      console.error("Failed to setup message broker:", error);
    }
  }

  start() {
    this.server = this.app.listen(3001, () =>
      console.log("Server started on port 3001")
    );
  }

  async stop() {
    await mongoose.disconnect();
    this.server.close();
    console.log("Server stopped");
  }
}

module.exports = App;
