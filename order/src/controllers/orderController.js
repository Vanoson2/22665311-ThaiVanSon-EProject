const OrderService = require("../services/orderService");

/**
 * Controller for handling order-related HTTP requests
 * Delegates business logic to OrderService
 */
class OrderController {
  constructor() {
    this.orderService = new OrderService();
    this.getOrderById = this.getOrderById.bind(this);
    this.getOrdersByUser = this.getOrdersByUser.bind(this);
    this.getAllOrders = this.getAllOrders.bind(this);
    this.getOrderStats = this.getOrderStats.bind(this);
  }

  /**
   * Get order by ID
   * GET /api/orders/:orderId
   * Headers: Authorization token required
   */
  async getOrderById(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { orderId } = req.params;
      
      if (!orderId) {
        return res.status(400).json({ message: "Order ID is required" });
      }

      const order = await this.orderService.getOrderById(orderId);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      return res.status(200).json(order);
    } catch (error) {
      console.error("Error getting order by ID:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Get orders by user
   * GET /api/orders/user/:username
   * Headers: Authorization token required
   */
  async getOrdersByUser(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { username } = req.params;

      if (!username) {
        return res.status(400).json({ message: "Username is required" });
      }

      const orders = await this.orderService.getOrdersByUser(username);
      return res.status(200).json(orders);
    } catch (error) {
      console.error("Error getting orders by user:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Get all orders
   * GET /api/orders
   * Headers: Authorization token required
   */
  async getAllOrders(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const orders = await this.orderService.getAllOrders();
      return res.status(200).json(orders);
    } catch (error) {
      console.error("Error getting all orders:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Get order statistics
   * GET /api/orders/stats
   * Headers: Authorization token required
   */
  async getOrderStats(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const stats = await this.orderService.getOrderStats();
      return res.status(200).json(stats);
    } catch (error) {
      console.error("Error getting order stats:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = OrderController;
