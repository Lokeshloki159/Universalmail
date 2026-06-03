import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, CheckCircle, MinusCircle, AlertCircle } from 'lucide-react';

const competitors = [
  {
    name: 'Boomerang',
    type: 'Schedule & Tracking',
    gmail: 'full',
    outlook: 'none',
    yahoo: 'none',
    pricing: '$4.99–$49.99/mo',
    limitation: 'Outlook support was deprecated. Now Gmail-only.',
  },
  {
    name: 'Streak',
    type: 'CRM in Inbox',
    gmail: 'full',
    outlook: 'none',
    yahoo: 'none',
    pricing: '$15–$129/user/mo',
    limitation: 'Deep Gmail API integration makes porting impossible.',
  },
  {
    name: 'Mixmax',
    type: 'Sales Engagement',
    gmail: 'full',
    outlook: 'beta',
    yahoo: 'none',
    pricing: '$9–$65/user/mo',
    limitation: 'Outlook "beta" has been in limited release for 3+ years with severe feature gaps.',
  },
  {
    name: 'Superhuman',
    type: 'Premium Email Client',
    gmail: 'full',
    outlook: 'beta',
    yahoo: 'none',
    pricing: '$30/user/mo',
    limitation: 'Outlook support is invite-only, lacks key features, and requires migration to their client.',
  },
  {
    name: 'Mailbutler',
    type: 'Productivity Suite',
    gmail: 'partial',
    outlook: 'partial',
    yahoo: 'none',
    pricing: '$4.95–$32.95/mo',
    limitation: 'Apple Mail-first. Outlook support is a separate plugin with limited features. No web client support.',
  },
  {
    name: 'SaneBox',
    type: 'Inbox Filtering',
    gmail: 'full',
    outlook: 'full',
    yahoo: 'full',
    pricing: '$7–$36/mo',
    limitation: 'Server-side only. No compose features, scheduling, templates, or tracking.',
  },
  {
    name: 'Microsoft Viva',
    type: 'Enterprise Add-in',
    gmail: 'none',
    outlook: 'full',
    yahoo: 'none',
    pricing: '$4/user/mo add-on',
    limitation: 'Requires Microsoft 365 E5 license. No scheduling, tracking, or templates for individual users.',
  },
];

const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'full') return <CheckCircle size={16} className="text-emerald-400" />;
  if (status === 'partial') return <MinusCircle size={16} className="text-amber-400" />;
  if (status === 'beta') return <AlertCircle size={16} className="text-amber-400" />;
  return <XCircle size={16} className="text-rose-400" />;
};

const CompetitiveLandscape: React.FC = () => {
  return (
    <section id="competition" className="py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-indigo-400 text-sm font-semibold tracking-wider uppercase">04. Competitive Landscape</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            The <span className="gradient-text">Gmail-Only</span> Gap
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            Every major email productivity tool either ignores non-Gmail users entirely or offers
            severely limited functionality. This is our strategic opening.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-card rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900/50">
                  <th className="text-left py-4 px-5 text-slate-300 font-semibold">Tool</th>
                  <th className="text-left py-4 px-5 text-slate-300 font-semibold">Category</th>
                  <th className="text-center py-4 px-5 text-slate-300 font-semibold">Gmail</th>
                  <th className="text-center py-4 px-5 text-slate-300 font-semibold">Outlook</th>
                  <th className="text-center py-4 px-5 text-slate-300 font-semibold">Yahoo</th>
                  <th className="text-left py-4 px-5 text-slate-300 font-semibold">Pricing</th>
                  <th className="text-left py-4 px-5 text-slate-300 font-semibold">Key Limitation</th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((comp, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-4 px-5">
                      <span className="font-semibold text-white">{comp.name}</span>
                    </td>
                    <td className="py-4 px-5 text-slate-400">{comp.type}</td>
                    <td className="py-4 px-5 text-center"><StatusIcon status={comp.gmail} /></td>
                    <td className="py-4 px-5 text-center"><StatusIcon status={comp.outlook} /></td>
                    <td className="py-4 px-5 text-center"><StatusIcon status={comp.yahoo} /></td>
                    <td className="py-4 px-5 text-slate-300">{comp.pricing}</td>
                    <td className="py-4 px-5 text-slate-400 text-xs max-w-xs">{comp.limitation}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          {[
            {
              title: 'Differentiation #1',
              desc: 'Universal provider support from day one. Not a Gmail tool with Outlook bolted on — built for multi-provider from the ground up.',
            },
            {
              title: 'Differentiation #2',
              desc: 'Browser extension approach means no email migration, no new app to learn, and no IT approval required. Works inside existing workflows.',
            },
            {
              title: 'Differentiation #3',
              desc: 'Aggressive pricing undercutting enterprise add-ins. Target $8–$15/user vs. $30–$65 for existing partial solutions.',
            },
          ].map((diff, i) => (
            <div key={i} className="glass-card rounded-xl p-6 border-l-4 border-l-indigo-500">
              <h4 className="text-white font-semibold mb-2">{diff.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">{diff.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CompetitiveLandscape;
