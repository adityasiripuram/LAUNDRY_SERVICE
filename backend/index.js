const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");
const jwt = require("jsonwebtoken");
SECRET = "RESTAPI";

const app = express();

/*  MONGOOSE CONNECTION  */
let PORT = process.env.PORT || 4000;
const url = `mongodb+srv://Admin:qwerty7@laundry-servicedb.iwqpz.mongodb.net/laundry-serviceDB?retryWrites=true&w=majority`;
mongoose.connect(url).then(() => {
  console.log("connected to database");
});

app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

/*  ROUTES */
const loginRoutes = require("./Routes/login");
const registerRoutes = require("./Routes/register");
const orderRoutes = require("./Routes/orders");
const userRoutes = require("./Routes/user");

/*AUTHORIZATION */
app.use("/users", (req, res, next) => {
  var token = req.headers.authorization.split("Bearer ")[1];
  if (!token) {
    return res.status(401).json({
      status: "failed",
      message: "token is missing",
    });
  }
  jwt.verify(token, SECRET, function (err, decoded) {
    if (err) {
      return res.status(401).json({
        status: "failed",
        message: "invalid token",
      });
    } else {
      req.user = decoded.data;
      next();
    }
  });
});

app.use("/", loginRoutes);
app.use("/", registerRoutes);
app.use("/users", orderRoutes);
app.use("/", userRoutes);

app.listen(PORT, () => {
  console.log(`server is on port ${PORT}`);
});
