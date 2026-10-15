import React from 'react';
import { BlogPost, SeoAuditReport } from '../types/blog';
import { 
  analyzePostSeo, 
  generateBlogPostingSchema, 
  generateSitemapXml, 
  generateRobotsTxt, 
  DEFAULT_BASE_URL 
} from '../utils/seo';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Copy, 
  Check, 
  Download, 
  Globe, 
  Smartphone, 
  Monitor, 
  Twitter, 
  FileCode, 
  Search, 
  Share2, 
  ExternalLink 
} from 'lucide-react';

interface SeoInspectorModalProps {
  post?: BlogPost | null;
  allPosts: BlogPost[];
  onClose: () => void;
}

export const SeoInspectorModal: React.FC<SeoInspectorModalProps> = ({
  post,
  allPosts,
  onClose,
}) => {
  // If no post provided, inspect the default/featured post or home
  const targetPost = post || allPosts[0];
  const auditReport: SeoAuditReport = React.useMemo(() => {
    return analyzePostSeo(targetPost);
  }, [targetPost]);

  const [activeTab, setActiveTab] = React.useState<'overview' | 'serp' | 'social' | 'schema' | 'sitemap'>('overview');
  const [deviceView, setDeviceView] = React.useState<'desktop' | 'mobile'>('desktop');
  const [copiedSchema, setCopiedSchema] = React.useState(false);
  const [copiedSitemap, setCopiedSitemap] = React.useState(false);
  const [copiedRobots, setCopiedRobots] = React.useState(false);

  const schemaJson = React.useMemo(() => {
    return generateBlogPostingSchema(targetPost, DEFAULT_BASE_URL);
  }, [targetPost]);

  const sitemapXml = React.useMemo(() => {
    return generateSitemapXml(allPosts, DEFAULT_BASE_URL);
  }, [allPosts]);

  const robotsTxt = React.useMemo(() => {
    return generateRobotsTxt(DEFAULT_BASE_URL);
  }, []);

  const handleCopy = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = (content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const passCount = auditReport.checks.filter(c => c.status === 'pass').length;
  const warnCount = auditReport.checks.filter(c => c.status === 'warning').length;
  const failCount = auditReport.checks.filter(c => c.status === 'fail').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-editorial text-lg font-bold text-slate-900 dark:text-white">
                  SEO & Social Metadata Auditor
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40">
                  Grade {auditReport.grade}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                Inspecting: &ldquo;{targetPost.title}&rdquo;
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1 sm:gap-2 overflow-x-auto text-xs sm:text-sm font-medium bg-white dark:bg-slate-900">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Audit Score ({auditReport.score}/100)
          </button>

          <button
            onClick={() => setActiveTab('serp')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'serp'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Search className="w-4 h-4" />
            Google SERP Preview
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'social'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Share2 className="w-4 h-4" />
            Social Cards (OG / X)
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'schema'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            Schema.org JSON-LD
          </button>

          <button
            onClick={() => setActiveTab('sitemap')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'sitemap'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            Sitemap & Robots
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: OVERVIEW & CHECKS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Score Highlight Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-1 p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 border border-indigo-200 dark:border-indigo-900/60 flex flex-col items-center justify-center text-center">
                  <div className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
                    {auditReport.score}
                    <span className="text-sm font-normal text-slate-400">/100</span>
                  </div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    SEO Health Index
                  </div>
                </div>

                <div className="sm:col-span-3 grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4" /> Passed
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                      {passCount}
                    </div>
                    <div className="text-[11px] text-slate-500">Fully compliant metrics</div>
                  </div>

                  <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                      <AlertTriangle className="w-4 h-4" /> Warnings
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                      {warnCount}
                    </div>
                    <div className="text-[11px] text-slate-500">Suggested improvements</div>
                  </div>

                  <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                      <XCircle className="w-4 h-4" /> Critical
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                      {failCount}
                    </div>
                    <div className="text-[11px] text-slate-500">Require attention</div>
                  </div>
                </div>
              </div>

              {/* Target Keyword Strategy Card */}
              {targetPost.seo.mainKeyword && (
                <div className="p-5 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-pink-50/30 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-pink-950/10">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                        Target Keyword Strategy
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      {targetPost.seo.searchVolume && (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40">
                          Search Vol: {targetPost.seo.searchVolume}
                        </span>
                      )}
                      {targetPost.seo.keywordDifficulty && (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-300/40">
                          KD: {targetPost.seo.keywordDifficulty}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                    &ldquo;{targetPost.seo.mainKeyword}&rdquo;
                  </div>

                  {targetPost.seo.relatedKeywords && targetPost.seo.relatedKeywords.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-indigo-100 dark:border-indigo-900/40">
                      <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                        Related Semantic Keywords:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {targetPost.seo.relatedKeywords.map((kw) => (
                          <span
                            key={kw}
                            className="text-xs font-mono px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 shadow-2xs"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Detailed Breakdown List */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden bg-white dark:bg-slate-900/40">
                <div className="px-5 py-3 bg-slate-50/80 dark:bg-slate-950/50 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Comprehensive Parameter Audit
                </div>

                {auditReport.checks.map((check) => (
                  <div key={check.id} className="p-4 sm:p-5 flex items-start gap-4">
                    <div className="mt-0.5">
                      {check.status === 'pass' && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      )}
                      {check.status === 'warning' && (
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                      )}
                      {check.status === 'fail' && (
                        <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white">
                          {check.label}
                        </span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {check.value}
                        </span>
                      </div>
                      <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                        {check.recommendation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: GOOGLE SERP SIMULATOR */}
          {activeTab === 'serp' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                    Google Search Engine Snippet Simulation
                  </h4>
                  <p className="text-xs text-slate-500">
                    Previews how Google Desktop & Mobile users view this article in organic search.
                  </p>
                </div>

                <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <button
                    onClick={() => setDeviceView('desktop')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                      deviceView === 'desktop'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" /> Desktop
                  </button>
                  <button
                    onClick={() => setDeviceView('mobile')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                      deviceView === 'mobile'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" /> Mobile
                  </button>
                </div>
              </div>

              {/* SERP Box */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-md">
                <div className={`${deviceView === 'mobile' ? 'max-w-md mx-auto p-4 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm' : 'max-w-2xl'}`}>
                  
                  {/* Google search brand breadcrumbs */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                      ✦
                    </div>
                    <div className="flex flex-col text-xs leading-none">
                      <span className="font-semibold text-slate-900 dark:text-slate-200">
                        Lumina Magazine
                      </span>
                      <span className="text-[11px] text-slate-500 line-clamp-1">
                        https://luminablog.vercel.app &rsaquo; post &rsaquo; {targetPost.slug}
                      </span>
                    </div>
                  </div>

                  {/* Clickable blue SERP Title */}
                  <h3 className="text-xl text-[#1a0dab] dark:text-[#8ab4f8] font-normal hover:underline cursor-pointer leading-tight mb-1.5">
                    {targetPost.seo.metaTitle || targetPost.title}
                  </h3>

                  {/* Snippet Description */}
                  <p className="text-sm text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed">
                    <span className="text-xs text-slate-400 mr-1.5">
                      {new Date(targetPost.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} —
                    </span>
                    {targetPost.seo.metaDescription || targetPost.excerpt}
                  </p>

                  {/* Sitelinks or Breadcrumb Rich Result badge */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-900 flex items-center gap-4 text-xs text-indigo-600 dark:text-indigo-400">
                    <span className="hover:underline cursor-pointer">Category: {targetPost.category}</span>
                    <span className="hover:underline cursor-pointer">Author: {targetPost.author.name}</span>
                    <span className="hover:underline cursor-pointer">{targetPost.readingTimeMinutes} min read</span>
                  </div>
                </div>
              </div>

              {/* Character Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  <div className="flex justify-between items-center text-xs font-semibold mb-1">
                    <span>Title Character Length</span>
                    <span className={auditReport.titleLength <= 60 ? 'text-emerald-500' : 'text-amber-500'}>
                      {auditReport.titleLength} / 60 max optimal
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className={`h-full ${auditReport.titleLength <= 60 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                      style={{ width: `${Math.min(100, (auditReport.titleLength / 60) * 100)}%` }} 
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  <div className="flex justify-between items-center text-xs font-semibold mb-1">
                    <span>Meta Description Length</span>
                    <span className={auditReport.descriptionLength >= 120 && auditReport.descriptionLength <= 160 ? 'text-emerald-500' : 'text-amber-500'}>
                      {auditReport.descriptionLength} / 160 max optimal
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className={`h-full ${auditReport.descriptionLength >= 120 && auditReport.descriptionLength <= 160 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                      style={{ width: `${Math.min(100, (auditReport.descriptionLength / 160) * 100)}%` }} 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SOCIAL CARDS PREVIEW */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                  Social Sharing Card Simulations
                </h4>
                <p className="text-xs text-slate-500">
                  Real-time preview of OpenGraph & Twitter large summary cards on X/Twitter, LinkedIn, and Facebook.
                </p>
              </div>

              {/* Twitter Card Preview */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <Twitter className="w-4 h-4 text-sky-500" />
                  X / Twitter Large Summary Card
                </div>

                <div className="max-w-xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950 shadow-md">
                  <div className="relative h-60 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={targetPost.seo.ogImage || targetPost.coverImage}
                      alt={targetPost.coverImageAlt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-medium backdrop-blur-md">
                      luminablog.vercel.app
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-slate-400 mb-0.5">luminablog.vercel.app</div>
                    <div className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-1">
                      {targetPost.seo.metaTitle || targetPost.title}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {targetPost.seo.metaDescription || targetPost.excerpt}
                    </p>
                  </div>
                </div>
              </div>

              {/* Meta Tags Quick Reference */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Injected HTML Meta Tags
                </div>
                <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 leading-relaxed">
{`<meta property="og:type" content="article" />
<meta property="og:title" content="${targetPost.seo.metaTitle || targetPost.title}" />
<meta property="og:description" content="${targetPost.seo.metaDescription || targetPost.excerpt}" />
<meta property="og:image" content="${targetPost.seo.ogImage || targetPost.coverImage}" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="canonical" href="${targetPost.seo.canonicalUrl || DEFAULT_BASE_URL + '/#post/' + targetPost.slug}" />`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: SCHEMA.ORG JSON-LD */}
          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-indigo-500" />
                    Schema.org JSON-LD Structured Data
                  </h4>
                  <p className="text-xs text-slate-500">
                    Embedded into the document head to power Google Rich Results and author badges.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://validator.schema.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    <span>Validator Tool</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => handleCopy(JSON.stringify(schemaJson, null, 2), setCopiedSchema)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
                  >
                    {copiedSchema ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSchema ? 'Copied' : 'Copy JSON-LD'}</span>
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-inner">
                <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                  {JSON.stringify(schemaJson, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 5: SITEMAP & ROBOTS */}
          {activeTab === 'sitemap' && (
            <div className="space-y-6">
              {/* Sitemap.xml Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                      <Globe className="w-4 h-4 text-indigo-500" />
                      Dynamic XML Sitemap (/sitemap.xml)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Standard XML protocol containing all {allPosts.length} published stories with priority & lastmod tags.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(sitemapXml, setCopiedSitemap)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      {copiedSitemap ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy XML</span>
                    </button>
                    <button
                      onClick={() => handleDownloadFile(sitemapXml, 'sitemap.xml', 'application/xml')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
                  <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-52 leading-relaxed">
                    {sitemapXml}
                  </pre>
                </div>
              </div>

              {/* robots.txt Section */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                      Robots Directive (/robots.txt)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Authoritative crawler permissions file pointing search engines to sitemap.xml.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(robotsTxt, setCopiedRobots)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      {copiedRobots ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy</span>
                    </button>
                    <button
                      onClick={() => handleDownloadFile(robotsTxt, 'robots.txt', 'text/plain')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
                  <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
                    {robotsTxt}
                  </pre>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Complies with Google Search Central 2026 guidelines & Schema.org standards.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
