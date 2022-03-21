const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  productType: { type: String },
  quantity: { type: Number, default: 0 },
  washing: { type: Boolean, default: false },
  ironing: { type: Boolean, default: false },
  drywash: { type: Boolean, default: false },
  chemicalwash: { type: Boolean, default: false },
});

const orderSchema = new Schema({
  status: { type: String },
  products: { type: [productSchema] },
  user: { type: mongoose.Types.ObjectId, ref: "User" },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
