const express = require("express");
const User = require("../Models/User");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../common/mail");

exports.addUser = async (req, res) => {
  const user = new User({ ...req.body });

  try {
    const newUser = await user.save();
    const token = jwt.sign({ sub: newUser.id }, "harsh", {
      expiresIn: "1h",
    });
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
    });
    res.status(201).json({ id: newUser.id, role: newUser.role });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const token = jwt.sign({ sub: req.user._id }, "harsh", {
    expiresIn: "1h",
  });
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
  });
  res.json({ id: req.user.id, role: req.user.role });
};

exports.checkAuth = async (req, res) => {
  if (req.user) {
    res.status(200).json({ id: req.user.id, role: req.user.role });
  } else {
    res.status(401).json({ message: "unauthorized" });
  }
};

exports.resetPasswordRequest = async (req, res) => {
  try {
    // Find the user by email

    const user = await User.findOne({ email: req.body.to });

    // If user not found, return an error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    sendMail(req, res);
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: error.message });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email });

    // If user not found, return an error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the password
    user.password = req.body.password;

    // Save the updated user
    const updatedUser = await user.save();

    // Respond with the updated user
    res.json(updatedUser);
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: error.message });
  }
};
