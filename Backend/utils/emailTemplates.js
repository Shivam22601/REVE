const verificationEmail = (name, otp) => ({
  subject: 'Verify your email - OTP',
  text: `Hi ${name || 'there'},

Your verification code is: ${otp}

Please enter this code to verify your account. This code will expire in 10 minutes.

If you did not create this account, you can ignore this email.`,
  html: `
  <div style="font-family: Arial, Helvetica, sans-serif; background-color: #ffffff; padding: 40px 0;">
    <div style="max-width: 480px; margin: 0 auto; text-align: center; color: #111827;">

      <!-- Logo -->
      <div style="
        width: 56px;
        height: 56px;
        background-color: #000000;
        border-radius: 12px;
        margin: 0 auto 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="color: #ffffff; font-size: 26px;">🔐</span>
      </div>

      <!-- Title -->
      <h2 style="font-size: 22px; margin-bottom: 12px;">
        Verify your email
      </h2>

      <!-- Subtitle -->
      <p style="font-size: 15px; color: #374151; margin-bottom: 28px;">
        Use the following OTP to complete your registration procedures.
      </p>

      <!-- OTP -->
      <div style="
        background-color: #f3f4f6;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 32px;
      ">
        <span style="
          font-size: 32px;
          font-weight: 700;
          letter-spacing: 4px;
          color: #111827;
        ">${otp}</span>
      </div>

      <p style="font-size: 14px; color: #6b7280; margin-bottom: 32px;">
        This code is valid for 10 minutes.
      </p>

      <!-- Footer text -->
      <p style="font-size: 13px; color: #6b7280; line-height: 1.6; margin-top: 24px;">
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
  </div>
  `
});

const resetPasswordEmail = (name, link) => ({
  subject: 'Reset your password',
  text: `Hi ${name || 'there'},

Tap the link below to reset your password:

${link}

If you didn’t request a password reset, you can safely ignore this email.

The Team`,
  html: `
    <div style="font-family: Arial, Helvetica, sans-serif; background-color: #ffffff; padding: 40px 20px;">
      <div style="max-width: 520px; margin: 0 auto; color: #111827;">

        <h2 style="font-size: 26px; margin-bottom: 16px;">
          Reset Your Password
        </h2>

        <p style="font-size: 15px; margin-bottom: 12px;">
          Hi ${name || 'there'},
        </p>

        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 28px;">
          Tap the button below to reset your account password.
          If you didn’t request a new password, you can safely delete this email.
        </p>

        <div style="margin: 32px 0;">
          <a
            href="${link}"
            style="
              display: inline-block;
              padding: 14px 36px;
              background-color: #6b63c6;
              color: #ffffff;
              text-decoration: none;
              border-radius: 6px;
              font-size: 15px;
              font-weight: 600;
            "
          >
            Reset Password
          </a>
        </div>

        <p style="font-size: 14px; color: #374151; margin-top: 32px;">
          If that doesn’t work, copy and paste the following link into your browser:
        </p>

        <p style="font-size: 14px;">
          <a href="${link}" style="color: #2563eb; word-break: break-all;">
            ${link}
          </a>
        </p>

        <p style="font-size: 14px; margin-top: 32px;">
          The Team
        </p>

      </div>
    </div>
  `
});


const orderConfirmationEmail = (name, order) => {
  const subtotal = order.totals?.subtotal || 0;
  const deliveryCharge = order.totals?.shipping || 0;
  const gstAmount = order.totals?.tax || 0;
  const totalAmount = order.totals?.grandTotal || order.payment?.amount || 0;

  return {
    subject: `Order ${order.orderNumber} confirmed`,
    text: `Hi ${name || 'there'},

Thank you for your order.

Order Number: ${order.orderNumber}

Subtotal: ₹${subtotal}
Delivery: ₹${deliveryCharge}
GST (18%): ₹${gstAmount}

Total Paid: ₹${totalAmount}
Status: ${order.status}

We’ll notify you once your order is shipped.`,
    html: `
      <div style="font-family: Arial, Helvetica, sans-serif; background-color: #ffffff; padding: 32px;">
        <div style="max-width: 560px; margin: 0 auto; color: #111827;">

          <h2 style="margin-bottom: 12px;">Order Confirmed 🎉</h2>

          <p style="font-size: 15px;">
            Hi ${name || 'there'},
          </p>

          <p style="font-size: 15px; line-height: 1.6;">
            Thank you for your purchase. Your order has been successfully confirmed.
          </p>

          <div style="
            margin: 24px 0;
            padding: 16px;
            background-color: #f9fafb;
            border-radius: 8px;
          ">
            <p style="margin: 0 0 8px;">
              <strong>Order Number:</strong> ${order.orderNumber}
            </p>
            <p style="margin: 0;">
              <strong>Status:</strong> ${order.status}
            </p>
          </div>

          <h3 style="margin-top: 32px; margin-bottom: 12px;">
            Payment Summary
          </h3>

          <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px;">
            <tr>
              <td style="padding: 8px 0;">Subtotal</td>
              <td style="padding: 8px 0; text-align: right;">₹${subtotal}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">Delivery Charges</td>
              <td style="padding: 8px 0; text-align: right;">₹${deliveryCharge}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">GST (18%)</td>
              <td style="padding: 8px 0; text-align: right;">₹${gstAmount}</td>
            </tr>
            <tr>
              <td colspan="2">
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 8px 0;" />
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Total Paid</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold;">
                ₹${totalAmount}
              </td>
            </tr>
          </table>

          <p style="font-size: 14px; color: #374151; margin-top: 32px;">
            We’ll send you another email once your order is shipped.
          </p>

          <p style="font-size: 14px; margin-top: 24px;">
            Thanks,<br />
            The Team
          </p>

        </div>
      </div>
    `
  };
};


module.exports = {
  verificationEmail,
  resetPasswordEmail,
  orderConfirmationEmail
};
