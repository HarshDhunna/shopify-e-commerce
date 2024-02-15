const express = require("express");
const router = express.Router();
const { updateUser, fetchUserById } = require("../Controllers/User");

router.patch("/:id", updateUser);
router.get("/", fetchUserById);

module.exports = router;
