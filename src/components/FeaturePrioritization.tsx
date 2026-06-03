import React from 'react';
import { motion } from 'framer-motion';
import { Clock, FileText, Bell, Eye, Link2, BarChart3, Mail, Filter, Sparkles, Shield } from 'lucide-react';

const features = [
  {
    rank: 1,
    icon: Clock,
    title: 'Schedule Send / Send Later',
    demand: 98,
    feasibility: 85,
    desc: 'The #1 requested feature. Users want to draft emails and have them sent at optimal times. Implemented via background alarms + auto-click send buttons at scheduled time.',
    unique: false,
  },
  {
    rank: 2,
    icon: FileText,
    title: 'Email Templates with Variables',
    demand: 94,
    feasibility: 90,
    desc: 'Save reusable emails with {{variable}} substitution. Critical for sales, support, and recruiting teams. Stored in extension local storage with quick-insert toolbar.',
    unique: false,
  },
  {
    rank: 3,
    icon: Eye,
    title: 'Email Open Tracking',
    demand: 91,
    feasibility: 70,
    desc: 'Inject 1x1 tracking pixels into email bodies. Requires CSP bypass strategies and a tracking server. Most valuable for sales professionals on Outlook.',
    unique: false,
  },
  {
    rank: 4,
    icon: Bell,
    title: 'Snooze & Reminders',
    demand: 88,
    feasibility: 75,
    desc: 'Temporarily hide emails from inbox and resurface them later. For web clients without native snooze, we move emails to a "Snoozed" folder and move back via alarm.',
    unique: false,
  },
  {
    rank: 5,
    icon: Link2,
    title: 'CRM Integration (Salesforce/HubSpot)',
    demand: 82,
    feasibility: 65,
    desc: 'Auto-log sent emails to CRM contacts. Read contact data from CRM APIs and suggest templates based on deal stage. Massive differentiator for enterprise sales.',
    unique: true,
    note: 'Unique opportunity: Gmail CRM extensions exist but Outlook integration is fragmented and expensive.',
  },
  {
    rank: 6,
    icon: BarChart3,
    title: 'Read Receipts & Analytics',
    demand: 79,
    feasibility: 72,
    desc: 'Request read receipts on sent emails and aggregate open/click data in a dashboard. Works by wrapping links and injecting tracking pixels.',
    unique: false,
  },
  {
    rank: 7,
    icon: Mail,
    title: 'Follow-up Sequences',
    demand: 76,
    feasibility: 60,
    desc: 'Automated multi-touch email sequences with delays and conditions. "If no reply in 3 days, send follow-up." Complex but extremely valuable for outbound sales.',
    unique: false,
  },
  {
    rank: 8,
    icon: Filter,
    title: 'Smart Inbox Filtering',
    demand: 71,
    feasibility: 55,
    desc: 'AI-powered categorization of incoming emails by priority, sentiment, and action required. Can use on-device ML or lightweight cloud NLP APIs.',
    unique: true,
    note: 'Unique opportunity: No non-Gmail client has native smart filtering comparable to Gmail tabs.',
  },
  {
    rank: 9,
    icon: Sparkles,
    title: 'AI Email Composition',
    demand: 68,
    feasibility: 80,
    desc: 'Generate email drafts from bullet points or prompts using LLM APIs. Insert directly into compose windows. High feasibility, growing demand.',
    unique: false,
  },
  {
    rank: 10,
    icon: Shield,
    title: 'Enterprise Compliance Mode',
    demand: 62,
    feasibility: 50,
    desc: 'GDPR/SOX-compliant data handling, audit logs, admin controls, and on-premise deployment option. Critical for financial services and healthcare.',
    unique: true,
    note: 'Unique opportunity: Most Gmail productivity tools are consumer-first. Enterprise compliance is a massive B2B differentiator.',
  },
];

const FeaturePrioritization: React.FC = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-indigo-400 text-sm font-semibold tracking-wider uppercase">03. Feature Prioritization</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Top 10 Features by <span className="gradient-text">Demand & Feasibility</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            Ranked by user demand (survey data + feature request volume) and technical feasibility
            for cross-provider browser extension implementation.
          </p>
        </motion.div>

        <div className="space-y-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`glass-card rounded-xl p-6 ${feature.unique ? 'border-l-4 border-l-violet-500' : ''}`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                <div className="flex items-center gap-4 lg:w-80 flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <feature.icon size={22} className="text-indigo-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">#{feature.rank}</span>
                      <h3 className="text-white font-semibold">{feature.title}</h3>
                    </div>
                    {feature.unique && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-violet-500/10 text-violet-300 text-xs rounded-full border border-violet-500/20">
                        Unique Opportunity
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{feature.desc}</p>
                  {feature.note && (
                    <p className="text-violet-300 text-xs italic mb-3">{feature.note}</p>
                  )}
                </div>

                <div className="lg:w-48 flex-shrink-0 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">User Demand</span>
                      <span className="text-white font-medium">{feature.demand}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${feature.demand}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Feasibility</span>
                      <span className="text-white font-medium">{feature.feasibility}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${feature.feasibility}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturePrioritization;
