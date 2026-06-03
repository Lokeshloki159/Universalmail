export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  category: string;
  createdAt: number;
}

export interface ScheduledEmail {
  id: string;
  to: string;
  subject: string;
  body: string;
  scheduledAt: number;
  provider: 'outlook' | 'yahoo' | 'icloud' | 'other';
  status: 'pending' | 'sent' | 'failed';
  trackingPixel?: string;
}

export interface SnoozedEmail {
  id: string;
  messageId: string;
  subject: string;
  snoozedUntil: number;
  provider: 'outlook' | 'yahoo' | 'icloud' | 'other';
  folder: string;
}

export interface TrackingEvent {
  id: string;
  emailId: string;
  recipient: string;
  openedAt: number;
  ip?: string;
  userAgent?: string;
  location?: string;
}

export interface UserSettings {
  defaultScheduleTime: string;
  timezone: string;
  readReceipts: boolean;
  trackingEnabled: boolean;
  snoozeDefaults: number[];
  signature: string;
  crmIntegration?: 'salesforce' | 'hubspot' | 'pipedrive' | 'none';
}

export interface ProviderState {
  provider: 'outlook' | 'yahoo' | 'icloud' | 'other' | null;
  isComposing: boolean;
  composeElement: string | null;
}
