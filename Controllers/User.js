const express = require("express");
const User = require("../Models/User");
const mongoose = require("mongoose");

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      useFindAndModify: false,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "user not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.fetchUserById = async (req, res) => {
  try {
    const user = await User.findById(req.user._id, { password: 0 });
    if (!user) {
      res.status(404).json({ message: "user not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// async (req, res) => {
//   try {
//     const updatedUser = await user.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       useFindAndModify: false,
//     });
//     if (!updatedUser) {
//       return res.status(404).json({ message: "user not found" });
//     }

//     res.json(updatedUser);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };
