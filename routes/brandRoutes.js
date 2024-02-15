const express = require("express");
const router = express.Router();
const Brand = require("../Models/Brand");

router.get("/", async (req, res) => {
  try {
    const brands = await Brand.find();

    res.setHeader("X-Total-Count", brands.length);

    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific brand by ID
router.get("/:id", async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: "brand not found" });
    }
    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new brand
router.post("/", async (req, res) => {
  const brand = new Brand({ ...req.body });

  try {
    const newBrand = await brand.save();
    res.status(201).json(newBrand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a product by ID
router.patch("/:id", async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: "brand not found" });
    }

    brand = req.body || brand;

    const updatedBrand = await brand.save();
    res.json(updatedBrand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a product by ID
router.delete("/:id", async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({ message: "brand not found" });
    }

    const result = await Brand.deleteOne({ _id: brand.id });

    if (result.deletedCount > 0) {
      console.log("Brand removed successfully.");
    } else {
      console.log("Brand not found or not removed.");
    }

    res.json({ message: "Brand deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
