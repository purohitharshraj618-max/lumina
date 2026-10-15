import React from 'react';
import { BlogPost } from '../types/blog';
import { Bookmark, Clock, Eye, Heart, Sparkles, ShieldCheck, ArrowRight, HelpCircle } from 'lucide-react';

interface ArticleCardProps {
  post: BlogPost;
  variant?: 'featured' | 'standard' | 'compact';
  isBookmarked: boolean;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  onSelect: (post: BlogPost) => void;
  onInspectSeo?: (post: BlogPost, e: React.MouseEvent) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  post,
  variant = 'standard',
  isBookmarked,
  onToggleBookmark,
  onSelect,
  onInspectSeo,
}) => {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Descriptive anchor text generator for internal link equity (NO "Read more" or "Click here")
  const descriptiveActionLabel = `Explore ${post.title.split(':')[0]} architectural study`;

  if (variant === 'featured') {
    return (
      <article
        onClick={() => onSelect(post)}
        className="group relative cursor-pointer overflow-hidden rounded-3xl border border-stone-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-md hover:shadow-xl transition-all duration-300 hover:border-stone-400 dark:hover:border-zinc-700"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Cover Image with explicit width/height and responsive WebP loading */}
          <div className="lg:col-span-7 relative h-72 sm:h-88 lg:h-full min-h-[340px] overflow-hidden bg-stone-100 dark:bg-zinc-800">
            <img
              src={post.coverImage}
              alt={post.coverImageAlt}
              width={post.coverImageWidth || 1200}
              height={post.coverImageHeight || 800}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent lg:hidden" />
            
            {/* Category and AEO Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase bg-stone-900/90 text-stone-100 dark:bg-stone-100/90 dark:text-stone-900 backdrop-blur-md shadow-xs">
                {post.category}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-700/90 text-white backdrop-blur-md flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3 h-3" /> Lead Study
              </span>
              {post.aeoQuestions && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-800/90 text-white backdrop-blur-md flex items-center gap-1 shadow-xs">
                  <HelpCircle className="w-3 h-3" /> AEO Verified
                </span>
              )}
            </div>
          </div>

          {/* Editorial Content */}
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-zinc-400 mb-3 font-mono">
                <div className="flex items-center gap-2">
                  <span>{formattedDate}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readingTimeMinutes} min study
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {onInspectSeo && (
                    <button
                      onClick={(e) => onInspectSeo(post, e)}
                      title="Inspect On-Page SEO & AEO score"
                      className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={(e) => onToggleBookmark(post.id, e)}
                    title={isBookmarked ? 'Remove saved publication' : 'Save publication to reading queue'}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isBookmarked
                        ? 'text-amber-800 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200 hover:bg-stone-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Sub-headline on homepage cards (H2 is reserved for sections; cards use h2 or h3) */}
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors leading-snug">
                {post.title.replace(' | KURA', '')}
              </h2>

              <p className="mt-3 text-sm sm:text-base text-stone-600 dark:text-zinc-300 line-clamp-3 leading-relaxed font-editorial">
                {post.excerpt}
              </p>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Author & Descriptive Link Footer */}
            <div className="mt-6 pt-6 border-t border-stone-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-stone-300 dark:ring-zinc-700"
                />
                <div>
                  <div className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {post.author.name}
                  </div>
                  <div className="text-xs text-stone-500 dark:text-zinc-400">
                    {post.author.title.split('&')[0]}
                  </div>
                </div>
              </div>

              {/* DESCRIPTIVE ANCHOR TEXT (No "Read more" or "Click here") */}
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 group-hover:translate-x-1 transition-transform group-hover:text-amber-800 dark:group-hover:text-amber-300">
                <span>{descriptiveActionLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article
        onClick={() => onSelect(post)}
        className="group flex gap-4 items-start p-3.5 rounded-2xl hover:bg-stone-100/70 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors border border-transparent hover:border-stone-200 dark:hover:border-zinc-800"
      >
        <img
          src={post.coverImage}
          alt={post.coverImageAlt}
          width={96}
          height={96}
          className="w-24 h-24 rounded-xl object-cover shrink-0 bg-stone-100 dark:bg-zinc-800"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-zinc-400 mb-1 font-mono">
            <span className="font-semibold uppercase text-stone-900 dark:text-stone-100">
              {post.category}
            </span>
            <span>•</span>
            <span>{post.readingTimeMinutes} min</span>
          </div>
          <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 line-clamp-2 group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors leading-snug">
            {post.title.replace(' | KURA', '')}
          </h3>
          <div className="flex items-center justify-between mt-2 text-xs text-stone-400">
            <span>{post.author.name}</span>
            <span className="font-medium text-stone-700 dark:text-zinc-300 text-[11px] group-hover:underline">
              {descriptiveActionLabel} &rarr;
            </span>
          </div>
        </div>
      </article>
    );
  }

  // Standard Grid Card
  return (
    <article
      onClick={() => onSelect(post)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs hover:shadow-md transition-all duration-300 hover:border-stone-400 dark:hover:border-zinc-700 cursor-pointer"
    >
      <div>
        {/* Card Header & Responsive Image with explicit width/height */}
        <div className="relative h-52 overflow-hidden bg-stone-100 dark:bg-zinc-800">
          <img
            src={post.coverImage}
            alt={post.coverImageAlt}
            width={post.coverImageWidth || 600}
            height={post.coverImageHeight || 400}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium uppercase tracking-wider bg-stone-900/90 text-stone-100 dark:bg-stone-100/90 dark:text-stone-900 backdrop-blur-md shadow-xs">
              {post.category}
            </span>
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {onInspectSeo && (
              <button
                onClick={(e) => onInspectSeo(post, e)}
                title="Inspect SEO and AEO schema"
                className="p-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 text-emerald-600 dark:text-emerald-400 hover:scale-110 transition-transform shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={(e) => onToggleBookmark(post.id, e)}
              title={isBookmarked ? 'Remove saved publication' : 'Save publication'}
              className={`p-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 shadow-xs transition-transform hover:scale-110 ${
                isBookmarked ? 'text-amber-800 dark:text-amber-300' : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Post Summary Body */}
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-zinc-400 mb-2 font-mono">
            <span>{formattedDate}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readingTimeMinutes} min study
            </span>
          </div>

          <h3 className="font-editorial text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
            {post.title.replace(' | KURA', '')}
          </h3>

          <p className="mt-2 text-sm text-stone-600 dark:text-zinc-300 line-clamp-2 leading-relaxed font-editorial">
            {post.excerpt}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Author Footer with Descriptive Anchor Text */}
      <div className="px-5 sm:px-6 py-3.5 border-t border-stone-100 dark:border-zinc-800 bg-stone-50/60 dark:bg-zinc-900/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            width={28}
            height={28}
            className="w-7 h-7 rounded-full object-cover"
          />
          <span className="text-xs font-medium text-stone-700 dark:text-zinc-300">
            {post.author.name}
          </span>
        </div>

        {/* DESCRIPTIVE ANCHOR TEXT (No "Read more" or "Click here") */}
        <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-300 flex items-center gap-1">
          <span>{descriptiveActionLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </article>
  );
};
