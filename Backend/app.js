const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');

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

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : '*',
    credentials: true
  })
);
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/auth', authRoutes);
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

// Serve frontend static files
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// Handle SPA routing - return index.html for any unknown route that is NOT an API route
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
    if (err) {
      next(err);
    }
  });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;


