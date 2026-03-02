import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string()
      .min(3, { message: 'Product name must be at least 3 characters long' })
      .max(20)
      .min(1, { message: 'Product name is required' }),
    description: z.string()
      .max(200, { message: 'Description must be at most 200 characters long' })
      .trim()
      .optional(),
    price: z.number({
        required_error: 'Price is required',
        invalid_type_error: 'Price must be a number'
      })
      .min(0, { message: 'Price must be greater than 0' }),
    inStock: z.boolean().default(true)
  })
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().length(24, { message: "Invalid Product ID format" })
  }),
  body: z.object({
    name: z.string().min(3).max(20).optional(),
    description: z.string().max(200).trim().optional(),
    price: z.number().min(0).optional(),
    inStock: z.boolean().optional()
  })
});

export const productIdSchema = z.object({
  params: z.object({
    id: z.string().length(24, { message: "Invalid Product ID format" })
  })
});

export const productQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    page: z.string()
      .regex(/^\d+$/, "Page must be a number")
      .transform(Number)
      .default("1"),
    limit: z.string()
      .regex(/^\d+$/, "Limit must be a number")
      .transform(Number)
      .default("10")
  })
});