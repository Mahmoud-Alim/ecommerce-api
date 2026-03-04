import express from "express";
import mongoose from "mongoose";
import Category from "../models/categories.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const categoryList = await Category.find();
    if (!categoryList) {
      res.status(500).json({ success: false });
    }
    res.status(200).send(categoryList);
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

router.get("/:id", async (req, res) => {
  if(!mongoose.isValidObjectId(req.params.id)){
    return res.status(400).send("Invalid Category ID");
  }
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(500).json({ success: false });
    }
    res.status(200).send(category);
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

router.post("/", async (req, res) => {
  try {
    let category = new Category({
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    });
    category = await category.save();

    if (!category) return res.status(400).send("the category cannot be created!");

    res.send(category);
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

router.put("/:id", async (req, res) => {
  if(!mongoose.isValidObjectId(req.params.id)){
    return res.status(400).send("Invalid Category ID");
  }
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    }, {
      new: true,
    });
    if (!category) {
      res.status(500).json({ success: false });
    }
    res.status(200).send(category);
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

router.delete("/:id", async (req, res) => {
  if(!mongoose.isValidObjectId(req.params.id)){
    return res.status(400).send("Invalid Category ID");
  }
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      res.status(500).json({ success: false });
    }
    res.status(200).send(category);
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

export default router;
