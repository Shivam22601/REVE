const Pincode = require('../models/Pincode');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Verify if a pincode is serviceable
// @route   POST /api/pincodes/verify
// @access  Public
const verifyPincode = asyncHandler(async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ message: 'Pincode is required' });
  }

  const pincode = await Pincode.findOne({ code: code, isActive: true });

  if (pincode) {
    res.json({ serviceable: true, city: pincode.city, state: pincode.state });
  } else {
    res.status(400).json({ message: 'Delivery not available in this area' });
  }
});

// @desc    Add a new serviceable pincode
// @route   POST /api/pincodes
// @access  Admin
const addPincode = asyncHandler(async (req, res) => {
  const { code, city, state } = req.body;

  const exists = await Pincode.findOne({ code });
  if (exists) {
    return res.status(400).json({ message: 'Pincode already exists' });
  }

  const pincode = await Pincode.create({ code, city, state });
  res.status(201).json(pincode);
});

// @desc    Get all pincodes
// @route   GET /api/pincodes
// @access  Admin
const getPincodes = asyncHandler(async (req, res) => {
  const pincodes = await Pincode.find().sort('-createdAt');
  res.json(pincodes);
});

// @desc    Delete a pincode
// @route   DELETE /api/pincodes/:id
// @access  Admin
const deletePincode = asyncHandler(async (req, res) => {
  await Pincode.findByIdAndDelete(req.params.id);
  res.json({ message: 'Pincode removed' });
});

module.exports = {
  verifyPincode,
  addPincode,
  getPincodes,
  deletePincode
};
