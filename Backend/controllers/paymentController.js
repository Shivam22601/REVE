const asyncHandler = require('../utils/asyncHandler');
const { createOrder, verifySignature } = require('../services/paymentService');

const createPaymentOrder = asyncHandler(async (req, res) => {
  const { amount, currency = 'INR' } = req.body;
  if (!amount) {
    console.error('Payment Error: Amount missing');
    return res.status(400).json({ message: 'Amount is required' });
  }
  
  try {
    const order = await createOrder({
      amount,
      currency,
      receipt: `rec_${Date.now()}_${req.user._id.toString().slice(-5)}`
    });
    
    res.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      key: process.env.RAZORPAY_KEY_ID // Send key to frontend
    });
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    res.status(500).json({ 
      message: error.description || error.message || 'Payment initialization failed',
      details: error.error || null 
    });
  }
});

const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
  const isValid = verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
  if (!isValid) return res.status(400).json({ message: 'Invalid signature' });
  
  res.json({ status: 'success' });
});

module.exports = { createPaymentOrder, verifyPayment };
