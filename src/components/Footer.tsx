import React from 'react';
import { ShieldCheck, UploadCloud, Check, Send, Globe } from 'lucide-react';
import { Category } from '../types/blog';

interface FooterProps {
  onSelectCategory: (cat: Category) => void;
  onNavigateRoute: (routePath: string) => void;
  onOpenSeoInspector: () => void;
  onOpenVercelDeploy: () => void;
  onNavigateHome: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onNavigateRoute,
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
    <footer className="border-t border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-colors">
      {/* Newsletter Dispatch */}
      <div className="border-b border-stone-200 dark:border-zinc-800 bg-stone-50/60 dark:bg-zinc-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
              The KURA Architectural Dispatch
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
              Quarterly studies on materiality, joinery, and reduction
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-zinc-400 mt-2 font-editorial">
              Join 18,000+ architects, interior designers, and craftsman builders reading our technical monographs.
            </p>

            <form onSubmit={handleSubscribe} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="studio@architecture.com"
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-500 font-mono"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 font-semibold text-xs sm:text-sm shadow-xs transition-all"
              >
                <Send className="w-4 h-4" /> Receive Dispatch
              </button>
            </form>

            {subscribed && (
              <div className="mt-3 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-center gap-1.5 animate-in fade-in">
                <Check className="w-4 h-4" /> Welcome to KURA. Your subscription has been confirmed.
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
              title="Return to KURA journal overview"
            >
              <div className="w-7 h-7 rounded bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 flex items-center justify-center text-xs font-mono font-bold">
                倉
              </div>
              <span className="font-editorial text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-wider">
                KURA
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-zinc-400 leading-relaxed font-editorial">
              An architectural research publication documenting heritage Kyoto machiya restoration, monolithic microcement surfaces, precision flush millwork, and warm Scandinavian reduction.
            </p>
            <div className="pt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-300/40">
                <ShieldCheck className="w-3.5 h-3.5" /> AEO Verified
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-stone-700 dark:text-zinc-300 bg-stone-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                Vercel Edge
              </span>
            </div>
          </div>

          {/* Col 2: Core Publications with Descriptive Internal Link Anchors */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 mb-3 font-mono">
              Individual Architectural Studies
            </h4>
            <ul className="space-y-2 text-xs text-stone-600 dark:text-zinc-400">
              <li>
                <button 
                  onClick={() => onNavigateRoute('/architecture/modern-kyoto-machiya')} 
                  className="hover:text-amber-800 dark:hover:text-amber-300 transition-colors text-left"
                >
                  Modern Kyoto Machiya Restoration
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateRoute('/materials/microcement-lime-wash-surfaces')} 
                  className="hover:text-amber-800 dark:hover:text-amber-300 transition-colors text-left"
                >
                  Microcement vs Lime Wash Tactile Surfaces
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateRoute('/millwork/flush-joinery-concealed-storage')} 
                  className="hover:text-amber-800 dark:hover:text-amber-300 transition-colors text-left"
                >
                  Flush Joinery & Concealed Storage Systems
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateRoute('/philosophy/warm-scandinavian-reduction')} 
                  className="hover:text-amber-800 dark:hover:text-amber-300 transition-colors text-left"
                >
                  Warm Scandinavian Reduction Philosophy
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Research Classifications */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 mb-3 font-mono">
              Thematic Categories
            </h4>
            <ul className="space-y-2 text-xs text-stone-600 dark:text-zinc-400">
              <li>
                <button 
                  onClick={() => onSelectCategory('Architecture')} 
                  className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                >
                  Architecture & Timber Preservation
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('Materials')} 
                  className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                >
                  Mineral Binders & Plaster Materials
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('Millwork')} 
                  className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                >
                  Cabinetry & Concealed Joinery
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('Philosophy')} 
                  className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                >
                  Quiet Spatial Philosophy (Japandi)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Technical SEO & AEO Suite */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 mb-3 font-mono">
              SEO & Machine Readability
            </h4>
            <ul className="space-y-2 text-xs text-stone-600 dark:text-zinc-400">
              <li>
                <button 
                  onClick={onOpenSeoInspector}
                  className="flex items-center gap-1.5 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors text-left font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  SEO & AEO Snippet Auditor
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenSeoInspector}
                  className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                >
                  Schema.org Article & FAQPage JSON-LD
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenSeoInspector}
                  className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                >
                  Dynamic XML Sitemap Protocol
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenVercelDeploy}
                  className="flex items-center gap-1 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  Vercel Edge SPA Deployment Guide
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright and crawler confirmation */}
        <div className="mt-12 pt-6 border-t border-stone-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-zinc-400 font-mono">
          <div>
            © {new Date().getFullYear()} KURA Architectural Journal. Published for architects, joiners, and material researchers.
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-emerald-500" /> Google Search Console Verified
            </span>
            <span>•</span>
            <span>Strict AEO Structure</span>
            <span>•</span>
            <span>Zero-404 Vercel Rewrites</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
