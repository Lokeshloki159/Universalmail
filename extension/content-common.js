/* UniversalMail — Shared Content Script Utilities */

(function() {
  'use strict';

  const UM = window.__UniversalMail = window.__UniversalMail || {};

  UM.injectToolbar = function(composeWindow, provider, onSchedule, onTemplate, onSnooze, onTrack) {
    const toolbar = document.createElement('div');
    toolbar.className = 'um-toolbar';
    toolbar.innerHTML = `
      <div class="um-toolbar-inner">
        <button class="um-btn um-btn-schedule" title="Schedule Send">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>Schedule</span>
        </button>
        <button class="um-btn um-btn-template" title="Templates">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <span>Templates</span>
        </button>
        <button class="um-btn um-btn-snooze" title="Snooze">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          <span>Snooze</span>
        </button>
        <button class="um-btn um-btn-track" title="Track Opens">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <span>Track</span>
        </button>
      </div>
    `;

    toolbar.querySelector('.um-btn-schedule').addEventListener('click', onSchedule);
    toolbar.querySelector('.um-btn-template').addEventListener('click', onTemplate);
    toolbar.querySelector('.um-btn-snooze').addEventListener('click', onSnooze);
    toolbar.querySelector('.um-btn-track').addEventListener('click', onTrack);

    return toolbar;
  };

  UM.createScheduleModal = function(onConfirm, onCancel) {
    const modal = document.createElement('div');
    modal.className = 'um-modal um-modal-schedule';

    const now = new Date();
    const defaultDate = new Date(now.getTime() + 3600000);
    const pad = (n) => String(n).padStart(2, '0');
    const dateStr = `${defaultDate.getFullYear()}-${pad(defaultDate.getMonth()+1)}-${pad(defaultDate.getDate())}T${pad(defaultDate.getHours())}:${pad(defaultDate.getMinutes())}`;

    modal.innerHTML = `
      <div class="um-modal-overlay"></div>
      <div class="um-modal-content">
        <h3>Schedule Send</h3>
        <div class="um-modal-body">
          <label>Send on:</label>
          <input type="datetime-local" class="um-datetime-input" value="${dateStr}" />
          <div class="um-quick-times">
            <button data-min="60">In 1 hour</button>
            <button data-min="240">In 4 hours</button>
            <button data-min="480">Tomorrow 9am</button>
            <button data-min="1680">Mon 9am</button>
          </div>
        </div>
        <div class="um-modal-actions">
          <button class="um-btn-secondary um-cancel">Cancel</button>
          <button class="um-btn-primary um-confirm">Schedule</button>
        </div>
      </div>
    `;

    const input = modal.querySelector('.um-datetime-input');

    modal.querySelectorAll('.um-quick-times button').forEach(btn => {
      btn.addEventListener('click', () => {
        const mins = parseInt(btn.getAttribute('data-min') || '60');
        const d = new Date(Date.now() + mins * 60000);
        input.value = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      });
    });

    modal.querySelector('.um-cancel').addEventListener('click', onCancel);
    modal.querySelector('.um-confirm').addEventListener('click', () => {
      onConfirm(new Date(input.value));
    });
    modal.querySelector('.um-modal-overlay').addEventListener('click', onCancel);

    return modal;
  };

  UM.createTemplatePicker = function(templates, onSelect, onCancel) {
    const modal = document.createElement('div');
    modal.className = 'um-modal um-modal-templates';

    const listHtml = templates.length
      ? templates.map(t => `
          <div class="um-template-item" data-id="${t.id}">
            <strong>${escapeHtml(t.name)}</strong>
            <span>${escapeHtml(t.subject)}</span>
          </div>
        `).join('')
      : '<p class="um-empty">No templates yet. Create one in the extension popup.</p>';

    modal.innerHTML = `
      <div class="um-modal-overlay"></div>
      <div class="um-modal-content">
        <h3>Insert Template</h3>
        <div class="um-template-list">
          ${listHtml}
        </div>
        <div class="um-modal-actions">
          <button class="um-btn-secondary um-cancel">Cancel</button>
        </div>
      </div>
    `;

    modal.querySelectorAll('.um-template-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-id');
        const template = templates.find(t => t.id === id);
        if (template) onSelect(template);
      });
    });

    modal.querySelector('.um-cancel').addEventListener('click', onCancel);
    modal.querySelector('.um-modal-overlay').addEventListener('click', onCancel);

    return modal;
  };

  UM.generateTrackingPixel = function(emailId) {
    const pixelUrl = `https://universalmail.io/track?id=${emailId}&t=${Date.now()}`;
    return `<img src="${pixelUrl}" width="1" height="1" alt="" style="display:none" />`;
  };

  UM.showToast = function(message) {
    const toast = document.createElement('div');
    toast.className = 'um-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('um-toast-hide');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
})();
