# Lumina – Modern Editorial Blog & SEO Publishing Suite

A high-performance modern editorial blog publication engine with live SEO auditing, Schema.org JSON-LD generation, SERP previews, and pre-configured Vercel edge deployment readiness.

---

## 🚀 Instant Vercel Deployment

This project is 100% pre-configured for Vercel with zero 404 routing errors on deep links and sub-path navigation.

### Option A: Deploy via GitHub (Recommended)

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial lumina publication release"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/lumina-blog.git
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new).
3. Click **Import** next to your repository.
4. Vercel automatically detects the Vite framework preset:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. Your blog is globally live in ~30 seconds!

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel --prod
```

---

## 🔍 SEO & Structured Data Architecture

Lumina strictly adheres to modern Google Search Central and Schema.org standards:

- **Dynamic Head Metadata**: Synchronizes `<title>`, `<meta name="description">`, `<link rel="canonical">`, and OpenGraph 2.0 tags on navigation.
- **Schema.org JSON-LD**: Generates valid `@type: "BlogPosting"` or `"TechArticle"` structured data with author job titles, publisher logos, and timestamps to unlock Google Rich Snippets.
- **Social Sharing Cards**: Fully supports Twitter/X `summary_large_image` and OpenGraph tags for rich previews on Slack, Discord, Twitter, and LinkedIn.
- **Dynamic Sitemap & Robots**: Contains auto-generated `sitemap.xml` and `robots.txt` pointing search crawlers to authoritative indexation endpoints.
- **Interactive SEO Inspector**: Built-in visual auditor with Google SERP simulator (desktop/mobile), social card previewer, and Schema.org syntax validator.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 6
- **Styling**: Tailwind CSS + Typography utilities
- **Icons**: Lucide React
- **Animations**: Motion
- **Hosting Config**: `vercel.json` with SPA routing fallback and immutable caching headers
