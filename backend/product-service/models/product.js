const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
}, { _id: false });

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  type: {
    type: String, // e.g., "For Women", "For Men"
    required: true,
  },
  variants: {
    type: [variantSchema],
    required: true,
  },
  size: {
    type: String, // e.g., "100ml, 50ml"
    required: true,
  },
  price: {
    type: String, // formatted price string, e.g., "2,990,000VND"
    required: true,
  },
  finalPrice: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  category: {
    type: String, // e.g., "Men", "Women"
    required: true,
  },
  rateCount: {
    type: Number,
    default: 0,
  },
  info: {
    type: String,
    required: true,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  path: {
    type: String,
    default: "/product-details/",
  },
  images: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
