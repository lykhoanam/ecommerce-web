const express = require("express")
const Product = require("../models/product")
const router = express.Router()

// create prodcut
router.post("/create", async(req,res) => {
    const {
        title,
        brand,
        type,
        variants,
        size,
        price,
        finalPrice,
        originalPrice,
        category,
        rateCount,
        info,
        ratings,
        path,
        images,
        description,
    } = req.body;
    try{

        const newProduct = new Product({
            title,
            brand,
            type,
            variants,
            size,
            price,
            finalPrice,
            originalPrice,
            category,
            rateCount,
            info,
            ratings,
            path,
            images,
            description,
        });

        await newProduct.save()
        res.status(201).json(newProduct)

    }catch(e){
        res.status(500).send("Server error!")
    }
})

// create multiple products
router.post("/bulk-create", async (req, res )=>{
    const products = req.body;

    if(!Array.isArray(products) || products.length === 0){
        return res.status(400).json({ msg: "Product array is required "});
    }

    try{

        const createdProducts = await Product.insertMany(products);
        res.status(201).json({
            msg: `${createdProducts.length} products created`,
            products: createdProducts
        })

    }catch(e){
        res.status(500).json({ msg: "Failed to create products", error: error.message});
    }

})


//get all products
router.get("/get", async(req, res) => {
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
        res.status(500).json({ error: e.message });
    }
})

// update product
router.put("/update/:id", async (req, res) => {
    const {
    title,
    brand,
    type,
    variants,
    size,
    price,
    finalPrice,
    originalPrice,
    category,
    rateCount,
    info,
    ratings,
    path,
    images,
    description,
  } = req.body;
    try{
        const updateProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                title,
                brand,
                type,
                variants,
                size,
                price,
                finalPrice,
                originalPrice,
                category,
                rateCount,
                info,
                ratings,
                path,
                images,
                description,
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
router.delete("/delete/:id", async(req, res) => {
    try{
        const product = await Product.findByIdAndDelete(req.params.id)
        if(!product) return res.status(404).json({msg: "Product not found"})
        res.json({msg: "Product deleted"})
    }catch(e){
        res.status(500).send("Server Error !")
    }
})

//Delete multiple products by IDs
router.delete("/bulk-delete", async(req, res) => {
    const {ids} = req.body;

    if(!Array.isArray(ids) || ids.length === 0){
        return res.status(400).json({msg: "Array of products IDs is required"});
    }

    try{
        
        const result = await Product.deleteMany({_id: {$in: ids } });

        res.json({
            msg: `${result.deletedCount} products deleted`,
            deletedCount: result.deletedCount
        });

    }catch(e){
        res.status(500).json({msg: "Server error", error: e.message});
    }
})


// router.put("/:id/deduct", async(req, res) => {
//     const {quantity} = req.body

//     try{

//         const product = await Product.findById(req.params.id)
//         if(!product){
//             return res.status(404).json({msg: "Product not found"})
//         }

//         if(product.stock < quantity){
//             return res.status(400).json({msg: "Not enough stock"})
//         }

//         product.stock -= quantity
//         await product.save()

//         res.json({msg: "Stock deducted", stock: product.stock})

//     }catch(e){
//         console.log(e)
//         res.status(500).json({msg: e.message})
//     }
// })

module.exports = router