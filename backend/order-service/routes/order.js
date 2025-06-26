const express = require("express")
const Order = require("../models/order")
const axios = require("axios")

const router = express.Router()

const PRODUCT_SERVICE_URI =
  process.env.PRODUCT_SERVICE_URI || "http://product-service:5001"

// place a new order
router.post("/:userId", async(req, res) => {
    const {userId} = req.params
    const {items, totalAmount} = req.body

    try{

        // check if products available
        const productChecks = await Promise.all(
            items.map(async (item) => {
                const product = await axios.get(
                    `${PRODUCT_SERVICE_URI}/api/products/${item.productId}`
                )
                console.log("product: ", product.data)
                console.log("stock: ", product.data.stock)
                console.log("quantity:", item.quantity)
                return product.data && product.data.stock >= item.quantity
            })
        )

        if (productChecks.includes(false)) {
            return res.status(400).json({ msg: "One or more items are out of stock" })
        }

        // create new order

        const order = new Order({
            userId,
            items,
            totalAmount,
        })

        await order.save()

        // deduct product stock

        await Promise.all(
            items.map(async(item) => {
                await axios.put(
                    `${PRODUCT_SERVICE_URI}/api/products/${item.productId}/deduct`,
                    {
                        quantity: item.quantity
                    }
                )
            })
        )

        res.status(201).json(order)

    }catch(e){
        res.status(500).json({ msg: e.message });
    }
})

//get all orders for a user
router.get("/:userId", async(req, res) => {
    const {userId} = req.params
    try{
        const orders = await Order.find({userId})
        res.json(orders)
    }catch(e){
        res.status(500).json({ msg: e.message });
    }
})

// get order by ID

router.get("/:userId/:orderId", async(req, res) => {
    const {userId, orderId} = req.params 
    try{
        const order = await Order.findOne({userId, _id: orderId})
        if(!order) return res.status(404).json({msg: "Order not found"})
        res.json(order)
    }catch(e){
       res.status(500).json({ msg: e.message });
    }
})


//update order status
router.put("/:orderId/status", async(req, res) => {
    const {orderId} = req.params
    const {status}  = req.body

    try{
        const order = await Order.findById(orderId)
        if(!order) return res.status(404).json({msg : "Order not found"})
        
        order.status = status
        await order.save()
        res.json(order)
    }catch(e){
        res.status(500).json({ msg: e.message });
    }
})

module.exports = router