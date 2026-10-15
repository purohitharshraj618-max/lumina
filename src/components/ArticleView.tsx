import React from 'react';
import { BlogPost, Comment } from '../types/blog';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Bookmark, 
  Check, 
  ShieldCheck, 
  Twitter, 
  Linkedin, 
  MessageSquare, 
  Copy, 
  Send,
  HelpCircle,
  Sparkles,
  Compass,
  ArrowRight
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
  
  // New comment state
  const [commentText, setCommentText] = React.useState('');
  const [commentAuthor, setCommentAuthor] = React.useState('');
  const [commentSuccess, setCommentSuccess] = React.useState(false);

  // Update SEO head tags when this article opens
  React.useEffect(() => {
    const postUrl = `${DEFAULT_BASE_URL}${post.routePath}`;
    const schema = generateBlogPostingSchema(post, DEFAULT_BASE_URL);

    updateDocumentSeo({
      title: post.seo.metaTitle || post.title,
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
    const url = typeof window !== 'undefined' ? `${window.location.origin}${post.routePath}` : `${DEFAULT_BASE_URL}${post.routePath}`;
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
    const text = encodeURIComponent(`"${post.title.replace(' | KURA', '')}" by ${post.author.name} via @kurajournal`);
    const url = encodeURIComponent(`${DEFAULT_BASE_URL}${post.routePath}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(`${DEFAULT_BASE_URL}${post.routePath}`);
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
    .filter((p) => p.id !== post.id)
    .slice(0, 3);

  const postComments = comments.filter((c) => c.postId === post.id);

  // Markdown renderer supporting AEO Direct Answer snippets and Questions
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLanguage = '';
    let codeBuffer: string[] = [];
    let codeBlockIndex = 0;

    let inAeoAnswer = false;
    let aeoBuffer: string[] = [];

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
            <div key={`code-${index}`} className="my-6 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-lg">
              <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800 text-xs text-zinc-400 font-mono">
                <span className="uppercase text-amber-300 font-medium">{codeLanguage}</span>
                <button
                  onClick={() => handleCopyCode(currentCode, codeId)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
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
              <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-zinc-200 leading-relaxed">
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

      // AEO Direct Answer Callout Handler (:::aeo-answer ... :::)
      if (line.startsWith(':::aeo-answer') || line.startsWith(':::tip') || line.startsWith(':::note')) {
        inAeoAnswer = true;
        aeoBuffer = [];
        return;
      }

      if (line.startsWith(':::')) {
        inAeoAnswer = false;
        const answerRaw = aeoBuffer.join(' ').replace(/^\*\*Direct Answer:\*\*/, '').trim();
        elements.push(
          <div
            key={`aeo-${index}`}
            className="my-5 p-5 rounded-2xl border border-amber-900/20 bg-amber-50/70 dark:bg-amber-950/20 dark:border-amber-900/40 text-stone-900 dark:text-stone-100 shadow-xs"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-900/10 text-amber-900 dark:bg-amber-400/10 dark:text-amber-300 flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                AEO Direct Answer (Google Featured Snippet & AI Overview)
              </span>
            </div>
            <p className="text-sm sm:text-base font-editorial leading-relaxed font-medium text-stone-900 dark:text-stone-100">
              {answerRaw}
            </p>
          </div>
        );
        return;
      }

      if (inAeoAnswer) {
        aeoBuffer.push(line);
        return;
      }

      // Blockquotes
      if (line.startsWith('> ')) {
        const quoteText = line.replace('> ', '').replace(/^"|"$/g, '');
        elements.push(
          <blockquote
            key={`quote-${index}`}
            className="my-6 pl-5 border-l-2 border-stone-800 dark:border-stone-200 italic text-stone-800 dark:text-zinc-200 text-lg font-editorial"
          >
            &ldquo;{quoteText}&rdquo;
          </blockquote>
        );
        return;
      }

      // Headings as explicit questions (H2)
      if (line.startsWith('## ')) {
        const idMatch = line.match(/\{#([^}]+)\}/);
        const headingText = line.replace('## ', '').replace(/\{#[^}]+\}/, '').trim();
        const headingId = idMatch ? idMatch[1] : headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        elements.push(
          <h2
            key={`h2-${index}`}
            id={headingId}
            className="scroll-mt-24 font-editorial text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mt-10 mb-2 tracking-tight flex items-start justify-between group"
          >
            <span className="flex items-baseline gap-2">
              <span>{headingText}</span>
            </span>
            <a
              href={`#${headingId}`}
              className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-stone-700 text-sm font-normal ml-2 transition-opacity"
              title="Direct link to this question"
            >
              #
            </a>
          </h2>
        );
        return;
      }

      if (line.startsWith('### ')) {
        const idMatch = line.match(/\{#([^}]+)\}/);
        const subText = line.replace('### ', '').replace(/\{#[^}]+\}/, '').trim();
        const subId = idMatch ? idMatch[1] : subText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        elements.push(
          <h3
            key={`h3-${index}`}
            id={subId}
            className="scroll-mt-24 font-editorial text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mt-8 mb-2 tracking-tight flex items-baseline justify-between group"
          >
            <span>{subText}</span>
            <a
              href={`#${subId}`}
              className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs font-normal ml-2 transition-opacity"
              title="Anchor link to this subsection query"
            >
              #
            </a>
          </h3>
        );
        return;
      }

      // Responsive Editorial Figure Image (![alt](url))
      const imageMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imageMatch) {
        const altText = imageMatch[1];
        const imageUrl = imageMatch[2];
        elements.push(
          <figure
            key={`fig-${index}`}
            className="my-8 rounded-3xl overflow-hidden border border-stone-200 dark:border-zinc-800 bg-stone-100 dark:bg-zinc-850 shadow-md"
          >
            <img
              src={imageUrl}
              alt={altText}
              width={1200}
              height={700}
              loading="lazy"
              className="w-full h-auto max-h-[500px] object-cover transition-transform duration-500 hover:scale-[1.01]"
            />
            {altText && (
              <figcaption className="p-3 text-center text-xs text-stone-600 dark:text-zinc-400 font-editorial italic bg-stone-50/70 dark:bg-zinc-900/70 border-t border-stone-200 dark:border-zinc-800">
                {altText}
              </figcaption>
            )}
          </figure>
        );
        return;
      }

      // Lists
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const itemText = line.substring(2);
        elements.push(
          <li key={`li-${index}`} className="ml-5 list-disc text-stone-700 dark:text-zinc-300 my-1.5 leading-relaxed font-editorial">
            {formatInlineText(itemText)}
          </li>
        );
        return;
      }

      if (/^\d+\.\s/.test(line)) {
        const itemText = line.replace(/^\d+\.\s/, '');
        elements.push(
          <li key={`ol-${index}`} className="ml-5 list-decimal text-stone-700 dark:text-zinc-300 my-1.5 leading-relaxed font-editorial">
            {formatInlineText(itemText)}
          </li>
        );
        return;
      }

      // Regular paragraph
      if (line.trim().length > 0) {
        elements.push(
          <p key={`p-${index}`} className="my-4 text-stone-700 dark:text-zinc-300 leading-relaxed font-editorial text-base sm:text-lg">
            {formatInlineText(line)}
          </p>
        );
      }
    });

    return elements;
  };

  const formatInlineText = (text: string): React.ReactNode => {
    // Splits by code, bold, italic, and markdown links [anchor](url)
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-zinc-800 text-amber-900 dark:text-amber-300 text-sm font-mono"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-stone-900 dark:text-stone-100">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={i} className="italic">
            {part.slice(1, -1)}
          </em>
        );
      }
      // Markdown link [anchor](url)
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        const linkAnchor = linkMatch[1];
        const linkHref = linkMatch[2];
        const isInternal = linkHref.startsWith('/');
        if (isInternal) {
          const targetPost = allPosts.find((p) => p.routePath === linkHref);
          return (
            <button
              key={i}
              onClick={() => {
                if (targetPost) {
                  onSelectPost(targetPost);
                } else {
                  window.history.pushState({}, '', linkHref);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="font-medium text-amber-800 dark:text-amber-300 underline decoration-amber-600/40 hover:decoration-amber-800 dark:hover:decoration-amber-200 underline-offset-2 transition-colors cursor-pointer"
              title={`Navigate to ${linkAnchor}`}
            >
              {linkAnchor}
            </button>
          );
        }
        return (
          <a
            key={i}
            href={linkHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-amber-800 dark:text-amber-300 underline decoration-amber-600/40 hover:decoration-amber-800 underline-offset-2"
          >
            {linkAnchor}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <article className="relative pb-24">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-stone-200 dark:bg-zinc-800 z-50">
        <div
          className="h-full bg-gradient-to-r from-amber-800 via-stone-700 to-amber-900 dark:from-amber-400 dark:via-stone-300 dark:to-amber-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Semantic Breadcrumbs with Descriptive Internal Link Anchors */}
      <nav aria-label="Breadcrumb" className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 dark:text-zinc-400 font-mono">
          <ol className="flex items-center gap-1.5">
            <li>
              <button
                onClick={onBack}
                className="hover:text-amber-800 dark:hover:text-amber-300 transition-colors underline-offset-2 hover:underline"
              >
                KURA Architectural Journal
              </button>
            </li>
            <li>/</li>
            <li>
              <span className="font-semibold text-stone-700 dark:text-zinc-300">
                {post.category}
              </span>
            </li>
            <li>/</li>
            <li aria-current="page" className="truncate max-w-[200px] sm:max-w-xs text-stone-900 dark:text-stone-100">
              {post.slug}
            </li>
          </ol>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onInspectSeo(post)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 dark:text-emerald-300 border border-emerald-300/60 transition-colors"
              title="Inspect On-Page SEO & AEO verification score"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>AEO & SEO 100/100</span>
            </button>
            <button
              onClick={(e) => onToggleBookmark(post.id, e)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isBookmarked
                  ? 'border-amber-300 bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                  : 'border-stone-200 dark:border-zinc-800 text-stone-500 hover:bg-stone-100 dark:hover:bg-zinc-800'
              }`}
              title={isBookmarked ? 'Remove saved publication' : 'Save publication to reading queue'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Article Header (Exactly ONE <h1> tag per page as required by Technical SEO) */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-6 text-left">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900">
            {post.category}
          </span>
          <span className="text-xs text-stone-400">•</span>
          <span className="text-xs text-stone-500 dark:text-zinc-400 font-mono flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {post.readingTimeMinutes} min study
          </span>
          <span className="text-xs text-stone-400">•</span>
          <span className="text-xs text-stone-500 dark:text-zinc-400 font-mono flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {formattedDate}
          </span>
        </div>

        {/* EXACTLY ONE H1 TAG ON THE PAGE */}
        <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-[1.18]">
          {post.title.replace(' | KURA', '')}
        </h1>

        {/* Subtitle */}
        {post.subtitle && (
          <p className="mt-4 text-lg sm:text-xl text-stone-600 dark:text-zinc-300 font-editorial leading-relaxed">
            {post.subtitle}
          </p>
        )}

        {/* Target Keyword and AEO Summary Pill */}
        {post.seo.mainKeyword && (
          <div className="mt-4 inline-flex flex-wrap items-center gap-2 p-2 px-3 rounded-xl bg-stone-100 dark:bg-zinc-800/80 border border-stone-200 dark:border-zinc-700 text-xs font-mono">
            <span className="font-semibold text-stone-500 dark:text-zinc-400">Target Keyword:</span>
            <span className="font-bold text-stone-900 dark:text-stone-100">
              {post.seo.mainKeyword}
            </span>
            {post.seo.searchVolume && (
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold">
                Vol: {post.seo.searchVolume}
              </span>
            )}
            {post.seo.keywordDifficulty && (
              <span className="px-2 py-0.5 rounded bg-stone-200 dark:bg-zinc-700 text-stone-800 dark:text-zinc-200 font-semibold">
                KD: {post.seo.keywordDifficulty}
              </span>
            )}
          </div>
        )}

        {/* Author Info & Share Bar */}
        <div className="mt-8 pt-6 border-t border-stone-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover ring-1 ring-stone-300 dark:ring-zinc-700"
            />
            <div className="text-left">
              <div className="font-semibold text-stone-900 dark:text-stone-100 text-sm">
                {post.author.name}
              </div>
              <div className="text-xs text-stone-500 dark:text-zinc-400">
                {post.author.title}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareTwitter}
              className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-600 dark:text-zinc-400 transition-colors"
              title="Share publication on X / Twitter"
            >
              <Twitter className="w-4 h-4" />
            </button>
            <button
              onClick={handleShareLinkedIn}
              className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-600 dark:text-zinc-400 transition-colors"
              title="Share publication on LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-800 text-xs font-mono font-medium text-stone-700 dark:text-zinc-300 transition-colors"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Canonical Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Responsive Feature Image with Explicit Width/Height and Descriptive Alt */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 my-6">
        <div className="overflow-hidden rounded-3xl border border-stone-200 dark:border-zinc-800 shadow-md bg-stone-100 dark:bg-zinc-800">
          <img
            src={post.coverImage}
            alt={post.coverImageAlt}
            width={post.coverImageWidth || 1200}
            height={post.coverImageHeight || 800}
            className="w-full h-auto max-h-[520px] object-cover"
            loading="eager"
          />
        </div>
        <figcaption className="mt-2 text-center text-xs text-stone-500 dark:text-zinc-400 italic font-editorial">
          {post.coverImageAlt}
        </figcaption>
      </div>

      {/* Main Content Layout with Sticky Table of Questions */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 my-8">
        
        {/* Sticky Table of Contents Sidebar */}
        {post.tableOfContents && post.tableOfContents.length > 0 && (
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24 p-5 rounded-2xl border border-stone-200 dark:border-zinc-800 bg-stone-50/70 dark:bg-zinc-900/60 backdrop-blur-md">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 mb-3 font-mono flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" /> Table of Architectural Inquiries
              </h3>
              <nav className="space-y-2 text-xs">
                {post.tableOfContents.map((item, idx) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block py-1 text-stone-700 dark:text-zinc-300 hover:text-amber-800 dark:hover:text-amber-300 font-editorial leading-snug transition-colors"
                  >
                    <span className="font-mono text-stone-400 mr-1.5">{idx + 1}.</span>
                    {item.text}
                  </a>
                ))}
              </nav>

              <div className="mt-6 pt-4 border-t border-stone-200 dark:border-zinc-800">
                <button
                  onClick={() => onInspectSeo(post)}
                  className="w-full text-left flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 font-medium font-mono"
                >
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Full SEO & AEO Audit
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-[10px] font-bold">
                    Grade A+
                  </span>
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Article Body */}
        <div className="lg:col-span-8 max-w-3xl">
          <div className="prose dark:prose-invert max-w-none">
            {renderFormattedContent(post.content)}
          </div>

          {/* Tags */}
          <div className="mt-10 pt-6 border-t border-stone-200 dark:border-zinc-800 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-stone-400 font-mono mr-1">Classification:</span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono px-3 py-1 rounded-full bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Related Semantic Keywords */}
          {post.seo.relatedKeywords && post.seo.relatedKeywords.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-stone-400 font-mono mr-1">Semantic Clusters:</span>
              {post.seo.relatedKeywords.map((kw) => (
                <span
                  key={kw}
                  className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-100 dark:bg-zinc-800/80 text-stone-600 dark:text-zinc-400 border border-stone-200 dark:border-zinc-700"
                >
                  {kw}
                </span>
              ))}
            </div>
          )}

          {/* Bottom Navigation with Descriptive Internal Link Anchors */}
          <div className="mt-10 p-5 rounded-2xl border border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200 hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to KURA architectural journal overview</span>
            </button>

            <button
              onClick={() => onInspectSeo(post)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Inspect Schema.org & AEO Markup</span>
            </button>
          </div>

          {/* Author Bio Box */}
          <div className="mt-10 p-6 rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover ring-1 ring-stone-300 dark:ring-zinc-700 shrink-0"
            />
            <div className="text-center sm:text-left flex-1">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono">
                Authored by
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                {post.author.name}
              </h3>
              <p className="text-xs text-stone-500 dark:text-zinc-400 font-mono">
                {post.author.title}
              </p>
              <p className="mt-2 text-sm text-stone-600 dark:text-zinc-300 leading-relaxed font-editorial">
                {post.author.bio}
              </p>
            </div>
          </div>

          {/* Recommended Architectural Studies (Descriptive Anchor Texts - strictly no "Read more") */}
          {relatedPosts.length > 0 && (
            <section className="mt-14 pt-8 border-t border-stone-200 dark:border-zinc-800">
              <h3 className="font-editorial text-2xl font-bold text-stone-900 dark:text-stone-100 mb-5">
                Related Architectural Research
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedPosts.map((related) => {
                  const descriptiveLabel = `Explore ${related.title.split(':')[0]}`;
                  return (
                    <div
                      key={related.id}
                      onClick={() => onSelectPost(related)}
                      className="group cursor-pointer rounded-2xl border border-stone-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <img
                          src={related.coverImage}
                          alt={related.coverImageAlt}
                          width={400}
                          height={260}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="p-4">
                          <span className="text-[10px] font-mono uppercase text-stone-500 dark:text-zinc-400">
                            {related.category}
                          </span>
                          <h4 className="font-editorial font-bold text-sm text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-300 line-clamp-2 mt-1 leading-snug">
                            {related.title.replace(' | KURA', '')}
                          </h4>
                        </div>
                      </div>

                      <div className="p-4 pt-0">
                        <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 group-hover:text-amber-800 dark:group-hover:text-amber-300 flex items-center gap-1">
                          <span>{descriptiveLabel}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Comments Section */}
          <section className="mt-14 pt-8 border-t border-stone-200 dark:border-zinc-800">
            <h3 className="font-editorial text-2xl font-bold text-stone-900 dark:text-stone-100 mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-stone-500" />
              Architectural Dialogue ({postComments.length})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-8 p-5 rounded-2xl border border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900/40">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Architect / Designer Name"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  required
                  className="px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-500"
                />
              </div>
              <textarea
                rows={3}
                placeholder="Contribute architectural commentary, detailing notes, or material insights..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-500"
              />
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-stone-400 font-mono">
                  Markdown formatting supported
                </span>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Commentary
                </button>
              </div>

              {commentSuccess && (
                <div className="mt-3 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" /> Commentary successfully indexed into publication!
                </div>
              )}
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {postComments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={comment.authorAvatar}
                        alt={comment.authorName}
                        width={28}
                        height={28}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                        {comment.authorName}
                      </span>
                      <span className="text-[11px] text-stone-400 font-mono">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-zinc-300 leading-relaxed font-editorial">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </article>
  );
};
