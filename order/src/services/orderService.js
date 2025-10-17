const OrderRepository = require("../repositories/orderRepository");

/**
 * Service layer for order business logic
 * Handles order validation and database operations
 */
class OrderService {
  constructor() {
    this.orderRepository = new OrderRepository();
  }

  validateOrderItems(orderItems) {
    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return { isValid: false, error: "Invalid order items" };
    }

    for (const item of orderItems) {
      if (!item.productId) {
        return { isValid: false, error: "Product ID is required for each item" };
      }
      if (!item.productName) {
        return { isValid: false, error: "Product name is required for each item" };
      }
      if (!item.price || item.price < 0) {
        return { isValid: false, error: "Valid price is required for each item" };
      }
      if (!item.quantity || item.quantity < 1) {
        return { isValid: false, error: "Valid quantity is required for each item" };
      }
      if (!item.subtotal || item.subtotal < 0) {
        return { isValid: false, error: "Valid subtotal is required for each item" };
      }
    }

    return { isValid: true };
  }

  validateUsername(username) {
    if (!username || typeof username !== 'string' || username.trim() === '') {
      return { isValid: false, error: "Valid username is required" };
    }
    return { isValid: true };
  }

  async createOrder(orderItems, username, totalPrice) {
    // Validate order items
    const itemsValidation = this.validateOrderItems(orderItems);
    if (!itemsValidation.isValid) {
      throw new Error(itemsValidation.error);
    }

    // Validate username
    const usernameValidation = this.validateUsername(username);
    if (!usernameValidation.isValid) {
      throw new Error(usernameValidation.error);
    }

    // Validate total price
    if (!totalPrice || totalPrice < 0) {
      throw new Error("Valid total price is required");
    }

    // Create order in database
    const orderData = {
      orderItems,
      user: username,
      totalPrice
    };

    const order = await this.orderRepository.create(orderData);
    console.log("Order saved to database:", order._id);

    return order;
  }
  async getOrderById(orderId) {
    return await this.orderRepository.findById(orderId);
  }

  async getOrdersByUser(username) {
    return await this.orderRepository.findByUser(username);
  }

  async getAllOrders() {
    return await this.orderRepository.findAll();
  }

  async updateOrderStatus(orderId, status) {
    return await this.orderRepository.update(orderId, { status });
  }

  async deleteOrder(orderId) {
    return await this.orderRepository.delete(orderId);
  }

  async getOrderStats() {
    const totalOrders = await this.orderRepository.count();
    const allOrders = await this.orderRepository.findAll();
    
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue
    };
  }
}

module.exports = OrderService;
