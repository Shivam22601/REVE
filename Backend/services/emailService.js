const transporter = require('../config/mailer');
const {
  verificationEmail,
  resetPasswordEmail,
  orderConfirmationEmail
} = require('../utils/emailTemplates');

const FROM_EMAIL = `"Revecult" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`;

const sendVerificationEmail = async (user, link) => {
  const mail = verificationEmail(user.name, link);

  try {
    const info = await transporter.sendMail({
      to: user.email,
      from: FROM_EMAIL,
      subject: mail.subject,
      text: mail.text,
      html: mail.html
    });

    console.log('Verification email sent', {
      to: user.email,
      accepted: info.accepted,
      rejected: info.rejected,
      messageId: info.messageId
    });

    return info;
  } catch (err) {
    console.error('Failed to send verification email to', user.email, err?.message || err);
    throw err;
  }
};

const sendResetEmail = async (user, link) => {
  const mail = resetPasswordEmail(user.name, link);

  try {
    const info = await transporter.sendMail({
      to: user.email,
      from: FROM_EMAIL,
      subject: mail.subject,
      text: mail.text,
      html: mail.html
    });

    console.log('Reset password email sent', {
      to: user.email,
      accepted: info.accepted,
      rejected: info.rejected,
      messageId: info.messageId
    });

    return info;
  } catch (err) {
    console.error('Failed to send reset email to', user.email, err?.message || err);
    throw err;
  }
};

const sendOrderConfirmation = async (user, order) => {
  const mail = orderConfirmationEmail(user.name, order);

  try {
    const info = await transporter.sendMail({
      to: user.email,
      from: FROM_EMAIL,
      subject: mail.subject,
      text: mail.text,
      html: mail.html
    });

    console.log('Order confirmation email sent', {
      to: user.email,
      accepted: info.accepted,
      rejected: info.rejected,
      messageId: info.messageId
    });

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
