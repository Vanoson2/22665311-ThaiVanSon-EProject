const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");
const OrderService = require("./services/orderService");
const orderRoutes = require("./routes/orderRoutes");
const messageBroker = require("./utils/messageBroker");

class App {
  constructor() {
    this.app = express();
    this.orderService = new OrderService();
    this.connectDB();
    this.setMiddlewares();
    this.setRoutes();
    this.setupOrderConsumer();
  }

  setMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  setRoutes() {
    this.app.use("/api/orders", orderRoutes);
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

  async setupOrderConsumer() {
    try {
      // Connect to RabbitMQ
      await messageBroker.connect();
      
      // Set up consumer for orders queue using new interface
      await messageBroker.consumeOrderMessages(async (messageData) => {
        console.log("Processing order from queue:", messageData);
        
        const { orderItems, username, orderId, totalPrice } = messageData;

        // Use OrderService to create order
        const newOrder = await this.orderService.createOrder(orderItems, username, totalPrice);
        console.log("Order saved to database:", newOrder._id);

        // Send response back to PRODUCTS service
        const responseMessage = { 
          orderId, 
          user: newOrder.user, 
          orderItems: newOrder.orderItems, 
          totalPrice: newOrder.totalPrice,
          _id: newOrder._id
        };
        
        console.log("Sending response to products queue:", responseMessage);
        await messageBroker.publishMessage(config.queueNameProduct, responseMessage);
        console.log("Response sent successfully");
      });
    } catch (error) {
      console.error("Failed to setup order consumer:", error.message);
    }
  }



  start() {
    this.server = this.app.listen(config.port, () =>
      console.log(`Server started on port ${config.port}`)
    );
  }

  async stop() {
    await mongoose.disconnect();
    this.server.close();
    console.log("Server stopped");
  }
}

module.exports = App;
