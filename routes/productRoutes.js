const express = require("express");
const router = express.Router();
const Product = require("../Models/Product");

// Get all products
router.get("/", async (req, res) => {
  try {
    const categories = req.query.categories
      ? req.query.categories.split(",")
      : [];
    const brands = req.query.brands ? req.query.brands.split(",") : [];

    const filterOptions = {};

    const sortOption = {};

    if (categories.length > 0) {
      filterOptions.category = { $in: categories };
    }
    if (brands.length > 0) {
      filterOptions.brand = { $in: brands };
    }
    if (req.user.role !== "admin") {
      filterOptions.deleted = { $ne: true };
    }

    if (req.query._sort) {
      sortOption[req.query._sort] = req.query._order === "asc" ? 1 : -1;
    }

    const pagination = {};

    if (req.query._page && req.query._limit) {
      const page = req.query._page;
      const limit = req.query._limit;
      const skip = (page - 1) * limit;
      pagination.limit = limit;
      pagination.skip = skip;
    }

    const baseQuery = Product.find(filterOptions).sort(sortOption);
    const newQuery = Product.find(filterOptions)
      .sort(sortOption)
      .skip(pagination.skip)
      .limit(pagination.limit);

    const totalProducts = await baseQuery.countDocuments().exec();
    const products = await newQuery.exec();
    res.setHeader("X-Total-Count", totalProducts);
    res.json(products);
  } catch (error) {
    console.log("some error occured");
    res.status(500).json({ message: error.message });
  }
});

// Get a specific product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new product
router.post("/", async (req, res) => {
  const product = new Product({
    ...req.body,
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a product by ID
router.patch("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.title = req.body.title || product.title;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.discountPercentage =
      req.body.discountPercentage || product.discountPercentage;
    product.stock = req.body.stock || product.stock;
    product.category = req.body.category || product.category;
    product.brand = req.body.barnd || product.brand;
    product.images = req.body.images || product.images;
    product.thumbnail = req.body.thumbnail || product.thumbnail;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a product by ID
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const result = await Product.deleteOne({ _id: product.id });

    if (result.deletedCount > 0) {
      console.log("Product removed successfully.");
    } else {
      console.log("Product not found or not removed.");
    }

    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
