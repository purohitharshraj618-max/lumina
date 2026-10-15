import { BlogPost, Comment } from '../types/blog';

export const INITIAL_AUTHORS = {
  elena: {
    id: 'elena-rostova',
    name: 'Elena Rostova',
    title: 'Staff Frontend Architect & Systems Engineer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    bio: 'Elena leads web runtime architecture, performance tuning, and design systems. Former performance lead at Hyperion.',
    twitter: '@elenarostova',
    github: 'elenarostova',
    role: 'Editor in Chief',
  },
  marcus: {
    id: 'marcus-vance',
    name: 'Marcus Vance',
    title: 'Principal Cloud & SEO Infrastructure Specialist',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
    bio: 'Marcus focuses on edge runtime deployment, search engine crawling optimization, and web vitals instrumentation.',
    twitter: '@marcusvance',
    github: 'marcusvance',
    role: 'Technical Columnist',
  },
  sophia: {
    id: 'sophia-chen',
    name: 'Sophia Chen',
    title: 'Director of AI & Computational Interfaces',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&h=256&q=80',
    bio: 'Sophia researches generative interfaces, token efficiency, and ergonomic human-computer interaction patterns.',
    twitter: '@sophiachen_ai',
    github: 'sophiachen',
    role: 'Staff Writer',
  },
};

export const INITIAL_POSTS: BlogPost[] = [
  {
    id: 'seo-modern-playbook-2026',
    slug: 'modern-seo-playbook-web-apps',
    title: 'The Modern SEO Playbook: Structured Data, Dynamic OG, and Core Web Vitals',
    subtitle: 'A practical, engineering-first guide to dominating Google Search and social feed discovery.',
    excerpt: 'Discover how modern web applications leverage Schema.org JSON-LD, automated OpenGraph generation, and sub-100ms Core Web Vitals to outrank competitors in organic search.',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=630&q=80',
    coverImageAlt: 'Modern data analytics dashboard showing SEO traffic growth and performance metrics',
    category: 'SEO & Performance',
    tags: ['SEO', 'Core Web Vitals', 'JSON-LD', 'OpenGraph', 'Performance'],
    author: INITIAL_AUTHORS.marcus,
    publishedAt: '2026-03-28T09:00:00Z',
    updatedAt: '2026-04-02T14:30:00Z',
    readingTimeMinutes: 7,
    wordCount: 1420,
    featured: true,
    trending: true,
    views: 18450,
    claps: 642,
    seo: {
      metaTitle: 'Modern SEO Playbook: JSON-LD, OpenGraph & Core Web Vitals',
      metaDescription: 'A practical guide for engineers on mastering Schema.org structured data, dynamic OpenGraph cards, and Core Web Vitals for maximum organic search visibility.',
      keywords: ['SEO', 'Structured Data', 'JSON-LD', 'Core Web Vitals', 'OpenGraph', 'Vercel Deployment'],
      canonicalUrl: 'https://luminablog.vercel.app/#post/modern-seo-playbook-web-apps',
      ogImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=630&q=80',
      twitterCardType: 'summary_large_image',
      structuredDataType: 'TechArticle',
    },
    tableOfContents: [
      { id: 'the-death-of-traditional-meta', text: '1. Beyond Generic Meta Tags', level: 2 },
      { id: 'schema-org-structured-data', text: '2. Schema.org JSON-LD Superpowers', level: 2 },
      { id: 'dynamic-social-cards', text: '3. Dynamic OpenGraph & Twitter Cards', level: 2 },
      { id: 'core-web-vitals-inp-lcp', text: '4. Optimizing INP, LCP, and CLS', level: 2 },
      { id: 'audit-checklist', text: '5. The 5-Minute Production Audit', level: 2 },
    ],
    content: `Search engines in 2026 evaluate web applications with stricter scrutiny than ever before. Google's continuous crawler evolution penalizes bloated single-page applications, while rewarding platforms that deliver instant initial render, semantically unambiguous structured data, and rich contextual cards.

Whether you are launching an editorial publication or an interactive SaaS product, mastering modern technical SEO directly dictates user acquisition.

## 1. Beyond Generic Meta Tags {#the-death-of-traditional-meta}

Generic title tags such as \`Home - My App\` or generic 20-character descriptions do catastrophic harm to search rankings. Google extracts intent, entity relationships, and topic cluster authority from specific parameters:

- **Page Titles**: Must fall strictly between 30 and 60 characters. Place primary topic keywords near the beginning, followed by brand branding.
- **Meta Descriptions**: Must sit in the sweet spot of 120 to 160 characters. A strong meta description acts as organic ad copy; it must contain a compelling call to action that lifts Click-Through Rates (CTR).
- **Canonical Tags**: Always specify full absolute URLs. This eliminates duplicate content dilution across trailing slash variations, URL search parameters, and CDN mirrors.

> "A well-crafted meta description can elevate organic click-through rates by up to 34%, even without shifting rank positions."

## 2. Schema.org JSON-LD Superpowers {#schema-org-structured-data}

While HTML markup communicates layout, **JSON-LD (JavaScript Object Notation for Linked Data)** communicates entity knowledge directly to Google's Knowledge Graph.

By embedding an active \`<script type="application/ld+json">\` on each page, crawlers parse article authors, publication timestamps, publisher logos, and breadcrumb structures without ambiguous DOM scraping.

Here is an architectural pattern for an editorial blog post:

\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "The Modern SEO Playbook for Web Apps",
  "datePublished": "2026-03-28T09:00:00Z",
  "author": {
    "@type": "Person",
    "name": "Marcus Vance",
    "jobTitle": "Principal Cloud & SEO Specialist"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Lumina",
    "logo": {
      "@type": "ImageObject",
      "url": "https://luminablog.vercel.app/logo.png"
    }
  }
}
\`\`\`

:::tip
Always test your live JSON-LD using Google's Rich Results Test tool. Valid schemas qualify for rich snippet carousels, publication badges, and author verification indicators.
:::

## 3. Dynamic OpenGraph & Twitter Cards {#dynamic-social-cards}

Organic traffic does not rely solely on search engines; social channels—X/Twitter, LinkedIn, Discord, and Slack—drive up to 45% of technical readership.

When an article URL is dropped into a chat channel or timeline, social crawlers request \`og:title\`, \`og:description\`, and \`og:image\`. Without explicit tags, links appear as plain unclickable text.

\`\`\`html
<!-- Critical Social Sharing Directives -->
<meta property="og:type" content="article" />
<meta property="og:title" content="The Modern SEO Playbook" />
<meta property="og:image" content="https://luminablog.vercel.app/assets/og-cover.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
\`\`\`

## 4. Optimizing INP, LCP, and CLS {#core-web-vitals-inp-lcp}

Core Web Vitals represent Google's user experience threshold:

1. **LCP (Largest Contentful Paint)**: Keep under 1.8 seconds by preloading priority hero images, utilizing modern formats (WebP/AVIF), and serving assets over high-speed CDNs.
2. **INP (Interaction to Next Paint)**: Replace blocking JavaScript loops with microtask batching or web workers to guarantee under 100ms response time.
3. **CLS (Cumulative Layout Shift)**: Always specify explicit \`width\` and \`height\` aspect ratios on media elements and avoid injecting layout elements above existing text.

## 5. The 5-Minute Production Audit {#audit-checklist}

Before deploying any production release to Vercel or your hosting provider, verify:

1. \`robots.txt\` allows crawlers and links directly to \`sitemap.xml\`.
2. Title tags are unique across all pages and under 60 characters.
3. Every image includes descriptive \`alt\` attributes.
4. Schema.org JSON-LD contains zero syntax validation errors.
5. All external links include \`rel="noopener noreferrer"\`.

Follow these principles consistently, and your web properties will achieve sustainable, compounding organic search distribution.`,
  },
  {
    id: 'deploy-vercel-spa-hardening',
    slug: 'deploying-modern-spas-on-vercel',
    title: 'Deploying Modern SPAs on Vercel: Zero-Config CI/CD, Edge Rewrites, and Hardening',
    subtitle: 'From local development to an edge-accelerated global deployment in under three minutes.',
    excerpt: 'Step-by-step masterclass on deploying Vite and React applications to Vercel with clean vercel.json rewrites, HTTP security headers, and automated continuous delivery.',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&h=630&q=80',
    coverImageAlt: 'Modern server infrastructure glowing with fiber optic connectivity representing Vercel edge network',
    category: 'Cloud & DevOps',
    tags: ['Vercel', 'DevOps', 'Deployment', 'Vite', 'CI/CD'],
    author: INITIAL_AUTHORS.marcus,
    publishedAt: '2026-03-24T11:20:00Z',
    updatedAt: '2026-03-29T16:00:00Z',
    readingTimeMinutes: 6,
    wordCount: 1280,
    featured: false,
    trending: true,
    views: 12390,
    claps: 512,
    seo: {
      metaTitle: 'Deploy Modern SPAs on Vercel: CI/CD, Rewrites & Hardening',
      metaDescription: 'Step-by-step masterclass on deploying Vite React apps to Vercel with clean vercel.json rewrites, HTTP security headers, and global edge network caching.',
      keywords: ['Vercel', 'Vite', 'Deployment', 'vercel.json', 'SPAs', 'Edge Network'],
      canonicalUrl: 'https://luminablog.vercel.app/#post/deploying-modern-spas-on-vercel',
      ogImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&h=630&q=80',
      twitterCardType: 'summary_large_image',
      structuredDataType: 'TechArticle',
    },
    tableOfContents: [
      { id: 'why-vercel-for-vite', text: '1. Why Vercel Excels for Vite SPAs', level: 2 },
      { id: 'the-essential-vercel-json', text: '2. The Essential vercel.json Architecture', level: 2 },
      { id: 'single-page-rewrites', text: '3. Eliminating 404s with Rewrites', level: 2 },
      { id: 'security-and-caching', text: '4. Production Caching & Security Headers', level: 2 },
      { id: 'one-click-deployment', text: '5. Push-to-Deploy Workflow', level: 2 },
    ],
    content: `Vercel represents the gold standard for deploying frontend applications. While built originally around Next.js, Vercel provides first-class, zero-friction hosting for pure Vite, React, and single-page applications.

However, deploying an SPA without proper routing configuration causes the dreaded "404 on page refresh" error. Let us examine how to make any Vite app 100% uploadable and production-ready for Vercel.

## 1. Why Vercel Excels for Vite SPAs {#why-vercel-for-vite}

Vercel provides several enterprise advantages out of the box:
- **Global Edge Network (Anycast DNS)**: Static assets (JS, CSS, images) are cached in over 100 global edge locations, resulting in sub-25ms Time to First Byte (TTFB).
- **Automatic SSL/TLS**: Free wild-card SSL certificates provisioned automatically with automatic renewal.
- **Atomic Deployments**: Every git push generates a unique preview URL. Rollbacks take a single click with zero downtime.

## 2. The Essential vercel.json Architecture {#the-essential-vercel-json}

To instruct Vercel's build pipeline and routing engine, include a \`vercel.json\` file in the root directory of your project:

\`\`\`json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "cleanUrls": true,
  "rewrites": [
    {
      "source": "/((?!assets/|favicon.ico|robots.txt|sitemap.xml).*)",
      "destination": "/index.html"
    }
  ]
}
\`\`\`

## 3. Eliminating 404s with Rewrites {#single-page-rewrites}

In a Single Page Application, client-side routing handles deep links like \`/posts/my-article\` or \`/categories/engineering\`. When a visitor navigates directly to that URL or hits refresh, a standard web server looks for a physical file named \`/posts/my-article/index.html\` and returns a 404 error.

The rewrite rule instructs Vercel to route all non-asset requests back to \`/index.html\`, allowing React's client-side router to handle the route seamlessly.

:::note
Notice the negative lookahead \`(?!assets/|robots.txt|sitemap.xml)\`. This ensures static assets, sitemaps, and robots.txt are served directly rather than falling back to the HTML wrapper.
:::

## 4. Production Caching & Security Headers {#security-and-caching}

High-performance web apps must declare strict HTTP security headers and immutable asset caching:

\`\`\`json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
\`\`\`

## 5. Push-to-Deploy Workflow {#one-click-deployment}

Deploying your repository to Vercel takes 3 simple commands:

\`\`\`bash
# 1. Initialize git and commit your files
git init
git add .
git commit -m "feat: initial release with Vercel configuration"

# 2. Deploy using Vercel CLI (or connect GitHub in Vercel dashboard)
npx vercel
\`\`\`

Once connected, every push to your main branch triggers an automatic production release, giving you a lightning-fast editorial publication that scales effortlessly to millions of readers.`,
  },
  {
    id: 'frontend-architecture-2026',
    slug: 'mastering-modern-frontend-architecture',
    title: 'Mastering Modern Frontend Architecture: Islands, RSCs, and Vite at Scale',
    subtitle: 'Deconstructing modern component composition, hydration boundaries, and state ergonomics.',
    excerpt: 'Explore how modular architecture, selective hydration, and instant bundlers allow modern web teams to build massive, maintainable web applications without bundle bloat.',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&h=630&q=80',
    coverImageAlt: 'Clean lines of code displayed on multiple high-resolution developer monitors',
    category: 'Engineering',
    tags: ['React', 'Architecture', 'TypeScript', 'Vite', 'Performance'],
    author: INITIAL_AUTHORS.elena,
    publishedAt: '2026-03-18T14:15:00Z',
    updatedAt: '2026-03-21T10:00:00Z',
    readingTimeMinutes: 9,
    wordCount: 1650,
    featured: true,
    trending: false,
    views: 19800,
    claps: 780,
    seo: {
      metaTitle: 'Mastering Modern Frontend Architecture: Islands & Vite',
      metaDescription: 'Explore component composition, selective hydration boundaries, and high-performance Vite tooling for building scalable modern web applications.',
      keywords: ['Frontend Architecture', 'React 19', 'Vite', 'TypeScript', 'Web Development'],
      canonicalUrl: 'https://luminablog.vercel.app/#post/mastering-modern-frontend-architecture',
      ogImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&h=630&q=80',
      twitterCardType: 'summary_large_image',
      structuredDataType: 'TechArticle',
    },
    tableOfContents: [
      { id: 'the-evolution-of-spas', text: '1. The Evolution of SPA Architecture', level: 2 },
      { id: 'zero-cost-abstractions', text: '2. Designing Zero-Cost Component Boundaries', level: 2 },
      { id: 'vite-esm-tooling', text: '3. Why Vite Won the Bundler Wars', level: 2 },
      { id: 'state-management-discipline', text: '4. State Management Without Global Soup', level: 2 },
    ],
    content: `The modern frontend ecosystem has finally graduated from the era of monolithic megabyte-sized bundles. For years, developers wrestled with slow Webpack cold starts and cumbersome configurations. Today, modular architectures powered by native ES modules and fine-grained reactivity deliver instant feedback loops.

In this deep dive, we break down the core architectural patterns powering resilient, lightning-fast web applications.

## 1. The Evolution of SPA Architecture {#the-evolution-of-spas}

Traditional single-page applications shipped complete framework runtimes on page load, forcing mobile devices to spend hundreds of milliseconds parsing JavaScript before rendering the first meaningful pixel.

Modern frontend engineering treats hydration as an intentional budget:
- **Static Content First**: Editorial copy, headers, and navigation do not require dynamic state loops.
- **Interactive Islands**: Dynamic components—such as search modals, like buttons, and comment forms—isolate their reactive state into self-contained units.

## 2. Designing Zero-Cost Component Boundaries {#zero-cost-abstractions}

When composing React components, resist the temptation to prematurely introduce heavy abstraction layers. Favor standard functional primitives:

\`\`\`typescript
// Clean, composable UI pattern
interface ArticleProps {
  post: BlogPost;
  onBookmark: (id: string) => void;
  isBookmarked: boolean;
}

export function ArticleCard({ post, onBookmark, isBookmarked }: ArticleProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
      <header className="p-6">
        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          {post.category}
        </span>
        <h3 className="mt-2 text-xl font-bold tracking-tight">{post.title}</h3>
      </header>
    </article>
  );
}
\`\`\`

## 3. Why Vite Won the Bundler Wars {#vite-esm-tooling}

Vite transformed the developer experience by decoupling server start times from application size. During development, Vite serves source code over native ESM, delegating module graph resolution to the browser. Hot Module Replacement occurs in under 20 milliseconds, regardless of whether your project contains 10 or 10,000 components.

For production builds, Rollup and esbuild package clean, treeshaken assets with hashed filenames that cache indefinitely on CDNs.

## 4. State Management Without Global Soup {#state-management-discipline}

Global state stores often become dumping grounds for transient state. Adopt the Rule of Proximity:

1. **Local State**: State needed by one component stays in \`useState\`.
2. **Lifted State**: State shared by siblings moves to their closest common ancestor.
3. **URL State**: Search queries, filter selections, and active modal tabs belong in the URL query parameters or hash to ensure shareability.
4. **Persistent State**: User preferences (like bookmarks or dark mode) persist in \`localStorage\` with a clean fallback.`,
  },
  {
    id: 'resilient-design-systems-tokens',
    slug: 'designing-resilient-design-systems',
    title: 'Designing Resilient Design Systems: Token Architecture and Spatial Harmony',
    subtitle: 'Bridging the divide between product design and engineering with rigorous design tokens.',
    excerpt: 'How leading design teams structure systematic color ramps, fluid type scales, and predictable spatial tokens to maintain consistency across dozens of web products.',
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&h=630&q=80',
    coverImageAlt: 'Minimalist designer desk with color swatches, typography specimens, and digital tablets',
    category: 'Design Systems',
    tags: ['Design Systems', 'CSS', 'Tailwind', 'Typography', 'UI/UX'],
    author: INITIAL_AUTHORS.elena,
    publishedAt: '2026-03-12T16:00:00Z',
    updatedAt: '2026-03-14T08:00:00Z',
    readingTimeMinutes: 5,
    wordCount: 1100,
    featured: false,
    trending: false,
    views: 8900,
    claps: 340,
    seo: {
      metaTitle: 'Resilient Design Systems: Token Architecture & Harmony',
      metaDescription: 'Learn how to structure systematic color ramps, fluid typography scales, and spatial tokens to build consistent, accessible digital product interfaces.',
      keywords: ['Design Systems', 'Design Tokens', 'Tailwind CSS', 'Typography', 'UI UX'],
      canonicalUrl: 'https://luminablog.vercel.app/#post/designing-resilient-design-systems',
      ogImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&h=630&q=80',
      twitterCardType: 'summary_large_image',
      structuredDataType: 'BlogPosting',
    },
    tableOfContents: [
      { id: 'the-token-hierarchy', text: '1. The 3-Tier Token Hierarchy', level: 2 },
      { id: 'fluid-typography', text: '2. Fluid Editorial Typography', level: 2 },
      { id: 'color-palettes-dark-mode', text: '3. Dark Mode & Contrast Compliance', level: 2 },
    ],
    content: `Design systems are often misunderstood as mere component libraries. In reality, a design system is a shared vocabulary that encodes brand personality, accessibility mandates, and operational efficiency into immutable tokens.

## 1. The 3-Tier Token Hierarchy {#the-token-hierarchy}

A robust system organizes tokens into three distinct tiers:

1. **Global Tokens (Primitive)**: Context-agnostic definitions (e.g., \`slate-900\`, \`indigo-600\`, \`radius-lg\`).
2. **Semantic Tokens (Alias)**: Purpose-driven abstractions (e.g., \`surface-primary\`, \`text-muted\`, \`border-interactive\`).
3. **Component Tokens**: Tightly scoped rules for specific elements (e.g., \`button-primary-bg\`).

By authoring components exclusively against semantic tokens, themes and brand overhauls can be applied globally in minutes without breaking underlying components.

## 2. Fluid Editorial Typography {#fluid-typography}

Editorial reading demands typographic discipline. Pair a high-legibility sans-serif for UI controls with an expressive serif font (such as Newsreader or Merriweather) for long-form narrative prose.

Set body font sizes between 18px and 20px with a line-height ratio of 1.75 to 1.85. This provides sufficient vertical rhythm for sustained reading comfort across wide desktop displays and compact mobile screens.`,
  },
  {
    id: 'building-llm-workflows-latency',
    slug: 'building-llm-powered-workflows-latency',
    title: 'Building LLM-Powered Workflows: Prompt Chaining, Structured Outputs, and Speed',
    subtitle: 'Engineering predictable, production-grade AI interactions with low latency and rigorous validation.',
    excerpt: 'Learn the architectural principles for orchestrating generative AI pipelines, enforcing schema validation with Zod, and slashing end-to-end latency.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=80',
    coverImageAlt: 'Abstract 3D digital neural network visualization glowing with iridescent cyan and purple gradients',
    category: 'Artificial Intelligence',
    tags: ['AI', 'LLMs', 'Gemini', 'Prompt Engineering', 'TypeScript'],
    author: INITIAL_AUTHORS.sophia,
    publishedAt: '2026-03-05T13:45:00Z',
    updatedAt: '2026-03-10T11:00:00Z',
    readingTimeMinutes: 8,
    wordCount: 1510,
    featured: false,
    trending: true,
    views: 15400,
    claps: 710,
    seo: {
      metaTitle: 'Building LLM-Powered Workflows: Structured Outputs & Speed',
      metaDescription: 'Learn architectural patterns for prompt chaining, JSON schema enforcement, and latency reduction in production generative AI applications.',
      keywords: ['Generative AI', 'LLM Architecture', 'Gemini API', 'Structured Outputs', 'AI Workflows'],
      canonicalUrl: 'https://luminablog.vercel.app/#post/building-llm-powered-workflows-latency',
      ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=80',
      twitterCardType: 'summary_large_image',
      structuredDataType: 'TechArticle',
    },
    tableOfContents: [
      { id: 'deterministic-outputs', text: '1. Deterministic JSON Schemas', level: 2 },
      { id: 'latency-reduction-techniques', text: '2. Slashing Time-to-First-Token', level: 2 },
      { id: 'evals-and-guardrails', text: '3. Automated Evals & Production Guardrails', level: 2 },
    ],
    content: `Building toy AI demos is easy; deploying mission-critical LLM features that operate predictably within an enterprise SLA requires rigorous software engineering discipline.

## 1. Deterministic JSON Schemas {#deterministic-outputs}

Never rely on natural language begging like *"Please return only valid JSON and no markdown formatting"*. Modern models natively support constrained decoding and structured output schemas.

By providing a JSON Schema directly in the API call, the model's logits are constrained during sampling, mathematically preventing formatting hallucinations.

## 2. Slashing Time-to-First-Token {#latency-reduction-techniques}

Users perceive latency acutely. To keep interactive AI features responsive:
1. **Stream Responses**: Display streamed chunks immediately using server-sent events or WebSocket connections.
2. **Model Tiering**: Route simple extraction tasks to fast Flash-tier models, reserving heavier reasoning models for multi-step synthesis.
3. **Prompt Caching**: Store recurring static instructions and system prompts in persistent context caches.`,
  },
  {
    id: 'distributed-state-crdts-event-sourcing',
    slug: 'high-throughput-distributed-state-crdts',
    title: 'High-Throughput Distributed State: Event Sourcing, CRDTs, and Optimistic UI',
    subtitle: 'How modern collaborative applications handle conflicts, offline mode, and instant feedback.',
    excerpt: 'An architectural exploration of conflict-free replicated data types, append-only logs, and building silky-smooth collaborative software.',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&h=630&q=80',
    coverImageAlt: 'Abstract matrix of digital streams representing distributed nodes communicating in sync',
    category: 'System Architecture',
    tags: ['Architecture', 'Distributed Systems', 'CRDTs', 'Databases', 'Real-Time'],
    author: INITIAL_AUTHORS.elena,
    publishedAt: '2026-02-22T10:00:00Z',
    updatedAt: '2026-02-25T14:00:00Z',
    readingTimeMinutes: 10,
    wordCount: 1720,
    featured: false,
    trending: false,
    views: 11200,
    claps: 490,
    seo: {
      metaTitle: 'Distributed State: Event Sourcing, CRDTs & Optimistic UI',
      metaDescription: 'Explore Conflict-Free Replicated Data Types (CRDTs), event sourcing, and optimistic UI patterns for high-throughput real-time web applications.',
      keywords: ['Distributed Systems', 'CRDTs', 'Event Sourcing', 'Optimistic UI', 'Realtime'],
      canonicalUrl: 'https://luminablog.vercel.app/#post/high-throughput-distributed-state-crdts',
      ogImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&h=630&q=80',
      twitterCardType: 'summary_large_image',
      structuredDataType: 'TechArticle',
    },
    tableOfContents: [
      { id: 'the-limits-of-crud', text: '1. Why CRUD Fails in Collaborative Systems', level: 2 },
      { id: 'understanding-crdts', text: '2. The Mathematics of CRDTs', level: 2 },
      { id: 'optimistic-mutation-patterns', text: '3. Ergonomic Optimistic Mutations', level: 2 },
    ],
    content: `When two users edit the same document simultaneously while on flaky mobile internet connections, classic database transactions (ACID with pessimistic locking) degrade into deadlock or silent data overwrites.

Enter CRDTs (Conflict-free Replicated Data Types) and Event Sourcing: mathematical foundations that guarantee convergence across distributed replicas without requiring centralized lock coordination.`,
  },
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c-1',
    postId: 'seo-modern-playbook-2026',
    authorName: 'David Kester',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128&h=128&q=80',
    content: 'The breakdown of Schema.org JSON-LD is the clearest I have read. We recently audited our site and realized our breadcrumbs lacked position indices. Once fixed, Google picked them up within 48 hours!',
    createdAt: '2026-03-29T10:30:00Z',
    likes: 24,
  },
  {
    id: 'c-2',
    postId: 'seo-modern-playbook-2026',
    authorName: 'Sarah Jenkins',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&h=128&q=80',
    content: 'The note about canonical tags is spot on. We had issues with marketing UTM campaign tags creating duplicate indexation entries until we forced absolute self-referencing canonicals.',
    createdAt: '2026-03-30T14:10:00Z',
    likes: 18,
  },
  {
    id: 'c-3',
    postId: 'deploy-vercel-spa-hardening',
    authorName: 'Alexander Hayes',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=128&h=128&q=80',
    content: 'The vercel.json rewrite regex excluding assets and sitemap is brilliant. I previously had an issue where robots.txt was returning index.html. Thank you!',
    createdAt: '2026-03-26T08:15:00Z',
    likes: 31,
  },
];
