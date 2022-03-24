const express = require("express");
const bodyParser = require("body-parser");
const User = require("../models/users");

const router = express.Router();

router.use(bodyParser());

router.get("/user/:userId", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId, user: req.user });
    return res.status(200).json({
      status: "Success",
      user,
    });
  } catch (e) {
    return res.status(500).json({
      status: "Failed",
      message: e.message,
    });
  }
});

module.exports = router;
