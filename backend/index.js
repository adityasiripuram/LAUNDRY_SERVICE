const express = require("express");
const serverless = require("serverless-http");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
require("./DatabaseConnection.js");

const userModel = require("./Models/user.js");
const orderModel = require("./Models/order.js");
const productModel = require("./Models/product.js");

const app = express();
const Access_Token_Secret = process.env.ACCESS_TOKEN_SECRET;

// -----------------Middlewares-----------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("cors")({ origin: "*", credentials: true }));

// ---------DB Models-----------------------
const user = userModel.Users;
const order = orderModel.Orders;
const product = productModel.Products;

// -----------------Routes-----------------------------
const port = process.env.PORT ;
app.listen(port, () => {
  console.log(`Im listening on `,port);
});
app.get("/", (req, res) => {
  res.send("Server connected");
});

// -----------------Login-----------------------------
app.post("/login", async (req, res) => {
  try {
    const { userID, password } = req.body;
    const query = isNaN(userID) ? { email: userID } : { phone: userID };

    const foundUser = await user.findOne(query);
    if (!foundUser) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) return res.status(403).send("Invalid password");

    const token = jwt.sign({ userID: foundUser._id }, Access_Token_Secret);
    const userOrders = await order.find({ userId: foundUser._id });

    res.status(200).json({ token, userName: foundUser.name, orders: userOrders });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// -----------------Register-----------------------------
app.post("/register", async (req, res) => {
  try {
    const { password, ...userDetails } = req.body;
    userDetails.password = await bcrypt.hash(password, 10);

    await new user(userDetails).save();
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).send(error.message);
  }
});

// -----------------Token Validation Middleware----------------------
const authenticateToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).send("Not authorized");

  try {
    const decoded = jwt.verify(token, Access_Token_Secret);
    const foundUser = await user.findById(decoded.userID);
    if (!foundUser) return res.status(400).send("User not found");

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).send("Expired Token");
  }
};

// -----------------Get Products-----------------------------
app.get("/products", authenticateToken, async (req, res) => {
  try {
    const products = await product.find();
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// -----------------Create Order-----------------------------
app.post("/order", authenticateToken, async (req, res) => {
  try {
    const date = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const orderDate = `${date.getDate()} ${monthNames[date.getUTCMonth()]} ${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`;

    const orderDoc = {
      userId: req.user.userID,
      "Order Date and Time": orderDate,
      "Total Items": req.body.totalItems,
      Price: req.body.price,
      Status: "Washed",
      orderDetail: req.body.orderDetail,
    };

    const newOrder = await new order(orderDoc).save();
    res.status(200).json(newOrder);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// -----------------Cancel Order-----------------------------
app.put("/cancel", authenticateToken, async (req, res) => {
  try {
    await order.findByIdAndUpdate(req.body.order_id, { Status: "Cancelled" });
    res.status(200).send("Order Cancelled");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Export app for Vercel
module.exports = app;
module.exports.handler = serverless(app);
