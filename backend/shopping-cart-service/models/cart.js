const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  items: [
    {
      productId: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        default: 1
      },
      size: {
        type: String, // <- thêm size
        required: true
      }
    }
  ]
})

module.exports = mongoose.model("Cart", cartSchema)
