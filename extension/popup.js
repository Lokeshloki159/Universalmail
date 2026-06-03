/* UniversalMail — Popup Dashboard (Production — API-backed) */

(function () {
  'use strict';

  // ========== STATE ==========
  let currentTab = 'dashboard';
  let serverOnline = false;
  let userPlan = 'free';
  let localSettings = {
    trackingEnabled: true,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  // ========== DOM REFERENCES ==========
  const tabs = document.querySelectorAll('.um-tab');
  const panels = document.querySelectorAll('.um-panel');
  const providerStatus = document.getElementById('provider-status');
  const serverDot = document.getElementById('server-dot');
  const serverStatusText = document.getElementById('server-status');
  const serverAlert = document.getElementById('server-alert');

  // ========== MESSAGING HELPER ==========
  function sendMsg(type, data = {}) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type, ...data }, (response) => {
        resolve(response);
      });
    });
  }

  // ========== SERVER CHECK ==========
  async function checkServer() {
    try {
      const res = await fetch('http://localhost:3000/health');
      const json = await res.json();
      if (json.status === 'ok') {
        serverOnline = true;
        serverDot.classList.remove('offline');
        serverDot.classList.add('online');
        serverStatusText.textContent = 'Online';
        serverAlert.innerHTML = '';
        return true;
      }
    } catch (e) {
      // Server unreachable
    }
    serverOnline = false;
    serverDot.classList.remove('online');
    serverDot.classList.add('offline');
    serverStatusText.textContent = 'Offline';
    serverAlert.innerHTML = `
      <div class="um-alert um-alert-error">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;flex-shrink:0;"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        <span>Backend server offline. Run <strong>npm start</strong> in /server</span>
      </div>`;
    return false;
  }

  // ========== TAB SWITCHING ==========
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      currentTab = target;

      tabs.forEach((t) => t.classList.toggle('active', t.dataset.tab === target));
      panels.forEach((p) => p.classList.toggle('active', p.id === 'panel-' + target));

      if (target === 'templates') loadTemplates();
      if (target === 'scheduled') loadScheduled();
      if (target === 'tracking') loadTracking();
      if (target === 'dashboard') loadDashboard();
      if (target === 'settings') loadSettings();
    });
  });

  // ========== DASHBOARD ==========
  async function loadDashboard() {
    const online = await checkServer();
    const planBadge = document.getElementById('plan-badge');
    const planBanner = document.getElementById('plan-banner');

    if (!online) {
      document.getElementById('stat-templates').textContent = '—';
      document.getElementById('stat-scheduled').textContent = '—';
      document.getElementById('stat-sent').textContent = '—';
      document.getElementById('stat-opens').textContent = '—';
      planBadge.style.display = 'none';
      planBanner.style.display = 'none';
      return;
    }

    const stats = await sendMsg('GET_STATS');
    if (stats) {
      document.getElementById('stat-templates').textContent = stats.templates || 0;
      document.getElementById('stat-scheduled').textContent = stats.pending || 0;
      document.getElementById('stat-sent').textContent = stats.sent || 0;
      document.getElementById('stat-opens').textContent = stats.opensToday || 0;

      userPlan = stats.plan || 'free';
      planBadge.textContent = userPlan.toUpperCase();
      planBadge.style.display = 'inline-block';
      if (userPlan === 'pro') {
        planBadge.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        planBadge.style.color = 'white';
        planBanner.style.display = 'none';
      } else {
        planBadge.style.background = '#334155';
        planBadge.style.color = '#94a3b8';
        planBanner.style.display = 'block';
      }
    }

    // Provider detection
    chrome.storage.local.get('um_provider_state', (result) => {
      const provider = result.um_provider_state;
      if (provider && provider.provider) {
        const name = provider.provider.charAt(0).toUpperCase() + provider.provider.slice(1);
        providerStatus.textContent = 'Connected: ' + name;
      } else {
        providerStatus.textContent = 'Open Outlook, Yahoo, or iCloud Mail';
      }
    });
  }

  // ========== TEMPLATES ==========
  const templateForm = document.getElementById('template-form');
  const btnNewTemplate = document.getElementById('btn-new-template');
  const btnSaveTemplate = document.getElementById('btn-save-template');
  const templateList = document.getElementById('template-list');

  btnNewTemplate.addEventListener('click', () => {
    templateForm.style.display = templateForm.style.display === 'none' ? 'block' : 'none';
  });

  btnSaveTemplate.addEventListener('click', async () => {
    const name = document.getElementById('tpl-name').value.trim();
    const subject = document.getElementById('tpl-subject').value.trim();
    const body = document.getElementById('tpl-body').value.trim();

    if (!name || !subject) {
      alert('Please enter a template name and subject.');
      return;
    }

    const result = await sendMsg('SAVE_TEMPLATE', {
      data: {
        id: 'tmpl-' + Date.now(),
        name,
        subject,
        body,
      },
    });

    if (result && result.success === false) {
      alert(result.error || 'Failed to save template.');
      return;
    }

    document.getElementById('tpl-name').value = '';
    document.getElementById('tpl-subject').value = '';
    document.getElementById('tpl-body').value = '';
    templateForm.style.display = 'none';

    setTimeout(loadTemplates, 200);
    loadDashboard();
  });

  async function loadTemplates() {
    const templates = await sendMsg('GET_TEMPLATES');
    templateList.innerHTML = '';

    const templatesQuotaTitle = document.getElementById('templates-quota-title');
    const templatesQuotaVal = document.getElementById('templates-quota-val');
    if (userPlan === 'free') {
      templatesQuotaTitle.style.display = 'flex';
      templatesQuotaVal.textContent = `${templates ? templates.length : 0} / 3`;
    } else {
      templatesQuotaTitle.style.display = 'none';
    }

    if (!templates || templates.length === 0) {
      templateList.innerHTML = '<div class="um-empty">No templates yet</div>';
      return;
    }

    templates.forEach((t) => {
      const item = document.createElement('div');
      item.className = 'um-list-item';
      item.innerHTML = `
        <div class="um-list-item-header">
          <span class="um-list-item-title">${escapeHtml(t.name)}</span>
          <button class="um-btn um-btn-danger um-btn-sm" data-id="${t.id}">Delete</button>
        </div>
        <div class="um-list-item-sub">${escapeHtml(t.subject)}</div>
        ${t.body ? `<div class="um-list-item-meta" style="margin-top:6px;color:#64748b;font-size:11px;">${escapeHtml(t.body.substring(0, 80))}${t.body.length > 80 ? '...' : ''}</div>` : ''}
      `;
      item.querySelector('button').addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        await sendMsg('DELETE_TEMPLATE', { id });
        setTimeout(loadTemplates, 200);
        loadDashboard();
      });
      templateList.appendChild(item);
    });
  }

  // ========== SCHEDULED ==========
  const scheduledList = document.getElementById('scheduled-list');

  async function loadScheduled() {
    const emails = await sendMsg('GET_SCHEDULED');
    scheduledList.innerHTML = '';

    if (!emails || emails.length === 0) {
      scheduledList.innerHTML = '<div class="um-empty">No scheduled emails</div>';
      return;
    }

    emails.forEach((email) => {
      const item = document.createElement('div');
      item.className = 'um-list-item';

      const badgeClass =
        email.status === 'pending' ? 'um-badge-pending' :
        email.status === 'sent' ? 'um-badge-sent' :
        email.status === 'sending' ? 'um-badge-sending' :
        'um-badge-failed';

      item.innerHTML = `
        <div class="um-list-item-header">
          <span class="um-list-item-title">${escapeHtml(email.subject || '(No subject)')}</span>
          <span class="um-badge ${badgeClass}">${email.status}</span>
        </div>
        <div class="um-list-item-sub">To: ${escapeHtml(email.recipient)}</div>
        <div class="um-list-item-meta">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Scheduled: ${new Date(email.scheduled_at).toLocaleString()}
        </div>
        ${email.sent_at ? `<div class="um-list-item-meta" style="color:#10b981;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Sent: ${new Date(email.sent_at).toLocaleString()}
        </div>` : ''}
        ${email.error_message ? `<div class="um-list-item-meta" style="color:#ef4444;">Error: ${escapeHtml(email.error_message)}</div>` : ''}
        ${email.status === 'pending' ? `<button class="um-btn um-btn-danger um-btn-sm" style="margin-top:8px;" data-id="${email.id}">Cancel</button>` : ''}
      `;

      const cancelBtn = item.querySelector('button[data-id]');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', (e) => {
          const id = e.target.dataset.id;
          sendMsg('CANCEL_SCHEDULED', { id });
          setTimeout(loadScheduled, 200);
          loadDashboard();
        });
      }

      scheduledList.appendChild(item);
    });
  }

  // ========== TRACKING ==========
  const trackingList = document.getElementById('tracking-list');

  async function loadTracking() {
    const events = await sendMsg('GET_TRACKING');
    trackingList.innerHTML = '';

    if (!events || events.length === 0) {
      trackingList.innerHTML = '<div class="um-empty">No tracking events yet</div>';
      return;
    }

    events.forEach((event) => {
      const item = document.createElement('div');
      item.className = 'um-list-item';
      item.style.display = 'flex';
      item.style.alignItems = 'center';
      item.style.gap = '10px';
      item.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;color:#10b981;flex-shrink:0;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <div style="flex:1;">
          <div style="font-size:12px;color:#f8fafc;">${escapeHtml(event.recipient || event.tracking_id)}</div>
          <div style="font-size:11px;color:#94a3b8;">${escapeHtml(event.subject || '')}</div>
          <div style="font-size:10px;color:#64748b;">${new Date(event.opened_at).toLocaleString()} — IP: ${escapeHtml(event.ip_address || 'unknown')}</div>
        </div>
      `;
      trackingList.appendChild(item);
    });
  }

  // ========== SETTINGS ==========
  const toggleTracking = document.getElementById('toggle-tracking');
  const settingTz = document.getElementById('setting-tz');
  const smtpAlert = document.getElementById('smtp-alert');

  async function loadSettings() {
    settingTz.value = localSettings.timezone;

    // Load local prefs
    chrome.storage.local.get('um_local_settings', (result) => {
      if (result.um_local_settings) {
        localSettings = { ...localSettings, ...result.um_local_settings };
      }
      toggleTracking.classList.toggle('on', localSettings.trackingEnabled);
    });

    // Load server SMTP settings
    if (!serverOnline) return;
    const settings = await sendMsg('GET_SETTINGS');
    if (settings && !settings.error) {
      document.getElementById('smtp-host').value = settings.smtp_host || '';
      document.getElementById('smtp-port').value = settings.smtp_port || 587;
      document.getElementById('smtp-user').value = settings.smtp_user || '';
      document.getElementById('smtp-from').value = settings.smtp_from || '';

      const smtpSecureBtn = document.getElementById('smtp-secure');
      smtpSecureBtn.classList.toggle('on', !!settings.smtp_secure);

      if (settings.smtp_configured) {
        smtpAlert.innerHTML = `
          <div class="um-alert um-alert-success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;flex-shrink:0;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>SMTP configured — emails will be sent via your account</span>
          </div>`;
      } else {
        smtpAlert.innerHTML = `
          <div class="um-alert um-alert-info">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;flex-shrink:0;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <span>No SMTP configured — using Ethereal test mode (emails viewable at ethereal.email)</span>
          </div>`;
      }
    }
  }

  // Save SMTP
  document.getElementById('btn-save-smtp').addEventListener('click', async () => {
    const data = {
      smtp_host: document.getElementById('smtp-host').value.trim(),
      smtp_port: parseInt(document.getElementById('smtp-port').value) || 587,
      smtp_secure: document.getElementById('smtp-secure').classList.contains('on'),
      smtp_user: document.getElementById('smtp-user').value.trim(),
      smtp_pass: document.getElementById('smtp-pass').value.trim(),
      smtp_from: document.getElementById('smtp-from').value.trim(),
    };

    const result = await sendMsg('UPDATE_SETTINGS', { data });
    if (result && result.success) {
      smtpAlert.innerHTML = `
        <div class="um-alert um-alert-success">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;flex-shrink:0;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>SMTP settings saved successfully!</span>
        </div>`;
      document.getElementById('smtp-pass').value = '';
    } else {
      smtpAlert.innerHTML = `
        <div class="um-alert um-alert-error">
          <span>Failed to save settings</span>
        </div>`;
    }
  });

  // Toggle secure
  document.getElementById('smtp-secure').addEventListener('click', function () {
    this.classList.toggle('on');
  });

  // Toggle tracking
  toggleTracking.addEventListener('click', async () => {
    localSettings.trackingEnabled = !localSettings.trackingEnabled;
    toggleTracking.classList.toggle('on', localSettings.trackingEnabled);
    chrome.storage.local.set({ um_local_settings: localSettings });
  });

  // ========== QUICK ACTIONS ==========
  document.getElementById('qa-compose').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url || '';
      if (url.includes('outlook') || url.includes('yahoo') || url.includes('icloud')) {
        alert('Click "Schedule" in the compose toolbar to schedule this email.');
      } else {
        alert('Please open Outlook, Yahoo, or iCloud Mail to use this feature.');
      }
    });
  });

  document.getElementById('qa-template').addEventListener('click', () => {
    tabs.forEach((t) => t.classList.toggle('active', t.dataset.tab === 'templates'));
    panels.forEach((p) => p.classList.toggle('active', p.id === 'panel-templates'));
    currentTab = 'templates';
    templateForm.style.display = 'block';
    loadTemplates();
  });

  // ========== UTILITIES ==========
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }

  // ========== INIT ==========
  document.getElementById('btn-upgrade-now').addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:3000/api/billing/checkout' });
  });

  loadDashboard();
  loadSettings();
})();
