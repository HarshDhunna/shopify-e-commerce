const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const {
  addUser,
  loginUser,
  checkAuth,
  resetPassword,
  resetPasswordRequest,
} = require("../Controllers/Auth");
router
  .post("/signup", addUser)
  .post("/login", passport.authenticate("local", { session: false }), loginUser)
  .get("/check", passport.authenticate("jwt", { session: false }), checkAuth)
  .post("/reset-password-request", resetPasswordRequest)
  .post("/reset-password", resetPassword);
module.exports = router;
