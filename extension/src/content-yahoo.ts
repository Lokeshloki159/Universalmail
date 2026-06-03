import { injectToolbar, createScheduleModal, createTemplatePicker, generateTrackingPixel } from './content-common';

const YAHOO_SELECTORS = {
  composeButton: 'a[href*="compose"], button[data-test-id="compose-button"]',
  composeWindow: '.compose-container, .compose-box, [data-test-id="compose-container"]',
  toField: 'input[name="to"], input[placeholder*="To"], [data-test-id="to-field"]',
  subjectField: 'input[name="subject"], input[placeholder*="Subject"]',
  bodyField: '.rte, .editor-body, [contenteditable="true"]',
  sendButton: 'button[data-test-id="compose-send-button"], button[title*="Send"]',
  messageList: '.message-list, [data-test-id="message-list"]',
  messageItem: '.message-item, [data-test-id="message-item"]',
};

let activeToolbars = new Map<string, HTMLElement>();

function findComposeWindows(): HTMLElement[] {
  const selectors = [
    '.compose-container',
    '.compose-box',
    '[data-test-id="compose-container"]',
    '#modal-outer .compose',
  ];
  const windows: HTMLElement[] = [];
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      if (el instanceof HTMLElement) windows.push(el);
    });
  });
  return windows;
}

function injectUniversalMailToolbar(composeWindow: HTMLElement): void {
  const composeId = composeWindow.getAttribute('data-um-id') || `compose-${Date.now()}`;
  composeWindow.setAttribute('data-um-id', composeId);

  if (activeToolbars.has(composeId)) return;

  const sendButton = composeWindow.querySelector(YAHOO_SELECTORS.sendButton);
  if (!sendButton) return;

  const toolbar = injectToolbar(
    composeWindow,
    'yahoo',
    () => openScheduleModal(composeWindow),
    () => openTemplatePicker(composeWindow),
    () => openSnoozePicker(composeWindow),
    () => toggleTracking(composeWindow)
  );

  sendButton.parentElement?.insertBefore(toolbar, sendButton);
  activeToolbars.set(composeId, toolbar);

  const observer = new MutationObserver(() => {
    if (!document.contains(composeWindow)) {
      activeToolbars.delete(composeId);
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function openScheduleModal(composeWindow: HTMLElement): void {
  const existing = document.querySelector('.um-modal-schedule');
  if (existing) existing.remove();

  const modal = createScheduleModal(
    (date) => {
      const emailData = {
        id: `sched-${Date.now()}`,
        to: 'recipient@example.com',
        subject: composeWindow.querySelector<HTMLInputElement>(YAHOO_SELECTORS.subjectField)?.value || '',
        body: composeWindow.querySelector<HTMLElement>(YAHOO_SELECTORS.bodyField)?.innerText || '',
        scheduledAt: date.getTime(),
        provider: 'yahoo' as const,
        status: 'pending' as const,
      };

      chrome.runtime.sendMessage({ type: 'SCHEDULE_SEND', data: emailData });
      modal.remove();
      showToast(`Email scheduled for ${date.toLocaleString()}`);
    },
    () => modal.remove()
  );
  document.body.appendChild(modal);
}

function openTemplatePicker(composeWindow: HTMLElement): void {
  const existing = document.querySelector('.um-modal-templates');
  if (existing) existing.remove();

  chrome.storage.local.get('um_templates').then(result => {
    const templates = result.um_templates || [];
    const modal = createTemplatePicker(
      templates,
      (template) => {
        const subjectField = composeWindow.querySelector<HTMLInputElement>(YAHOO_SELECTORS.subjectField);
        const bodyField = composeWindow.querySelector<HTMLElement>(YAHOO_SELECTORS.bodyField);
        if (subjectField) subjectField.value = template.subject;
        if (bodyField) bodyField.innerHTML = template.body;
        modal.remove();
        showToast(`Template "${template.name}" inserted`);
      },
      () => modal.remove()
    );
    document.body.appendChild(modal);
  });
}

function openSnoozePicker(composeWindow: HTMLElement): void {
  showToast('Snooze feature: Select an email from your inbox to snooze it.');
}

function toggleTracking(composeWindow: HTMLElement): void {
  const bodyField = composeWindow.querySelector<HTMLElement>(YAHOO_SELECTORS.bodyField);
  if (!bodyField) return;

  const emailId = `track-${Date.now()}`;
  const pixel = generateTrackingPixel(emailId);

  if (bodyField.innerHTML.includes('universalmail.io/track')) {
    bodyField.innerHTML = bodyField.innerHTML.replace(/<img[^>]*universalmail\.io\/track[^>]*>/g, '');
    showToast('Tracking disabled');
  } else {
    bodyField.innerHTML += pixel;
    showToast('Open tracking enabled');
  }
}

function showToast(message: string): void {
  const toast = document.createElement('div');
  toast.className = 'um-toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('um-toast-hide');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function initYahooIntegration(): void {
  console.log('[UniversalMail] Yahoo Mail integration loaded');

  const observer = new MutationObserver(() => {
    findComposeWindows().forEach(injectUniversalMailToolbar);
  });

  observer.observe(document.body, { childList: true, subtree: true });
  findComposeWindows().forEach(injectUniversalMailToolbar);

  chrome.storage.local.set({
    um_provider_state: {
      provider: 'yahoo',
      isComposing: findComposeWindows().length > 0,
      url: location.href,
    },
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initYahooIntegration);
} else {
  initYahooIntegration();
}
