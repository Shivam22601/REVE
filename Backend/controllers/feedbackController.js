const Feedback = require('../models/Feedback');
const asyncHandler = require('../utils/asyncHandler');

const submitFeedback = asyncHandler(async (req, res) => {
  const payload = req.body || {};
  const doc = await Feedback.create({
    name: payload.name,
    email: payload.email,
    ageGroup: payload.ageGroup,
    occupation: payload.occupation,
    attraction: Array.isArray(payload.attraction) ? payload.attraction : [],
    usage: Array.isArray(payload.usage) ? payload.usage : [],
    premiumValue: payload.premiumValue,
    futureImprovements: payload.futureImprovements,
    discovery: Array.isArray(payload.discovery) ? payload.discovery : [],
    marketing: Array.isArray(payload.marketing) ? payload.marketing : [],
    shareCampaign: payload.shareCampaign,
    genZGrowth: payload.genZGrowth,
    emotion: Array.isArray(payload.emotion) ? payload.emotion : [],
    community: payload.community
  });
  res.status(201).json({ message: 'Feedback submitted', feedback: doc });
});

const getAllFeedback = asyncHandler(async (_req, res) => {
  const items = await Feedback.find().sort('-createdAt');
  res.json(items);
});

module.exports = { submitFeedback, getAllFeedback };

