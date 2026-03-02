import express from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/product.controller.js";

import { validate } from "../middlewares/validation.middleware.js";
import productSchemaValidation from "../validations/product.validation.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";

const router = express.Router();

router
    .route("/")
    .get(getAllProducts)
    .post(
        protect,
        restrictTo("admin"),
        validate(productSchemaValidation),
        createProduct
    );

router
    .route("/:id")
    .get(getProductById)
    .put(
        protect,
        restrictTo("admin"),
        validate(productSchemaValidation),
        updateProduct
    )
    .delete(
        protect,
        restrictTo("admin"),
        deleteProduct
    );

export default router;