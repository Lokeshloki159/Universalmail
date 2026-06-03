/* UniversalMail — Background Service Worker (Production) */

const API_BASE = 'https://universalmail.onrender.com';

// ─── Installation ─────────────────────────────────────────────
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ um_installed: Date.now() });
  syncTemplates();
  console.log('[UniversalMail] Extension installed — backend:', API_BASE);
});

// ─── Alarm Handlers (backup for server-side scheduler) ────────
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name.startsWith('unsnooze-')) {
    const snoozeId = alarm.name.replace('unsnooze-', '');
    await chrome.notifications.create('unsnooze-' + snoozeId, {
      type: 'basic',
      iconUrl: 'icons/icon128.svg',
      title: 'Email Unsnoozed',
      message: 'A snoozed email has reappeared.',
    });
  }
});

// ─── API Helper ───────────────────────────────────────────────
async function apiCall(method, path, body = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);

  try {
    const res = await fetch(`${API_BASE}${path}`, opts);
    return await res.json();
  } catch (err) {
    console.error(`[API] ${method} ${path} failed:`, err.message);
    return { success: false, error: err.message };
  }
}

// ─── Sync Templates with local storage ────────────────────────
async function syncTemplates() {
  const result = await apiCall('GET', '/api/templates');
  const templates = result.templates || [];
  await chrome.storage.local.set({ um_templates: templates });
  console.log('[UniversalMail] Synced templates to local storage:', templates.length);
  return templates;
}

// ─── Message Router ───────────────────────────────────────────
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  // ── Provider State (local only) ──
  if (request.type === 'GET_PROVIDER_STATE') {
    chrome.storage.local.get('um_provider_state').then(result => {
      sendResponse(result.um_provider_state || { provider: null, isComposing: false });
    });
    return true;
  }

  // ── Schedule Send → Backend API ──
  if (request.type === 'SCHEDULE_SEND') {
    const data = request.data;
    apiCall('POST', '/api/schedule', {
      id: data.id,
      to: data.to,
      subject: data.subject,
      body: data.body,
      html_body: data.body,
      scheduledAt: data.scheduledAt,
      provider: data.provider,
      trackingEnabled: data.trackingPixel || false,
    }).then(result => {
      sendResponse({ success: result.success, scheduledId: result.id, error: result.error });
    });
    return true;
  }

  // ── Save Template → Backend API ──
  if (request.type === 'SAVE_TEMPLATE') {
    apiCall('POST', '/api/templates', request.data).then(result => {
      if (result && result.success) {
        syncTemplates().then(() => sendResponse(result));
      } else {
        sendResponse(result);
      }
    });
    return true;
  }

  // ── Delete Template → Backend API ──
  if (request.type === 'DELETE_TEMPLATE') {
    apiCall('DELETE', `/api/templates/${request.id}`).then(result => {
      if (result && result.success) {
        syncTemplates().then(() => sendResponse(result));
      } else {
        sendResponse(result);
      }
    });
    return true;
  }

  // ── Cancel Scheduled → Backend API ──
  if (request.type === 'CANCEL_SCHEDULED') {
    apiCall('DELETE', `/api/scheduled/${request.id}`).then(result => {
      sendResponse(result);
    });
    return true;
  }

  // ── Get Templates → Backend API ──
  if (request.type === 'GET_TEMPLATES') {
    syncTemplates().then(templates => {
      sendResponse(templates);
    });
    return true;
  }

  // ── Get Stats → Backend API ──
  if (request.type === 'GET_STATS') {
    apiCall('GET', '/api/stats').then(result => {
      sendResponse(result);
    });
    return true;
  }

  // ── Get Scheduled → Backend API ──
  if (request.type === 'GET_SCHEDULED') {
    apiCall('GET', '/api/scheduled').then(result => {
      sendResponse(result.emails || []);
    });
    return true;
  }

  // ── Get Tracking Events → Backend API ──
  if (request.type === 'GET_TRACKING') {
    apiCall('GET', '/api/tracking').then(result => {
      sendResponse(result.events || []);
    });
    return true;
  }

  // ── Update Settings → Backend API ──
  if (request.type === 'UPDATE_SETTINGS') {
    apiCall('POST', '/api/settings', request.data).then(result => {
      sendResponse(result);
    });
    return true;
  }

  // ── Get Settings → Backend API ──
  if (request.type === 'GET_SETTINGS') {
    apiCall('GET', '/api/settings').then(result => {
      sendResponse(result);
    });
    return true;
  }

  // ── Track Open (legacy local) ──
  if (request.type === 'TRACK_OPEN') {
    console.log('[UniversalMail] Email opened:', request.data);
    sendResponse({ success: true });
    return true;
  }
});

// ─── Startup Sync ─────────────────────────────────────────────
syncTemplates().catch((err) => console.error('[Background] Startup sync failed:', err.message));

