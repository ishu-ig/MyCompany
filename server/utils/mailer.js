require('dotenv').config();
const { Resend } = require('resend');

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  return apiKey ? new Resend(apiKey) : null;
};

const DEFAULT_FROM = process.env.RESEND_FROM || 'CareerPlacify <onboarding@resend.dev>';
const SITE_NAME = process.env.SITE_NAME || 'CareerPlacify';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

/**
 * Base email dispatch function using Resend
 */
const sendEmail = async ({ to, subject, html, text, from }) => {
  try {
    const recipients = Array.isArray(to) ? to : [to];
    const client = getResendClient();
    const sender = from || DEFAULT_FROM;

    if (!client) {
      console.log(
        `\x1b[33m[Resend Notice]\x1b[0m RESEND_API_KEY not set in .env. ` +
        `Simulating email to \x1b[36m${recipients.join(', ')}\x1b[0m | Subject: "\x1b[32m${subject}\x1b[0m"`
      );
      return { id: 'simulated_resend_' + Date.now(), simulated: true };
    }

    const { data, error } = await client.emails.send({
      from: sender,
      to: recipients,
      subject,
      html: html || (text ? `<p>${text}</p>` : ''),
      text: text || '',
    });

    if (error) {
      console.error(`\x1b[31m[Resend Error]\x1b[0m Failed to send email to ${recipients.join(', ')}:`, error);
      return null;
    }

    console.log(`\x1b[32m[Resend Success]\x1b[0m 📧 Email dispatched to ${recipients.join(', ')} (ID: ${data.id})`);
    return data;
  } catch (err) {
    console.error(`\x1b[31m[Resend Exception]\x1b[0m Error sending email:`, err.message);
    return null;
  }
};

/**
 * Email Templates & Specialized Senders
 */

// 1. Welcome / Registration Email
const sendWelcomeEmail = async ({ name, email, role = 'candidate' }) => {
  const subject = `Welcome to CareerPlacify, ${name}! 🚀`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #4f46e5; margin: 0; font-size: 28px;">Career<span style="color: #06b6d4;">Placify</span></h1>
        <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Placement & Non-IT Training Platform</p>
      </div>
      <div style="color: #334155; line-height: 1.6;">
        <p style="font-size: 16px;">Hi <strong>${name}</strong>,</p>
        <p>Welcome to <strong>CareerPlacify</strong>! Your account has been registered successfully as a <strong>${role.toUpperCase()}</strong>.</p>
        <p>You can now explore top curated Non-IT career programs in Business Development, HR, and Sales, apply for verified jobs, and accelerate your placement journey.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${CLIENT_URL}/dashboard" style="background: linear-gradient(135deg, #4f46e5, #06b6d4); color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Go to Dashboard</a>
        </div>
        <p style="font-size: 13px; color: #94a3b8;">If you didn't create this account, please ignore this email or contact support.</p>
      </div>
    </div>
  `;
  return sendEmail({ to: email, subject, html });
};

// 2. Password Reset Email
const sendPasswordResetEmail = async ({ name, email, resetUrl }) => {
  const subject = `Password Reset Request - CareerPlacify`;
  const actionUrl = resetUrl || `${CLIENT_URL}/reset-password`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #4f46e5; margin: 0; font-size: 28px;">Career<span style="color: #06b6d4;">Placify</span></h1>
      </div>
      <div style="color: #334155; line-height: 1.6;">
        <p style="font-size: 16px;">Hello <strong>${name || 'User'}</strong>,</p>
        <p>We received a request to reset your password for your CareerPlacify account.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${actionUrl}" style="background-color: #ef4444; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="font-size: 13px; color: #64748b;">This link will expire soon. If you didn't request a password reset, you can safely ignore this email.</p>
      </div>
    </div>
  `;
  return sendEmail({ to: email, subject, html });
};

// 3. Job Application Received Email
const sendApplicationReceivedEmail = async ({ applicantName, applicantEmail, jobTitle, companyName }) => {
  const subject = `Application Received: ${jobTitle} at ${companyName || 'CareerPlacify Partner'}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #4f46e5; margin-top: 0;">Application Submitted! ✅</h2>
      <p style="color: #334155; font-size: 15px; line-height: 1.6;">
        Dear <strong>${applicantName}</strong>,<br/><br/>
        Your application for <strong>${jobTitle}</strong> with <strong>${companyName || 'our hiring partner'}</strong> has been received and forwarded to the recruitment team.
      </p>
      <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4f46e5;">
        <p style="margin: 4px 0; color: #1e293b;"><strong>Position:</strong> ${jobTitle}</p>
        <p style="margin: 4px 0; color: #1e293b;"><strong>Status:</strong> Under Review</p>
      </div>
      <p style="font-size: 14px; color: #64748b;">We will notify you once your application status is updated.</p>
    </div>
  `;
  return sendEmail({ to: applicantEmail, subject, html });
};

// 4. Interview Scheduled Email
const sendInterviewScheduledEmail = async ({
  candidateName,
  candidateEmail,
  jobTitle,
  interviewType = 'HR Round',
  scheduledDate,
  scheduledTime,
  meetingLink,
}) => {
  const subject = `Interview Invitation: ${interviewType} for ${jobTitle || 'Career Opportunity'}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #4f46e5; margin-top: 0;">Interview Scheduled 📅</h2>
      <p style="color: #334155; font-size: 15px; line-height: 1.6;">
        Dear <strong>${candidateName}</strong>,<br/><br/>
        You have been invited for a <strong>${interviewType}</strong> interview for <strong>${jobTitle || 'the position'}</strong>.
      </p>
      <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #06b6d4;">
        <p style="margin: 4px 0; color: #1e293b;"><strong>Round:</strong> ${interviewType}</p>
        <p style="margin: 4px 0; color: #1e293b;"><strong>Date:</strong> ${scheduledDate}</p>
        <p style="margin: 4px 0; color: #1e293b;"><strong>Time:</strong> ${scheduledTime}</p>
        ${meetingLink ? `<p style="margin: 4px 0; color: #1e293b;"><strong>Meeting Link:</strong> <a href="${meetingLink}" style="color: #4f46e5;">${meetingLink}</a></p>` : ''}
      </div>
      ${meetingLink ? `
        <div style="text-align: center; margin: 24px 0;">
          <a href="${meetingLink}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Join Interview</a>
        </div>
      ` : ''}
      <p style="font-size: 13px; color: #64748b;">Please ensure you have a stable internet connection and are in a quiet environment 5 minutes prior to start time.</p>
    </div>
  `;
  return sendEmail({ to: candidateEmail, subject, html });
};

// 5. Certificate Issued Email
const sendCertificateIssuedEmail = async ({
  candidateName,
  candidateEmail,
  courseTitle,
  certificateNumber,
  verificationCode,
}) => {
  const subject = `Congratulations! Your Certificate is Ready 🎓 - CareerPlacify`;
  const verificationUrl = `${CLIENT_URL}/verify-certificate?code=${verificationCode}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #4f46e5; margin-top: 0;">Certificate of Completion 🎓</h2>
      <p style="color: #334155; font-size: 15px; line-height: 1.6;">
        Dear <strong>${candidateName}</strong>,<br/><br/>
        Congratulations on successfully completing <strong>${courseTitle}</strong>! Your verified credential has been issued.
      </p>
      <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
        <p style="margin: 4px 0; color: #1e293b;"><strong>Course:</strong> ${courseTitle}</p>
        <p style="margin: 4px 0; color: #1e293b;"><strong>Certificate No:</strong> ${certificateNumber}</p>
        <p style="margin: 4px 0; color: #1e293b;"><strong>Verification Code:</strong> <span style="font-family: monospace; font-weight: bold; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${verificationCode}</span></p>
      </div>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${verificationUrl}" style="background-color: #10b981; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verify & View Certificate</a>
      </div>
    </div>
  `;
  return sendEmail({ to: candidateEmail, subject, html });
};

const ADMIN_NOTIFY_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || 'careerplacify@gmail.com';

// 6. Contact Form Confirmation (to applicant)
const sendContactInquiryConfirmation = async ({ name, email, service }) => {
  const subject = `Inquiry Received - CareerPlacify Team`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #4f46e5; margin-top: 0;">Thank you for contacting CareerPlacify</h2>
      <p style="color: #334155; font-size: 15px; line-height: 1.6;">
        Hi <strong>${name}</strong>,<br/><br/>
        We have received your enquiry regarding <strong>${service || 'our placement & training programs'}</strong>.
        Our partnership & counseling team will review your details and connect with you within 24 business hours.
      </p>
      <p style="font-size: 13px; color: #64748b; margin-top: 24px;">Warm regards,<br/>Team CareerPlacify</p>
    </div>
  `;
  return sendEmail({ to: email, subject, html });
};

// 7. Contact Form Admin Alert (Sent directly to careerplacify@gmail.com)
const sendContactInquiryAdminAlert = async ({
  name,
  email,
  phone,
  organization,
  roleType,
  service,
  subject,
  message,
}) => {
  const emailSubject = `🔥 New Lead Inquiry: ${name} (${organization || service || 'General'})`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="border-bottom: 2px solid #4f46e5; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #1e1b4b; margin: 0;">New Website Inquiry 📥</h2>
        <p style="color: #64748b; font-size: 13px; margin: 4px 0 0;">Received via CareerPlacify Contact Form</p>
      </div>
      
      <div style="background-color: #f8fafc; padding: 18px; border-radius: 10px; margin-bottom: 20px;">
        <table style="width: 100%; font-size: 14px; line-height: 1.8; color: #334155;">
          <tr><td style="width: 150px; font-weight: bold; color: #64748b;">Full Name:</td><td><strong>${name}</strong></td></tr>
          <tr><td style="font-weight: bold; color: #64748b;">Email Address:</td><td><a href="mailto:${email}" style="color: #4f46e5; font-weight: bold;">${email}</a></td></tr>
          <tr><td style="font-weight: bold; color: #64748b;">Phone Number:</td><td>${phone || 'Not provided'}</td></tr>
          <tr><td style="font-weight: bold; color: #64748b;">Organization / College:</td><td>${organization || 'Not provided'}</td></tr>
          <tr><td style="font-weight: bold; color: #64748b;">User Type:</td><td><span style="background: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 12px;">${roleType || 'Corporate / General'}</span></td></tr>
          <tr><td style="font-weight: bold; color: #64748b;">Service / Interest:</td><td>${service || 'General Inquiry'}</td></tr>
        </table>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="color: #1e293b; font-size: 15px; margin-bottom: 8px;">Message / Requirements:</h3>
        <div style="background-color: #f1f5f9; padding: 16px; border-radius: 8px; color: #1e293b; font-size: 14px; line-height: 1.6; white-space: pre-line; border-left: 4px solid #4f46e5;">
          ${message}
        </div>
      </div>

      <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
        <a href="mailto:${email}?subject=Re: CareerPlacify Inquiry - ${encodeURIComponent(name)}" style="background-color: #4f46e5; color: #ffffff; padding: 10px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 13px;">Reply to Lead Directly</a>
      </div>
    </div>
  `;
  return sendEmail({ to: ADMIN_NOTIFY_EMAIL, subject: emailSubject, html });
};

// 8. Application Admin Alert (Sent directly to careerplacify@gmail.com)
const sendApplicationAdminAlert = async ({
  applicantName,
  applicantEmail,
  phone,
  highestEducation,
  targetTrack,
  resumeLink,
  type = 'Bootcamp',
}) => {
  const emailSubject = `🎓 New ${type} Application: ${applicantName} (${targetTrack})`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="border-bottom: 2px solid #06b6d4; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #1e1b4b; margin: 0;">New Candidate Application 🎓</h2>
        <p style="color: #64748b; font-size: 13px; margin: 4px 0 0;">Received via CareerPlacify Candidate Portal</p>
      </div>

      <div style="background-color: #f8fafc; padding: 18px; border-radius: 10px; margin-bottom: 20px;">
        <table style="width: 100%; font-size: 14px; line-height: 1.8; color: #334155;">
          <tr><td style="width: 150px; font-weight: bold; color: #64748b;">Candidate Name:</td><td><strong>${applicantName}</strong></td></tr>
          <tr><td style="font-weight: bold; color: #64748b;">Email:</td><td><a href="mailto:${applicantEmail}" style="color: #06b6d4; font-weight: bold;">${applicantEmail}</a></td></tr>
          <tr><td style="font-weight: bold; color: #64748b;">Phone:</td><td>${phone || 'Not provided'}</td></tr>
          <tr><td style="font-weight: bold; color: #64748b;">Highest Education:</td><td>${highestEducation || 'Graduate'}</td></tr>
          <tr><td style="font-weight: bold; color: #64748b;">Target Track:</td><td><span style="background: #cffafe; color: #155e75; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 12px;">${targetTrack}</span></td></tr>
          ${resumeLink ? `<tr><td style="font-weight: bold; color: #64748b;">Resume Link:</td><td><a href="${resumeLink}" target="_blank" style="color: #4f46e5; font-weight: bold;">View Resume ↗</a></td></tr>` : ''}
        </table>
      </div>

      <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
        <a href="mailto:${applicantEmail}?subject=CareerPlacify Bootcamp Application - ${encodeURIComponent(applicantName)}" style="background-color: #06b6d4; color: #ffffff; padding: 10px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 13px;">Contact Candidate</a>
      </div>
    </div>
  `;
  return sendEmail({ to: ADMIN_NOTIFY_EMAIL, subject: emailSubject, html });
};

module.exports = {
  getResendClient,
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendApplicationReceivedEmail,
  sendInterviewScheduledEmail,
  sendCertificateIssuedEmail,
  sendContactInquiryConfirmation,
  sendContactInquiryAdminAlert,
  sendApplicationAdminAlert,
};
