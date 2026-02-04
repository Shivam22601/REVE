const Razorpay = require('razorpay');
const crypto = require('crypto');

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

const razorpay = (key_id && key_secret) ? new Razorpay({ key_id, key_secret }) : null;

const createOrder = async ({ amount, currency = 'INR', receipt }) => {
  if (!razorpay) throw new Error('Razorpay not configured');
  return razorpay.orders.create({
    amount: Math.round(amount * 100), // Razorpay expects paisa
    currency,
    receipt,
    payment_capture: 1
  });
};

const verifySignature = (orderId, paymentId, signature) => {
  if (!key_secret) throw new Error('Razorpay secret not configured');
  const hmac = crypto.createHmac('sha256', key_secret);
  hmac.update(orderId + "|" + paymentId);
  const generatedSignature = hmac.digest('hex');
  return generatedSignature === signature;
};

module.exports = { createOrder, verifySignature };
