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
