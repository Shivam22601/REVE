const User = require('../models/User');
const Order = require('../models/Order');
const asyncHandler = require('../utils/asyncHandler');

const getProfile = asyncHandler(async (req, res) => {
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

module.exports = {
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  getOrders
};


