import React from 'react';
import { Mail, Globe, MessageCircle, Users } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
              <Mail size={18} className="text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">UniversalMail</span>
              <p className="text-slate-500 text-xs">Email productivity for everyone</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a href="#market" className="text-slate-400 hover:text-white text-sm transition-colors">Market</a>
            <a href="#architecture" className="text-slate-400 hover:text-white text-sm transition-colors">Architecture</a>
            <a href="#features" className="text-slate-400 hover:text-white text-sm transition-colors">Features</a>
            <a href="#roadmap" className="text-slate-400 hover:text-white text-sm transition-colors">Roadmap</a>
            <a href="#pricing" className="text-slate-400 hover:text-white text-sm transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
              <MessageCircle size={16} />
            </a>
            <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
              <Users size={16} />
            </a>
            <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
              <Globe size={16} />
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-600 text-sm">
            UniversalMail Strategy Document. Built as a comprehensive product strategy and Chrome extension prototype.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
