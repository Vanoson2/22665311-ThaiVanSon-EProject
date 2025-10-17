const Order = require("../models/order");

/**
 * Repository for managing order data access
 * Handles database operations for orders
 */
class OrderRepository {
  
  async create(orderData) {
    const order = await Order.create(orderData);
    return order.toObject();
  }

  async findById(orderId) {
    const order = await Order.findById(orderId).lean();
    return order;
  }

  async findByUser(username) {
    const orders = await Order.find({ user: username }).lean();
    return orders;
  }

  async update(orderId, updateData) {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId, 
      updateData, 
      { new: true }
    ).lean();
    return updatedOrder;
  }

  async delete(orderId) {
    const result = await Order.findByIdAndDelete(orderId);
    return !!result;
  }

  async findAll() {
    const orders = await Order.find().lean();
    return orders;
  }

  async count() {
    const count = await Order.countDocuments();
    return count;
  }
}

module.exports = OrderRepository;
