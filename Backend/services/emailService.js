const {
  verificationEmail,
  resetPasswordEmail,
  orderConfirmationEmail
} = require('../utils/emailTemplates');

let cachedTransporter;
const getTransporter = () => {
  if (!cachedTransporter) {
    cachedTransporter = require('../config/mailer');
  }
  return cachedTransporter;
};

const getFromEmail = () => {
  const rawFrom = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  return rawFrom && rawFrom.includes('<') ? rawFrom : `"Revecult" <${rawFrom}>`;
};

const sendVerificationEmail = async (user, otp) => {
  const mail = verificationEmail(user.name, otp);

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      to: user.email,
      from: getFromEmail(),
      subject: mail.subject,
      text: mail.text,
      html: mail.html
    });

    console.log('Verification email sent to', user.email);

    return info;
  } catch (err) {
    console.error('Failed to send verification email to', user.email, err?.message || err);
    throw err;
  }
};

const sendResetEmail = async (user, link) => {
  const mail = resetPasswordEmail(user.name, link);

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      to: user.email,
      from: getFromEmail(),
      subject: mail.subject,
      text: mail.text,
      html: mail.html
    });

    console.log('Reset password email sent to', user.email);

    return info;
  } catch (err) {
    console.error('Failed to send reset email to', user.email, err?.message || err);
    throw err;
  }
};

const sendOrderConfirmation = async (user, order) => {
  const mail = orderConfirmationEmail(user.name, order);

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      to: user.email,
      from: getFromEmail(),
      subject: mail.subject,
      text: mail.text,
      html: mail.html
    });

    console.log('Order confirmation email sent to', user.email);

    return info;
  } catch (err) {
    console.error('Failed to send order confirmation email to', user.email, err?.message || err);
    throw err;
  }
};

module.exports = {
  sendVerificationEmail,
  sendResetEmail,
  sendOrderConfirmation
};

if (require.main === module) {
  require('dotenv').config({ path: require('path').join(__dirname, '..', '.env'), quiet: true });

  const args = process.argv.slice(2);
  const getArg = (key) => {
    const idx = args.indexOf(key);
    if (idx === -1) return undefined;
    const val = args[idx + 1];
    if (!val || val.startsWith('--')) return undefined;
    return val;
  };

  const to = getArg('--to') || process.env.TEST_EMAIL_TO;
  const subject = getArg('--subject') || 'Email self-test';
  const transporter = getTransporter();
  const text = getArg('--text') || `Provider: ${transporter.provider || 'unknown'}`;
  const html = getArg('--html') || `<p>Provider: <strong>${transporter.provider || 'unknown'}</strong></p>`;

  if (!to) {
    console.error('Missing --to <email> (or set TEST_EMAIL_TO).');
    process.exit(2);
  }

  transporter
    .sendMail({
      to,
      from: getFromEmail(),
      subject,
      text,
      html
    })
    .then((info) => {
      console.log('Email self-test sent', {
        to,
        accepted: info.accepted,
        rejected: info.rejected,
        messageId: info.messageId,
        provider: transporter.provider,
        statusCode: info.statusCode
      });
      process.exit(0);
    })
    .catch((err) => {
      console.error('Email self-test failed', {
        to,
        provider: transporter.provider,
        message: err?.message || String(err)
      });
      process.exit(1);
    });
}
