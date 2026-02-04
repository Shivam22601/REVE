const express = require('express');
const { body } = require('express-validator');
const { createPaymentOrder, verifyPayment } = require('../controllers/paymentController');
const { auth } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

router.post(
  '/order',
  auth,
  [body('amount').isFloat({ gt: 0 })],
  validateRequest,
  createPaymentOrder
);

router.post('/verify', auth, verifyPayment);

module.exports = router;
