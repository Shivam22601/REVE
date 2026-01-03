const verificationEmail = (name, link) => ({
  subject: 'Verify your account',
  text: `Hi ${name || 'there'},

Thanks for signing up.
Please verify your email to activate your account:

${link}

If you did not create an account, please ignore this email.`,
  html: `
    <p>Hi ${name || 'there'},</p>
    <p>Thanks for signing up. Please verify your email to activate your account.</p>
    <p>
      <a href="${link}" style="color:#2563eb">Verify Email</a>
    </p>
    <p>If you did not create an account, please ignore this email.</p>
  `
});

const resetPasswordEmail = (name, link) => ({
  subject: 'Reset your password',
  text: `Hi ${name || 'there'},

We received a request to reset your password.

Reset your password using this link:
${link}

If you did not request this, you can safely ignore this email.`,
  html: `
    <p>Hi ${name || 'there'},</p>
    <p>We received a request to reset your password.</p>
    <p>
      <a href="${link}" style="color:#2563eb">Reset Password</a>
    </p>
    <p>If you did not request this, you can safely ignore this email.</p>
  `
});

const orderConfirmationEmail = (name, order) => ({
  subject: `Order ${order.orderNumber} confirmed`,
  text: `Hi ${name || 'there'},

Thank you for your purchase.
Your order ${order.orderNumber} is confirmed.

Total: ${order.payment?.amount}
Status: ${order.status}`,
  html: `
    <p>Hi ${name || 'there'},</p>
    <p>Thank you for your purchase. Your order <strong>${order.orderNumber}</strong> is confirmed.</p>
    <p>Total: ${order.payment?.amount}</p>
    <p>Status: ${order.status}</p>
  `
});

module.exports = {
  verificationEmail,
  resetPasswordEmail,
  orderConfirmationEmail
};
