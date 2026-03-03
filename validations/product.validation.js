const { z } = require('zod');

const createProductSchema = z.object({
  body: z.object({
    name: z.string()
      .min(3, 'Name must be at least 3 characters')
      .max(100, 'Name must be at most 100 characters'),
    
    price: z.number({ required_error: "Price is required" })
      .min(0, 'Price must be 0 or more'),

    priceAfterDiscount: z.number().min(0).optional(),

    description: z.string()
      .min(10, 'Description must be at least 10 characters')
      .max(500, 'Description must be at most 500 characters'),

    category: z.enum(['electronics', 'clothing', 'books', 'other'], {
      errorMap: () => ({ message: "Please select a valid category" })
    }),

    stock: z.number().int().min(0).default(0),

    imageCover: z.string({ required_error: "Product cover image is required" }),
    
    images: z.array(z.string()).optional(),
  })
  .refine((data) => {
    if (data.priceAfterDiscount && data.priceAfterDiscount >= data.price) {
      return false;
    }
    return true;
  }, {
    message: "Discount price must be lower than the original price",
    path: ["priceAfterDiscount"], 
  }),
});

const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(100).optional(),
    price: z.number().min(0).optional(),
    priceAfterDiscount: z.number().min(0).optional(),
    description: z.string().min(10).max(500).optional(),
    category: z.enum(['electronics', 'clothing', 'books', 'other']).optional(),
    stock: z.number().int().min(0).optional(),
    imageCover: z.string().optional(),
    images: z.array(z.string()).optional(),
  })
  .refine((data) => {
    if (data.price && data.priceAfterDiscount && data.priceAfterDiscount >= data.price) {
      return false;
    }
    return true;
  }, {
    message: "Discount price must be lower than the original price",
    path: ["priceAfterDiscount"],
  }),
});

module.exports = { createProductSchema, updateProductSchema };