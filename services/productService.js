import Product from "../models/product.js";
import mongoose from "mongoose";
import AppError from "../utils/AppError.js";
import { deleteFiles } from "../middlewares/uploadMiddleware.js";

export const getAllProducts = async (categoryId) => {
  const filter = {};
  if (categoryId) {
    if (!mongoose.isValidObjectId(categoryId)) {
      throw new AppError("Invalid category ID in query", 400);
    }
    filter.category = categoryId;
  }

  const products = await Product.find(filter)
    .sort({ dateCreated: -1 })
    .populate("category", "name color icon")
    .select("name price image category isFeatured brand");

  return products;
};

export const getProductCount = async () => {
  return Product.countDocuments();
};

export const getFeaturedProducts = async (count) => {
  const limit = Math.min(50, Math.max(1, parseInt(count) || 10));
  return Product.find({ isFeatured: true }).limit(limit);
};

export const getProductById = async (id) => {
  const product = await Product.findById(id).populate("category");
  if (!product) throw new AppError("Product not found", 404);
  return product;
};

export const createProduct = async (data, files) => {
  if (!data.name || !data.price || !data.category) {
    if (files) await deleteFiles(files);
    throw new AppError("Missing required fields: name, price, and category are required", 400);
  }

  if (!files || files.length === 0) {
    throw new AppError("At least one image is required", 400);
  }

  try {
    const relativePaths = files.map((file) => `/public/uploads/${file.filename}`);
    const product = await Product.create({
      ...data,
      image: relativePaths[0],
      images: relativePaths,
    });
    return product;
  } catch (err) {
    await deleteFiles(files);
    throw err;
  }
};

export const updateProduct = async (id, data, files) => {
  const existingProduct = await Product.findById(id);
  if (!existingProduct) {
    if (files) await deleteFiles(files);
    throw new AppError("Product not found", 404);
  }

  try {
    const updateData = { ...data };
    if (files && files.length > 0) {
      const relativePaths = files.map((file) => `/public/uploads/${file.filename}`);
      updateData.image = relativePaths[0];
      updateData.images = relativePaths;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    return updatedProduct;
  } catch (err) {
    if (files) await deleteFiles(files);
    throw err;
  }
};

export const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new AppError("Product not found", 404);

  const filesToDelete = [product.image, ...(product.images || [])]
    .filter(Boolean)
    .map((p) => ({ path: p.startsWith("/") ? p.slice(1) : p }));
  await deleteFiles(filesToDelete);

  return { id };
};
