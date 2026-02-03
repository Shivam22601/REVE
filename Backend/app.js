const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');
// Payment routes - optional
let paymentRoutes;
try {
  paymentRoutes = require('./routes/paymentRoutes');
} catch (error) {
  console.warn('Payment routes not available:', error.message);
  paymentRoutes = express.Router(); // Empty router
}
const adminRoutes = require('./routes/adminRoutes');
const pincodeRoutes = require('./routes/pincodeRoutes');

const app = express();

app.set('trust proxy', parseInt(process.env.TRUST_PROXY_HOPS || '1', 10));

app.use(
  cors({
    origin: true, // Allow all origins temporarily for testing
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
  })
);
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const apiRateWindowMs = parseInt(process.env.API_RATE_WINDOW_MS || `${15 * 60 * 1000}`, 10);
const apiRateMax = parseInt(process.env.API_RATE_MAX || '1000', 10);
const apiLimiter = rateLimit({
  windowMs: apiRateWindowMs,
  max: apiRateMax,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', apiLimiter);

const authRateWindowMs = parseInt(process.env.AUTH_RATE_WINDOW_MS || `${60 * 1000}`, 10);
const authRateMax = parseInt(process.env.AUTH_RATE_MAX || '10', 10);
const authLimiter = rateLimit({
  windowMs: authRateWindowMs,
  max: authRateMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many auth attempts, please try again later' }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
// Payment routes - only use if available
if (paymentRoutes) {
  app.use('/api/payments', paymentRoutes);
}
app.use('/api/admin', adminRoutes);
app.use('/api/pincodes', pincodeRoutes);

const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath, { maxAge: '1d', etag: true, immutable: true }));

app.get(/^(?!\/api).*/, (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(frontendPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    return next();
  }
  res.sendFile(indexPath, (err) => {
    if (err) next(err);
  });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;


