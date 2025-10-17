const ProductsService = require("../services/productsService");
const messageBroker = require("../utils/messageBroker");
const config = require("../config");
const uuid = require('uuid');

/**
 * Controller for handling product buy/order requests
 * Validates items and publishes to message queue
 */
class BuyController {
  constructor(ordersMap) {
    this.productsService = new ProductsService();
    this.ordersMap = ordersMap; // Receive ordersMap from App
    this.createOrder = this.createOrder.bind(this);
    this.getOrderStatus = this.getOrderStatus.bind(this);
  }

  /**
   * Create a new order (buy products)
   * POST /api/buy
   * Body: { items: [{ productId, quantity }] }
   * Headers: Authorization token required
   */
  async createOrder(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Body is directly an array: [{ productId, quantity }]
      const items = req.body;

      // Validate items
      if (!Array.isArray(items) || items.length === 0) {
        console.log("VALIDATION FAILED: Not an array or empty");
        return res.status(400).json({ message: "Invalid order items" });
      }

      for (const item of items) {
        if (!item.productId) {
          return res.status(400).json({ message: "Product ID is required for each item" });
        }
        if (!item.quantity || item.quantity < 1) {
          return res.status(400).json({ message: "Invalid quantity for item" });
        }
      }

      // Get products by IDs
      const productIds = items.map(item => item.productId);
      const products = await this.productsService.getProductsByIds(productIds);

      if (products.length !== items.length) {
        return res.status(400).json({ message: "Some products not found" });
      }

      // Validate inventory and build order items
      const orderItems = [];
      for (const item of items) {
        const product = products.find(p => p._id.toString() === item.productId);
        if (!product) {
          return res.status(400).json({ message: "Product not found" });
        }
        
        // Check inventory
        if (!product.inventory || product.inventory < item.quantity) {
          return res.status(400).json({ 
            message: `Insufficient inventory for ${product.name}. Available: ${product.inventory || 0}, Requested: ${item.quantity}` 
          });
        }
        
        orderItems.push({
          productId: product._id,
          productName: product.name,
          price: product.price,
          quantity: item.quantity,
          subtotal: product.price * item.quantity
        });
      }

      // Calculate total price
      const totalPrice = orderItems.reduce((acc, item) => acc + item.subtotal, 0);

      // Generate unique order ID
      const orderId = uuid.v4();

      console.log("Creating order:", orderId);
      console.log("Order items:", orderItems);
      console.log("Total price:", totalPrice);

      // Store pending order
      this.ordersMap.set(orderId, {
        status: "pending",
        orderItems,
        totalPrice,
        username: req.user.username,
        orderId
      });

      // Publish message to orders queue
      console.log("Publishing order to queue:", config.queueNameOrder);
      await messageBroker.publishMessage(config.queueNameOrder, {
        orderItems,
        totalPrice,
        username: req.user.username,
        orderId
      });
      console.log("Order published successfully");

      // Long polling until order is completed
      let order = this.ordersMap.get(orderId);
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds timeout

      while (order.status !== 'completed' && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 second
        order = this.ordersMap.get(orderId);
        attempts++;
      }

      if (order.status !== 'completed') {
        return res.status(408).json({ message: "Order processing timeout" });
      }

      // Return completed order
      return res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Get order status by ID
   * GET /api/buy/:orderId
   * Headers: Authorization token required
   */
  async getOrderStatus(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { orderId } = req.params;
      const order = this.ordersMap.get(orderId);

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      return res.status(200).json(order);
    } catch (error) {
      console.error("Error getting order status:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = BuyController;
