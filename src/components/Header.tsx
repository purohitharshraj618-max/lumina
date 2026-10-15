import React from 'react';
import { 
  Search, 
  Bookmark, 
  ShieldCheck, 
  Sun, 
  Moon, 
  UploadCloud, 
  Menu, 
  X,
  Compass
} from 'lucide-react';
import { Category } from '../types/blog';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, routePath?: string) => void;
  onSelectCategory?: (category: Category) => void;
  bookmarksCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSeoInspector: () => void;
  onOpenVercelDeploy: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onSelectCategory,
  bookmarksCount,
  darkMode,
  onToggleDarkMode,
  onOpenSeoInspector,
  onOpenVercelDeploy,
  searchQuery,
  onSearchChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo - KURA */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => {
                onNavigate('home', '/');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
              title="Return to KURA architectural journal home"
            >
              <div className="w-8 h-8 rounded-lg bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 flex items-center justify-center font-bold font-mono text-sm shadow-xs group-hover:scale-105 transition-transform">
                倉
              </div>
              <div className="flex flex-col">
                <span className="font-editorial text-2xl font-bold tracking-widest text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  KURA
                  <span className="text-[10px] font-mono tracking-wider uppercase px-1.5 py-0.2 rounded bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400 border border-stone-200 dark:border-zinc-700">
                    Journal
                  </span>
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 text-xs sm:text-sm font-medium">
              <button
                onClick={() => onNavigate('home', '/')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  currentView === 'home'
                    ? 'text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-zinc-800/80 font-semibold'
                    : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-zinc-900'
                }`}
              >
                All Studies
              </button>

              <button
                onClick={() => onNavigate('post', '/architecture/modern-kyoto-machiya')}
                className="px-3 py-1.5 rounded-lg transition-colors text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-zinc-900"
                title="Examine modern Kyoto machiya architecture"
              >
                Architecture
              </button>

              <button
                onClick={() => onNavigate('post', '/materials/microcement-lime-wash-surfaces')}
                className="px-3 py-1.5 rounded-lg transition-colors text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-zinc-900"
                title="Compare microcement and lime wash tactile surfaces"
              >
                Materials
              </button>

              <button
                onClick={() => onNavigate('post', '/millwork/flush-joinery-concealed-storage')}
                className="px-3 py-1.5 rounded-lg transition-colors text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-zinc-900"
                title="Explore flush joinery and concealed millwork"
              >
                Millwork
              </button>

              <button
                onClick={() => onNavigate('post', '/philosophy/warm-scandinavian-reduction')}
                className="px-3 py-1.5 rounded-lg transition-colors text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-zinc-900"
                title="Study warm Scandinavian reduction principles"
              >
                Philosophy
              </button>

              <button
                onClick={onOpenSeoInspector}
                className="px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-stone-600 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-stone-50 dark:hover:bg-zinc-900"
                title="Inspect Technical SEO & AEO Structured Data"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>SEO & AEO Auditor</span>
                <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  100%
                </span>
              </button>
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Input or Toggle */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center bg-stone-100 dark:bg-zinc-900 rounded-lg px-2.5 py-1.5 border border-stone-300 dark:border-zinc-700 w-48 sm:w-64 transition-all">
                  <Search className="w-3.5 h-3.5 text-stone-400 shrink-0 mr-2" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search machiya, microcement, joinery..."
                    className="w-full bg-transparent text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none font-editorial"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => onSearchChange('')}
                      className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs px-1"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      onSearchChange('');
                    }}
                    className="ml-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-lg text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-900 transition-colors"
                  aria-label="Search architectural publications"
                  title="Search publications"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Reading List Bookmarks */}
            <button
              onClick={() => onNavigate('bookmarks', '#bookmarks')}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs ${
                currentView === 'bookmarks'
                  ? 'text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-zinc-800'
                  : 'text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-900'
              }`}
              title="View saved architectural publications"
            >
              <Bookmark className="w-4 h-4" />
              {bookmarksCount > 0 && (
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900">
                  {bookmarksCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-900 transition-colors"
              aria-label="Toggle dark and light reading theme"
              title="Toggle reading theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Vercel Deploy Button */}
            <button
              onClick={onOpenVercelDeploy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 transition-all shadow-xs"
              title="Open Vercel deployment assistant"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 1155 1000">
                <path d="m577.3 0 577.4 1000H0z" />
              </svg>
              <span>Vercel Edge</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-900"
              aria-label="Toggle architectural navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pt-2 pb-4 space-y-1 text-sm font-medium">
          <button
            onClick={() => {
              onNavigate('home', '/');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-stone-800 dark:text-zinc-200 hover:bg-stone-100 dark:hover:bg-zinc-900"
          >
            All Architectural Studies
          </button>
          <button
            onClick={() => {
              onNavigate('post', '/architecture/modern-kyoto-machiya');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-stone-800 dark:text-zinc-200 hover:bg-stone-100 dark:hover:bg-zinc-900"
          >
            Architecture: Modern Kyoto Machiya
          </button>
          <button
            onClick={() => {
              onNavigate('post', '/materials/microcement-lime-wash-surfaces');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-stone-800 dark:text-zinc-200 hover:bg-stone-100 dark:hover:bg-zinc-900"
          >
            Materials: Microcement vs Lime Wash
          </button>
          <button
            onClick={() => {
              onNavigate('post', '/millwork/flush-joinery-concealed-storage');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-stone-800 dark:text-zinc-200 hover:bg-stone-100 dark:hover:bg-zinc-900"
          >
            Millwork: Flush Joinery & Concealed Storage
          </button>
          <button
            onClick={() => {
              onNavigate('post', '/philosophy/warm-scandinavian-reduction');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-stone-800 dark:text-zinc-200 hover:bg-stone-100 dark:hover:bg-zinc-900"
          >
            Philosophy: Warm Scandinavian Reduction
          </button>
          <button
            onClick={() => {
              onOpenSeoInspector();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> SEO & AEO Auditor
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950">
              Grade A+
            </span>
          </button>
        </div>
      )}
    </header>
  );
};
