export type Category = 
  | 'All' 
  | 'Engineering' 
  | 'Artificial Intelligence' 
  | 'System Architecture' 
  | 'Design Systems' 
  | 'SEO & Performance'
  | 'Cloud & DevOps';

export interface Author {
  id: string;
  name: string;
  title: string;
  avatar: string;
  bio: string;
  twitter?: string;
  github?: string;
  role: string;
}

export interface PostSeo {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  mainKeyword?: string;
  relatedKeywords?: string[];
  searchVolume?: string;
  keywordDifficulty?: string;
  canonicalUrl: string;
  ogImage: string;
  twitterCardType: 'summary' | 'summary_large_image';
  structuredDataType: 'BlogPosting' | 'TechArticle';
}

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

export interface Comment {
  id: string;
  postId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
  userLiked?: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string;
  coverImage: string;
  coverImageAlt: string;
  category: Category;
  tags: string[];
  author: Author;
  publishedAt: string;
  updatedAt: string;
  readingTimeMinutes: number;
  wordCount: number;
  featured?: boolean;
  trending?: boolean;
  views: number;
  claps: number;
  userClapped?: boolean;
  seo: PostSeo;
  tableOfContents?: TableOfContentsItem[];
}

export interface SeoCheck {
  id: string;
  label: string;
  status: 'pass' | 'warning' | 'fail';
  value: string;
  recommendation: string;
}

export interface SeoAuditReport {
  score: number; // 0 to 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  checks: SeoCheck[];
  titleLength: number;
  descriptionLength: number;
  keywordDensity: { keyword: string; count: number; percentage: number }[];
  h1Count: number;
  h2Count: number;
  h3Count: number;
  imageAltMissing: number;
  hasStructuredData: boolean;
  hasCanonical: boolean;
  hasSocialMeta: boolean;
}

export interface VercelCheckItem {
  id: string;
  title: string;
  description: string;
  status: 'ready' | 'warning' | 'error';
  details: string;
}
