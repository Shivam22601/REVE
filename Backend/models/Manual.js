const mongoose = require('mongoose');

const manualSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: { type: String, required: true },
    tagline: { type: String, default: '' },
    intro: { type: String, default: '' },
    features: { type: [String], default: [] },
    usage: { type: [String], default: [] },
    care: { type: [String], default: [] },
    images: [{
      url: { type: String, required: true },
      public_id: { type: String, required: true },
      alt: { type: String, default: '' }
    }],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Manual', manualSchema);