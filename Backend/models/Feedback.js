const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, trim: true },
    ageGroup: { type: String, trim: true },
    occupation: { type: String, trim: true },
    attraction: [{ type: String, trim: true }],
    usage: [{ type: String, trim: true }],
    premiumValue: { type: String, trim: true },
    futureImprovements: { type: String, trim: true },
    discovery: [{ type: String, trim: true }],
    marketing: [{ type: String, trim: true }],
    shareCampaign: { type: String, trim: true },
    genZGrowth: { type: String, trim: true },
    emotion: [{ type: String, trim: true }],
    community: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);

