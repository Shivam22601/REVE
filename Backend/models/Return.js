const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        reason: { type: String, required: true, enum: ['defective', 'wrong_item', 'not_as_described', 'changed_mind', 'other'] },
        description: String
      }
    ],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending'
    },
    refundAmount: { type: Number, default: 0 },
    adminNotes: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Return', returnSchema);