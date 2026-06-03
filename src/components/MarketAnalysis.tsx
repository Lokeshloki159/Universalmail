import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Building2, AlertTriangle, BarChart3, Globe } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const marketData = [
  { name: 'Gmail', users: 1800, color: '#ef4444' },
  { name: 'Outlook', users: 400, color: '#6366f1' },
  { name: 'Yahoo', users: 225, color: '#8b5cf6' },
  { name: 'iCloud', users: 85, color: '#10b981' },
  { name: 'AOL/Zoho', users: 60, color: '#f59e0b' },
];

const painPoints = [
  {
    icon: AlertTriangle,
    title: 'No Schedule Send',
    desc: 'Outlook desktop and many web clients lack native scheduling. Users must stay online to hit "send" at the right moment.',
  },
  {
    icon: BarChart3,
    title: 'Zero Email Tracking',
    desc: 'Business users have no way to know if proposals, invoices, or critical emails were opened. Gmail tools don\'t work here.',
  },
  {
    icon: Users,
    title: 'No Template System',
    desc: 'Repetitive sales outreach, support responses, and HR communications are typed from scratch every single time.',
  },
  {
    icon: Building2,
    title: 'Enterprise Lock-in',
    desc: 'IT departments mandate Outlook/Exchange for security. Users are trapped without the productivity tools they need.',
  },
  {
    icon: Globe,
    title: 'Fragmented Experience',
    desc: 'Features vary wildly between Outlook desktop, Outlook.com, OWA, and mobile. No consistent productivity layer.',
  },
  {
    icon: TrendingUp,
    title: 'CRM Disconnect',
    desc: 'Sales teams using Outlook can\'t auto-log emails to Salesforce, HubSpot, or Pipedrive without expensive enterprise add-ins.',
  },
];

const MarketAnalysis: React.FC = () => {
  return (
    <section id="market" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-indigo-400 text-sm font-semibold tracking-wider uppercase">01. Market Analysis</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            A <span className="gradient-text">$2.4B+</span> Underserved Market
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            Over 770 million business email users are on non-Gmail providers. They represent the
            largest untapped productivity software market in existence.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass-card rounded-2xl p-8"
          >
            <h3 className="text-xl font-bold text-white mb-2">Business Email Market Share (Millions)</h3>
            <p className="text-slate-400 text-sm mb-6">Active business/professional email accounts by provider</p>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={marketData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={13} width={80} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' }}
                  formatter={(value: any) => [`${value}M users`, 'Users']}
                />
                <Bar dataKey="users" radius={[0, 6, 6, 0]} barSize={28}>
                  {marketData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <Users size={24} className="text-indigo-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">770M+</div>
                  <div className="text-slate-400 text-sm">Non-Gmail business users globally</div>
                </div>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <Building2 size={24} className="text-violet-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">$2.4B</div>
                  <div className="text-slate-400 text-sm">Est. TAM for non-Gmail email productivity</div>
                </div>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp size={24} className="text-emerald-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">0</div>
                  <div className="text-slate-400 text-sm">Meaningful competitors in this space</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="text-2xl font-bold text-white text-center mb-10">Why This Market Has Been Ignored</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {painPoints.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card rounded-xl p-6 hover:border-indigo-500/30 transition-colors"
              >
                <point.icon size={22} className="text-indigo-400 mb-4" />
                <h4 className="text-white font-semibold mb-2">{point.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{point.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MarketAnalysis;
