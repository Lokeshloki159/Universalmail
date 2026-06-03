import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Building2, User, Users } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    icon: User,
    price: '$0',
    period: 'forever',
    description: 'For individual users trying out the basics',
    color: 'from-slate-600 to-slate-700',
    features: [
      { text: '5 scheduled emails/month', included: true },
      { text: '3 email templates', included: true },
      { text: 'Basic open tracking', included: true },
      { text: '1 provider (Outlook or Yahoo)', included: true },
      { text: 'Snooze up to 5 emails', included: true },
      { text: 'Follow-up sequences', included: false },
      { text: 'CRM integration', included: false },
      { text: 'Team sharing', included: false },
    ],
    cta: 'Install Free',
    popular: false,
  },
  {
    name: 'Pro',
    icon: Users,
    price: '$8',
    period: '/month',
    description: 'For power users who live in email',
    color: 'from-indigo-500 to-violet-500',
    features: [
      { text: 'Unlimited scheduled emails', included: true },
      { text: 'Unlimited templates', included: true },
      { text: 'Advanced tracking + analytics', included: true },
      { text: 'All providers (Outlook, Yahoo, iCloud, AOL)', included: true },
      { text: 'Unlimited snooze', included: true },
      { text: '3-step follow-up sequences', included: true },
      { text: 'CRM integration', included: false },
      { text: 'Team sharing', included: false },
    ],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Business',
    icon: Building2,
    price: '$15',
    period: '/user/month',
    description: 'For teams that need visibility and control',
    color: 'from-emerald-500 to-teal-500',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Salesforce & HubSpot sync', included: true },
      { text: 'Team template library', included: true },
      { text: 'Admin dashboard & analytics', included: true },
      { text: 'SSO & SAML authentication', included: true },
      { text: 'Unlimited follow-up sequences', included: true },
      { text: 'Priority support', included: true },
      { text: 'Custom onboarding', included: true },
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

const b2bStrategies = [
  {
    title: 'Land & Expand',
    desc: 'Individual users install the free extension. When they hit limits, upgrade to Pro. Teams discover it organically and request Business tier.',
  },
  {
    title: 'Sales Team Vertical',
    desc: 'Target SDRs and AEs on Outlook with CRM integration as the hook. Partner with Salesforce AppExchange and HubSpot marketplace.',
  },
  {
    title: 'IT Admin Channel',
    desc: 'Publish in Microsoft AppSource for managed deployment. Offer centralized billing and compliance reporting for enterprise procurement.',
  },
  {
    title: 'Freemium Virality',
    desc: 'Free tier includes "Sent with UniversalMail" signature. Every email sent is an advertisement. Pro removes signature.',
  },
];

const MonetizationStrategy: React.FC = () => {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-indigo-400 text-sm font-semibold tracking-wider uppercase">06. Monetization Strategy</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Pricing That <span className="gradient-text">Undercuts Enterprise</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            Business users are willing to pay for productivity — but existing solutions charge
            $30–$65/user for partial functionality. We win on value and completeness.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative glass-card rounded-2xl p-6 ${plan.popular ? 'border-2 border-indigo-500/50 scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xs font-bold rounded-full">
                  Most Popular
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                  <plan.icon size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{plan.name}</h3>
                  <p className="text-slate-400 text-xs">{plan.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-slate-400 text-sm">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm">
                    {feature.included ? (
                      <Check size={16} className="text-emerald-400 flex-shrink-0" />
                    ) : (
                      <X size={16} className="text-slate-600 flex-shrink-0" />
                    )}
                    <span className={feature.included ? 'text-slate-300' : 'text-slate-600'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {plan.name === 'Pro' ? (
                <a
                  href="https://universalmail.onrender.com/api/billing/checkout"
                  className={`w-full block text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:shadow-lg hover:shadow-indigo-500/25'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  {plan.cta}
                </a>
              ) : (
                <button
                  onClick={() => {
                    if (plan.name === 'Starter') {
                      alert('To install the extension, open chrome://extensions/, enable Developer mode, and Load Unpacked from /extension.');
                    } else {
                      alert('Contact sales at enterprise@universalmail.io');
                    }
                  }}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:shadow-lg hover:shadow-indigo-500/25'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  {plan.cta}
                </button>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="text-2xl font-bold text-white text-center mb-10">B2B Sales Strategies</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {b2bStrategies.map((strategy, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card rounded-xl p-6"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
                  <span className="text-indigo-400 font-bold text-sm">{i + 1}</span>
                </div>
                <h4 className="text-white font-semibold mb-2">{strategy.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{strategy.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MonetizationStrategy;
