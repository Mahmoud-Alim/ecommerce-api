const asyncHandler = require('express-async-handler');
const Product = require('../models/product.model');

// @desc    Create new product
// @route   POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  // إضافة الحقول الجديدة (images, imageCover, priceAfterDiscount)
  const { name, price, priceAfterDiscount, description, category, stock, imageCover, images } = req.body;

  const product = await Product.create({
    name,
    price,
    priceAfterDiscount,
    description,
    category,
    stock,
    imageCover,
    images,
    user: req.user.id // تم ربطه بالمستخدم المسجل
  });

  res.status(201).json({
    success: true,
    data: product
  });
});

// @desc    Get all products (With Advanced Filtering, Sorting, Pagination)
// @route   GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  // 1) الفلترة الأساسية (Filtering)
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
  excludedFields.forEach(el => delete queryObj[el]);

  // 2) الفلترة المتقدمة (Price range: gte, lte)
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  
  let mongooseQuery = Product.find(JSON.parse(queryStr));

  // 3) البحث بالاسم (Search by keyword)
  if (req.query.keyword) {
    const keyword = {
      name: { $regex: req.query.keyword, $options: 'i' }
    };
    mongooseQuery = mongooseQuery.find(keyword);
  }

  // 4) الترتيب (Sorting)
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    mongooseQuery = mongooseQuery.sort(sortBy);
  } else {
    mongooseQuery = mongooseQuery.sort('-createdAt'); // الأحدث أولاً افتراضياً
  }

  // 5) تحديد الحقول (Field Limiting)
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    mongooseQuery = mongooseQuery.select(fields);
  }

  // 6) الترقيم (Pagination)
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  mongooseQuery = mongooseQuery.skip(skip).limit(limit);

  // تنفيذ الاستعلام
  const products = await mongooseQuery.populate('user', 'name email');

  res.status(200).json({
    success: true,
    count: products.length,
    page,
    data: products
  });
});

// @desc    Get single product (By ID or Slug)
// @route   GET /api/products/:id
const getProduct = asyncHandler(async (req, res) => {
  // البحث بالمعرف ID
  const product = await Product.findById(req.params.id).populate('user', 'name email');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // التأكد من الملكية (أو أدمن)
  if (product.user.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this product');
  }

  // تحديث المنتج مع تفعيل الـ Validators
  // ملاحظة: قمنا باستخدام findByIdAndUpdate، ولكن إذا تم تغيير الاسم 
  // نحتاج للتأكد أن الـ Slug سيتحدث (سيعمل الـ middleware في السكيما عند الحفظ)
  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: updatedProduct
  });
});

// @desc    Delete product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.user.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this product');
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
};