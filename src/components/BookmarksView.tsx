import React from 'react';
import { BlogPost } from '../types/blog';
import { ArticleCard } from './ArticleCard';
import { Bookmark, ArrowLeft, Trash2 } from 'lucide-react';

interface BookmarksViewProps {
  bookmarkedPosts: BlogPost[];
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  onClearAll: () => void;
  onSelectPost: (post: BlogPost) => void;
  onInspectSeo: (post: BlogPost, e: React.MouseEvent) => void;
  onBack: () => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  bookmarkedPosts,
  onToggleBookmark,
  onClearAll,
  onSelectPost,
  onInspectSeo,
  onBack,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to all stories
          </button>
          <h1 className="font-editorial text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-indigo-500" />
            Your Reading List ({bookmarkedPosts.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Articles saved locally in your browser for offline or deferred study.
          </p>
        </div>

        {bookmarkedPosts.length > 0 && (
          <button
            onClick={onClearAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Reading List
          </button>
        )}
      </div>

      {bookmarkedPosts.length === 0 ? (
        <div className="py-20 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 flex items-center justify-center mb-4">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="font-editorial text-xl font-bold text-slate-900 dark:text-white">
            No saved articles yet
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-2">
            Click the bookmark icon on any story to curate your personalized reading queue.
          </p>
          <button
            onClick={onBack}
            className="mt-6 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm transition-colors"
          >
            Explore Publications
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedPosts.map((post) => (
            <ArticleCard
              key={post.id}
              post={post}
              isBookmarked={true}
              onToggleBookmark={onToggleBookmark}
              onSelect={onSelectPost}
              onInspectSeo={onInspectSeo}
            />
          ))}
        </div>
      )}
    </div>
  );
};
