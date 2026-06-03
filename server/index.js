/* UniversalMail — Express API Server + Background Scheduler */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';
import {
  getDb, getUser, updateUser,
  getTemplates, addTemplate, deleteTemplate,
  getScheduledEmails, addScheduledEmail, updateScheduledEmail, deleteScheduledEmail, getPendingEmails,
  getTrackingEvents, addTrackingEvent,
  getSnoozedEmails, addSnoozedEmail, unsnoozeEmail, getDueSnoozes,
  getStats,
  getUserPlanCount, updateUserPlan,
} from './db.js';
import { sendEmail } from './mailer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = parseInt(process.env.PORT || '3000');
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

// ─── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '5mb' }));

// ─── 1x1 transparent GIF for open tracking ───────────────────
const TRACKING_PIXEL = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

// ─── Health Check ─────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now(), version: '1.0.0' });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  TRACKING PIXEL ENDPOINT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
app.get('/track/:trackingId', (req, res) => {
  const { trackingId } = req.params;

  try {
    const emails = getScheduledEmails();
    const email = emails.find((e) => e.tracking_id === trackingId);

    addTrackingEvent({
      tracking_id: trackingId,
      email_id: email?.id || '',
      recipient: email?.recipient || '',
      subject: email?.subject || '',
      ip_address: req.ip || req.headers['x-forwarded-for'] || '',
      user_agent: req.headers['user-agent'] || '',
    });

    console.log(`[Track] Open detected: ${trackingId} from ${req.ip}`);
  } catch (err) {
    console.error('[Track] Error logging:', err.message);
  }

  res.set({
    'Content-Type': 'image/gif',
    'Content-Length': TRACKING_PIXEL.length,
    'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    'Pragma': 'no-cache',
    'Expires': '0',
  });
  res.end(TRACKING_PIXEL);
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  BILLING & SUBSCRIPTION API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
app.get('/api/billing/checkout', async (req, res) => {
  const host = req.get('host');
  // Use http or https depending on proxy headers
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const baseUrl = `${protocol}://${host}`;

  const user = getUser(1);

  if (stripe) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: process.env.STRIPE_PRICE_ID || 'price_12345',
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${baseUrl}/api/billing/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/billing/cancel`,
        customer_email: user.email,
      });
      return res.redirect(session.url);
    } catch (err) {
      console.error('[Stripe] Error creating session:', err.message);
    }
  }

  // Fallback to simulator
  console.log('[Stripe] No STRIPE_SECRET_KEY, using Checkout Simulator');
  const mockSessionId = `mock-stripe-sess-${Date.now()}`;
  res.redirect(`/billing/checkout-simulator?session_id=${mockSessionId}`);
});

app.get('/billing/checkout-simulator', (req, res) => {
  const filePath = path.join(__dirname, 'checkout-simulator.html');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Checkout simulator page not found.');
  }
});

app.get('/api/billing/success', (req, res) => {
  const { session_id } = req.query;

  updateUserPlan(1, 'pro');
  console.log(`[Billing] User upgraded successfully to PRO. Session: ${session_id}`);

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Successful — UniversalMail</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Outfit', sans-serif;
          background: radial-gradient(circle at top right, #1e1b4b, #0f172a 70%);
          color: #e2e8f0;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        .success-card {
          background: rgba(30, 41, 59, 0.4);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          width: 100%;
          max-width: 440px;
          padding: 40px 32px;
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
          text-align: center;
        }
        .icon-container {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.1);
          border: 2px solid #10b981;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: #10b981;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
          animation: pulse 2s infinite;
        }
        .icon-container svg {
          width: 36px;
          height: 36px;
        }
        h1 {
          font-size: 24px;
          font-weight: 700;
          color: #f8fafc;
          margin-bottom: 12px;
        }
        p {
          font-size: 14px;
          color: #94a3b8;
          line-height: 1.6;
          margin-bottom: 30px;
        }
        .pro-badge {
          display: inline-block;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          font-weight: 700;
          font-size: 12px;
          padding: 4px 12px;
          border-radius: 20px;
          margin-bottom: 16px;
          box-shadow: 0 0 12px rgba(99, 102, 241, 0.4);
        }
        .btn-return {
          display: inline-block;
          width: 100%;
          background: #1e293b;
          border: 1px solid #334155;
          color: #e2e8f0;
          text-decoration: none;
          padding: 12px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s;
        }
        .btn-return:hover {
          background: #334155;
          border-color: #475569;
        }
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      </style>
    </head>
    <body>
      <div class="success-card">
        <div class="pro-badge">PRO PLAN ACTIVE</div>
        <div class="icon-container">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h1>Payment Successful!</h1>
        <p>Thank you for subscribing to UniversalMail Pro. Your plan has been upgraded. You can now close this window and return to the extension.</p>
        <a href="#" onclick="window.close(); return false;" class="btn-return">Close Window</a>
      </div>
    </body>
    </html>
  `);
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  TEMPLATES API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
app.get('/api/templates', (req, res) => {
  const templates = getTemplates();
  res.json({ templates: [...templates].reverse() });
});

app.post('/api/templates', (req, res) => {
  const { id, name, subject, body } = req.body;
  const templateId = id || `tmpl-${Date.now()}`;

  const user = getUser(1);
  if (user.plan === 'free') {
    const counts = getUserPlanCount(1);
    const templates = getTemplates();
    const isNew = !id || !templates.some(t => t.id === id);
    if (isNew && counts.templatesCount >= 3) {
      return res.status(403).json({
        success: false,
        error: 'You have reached the template limit of 3 on the Free plan. Please upgrade to Pro for unlimited templates.'
      });
    }
  }

  try {
    addTemplate({ id: templateId, name, subject, body: body || '' });
    res.json({ success: true, id: templateId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/templates/:id', (req, res) => {
  deleteTemplate(req.params.id);
  res.json({ success: true });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  SCHEDULED EMAILS API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
app.get('/api/scheduled', (req, res) => {
  const emails = getScheduledEmails();
  res.json({ emails: [...emails].sort((a, b) => b.scheduled_at - a.scheduled_at) });
});

app.post('/api/schedule', (req, res) => {
  const { id, to, subject, body, html_body, scheduledAt, provider, trackingEnabled } = req.body;
  const emailId = id || `sched-${Date.now()}`;
  const trackingId = trackingEnabled ? `trk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` : '';

  const user = getUser(1);
  if (user.plan === 'free') {
    const counts = getUserPlanCount(1);
    if (counts.scheduledCount >= 5) {
      return res.status(403).json({
        success: false,
        error: 'You have reached the scheduled email limit of 5 on the Free plan. Please upgrade to Pro for unlimited scheduling.'
      });
    }
  }

  try {
    addScheduledEmail({
      id: emailId,
      user_id: 1,
      recipient: to,
      subject: subject || '',
      body: body || '',
      html_body: html_body || body || '',
      provider: provider || 'smtp',
      scheduled_at: scheduledAt,
      tracking_id: trackingId,
      status: 'pending',
      error_message: '',
      sent_at: 0,
    });

    console.log(`[Schedule] Email queued: "${subject}" to ${to} at ${new Date(scheduledAt).toISOString()}`);
    res.json({ success: true, id: emailId, trackingId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/scheduled/:id', (req, res) => {
  deleteScheduledEmail(req.params.id);
  res.json({ success: true });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  TRACKING ANALYTICS API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
app.get('/api/tracking', (req, res) => {
  const events = getTrackingEvents(100);
  res.json({ events });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  USER SETTINGS & SMTP CONFIG API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
app.get('/api/settings', (req, res) => {
  const user = getUser(1);
  if (!user) return res.status(404).json({ error: 'No user found' });
  res.json({
    email: user.email,
    display_name: user.display_name,
    smtp_host: user.smtp_host,
    smtp_port: user.smtp_port,
    smtp_secure: user.smtp_secure,
    smtp_user: user.smtp_user,
    smtp_from: user.smtp_from,
    smtp_configured: !!(user.smtp_user && user.smtp_pass),
    plan: user.plan,
  });
});

app.post('/api/settings', (req, res) => {
  try {
    const fields = {};
    const allowedFields = ['email', 'display_name', 'smtp_host', 'smtp_port', 'smtp_secure', 'smtp_user', 'smtp_pass', 'smtp_from'];
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        fields[key] = req.body[key];
      }
    }
    updateUser(1, fields);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DASHBOARD STATS API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
app.get('/api/stats', (req, res) => {
  const user = getUser(1);
  res.json({
    ...getStats(),
    plan: user ? user.plan : 'free',
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  SNOOZE API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
app.post('/api/snooze', (req, res) => {
  const { id, messageId, subject, provider, snoozeUntil } = req.body;
  const snoozeId = id || `snz-${Date.now()}`;

  try {
    addSnoozedEmail({
      id: snoozeId,
      message_id: messageId || '',
      subject: subject || '',
      provider: provider || '',
      snooze_until: snoozeUntil,
      status: 'snoozed',
    });
    res.json({ success: true, id: snoozeId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/snoozed', (req, res) => {
  res.json({ snoozed: getSnoozedEmails() });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  BACKGROUND SCHEDULER — checks for pending emails every 10s
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function processScheduledEmails() {
  const now = Date.now();
  const pending = getPendingEmails(now);

  for (const email of pending) {
    console.log(`[Scheduler] Sending: "${email.subject}" to ${email.recipient}`);
    updateScheduledEmail(email.id, { status: 'sending' });

    const result = await sendEmail(email);

    if (result.success) {
      updateScheduledEmail(email.id, { status: 'sent', sent_at: Date.now() });
      console.log(`[Scheduler] ✓ Sent: ${email.id}`);
      if (result.previewUrl) {
        console.log(`[Scheduler]   Preview: ${result.previewUrl}`);
      }
    } else {
      updateScheduledEmail(email.id, { status: 'failed', error_message: result.error || 'Unknown error' });
      console.log(`[Scheduler] ✗ Failed: ${email.id} — ${result.error}`);
    }
  }
}

function processSnoozes() {
  const now = Date.now();
  const due = getDueSnoozes(now);
  for (const snooze of due) {
    unsnoozeEmail(snooze.id);
    console.log(`[Snooze] Unsnoozed: ${snooze.subject}`);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  START SERVER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
app.listen(PORT, () => {
  // Initialize DB on startup
  getDb();

  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('  UniversalMail Backend Server v1.0.0');
  console.log(`  Running on http://localhost:${PORT}`);
  console.log('');
  console.log('  Endpoints:');
  console.log(`    GET  /health              — Health check`);
  console.log(`    GET  /track/:id           — Tracking pixel`);
  console.log(`    GET  /api/stats           — Dashboard stats`);
  console.log(`    GET  /api/templates       — List templates`);
  console.log(`    POST /api/templates       — Create template`);
  console.log(`    DEL  /api/templates/:id   — Delete template`);
  console.log(`    GET  /api/scheduled       — List scheduled`);
  console.log(`    POST /api/schedule        — Schedule email`);
  console.log(`    DEL  /api/scheduled/:id   — Cancel scheduled`);
  console.log(`    GET  /api/tracking        — Tracking events`);
  console.log(`    GET  /api/settings        — User settings`);
  console.log(`    POST /api/settings        — Update settings`);
  console.log(`    POST /api/snooze          — Snooze email`);
  console.log(`    GET  /api/snoozed         — List snoozed`);
  console.log('═══════════════════════════════════════════════════════');
  console.log('');

  // Start background scheduler (every 10 seconds)
  setInterval(() => {
    processScheduledEmails().catch((err) => console.error('[Scheduler] Error:', err.message));
    processSnoozes();
  }, 10_000);

  console.log('[Scheduler] Background email processor started (10s interval)');
});
