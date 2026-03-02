import express from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/product.controller.js";

import { validate } from "../middlewares/validation.middleware.js";
import { 
    createProductSchema, 
    productIdSchema, 
    productQuerySchema,
    updateProductSchema 
} from "../validations/product.validation.js";

import { protect, restrictTo } from "../middlewares/auth.middleware.js";

const router = express.Router();

router
    .route("/")
    .get(
        validate(productQuerySchema), 
        getAllProducts
    )
    .post(
        protect,
        restrictTo("admin"),
        validate(createProductSchema), 
        createProduct
    );

router
    .route("/:id")
    .get(
        validate(productIdSchema), 
        getProductById
    )
    .put(
        protect,
        restrictTo("admin"),
        validate(updateProductSchema), 
        updateProduct
    )
    .delete(
        protect,
        restrictTo("admin"),
        validate(productIdSchema), 
        deleteProduct
    );

export default router;