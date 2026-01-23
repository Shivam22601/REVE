const express = require('express');
const { body } = require('express-validator');
const {
  createOrder,
  getOrderHistory,
  getAllOrders,
  updateOrderStatus,
  requestReturn,
  getReturnRequests,
  getAllReturnRequests,
  updateReturnStatus
} = require('../controllers/orderController');
const { auth, adminOnly } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

router.post(
  '/',
  auth,
  [body('items').optional().isArray()],
  validateRequest,
  createOrder
);
router.get('/', auth, getOrderHistory);

router.get('/admin/all', auth, adminOnly, getAllOrders);
router.patch('/:id/status', auth, adminOnly, updateOrderStatus);

// Return routes
router.post('/:id/return', auth, [body('items').isArray()], validateRequest, requestReturn);
router.get('/returns', auth, getReturnRequests);
router.get('/admin/returns', auth, adminOnly, getAllReturnRequests);
router.patch('/returns/:id/status', auth, adminOnly, updateReturnStatus);

module.exports = router;


