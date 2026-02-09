const express = require('express');
const { body } = require('express-validator');
const { auth, adminOnly } = require('../middlewares/authMiddleware');
const upload = require('../config/upload');
const {
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
} = require('../controllers/adminController');
const {
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory
} = require('../controllers/productController');
const { updateOrderStatus, updateOrderDetails, updateOrderAddress } = require('../controllers/orderController');
const { getAllFeedback } = require('../controllers/feedbackController');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

router.use(auth, adminOnly);

router.get('/dashboard', dashboard);
router.get('/users', listUsers);
router.patch('/users/:id/block', [body('block').isBoolean()], validateRequest, setUserBlock);
router.put('/users/:id/profile', upload.single('avatar'), validateRequest, updateUserProfile);

router.get('/orders', listOrders);
router.patch('/orders/:id/status', updateOrderStatus);
router.patch('/orders/:id/details', updateOrderDetails);
router.patch('/orders/:id/address', updateOrderAddress);

router.get('/products', listProducts);
router.post(
  '/products',
  upload.array('images', 5),
  [body('name').notEmpty(), body('price').isNumeric()],
  validateRequest,
  createProduct
);
router.put('/products/:id', upload.array('images', 5), validateRequest, updateProduct);
router.delete('/products/:id', deleteProduct);
router.post('/categories', [body('name').notEmpty()], validateRequest, createCategory);

// Referral code routes
router.post('/referral-codes', [body('code').notEmpty(), body('discountValue').isNumeric()], validateRequest, createReferralCode);
router.get('/referral-codes', getReferralCodes);
router.patch('/referral-codes/:id', validateRequest, updateReferralCode);
router.delete('/referral-codes/:id', deleteReferralCode);

// Manual routes
router.get('/manuals', getManuals);
router.post('/manuals', upload.array('images', 5), [body('productId').notEmpty(), body('title').notEmpty()], validateRequest, createManual);
router.get('/manuals/:id', getManual);
router.put('/manuals/:id', upload.array('images', 5), validateRequest, updateManual);
router.delete('/manuals/:id', deleteManual);

// Feedback routes
router.get('/feedback', getAllFeedback);

module.exports = router;


