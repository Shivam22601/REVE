const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const ReferralCode = require('../models/ReferralCode');
const Manual = require('../models/Manual');
const cloudinary = require('cloudinary').v2;
const trim = (s) => (typeof s === 'string' ? s.trim() : '');
const cloudinaryEnabled = String(process.env.CLOUDINARY_ENABLED || '').toLowerCase() === 'true';
const hasCloudinary =
  !!trim(process.env.CLOUDINARY_CLOUD_NAME) &&
  !!trim(process.env.CLOUDINARY_API_KEY) &&
  !!trim(process.env.CLOUDINARY_API_SECRET);
const folderPrefix = trim(process.env.CLOUDINARY_FOLDER) || trim(process.env.CLOUDINARY_FOLDER_PREFIX) || 'reve';
if (cloudinaryEnabled && hasCloudinary) {
  cloudinary.config({
    cloud_name: trim(process.env.CLOUDINARY_CLOUD_NAME),
    api_key: trim(process.env.CLOUDINARY_API_KEY),
    api_secret: trim(process.env.CLOUDINARY_API_SECRET)
  });
}
const asyncHandler = require('../utils/asyncHandler');

const dashboard = asyncHandler(async (_req, res) => {
  const [users, orders, products, revenue] = await Promise.all([
    User.countDocuments(),
    Order.countDocuments(),
    Product.countDocuments(),
    Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totals.grandTotal' } } }
    ])
  ]);
  const recentOrders = await Order.find().populate('user', 'name email').populate('items.product', 'name price images').sort('-createdAt').limit(5);
  res.json({
    totals: {
      users,
      orders,
      products,
      revenue: revenue[0]?.total || 0
    },
    recentOrders
  });
});

const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

const setUserBlock = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isBlocked: req.body.block },
    { new: true }
  ).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const fields = ['name', 'email', 'phone'];
  const updates = {};
  fields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });
  if (req.file) {
    updates.avatar = {
      url: req.file.path || req.file.secure_url,
      publicId: req.file.filename || req.file.public_id 
    };
  }
  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

const listOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find().populate('user', 'name email').populate('items.product', 'name price images').sort('-createdAt');
  res.json(orders);
});

const listProducts = asyncHandler(async (_req, res) => {
  const products = await Product.find().sort({ sortOrder: 1, createdAt: -1, _id: 1 });
  res.json(products);
});

const createReferralCode = asyncHandler(async (req, res) => {
  const { code, discountType, discountValue, maxUses, expiresAt, description } = req.body;

  // Check if code already exists
  const existing = await ReferralCode.findOne({ code: code.toUpperCase() });
  if (existing) {
    return res.status(400).json({ message: 'Referral code already exists' });
  }

  const referralCode = await ReferralCode.create({
    code: code.toUpperCase(),
    discountType,
    discountValue,
    maxUses,
    expiresAt,
    description,
    createdBy: req.user._id
  });

  res.status(201).json(referralCode);
});

const getReferralCodes = asyncHandler(async (_req, res) => {
  const codes = await ReferralCode.find().populate('createdBy', 'name email').sort('-createdAt');
  res.json(codes);
});

const updateReferralCode = asyncHandler(async (req, res) => {
  const { isActive, maxUses, expiresAt, description } = req.body;

  const code = await ReferralCode.findByIdAndUpdate(
    req.params.id,
    { isActive, maxUses, expiresAt, description },
    { new: true }
  );

  if (!code) return res.status(404).json({ message: 'Referral code not found' });
  res.json(code);
});

const deleteReferralCode = asyncHandler(async (req, res) => {
  const code = await ReferralCode.findByIdAndDelete(req.params.id);
  if (!code) return res.status(404).json({ message: 'Referral code not found' });
  res.json({ message: 'Referral code deleted successfully' });
});

// Manual management
const getManuals = asyncHandler(async (_req, res) => {
  const manuals = await Manual.find().populate('product', 'name images').sort('-createdAt');
  res.json(manuals);
});

const createManual = asyncHandler(async (req, res) => {
  const { productId, title, tagline, intro, features, usage, care } = req.body;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  // Check if manual already exists for this product
  const existingManual = await Manual.findOne({ product: productId });
  if (existingManual) {
    return res.status(400).json({ message: 'Manual already exists for this product' });
  }

  let images = [];
  if (Array.isArray(req.files) && req.files.length) {
    if (!(cloudinaryEnabled && hasCloudinary)) {
      return res.status(500).json({ message: 'Image upload service not configured' });
    }
    const folder = `${folderPrefix}/manuals`;
    const uploadBuffer = (file) =>
      new Promise((resolve, reject) => {
        const s = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'image',
            transformation: [{ width: 1600, height: 1600, crop: 'limit' }]
          },
          (e, r) => (e ? reject(e) : resolve({ url: r.secure_url, public_id: r.public_id }))
        );
        s.end(file.buffer);
      });
    const uploaded = await Promise.all(req.files.map((f) => uploadBuffer(f)));
    images = uploaded.map((r) => ({ url: r.url, public_id: r.public_id, alt: req.body.title || 'Manual image' }));
  }
  const manual = await Manual.create({
    product: productId,
    title,
    tagline,
    intro,
    features: Array.isArray(features) ? features : (features ? features.split('\n').filter(f => f.trim()) : []),
    usage: Array.isArray(usage) ? usage : (usage ? usage.split('\n').filter(u => u.trim()) : []),
    care: Array.isArray(care) ? care : (care ? care.split('\n').filter(c => c.trim()) : []),
    images
  });

  res.status(201).json(manual);
});

const updateManual = asyncHandler(async (req, res) => {
  const { title, tagline, intro, features, usage, care, isActive } = req.body;

  const updateData = {
    title,
    tagline,
    intro,
    features: Array.isArray(features) ? features : (features ? features.split('\n').filter(f => f.trim()) : []),
    usage: Array.isArray(usage) ? usage : (usage ? usage.split('\n').filter(u => u.trim()) : []),
    care: Array.isArray(care) ? care : (care ? care.split('\n').filter(c => c.trim()) : []),
    isActive
  };

  // Add new images if uploaded
  if (Array.isArray(req.files) && req.files.length) {
    if (!(cloudinaryEnabled && hasCloudinary)) {
      return res.status(500).json({ message: 'Image upload service not configured' });
    }
    const folder = `${folderPrefix}/manuals`;
    const uploadBuffer = (file) =>
      new Promise((resolve, reject) => {
        const s = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'image',
            transformation: [{ width: 1600, height: 1600, crop: 'limit' }]
          },
          (e, r) => (e ? reject(e) : resolve({ url: r.secure_url, public_id: r.public_id }))
        );
        s.end(file.buffer);
      });
    const uploaded = await Promise.all(req.files.map((f) => uploadBuffer(f)));
    const newImages = uploaded.map((r) => ({ url: r.url, public_id: r.public_id, alt: title || 'Manual image' }));
    const currentManual = await Manual.findById(req.params.id);
    if (currentManual) {
      currentManual.images.push(...newImages);
      updateData.images = currentManual.images;
    }
  }

  const manual = await Manual.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  );

  if (!manual) return res.status(404).json({ message: 'Manual not found' });
  res.json(manual);
});

const deleteManual = asyncHandler(async (req, res) => {
  const manual = await Manual.findByIdAndDelete(req.params.id);
  if (!manual) return res.status(404).json({ message: 'Manual not found' });
  res.json({ message: 'Manual deleted successfully' });
});

const getManual = asyncHandler(async (req, res) => {
  const manual = await Manual.findById(req.params.id).populate('product', 'name images');
  if (!manual) return res.status(404).json({ message: 'Manual not found' });
  res.json(manual);
});

module.exports = {
  dashboard,
  listUsers,
  setUserBlock,
  updateUserProfile,
  listOrders,
  listProducts,
  createReferralCode,
  getReferralCodes,
  updateReferralCode,
  deleteReferralCode,
  getManuals,
  createManual,
  updateManual,
  deleteManual,
  getManual
};


