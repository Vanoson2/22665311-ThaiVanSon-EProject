const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  inventory: { type: Number, required: true, min: 0 }
}, { collection : 'products' });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
