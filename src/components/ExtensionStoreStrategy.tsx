import React from 'react';
import { motion } from 'framer-motion';
import { Search, Tag, Image, MessageSquare, Star, TrendingUp, Target, Award } from 'lucide-react';

const asoKeywords = [
  { keyword: 'outlook email scheduler', volume: 'High', competition: 'Low' },
  { keyword: 'schedule emails outlook', volume: 'High', competition: 'Low' },
  { keyword: 'yahoo mail schedule send', volume: 'Medium', competition: 'None' },
  { keyword: 'email tracking outlook', volume: 'High', competition: 'Medium' },
  { keyword: 'outlook email templates', volume: 'Medium', competition: 'Low' },
  { keyword: 'snooze emails outlook', volume: 'Medium', competition: 'Low' },
  { keyword: 'email productivity outlook', volume: 'Medium', competition: 'Low' },
  { keyword: 'send later outlook web', volume: 'Medium', competition: 'None' },
  { keyword: 'boomerang for outlook', volume: 'High', competition: 'Medium' },
  { keyword: 'outlook crm integration', volume: 'Medium', competition: 'Medium' },
];

const messagingPillars = [
  {
    icon: Target,
    title: 'Lead with the Problem',
    desc: '"Tired of Gmail-only email tools that ignore Outlook users?" This immediately resonates with the 400M+ Outlook users who feel excluded.',
  },
  {
    icon: MessageSquare,
    title: 'Speak Their Language',
    desc: 'Use terms like "OWA", "Outlook Web Access", "Exchange", and "corporate email" in descriptions. These are the exact search terms IT professionals use.',
  },
  {
    icon: Image,
    title: 'Screenshot Strategy',
    desc: 'Show the extension working INSIDE Outlook.com and Yahoo Mail. Not a separate app. Users need to see it augmenting their existing workflow.',
  },
  {
    icon: Award,
    title: 'Social Proof Targeting',
    desc: 'Launch on Product Hunt with "Outlook users finally get Boomerang" angle. Target Outlook-focused subreddits, LinkedIn sales groups, and Microsoft communities.',
  },
];

const screenshotGuidelines = [
  'Screenshot 1: Hero showing toolbar injected into Outlook compose window',
  'Screenshot 2: Schedule send modal with calendar picker',
  'Screenshot 3: Template picker overlay in Yahoo Mail',
  'Screenshot 4: Tracking dashboard showing open rates',
  'Screenshot 5: Before/after: cluttered inbox vs. snoozed & organized',
];

const ExtensionStoreStrategy: React.FC = () => {
  return (
    <section id="store" className="py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-indigo-400 text-sm font-semibold tracking-wider uppercase">07. Extension Store Strategy</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Overcoming the <span className="gradient-text">"Gmail-Only"</span> Perception
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            The Chrome Web Store is dominated by Gmail-centric tools. Breaking through requires
            precise ASO, targeted messaging, and visual proof that we work where others don't.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Search size={20} className="text-indigo-400" />
              <h3 className="text-xl font-bold text-white">ASO Keyword Strategy</h3>
            </div>
            <div className="glass-card rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-900/50">
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Keyword</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Volume</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Competition</th>
                  </tr>
                </thead>
                <tbody>
                  {asoKeywords.map((kw, i) => (
                    <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 text-slate-300 font-medium">{kw.keyword}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          kw.volume === 'High' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>{kw.volume}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          kw.competition === 'None' ? 'bg-emerald-500/10 text-emerald-400' :
                          kw.competition === 'Low' ? 'bg-indigo-500/10 text-indigo-400' :
                          'bg-amber-500/10 text-amber-400'
                        }`}>{kw.competition}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <Tag size={20} className="text-indigo-400" />
              <h3 className="text-xl font-bold text-white">Store Listing Copy</h3>
            </div>

            <div className="glass-card rounded-xl p-6">
              <div className="text-xs text-slate-500 font-semibold uppercase mb-2">Title (48 chars max)</div>
              <p className="text-white font-medium mb-4">UniversalMail: Schedule & Track for Outlook</p>

              <div className="text-xs text-slate-500 font-semibold uppercase mb-2">Subtitle</div>
              <p className="text-slate-300 text-sm mb-4">
                The email productivity tool Gmail users love — now for Outlook, Yahoo, iCloud & more.
                Schedule sends, track opens, use templates, and snooze emails.
              </p>

              <div className="text-xs text-slate-500 font-semibold uppercase mb-2">Key Bullets</div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <Star size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  Schedule emails to send later on Outlook.com, Yahoo Mail, and iCloud
                </li>
                <li className="flex items-start gap-2">
                  <Star size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  Track email opens and clicks with real-time notifications
                </li>
                <li className="flex items-start gap-2">
                  <Star size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  Save and insert email templates with one click
                </li>
                <li className="flex items-start gap-2">
                  <Star size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  Snooze emails to resurface at the perfect time
                </li>
                <li className="flex items-start gap-2">
                  <Star size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  Sync with Salesforce and HubSpot (Pro plan)
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <h3 className="text-xl font-bold text-white text-center mb-8">Messaging Pillars</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {messagingPillars.map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card rounded-xl p-6"
              >
                <pillar.icon size={22} className="text-indigo-400 mb-4" />
                <h4 className="text-white font-semibold mb-2">{pillar.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-card rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Image size={20} className="text-indigo-400" />
            <h3 className="text-xl font-bold text-white">Screenshot & Video Strategy</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {screenshotGuidelines.map((item, i) => (
              <div key={i} className="bg-slate-950/40 rounded-lg p-4 border border-slate-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold uppercase">Screenshot</span>
                </div>
                <p className="text-slate-300 text-sm">{item.replace('Screenshot ' + (i + 1) + ': ', '')}</p>
              </div>
            ))}
            <div className="bg-slate-950/40 rounded-lg p-4 border border-slate-800/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold flex items-center justify-center">
                  V
                </span>
                <span className="text-xs text-slate-500 font-semibold uppercase">Promo Video</span>
              </div>
              <p className="text-slate-300 text-sm">30-second demo showing scheduling in Outlook, then switching to Yahoo — same extension, same features.</p>
            </div>
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
            { icon: TrendingUp, label: 'Launch Strategy', desc: 'Soft launch on Chrome Web Store with "Outlook email scheduler" as primary keyword. Gather reviews and iterate.' },
            { icon: Target, label: 'Community Seeding', desc: 'Post in r/Outlook, r/sales, Microsoft Tech Community, and LinkedIn sales groups with genuine problem-solution stories.' },
            { icon: Award, label: 'Review Generation', desc: 'Email free users after 3 days of use asking for a review. Offer 1 month Pro for verified reviews with screenshots.' },
          ].map((item, i) => (
            <div key={i} className="glass-card rounded-xl p-6">
              <item.icon size={22} className="text-indigo-400 mb-3" />
              <h4 className="text-white font-semibold mb-2">{item.label}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ExtensionStoreStrategy;
