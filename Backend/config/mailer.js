const nodemailer = require('nodemailer');

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const emailHost = process.env.EMAIL_HOST || 'smtp.gmail.com';
const emailPort = parseInt(process.env.EMAIL_PORT || '587');

// Log configuration (masking password) for debugging
console.log('Email Configuration:', {
  host: emailHost,
  port: emailPort,
  user: emailUser ? emailUser : 'MISSING',
  pass: emailPass ? '******' : 'MISSING'
});

const transporter = nodemailer.createTransport({
  host: emailHost,
  port: emailPort,
  secure: emailPort === 465, // true for 465, false for other ports
  auth: {
    user: emailUser,
    pass: emailPass
  }
});

// Verify SMTP connection
transporter.verify((err, success) => {
  if (err) {
    console.error('Email server connection failed:', err.message);
  } else {
    console.log('Email server ready');
  }
});

module.exports = transporter;
