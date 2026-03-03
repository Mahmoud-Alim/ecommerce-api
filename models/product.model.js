const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [100, 'Name must be at most 100 characters'],
    unique: true
  },
  slug: {
    type: String,
    lowercase: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be at least 0'],
  },
  priceAfterDiscount: {
    type: Number,
    validate: {
      validator: function(val) {
        return val < this.price;
      },
      message: 'Discount price ({VALUE}) should be below regular price'
    }
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
        values: ['electronics', 'clothing', 'books', 'other'],
        message: '{VALUE} is not supported'
    }
  },
  images: [String],
  imageCover: {
    type: String,
    required: [true, 'A product must have a cover image']
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative'],
    validate: {
      validator: Number.isInteger,
      message: 'Stock must be an integer'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: val => Math.round(val * 10) / 10
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Product must belong to a user']
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

productSchema.index({ price: 1, ratingsAverage: -1 });
productSchema.index({ slug: 1 });

productSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model('Product', productSchema);