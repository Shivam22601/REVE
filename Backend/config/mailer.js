const nodemailer = require('nodemailer');

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const emailHost = process.env.EMAIL_HOST || 'smtp.gmail.com';
const emailPort = parseInt(process.env.EMAIL_PORT || '587');
const resendApiKey = process.env.RESEND_API_KEY;

console.log('Email Configuration:', {
  host: emailHost,
  port: emailPort,
  user: emailUser ? emailUser : 'MISSING',
  pass: emailPass ? '******' : 'MISSING'
});

if (resendApiKey) {
  const transporter = {
    sendMail: async (opts) => {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: opts.from,
          to: Array.isArray(opts.to) ? opts.to : [opts.to],
          subject: opts.subject,
          text: opts.text,
          html: opts.html
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error?.message || 'Email send failed');
      }
      return {
        accepted: Array.isArray(opts.to) ? opts.to : [opts.to],
        rejected: [],
        messageId: data.id
      };
    },
    verify: (cb) => cb && cb(null, true)
  };
  module.exports = transporter;
} else {
  const transporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: emailPort === 465,
    auth: {
      user: emailUser,
      pass: emailPass
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000
  });
  transporter.verify((err) => {
    if (err) {
      console.error('Email server connection failed:', err.message);
    } else {
      console.log('Email server ready');
    }
  });
  module.exports = transporter;
}
