const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const productRoutes = require("./routes/product")

const PORT = process.env.PORT || 5001

const app = express()
dotenv.config()

app.use(express.json())

//routes
app.use("/api/products", productRoutes)

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB")
        app.listen(PORT, () => {
            console.log(`Product service is running on port ${PORT}`)
        })
    })
    .catch((err) => {
        console.log("Error connecting to MongoDB -> Product Service", err)
    })



