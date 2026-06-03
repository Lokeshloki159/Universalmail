import { injectToolbar, createScheduleModal, createTemplatePicker, generateTrackingPixel } from './content-common';

const OUTLOOK_SELECTORS = {
  composeButton: '[data-testid="NewMessageButton"], button[aria-label*="New"], button[title*="New message"]',
  composeWindow: '[data-testid="ComposeWrapper"], .ComposeWrapper, [role="dialog"]',
  toField: '[data-testid="RecipientWell"], input[aria-label*="To"], [role="textbox"]',
  subjectField: 'input[placeholder*="Subject"], input[aria-label*="Subject"]',
  bodyField: '[data-testid="Editor"], [role="textbox"][aria-label*="body"], .Editor',
  sendButton: 'button[aria-label*="Send"], button[data-testid="SendButton"]',
  messageList: '[data-testid="MessageList"], .MessageList',
  messageItem: '[data-testid="MessageItem"], .MessageItem',
};

let activeToolbars = new Map<string, HTMLElement>();

function detectOutlookVersion(): 'modern' | 'classic' | 'desktop-web' {
  if (document.querySelector('[data-testid="ComposeWrapper"]')) return 'modern';
  if (document.querySelector('.ComposeWrapper')) return 'classic';
  return 'desktop-web';
}

function findComposeWindows(): HTMLElement[] {
  const selectors = [
    '[data-testid="ComposeWrapper"]',
    '.ComposeWrapper',
    '[role="dialog"] [data-testid="Editor"]',
    '.ReadingPaneContainer [role="dialog"]',
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

  const sendButton = composeWindow.querySelector(OUTLOOK_SELECTORS.sendButton);
  if (!sendButton) return;

  const toolbar = injectToolbar(
    composeWindow,
    'outlook',
    () => openScheduleModal(composeWindow),
    () => openTemplatePicker(composeWindow),
    () => openSnoozePicker(composeWindow),
    () => toggleTracking(composeWindow)
  );

  sendButton.parentElement?.insertBefore(toolbar, sendButton.nextSibling);
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
      const subjectField = composeWindow.querySelector<HTMLInputElement>(OUTLOOK_SELECTORS.subjectField);
      const bodyField = composeWindow.querySelector<HTMLElement>(OUTLOOK_SELECTORS.bodyField);

      const emailData = {
        id: `sched-${Date.now()}`,
        to: 'recipient@example.com',
        subject: subjectField?.value || '',
        body: bodyField?.innerText || '',
        scheduledAt: date.getTime(),
        provider: 'outlook' as const,
        status: 'pending' as const,
      };

      chrome.runtime.sendMessage({
        type: 'SCHEDULE_SEND',
        data: emailData,
      });

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
        const subjectField = composeWindow.querySelector<HTMLInputElement>(OUTLOOK_SELECTORS.subjectField);
        const bodyField = composeWindow.querySelector<HTMLElement>(OUTLOOK_SELECTORS.bodyField);

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
  const bodyField = composeWindow.querySelector<HTMLElement>(OUTLOOK_SELECTORS.bodyField);
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

function initOutlookIntegration(): void {
  console.log('[UniversalMail] Outlook integration loaded. Version:', detectOutlookVersion());

  const observer = new MutationObserver(() => {
    const composeWindows = findComposeWindows();
    composeWindows.forEach(injectUniversalMailToolbar);
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Initial scan
  findComposeWindows().forEach(injectUniversalMailToolbar);

  // Update provider state
  chrome.storage.local.set({
    um_provider_state: {
      provider: 'outlook',
      isComposing: findComposeWindows().length > 0,
      url: location.href,
    },
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initOutlookIntegration);
} else {
  initOutlookIntegration();
}
