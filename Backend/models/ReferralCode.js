const mongoose = require('mongoose');

const referralCodeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    discountValue: { type: Number, required: true }, // e.g., 5 for 5%, or 50 for $50 off
    maxUses: { type: Number, default: null }, // null means unlimited
    usedCount: { type: Number, default: 0 },
    expiresAt: Date,
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // admin who created it
    description: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('ReferralCode', referralCodeSchema);