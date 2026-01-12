const emailProvider = typeof process.env.EMAIL_PROVIDER === 'string' ? process.env.EMAIL_PROVIDER.trim().toLowerCase() : '';
const sendgridApiKey = typeof process.env.SENDGRID_API_KEY === 'string' ? process.env.SENDGRID_API_KEY.trim() : '';
const resendApiKey = typeof process.env.RESEND_API_KEY === 'string' ? process.env.RESEND_API_KEY.trim() : '';

const rawFrom = typeof process.env.EMAIL_FROM === 'string' ? process.env.EMAIL_FROM.trim() : (typeof process.env.EMAIL_USER === 'string' ? process.env.EMAIL_USER.trim() : '');
const fromEmail = rawFrom.includes('<') ? (rawFrom.match(/<([^>]+)>/)?.[1] || '').trim() : rawFrom;
const fromDomain = fromEmail.includes('@') ? fromEmail.split('@').pop().toLowerCase() : '';
const dmarcSensitiveFromDomain = fromDomain === 'gmail.com' || fromDomain === 'googlemail.com';
const hasSmtpCreds = Boolean(process.env.EMAIL_USER) && Boolean(process.env.EMAIL_PASS);

const autoPreferSmtp = !emailProvider && dmarcSensitiveFromDomain && hasSmtpCreds;
const wantSendgrid = emailProvider ? emailProvider === 'sendgrid' : Boolean(sendgridApiKey) && !autoPreferSmtp;
const wantResend = emailProvider ? emailProvider === 'resend' : !autoPreferSmtp && !wantSendgrid && Boolean(resendApiKey);
const wantSmtp = emailProvider ? emailProvider === 'smtp' : autoPreferSmtp || (!wantSendgrid && !wantResend);

if (wantSendgrid) {
  if (!sendgridApiKey) {
    throw new Error('EMAIL_PROVIDER=sendgrid but SENDGRID_API_KEY is missing.');
  }
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(sendgridApiKey);

  const formatSendgridError = (err) => {
    const status = err?.code || err?.response?.statusCode;
    const errors = err?.response?.body?.errors;
    const details = Array.isArray(errors) && errors.length ? JSON.stringify(errors) : null;
    const msg = details || err?.message || 'Unknown error';
    return `SendGrid send failed${status ? ` (${status})` : ''}: ${msg}`;
  };

  const parseFrom = (from) => {
    if (!from) return null;
    if (typeof from === 'object' && from.email) {
      return { email: String(from.email).trim(), name: from.name ? String(from.name).trim() : undefined };
    }
    const raw = String(from).trim();
    const match = raw.match(/^(?:"?([^"]*)"?\s*)?<([^>]+)>$/);
    if (match) {
      const name = match[1] ? match[1].trim() : undefined;
      const email = match[2] ? match[2].trim() : '';
      return { email, name };
    }
    return { email: raw };
  };

  const transporter = {
    provider: 'sendgrid',
    sendMail: async (opts) => {
      const to = Array.isArray(opts.to) ? opts.to : [opts.to];
      const from = parseFrom(opts.from);
      if (!from?.email) {
        throw new Error('SendGrid requires a valid from email. Set EMAIL_FROM to a verified sender.');
      }

      let res;
      try {
        [res] = await sgMail.send({
          to,
          from,
          subject: opts.subject,
          text: opts.text,
          html: opts.html
        });
      } catch (err) {
        throw new Error(formatSendgridError(err));
      }

      return {
        accepted: to,
        rejected: [],
        messageId: res?.headers?.['x-message-id'] || res?.headers?.['x-sendgrid-message-id'],
        statusCode: res?.statusCode
      };
    },
    verify: (cb) => cb && cb(null, true)
  };

  module.exports = transporter;
} else if (wantResend) {
  if (!resendApiKey) {
    throw new Error('EMAIL_PROVIDER=resend but RESEND_API_KEY is missing.');
  }
  const transporter = {
    provider: 'resend',
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
        messageId: data.id,
        statusCode: res.status
      };
    },
    verify: (cb) => cb && cb(null, true)
  };
  module.exports = transporter;
} else if (wantSmtp) {
  const nodemailer = require('nodemailer');

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const emailHost = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const emailPort = parseInt(process.env.EMAIL_PORT || '587');

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
    }
  });
  transporter.provider = 'smtp';
  module.exports = transporter;
} else {
  throw new Error(`Invalid EMAIL_PROVIDER: ${emailProvider}`);
}
