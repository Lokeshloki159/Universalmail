/* UniversalMail — Nodemailer Transport & Email Dispatch */

import nodemailer from 'nodemailer';
import { getUser } from './db.js';

const TRACKING_BASE = process.env.TRACKING_BASE_URL || 'https://universalmail.onrender.com';

/**
 * Build a Nodemailer transport from user SMTP settings or env defaults.
 */
function createTransport(smtpConfig = {}) {
  const host = smtpConfig.smtp_host || process.env.SMTP_HOST || 'smtp.ethereal.email';
  const port = smtpConfig.smtp_port || parseInt(process.env.SMTP_PORT || '587');
  const secure = smtpConfig.smtp_secure === 1 || process.env.SMTP_SECURE === 'true';
  const user = smtpConfig.smtp_user || process.env.SMTP_USER || '';
  const pass = smtpConfig.smtp_pass || process.env.SMTP_PASS || '';

  if (!user || !pass) {
    console.log('[Mailer] No SMTP credentials configured — using Ethereal test account');
    return null; // Will be created on-demand with Ethereal
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

/**
 * Create an Ethereal test account on-demand for development/demo.
 */
async function getEtherealTransport() {
  const testAccount = await nodemailer.createTestAccount();
  console.log('[Mailer] Ethereal test account created:', testAccount.user);
  return {
    transport: nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    }),
    testAccount,
  };
}

/**
 * Inject a 1x1 tracking pixel into the HTML body.
 */
function injectTrackingPixel(htmlBody, trackingId) {
  const pixelUrl = `${TRACKING_BASE}/track/${trackingId}`;
  const pixel = `<img src="${pixelUrl}" width="1" height="1" alt="" style="display:none;width:1px;height:1px;border:0;" />`;
  
  if (htmlBody.includes('</body>')) {
    return htmlBody.replace('</body>', `${pixel}</body>`);
  }
  return htmlBody + pixel;
}

/**
 * Send a single email. Returns { success, messageId, previewUrl, error }.
 */
export async function sendEmail(emailRecord) {
  // Load user SMTP settings
  const user = getUser(emailRecord.user_id || 1);
  let transport = createTransport(user || {});
  let previewUrl = null;

  // Fallback to Ethereal for demo/testing
  if (!transport) {
    const ethereal = await getEtherealTransport();
    transport = ethereal.transport;
  }

  // Build HTML body with tracking pixel
  let htmlBody = emailRecord.html_body || emailRecord.body || '';
  if (!htmlBody.includes('<html')) {
    htmlBody = `<html><body>${htmlBody}</body></html>`;
  }
  
  if (emailRecord.tracking_id) {
    htmlBody = injectTrackingPixel(htmlBody, emailRecord.tracking_id);
  }

  const fromAddress = (user && user.smtp_from) || process.env.SMTP_FROM || 'noreply@universalmail.local';

  try {
    const info = await transport.sendMail({
      from: `"UniversalMail" <${fromAddress}>`,
      to: emailRecord.recipient,
      subject: emailRecord.subject || '(No Subject)',
      text: emailRecord.body || '',
      html: htmlBody,
    });

    previewUrl = nodemailer.getTestMessageUrl(info) || null;

    console.log(`[Mailer] Email sent: ${info.messageId}`);
    if (previewUrl) {
      console.log(`[Mailer] Preview URL: ${previewUrl}`);
    }

    return { success: true, messageId: info.messageId, previewUrl, error: null };
  } catch (err) {
    console.error(`[Mailer] Send failed:`, err.message);
    return { success: false, messageId: null, previewUrl: null, error: err.message };
  }
}

export default { sendEmail };
