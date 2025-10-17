const express = require("express");
const BuyController = require("../controllers/buyController");
const isAuthenticated = require("../utils/isAuthenticated");

module.exports = function(ordersMap) {
  const router = express.Router();
  const buyController = new BuyController(ordersMap);

  // Create order (buy products)
  router.post("/", isAuthenticated, buyController.createOrder);

  // Get order status
  router.get("/:orderId", isAuthenticated, buyController.getOrderStatus);

  return router;
};
