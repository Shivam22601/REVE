const User = require('../models/User');
const Order = require('../models/Order');
const asyncHandler = require('../utils/asyncHandler');

const getProfile = asyncHandler(async (req, res) => {
  // Generate referral code if missing
  if (!req.user.referralCode) {
    let code;
    let exists;
    do {
      code = Math.random().toString(36).substring(2, 8).toUpperCase();
      exists = await User.findOne({ referralCode: code });
    } while (exists);
    req.user.referralCode = code;
    await req.user.save();
  }
  res.json({ user: req.user });
});

const updateProfile = asyncHandler(async (req, res) => {
  const fields = ['name', 'phone'];
  fields.forEach((field) => {
    if (req.body[field]) req.user[field] = req.body[field];
  });
  if (req.file) {
    req.user.avatar = {
      url: req.file.path || req.file.secure_url,
      publicId: req.file.filename || req.file.public_id 
    };
  }
  await req.user.save();
  res.json({ user: req.user });
});

const addAddress = asyncHandler(async (req, res) => {
  const address = req.body;
  if (address.isDefault) {
    req.user.addresses.forEach((addr) => { addr.isDefault = false; });
  }
  req.user.addresses.push(address);
  await req.user.save();
  res.status(201).json({ addresses: req.user.addresses });
});

const updateAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const address = req.user.addresses.id(addressId);
  if (!address) return res.status(404).json({ message: 'Address not found' });
  Object.assign(address, req.body);
  if (req.body.isDefault) {
    req.user.addresses.forEach((addr) => {
      addr.isDefault = addr._id.equals(addressId);
    });
  }
  await req.user.save();
  res.json({ addresses: req.user.addresses });
});

const deleteAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  req.user.addresses = req.user.addresses.filter((addr) => !addr._id.equals(addressId));
  await req.user.save();
  res.json({ addresses: req.user.addresses });
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  res.json({ orders });
});

const validateReferralCode = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const ReferralCode = require('../models/ReferralCode');

  if (!code) {
    return res.status(400).json({ message: 'Referral code is required' });
  }

  // First check for admin-generated referral codes
  const adminReferral = await ReferralCode.findOne({
    code: code.toUpperCase(),
    isActive: true,
    $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }]
  });

  if (adminReferral && (adminReferral.maxUses === null || adminReferral.usedCount < adminReferral.maxUses)) {
    const discount = adminReferral.discountType === 'percentage' 
      ? adminReferral.discountValue 
      : adminReferral.discountValue; // For fixed, show the amount
    return res.json({
      valid: true,
      type: 'admin',
      discountType: adminReferral.discountType,
      discountValue: adminReferral.discountValue,
      discount: discount
    });
  }

  // Fallback to user referral codes
  const referrer = await User.findOne({ referralCode: code.toUpperCase() });
  if (!referrer) {
    return res.status(400).json({ message: 'Invalid referral code' });
  }

  if (referrer._id.equals(req.user._id)) {
    return res.status(400).json({ message: 'Cannot use your own referral code' });
  }

  // Check if user has already used a referral code
  const existingOrder = await Order.findOne({
    user: req.user._id,
    'totals.discount': { $gt: 0 },
    status: { $ne: 'cancelled' }
  });

  if (existingOrder) {
    return res.status(400).json({ message: 'Referral code already used' });
  }

  res.json({
    valid: true,
    type: 'user',
    referrer: { name: referrer.name },
    discount: 5 // 5% discount
  });
});

module.exports = {
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  getOrders,
  validateReferralCode
};


