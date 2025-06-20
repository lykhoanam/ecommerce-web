const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
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
    totalAmount: {
        type: Number,
        require: true,
    },
    status: {
        type: String,
        default: "Pending"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model("Order", orderSchema)


