import { getScheduledEmails, getSnoozedEmails, getSettings } from './storage';
import type { ScheduledEmail, SnoozedEmail } from './types';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ um_installed: Date.now() });
  console.log('[UniversalMail] Extension installed');
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name.startsWith('send-email-')) {
    const emailId = alarm.name.replace('send-email-', '');
    const emails = await getScheduledEmails();
    const email = emails.find(e => e.id === emailId);
    if (email && email.status === 'pending') {
      await executeSend(email);
    }
  }

  if (alarm.name.startsWith('unsnooze-')) {
    const snoozeId = alarm.name.replace('unsnooze-', '');
    const emails = await getSnoozedEmails();
    const snoozed = emails.find(e => e.id === snoozeId);
    if (snoozed) {
      await executeUnsnooze(snoozed);
    }
  }
});

async function executeSend(email: ScheduledEmail): Promise<void> {
  console.log('[UniversalMail] Executing scheduled send:', email.id);

  const settings = await getSettings();
  if (settings.trackingEnabled && email.trackingPixel) {
    // Tracking pixel would be injected here
  }

  await chrome.notifications.create(`send-${email.id}`, {
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: 'Email Scheduled Send Complete',
    message: `Sent: ${email.subject} to ${email.to}`,
  });

  const emails = await getScheduledEmails();
  const updated = emails.map(e =>
    e.id === email.id ? { ...e, status: 'sent' as const } : e
  );
  await chrome.storage.local.set({ um_scheduled: updated });
}

async function executeUnsnooze(snoozed: SnoozedEmail): Promise<void> {
  console.log('[UniversalMail] Unsnoozing email:', snoozed.messageId);

  await chrome.notifications.create(`unsnooze-${snoozed.id}`, {
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: 'Email Unsnoozed',
    message: `Reappeared: ${snoozed.subject}`,
  });

  const emails = await getSnoozedEmails();
  await chrome.storage.local.set({
    um_snoozed: emails.filter(e => e.id !== snoozed.id),
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_PROVIDER_STATE') {
    chrome.storage.local.get('um_provider_state').then(result => {
      sendResponse(result.um_provider_state || { provider: null, isComposing: false });
    });
    return true;
  }

  if (request.type === 'TRACK_OPEN') {
    console.log('[UniversalMail] Email opened:', request.data);
    sendResponse({ success: true });
    return true;
  }

  if (request.type === 'SCHEDULE_SEND') {
    console.log('[UniversalMail] Schedule send requested:', request.data);
    sendResponse({ success: true, scheduledId: request.data.id });
    return true;
  }
});
