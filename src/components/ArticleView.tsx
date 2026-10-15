import React from 'react';
import { BlogPost, Comment } from '../types/blog';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Eye, 
  Heart, 
  Bookmark, 
  Share2, 
  Check, 
  ShieldCheck, 
  Twitter, 
  Linkedin, 
  MessageSquare, 
  Copy, 
  Send,
  AlertCircle,
  Lightbulb,
  Info
} from 'lucide-react';
import { updateDocumentSeo, generateBlogPostingSchema, DEFAULT_BASE_URL } from '../utils/seo';

interface ArticleViewProps {
  post: BlogPost;
  allPosts: BlogPost[];
  isBookmarked: boolean;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  onClap: (id: string) => void;
  onBack: () => void;
  onSelectPost: (post: BlogPost) => void;
  onInspectSeo: (post: BlogPost) => void;
  comments: Comment[];
  onAddComment: (postId: string, content: string, authorName: string) => void;
  onLikeComment: (commentId: string) => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  post,
  allPosts,
  isBookmarked,
  onToggleBookmark,
  onClap,
  onBack,
  onSelectPost,
  onInspectSeo,
  comments,
  onAddComment,
  onLikeComment,
}) => {
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [copiedCodeId, setCopiedCodeId] = React.useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const [activeHeadingId, setActiveHeadingId] = React.useState<string>('');
  
  // New comment state
  const [commentText, setCommentText] = React.useState('');
  const [commentAuthor, setCommentAuthor] = React.useState('');
  const [commentSuccess, setCommentSuccess] = React.useState(false);

  // Update SEO head tags when this article opens
  React.useEffect(() => {
    const postUrl = `${DEFAULT_BASE_URL}/#post/${post.slug}`;
    const schema = generateBlogPostingSchema(post, DEFAULT_BASE_URL);

    updateDocumentSeo({
      title: `${post.seo.metaTitle || post.title} | Lumina`,
      description: post.seo.metaDescription || post.excerpt,
      canonicalUrl: post.seo.canonicalUrl || postUrl,
      ogType: 'article',
      ogImage: post.seo.ogImage || post.coverImage,
      twitterCard: post.seo.twitterCardType || 'summary_large_image',
      author: post.author.name,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      schemaJson: schema,
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Scroll listener for reading progress bar
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post]);

  const handleCopyLink = () => {
    const url = typeof window !== 'undefined' ? window.location.href : `${DEFAULT_BASE_URL}/#post/${post.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = (codeText: string, id: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`"${post.title}" by ${post.author.name} via @luminablog`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener,noreferrer');
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !commentAuthor.trim()) return;
    onAddComment(post.id, commentText.trim(), commentAuthor.trim());
    setCommentText('');
    setCommentAuthor('');
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 3000);
  };

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && (p.category === post.category || p.tags.some((t) => post.tags.includes(t))))
    .slice(0, 3);

  const postComments = comments.filter((c) => c.postId === post.id);

  // Markdown renderer helper
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLanguage = '';
    let codeBuffer: string[] = [];
    let codeBlockIndex = 0;

    let inCallout = false;
    let calloutType = '';
    let calloutBuffer: string[] = [];

    lines.forEach((line, index) => {
      // Code block handler
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.replace('```', '').trim() || 'typescript';
          codeBuffer = [];
        } else {
          inCodeBlock = false;
          const currentCode = codeBuffer.join('\n');
          const codeId = `code-block-${codeBlockIndex++}`;
          elements.push(
            <div key={`code-${index}`} className="my-6 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-950/80 border-b border-slate-800/80 text-xs text-slate-400">
                <span className="font-mono uppercase font-semibold text-indigo-400">{codeLanguage}</span>
                <button
                  onClick={() => handleCopyCode(currentCode, codeId)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  {copiedCodeId === codeId ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-sm font-mono-code text-slate-200 leading-relaxed">
                <code>{currentCode}</code>
              </pre>
            </div>
          );
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      // Callout box handler (:::note or :::tip)
      if (line.startsWith(':::')) {
        if (!inCallout) {
          inCallout = true;
          calloutType = line.replace(':::', '').trim() || 'note';
          calloutBuffer = [];
        } else {
          inCallout = false;
          const calloutContent = calloutBuffer.join(' ');
          const isTip = calloutType === 'tip';
          elements.push(
            <div
              key={`callout-${index}`}
              className={`my-6 p-4 rounded-xl border flex items-start gap-3.5 ${
                isTip
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                  : 'bg-indigo-50/80 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/60 text-indigo-950 dark:text-indigo-200'
              }`}
            >
              {isTip ? (
                <Lightbulb className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              )}
              <div className="text-sm leading-relaxed">{calloutContent}</div>
            </div>
          );
        }
        return;
      }

      if (inCallout) {
        calloutBuffer.push(line);
        return;
      }

      // Blockquotes
      if (line.startsWith('> ')) {
        const quoteText = line.replace('> ', '').replace(/^"|"$/g, '');
        elements.push(
          <blockquote
            key={`quote-${index}`}
            className="my-6 pl-5 border-l-4 border-indigo-500 italic text-slate-700 dark:text-slate-300 text-lg font-editorial"
          >
            &ldquo;{quoteText}&rdquo;
          </blockquote>
        );
        return;
      }

      // Headings
      if (line.startsWith('## ')) {
        // extract ID if {#id} syntax present
        const idMatch = line.match(/\{#([^}]+)\}/);
        const headingText = line.replace('## ', '').replace(/\{#[^}]+\}/, '').trim();
        const headingId = idMatch ? idMatch[1] : headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        elements.push(
          <h2
            key={`h2-${index}`}
            id={headingId}
            className="scroll-mt-24 font-editorial text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-10 mb-4 tracking-tight group flex items-center justify-between"
          >
            <span>{headingText}</span>
            <a
              href={`#${headingId}`}
              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-500 text-base font-normal ml-2"
              title="Direct anchor link"
            >
              #
            </a>
          </h2>
        );
        return;
      }

      if (line.startsWith('### ')) {
        const subText = line.replace('### ', '').trim();
        elements.push(
          <h3
            key={`h3-${index}`}
            className="font-editorial text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3"
          >
            {subText}
          </h3>
        );
        return;
      }

      // Lists
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const itemText = line.substring(2);
        elements.push(
          <li key={`li-${index}`} className="ml-5 list-disc text-slate-700 dark:text-slate-300 my-1.5 leading-relaxed">
            {formatInlineText(itemText)}
          </li>
        );
        return;
      }

      if (/^\d+\.\s/.test(line)) {
        const itemText = line.replace(/^\d+\.\s/, '');
        elements.push(
          <li key={`ol-${index}`} className="ml-5 list-decimal text-slate-700 dark:text-slate-300 my-1.5 leading-relaxed">
            {formatInlineText(itemText)}
          </li>
        );
        return;
      }

      // Regular paragraph
      if (line.trim().length > 0) {
        elements.push(
          <p key={`p-${index}`} className="my-4 text-slate-700 dark:text-slate-300 leading-relaxed prose-editorial">
            {formatInlineText(line)}
          </p>
        );
      }
    });

    return elements;
  };

  // Inline formatting helper for bold, code, links
  const formatInlineText = (text: string): React.ReactNode => {
    // Quick regex replacements for bold and inline code
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-sm font-mono-code"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-slate-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="relative pb-24">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 z-50">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Article Navigation Bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to all stories
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onInspectSeo(post)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors"
              title="Inspect Schema.org & SEO Score"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>SEO Audit (A+)</span>
            </button>
            <button
              onClick={(e) => onToggleBookmark(post.id, e)}
              className={`p-2 rounded-lg border transition-colors ${
                isBookmarked
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:border-indigo-800'
                  : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isBookmarked ? 'Saved to bookmarks' : 'Bookmark this article'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-8 text-center sm:text-left">
        {/* Category & Tags Pill */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50">
            {post.category}
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {post.readingTimeMinutes} min read
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {formattedDate}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          {post.title}
        </h1>

        {/* Subtitle / Excerpt */}
        {post.subtitle && (
          <p className="mt-4 text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-editorial leading-relaxed">
            {post.subtitle}
          </p>
        )}

        {/* Author Bio Pill & Share Buttons Bar */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/20"
            />
            <div className="text-left">
              <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{post.author.name}</span>
                <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {post.author.role}
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {post.author.title}
              </div>
            </div>
          </div>

          {/* Social Share Controls */}
          <div className="flex items-center gap-1.5 text-slate-500">
            <button
              onClick={handleShareTwitter}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Share on X / Twitter"
            >
              <Twitter className="w-4 h-4" />
            </button>
            <button
              onClick={handleShareLinkedIn}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Share on LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
              title="Copy canonical link"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Featured Image with SEO Alt Caption */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 my-6">
        <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg">
          <img
            src={post.coverImage}
            alt={post.coverImageAlt}
            className="w-full h-auto max-h-[500px] object-cover"
          />
        </div>
        <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400 italic">
          {post.coverImageAlt}
        </p>
      </div>

      {/* Main Content Layout with Sticky Table of Contents */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 my-8">
        
        {/* Table of Contents sidebar (Desktop) */}
        {post.tableOfContents && post.tableOfContents.length > 0 && (
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Table of Contents
              </h4>
              <nav className="space-y-1 text-xs">
                {post.tableOfContents.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block py-1 px-2 rounded hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                      item.level === 3 ? 'ml-3 text-slate-500' : 'text-slate-700 dark:text-slate-300 font-medium'
                    }`}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => onInspectSeo(post)}
                  className="w-full text-left flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold"
                >
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Live SEO Report
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-[10px]">
                    100/100
                  </span>
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Article Markdown Body */}
        <div className={`lg:col-span-${post.tableOfContents && post.tableOfContents.length > 0 ? '9' : '12'} max-w-3xl`}>
          <div className="prose dark:prose-invert max-w-none">
            {renderFormattedContent(post.content)}
          </div>

          {/* Tags */}
          <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-1">Tagged:</span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Interactive Claps & Reactions */}
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-50/50 via-purple-50/30 to-pink-50/40 dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-pink-950/20 border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white text-base">
                Did you find this publication insightful?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Applaud to let the author know and boost community visibility.
              </p>
            </div>

            <button
              onClick={() => onClap(post.id)}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold text-sm shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <Heart className={`w-4 h-4 fill-white ${post.userClapped ? 'scale-125' : ''}`} />
              <span>Clap ({post.claps})</span>
            </button>
          </div>

          {/* Author Box */}
          <div className="mt-10 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-indigo-500/20 shrink-0"
            />
            <div className="text-center sm:text-left flex-1">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Written by
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {post.author.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {post.author.title}
              </p>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-editorial">
                {post.author.bio}
              </p>
            </div>
          </div>

          {/* Comments Section */}
          <section className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-editorial text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-500" />
                Community Discussion ({postComments.length})
              </h3>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-8 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                Join the conversation
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Your Name (e.g., Alex Rivers)"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  required
                  className="px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <textarea
                rows={3}
                placeholder="Share your technical perspective, feedback, or questions..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Markdown comments supported
                </span>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                >
                  <Send className="w-3.5 h-3.5" /> Post Comment
                </button>
              </div>

              {commentSuccess && (
                <div className="mt-3 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" /> Comment published successfully!
                </div>
              )}
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {postComments.length === 0 ? (
                <p className="text-sm text-slate-500 italic py-4">
                  No comments yet. Be the first to start the discussion!
                </p>
              ) : (
                postComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={comment.authorAvatar}
                          alt={comment.authorName}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                          {comment.authorName}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        onClick={() => onLikeComment(comment.id)}
                        className="flex items-center gap-1 text-xs text-slate-500 hover:text-pink-600"
                      >
                        <Heart className="w-3.5 h-3.5" /> {comment.likes}
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <section className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800">
              <h3 className="font-editorial text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Recommended Reading
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {relatedPosts.map((related) => (
                  <div
                    key={related.id}
                    onClick={() => onSelectPost(related)}
                    className="group cursor-pointer rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900/40 hover:shadow-md transition-all"
                  >
                    <img
                      src={related.coverImage}
                      alt={related.coverImageAlt}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-4">
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                        {related.category}
                      </span>
                      <h4 className="font-editorial font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 line-clamp-2 mt-1">
                        {related.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
};
