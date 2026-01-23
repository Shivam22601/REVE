const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const ReferralCode = require('../models/ReferralCode');
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
  const products = await Product.find();
  res.json(products);
});

const createReferralCode = asyncHandler(async (req, res) => {
  const { code, discountType, discountValue, maxUses, expiresAt, description } = req.body;

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
  deleteReferralCode
};


