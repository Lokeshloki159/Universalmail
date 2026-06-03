import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Lock, Code, Server, Puzzle, ShieldAlert, RefreshCw, Monitor } from 'lucide-react';

const challenges = [
  {
    icon: Layers,
    title: 'No Unified API',
    desc: 'Unlike Gmail\'s rich REST API, Outlook.com uses a mix of Graph API (for enterprise), legacy EWS, and web scraping. Yahoo and iCloud have no public APIs for email composition.',
  },
  {
    icon: Code,
    title: 'DOM Fragility',
    desc: 'Each provider uses different class names, shadow DOM structures, and React/Vue rendering cycles. Selectors break with every UI update. Requires resilient mutation observers.',
  },
  {
    icon: Lock,
    title: 'Authentication Maze',
    desc: 'Outlook: OAuth2 + MSAL. Yahoo: OAuth2 with custom scopes. iCloud: App-Specific Passwords + 2FA. IMAP: Plain auth + STARTTLS. No single auth flow works everywhere.',
  },
  {
    icon: Server,
    title: 'No Server-Side Hooks',
    desc: 'Gmail extensions can intercept API calls. Outlook web apps bundle JavaScript; content scripts must inject before hydration or observe DOM mutations post-render.',
  },
  {
    icon: Puzzle,
    title: 'Extension Store Policies',
    desc: 'Chrome Web Store requires manifest v3, which limits background script persistence. Content scripts cannot access page JavaScript directly without injected scripts.',
  },
  {
    icon: ShieldAlert,
    title: 'CSP & Security Headers',
    desc: 'Outlook and iCloud have strict Content Security Policies that block inline scripts and external images — critical for tracking pixels and injected UI.',
  },
];

const architectureLayers = [
  {
    title: 'Content Script Layer',
    color: 'from-indigo-500 to-indigo-600',
    items: ['Provider Detection', 'DOM Mutation Observers', 'Compose Window Injection', 'Toolbar Rendering'],
  },
  {
    title: 'Abstraction Layer',
    color: 'from-violet-500 to-violet-600',
    items: ['Unified DOM Selectors', 'Event Normalization', 'Provider-Specific Adapters', 'Shadow DOM Parsers'],
  },
  {
    title: 'Background Service',
    color: 'from-emerald-500 to-emerald-600',
    items: ['Alarm Scheduler', 'Storage Management', 'Notification Engine', 'Tracking Pixel Handler'],
  },
  {
    title: 'Popup Dashboard',
    color: 'from-amber-500 to-amber-600',
    items: ['Template Manager', 'Schedule Viewer', 'Tracking Analytics', 'Settings & CRM Sync'],
  },
];

const TechnicalArchitecture: React.FC = () => {
  return (
    <section id="architecture" className="py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-indigo-400 text-sm font-semibold tracking-wider uppercase">02. Technical Architecture</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Why Building for <span className="gradient-text">Non-Gmail</span> Is Hard
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            Gmail's API made it easy for Boomerang, Streak, and Mixmax to thrive. Every other provider
            is a unique technical challenge requiring browser extension ingenuity.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-5"
          >
            {challenges.map((c, i) => (
              <div key={i} className="glass-card rounded-xl p-5 flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <c.icon size={18} className="text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">{c.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-4"
          >
            <div className="glass-card rounded-2xl p-6 mb-2">
              <div className="flex items-center gap-3 mb-4">
                <Monitor size={20} className="text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Extension Architecture</h3>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                A layered approach that abstracts provider differences behind a unified interface.
              </p>
            </div>

            {architectureLayers.map((layer, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                <div className={`glass-card rounded-xl p-5 bg-gradient-to-r ${layer.color} bg-opacity-5 border-opacity-20`}>
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${layer.color}`} />
                    {layer.title}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {layer.items.map((item, j) => (
                      <span key={j} className="px-3 py-1 bg-slate-950/40 rounded-lg text-xs text-slate-300 border border-slate-700/50">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                {i < architectureLayers.length - 1 && (
                  <div className="flex justify-center py-2">
                    <RefreshCw size={14} className="text-slate-600 animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-card rounded-2xl p-8"
        >
          <h3 className="text-xl font-bold text-white mb-6">Provider-Specific Technical Requirements</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Provider</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Auth Method</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">DOM Strategy</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">CSP Level</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Outlook.com', 'OAuth2 / MSAL', 'MutationObserver + class selectors', 'Strict', 'High'],
                  ['Outlook Desktop (Web)', 'SSO / Corporate Auth', 'Shadow DOM traversal', 'Very Strict', 'Very High'],
                  ['Yahoo Mail', 'OAuth2', 'Aria-label + data-testid', 'Moderate', 'Medium'],
                  ['iCloud Mail', 'App-Specific Password', 'Contenteditable observers', 'Strict', 'High'],
                  ['AOL Mail', 'OAuth2', 'Similar to Yahoo', 'Moderate', 'Medium'],
                  ['Zoho Mail', 'OAuth2', 'Stable class names', 'Relaxed', 'Low'],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    {row.map((cell, j) => (
                      <td key={j} className={`py-3 px-4 ${j === 4 ? (cell === 'Very High' ? 'text-rose-400' : cell === 'High' ? 'text-amber-400' : 'text-emerald-400') : 'text-slate-300'}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechnicalArchitecture;
