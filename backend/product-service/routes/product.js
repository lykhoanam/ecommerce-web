const express = require("express")
const Product = require("../models/product")
const router = express.Router()

// create prodcut
router.post("/create", async(req,res) => {
    const {name, description, price, category, stock} = req.body
    try{

        const newProduct = new Product({
            name,
            description,
            price,
            category,
            stock
        })

        await newProduct.save()
        res.status(201).json(newProduct)

    }catch(e){
        res.status(500).send("Server error!")
    }
})

//get all products
router.get("/", async(req, res) => {
    try{

        const products = await Product.find()
        res.json(products)

    }catch(e){
        res.status(500).send("Server error!")
    }
})

// get product by ID
router.get("/:id", async(req, res) => {
    try{
        const product = await Product.findById(req.params.id)
        if(!product) return res.status(404).json({msg: "Product not found"})
        res.json(product)
    }catch(e){
        res.status(500).send("Server Error")
    }
})

// update product
router.put("/:id", async (req, res) => {
    const {name, description, price, category, stock} = req.body
    try{
        const updateProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                price,
                category,
                stock
            },
            {new: true}
        )

        if(!updateProduct)
            return res.status(404).json({msg: "Product not found"})
        res.json(updateProduct)
    }catch(e){
        res.status(500).send("Server Error")
    }
})

// Delete Product
router.delete("/:id", async(req, res) => {
    try{
        const product = await Product.findByIdAndDelete(req.params.id)
        if(!product) return res.status(404).json({msg: "Product not found"})
        res.json({msg: "Product deleted"})
    }catch(e){
        res.status(500).send("Server Error !")
    }
})

module.exports = router