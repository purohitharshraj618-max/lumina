import { BlogPost, SeoAuditReport, SeoCheck } from '../types/blog';

export const DEFAULT_BASE_URL = 'https://luminablog.vercel.app';

/**
 * Dynamically updates document metadata for SEO, OpenGraph, Twitter, and Schema.org
 */
export function updateDocumentSeo(options: {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  schemaJson?: object;
}) {
  if (typeof document === 'undefined') return;

  // 1. Page Title
  document.title = options.title;

  // Helper for meta tags
  const setMeta = (name: string, content: string, isProperty = false) => {
    const attribute = isProperty ? 'property' : 'name';
    let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement | null;
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, name);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // 2. Standard Meta
  setMeta('description', options.description);
  setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  if (options.author) {
    setMeta('author', options.author);
  }

  // 3. Canonical Link
  const currentUrl = options.canonicalUrl || (typeof window !== 'undefined' ? window.location.href : DEFAULT_BASE_URL);
  let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', currentUrl);

  // 4. OpenGraph
  setMeta('og:title', options.title, true);
  setMeta('og:description', options.description, true);
  setMeta('og:type', options.ogType || 'website', true);
  setMeta('og:url', currentUrl, true);
  setMeta('og:site_name', 'Lumina Magazine', true);
  
  const ogImg = options.ogImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&h=630&q=80';
  setMeta('og:image', ogImg, true);

  if (options.publishedTime) {
    setMeta('article:published_time', options.publishedTime, true);
  }
  if (options.modifiedTime) {
    setMeta('article:modified_time', options.modifiedTime, true);
  }

  // 5. Twitter Card
  setMeta('twitter:card', options.twitterCard || 'summary_large_image');
  setMeta('twitter:title', options.title);
  setMeta('twitter:description', options.description);
  setMeta('twitter:image', ogImg);
  setMeta('twitter:site', '@luminablog');
  setMeta('twitter:creator', '@luminablog');

  // 6. Schema.org JSON-LD structured data
  if (options.schemaJson) {
    let scriptEl = document.getElementById('schema-ld-json') as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'schema-ld-json';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(options.schemaJson, null, 2);
  }
}

/**
 * Generates valid Schema.org BlogPosting structured data
 */
export function generateBlogPostingSchema(post: BlogPost, baseUrl = DEFAULT_BASE_URL) {
  const postUrl = `${baseUrl}/#post/${post.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': post.seo.structuredDataType || 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    headline: post.seo.metaTitle || post.title,
    description: post.seo.metaDescription || post.excerpt,
    image: [post.seo.ogImage || post.coverImage],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.title,
      url: `${baseUrl}/#author/${post.author.id}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Lumina Editorial',
      logo: {
        '@type': 'ImageObject',
        url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=512&h=512&q=80',
      },
    },
    keywords: post.seo.keywords.join(', '),
    about: post.seo.mainKeyword
      ? [
          {
            '@type': 'Thing',
            name: post.seo.mainKeyword,
          },
          ...(post.seo.relatedKeywords || []).map((kw) => ({
            '@type': 'Thing',
            name: kw,
          })),
        ]
      : undefined,
    articleSection: post.category,
    wordCount: post.wordCount,
    timeRequired: `PT${post.readingTimeMinutes}M`,
  };
}

/**
 * Generates Schema.org BreadcrumbList structured data
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Performs an in-depth SEO audit on an article
 */
export function analyzePostSeo(post: BlogPost): SeoAuditReport {
  const title = post.seo.metaTitle || post.title;
  const description = post.seo.metaDescription || post.excerpt;
  const checks: SeoCheck[] = [];
  let score = 100;

  // Check 1: Title Length (Target: 30 - 60 chars)
  const titleLen = title.length;
  if (titleLen >= 30 && titleLen <= 60) {
    checks.push({
      id: 'title-len',
      label: 'Meta Title Length',
      status: 'pass',
      value: `${titleLen} characters (Optimal 30–60)`,
      recommendation: 'Title is within optimal length for search engine result pages (SERPs).',
    });
  } else if (titleLen > 60 && titleLen <= 70) {
    score -= 8;
    checks.push({
      id: 'title-len',
      label: 'Meta Title Length',
      status: 'warning',
      value: `${titleLen} characters`,
      recommendation: 'Title may truncate slightly on mobile SERPs. Consider shortening to under 60 characters.',
    });
  } else {
    score -= 15;
    checks.push({
      id: 'title-len',
      label: 'Meta Title Length',
      status: 'fail',
      value: `${titleLen} characters`,
      recommendation: titleLen < 30 ? 'Title is too short to rank effectively. Expand to at least 30 characters.' : 'Title will be truncated on Google snippets (>60 chars).',
    });
  }

  // Check 2: Meta Description (Target: 120 - 160 chars)
  const descLen = description.length;
  if (descLen >= 120 && descLen <= 160) {
    checks.push({
      id: 'desc-len',
      label: 'Meta Description Length',
      status: 'pass',
      value: `${descLen} characters (Optimal 120–160)`,
      recommendation: 'Engaging length that fills SERP snippet without getting truncated.',
    });
  } else if (descLen >= 90 && descLen < 120) {
    score -= 6;
    checks.push({
      id: 'desc-len',
      label: 'Meta Description Length',
      status: 'warning',
      value: `${descLen} characters`,
      recommendation: 'A bit brief. Consider expanding to 120–160 characters with a strong call-to-action.',
    });
  } else {
    score -= 14;
    checks.push({
      id: 'desc-len',
      label: 'Meta Description Length',
      status: descLen > 160 ? 'warning' : 'fail',
      value: `${descLen} characters`,
      recommendation: descLen > 160 ? 'Exceeds 160 characters; likely to be truncated on Google.' : 'Too short. Aim for 120–160 characters to maximize click-through rate.',
    });
  }

  // Check 3: Canonical URL
  if (post.seo.canonicalUrl && post.seo.canonicalUrl.startsWith('http')) {
    checks.push({
      id: 'canonical',
      label: 'Canonical Tag',
      status: 'pass',
      value: post.seo.canonicalUrl,
      recommendation: 'Canonical tag properly defined to prevent duplicate content penalties.',
    });
  } else {
    score -= 10;
    checks.push({
      id: 'canonical',
      label: 'Canonical Tag',
      status: 'warning',
      value: 'Missing or relative',
      recommendation: 'Provide an absolute canonical URL to ensure authority consolidates to this post.',
    });
  }

  // Check 4: OpenGraph Image
  const hasOgImage = Boolean(post.seo.ogImage || post.coverImage);
  if (hasOgImage) {
    checks.push({
      id: 'og-image',
      label: 'Social Share Card Image',
      status: 'pass',
      value: 'Defined with high-resolution asset',
      recommendation: 'Social platforms will render rich previews on Twitter, LinkedIn, and Facebook.',
    });
  } else {
    score -= 12;
    checks.push({
      id: 'og-image',
      label: 'Social Share Card Image',
      status: 'fail',
      value: 'Missing',
      recommendation: 'Add an og:image to boost social click-through rates by up to 40%.',
    });
  }

  // Check 5: Image Alt Text
  const hasAlt = Boolean(post.coverImageAlt && post.coverImageAlt.trim().length > 5);
  if (hasAlt) {
    checks.push({
      id: 'img-alt',
      label: 'Cover Image Accessibility & Alt',
      status: 'pass',
      value: `"${post.coverImageAlt}"`,
      recommendation: 'Descriptive alt text helps Google Image Search index this article.',
    });
  } else {
    score -= 8;
    checks.push({
      id: 'img-alt',
      label: 'Cover Image Accessibility & Alt',
      status: 'warning',
      value: 'Missing or generic',
      recommendation: 'Add descriptive image alt text for screen readers and Google Image indexation.',
    });
  }

  // Check 6: Headings Hierarchy
  const content = post.content;
  const h2Matches = (content.match(/^##\s+/gm) || []).length;
  const h3Matches = (content.match(/^###\s+/gm) || []).length;
  if (h2Matches >= 2) {
    checks.push({
      id: 'headings',
      label: 'Content Structure & Subheadings',
      status: 'pass',
      value: `${h2Matches} H2 headings, ${h3Matches} H3 subheadings`,
      recommendation: 'Solid content hierarchy for Google crawlers and user skimmability.',
    });
  } else {
    score -= 10;
    checks.push({
      id: 'headings',
      label: 'Content Structure & Subheadings',
      status: 'warning',
      value: `${h2Matches} H2 headings found`,
      recommendation: 'Break long content with at least two or three H2 headings for better SEO ranking.',
    });
  }

  // Check 7: Word count & Depth
  const words = post.wordCount || post.content.split(/\s+/).length;
  if (words >= 800) {
    checks.push({
      id: 'word-count',
      label: 'Content Depth & Word Count',
      status: 'pass',
      value: `${words} words (${post.readingTimeMinutes} min read)`,
      recommendation: 'Comprehensive deep dive that satisfies search intent and boosts dwell time.',
    });
  } else if (words >= 400) {
    checks.push({
      id: 'word-count',
      label: 'Content Depth & Word Count',
      status: 'pass',
      value: `${words} words (${post.readingTimeMinutes} min read)`,
      recommendation: 'Good length for concise technical notes or tutorials.',
    });
  } else {
    score -= 10;
    checks.push({
      id: 'word-count',
      label: 'Content Depth & Word Count',
      status: 'warning',
      value: `${words} words`,
      recommendation: 'Thin content might struggle against authoritative pillar pages. Aim for 600+ words.',
    });
  }

  // Check 8: Schema.org Structured Data
  checks.push({
    id: 'schema',
    label: 'Schema.org JSON-LD Structured Data',
    status: 'pass',
    value: `@type: "${post.seo.structuredDataType}"`,
    recommendation: 'Structured markup enabled to unlock Google Rich Results and author knowledge badges.',
  });

  // Check 9: Target Keyword Alignment & Competitiveness
  if (post.seo.mainKeyword) {
    const mainKwLower = post.seo.mainKeyword.toLowerCase();
    const inTitle = title.toLowerCase().includes(mainKwLower);
    const inDesc = description.toLowerCase().includes(mainKwLower);
    const inBody = content.toLowerCase().includes(mainKwLower);

    if (inTitle && inDesc && inBody) {
      checks.push({
        id: 'target-keyword',
        label: 'Target Keyword Alignment',
        status: 'pass',
        value: `"${post.seo.mainKeyword}" (${post.seo.searchVolume || 'High Intent'}, KD: ${post.seo.keywordDifficulty || 'Low'})`,
        recommendation: 'Primary target keyword is prominently placed in Title, Meta Description, and Content body.',
      });
    } else {
      checks.push({
        id: 'target-keyword',
        label: 'Target Keyword Alignment',
        status: inBody ? 'pass' : 'warning',
        value: `"${post.seo.mainKeyword}" (${post.seo.searchVolume || 'Target'})`,
        recommendation: inTitle ? 'Keyword is present in title and body.' : 'Consider placing main keyword in title and meta description.',
      });
    }
  }

  // Calculate Keyword density
  const primaryKeywords = post.seo.keywords;
  const contentLower = post.content.toLowerCase();
  const keywordDensity = primaryKeywords.map(kw => {
    const kwLower = kw.toLowerCase();
    const regex = new RegExp(`\\b${kwLower.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
    const matches = contentLower.match(regex);
    const count = matches ? matches.length : 0;
    const percentage = words > 0 ? parseFloat(((count / words) * 100).toFixed(2)) : 0;
    return { keyword: kw, count, percentage };
  });

  // Clamp score
  const finalScore = Math.max(0, Math.min(100, score));
  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' = 'A+';
  if (finalScore >= 92) grade = 'A+';
  else if (finalScore >= 80) grade = 'A';
  else if (finalScore >= 68) grade = 'B';
  else if (finalScore >= 50) grade = 'C';
  else grade = 'D';

  return {
    score: finalScore,
    grade,
    checks,
    titleLength: titleLen,
    descriptionLength: descLen,
    keywordDensity,
    h1Count: 1, // Main title is H1
    h2Count: h2Matches,
    h3Count: h3Matches,
    imageAltMissing: hasAlt ? 0 : 1,
    hasStructuredData: true,
    hasCanonical: Boolean(post.seo.canonicalUrl),
    hasSocialMeta: hasOgImage,
  };
}

/**
 * Generates XML Sitemap string
 */
export function generateSitemapXml(posts: BlogPost[], baseUrl = DEFAULT_BASE_URL): string {
  const currentDate = new Date().toISOString().split('T')[0];
  const postEntries = posts
    .map(
      post => `  <url>
    <loc>${baseUrl}/#post/${post.slug}</loc>
    <lastmod>${post.updatedAt ? post.updatedAt.split('T')[0] : currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${post.featured ? '0.9' : '0.8'}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${postEntries}
</urlset>`;
}

/**
 * Generates robots.txt content
 */
export function generateRobotsTxt(baseUrl = DEFAULT_BASE_URL): string {
  return `# robots.txt generated by Lumina Publishing Engine
User-agent: *
Allow: /

# Host & Sitemap specification
Host: ${baseUrl.replace(/^https?:\/\//, '')}
Sitemap: ${baseUrl}/sitemap.xml
`;
}
