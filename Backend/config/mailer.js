const sgMail = require('@sendgrid/mail');

const sendgridApiKey =
  typeof process.env.SENDGRID_API_KEY === 'string'
    ? process.env.SENDGRID_API_KEY.trim()
    : '';

const fromRaw =
  typeof process.env.EMAIL_FROM === 'string'
    ? process.env.EMAIL_FROM.trim()
    : '';

if (!sendgridApiKey) {
  throw new Error('SENDGRID_API_KEY is missing');
}

if (!fromRaw) {
  throw new Error('EMAIL_FROM is missing');
}

// extract email if "Name <email@domain.com>"
const extractFrom = (from) => {
  const match = from.match(/^(?:"?([^"]*)"?\s*)?<([^>]+)>$/);
  if (match) {
    return {
      name: match[1] || undefined,
      email: match[2]
    };
  }
  return { email: from };
};

const fromParsed = extractFrom(fromRaw);

const fromDomain = fromParsed.email.split('@').pop().toLowerCase();
if (fromDomain === 'gmail.com' || fromDomain === 'googlemail.com') {
  throw new Error(
    'SendGrid does not allow gmail.com as FROM address. Use a verified domain.'
  );
}

sgMail.setApiKey(sendgridApiKey);

const transporter = {
  provider: 'sendgrid',

  sendMail: async ({ to, subject, text, html, from }) => {
    const toList = Array.isArray(to) ? to : [to];

    try {
      const [response] = await sgMail.send({
        to: toList,
        from: from ? extractFrom(from) : fromParsed,
        subject,
        text,
        html
      });

      return {
        accepted: toList,
        rejected: [],
        messageId:
          response?.headers?.['x-message-id'] ||
          response?.headers?.['x-sendgrid-message-id'],
        statusCode: response?.statusCode
      };
    } catch (err) {
      const status = err?.code || err?.response?.statusCode;
      const errors = err?.response?.body?.errors;
      const details =
        Array.isArray(errors) && errors.length
          ? JSON.stringify(errors)
          : err.message;

      throw new Error(
        `SendGrid send failed${status ? ` (${status})` : ''}: ${details}`
      );
    }
  },

  verify: (cb) => cb && cb(null, true)
};

module.exports = transporter;
