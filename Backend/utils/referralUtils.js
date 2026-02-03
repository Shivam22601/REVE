const ReferralCode = require('../models/ReferralCode');
const User = require('../models/User');
const Order = require('../models/Order');

const validateReferral = async (code, userId) => {
  if (!code) return { valid: false, message: 'Referral code is required' };

  const cleanCode = code.toUpperCase().trim();

  // 1. Check Admin Codes
  const adminCode = await ReferralCode.findOne({ code: cleanCode });
  
  if (adminCode) {
    if (!adminCode.isActive) {
      return { valid: false, message: 'This referral code is inactive' };
    }
    if (adminCode.expiresAt && adminCode.expiresAt < new Date()) {
      return { valid: false, message: 'This referral code has expired' };
    }
    if (adminCode.maxUses !== null && adminCode.usedCount >= adminCode.maxUses) {
      return { valid: false, message: 'This referral code usage limit has been reached' };
    }
    
    return { 
      valid: true, 
      type: 'admin', 
      code: adminCode,
      discountValue: adminCode.discountValue,
      discountType: adminCode.discountType
    };
  }

  // 2. Check User Codes
  const referrer = await User.findOne({ referralCode: cleanCode });
  
  if (!referrer) {
    return { valid: false, message: 'Invalid referral code' };
  }

  if (userId && referrer._id.equals(userId)) {
    return { valid: false, message: 'Cannot use your own referral code' };
  }

  // Check if user has already used a referral code
  if (userId) {
    const existingOrder = await Order.findOne({
      user: userId,
      'totals.discount': { $gt: 0 },
      status: { $ne: 'cancelled' }
    });

    if (existingOrder) {
      return { valid: false, message: 'Referral code already used on a previous order' };
    }
  }

  return { 
    valid: true, 
    type: 'user', 
    referrer,
    discountValue: 5, // 5% discount for user referrals
    discountType: 'percentage'
  };
};

module.exports = { validateReferral };
