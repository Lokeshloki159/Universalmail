import { injectToolbar, createScheduleModal, createTemplatePicker, generateTrackingPixel } from './content-common';

const ICLOUD_SELECTORS = {
  composeButton: 'button[title*="Compose"], .compose-button, button[data-testid="compose"]',
  composeWindow: '.compose-view, .compose-window, [role="dialog"]',
  toField: 'input[placeholder*="To"], .token-field input',
  subjectField: 'input[placeholder*="Subject"]',
  bodyField: '.message-body, [contenteditable="true"]',
  sendButton: 'button[title*="Send"], .send-button',
  messageList: '.message-list, .mailbox-list',
  messageItem: '.message-item, .message-row',
};

let activeToolbars = new Map<string, HTMLElement>();

function findComposeWindows(): HTMLElement[] {
  const selectors = [
    '.compose-view',
    '.compose-window',
    '[role="dialog"] .message-body',
    '.modal-compose',
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

  const sendButton = composeWindow.querySelector(ICLOUD_SELECTORS.sendButton);
  if (!sendButton) return;

  const toolbar = injectToolbar(
    composeWindow,
    'icloud',
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
        subject: composeWindow.querySelector<HTMLInputElement>(ICLOUD_SELECTORS.subjectField)?.value || '',
        body: composeWindow.querySelector<HTMLElement>(ICLOUD_SELECTORS.bodyField)?.innerText || '',
        scheduledAt: date.getTime(),
        provider: 'icloud' as const,
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
        const subjectField = composeWindow.querySelector<HTMLInputElement>(ICLOUD_SELECTORS.subjectField);
        const bodyField = composeWindow.querySelector<HTMLElement>(ICLOUD_SELECTORS.bodyField);
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
  const bodyField = composeWindow.querySelector<HTMLElement>(ICLOUD_SELECTORS.bodyField);
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

function initIcloudIntegration(): void {
  console.log('[UniversalMail] iCloud Mail integration loaded');

  const observer = new MutationObserver(() => {
    findComposeWindows().forEach(injectUniversalMailToolbar);
  });

  observer.observe(document.body, { childList: true, subtree: true });
  findComposeWindows().forEach(injectUniversalMailToolbar);

  chrome.storage.local.set({
    um_provider_state: {
      provider: 'icloud',
      isComposing: findComposeWindows().length > 0,
      url: location.href,
    },
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initIcloudIntegration);
} else {
  initIcloudIntegration();
}
