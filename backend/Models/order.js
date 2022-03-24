const mongoose = require("mongoose");
const { Schema } = mongoose;

const ItemSchema = new Schema({
  ProductType: { type: String },
  Quantities: { type: Number, default: 0 },
  Washing: { type: Boolean, default: false },
  Iron: { type: Boolean, default: false },
  Drywash: { type: Boolean, default: false },
  Chemicalwash: { type: Boolean, default: false },
});

const orderSchema = new Schema({
  status: { type: String },
  products: { type: [ItemsSchema] },
  TotalPrice: { type: Number, default: 0 },
  TotalQuantity: { type: Number, default: 0 },
  user: { type: mongoose.Types.ObjectId, ref: "User" },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
