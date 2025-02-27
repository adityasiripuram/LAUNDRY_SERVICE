const express = require("express");
const serverless = require("serverless-http"); 
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("./DatabaseConnection.js");
const userModel = require("./models/user.js");
const orderModel = require("./models/order.js");
const productModel = require("./models/product.js");
require("dotenv").config();

const app = express();
const Access_Token_Secret = process.env.ACCESS_TOKEN_SECRET;

// -----------------Middlewares-----------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// ---------DB-collections-----------------------
const user = userModel.Users;
const order = orderModel.Orders;
const product = productModel.Products;

// -----------------Routes-----------------------------
app.get("/", (req, res) => {
  res.send("Server connected");
});

// -----------------Login-----------------------------
app.post("/login", async (req, res) => {
  const { userID, password } = req.body;
  let query = isNaN(userID) ? { email: userID } : { phone: userID };

  user.findOne(query).then((result) => {
    if (!result) {
      return res.status(400).json({ message: "User not found" });
    }

    bcrypt.compare(password, result.password).then((isMatch) => {
      if (!isMatch) {
        return res.status(403).send("Invalid password");
      }

      const token = jwt.sign({ userID: result._id }, Access_Token_Secret);
      order.find({ userId: result._id })
        .then((orders) => res.status(200).json({ token, userName: result.name, orders }))
        .catch((err) => res.status(400).send("Some error in login"));
    });
  });
});

// -----------------Register-----------------------------
app.post("/register", async (req, res) => {
  try {
    const { password, ...userDetails } = req.body;
    userDetails.password = await bcrypt.hash(password, 10);
    new user(userDetails)
      .save()
      .then(() => res.status(200).json({ message: "Success" }))
      .catch((error) => res.status(400).send(error));
  } catch (err) {
    res.status(500).send(err);
  }
});

// -----------------Token Validation Middleware----------------------
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(403).send("Not authorized");

  jwt.verify(token, Access_Token_Secret, (err, userDetails) => {
    if (err) return res.status(403).send("Expired Token");

    user.findById(userDetails.userID).then((result) => {
      if (!result) return res.status(400).send("User not found");

      req.user = userDetails;
      next();
    });
  });
};

// -----------------Get Products-----------------------------
app.get("/products", authenticateToken, async (req, res) => {
  product.find()
    .then((products) => res.status(200).json({ products }))
    .catch((err) => res.status(500).send(err));
});

// -----------------Create Order-----------------------------
app.post("/order", authenticateToken, async (req, res) => {
  const date = new Date();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const orderDate = `${date.getDate()} ${monthNames[date.getUTCMonth()]} ${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`;

  const orderdoc = {
    userId: req.user.userID,
    "Order Date and Time": orderDate,
    "Total Items": req.body.totalItems,
    Price: req.body.price,
    Status: "Washed",
    orderDatail: req.body.orderDatail,
  };

  new order(orderdoc)
    .save()
    .then((result) => res.status(200).send(result))
    .catch((err) => res.status(400).send(err));
});

// -----------------Cancel Order-----------------------------
app.put("/cancel", authenticateToken, async (req, res) => {
  order.findByIdAndUpdate(req.body.order_id, { Status: "Cancelled" })
    .then(() => res.status(200).send("Updated"))
    .catch((err) => res.status(400).json({ message: err }));
});

// ✅ Export app for Vercel
module.exports = app;
module.exports.handler = serverless(app);
