import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles, Shield, Zap, Globe } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8"
        >
          <Sparkles size={14} />
          The email productivity tool Gmail users have — now for everyone else
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
        >
          Email Productivity for{' '}
          <span className="gradient-text">Outlook, Yahoo &amp; Beyond</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Virtually every email productivity tool is built exclusively for Gmail's API.
          Business users locked into Outlook, Yahoo, and IMAP clients have been left behind.
          <strong className="text-slate-200"> Until now.</strong>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          <a
            href="#market"
            className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all text-lg"
          >
            Explore the Strategy
          </a>
          <a
            href="#roadmap"
            className="px-8 py-4 bg-slate-800 text-slate-200 font-semibold rounded-xl border border-slate-700 hover:border-slate-600 hover:bg-slate-750 transition-all text-lg"
          >
            View Roadmap
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {[
            { icon: Globe, label: 'Multi-Provider', desc: 'Outlook, Yahoo, iCloud, AOL, Zoho & more' },
            { icon: Zap, label: 'Schedule & Snooze', desc: 'Send later, reminders, and inbox zero' },
            { icon: Shield, label: 'Track & Template', desc: 'Read receipts, templates, CRM sync' },
          ].map((item, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 text-left">
              <item.icon size={24} className="text-indigo-400 mb-3" />
              <h3 className="text-white font-semibold mb-1">{item.label}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16"
        >
          <a href="#market" className="inline-flex flex-col items-center text-slate-500 hover:text-slate-300 transition-colors">
            <span className="text-xs mb-2">Scroll to explore</span>
            <ArrowDown size={20} className="animate-bounce" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
