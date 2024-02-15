const express = require("express");
const mongoose = require("mongoose");
const Cart = require("../Models/Cart");
exports.addToCart = async (req, res) => {
  try {
    const cartItem = new Cart({ ...req.body });
    const savedCartItem = await cartItem.save();
    await savedCartItem.populate("product");
    res.status(201).json(savedCartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getCartItems = async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user.id }).populate(
      "product"
    );
    if (!cartItems) {
      res.status(404).json({ message: "Cart Not Found" });
    }

    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateItemQuantity = async (req, res) => {
  try {
    const newItem = await Cart.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      useFindAndModify: false,
    });

    if (!newItem) {
      res.status(404).json({ message: "Item not found" });
    }
    await newItem.populate("product");
    res.json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const item = await Cart.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const result = await Cart.deleteOne({ _id: item.id });

    res.json({ message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
