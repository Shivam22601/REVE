const express = require('express');
const { body } = require('express-validator');
const {
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  getOrders,
  validateReferralCode
} = require('../controllers/userController');
const { cancelOrder } = require('../controllers/orderController');
const { auth } = require('../middlewares/authMiddleware');
const upload = require('../config/upload');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

router.get('/me', auth, getProfile);
router.put(
  '/me',
  auth,
  upload.single('avatar'),
  [body('name').optional().isString()],
  validateRequest,
  updateProfile
);

router.post(
  '/addresses',
  auth,
  [body('line1').notEmpty(), body('city').notEmpty(), body('country').notEmpty()],
  validateRequest,
  addAddress
);
router.put(
  '/addresses/:addressId',
  auth,
  [body('line1').optional(), body('city').optional()],
  validateRequest,
  updateAddress
);
router.delete('/addresses/:addressId', auth, deleteAddress);

router.get('/orders', auth, getOrders);

router.post('/validate-referral', auth, validateReferralCode);

router.patch('/orders/:id/cancel', auth, cancelOrder);

module.exports = router;


