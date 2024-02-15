const express = require("express");
const {
  addToCart,
  getCartItems,
  updateItemQuantity,
  removeItem,
} = require("../Controllers/Cart");
const router = express.Router();

router.post("/", addToCart);
router.get("/", getCartItems);
router.patch("/:id", updateItemQuantity);
router.delete("/:id", removeItem);

module.exports = router;
