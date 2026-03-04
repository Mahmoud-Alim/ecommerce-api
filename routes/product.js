import express from "express";
import mongoose from "mongoose";
import Product from "../models/product.js";
import Category from "../models/categories.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let filter = {};
    if(req.query.category){
      filter = {category: req.query.category};
    }
    const product = await Product.find(filter).sort({createdAt: -1}).populate("category").select("name price");
    if(product.length > 0){
      res.status(200).json(product);
    }else{
      res.status(404).json({message: "Product not found"});
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

router.get("/:id", async (req, res) => {
  if(!mongoose.isValidObjectId(req.params.id)){
    return res.status(400).send("Invalid Product ID");
  }
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) {
      res.status(500).json({ success: false });
    }
    res.status(200).send(product);
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

router.post("/", async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send("Invalid Category");

    let product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      images: req.body.images,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      isFeatured: req.body.isFeatured,
      dateCreated: req.body.dateCreated,
    });
    
    product = await product.save();
    if (!product) return res.status(500).send("The product cannot be created");
    
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

router.put("/:id", async (req, res) => {
  if(!mongoose.isValidObjectId(req.params.id)){
    return res.status(400).send("Invalid Product ID");
  }
  const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send("Invalid Category");
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      images: req.body.images,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      isFeatured: req.body.isFeatured,
      dateCreated: req.body.dateCreated,
    }, {
      new: true,
    });
    if (!product) {
      res.status(500).json({ success: false });
    }
    res.status(200).send(product);
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

router.delete("/:id", async (req, res) => {
  if(!mongoose.isValidObjectId(req.params.id)){
    return res.status(400).send("Invalid Product ID");
  }
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(500).json({ success: false });
    }
    res.status(200).send(product);
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

router.get("/get/count", async (req, res) => {
  const productCount = await Product.countDocuments();
  if(!productCount){
    return res.status(500).json({success: false});
  }
  res.send({
    productCount: productCount
  });
});

router.get("/get/featured/:count?", async (req, res) => {
  const count = req.params.count ? parseInt(req.params.count) : 0;

  try {
    const products = await Product.find({ isFeatured: true }).limit(count);
    
    if (!products) {
      return res.status(500).json({ success: false });
    }
    
    res.status(200).send(products);
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

export default router;