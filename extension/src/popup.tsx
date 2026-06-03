import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Clock, FileText, Bell, Eye, Settings, Send, Calendar,
  CheckCircle, X, Plus, Trash2, ChevronDown, ChevronUp,
  Mail, BarChart3, Zap, Shield
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
}

interface ScheduledEmail {
  id: string;
  to: string;
  subject: string;
  scheduledAt: number;
  status: string;
}

interface TrackingEvent {
  id: string;
  emailId: string;
  recipient: string;
  openedAt: number;
}

const Popup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'templates' | 'scheduled' | 'tracking' | 'settings'>('dashboard');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [scheduled, setScheduled] = useState<ScheduledEmail[]>([]);
  const [tracking, setTracking] = useState<TrackingEvent[]>([]);
  const [provider, setProvider] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [templatesRes, scheduledRes, trackingRes, stateRes] = await Promise.all([
      chrome.storage.local.get('um_templates'),
      chrome.storage.local.get('um_scheduled'),
      chrome.storage.local.get('um_tracking'),
      chrome.storage.local.get('um_provider_state'),
    ]);
    setTemplates(templatesRes.um_templates || []);
    setScheduled(scheduledRes.um_scheduled || []);
    setTracking(trackingRes.um_tracking || []);
    setProvider(stateRes.um_provider_state?.provider || null);
  };

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart3 },
    { id: 'templates' as const, label: 'Templates', icon: FileText },
    { id: 'scheduled' as const, label: 'Scheduled', icon: Calendar },
    { id: 'tracking' as const, label: 'Tracking', icon: Eye },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <div style={{ minHeight: '520px', background: '#0f172a', color: '#e2e8f0' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Mail size={18} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#f8fafc' }}>UniversalMail</h1>
          <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
            {provider ? `Connected: ${provider.charAt(0).toUpperCase() + provider.slice(1)}` : 'Not connected'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #1e293b', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '10px 8px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #6366f1' : '2px solid transparent',
              color: activeTab === tab.id ? '#f8fafc' : '#94a3b8',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              whiteSpace: 'nowrap',
            }}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: 16 }}>
        {activeTab === 'dashboard' && <DashboardTab templates={templates} scheduled={scheduled} tracking={tracking} />}
        {activeTab === 'templates' && <TemplatesTab templates={templates} onUpdate={loadData} />}
        {activeTab === 'scheduled' && <ScheduledTab scheduled={scheduled} onUpdate={loadData} />}
        {activeTab === 'tracking' && <TrackingTab tracking={tracking} />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
};

const DashboardTab: React.FC<{ templates: Template[]; scheduled: ScheduledEmail[]; tracking: TrackingEvent[] }> = ({
  templates, scheduled, tracking
}) => {
  const pendingCount = scheduled.filter(s => s.status === 'pending').length;
  const opensToday = tracking.filter(t => {
    const d = new Date(t.openedAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  const stats = [
    { label: 'Templates', value: templates.length, icon: FileText, color: '#6366f1' },
    { label: 'Scheduled', value: pendingCount, icon: Clock, color: '#f59e0b' },
    { label: 'Opens Today', value: opensToday, icon: Eye, color: '#10b981' },
    { label: 'Active', icon: Zap, color: '#ec4899', value: pendingCount + opensToday },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {stats.map(stat => (
          <div key={stat.label} style={{ background: '#1e293b', borderRadius: 10, padding: 14, textAlign: 'center' }}>
            <stat.icon size={20} color={stat.color} style={{ marginBottom: 6 }} />
            <div style={{ fontSize: 22, fontWeight: 700, color: '#f8fafc' }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#1e293b', borderRadius: 10, padding: 14 }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: '#f8fafc' }}>Quick Actions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <ActionButton icon={Send} label="New Scheduled Email" color="#6366f1" />
          <ActionButton icon={FileText} label="Create Template" color="#8b5cf6" />
          <ActionButton icon={Bell} label="Set Follow-up Reminder" color="#f59e0b" />
          <ActionButton icon={Shield} label="Enable Read Receipts" color="#10b981" />
        </div>
      </div>
    </div>
  );
};

const ActionButton: React.FC<{ icon: any; label: string; color: string }> = ({ icon: Icon, label, color }) => (
  <button style={{
    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
    background: '#0f172a', border: '1px solid #334155', borderRadius: 8,
    color: '#e2e8f0', fontSize: 12, cursor: 'pointer', width: '100%', textAlign: 'left'
  }}>
    <Icon size={16} color={color} />
    <span>{label}</span>
  </button>
);

const TemplatesTab: React.FC<{ templates: Template[]; onUpdate: () => void }> = ({ templates, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const saveTemplate = async () => {
    const newTemplate: Template = {
      id: `tmpl-${Date.now()}`,
      name,
      subject,
      body,
    };
    const current = await chrome.storage.local.get('um_templates');
    const updated = [...(current.um_templates || []), newTemplate];
    await chrome.storage.local.set({ um_templates: updated });
    setShowForm(false);
    setName(''); setSubject(''); setBody('');
    onUpdate();
  };

  const deleteTemplate = async (id: string) => {
    const current = await chrome.storage.local.get('um_templates');
    const updated = (current.um_templates || []).filter((t: Template) => t.id !== id);
    await chrome.storage.local.set({ um_templates: updated });
    onUpdate();
  };

  return (
    <div>
      <button onClick={() => setShowForm(!showForm)} style={{
        width: '100%', padding: 10, background: '#6366f1', border: 'none', borderRadius: 8,
        color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex',
        alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 12
      }}>
        <Plus size={16} /> New Template
      </button>

      {showForm && (
        <div style={{ background: '#1e293b', borderRadius: 10, padding: 14, marginBottom: 12 }}>
          <input placeholder="Template name" value={name} onChange={e => setName(e.target.value)}
            style={{ width: '100%', padding: 8, marginBottom: 8, background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#e2e8f0', fontSize: 12 }} />
          <input placeholder="Subject line" value={subject} onChange={e => setSubject(e.target.value)}
            style={{ width: '100%', padding: 8, marginBottom: 8, background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#e2e8f0', fontSize: 12 }} />
          <textarea placeholder="Email body..." value={body} onChange={e => setBody(e.target.value)}
            style={{ width: '100%', padding: 8, marginBottom: 8, background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#e2e8f0', fontSize: 12, minHeight: 80, resize: 'vertical' }} />
          <button onClick={saveTemplate} style={{
            width: '100%', padding: 8, background: '#10b981', border: 'none', borderRadius: 6,
            color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer'
          }}>Save Template</button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {templates.map(t => (
          <div key={t.id} style={{ background: '#1e293b', borderRadius: 8, padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <strong style={{ fontSize: 13, color: '#f8fafc' }}>{t.name}</strong>
              <button onClick={() => deleteTemplate(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                <Trash2 size={14} />
              </button>
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>{t.subject}</div>
          </div>
        ))}
        {templates.length === 0 && <p style={{ textAlign: 'center', color: '#64748b', fontSize: 12 }}>No templates yet</p>}
      </div>
    </div>
  );
};

const ScheduledTab: React.FC<{ scheduled: ScheduledEmail[]; onUpdate: () => void }> = ({ scheduled, onUpdate }) => {
  const cancelEmail = async (id: string) => {
    const current = await chrome.storage.local.get('um_scheduled');
    const updated = (current.um_scheduled || []).filter((e: ScheduledEmail) => e.id !== id);
    await chrome.storage.local.set({ um_scheduled: updated });
    await chrome.alarms.clear(`send-email-${id}`);
    onUpdate();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {scheduled.map(email => (
        <div key={email.id} style={{ background: '#1e293b', borderRadius: 8, padding: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <strong style={{ fontSize: 12, color: '#f8fafc' }}>{email.subject || '(No subject)'}</strong>
            <span style={{
              fontSize: 10, padding: '2px 8px', borderRadius: 10,
              background: email.status === 'pending' ? '#f59e0b22' : email.status === 'sent' ? '#10b98122' : '#ef444422',
              color: email.status === 'pending' ? '#f59e0b' : email.status === 'sent' ? '#10b981' : '#ef4444',
            }}>{email.status}</span>
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>To: {email.to}</div>
          <div style={{ fontSize: 11, color: '#64748b' }}>
            <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
            {new Date(email.scheduledAt).toLocaleString()}
          </div>
          {email.status === 'pending' && (
            <button onClick={() => cancelEmail(email.id)} style={{
              marginTop: 8, padding: '4px 10px', background: '#ef444422', border: '1px solid #ef4444',
              borderRadius: 6, color: '#ef4444', fontSize: 11, cursor: 'pointer'
            }}>Cancel</button>
          )}
        </div>
      ))}
      {scheduled.length === 0 && <p style={{ textAlign: 'center', color: '#64748b', fontSize: 12 }}>No scheduled emails</p>}
    </div>
  );
};

const TrackingTab: React.FC<{ tracking: TrackingEvent[] }> = ({ tracking }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {tracking.slice().reverse().map(event => (
        <div key={event.id} style={{ background: '#1e293b', borderRadius: 8, padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <CheckCircle size={16} color="#10b981" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: '#f8fafc' }}>{event.recipient}</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>{new Date(event.openedAt).toLocaleString()}</div>
          </div>
        </div>
      ))}
      {tracking.length === 0 && <p style={{ textAlign: 'center', color: '#64748b', fontSize: 12 }}>No tracking events yet</p>}
    </div>
  );
};

const SettingsTab: React.FC = () => {
  const [settings, setSettings] = useState({
    readReceipts: true,
    trackingEnabled: true,
    defaultScheduleTime: '09:00',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  useEffect(() => {
    chrome.storage.local.get('um_settings').then(res => {
      if (res.um_settings) setSettings(s => ({ ...s, ...res.um_settings }));
    });
  }, []);

  const updateSetting = async (key: string, value: any) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    await chrome.storage.local.set({ um_settings: updated });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SettingToggle label="Read Receipts" value={settings.readReceipts} onChange={v => updateSetting('readReceipts', v)} />
      <SettingToggle label="Email Open Tracking" value={settings.trackingEnabled} onChange={v => updateSetting('trackingEnabled', v)} />
      <div style={{ background: '#1e293b', borderRadius: 8, padding: 12 }}>
        <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Default Schedule Time</label>
        <input type="time" value={settings.defaultScheduleTime}
          onChange={e => updateSetting('defaultScheduleTime', e.target.value)}
          style={{ width: '100%', padding: 8, background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#e2e8f0', fontSize: 12 }} />
      </div>
      <div style={{ background: '#1e293b', borderRadius: 8, padding: 12 }}>
        <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Timezone</label>
        <input value={settings.timezone} readOnly
          style={{ width: '100%', padding: 8, background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#94a3b8', fontSize: 12 }} />
      </div>
    </div>
  );
};

const SettingToggle: React.FC<{ label: string; value: boolean; onChange: (v: boolean) => void }> = ({ label, value, onChange }) => (
  <div style={{ background: '#1e293b', borderRadius: 8, padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span style={{ fontSize: 13, color: '#f8fafc' }}>{label}</span>
    <button onClick={() => onChange(!value)} style={{
      width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
      background: value ? '#6366f1' : '#334155', position: 'relative', transition: 'background 0.2s'
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: 9, background: 'white',
        position: 'absolute', top: 2, left: value ? 20 : 2, transition: 'left 0.2s'
      }} />
    </button>
  </div>
);

const root = createRoot(document.getElementById('root')!);
root.render(<Popup />);
