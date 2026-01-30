const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');
const Manual = require('../models/Manual');
const asyncHandler = require('../utils/asyncHandler');

const buildQuery = (query) => {
  const filter = { isActive: true };
  if (query.search) filter.name = { $regex: query.search, $options: 'i' };
  if (query.category) filter.category = query.category;
  if (query.subCategory) filter.subCategory = query.subCategory;
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }
  return filter;
};

// Utility: accept features in multiple formats (array, comma/newline-separated string, or description fallbacks)
const parseFeatures = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) return input.map((s) => String(s).trim()).filter(Boolean);
  if (typeof input === 'string') {
    // Try newline split first
    const byNewline = input.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    if (byNewline.length > 1) return byNewline;
    // Try comma split
    const byComma = input.split(',').map((s) => s.trim()).filter(Boolean);
    if (byComma.length > 1) return byComma;
    // Fallback to sentence split
    return input.split(/[.?!]\s+/).map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

const listProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const sort = req.query.sort || '-createdAt';
  const filter = buildQuery(req.query);

  const [items, count] = await Promise.all([
    Product.find(filter)
      .select('name price salePrice images averageRating totalReviews slug category flipkartLink') // Select only needed fields
      .populate('category', 'name') // Populate only name
      .populate('subCategory', 'name')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(), // Use lean() for faster read-only queries
    Product.countDocuments(filter)
  ]);

  res.json({
    data: items,
    pagination: { page, limit, total: count, pages: Math.ceil(count / limit) }
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category subCategory');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const reviews = await Review.find({ product: product._id }).populate('user', 'name');
  res.json({ product, reviews });
});

const getProductBasic = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .select('name images');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

const createProduct = asyncHandler(async (req, res) => {
  // Basic validation
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({ message: 'Name and price are required' });
  }

  // Normalize features: accept features[] or features string or fallback to description
  const features = parseFeatures(req.body.features ?? req.body.description);

  const product = await Product.create({
    ...req.body,
    price: Number(price),
    sortOrder: req.body.sortOrder !== undefined ? Number(req.body.sortOrder) : 0,
    features,
    images: (req.files || []).map((file) => ({
      url: file.path || file.secure_url,
      publicId: file.filename || file.public_id
    }))
  });
  res.status(201).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const updates = { ...req.body };

  if (req.body.sortOrder !== undefined) {
    updates.sortOrder = Number(req.body.sortOrder);
  }

  // Normalize features if provided (or fallback from description)
  if (req.body.features !== undefined || req.body.description !== undefined) {
    updates.features = parseFeatures(req.body.features ?? req.body.description);
  }

  // Handle images update
  if (req.body.existingImages !== undefined || req.files?.length) {
    let images = [];
    
    // Add existing images if provided
    if (req.body.existingImages) {
      try {
        images = JSON.parse(req.body.existingImages);
      } catch (err) {
        return res.status(400).json({ message: 'Invalid existingImages format' });
      }
    }
    
    // Add new uploaded images
    if (req.files?.length) {
      const newImages = req.files.map((file) => ({
        url: file.path || file.secure_url,
        publicId: file.filename || file.public_id
      }));
      images = [...images, ...newImages];
    }
    
    updates.images = images;
    delete updates.$push; // Remove the push operation
  }

  const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json(category);
});

const deleteCategory = asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Category deleted' });
});
const deleteProduct = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json(category);
});

const listCategories = asyncHandler(async (_req, res) => {
  // populate parent names for better display in admin UI
  const categories = await Category.find().populate('parent', 'name');
  res.json(categories);
});

const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;

  const existing = await Review.findOne({ product: productId, user: req.user._id });
  if (existing) return res.status(400).json({ message: 'You already reviewed this product' });

  await Review.create({
    product: productId,
    user: req.user._id,
    rating,
    comment
  });

  const stats = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: '$product', avgRating: { $avg: '$rating' }, total: { $sum: 1 } } }
  ]);

  if (stats.length) {
    await Product.findByIdAndUpdate(productId, {
      averageRating: stats[0].avgRating,
      totalReviews: stats[0].total
    });
  }

  res.status(201).json({ message: 'Review added' });
});

const getProductManuals = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  
  // Verify product exists
  const product = await Product.findById(productId).select('name images');
  if (!product) return res.status(404).json({ message: 'Product not found' });

  // Get all active manuals for this product
  const manuals = await Manual.find({ 
    product: productId, 
    isActive: true 
  }).sort('-createdAt');

  res.json({
    product: {
      name: product.name,
      image: product.images && product.images.length > 0 ? product.images[0].url : null
    },
    manuals
  });
});

const getAllManuals = asyncHandler(async (req, res) => {
  const manuals = await Manual.find({ isActive: true })
    .populate('product', 'name images')
    .sort('-createdAt');
  
  res.json(manuals);
});

module.exports = {
  listProducts,
  getProduct,
  getProductBasic,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory,
  listCategories,
  addReview,
  getProductManuals,
  getAllManuals
};

