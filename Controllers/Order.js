const express = require("express");
const mongoose = require("mongoose");
const Order = require("../Models/Order");

exports.addOrder = async (req, res) => {
  try {
    const order = new Order({ ...req.body });
    const savedOrder = await order.save();
    await savedOrder.populate("items.product");
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.query.userId }).populate(
      "items.product"
    );
    if (!orders) {
      res.status(404).json({ message: "orders not found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.fetchOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");
    if (!order) {
      res.status(404).json({ message: "order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        useFindAndModify: false,
      }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "order not found" });
    }
    await updatedOrder.populate("items.product");
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.fetchAllOrders = async (req, res) => {
  try {
    const sortOption = {};
    const pagination = {};

    if (req.query._sort && req.query._order) {
      if (req.query._sort === "id") {
        sortOption["_id"] = req.query._order === "asc" ? 1 : -1;
      } else sortOption[req.query._sort] = req.query._order === "asc" ? 1 : -1;
    }

    if (req.query._page && req.query._limit) {
      const page = req.query._page;
      const limit = req.query._limit;
      const skip = (page - 1) * limit;
      pagination.limit = limit;
      pagination.skip = skip;
    }

    const baseQuery = Order.find({});
    const newQuery = Order.find({})
      .sort(sortOption)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .populate("items.product");

    const totalOrders = await baseQuery.countDocuments().exec();
    const orders = await newQuery.exec();
    res.setHeader("X-Total-Count", totalOrders);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
