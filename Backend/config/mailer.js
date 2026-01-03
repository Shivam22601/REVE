const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // MUST be false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify SMTP connection
transporter.verify((err, success) => {
  if (err) {
    console.error('Email server not ready:', err.message);
  } else {
    console.log('Email server ready');
  }
});

module.exports = transporter;
