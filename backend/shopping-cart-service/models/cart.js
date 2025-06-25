const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  items: [
    {
      productId: String,
      quantity: Number,
    },
  ],
})

module.exports = mongoose.model("Cart", cartSchema)
