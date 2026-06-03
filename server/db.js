/* UniversalMail — JSON File Database Layer (zero native deps) */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'database.json');

const DEFAULT_DB = {
  users: [
    {
      id: 1,
      email: 'default@universalmail.local',
      display_name: 'Default User',
      smtp_host: '',
      smtp_port: 587,
      smtp_secure: false,
      smtp_user: '',
      smtp_pass: '',
      smtp_from: '',
      plan: 'free',
      created_at: Date.now(),
      updated_at: Date.now(),
    },
  ],
  templates: [],
  scheduled_emails: [],
  tracking_events: [],
  snoozed_emails: [],
};

let _db = null;

function loadDb() {
  if (_db) return _db;
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      _db = JSON.parse(raw);
      // Ensure all collections exist
      for (const key of Object.keys(DEFAULT_DB)) {
        if (!_db[key]) _db[key] = Array.isArray(DEFAULT_DB[key]) ? [] : DEFAULT_DB[key];
      }
    } else {
      _db = JSON.parse(JSON.stringify(DEFAULT_DB));
      saveDb();
    }
  } catch (err) {
    console.error('[DB] Error loading database, resetting:', err.message);
    _db = JSON.parse(JSON.stringify(DEFAULT_DB));
    saveDb();
  }
  console.log('[DB] Database loaded from', DB_PATH);
  return _db;
}

function saveDb() {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(_db, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB] Error saving database:', err.message);
  }
}

// ─── Query Helpers ────────────────────────────────────────────

export function getDb() {
  return loadDb();
}

export function getUser(id = 1) {
  const db = loadDb();
  return db.users.find((u) => u.id === id) || db.users[0];
}

export function updateUser(id, fields) {
  const db = loadDb();
  const idx = db.users.findIndex((u) => u.id === id);
  if (idx >= 0) {
    db.users[idx] = { ...db.users[idx], ...fields, updated_at: Date.now() };
    saveDb();
    return db.users[idx];
  }
  return null;
}

// Templates
export function getTemplates() {
  return loadDb().templates;
}

export function addTemplate(template) {
  const db = loadDb();
  const existing = db.templates.findIndex((t) => t.id === template.id);
  if (existing >= 0) {
    db.templates[existing] = { ...db.templates[existing], ...template };
  } else {
    db.templates.push({ ...template, created_at: Date.now() });
  }
  saveDb();
}

export function deleteTemplate(id) {
  const db = loadDb();
  db.templates = db.templates.filter((t) => t.id !== id);
  saveDb();
}

// Scheduled Emails
export function getScheduledEmails() {
  return loadDb().scheduled_emails;
}

export function addScheduledEmail(email) {
  const db = loadDb();
  db.scheduled_emails.push({ ...email, created_at: Date.now() });
  saveDb();
}

export function updateScheduledEmail(id, fields) {
  const db = loadDb();
  const idx = db.scheduled_emails.findIndex((e) => e.id === id);
  if (idx >= 0) {
    db.scheduled_emails[idx] = { ...db.scheduled_emails[idx], ...fields };
    saveDb();
  }
}

export function deleteScheduledEmail(id) {
  const db = loadDb();
  db.scheduled_emails = db.scheduled_emails.filter((e) => e.id !== id || e.status !== 'pending');
  saveDb();
}

export function getPendingEmails(now) {
  return loadDb().scheduled_emails.filter(
    (e) => e.status === 'pending' && e.scheduled_at <= now
  );
}

// Tracking Events
export function getTrackingEvents(limit = 100) {
  const events = loadDb().tracking_events;
  return events.slice(-limit).reverse();
}

export function addTrackingEvent(event) {
  const db = loadDb();
  db.tracking_events.push({ ...event, opened_at: Date.now() });
  saveDb();
}

// Snoozed Emails
export function getSnoozedEmails() {
  return loadDb().snoozed_emails.filter((e) => e.status === 'snoozed');
}

export function addSnoozedEmail(snooze) {
  const db = loadDb();
  db.snoozed_emails.push({ ...snooze, created_at: Date.now() });
  saveDb();
}

export function unsnoozeEmail(id) {
  const db = loadDb();
  const idx = db.snoozed_emails.findIndex((e) => e.id === id);
  if (idx >= 0) {
    db.snoozed_emails[idx].status = 'unsnoozed';
    saveDb();
  }
}

export function getDueSnoozes(now) {
  return loadDb().snoozed_emails.filter(
    (e) => e.status === 'snoozed' && e.snooze_until <= now
  );
}

// Stats
export function getStats() {
  const db = loadDb();
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const todayStart = now.getTime();

  return {
    templates: db.templates.length,
    pending: db.scheduled_emails.filter((e) => e.status === 'pending').length,
    sent: db.scheduled_emails.filter((e) => e.status === 'sent').length,
    failed: db.scheduled_emails.filter((e) => e.status === 'failed').length,
    opensToday: db.tracking_events.filter((e) => e.opened_at >= todayStart).length,
    totalOpens: db.tracking_events.length,
  };
}

export function getUserPlanCount(userId = 1) {
  const db = loadDb();
  // Filter by user_id if records have them; templates currently do not have user_id, so count all templates
  const templatesCount = db.templates.length;
  const scheduledCount = db.scheduled_emails.filter((e) => e.user_id === userId).length;
  return { templatesCount, scheduledCount };
}

export function updateUserPlan(userId = 1, plan) {
  return updateUser(userId, { plan });
}

