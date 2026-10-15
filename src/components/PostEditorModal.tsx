import React from 'react';
import { BlogPost, Category } from '../types/blog';
import { INITIAL_AUTHORS } from '../data/initialPosts';
import { 
  X, 
  Sparkles, 
  Image as ImageIcon, 
  Check, 
  Eye, 
  Edit3, 
  ShieldCheck, 
  HelpCircle,
  FileText
} from 'lucide-react';
import { DEFAULT_BASE_URL } from '../utils/seo';

interface PostEditorModalProps {
  onClose: () => void;
  onSave: (post: BlogPost) => void;
  initialPost?: BlogPost | null;
}

const CATEGORIES: Category[] = [
  'Engineering',
  'Artificial Intelligence',
  'System Architecture',
  'Design Systems',
  'SEO & Performance',
  'Cloud & DevOps',
];

const PRESET_COVERS = [
  {
    label: 'Architecture & Code',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&h=630&q=80',
    alt: 'Clean lines of code displayed on multiple high-resolution developer monitors',
  },
  {
    label: 'SEO & Analytics',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=630&q=80',
    alt: 'Modern data analytics dashboard showing SEO traffic growth and performance metrics',
  },
  {
    label: 'AI & Neural Nets',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=80',
    alt: 'Abstract 3D digital neural network visualization glowing with iridescent cyan and purple gradients',
  },
  {
    label: 'Cloud & Infrastructure',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&h=630&q=80',
    alt: 'Modern server infrastructure glowing with fiber optic connectivity representing edge network',
  },
  {
    label: 'Design & Workspace',
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&h=630&q=80',
    alt: 'Minimalist designer desk with color swatches, typography specimens, and digital tablets',
  },
];

export const PostEditorModal: React.FC<PostEditorModalProps> = ({
  onClose,
  onSave,
  initialPost,
}) => {
  const isEditing = Boolean(initialPost);

  const [title, setTitle] = React.useState(initialPost?.title || '');
  const [subtitle, setSubtitle] = React.useState(initialPost?.subtitle || '');
  const [slug, setSlug] = React.useState(initialPost?.slug || '');
  const [excerpt, setExcerpt] = React.useState(initialPost?.excerpt || '');
  const [content, setContent] = React.useState(
    initialPost?.content ||
      `## 1. Introduction {#introduction}\n\nStart authoring your technical insights here...\n\n> "Add an editorial pull quote here."\n\n## 2. Key Architecture Details {#architecture}\n\nBreak your article into structured H2 sections for maximum search engine crawlability.\n\n\`\`\`typescript\n// Example code snippet\nfunction calculatePerformance(metric: string): number {\n  return performance.now();\n}\n\`\`\`\n\n:::tip\nAdd actionable engineering tips using :::tip or :::note blocks!\n:::\n`
  );
  const [category, setCategory] = React.useState<Category>(initialPost?.category || 'Engineering');
  const [tagsInput, setTagsInput] = React.useState(initialPost?.tags.join(', ') || 'React, Performance, WebDev');
  const [coverImage, setCoverImage] = React.useState(initialPost?.coverImage || PRESET_COVERS[0].url);
  const [coverImageAlt, setCoverImageAlt] = React.useState(initialPost?.coverImageAlt || PRESET_COVERS[0].alt);
  
  // SEO specific states
  const [metaTitle, setMetaTitle] = React.useState(initialPost?.seo.metaTitle || '');
  const [metaDescription, setMetaDescription] = React.useState(initialPost?.seo.metaDescription || '');
  
  const [activeTab, setActiveTab] = React.useState<'write' | 'preview'>('write');

  // Auto-generate slug when title changes (if creating new)
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!isEditing || !slug) {
      const autoSlug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(autoSlug);
    }
    if (!metaTitle) {
      setMetaTitle(newTitle);
    }
  };

  const handleExcerptChange = (newExcerpt: string) => {
    setExcerpt(newExcerpt);
    if (!metaDescription) {
      setMetaDescription(newExcerpt);
    }
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const effectiveMetaTitle = metaTitle || title;
  const effectiveMetaDesc = metaDescription || excerpt;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    // Parse simple TOC from ## Headings
    const lines = content.split('\n');
    const tableOfContents = lines
      .filter((l) => l.startsWith('## '))
      .map((l) => {
        const idMatch = l.match(/\{#([^}]+)\}/);
        const headingText = l.replace('## ', '').replace(/\{#[^}]+\}/, '').trim();
        const headingId = idMatch ? idMatch[1] : headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return {
          id: headingId,
          text: headingText,
          level: 2,
        };
      });

    const newPost: BlogPost = {
      id: initialPost?.id || `post-${Date.now()}`,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title,
      subtitle: subtitle || excerpt,
      excerpt: excerpt || title,
      content,
      coverImage,
      coverImageAlt: coverImageAlt || title,
      category,
      tags: tags.length > 0 ? tags : ['Technology'],
      author: initialPost?.author || INITIAL_AUTHORS.elena,
      publishedAt: initialPost?.publishedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readingTimeMinutes: readingTime,
      wordCount,
      featured: initialPost?.featured || false,
      trending: initialPost?.trending || false,
      views: initialPost?.views || 1,
      claps: initialPost?.claps || 0,
      seo: {
        metaTitle: effectiveMetaTitle,
        metaDescription: effectiveMetaDesc,
        keywords: tags,
        canonicalUrl: `${DEFAULT_BASE_URL}/#post/${slug}`,
        ogImage: coverImage,
        twitterCardType: 'summary_large_image',
        structuredDataType: 'BlogPosting',
      },
      tableOfContents,
    };

    onSave(newPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-5xl max-h-[92vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-editorial text-lg font-bold text-slate-900 dark:text-white">
                {isEditing ? 'Edit Story & SEO Parameters' : 'Editorial Writing Studio'}
              </h3>
              <p className="text-xs text-slate-500">
                Author in Markdown with live SEO character meters and Schema.org syncing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Write / Preview Tab Toggle */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <button
                type="button"
                onClick={() => setActiveTab('write')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  activeTab === 'write'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" /> Editor
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'write' ? (
            <>
              {/* Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <label htmlFor="title">Article Headline / Title *</label>
                    <span className={title.length >= 30 && title.length <= 60 ? 'text-emerald-500 font-mono' : 'text-amber-500 font-mono'}>
                      {title.length} / 60 chars (Optimal 30–60)
                    </span>
                  </div>
                  <input
                    id="title"
                    type="text"
                    required
                    placeholder="e.g., Deploying Modern Micro-Frontends on Edge Networks"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-editorial text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="slug" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    URL Slug
                  </label>
                  <input
                    id="slug"
                    type="text"
                    required
                    placeholder="deploying-modern-micro-frontends"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Subtitle & Category & Tags */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="category" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Primary Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="tags" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Tags (comma separated)
                  </label>
                  <input
                    id="tags"
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="React, Architecture, Vite"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="subtitle" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Editorial Subtitle / Lead
                  </label>
                  <input
                    id="subtitle"
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="A practical guide to distributed systems..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Cover Image Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-indigo-500" />
                  Cover Photo (Select Preset or Provide URL)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {PRESET_COVERS.map((preset) => (
                    <div
                      key={preset.url}
                      onClick={() => {
                        setCoverImage(preset.url);
                        setCoverImageAlt(preset.alt);
                      }}
                      className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                        coverImage === preset.url
                          ? 'border-indigo-600 ring-2 ring-indigo-500/20'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-16 object-cover" />
                      <div className="p-1 bg-slate-100 dark:bg-slate-800 text-[10px] text-center font-medium truncate">
                        {preset.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <input
                    type="url"
                    placeholder="Custom Image URL (https://...)"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Cover Image Alt Text (e.g. Modern server glowing with LEDs)"
                    value={coverImageAlt}
                    onChange={(e) => setCoverImageAlt(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Markdown Content Editor */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <label htmlFor="content">Markdown Story Content *</label>
                  <span className="text-slate-500 font-mono">
                    {wordCount} words • ~{readingTime} min read
                  </span>
                </div>
                <textarea
                  id="content"
                  rows={12}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono-code text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* SEO Meta Specifics Accordion */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> SEO Meta Tuning
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Controls SERP snippet & social share appearance
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-medium text-slate-600 dark:text-slate-300">
                    <span>Meta Description (SERP Snippet)</span>
                    <span className={effectiveMetaDesc.length >= 120 && effectiveMetaDesc.length <= 160 ? 'text-emerald-500 font-mono' : 'text-amber-500 font-mono'}>
                      {effectiveMetaDesc.length} / 160 chars (Optimal 120–160)
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Enter an enticing 120-160 character summary that compels searchers to click..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </>
          ) : (
            /* PREVIEW TAB */
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                <Eye className="w-4 h-4 shrink-0" />
                This is a live layout simulation of how readers will experience this article.
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 bg-white dark:bg-slate-950">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {category}
                </span>
                <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-3">
                  {title || 'Untitled Article'}
                </h1>
                {subtitle && (
                  <p className="mt-2 text-lg text-slate-600 dark:text-slate-300 font-editorial">
                    {subtitle}
                  </p>
                )}

                <div className="my-6 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-72">
                  <img src={coverImage} alt={coverImageAlt} className="w-full h-full object-cover" />
                </div>

                <div className="font-editorial text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {content}
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer with Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Update & Publish' : 'Publish Story'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
