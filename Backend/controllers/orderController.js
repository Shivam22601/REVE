const { v4: uuid } = require('uuid');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const User = require('../models/User');
const Return = require('../models/Return');
const ReferralCode = require('../models/ReferralCode');
const asyncHandler = require('../utils/asyncHandler');
const { sendOrderConfirmation } = require('../services/emailService');
const { validateReferral } = require('../utils/referralUtils');

const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, billingAddress, paymentIntentId, paymentProvider, totals, referralCode } = req.body;

  // If items not provided, fallback to cart
  let orderItems = items;
  if (!orderItems || !orderItems.length) {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || !cart.items.length) return res.status(400).json({ message: 'Cart is empty' });
    orderItems = cart.items.map((i) => ({
      product: i.product._id,
      quantity: i.quantity,
      price: i.price
    }));
  }

  // Ensure prices are synced with DB
  const recalculated = await Promise.all(
    orderItems.map(async (item) => {
      const product = await Product.findById(item.product);
      return {
        product: item.product,
        quantity: item.quantity,
        price: product.price
      };
    })
  );

  const subtotal = recalculated.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = totals?.tax || 0;
  const shipping = totals?.shipping || 0;
  let discount = totals?.discount || 0;

  // Apply referral code discount
  if (referralCode) {
    const result = await validateReferral(referralCode, req.user._id);
    
    if (result.valid) {
      if (result.type === 'admin') {
        const adminReferral = result.code;
        if (adminReferral.discountType === 'percentage') {
          discount = Math.round(subtotal * (adminReferral.discountValue / 100));
        } else {
          discount = Math.min(adminReferral.discountValue, subtotal);
        }
        // Increment usage count
        adminReferral.usedCount += 1;
        await adminReferral.save();
      } else {
        // User referral
        discount = Math.round(subtotal * 0.05); // 5% discount
      }
    }
  }

  const grandTotal = subtotal + tax + shipping - discount;

  const order = await Order.create({
    orderNumber: uuid().split('-')[0].toUpperCase(),
    user: req.user._id,
    items: recalculated,
    shippingAddress,
    billingAddress: billingAddress || shippingAddress,
    status: 'processing',
    payment: {
      provider: paymentProvider || 'stripe',
      paymentIntentId,
      amount: grandTotal,
      currency: 'usd',
      status: paymentIntentId ? 'paid' : 'pending'
    },
    totals: { subtotal, tax, shipping, discount, grandTotal }
  });

  // Attempt to send confirmation email but don't fail the order creation if email fails
  try {
    await sendOrderConfirmation(req.user, order);
  } catch (err) {
    console.error('Order confirmation email failed:', err?.message || err);
  }

  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], subtotal: 0 });

  res.status(201).json(order);
});

const getOrderHistory = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('items.product', 'name price images')
    .sort('-createdAt');
  res.json(orders);
});

const getAllOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .populate('items.product', 'name price images')
    .sort('-createdAt');
  res.json(orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

const updateOrderDetails = asyncHandler(async (req, res) => {
  const { orderNumber, totals } = req.body;
  
  const updateData = {};
  if (orderNumber) updateData.orderNumber = orderNumber;
  if (totals) updateData.totals = totals;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  ).populate('user', 'name email')
   .populate('items.product', 'name price images');

  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

const updateOrderAddress = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { shippingAddress: req.body },
    { new: true }
  ).populate('user', 'name email')
   .populate('items.product', 'name price images');

  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  
  if (!order) return res.status(404).json({ message: 'Order not found' });
  
  // Check if order can be cancelled
  if (order.status === 'delivered' || order.status === 'cancelled') {
    return res.status(400).json({ message: 'Order cannot be cancelled' });
  }
  
  order.status = 'cancelled';
  await order.save();
  
  res.json({ message: 'Order cancelled successfully', order });
});

const requestReturn = asyncHandler(async (req, res) => {
  const { items } = req.body; // items: [{ productId, quantity, reason, description }]

  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) return res.status(404).json({ message: 'Order not found' });

  if (order.status !== 'delivered') {
    return res.status(400).json({ message: 'Only delivered orders can be returned' });
  }

  // Check if return is requested within 7 days of delivery
  const deliveryDate = order.updatedAt; // Assuming updatedAt is set when status changed to delivered
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  if (deliveryDate < sevenDaysAgo) {
    return res.status(400).json({ message: 'Return requests must be made within 7 days of delivery' });
  }

  // Check if return already exists
  const existingReturn = await Return.findOne({ order: order._id });
  if (existingReturn) {
    return res.status(400).json({ message: 'Return request already exists for this order' });
  }

  // Validate items
  const returnItems = [];
  for (const item of items) {
    const orderItem = order.items.find(i => i.product.toString() === item.productId);
    if (!orderItem) {
      return res.status(400).json({ message: `Product ${item.productId} not found in order` });
    }
    if (item.quantity > orderItem.quantity) {
      return res.status(400).json({ message: `Cannot return more than ordered quantity for product ${item.productId}` });
    }
    returnItems.push({
      product: item.productId,
      quantity: item.quantity,
      reason: item.reason,
      description: item.description
    });
  }

  const returnRequest = await Return.create({
    order: order._id,
    user: req.user._id,
    items: returnItems
  });

  res.status(201).json({ message: 'Return request submitted successfully', returnRequest });
});

const getReturnRequests = asyncHandler(async (req, res) => {
  const returns = await Return.find({ user: req.user._id })
    .populate('order', 'orderNumber status totals')
    .populate('items.product', 'name price images')
    .sort('-createdAt');
  res.json(returns);
});

const getAllReturnRequests = asyncHandler(async (_req, res) => {
  const returns = await Return.find()
    .populate('order', 'orderNumber status totals')
    .populate('user', 'name email')
    .populate('items.product', 'name price images')
    .sort('-createdAt');
  res.json(returns);
});

const updateReturnStatus = asyncHandler(async (req, res) => {
  const { status, refundAmount, adminNotes } = req.body;

  const returnRequest = await Return.findById(req.params.id).populate('order');
  if (!returnRequest) return res.status(404).json({ message: 'Return request not found' });

  returnRequest.status = status;
  if (refundAmount !== undefined) returnRequest.refundAmount = refundAmount;
  if (adminNotes) returnRequest.adminNotes = adminNotes;

  // If approved, update order status
  if (status === 'approved') {
    returnRequest.order.status = 'returned';
    await returnRequest.order.save();
  }

  await returnRequest.save();

  res.json({ message: 'Return status updated successfully', returnRequest });
});

module.exports = {
  createOrder,
  getOrderHistory,
  getAllOrders,
  updateOrderStatus,
  updateOrderDetails,
  updateOrderAddress,
  cancelOrder,
  requestReturn,
  getReturnRequests,
  getAllReturnRequests,
  updateReturnStatus
};


