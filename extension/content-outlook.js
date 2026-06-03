/* UniversalMail — Outlook.com Content Script */

(function() {
  'use strict';

  const UM = window.__UniversalMail;
  if (!UM) return;

  const OUTLOOK_SELECTORS = {
    composeWindow: '[data-testid="ComposeWrapper"], .ComposeWrapper, [role="dialog"]',
    subjectField: 'input[placeholder*="Subject"], input[aria-label*="Subject"]',
    bodyField: '[data-testid="Editor"], [role="textbox"][aria-label*="body"], .Editor',
    sendButton: 'button[aria-label*="Send"], button[data-testid="SendButton"]',
  };

  let activeToolbars = new Map();

  function findComposeWindows() {
    const selectors = [
      '[data-testid="ComposeWrapper"]',
      '.ComposeWrapper',
      '[role="dialog"] [data-testid="Editor"]',
      '.ReadingPaneContainer [role="dialog"]',
    ];
    const windows = [];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (el instanceof HTMLElement) windows.push(el);
      });
    });
    return windows;
  }

  function injectToolbar(composeWindow) {
    const composeId = composeWindow.getAttribute('data-um-id') || 'compose-' + Date.now();
    composeWindow.setAttribute('data-um-id', composeId);

    if (activeToolbars.has(composeId)) return;

    const sendButton = composeWindow.querySelector(OUTLOOK_SELECTORS.sendButton);
    if (!sendButton) return;

    const toolbar = UM.injectToolbar(
      composeWindow,
      'outlook',
      () => openScheduleModal(composeWindow),
      () => openTemplatePicker(composeWindow),
      () => openSnoozePicker(composeWindow),
      () => toggleTracking(composeWindow)
    );

    sendButton.parentElement.insertBefore(toolbar, sendButton.nextSibling);
    activeToolbars.set(composeId, toolbar);

    const observer = new MutationObserver(() => {
      if (!document.contains(composeWindow)) {
        activeToolbars.delete(composeId);
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function openScheduleModal(composeWindow) {
    const existing = document.querySelector('.um-modal-schedule');
    if (existing) existing.remove();

    const modal = UM.createScheduleModal(
      (date) => {
        const subjectField = composeWindow.querySelector(OUTLOOK_SELECTORS.subjectField);
        const bodyField = composeWindow.querySelector(OUTLOOK_SELECTORS.bodyField);

        const emailData = {
          id: 'sched-' + Date.now(),
          to: 'recipient@example.com',
          subject: subjectField ? subjectField.value : '',
          body: bodyField ? bodyField.innerText : '',
          scheduledAt: date.getTime(),
          provider: 'outlook',
          status: 'pending',
        };

        chrome.runtime.sendMessage({ type: 'SCHEDULE_SEND', data: emailData }, (response) => {
          if (response && response.success) {
            modal.remove();
            UM.showToast('Email scheduled for ' + date.toLocaleString());
          } else {
            alert(response && response.error ? response.error : 'Failed to schedule email. Make sure the backend server is running.');
          }
        });
      },
      () => modal.remove()
    );

    document.body.appendChild(modal);
  }

  function openTemplatePicker(composeWindow) {
    const existing = document.querySelector('.um-modal-templates');
    if (existing) existing.remove();

    chrome.storage.local.get('um_templates').then(result => {
      const templates = result.um_templates || [];
      const modal = UM.createTemplatePicker(
        templates,
        (template) => {
          const subjectField = composeWindow.querySelector(OUTLOOK_SELECTORS.subjectField);
          const bodyField = composeWindow.querySelector(OUTLOOK_SELECTORS.bodyField);

          if (subjectField) subjectField.value = template.subject;
          if (bodyField) bodyField.innerHTML = template.body;

          modal.remove();
          UM.showToast('Template "' + template.name + '" inserted');
        },
        () => modal.remove()
      );
      document.body.appendChild(modal);
    });
  }

  function openSnoozePicker(composeWindow) {
    UM.showToast('Snooze feature: Select an email from your inbox to snooze it.');
  }

  function toggleTracking(composeWindow) {
    const bodyField = composeWindow.querySelector(OUTLOOK_SELECTORS.bodyField);
    if (!bodyField) return;

    const emailId = 'track-' + Date.now();
    const pixel = UM.generateTrackingPixel(emailId);

    if (bodyField.innerHTML.includes('universalmail.io/track')) {
      bodyField.innerHTML = bodyField.innerHTML.replace(/<img[^>]*universalmail\.io\/track[^>]*>/g, '');
      UM.showToast('Tracking disabled');
    } else {
      bodyField.innerHTML += pixel;
      UM.showToast('Open tracking enabled');
    }
  }

  function init() {
    console.log('[UniversalMail] Outlook integration loaded');

    const observer = new MutationObserver(() => {
      findComposeWindows().forEach(injectToolbar);
    });

    observer.observe(document.body, { childList: true, subtree: true });
    findComposeWindows().forEach(injectToolbar);

    chrome.storage.local.set({
      um_provider_state: {
        provider: 'outlook',
        isComposing: findComposeWindows().length > 0,
        url: location.href,
      },
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
