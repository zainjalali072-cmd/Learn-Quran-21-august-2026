export interface Course {
  id: string;
  title: string;
  arabicGlyph: string;
  tag: string;
  description: string;
  difficulty: string;
  image: string;
  imageAltText?: string;
  imageTitle?: string;
  imageCaption?: string;
  imageDescription?: string;
}

export interface WhyUsPoint {
  id: string;
  title: string;
  description: string;
  iconName: string;
  image?: string;
  imageAltText?: string;
  imageTitle?: string;
  imageCaption?: string;
  imageDescription?: string;
}

export interface ProcessStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
  image?: string;
  imageAltText?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  rating: number;
  country: string;
  avatar?: string;
  imageAltText?: string;
  imageTitle?: string;
  imageCaption?: string;
  imageDescription?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  image?: string;
  imageAltText?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  date: string;
  readTime: string;
  tags: string[];
  arabicVerse?: {
    arabic: string;
    translation: string;
    citation: string;
  };
  content: string;

  // Advanced SEO & Metadata fields
  seoTitle?: string;
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  slug?: string;
  canonicalUrl?: string;
  robotsMeta?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterCard?: string;
  featuredImage?: string;
  originalCoverImage?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAspectRatio?: string;
  imageAltText?: string;
  imageTitle?: string;
  imageCaption?: string;
  imageDescription?: string;
  imageFileName?: string;
  publishDate?: string;
  wordCount?: number;
  paragraphCount?: number;
  sentenceCount?: number;
  internalLinksCount?: number;
  externalLinksCount?: number;
  schemaType?: string; // e.g. Article, FAQ, custom
  customSchemaJson?: string;
  status?: "published" | "draft" | "scheduled" | "trash";
  lastUpdated?: string;
  seoScore?: number;
  revisions?: Array<{
    id: string;
    timestamp: string;
    title: string;
    content: string;
    excerpt: string;
  }>;
}

export interface WPVideo {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  publishDate: string;
  thumbnail: string;
  embedId: string;
  enabled: boolean;
  pages: string[]; // specific page names where video is enabled/embedded, e.g. ["home", "about", "videos"]
}

export type AIProviderId = "gemini" | "openai" | "anthropic";

export interface AIProviderConfig {
  enabled: boolean;
  apiKey: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  statusMessage?: string;
  lastTested?: string;
  isValidated?: boolean;
}

export interface AISettings {
  defaultProvider: AIProviderId;
  isEnabled: boolean;
  autoDraftingEnabled?: boolean;
  providers: {
    openai: AIProviderConfig;
    gemini: AIProviderConfig;
    anthropic: AIProviderConfig;
  };
}

export interface IndexingLogEntry {
  id: string;
  timestamp: string;
  url: string;
  action: "URL_UPDATED" | "URL_DELETED";
  service: "Google Indexing API" | "IndexNow (Bing)" | "Google Search Console" | "Sitemap Ping";
  status: "success" | "pending" | "failed";
  statusCode: number;
  message: string;
  latencyMs: number;
}

export interface UrlIndexStatus {
  url: string;
  title: string;
  type: "page" | "post" | "course" | "category" | "tag";
  status: "Indexed" | "Submitted" | "Pending Approval" | "Updated" | "Failed";
  lastSubmitted?: string;
  lastCrawled?: string;
  googleStatus?: string;
  indexNowStatus?: string;
  httpCode?: number;
}

export interface IndexingSettings {
  autoIndexPosts: boolean;
  autoIndexCourses: boolean;
  autoIndexPages: boolean;
  autoPingSitemap: boolean;
  googleServiceAccountEmail?: string;
  googlePrivateKey?: string;
  googleJsonConfig?: string;
  indexNowKey?: string;
  dailyQuotaUsed?: number;
  dailyQuotaTotal?: number;
  isEnabled: boolean;
}
