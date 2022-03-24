const express = require("express");
const bodyParser = require("body-parser");
const User = require("../models/users");
const bcrypt = require("bcrypt");
SECRET = "RESTAPI";

const { body, param, validationResult } = require("express-validator");

const router = express.Router();

router.use(bodyParser());

/* =========================== REGISTER ===============================*/

router.post(
  "/register",
  body("name"),
  body("email"),
  body("phone"),
  body("password"),
  async (req, res) => {
    console.log(req.body);
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, phone, state, district, address, pincode, password } =
      req.body;
    bcrypt.hash(password, 10, async function (err, hash) {
      if (err) {
        return res.status(400).json({
          status: "failed",
          message: "invalid details",
        });
      }
      console.log("creating user");
      try {
        const user = await User.create({
          name,
          email,
          phone,
          state,
          district,
          address,
          pincode,
          password: hash,
        });
        return res.status(200).json({
          status: "Success",
          data: user,
        });
      } catch (e) {
        console.log("inside catch block");
        return res.status(400).json({
          status: "Failed",
          message: e.message,
        });
      }
    });
  }
);

module.exports = router;
