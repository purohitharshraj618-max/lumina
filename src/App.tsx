import React from 'react';
import { BlogPost, Category, Comment } from './types/blog';
import { INITIAL_POSTS, INITIAL_COMMENTS } from './data/initialPosts';
import { Header } from './components/Header';
import { ArticleCard } from './components/ArticleCard';
import { ArticleView } from './components/ArticleView';
import { BookmarksView } from './components/BookmarksView';
import { SeoInspectorModal } from './components/SeoInspectorModal';
import { VercelDeployModal } from './components/VercelDeployModal';
import { PostEditorModal } from './components/PostEditorModal';
import { Footer } from './components/Footer';
import { updateDocumentSeo, DEFAULT_BASE_URL } from './utils/seo';
import { 
  Sparkles, 
  ShieldCheck, 
  UploadCloud, 
  Compass, 
  Search, 
  ArrowRight,
  HelpCircle,
  Layers,
  BookOpen
} from 'lucide-react';

const CATEGORIES: Category[] = [
  'All',
  'Architecture',
  'Materials',
  'Millwork',
  'Philosophy',
];

export default function App() {
  // Posts state initialized from INITIAL_POSTS (ensuring fresh KURA articles)
  const [posts, setPosts] = React.useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem('kura_posts_v3');
      if (saved) {
        const parsed = JSON.parse(saved) as BlogPost[];
        if (parsed.some(p => p.routePath && p.aeoQuestions)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load posts from storage', e);
    }
    return INITIAL_POSTS;
  });

  // Comments state
  const [comments, setComments] = React.useState<Comment[]>(() => {
    try {
      const saved = localStorage.getItem('kura_comments_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load comments from storage', e);
    }
    return INITIAL_COMMENTS;
  });

  // Bookmarks state
  const [bookmarks, setBookmarks] = React.useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kura_bookmarks');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load bookmarks', e);
    }
    return [INITIAL_POSTS[0].id];
  });

  // Dark Mode (minimalist warm stone / graphite dark)
  const [darkMode, setDarkMode] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kura_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Path routing and view state
  const [currentView, setCurrentView] = React.useState<'home' | 'post' | 'bookmarks'>('home');
  const [activePost, setActivePost] = React.useState<BlogPost | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<Category>('All');
  const [searchQuery, setSearchQuery] = React.useState('');

  // Modals state
  const [seoModalOpen, setSeoModalOpen] = React.useState(false);
  const [inspectedPost, setInspectedPost] = React.useState<BlogPost | null>(null);
  const [vercelModalOpen, setVercelModalOpen] = React.useState(false);
  const [editorModalOpen, setEditorModalOpen] = React.useState(false);
  const [editingPost, setEditingPost] = React.useState<BlogPost | null>(null);

  // Sync dark mode class
  React.useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('kura_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('kura_theme', 'light');
    }
  }, [darkMode]);

  // Sync posts to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem('kura_posts_v3', JSON.stringify(posts));
    } catch (e) {
      console.warn('Failed to persist posts', e);
    }
  }, [posts]);

  // Sync comments to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem('kura_comments_v2', JSON.stringify(comments));
    } catch (e) {
      console.warn('Failed to persist comments', e);
    }
  }, [comments]);

  // Sync bookmarks to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem('kura_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.warn('Failed to persist bookmarks', e);
    }
  }, [bookmarks]);

  /**
   * Client-side Path-based Routing resolver:
   * Handles direct URLs like:
   *  - /
   *  - /architecture/modern-kyoto-machiya
   *  - /materials/microcement-lime-wash-surfaces
   *  - /millwork/flush-joinery-concealed-storage
   *  - /philosophy/warm-scandinavian-reduction
   */
  const resolveCurrentRoute = React.useCallback(() => {
    if (typeof window === 'undefined') return;

    const pathname = window.location.pathname;
    const hash = window.location.hash;

    // Check if path matches an individual article route
    const matchedPost = posts.find(
      (p) => p.routePath === pathname || hash === `#post/${p.slug}` || hash === `#${p.slug}`
    );

    if (matchedPost) {
      setActivePost(matchedPost);
      setCurrentView('post');
      return;
    }

    if (pathname === '/bookmarks' || hash === '#bookmarks') {
      setCurrentView('bookmarks');
      setActivePost(null);
      return;
    }

    // Default to home
    setCurrentView('home');
    setActivePost(null);
  }, [posts]);

  // Listen to popstate (browser back/forward button) and initial load
  React.useEffect(() => {
    resolveCurrentRoute();
    window.addEventListener('popstate', resolveCurrentRoute);
    return () => window.removeEventListener('popstate', resolveCurrentRoute);
  }, [resolveCurrentRoute]);

  // Set Homepage and Bookmarks SEO metadata (Exact 50-60 char title, 150-160 char description)
  React.useEffect(() => {
    if (currentView === 'home') {
      updateDocumentSeo({
        title: 'KURA – Architecture, Tactile Materials & Spatial Reduction', // 58 chars
        description: 'KURA is an architectural journal documenting modern Kyoto machiya renovation, microcement tactile finishes, flush joinery millwork, and Scandinavian reduction.', // 159 chars
        canonicalUrl: DEFAULT_BASE_URL,
        ogType: 'website',
        ogImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&h=630&q=80',
        twitterCard: 'summary_large_image',
      });
    } else if (currentView === 'bookmarks') {
      updateDocumentSeo({
        title: 'Reading List: Saved Architectural Monographs | KURA', // 52 chars
        description: 'Access your curated personal reading queue of saved architectural monographs, tactile material guides, and joinery studies for offline or deferred study.', // 155 chars
        canonicalUrl: `${DEFAULT_BASE_URL}/bookmarks`,
        ogType: 'website',
        ogImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&h=630&q=80',
        twitterCard: 'summary_large_image',
      });
    }
  }, [currentView]);

  // Handlers
  const handleToggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleClap = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            claps: p.claps + 1,
            userClapped: true,
          };
        }
        return p;
      })
    );
  };

  const handleSelectPost = (post: BlogPost) => {
    setActivePost(post);
    setCurrentView('post');
    // Push real clean path into browser history
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', post.routePath);
    }
    // Increment view count
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, views: p.views + 1 } : p))
    );
  };

  const handleInspectSeo = (post: BlogPost, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setInspectedPost(post);
    setSeoModalOpen(true);
  };

  const handleNavigate = (view: string, targetPath?: string) => {
    if (view === 'home') {
      setCurrentView('home');
      setActivePost(null);
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (view === 'bookmarks') {
      setCurrentView('bookmarks');
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/bookmarks');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (view === 'post' && targetPath) {
      const target = posts.find((p) => p.routePath === targetPath);
      if (target) {
        handleSelectPost(target);
      }
    }
  };

  const handleSavePost = (savedPost: BlogPost) => {
    setPosts((prev) => {
      const exists = prev.some((p) => p.id === savedPost.id);
      if (exists) {
        return prev.map((p) => (p.id === savedPost.id ? savedPost : p));
      }
      return [savedPost, ...prev];
    });
    handleSelectPost(savedPost);
  };

  const handleAddComment = (postId: string, content: string, authorName: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      postId,
      authorName,
      authorAvatar: `https://images.unsplash.com/photo-${1507003211169 + (comments.length % 5)}?auto=format&fit=crop&w=128&h=128&q=80`,
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    setComments((prev) => [newComment, ...prev]);
  };

  const handleLikeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  // Filtered posts based on category and search query
  const filteredPosts = React.useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q)) ||
        post.author.name.toLowerCase().includes(q) ||
        (post.aeoQuestions && post.aeoQuestions.some(qa => qa.question.toLowerCase().includes(q) || qa.directAnswer.toLowerCase().includes(q)));
      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const featuredPost = posts.find((p) => p.featured) || posts[0];
  const secondaryPosts = posts.filter((p) => p.id !== featuredPost.id);
  const bookmarkedPosts = posts.filter((p) => bookmarks.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 dark:bg-zinc-950 dark:text-stone-100 transition-colors">
      {/* Top Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        bookmarksCount={bookmarks.length}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenSeoInspector={() => {
          setInspectedPost(activePost || featuredPost);
          setSeoModalOpen(true);
        }}
        onOpenVercelDeploy={() => setVercelModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'post' && activePost ? (
          <ArticleView
            post={activePost}
            allPosts={posts}
            isBookmarked={bookmarks.includes(activePost.id)}
            onToggleBookmark={handleToggleBookmark}
            onClap={handleClap}
            onBack={() => handleNavigate('home', '/')}
            onSelectPost={handleSelectPost}
            onInspectSeo={handleInspectSeo}
            comments={comments}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
          />
        ) : currentView === 'bookmarks' ? (
          <BookmarksView
            bookmarkedPosts={bookmarkedPosts}
            onToggleBookmark={handleToggleBookmark}
            onClearAll={() => setBookmarks([])}
            onSelectPost={handleSelectPost}
            onInspectSeo={handleInspectSeo}
            onBack={() => handleNavigate('home', '/')}
          />
        ) : (
          /* HOMEPAGE VIEW (Exact ONE <h1> on Homepage) */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            
            {/* Top Editorial Monograph Hero (Exact ONE H1 for the page) */}
            <div className="relative overflow-hidden rounded-3xl bg-zinc-900 text-stone-100 p-8 sm:p-12 shadow-xl border border-stone-800">
              <div className="relative z-10 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-stone-800 text-stone-200 border border-stone-700">
                    <Compass className="w-3.5 h-3.5 text-amber-300" />
                    KURA Journal Monograph 01
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                    <HelpCircle className="w-3.5 h-3.5" />
                    AEO Direct Answers Active
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    On-Page SEO 100%
                  </span>
                </div>

                {/* EXACTLY ONE H1 HEADING FOR THE HOMEPAGE */}
                <h1 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.14]">
                  Quiet architecture, honest joinery, and tactile materiality.
                </h1>

                <p className="mt-4 text-base sm:text-lg text-stone-300 leading-relaxed font-editorial max-w-2xl">
                  A technical design journal documenting modern Kyoto machiya adaptation, seamless microcement screeds, flush shadow gap reveals, and warm Scandinavian reduction.
                </p>

                {/* Descriptive Action Links (NO "Read more" or "Click here") */}
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleSelectPost(featuredPost)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-semibold text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95"
                  >
                    <span>Examine modern Kyoto machiya study</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setInspectedPost(featuredPost);
                      setSeoModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-200 text-xs sm:text-sm font-semibold border border-stone-700 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Audit Technical SEO & AEO</span>
                  </button>

                  <button
                    onClick={() => setVercelModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-200 text-xs sm:text-sm font-semibold border border-stone-700 transition-colors"
                  >
                    <UploadCloud className="w-4 h-4 text-amber-300" />
                    <span>Vercel Edge Suite</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Study Hero */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-zinc-400">
                    Lead Editorial Research
                  </span>
                  <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
                    Featured Architectural Study
                  </h2>
                </div>
                <button
                  onClick={() => handleSelectPost(featuredPost)}
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-stone-800 dark:text-stone-200 hover:text-amber-800 dark:hover:text-amber-300"
                >
                  <span>Examine complete Kyoto machiya analysis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <ArticleCard
                post={featuredPost}
                variant="featured"
                isBookmarked={bookmarks.includes(featuredPost.id)}
                onToggleBookmark={handleToggleBookmark}
                onSelect={handleSelectPost}
                onInspectSeo={handleInspectSeo}
              />
            </section>

            {/* Category Navigation & Search Filter Bar */}
            <section className="space-y-6 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-stone-200 dark:border-zinc-800">
                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  {CATEGORIES.map((cat) => {
                    const count = cat === 'All' ? posts.length : posts.filter((p) => p.category === cat).length;
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium font-mono transition-all whitespace-nowrap flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                            : 'bg-white dark:bg-zinc-900 text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-stone-100 border border-stone-200 dark:border-zinc-800'
                        }`}
                      >
                        <span>{cat}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                            isSelected
                              ? 'bg-stone-800 text-stone-200 dark:bg-stone-200 dark:text-stone-900'
                              : 'bg-stone-100 dark:bg-zinc-800 text-stone-500'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="text-xs text-stone-500 font-mono shrink-0">
                  Showing {filteredPosts.length} of {posts.length} architectural studies
                </div>
              </div>

              {/* Search result cue */}
              {searchQuery && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-100 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-xs text-stone-800 dark:text-zinc-200 font-mono">
                  <span>
                    Searching query &ldquo;<strong>{searchQuery}</strong>&rdquo; in {selectedCategory}
                  </span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="font-semibold underline hover:text-stone-900"
                  >
                    Clear Filter
                  </button>
                </div>
              )}

              {/* Grid of Remaining Studies */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <ArticleCard
                    key={post.id}
                    post={post}
                    isBookmarked={bookmarks.includes(post.id)}
                    onToggleBookmark={handleToggleBookmark}
                    onSelect={handleSelectPost}
                    onInspectSeo={handleInspectSeo}
                  />
                ))}
              </div>
            </section>

            {/* AEO & On-Page SEO Architecture Certification Banner */}
            <section className="rounded-3xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 sm:p-10 shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2 space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    <ShieldCheck className="w-4 h-4" /> AEO & On-Page Technical Architecture
                  </div>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
                    Engineered for Google Featured Snippets & AI Overviews
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-zinc-300 font-editorial leading-relaxed">
                    Subheadings are authored as explicit user inquiries paired with immediate, concise 1–2 sentence direct answer callouts. Embedded Schema.org <code className="text-xs px-1 py-0.5 rounded bg-stone-100 dark:bg-zinc-800 font-mono">FAQPage</code> and <code className="text-xs px-1 py-0.5 rounded bg-stone-100 dark:bg-zinc-800 font-mono">Article</code> JSON-LD models enable instant machine ingestion.
                  </p>
                </div>

                <div className="flex flex-col gap-3 justify-center">
                  <button
                    onClick={() => {
                      setInspectedPost(featuredPost);
                      setSeoModalOpen(true);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 text-xs sm:text-sm font-semibold transition-colors shadow-xs"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Run Complete AEO Audit</span>
                  </button>

                  <button
                    onClick={() => setVercelModalOpen(true)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-stone-300 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-800 dark:text-zinc-200 text-xs sm:text-sm font-semibold transition-colors font-mono"
                  >
                    <UploadCloud className="w-4 h-4 text-amber-600" />
                    <span>Vercel Clean Routes</span>
                  </button>
                </div>
              </div>
            </section>

          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          handleNavigate('home', '/');
        }}
        onNavigateRoute={(route) => handleNavigate('post', route)}
        onOpenSeoInspector={() => {
          setInspectedPost(activePost || featuredPost);
          setSeoModalOpen(true);
        }}
        onOpenVercelDeploy={() => setVercelModalOpen(true)}
        onNavigateHome={() => handleNavigate('home', '/')}
      />

      {/* MODALS */}
      {seoModalOpen && (
        <SeoInspectorModal
          post={inspectedPost || activePost || featuredPost}
          allPosts={posts}
          onClose={() => setSeoModalOpen(false)}
        />
      )}

      {vercelModalOpen && (
        <VercelDeployModal
          allPosts={posts}
          onClose={() => setVercelModalOpen(false)}
        />
      )}

      {editorModalOpen && (
        <PostEditorModal
          initialPost={editingPost}
          onSave={handleSavePost}
          onClose={() => {
            setEditorModalOpen(false);
            setEditingPost(null);
          }}
        />
      )}
    </div>
  );
}
