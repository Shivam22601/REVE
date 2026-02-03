const express = require('express');
const { body } = require('express-validator');
const {
  register,
  verifyEmail,
  resendOTP,
  login,
  googleLogin,
  refresh,
  logout,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 8 })
  ],
  validateRequest,
  register
);

router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOTP);

router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  validateRequest,
  login
);

router.post('/google', googleLogin);

router.post('/refresh', refresh);
router.post('/logout', logout);

router.post('/forgot-password', [body('email').isEmail()], validateRequest, forgotPassword);
router.post(
  '/reset-password',
  [body('token').notEmpty(), body('password').isLength({ min: 8 })],
  validateRequest,
  resetPassword
);

module.exports = router;


