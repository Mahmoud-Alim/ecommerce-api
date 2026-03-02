import Joi from "joi";

const productSchemaValidation = Joi.object({
    name: Joi.string()
        .min(3)
        .max(20)
        .required()
        .messages({
            'string.min': 'Product name must be at least 3 characters long',
            'any.required': 'Product name is required'
        }),
    description: Joi.string()
        .max(200)
        .trim()
        .messages({
            'string.max': 'Description must be at most 200 characters long'
        }),
    price: Joi.number()
        .min(0)
        .required()
        .messages({
            'number.min': 'Price must be greater than 0',
            'any.required': 'Price is required'
        }),
    inStock: Joi.boolean()
        .default(true)
});

export default productSchemaValidation;