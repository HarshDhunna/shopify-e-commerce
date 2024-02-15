const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const passport = require("./config/passport.js");
const isAuthenticated = passport.authenticate("jwt", { session: false });
const productRoutes = require("./routes/productRoutes.js");
const brandRoutes = require("./routes/brandRoutes.js");
const categoryRoutes = require("./routes/categoryRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const {
  createPaymentIntent,
} = require("./Controllers/createPaymentIntent.js.js");
const { webHook } = require("./Controllers/WebHook.js");
const { sendMail } = require("./common/mail.js");

const path = require("path");
const app = express();

const PORT = process.env.PORT || 8080;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(`${process.env.MONGO_CONNECTION}`);
  console.log("database connected");
}

app.use(express.static(path.resolve(__dirname, "build")));
// Session middleware

// Passport middleware
app.use(passport.initialize());

// CORS middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    exposedHeaders: ["X-Total-Count"],
    credentials: true,
  })
);
app.use("/web-hook", express.raw({ type: "application/json" }), webHook);

// Body parser middleware

app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/products", isAuthenticated, productRoutes);
app.use("/api/brands", isAuthenticated, brandRoutes);
app.use("/api/categories", isAuthenticated, categoryRoutes);
app.use("/api/users", isAuthenticated, userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", isAuthenticated, cartRoutes);
app.use("/api/orders", isAuthenticated, orderRoutes);

app.post("/api/create-payment-intent", isAuthenticated, createPaymentIntent);
app.post("/api/send-mail", isAuthenticated, sendMail);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
