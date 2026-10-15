import React from 'react';
import { Sparkles, ShieldCheck, UploadCloud, Check, Send, Globe, Rss } from 'lucide-react';
import { Category } from '../types/blog';

interface FooterProps {
  onSelectCategory: (cat: Category) => void;
  onOpenSeoInspector: () => void;
  onOpenVercelDeploy: () => void;
  onNavigateHome: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenSeoInspector,
  onOpenVercelDeploy,
  onNavigateHome,
}) => {
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
      {/* Newsletter Banner */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              The Lumina Digest
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Architectural insights delivered to your inbox
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              Join 42,000+ senior engineers, architects, and founders receiving our weekly deep dives.
            </p>

            <form onSubmit={handleSubscribe} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@company.com"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95"
              >
                <Send className="w-4 h-4" /> Subscribe
              </button>
            </form>

            {subscribed && (
              <div className="mt-3 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-center gap-1.5 animate-in fade-in">
                <Check className="w-4 h-4" /> Welcome aboard! Check your inbox for the latest edition.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div 
              onClick={onNavigateHome}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-editorial text-2xl font-bold text-slate-900 dark:text-white">
                Lumina
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-editorial">
              A high-performance modern editorial publication covering systems architecture, AI interfaces, and frontend engineering.
            </p>
            <div className="pt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-300/40">
                <ShieldCheck className="w-3.5 h-3.5" /> 100/100 SEO Score
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 1155 1000">
                  <path d="m577.3 0 577.4 1000H0z" />
                </svg>
                Vercel Ready
              </span>
            </div>
          </div>

          {/* Col 2: Topics */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Editorial Topics
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button 
                  onClick={() => onSelectCategory('Engineering')} 
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Engineering & Frameworks
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('Artificial Intelligence')} 
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Artificial Intelligence
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('System Architecture')} 
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  System Architecture & CRDTs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('SEO & Performance')} 
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  SEO & Core Web Vitals
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('Design Systems')} 
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Design Systems & Tokens
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: SEO & Platform Suite */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              SEO & Platform Suite
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button 
                  onClick={onOpenSeoInspector}
                  className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  SEO Health Auditor
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenSeoInspector}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Google SERP Simulator
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenSeoInspector}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Schema.org JSON-LD Generator
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenSeoInspector}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Dynamic XML Sitemap
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenSeoInspector}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Robots.txt Directive
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Deployment & Vercel */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Deployment & Host
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button 
                  onClick={onOpenVercelDeploy}
                  className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-indigo-500" />
                  Vercel Deployment Guide
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenVercelDeploy}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Vercel SPA Rewrites (vercel.json)
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenVercelDeploy}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Export Articles as Markdown (.md)
                </button>
              </li>
              <li>
                <a 
                  href="https://vercel.com/docs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Vercel Official Docs
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Lumina Magazine. High-Performance Editorial Publishing Platform.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-emerald-500" /> Edge CDN Active
            </span>
            <span>•</span>
            <span>OpenGraph 2.0 Enabled</span>
            <span>•</span>
            <span>Schema.org Validated</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
