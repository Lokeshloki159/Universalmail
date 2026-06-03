import React from 'react';
import { motion } from 'framer-motion';
import { Target, Rocket, Layers, Zap, Shield, Globe } from 'lucide-react';

const phases = [
  {
    phase: 'Phase 1',
    title: 'Outlook.com Foundation',
    timeline: 'Months 1–3',
    icon: Target,
    color: 'indigo',
    goals: [
      'Build core content script for Outlook.com (modern UI)',
      'Implement Schedule Send via background alarms',
      'Template system with popup management',
      'Basic open tracking with pixel injection',
      'Chrome Web Store MVP launch',
    ],
    why: 'Outlook.com has the largest non-Gmail business user base and a relatively stable modern React UI. Success here validates the model.',
  },
  {
    phase: 'Phase 2',
    title: 'Yahoo + iCloud Expansion',
    timeline: 'Months 4–6',
    icon: Rocket,
    color: 'violet',
    goals: [
      'Port content script to Yahoo Mail web interface',
      'Add iCloud Mail support with app-specific password flow',
      'Snooze functionality across all supported providers',
      'Follow-up sequences (auto-send if no reply)',
      'Firefox extension port',
    ],
    why: 'Yahoo and iCloud share similar DOM architectures (contenteditable editors). Porting teaches us patterns for the generic IMAP adapter.',
  },
  {
    phase: 'Phase 3',
    title: 'Enterprise & CRM',
    timeline: 'Months 7–9',
    icon: Layers,
    color: 'emerald',
    goals: [
      'Salesforce & HubSpot CRM integration',
      'Outlook Desktop (OWA) support via Edge/Chrome',
      'Team template sharing and admin controls',
      'Read receipts with aggregated analytics dashboard',
      'Enterprise SSO (SAML/OIDC) support',
    ],
    why: 'CRM integration is the highest-value B2B feature. Outlook Desktop support unlocks the enterprise market where IT mandates the client.',
  },
  {
    phase: 'Phase 4',
    title: 'AI & Scale',
    timeline: 'Months 10–12',
    icon: Zap,
    color: 'amber',
    goals: [
      'AI email composition assistant',
      'Smart inbox filtering and prioritization',
      'Generic IMAP/POP3 adapter for any provider',
      'Mobile companion app (iOS/Android)',
      'API for third-party integrations',
    ],
    why: 'AI features justify premium pricing. Generic IMAP support captures the long tail of niche providers. Mobile completes the ecosystem.',
  },
];

const ColorMap: Record<string, string> = {
  indigo: 'from-indigo-500 to-indigo-600 border-indigo-500/30 text-indigo-300',
  violet: 'from-violet-500 to-violet-600 border-violet-500/30 text-violet-300',
  emerald: 'from-emerald-500 to-emerald-600 border-emerald-500/30 text-emerald-300',
  amber: 'from-amber-500 to-amber-600 border-amber-500/30 text-amber-300',
};

const DevelopmentRoadmap: React.FC = () => {
  return (
    <section id="roadmap" className="py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-indigo-400 text-sm font-semibold tracking-wider uppercase">05. Development Roadmap</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            12-Month <span className="gradient-text">Build Sequence</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            Sequencing matters. Each phase builds on the previous, expanding provider support
            while deepening feature value for the most critical user segments.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 via-violet-500/50 to-amber-500/50 hidden md:block" />

          <div className="space-y-12">
            {phases.map((phase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`relative flex flex-col md:flex-row ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-start`}
              >
                {/* Timeline dot */}
                <div className="absolute left-6 lg:left-1/2 top-6 w-4 h-4 -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 border-2 border-slate-950 hidden md:block z-10" />

                {/* Content */}
                <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 lg:pr-16' : 'md:pl-12 lg:pl-16'}`}>
                  <div className={`glass-card rounded-2xl p-6 border ${ColorMap[phase.color].split(' ').pop()}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${ColorMap[phase.color].split(' ').slice(0, 2).join(' ')} flex items-center justify-center`}>
                        <phase.icon size={20} className="text-white" />
                      </div>
                      <div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${ColorMap[phase.color].split(' ').pop()}`}>{phase.phase}</span>
                        <h3 className="text-white font-bold text-lg">{phase.title}</h3>
                      </div>
                    </div>

                    <div className="text-sm text-slate-400 mb-4 font-medium">{phase.timeline}</div>

                    <ul className="space-y-2 mb-5">
                      {phase.goals.map((goal, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-gradient-to-r ${ColorMap[phase.color].split(' ').slice(0, 2).join(' ')}`} />
                          {goal}
                        </li>
                      ))}
                    </ul>

                    <div className="bg-slate-950/40 rounded-lg p-3 border border-slate-800/50">
                      <span className="text-xs text-slate-500 font-semibold uppercase">Why this order</span>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">{phase.why}</p>
                    </div>
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-16 glass-card rounded-2xl p-8"
        >
          <h3 className="text-xl font-bold text-white mb-6">Technical Approach: Why Chrome Extension First</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Globe,
                title: 'No Server Required',
                desc: 'Scheduling and storage use Chrome alarms and local storage. No backend infrastructure needed for MVP, reducing cost and complexity.',
              },
              {
                icon: Shield,
                title: 'No IT Approval',
                desc: 'Users install directly from Chrome Web Store. No enterprise procurement, no security review, no Exchange admin approval needed.',
              },
              {
                icon: Rocket,
                title: 'Fastest Time-to-Value',
                desc: 'Content scripts inject directly into the email client users already know. Zero learning curve, zero migration friction.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-slate-950/30 rounded-xl p-5">
                <item.icon size={22} className="text-indigo-400 mb-3" />
                <h4 className="text-white font-semibold mb-2">{item.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DevelopmentRoadmap;
