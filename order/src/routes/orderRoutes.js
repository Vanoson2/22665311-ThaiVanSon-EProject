const express = require("express");
const OrderController = require("../controllers/orderController");
const isAuthenticated = require("../utils/isAuthenticated");

const router = express.Router();
const orderController = new OrderController();

// Get order statistics
router.get("/stats", isAuthenticated, orderController.getOrderStats);

// Get orders by user
router.get("/user/:username", isAuthenticated, orderController.getOrdersByUser);

// Get order by ID
router.get("/:orderId", isAuthenticated, orderController.getOrderById);

// Get all orders
router.get("/", isAuthenticated, orderController.getAllOrders);

module.exports = router;
