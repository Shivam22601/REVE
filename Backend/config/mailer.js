// const nodemailer = require('nodemailer');

// const emailUser = process.env.EMAIL_USER;
// const emailPass = process.env.EMAIL_PASS;
// const emailHost = process.env.EMAIL_HOST || 'smtp.gmail.com';
// const emailPort = parseInt(process.env.EMAIL_PORT || '587');

// if (!emailUser || !emailPass) {
//   module.exports = {
//     provider: 'smtp',
//     sendMail: async () => {
//       throw new Error('SMTP credentials missing. Set EMAIL_USER and EMAIL_PASS.');
//     },
//     verify: (cb) => cb && cb(new Error('SMTP credentials missing.'))
//   };
// } else {
//   const transporter = nodemailer.createTransport({
//     host: emailHost,
//     port: emailPort,
//     secure: emailPort === 465,
//     auth: {
//       user: emailUser,
//       pass: emailPass
//     },
//     connectionTimeout: 30000,
//     greetingTimeout: 30000
//   });
//   transporter.provider = 'smtp';
//   transporter.verify((err) => {
//     if (err) {
//       console.error('Email server connection failed:', err.message);
//     }
//   });
//   module.exports = transporter;
// }

const { Resend } = require("resend");

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  module.exports = {
    provider: "resend",
    sendMail: async () => {
      throw new Error("RESEND_API_KEY missing. Set it in environment variables.");
    },
    verify: () => {
      console.error("❌ Resend API key missing");
    },
  };
} else {
  const resend = new Resend(resendApiKey);

  module.exports = {
    provider: "resend",

    sendMail: async ({ to, subject, html }) => {
      try {
        const response = await resend.emails.send({
          from: "REVE <onboarding@revecult.com>", // works without domain
          to,
          subject,
          html,
        });

        return response;
      } catch (error) {
        console.error("Resend email error:", error);
        throw error;
      }
    },

    verify: async () => {
      console.log("✅ Resend configured");
    },
  };
}
