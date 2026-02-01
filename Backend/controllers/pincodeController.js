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

// @desc    Bulk add pincodes
// @route   POST /api/pincodes/bulk
// @access  Admin
const bulkAddPincodes = asyncHandler(async (req, res) => {
  const { pincodes } = req.body; // Array of { code, city, state }

  if (!pincodes || !Array.isArray(pincodes) || pincodes.length === 0) {
    return res.status(400).json({ message: 'No pincodes provided' });
  }

  // Filter out duplicates within the input array
  const uniqueInput = Array.from(new Set(pincodes.map(p => p.code)))
    .map(code => pincodes.find(p => p.code === code));

  // Find existing pincodes to avoid duplicate key errors
  const existingCodes = await Pincode.find({ 
    code: { $in: uniqueInput.map(p => p.code) } 
  }).select('code');
  
  const existingCodeSet = new Set(existingCodes.map(p => p.code));
  
  // Filter only new pincodes
  const newPincodes = uniqueInput.filter(p => !existingCodeSet.has(p.code));

  if (newPincodes.length === 0) {
    return res.json({ message: 'All provided pincodes already exist', count: 0 });
  }

  const result = await Pincode.insertMany(newPincodes);
  res.status(201).json({ 
    message: `Successfully added ${result.length} pincodes`, 
    count: result.length,
    skipped: uniqueInput.length - result.length 
  });
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
  bulkAddPincodes,
  getPincodes,
  deletePincode
};
