const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const bearer = req.headers.authorization;
    const token = (bearer && bearer.split(' ')[1]) || req.cookies?.accessToken;
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // Provide clear 401 responses for token issues instead of letting the global error handler return 500
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'jwt expired' });
      }
      return res.status(401).json({ message: 'Invalid token' });
    }
    const user = await User.findById(decoded.id);
    if (!user || user.isBlocked) {
      return res.status(401).json({ message: 'Invalid user' });
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin only' });
  }
  next();
};

module.exports = { auth, adminOnly };


