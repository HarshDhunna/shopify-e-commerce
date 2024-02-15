const express = require("express");
const {
  addOrder,
  getOrdersByUserId,
  updateOrder,
  fetchAllOrders,
  fetchOrderById,
} = require("../Controllers/Order");
const router = express.Router();
router.post("/", addOrder);
router.get("/", getOrdersByUserId);
router.get("/all", fetchAllOrders);
router.get("/:id", fetchOrderById);
router.patch("/:id", updateOrder);
module.exports = router;
