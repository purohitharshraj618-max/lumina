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
  TrendingUp, 
  Filter, 
  Search, 
  CheckCircle2, 
  ArrowRight,
  BookOpen,
  Award
} from 'lucide-react';

const CATEGORIES: Category[] = [
  'All',
  'Engineering',
  'Artificial Intelligence',
  'System Architecture',
  'Design Systems',
  'SEO & Performance',
  'Cloud & DevOps',
];

export default function App() {
  // Persistent Posts state
  const [posts, setPosts] = React.useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem('lumina_posts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load posts from storage', e);
    }
    return INITIAL_POSTS;
  });

  // Persistent Comments state
  const [comments, setComments] = React.useState<Comment[]>(() => {
    try {
      const saved = localStorage.getItem('lumina_comments');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load comments from storage', e);
    }
    return INITIAL_COMMENTS;
  });

  // Persistent Bookmarks
  const [bookmarks, setBookmarks] = React.useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lumina_bookmarks');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load bookmarks', e);
    }
    return [INITIAL_POSTS[0].id];
  });

  // Dark Mode
  const [darkMode, setDarkMode] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lumina_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Routing and filter state
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
      localStorage.setItem('lumina_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('lumina_theme', 'light');
    }
  }, [darkMode]);

  // Sync posts to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem('lumina_posts', JSON.stringify(posts));
    } catch (e) {
      console.warn('Failed to persist posts', e);
    }
  }, [posts]);

  // Sync comments to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem('lumina_comments', JSON.stringify(comments));
    } catch (e) {
      console.warn('Failed to persist comments', e);
    }
  }, [comments]);

  // Sync bookmarks to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem('lumina_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.warn('Failed to persist bookmarks', e);
    }
  }, [bookmarks]);

  // Handle URL hash changes for deep linking (e.g. #post/modern-seo-playbook-web-apps)
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#post/')) {
        const slug = hash.replace('#post/', '');
        const target = posts.find((p) => p.slug === slug);
        if (target) {
          setActivePost(target);
          setCurrentView('post');
          return;
        }
      } else if (hash === '#bookmarks') {
        setCurrentView('bookmarks');
        return;
      } else if (hash === '' || hash === '#' || hash === '#home') {
        setCurrentView('home');
        setActivePost(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [posts]);

  // Update homepage SEO when on home
  React.useEffect(() => {
    if (currentView === 'home') {
      updateDocumentSeo({
        title: 'Lumina – Modern High-Performance Editorial Blog & SEO Publishing Suite',
        description: 'A high-performance modern editorial blog platform with live SEO analytics, Schema.org JSON-LD generation, SERP previews, and one-click Vercel deployment readiness.',
        canonicalUrl: DEFAULT_BASE_URL,
        ogType: 'website',
        ogImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&h=630&q=80',
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
    window.location.hash = `#post/${post.slug}`;
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

  const handleNavigate = (view: string) => {
    if (view === 'home') {
      setCurrentView('home');
      setActivePost(null);
      window.location.hash = '#home';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'bookmarks') {
      setCurrentView('bookmarks');
      window.location.hash = '#bookmarks';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'new-post') {
      setEditingPost(null);
      setEditorModalOpen(true);
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
      authorAvatar: `https://images.unsplash.com/photo-${1535713875002 + (comments.length % 5)}?auto=format&fit=crop&w=128&h=128&q=80`,
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
        post.author.name.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const featuredPost = posts.find((p) => p.featured) || posts[0];
  const trendingPosts = posts.filter((p) => p.trending && p.id !== featuredPost.id).slice(0, 3);
  const bookmarkedPosts = posts.filter((p) => bookmarks.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      {/* Top Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
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
            onBack={() => handleNavigate('home')}
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
            onBack={() => handleNavigate('home')}
          />
        ) : (
          /* HOMEPAGE VIEW */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            
            {/* Top Brand Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 shadow-xl border border-indigo-500/20">
              <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    Engineering & Systems Dispatch
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    SEO 100/100
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-200 border border-slate-700">
                    <UploadCloud className="w-3.5 h-3.5" />
                    Vercel Ready
                  </span>
                </div>

                <h1 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
                  Deep technical writing for systems thinkers.
                </h1>

                <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-editorial max-w-2xl">
                  Rigorous, peer-level explorations of distributed architecture, modern frontend runtimes, and search engine optimization.
                </p>

                {/* Quick Action Badges */}
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleSelectPost(featuredPost)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
                  >
                    <span>Read Featured Story</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setInspectedPost(featuredPost);
                      setSeoModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold backdrop-blur-md border border-white/10 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Run SEO Audit</span>
                  </button>

                  <button
                    onClick={() => setVercelModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold backdrop-blur-md border border-white/10 transition-colors"
                  >
                    <UploadCloud className="w-4 h-4 text-indigo-400" />
                    <span>Vercel Deploy Assistant</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Editorial Showcase Grid (Featured Hero + Trending Column) */}
            {!searchQuery && selectedCategory === 'All' && (
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Main Hero Card (8 cols) */}
                <div className="lg:col-span-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-editorial text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-500" />
                      Lead Editorial
                    </h2>
                    <span className="text-xs text-slate-500">Curated weekly by editors</span>
                  </div>
                  <ArticleCard
                    post={featuredPost}
                    variant="featured"
                    isBookmarked={bookmarks.includes(featuredPost.id)}
                    onToggleBookmark={handleToggleBookmark}
                    onSelect={handleSelectPost}
                    onInspectSeo={handleInspectSeo}
                  />
                </div>

                {/* Trending Stories Column (4 cols) */}
                <div className="lg:col-span-4 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 shadow-sm">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-editorial text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-pink-500" />
                      Trending This Week
                    </h3>
                    <span className="text-[11px] font-bold text-pink-500 uppercase tracking-wider">
                      Hot
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {trendingPosts.map((post) => (
                      <ArticleCard
                        key={post.id}
                        post={post}
                        variant="compact"
                        isBookmarked={bookmarks.includes(post.id)}
                        onToggleBookmark={handleToggleBookmark}
                        onSelect={handleSelectPost}
                        onInspectSeo={handleInspectSeo}
                      />
                    ))}
                  </div>

                  {/* Vercel Status Pill in Sidebar */}
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => setVercelModalOpen(true)}
                      className="w-full p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-left flex items-center justify-between group hover:border-indigo-400 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center shrink-0">
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 1155 1000">
                            <path d="m577.3 0 577.4 1000H0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900 dark:text-white">
                            Vercel Upload Guide
                          </div>
                          <div className="text-[11px] text-slate-500">
                            SPA rewrites & export package
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* Category Navigation & Search Filter Bar */}
            <section className="space-y-6 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  {CATEGORIES.map((cat) => {
                    const count = cat === 'All' ? posts.length : posts.filter((p) => p.category === cat).length;
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <span>{cat}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                            isSelected
                              ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Count summary */}
                <div className="text-xs text-slate-500 shrink-0">
                  Showing {filteredPosts.length} of {posts.length} stories
                </div>
              </div>

              {/* Search Result Feedback */}
              {searchQuery && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-200">
                  <span>
                    Searching for &ldquo;<strong>{searchQuery}</strong>&rdquo; in {selectedCategory}
                  </span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="font-semibold underline hover:text-indigo-600"
                  >
                    Clear Filter
                  </button>
                </div>
              )}

              {/* Articles Grid */}
              {filteredPosts.length === 0 ? (
                <div className="py-20 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-3">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="font-editorial text-lg font-bold text-slate-900 dark:text-white">
                    No articles matched your criteria
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Try searching for different keywords such as &ldquo;SEO&rdquo;, &ldquo;Vercel&rdquo;, &ldquo;React&rdquo;, or reset your category filter.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
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
              )}
            </section>

            {/* SEO & Vercel Publishing Suite Callout Banner */}
            <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-10 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2 space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    <Award className="w-4 h-4" /> Production Architecture Certified
                  </div>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                    Fully Optimized for Google Search & Vercel Edge Hosting
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-editorial leading-relaxed">
                    Every article automatically generates Schema.org JSON-LD structured data, dynamic OpenGraph 2.0 social cards, and sitemaps. The application is pre-configured with <code className="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">vercel.json</code> rewrites to ensure zero 404 routing errors on edge deployment.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col gap-3 justify-center">
                  <button
                    onClick={() => {
                      setInspectedPost(featuredPost);
                      setSeoModalOpen(true);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Run Full SEO Audit</span>
                  </button>

                  <button
                    onClick={() => setVercelModalOpen(true)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-colors"
                  >
                    <UploadCloud className="w-4 h-4 text-indigo-500" />
                    <span>Vercel Deploy Suite</span>
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
          handleNavigate('home');
        }}
        onOpenSeoInspector={() => {
          setInspectedPost(activePost || featuredPost);
          setSeoModalOpen(true);
        }}
        onOpenVercelDeploy={() => setVercelModalOpen(true)}
        onNavigateHome={() => handleNavigate('home')}
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
