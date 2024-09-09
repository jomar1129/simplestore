import express from 'express';
import dotenv from "dotenv";
import { connectDB } from './config/db.js';
import Product from './models/product.model.js';
import mongoose from 'mongoose';

dotenv.config()
const app = express()

app.use(express.json());

app.post("/api/products", async(req, res) => {
    const product = req.body;

    if (!product.name || !product.price || !product.image) return res.status(400).send({ success : false , message: "All fields are required" }) // "All fields are required");

    const newProduct = new Product(product);

    try {
        await newProduct.save();
        res.status(201).send({ sucess: true , data: newProduct});
    }catch (error) {
        console.error("Error saving product:", error.message);
        res.status(500).json({sucess: false, message: "Error saving product"});
    }

});

app.delete("/api/products/:id", async(req, res) => {
    const id = req.params.id;       

    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({sucess: true, message: "Product deleted"});
    } catch (error) {
        console.error("Error deleting product:", error.message);
        res.status(500).json({sucess: false, message: "Product not found"});
    }
})

app.get("/api/products", async(req, res) => { 
    try {
        const products = await Product.find({});
        res.status(200).json({sucess: true, data: products});
    } catch (error) {
        console.error("Error fetching product:", error.message);
        res.status(500).json({sucess: false, message: "No products found"});
    }
});

app.put("/api/products/:id", async(req, res) => {
    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({sucess: false, message: "Invalid Product ID"});

    const product = req.body;

    try {
        const updatedProduct =await Product.findByIdAndUpdate(id, product , {new : true});
        res.status(200).json({sucess: true, data: updatedProduct});
    } catch (error) {    
        console.error("Error updating product:", error.message);
        res.status(500).json({sucess: false, message: "Error updating product"});
    }
})

app.listen(5000, () => {
    connectDB()
    console.log('Server is running on port 5000')   
});

//wOCq6HhREPd3fXit