import type { EmailTemplate, ScheduledEmail, SnoozedEmail, TrackingEvent, UserSettings } from './types';

const STORAGE_KEYS = {
  TEMPLATES: 'um_templates',
  SCHEDULED: 'um_scheduled',
  SNOOZED: 'um_snoozed',
  TRACKING: 'um_tracking',
  SETTINGS: 'um_settings',
  PROVIDER_STATE: 'um_provider_state',
};

const DEFAULT_SETTINGS: UserSettings = {
  defaultScheduleTime: '09:00',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  readReceipts: true,
  trackingEnabled: true,
  snoozeDefaults: [3600000, 14400000, 28800000, 86400000, 604800000],
  signature: '',
  crmIntegration: 'none',
};

export async function getTemplates(): Promise<EmailTemplate[]> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.TEMPLATES);
  return result[STORAGE_KEYS.TEMPLATES] || [];
}

export async function saveTemplate(template: EmailTemplate): Promise<void> {
  const templates = await getTemplates();
  const existing = templates.findIndex(t => t.id === template.id);
  if (existing >= 0) {
    templates[existing] = template;
  } else {
    templates.push(template);
  }
  await chrome.storage.local.set({ [STORAGE_KEYS.TEMPLATES]: templates });
}

export async function deleteTemplate(id: string): Promise<void> {
  const templates = await getTemplates();
  await chrome.storage.local.set({
    [STORAGE_KEYS.TEMPLATES]: templates.filter(t => t.id !== id),
  });
}

export async function getScheduledEmails(): Promise<ScheduledEmail[]> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.SCHEDULED);
  return result[STORAGE_KEYS.SCHEDULED] || [];
}

export async function scheduleEmail(email: ScheduledEmail): Promise<void> {
  const scheduled = await getScheduledEmails();
  scheduled.push(email);
  await chrome.storage.local.set({ [STORAGE_KEYS.SCHEDULED]: scheduled });

  await chrome.alarms.create(`send-email-${email.id}`, {
    when: email.scheduledAt,
  });
}

export async function cancelScheduledEmail(id: string): Promise<void> {
  const scheduled = await getScheduledEmails();
  await chrome.storage.local.set({
    [STORAGE_KEYS.SCHEDULED]: scheduled.filter(e => e.id !== id),
  });
  await chrome.alarms.clear(`send-email-${id}`);
}

export async function getSnoozedEmails(): Promise<SnoozedEmail[]> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.SNOOZED);
  return result[STORAGE_KEYS.SNOOZED] || [];
}

export async function snoozeEmail(snoozed: SnoozedEmail): Promise<void> {
  const emails = await getSnoozedEmails();
  emails.push(snoozed);
  await chrome.storage.local.set({ [STORAGE_KEYS.SNOOZED]: emails });

  await chrome.alarms.create(`unsnooze-${snoozed.id}`, {
    when: snoozed.snoozedUntil,
  });
}

export async function getTrackingEvents(): Promise<TrackingEvent[]> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.TRACKING);
  return result[STORAGE_KEYS.TRACKING] || [];
}

export async function addTrackingEvent(event: TrackingEvent): Promise<void> {
  const events = await getTrackingEvents();
  events.push(event);
  await chrome.storage.local.set({ [STORAGE_KEYS.TRACKING]: events });
}

export async function getSettings(): Promise<UserSettings> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.SETTINGS);
  return { ...DEFAULT_SETTINGS, ...result[STORAGE_KEYS.SETTINGS] };
}

export async function saveSettings(settings: Partial<UserSettings>): Promise<void> {
  const current = await getSettings();
  await chrome.storage.local.set({
    [STORAGE_KEYS.SETTINGS]: { ...current, ...settings },
  });
}
