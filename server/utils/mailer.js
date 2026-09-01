const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || process.env.MAIL_SENDER,
    pass: process.env.SMTP_PASS || process.env.MAIL_PASSWORD,
  },
});

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    if (!process.env.MAIL_SENDER || !process.env.MAIL_PASSWORD) {
      console.log(`[Mail Simulation] To: ${to} | Subject: ${subject}`);
      return { messageId: 'simulated-id' };
    }

    const info = await transporter.sendMail({
      from: `"${process.env.SITE_NAME || 'Placement & Training Platform'}" <${process.env.MAIL_SENDER}>`,
      to,
      subject,
      text: text || '',
      html: html || '',
    });

    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`⚠️ Email sending failed to ${to}:`, error.message);
    return null;
  }
};

module.exports = {
  sendEmail,
};
