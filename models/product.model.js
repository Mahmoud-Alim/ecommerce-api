import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "Product name is required"], 
        minlength: [3, "Product name must be at least 3 characters long"], 
        maxlength: [20, "Product name must be at most 20 characters long"], 
        trim: true, 
        index: true
    },
    description: { 
        type: String, 
        maxlength: [200, "Description must be at most 200 characters long"], 
        trim: true 
    },
    price: { 
        type: Number, 
        required: [true, "Price is required"], 
        min: [0, "Price must be greater than 0"] 
    },
    inStock: { 
        type: Boolean, 
        default: true 
    }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;