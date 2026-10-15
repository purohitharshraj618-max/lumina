import React from 'react';
import { BlogPost } from '../types/blog';
import { Bookmark, Clock, Eye, Heart, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

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

  if (variant === 'featured') {
    return (
      <article
        onClick={() => onSelect(post)}
        className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-indigo-500/50"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Cover Image */}
          <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-full min-h-[320px] overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.coverImageAlt}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:hidden" />
            
            {/* Category Badge overlay on image */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-slate-950/90 backdrop-blur-md text-indigo-600 dark:text-indigo-400 border border-white/20 shadow-sm">
                {post.category}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/90 text-white backdrop-blur-md flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3" /> Featured Story
              </span>
            </div>
          </div>

          {/* Content details */}
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                <div className="flex items-center gap-2">
                  <span>{formattedDate}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readingTimeMinutes} min read
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {onInspectSeo && (
                    <button
                      onClick={(e) => onInspectSeo(post, e)}
                      title="Inspect SEO score"
                      className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={(e) => onToggleBookmark(post.id, e)}
                    title={isBookmarked ? 'Remove bookmark' : 'Save article'}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isBookmarked
                        ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950'
                        : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {post.title}
              </h2>

              <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Author Footer */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
                />
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    {post.author.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {post.author.title.split('&')[0]}
                  </div>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                Read story <ArrowRight className="w-4 h-4" />
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
        className="group flex gap-4 items-start p-3 rounded-2xl hover:bg-slate-100/70 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
      >
        <img
          src={post.coverImage}
          alt={post.coverImageAlt}
          className="w-20 h-20 rounded-xl object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {post.category}
            </span>
            <span>•</span>
            <span>{post.readingTimeMinutes} min</span>
          </div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {post.title}
          </h4>
          <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
            <span>{post.author.name}</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Heart className="w-3 h-3 text-pink-500" /> {post.claps}
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
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 shadow-sm hover:shadow-md transition-all duration-300 hover:border-indigo-500/40 cursor-pointer"
    >
      <div>
        {/* Card Header & Image */}
        <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={post.coverImage}
            alt={post.coverImageAlt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-slate-950/90 backdrop-blur-md text-indigo-600 dark:text-indigo-400 border border-white/20 shadow-sm">
              {post.category}
            </span>
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {onInspectSeo && (
              <button
                onClick={(e) => onInspectSeo(post, e)}
                title="Inspect SEO score"
                className="p-1.5 rounded-full bg-white/90 dark:bg-slate-950/90 text-emerald-600 dark:text-emerald-400 hover:scale-110 transition-transform shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={(e) => onToggleBookmark(post.id, e)}
              title={isBookmarked ? 'Remove bookmark' : 'Save article'}
              className={`p-1.5 rounded-full bg-white/90 dark:bg-slate-950/90 shadow-sm transition-transform hover:scale-110 ${
                isBookmarked ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Post Summary Body */}
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>{formattedDate}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readingTimeMinutes} min
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {post.views.toLocaleString()}
            </span>
          </div>

          <h3 className="font-editorial text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
            {post.title}
          </h3>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Author Footer */}
      <div className="px-5 sm:px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-7 h-7 rounded-full object-cover"
          />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {post.author.name}
          </span>
        </div>

        <span className="flex items-center gap-1 text-xs font-medium text-pink-600 dark:text-pink-400">
          <Heart className="w-3.5 h-3.5 fill-pink-500/20" />
          {post.claps}
        </span>
      </div>
    </article>
  );
};
