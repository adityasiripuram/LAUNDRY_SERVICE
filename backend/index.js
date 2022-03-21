const mongoose = require("mongoose");
const express = require("express");

const app = express();
let PORT = process.env.PORT || 5000;
const url = `mongodb+srv://Admin:qwerty7@laundry-servicedb.iwqpz.mongodb.net/laundry-serviceDB?retryWrites=true&w=majority`;

mongoose
  .connect(url)
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(`Error occured ${err}`);
  });
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("TEAM 6");
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
