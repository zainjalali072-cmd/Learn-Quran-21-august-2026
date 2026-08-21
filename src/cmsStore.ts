import { academyContact, coursesData, whyUsData, pricingPlans, testimonialsData, faqItems, blogPostsData } from "./data";
import { Course, WhyUsPoint, PricingPlan, Testimonial, FAQItem, BlogPost, WPVideo, AISettings, AIProviderConfig, AIProviderId, IndexingLogEntry, UrlIndexStatus, IndexingSettings } from "./types";
export type { Course, WhyUsPoint, PricingPlan, Testimonial, FAQItem, BlogPost, WPVideo, AISettings, AIProviderConfig, AIProviderId, IndexingLogEntry, UrlIndexStatus, IndexingSettings };

import logoImg from "./assets/images/truth_quran_new_logo_1784203145448.jpg";
import kidsLearningBg from "./assets/images/kids_quran_learning_1784116863937.jpg";
import teacherBg from "./assets/images/online_quran_teacher_1784116886285.jpg";
import femaleTeacherBg from "./assets/images/female_quran_tutor_1784119152017.jpg";
import tajweedMasteryBg from "./assets/images/tajweed_mastery_art_1784119171753.jpg";
import parentKidsQuranBg from "./assets/images/parent_kids_quran_1784121554278.jpg";
import islamicKidsLearningBg from "./assets/images/islamic_kids_learning_1784120227940.jpg";
import islamicGirlQaidaBg from "./assets/images/islamic_girl_qaida_1784120204322.jpg";
import quran3DIconImg from "./assets/images/holy_quran_icon_1784372106996.jpg";

export interface SEOConfig {
  metaTitle: string;
  metaDescription: string;
  focusKeywords: string;
  robotsMeta: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  schemaType: string;
}

export interface WPUser {
  id: string;
  name: string;
  username?: string;
  email: string;
  role: "Administrator" | "Editor" | "Author" | "Subscriber";
  avatar: string;
  registeredDate: string;
  phone?: string;
  bio?: string;
  password?: string;
  status?: "active" | "disabled";
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface WPMedia {
  id: string;
  title: string;
  url: string;
  size: string;
  date: string;
  type: string;
  dimensions?: string;
  alt?: string;
  caption?: string;
  description?: string;
  author?: string;
}

export interface WPComment {
  id: string;
  name: string;
  email: string;
  age?: string;
  country?: string;
  course?: string;
  message: string;
  date: string;
  status: "approved" | "pending" | "spam" | "trash";
  type: "inquiry" | "comment";
  postTitle?: string;
}

export interface WPMenuItem {
  label: string;
  id: string;
  children?: { label: string; id: string; }[];
}

export interface WPTeacher {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  rating: number;
  experience: string;
  status: "published" | "draft" | "scheduled" | "trash";
  publishDate: string;
  category: string;
  tags: string[];
  seoTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  slug?: string;
}

export interface CMSData {
  siteLogoText: string;
  siteLogoSubText: string;
  heroKicker: string;
  heroTitle: string;
  heroDescription: string;
  heroPrimaryBtnText: string;
  heroSecondaryBtnText: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  whatsappLink: string;
  facebookLink: string;
  instagramLink: string;
  linkedinLink?: string;
  courses: Course[];
  whyUs: WhyUsPoint[];
  pricingPlans: PricingPlan[];
  testimonials: Testimonial[];
  faqs: FAQItem[];
  blogPosts: BlogPost[];
  teachers: WPTeacher[];
  developerName: string;
  developerRole: string;
  developerAvatar: string;
  seoSettings: Record<string, SEOConfig>; // mapped by view name, e.g. "home", "about", "blog"
  customImages?: Record<string, {
    url: string;
    alt: string;
    title?: string;
    caption?: string;
    description?: string;
    dimensions?: string;
    size?: string;
  }>;
  
  // Advanced enterprise fields
  videos: WPVideo[];
  integrations: {
    ga4Id: string;
    gscId: string;
    gtmId: string;
    fbPixelId: string;
    clarityId: string;
    googleSiteVerification?: string;
    bingSiteVerification?: string;
    customHeadScripts?: string;
    isConnected: boolean;
  };
  robotsTxtContent?: string;
  redirects?: Array<{ from: string; to: string; type: number; id: string }>;
  logs404?: Array<{ url: string; hits: number; lastHit: string; referer?: string }>;
  analyticsData: {
    totalVisitors: number;
    uniqueVisitors: number;
    returningVisitors: number;
    pageViews: number;
    sessions: number;
    avgSessionDuration: string;
    bounceRate: string;
    realTimeVisitors: number;
  };
  searchPerformance: {
    totalClicks: number;
    totalImpressions: number;
    averageCtr: string;
    averagePosition: number;
  };
  seoHealth: {
    score: number;
    isSitemapActive: boolean;
    isRobotsTxtActive: boolean;
    brokenLinksCount: number;
  };

  // Enterprise WordPress additions
  sectionsVisibility: Record<string, boolean>;
  sectionsOrder: string[];
  themeColors: {
    primaryGold: string;
    bgDark: string;
    cardBg: string;
    textLight: string;
    textMuted: string;
  };
  themeTypography: {
    headingFont: string;
    bodyFont: string;
    baseFontSize: string;
  };
  navigationMenu: WPMenuItem[];
  comments: WPComment[];
  mediaLibrary: WPMedia[];
  userProfiles: WPUser[];
  siteSettings: {
    title: string;
    tagline: string;
    permalinkStructure: string;
    defaultLanguage: string;
    isRTL: boolean;
    isCacheEnabled: boolean;
    isPerformanceOptimized: boolean;
    isWooCommerceReady: boolean;
    childThemeSupported: boolean;
    gutenbergCompatible: boolean;
    elementorCompatible: boolean;
    securityFirewallActive: boolean;
  };
  widgets: Record<string, string[]>; // footer1, footer2, sidebar widget items list
  aiSettings?: AISettings;
  indexingSettings?: IndexingSettings;
  indexingLogs?: IndexingLogEntry[];
  urlIndexStatuses?: Record<string, UrlIndexStatus>;
}

export const DEFAULT_INDEXING_SETTINGS: IndexingSettings = {
  isEnabled: true,
  autoIndexPosts: true,
  autoIndexCourses: true,
  autoIndexPages: true,
  autoPingSitemap: true,
  googleServiceAccountEmail: "rankmath-fast-indexer@truthquranacademy.iam.gserviceaccount.com",
  googlePrivateKey: "",
  googleJsonConfig: "",
  indexNowKey: "4a8e2bc9d17f4019a58b43f9a721b06c",
  dailyQuotaUsed: 4,
  dailyQuotaTotal: 200
};

export const DEFAULT_AI_SETTINGS: AISettings = {
  defaultProvider: "gemini",
  isEnabled: true,
  autoDraftingEnabled: true,
  providers: {
    openai: {
      enabled: false,
      apiKey: "",
      model: "gpt-4o",
      temperature: 0.7,
      maxTokens: 2048,
      isValidated: false
    },
    gemini: {
      enabled: true,
      apiKey: "",
      model: "gemini-2.5-flash",
      temperature: 0.7,
      maxTokens: 2048,
      isValidated: true
    },
    anthropic: {
      enabled: false,
      apiKey: "",
      model: "claude-3-5-sonnet-20241022",
      temperature: 0.7,
      maxTokens: 2048,
      isValidated: false
    }
  }
};

const DEFAULT_SEO_SETTINGS: Record<string, SEOConfig> = {
  home: {
    metaTitle: "Truth Quran Academy | Learn Quran 1-on-1 Online with Tajweed & Hifz",
    metaDescription: "Learn Holy Quran recitation, Tajweed, Hifz, and Arabic language from native certified Arab tutors in private 1-on-1 virtual classrooms.",
    focusKeywords: "online quran academy, learn quran tajweed, hifz memorization online",
    robotsMeta: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    canonicalUrl: "https://truthquranacademy.com/",
    ogTitle: "Truth Quran Academy | Learn Quran Online with Tajweed",
    ogDescription: "Elite 1-on-1 online Quran program tailored for children, sisters, and busy professionals. Book a 100% free trial today.",
    ogImage: "https://truthquranacademy.com/wp-content/uploads/2026/07/og-image.jpg",
    schemaType: "EducationalOrganization"
  },
  about: {
    metaTitle: "Our Mission & Story | Truth Quran Academy",
    metaDescription: "Discover our uncompromising standards. Certified scholars with traditional Ijazah credentials teaching the beautiful book of Allah.",
    focusKeywords: "about truth quran academy, certified quran tutors, online ijazah course",
    robotsMeta: "index, follow",
    canonicalUrl: "https://truthquranacademy.com/about-us/",
    ogTitle: "About Us - Our Uncompromising Standards | Truth Quran Academy",
    ogDescription: "Our mission is to transmit correct Quranic recitation with spiritual sincere alignment.",
    ogImage: "https://truthquranacademy.com/wp-content/uploads/2026/07/about-og.jpg",
    schemaType: "AboutPage"
  },
  blog: {
    metaTitle: "Academy Insights & Quranic Education Blog | Truth Quran Academy",
    metaDescription: "Explore expert guidance on Tajweed mechanics, traditional Hifz strategies, and classical Arabic linguistic studies.",
    focusKeywords: "quran tips blog, learn tajweed articles, hifz memorization tips",
    robotsMeta: "index, follow",
    canonicalUrl: "https://truthquranacademy.com/blog/",
    ogTitle: "Academy Insights Blog | Truth Quran Academy",
    ogDescription: "Professional guides and spiritual insights for modern students of the Quran.",
    ogImage: "https://truthquranacademy.com/wp-content/uploads/2026/07/blog-og.jpg",
    schemaType: "CollectionPage"
  }
};

const DEFAULT_NAVIGATION_MENU: WPMenuItem[] = [
  { label: "Home", id: "home" },
  { 
    label: "About Us", 
    id: "about-dropdown",
    children: [
      { label: "Our Story / Mission", id: "about" },
      { label: "Videos / Gallery", id: "videos" },
      { label: "Blogs & Guides", id: "blog" },
    ]
  },
  { 
    label: "Courses", 
    id: "courses-dropdown",
    children: [
      { label: "All Courses", id: "courses" },
      { label: "Noorani Qaida", id: "noorani-qaida" },
      { label: "Kids Quran Classes", id: "kids-classes" },
    ]
  },
  { label: "Pricing", id: "fees" },
  { label: "Download", id: "download" },
  { label: "Contact Us", id: "contact" },
];

const DEFAULT_USERS: WPUser[] = [
  { id: "u-1", name: "Muhammad Zain", email: "muhammadzain92624@gmail.com", role: "Administrator", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80", registeredDate: "2026-06-15" },
  { id: "u-2", name: "Dr. Jamia Naeemia Scholar", email: "scholar@truthquran.com", role: "Editor", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80", registeredDate: "2026-06-20" },
  { id: "u-3", name: "Aisha Al-Ansari", email: "aisha@truthquran.com", role: "Author", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80", registeredDate: "2026-07-01" },
];

export const DEFAULT_TEACHERS: WPTeacher[] = [
  {
    id: "teacher-1",
    name: "Sheikh Abdul Rahman",
    role: "Head of Quranic Studies",
    bio: "Graduated from Jamia Naeemia Lahore with a master's in Islamic theology and Quranic sciences. Holds high-ranking Ijazah in the ten qira'at of the Quran with Sanad linked to the Prophet (PBUH).",
    photo: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300",
    rating: 5,
    experience: "15+ Years",
    status: "published",
    publishDate: "2026-06-12",
    category: "Quran & Hifz",
    tags: ["Head Scholar", "Ten Qira'at", "Ijazah Certified"],
    seoTitle: "Sheikh Abdul Rahman - Certified Quran & Tajweed Scholar | Truth Quran Academy",
    metaDescription: "Learn Quran recitation from Sheikh Abdul Rahman, holding Ijazah with Sanad linked to the Prophet (PBUH). Head of Quranic Studies.",
    focusKeyword: "Sheikh Abdul Rahman",
    slug: "sheikh-abdul-rahman"
  },
  {
    id: "teacher-2",
    name: "Ustadh Hafiz Zain",
    role: "Senior Hifz Instructor",
    bio: "Huffadh instructor certified from leading Quranic centres. Specialized in tutoring young children and adults, utilizing modern memory pathways to ensure rapid and secure retention.",
    photo: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=300",
    rating: 5,
    experience: "8 Years",
    status: "published",
    publishDate: "2026-06-25",
    category: "Quran Hifz",
    tags: ["Hifz Expert", "Children Specialist", "Retention Techniques"],
    seoTitle: "Ustadh Hafiz Zain - Senior Quran Memorization Tutor | Truth Quran Academy",
    metaDescription: "Memorize the Quran with Ustadh Hafiz Zain, senior Huffadh instructor specialized in rapid memory retention for children and adults.",
    focusKeyword: "Ustadh Hafiz Zain",
    slug: "ustadh-hafiz-zain"
  },
  {
    id: "teacher-3",
    name: "Ustadha Maryam",
    role: "Female Tajweed Specialist",
    bio: "Graduated with classical honors in Tajweed and Arabic studies. Over 10 years teaching sisters and young kids global phonetics, Makharij articulation points, and beautiful Salah modulation.",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
    rating: 5,
    experience: "10 Years",
    status: "published",
    publishDate: "2026-07-02",
    category: "Tajweed Mastery",
    tags: ["Sisters Tutor", "Kids Specialist", "Makharij Expert"],
    seoTitle: "Ustadha Maryam - Certified Female Quran & Tajweed Tutor | Truth Quran Academy",
    metaDescription: "Private 1-on-1 Tajweed lessons for sisters and children with Ustadha Maryam. Specialized in Makharij and Quranic phonetics.",
    focusKeyword: "Ustadha Maryam",
    slug: "ustadha-maryam"
  }
];

const DEFAULT_CUSTOM_IMAGES: Record<string, { url: string; alt: string; title: string; caption?: string; description?: string; dimensions?: string; size?: string; }> = {
  siteLogo: { url: logoImg, alt: "Truth Quran Academy Logo", title: "Truth Quran Academy Logo", caption: "Official Academy Logo", description: "The primary branding logo used on headers, footers, and cards.", dimensions: "512x512", size: "142 KB" },
  siteFavicon: { url: logoImg, alt: "Truth Quran Academy Favicon", title: "Truth Quran Academy Favicon", dimensions: "64x64", size: "12 KB" },
  heroBg: { url: kidsLearningBg, alt: "Kids studying Quran together", title: "Hero Banner Background", caption: "Primary background illustrating kids learning", description: "Main banner background for the academy homepage.", dimensions: "1920x1080", size: "310 KB" },
  aboutTeacherBg: { url: teacherBg, alt: "Online Quran teacher guiding adult student", title: "Online Tutor Section Background", dimensions: "1200x800", size: "245 KB" },
  aboutFemaleTeacherBg: { url: femaleTeacherBg, alt: "Female tutor assisting child student", title: "Female Tutor Section Background", dimensions: "1200x800", size: "220 KB" },
  kidsLearningBg: { url: kidsLearningBg, alt: "Young kids recitation circle", title: "Kids Classes Section Background", dimensions: "1920x1080", size: "310 KB" },
  tajweedMasteryBg: { url: tajweedMasteryBg, alt: "Traditional calligraphic art representing Tajweed precision", title: "Tajweed Mastery Illustration", dimensions: "1200x800", size: "290 KB" },
  parentKidsQuranBg: { url: parentKidsQuranBg, alt: "Muslim parent teaching children holy Quran", title: "Family Quran Learning", dimensions: "1200x800", size: "260 KB" },
  islamicKidsLearningBg: { url: islamicKidsLearningBg, alt: "Group of young Muslim children reading Quran", title: "Islamic Kids Classes", dimensions: "1200x800", size: "240 KB" },
  islamicGirlQaidaBg: { url: islamicGirlQaidaBg, alt: "Young girl learning Arabic Qaida alphabet", title: "Noorani Qaida Starting Block", dimensions: "1200x800", size: "215 KB" },
  quran3DIcon: { url: quran3DIconImg, alt: "Holy Quran Golden Book 3D Icon", title: "Golden Quran 3D Icon", dimensions: "512x512", size: "95 KB" }
};

const DEFAULT_MEDIA: WPMedia[] = [
  { id: "m-1", title: "Truth Quran Academy Logo Image", url: logoImg, size: "142 KB", date: "2026-07-15", type: "image/jpeg", dimensions: "512x512", alt: "Truth Quran Academy Logo", caption: "Official Academy Logo", description: "Branding logo used in header and footer." },
  { id: "m-2", title: "Elegant Arabic Calligraphy Backdrop", url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85", size: "842 KB", date: "2026-07-16", type: "image/jpeg", dimensions: "1920x1080", alt: "Quran script page close up", caption: "Artistic Quran script", description: "Beautiful close up of open Quran page." },
  { id: "m-3", title: "Tajweed Study Guide Cover Illustration", url: tajweedMasteryBg, size: "290 KB", date: "2026-07-17", type: "image/jpeg", dimensions: "1200x800", alt: "Traditional calligraphic art representing Tajweed precision", caption: "Tajweed illustration design", description: "Featured graphical artwork for courses and guides." },
  { id: "m-4", title: "Kids Learning Quran Background", url: kidsLearningBg, size: "310 KB", date: "2026-07-17", type: "image/jpeg", dimensions: "1920x1080", alt: "Kids studying Quran together", caption: "Primary background illustrating kids learning", description: "Background asset for Hero and Course modules." },
  { id: "m-5", title: "Senior Quran Teacher Profile Photo", url: teacherBg, size: "245 KB", date: "2026-07-17", type: "image/jpeg", dimensions: "1200x800", alt: "Online Quran teacher guiding adult student", caption: "Quran teacher online", description: "Profile headshot/action photograph of Ustadh tutor." },
  { id: "m-6", title: "Female Tajweed Specialist Photo", url: femaleTeacherBg, size: "220 KB", date: "2026-07-17", type: "image/jpeg", dimensions: "1200x800", alt: "Female tutor assisting child student", caption: "Female Quran tutor online", description: "Headshot photograph for Ustadha tutor profiles." },
  { id: "m-7", title: "Family Quran Learning Activity", url: parentKidsQuranBg, size: "260 KB", date: "2026-07-17", type: "image/jpeg", dimensions: "1200x800", alt: "Muslim parent teaching children holy Quran", caption: "Parent and children studying Quran", description: "Visual asset representing family package classes." },
  { id: "m-8", title: "Islamic Kids Quran Recitation Circle", url: islamicKidsLearningBg, size: "240 KB", date: "2026-07-17", type: "image/jpeg", dimensions: "1200x800", alt: "Group of young Muslim children reading Quran", caption: "Children studying together", description: "Visual asset for Kids and Sibling packages." },
  { id: "m-9", title: "Young Girl Learning Noorani Qaida", url: islamicGirlQaidaBg, size: "215 KB", date: "2026-07-17", type: "image/jpeg", dimensions: "1200x800", alt: "Young girl learning Arabic Qaida alphabet", caption: "Girl reading Noorani Qaida", description: "Artwork demonstrating early foundational phonetics classes." },
  { id: "m-10", title: "Golden Holy Quran 3D Icon Render", url: quran3DIconImg, size: "95 KB", date: "2026-07-17", type: "image/png", dimensions: "512x512", alt: "Holy Quran Golden Book 3D Icon", caption: "Quran 3D icon element", description: "Floating graphic render of the Holy Quran." }
];

const DEFAULT_COMMENTS: WPComment[] = [
  { id: "c-1", name: "Sarah Ahmed", email: "sarah@gmail.com", age: "8", country: "United Kingdom", course: "noorani-qaida", message: "Enroll Sarah into Noorani Qaida basic phonetics with female certified tutor.", date: "2026-07-18", status: "approved", type: "inquiry" },
  { id: "c-2", name: "Tariq Mahmood", email: "tariq.m@yahoo.com", age: "35", country: "Canada", course: "tajweed-intensive", message: "Looking for adult Tajweed intensive program 3 times a week after work hours (EST).", date: "2026-07-18", status: "pending", type: "inquiry" },
  { id: "c-3", name: "Dr. Bilal Hussain", email: "bilal.scholar@gmail.com", message: "This guide on Tajweed mechanics is exceptionally written! Masha'Allah, keep spreading the correct pronunciation techniques of Allah's book.", date: "2026-07-17", status: "approved", type: "comment", postTitle: "Understanding Tajweed Rules" },
];

const DEFAULT_WIDGETS: Record<string, string[]> = {
  footer1: ["Text: About Truth Quran Academy", "Custom HTML: License Credentials"],
  footer2: ["Recent Posts widget", "Contact Info Address details"],
  sidebar: ["Search bar", "Categories navigation", "Rank Math breadcrumb widget"],
};

export const DEFAULT_VIDEOS: WPVideo[] = [
  {
    id: "v1",
    title: "Mastering Makhraj of Throat Letters (Halqi Letters)",
    description: "A comprehensive video guide demonstrating the precise articulation points of throat letters, detailing the distinction between standard 'Ha' and pharyngeal 'Haa'.",
    category: "Tajweed Guides",
    duration: "12:45",
    publishDate: "July 05, 2026",
    thumbnail: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800",
    embedId: "quran-makharij-throat",
    enabled: true,
    pages: ["home", "videos"]
  },
  {
    id: "v2",
    title: "How to Build a Consistent Hifz Routine at Home",
    description: "Our lead scholar shares a structured, easy-to-follow calendar system designed to help busy professionals and kids memorize Quran with long-term retention.",
    category: "Lectures",
    duration: "18:20",
    publishDate: "June 20, 2026",
    thumbnail: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=800",
    embedId: "hifz-routine-lecture",
    enabled: true,
    pages: ["home", "about"]
  },
  {
    id: "v3",
    title: "Beautiful Recitation by Student Muhammad Al-Amri",
    description: "Listen to the soulful, measured recitation of Surah Al-Mulk by our 9-year-old student, showing absolute mastery of tajweed rules and modulation.",
    category: "Student Recitations",
    duration: "05:12",
    publishDate: "June 12, 2026",
    thumbnail: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=800",
    embedId: "student-recitation-mulk",
    enabled: true,
    pages: ["videos"]
  }
];

export const DEFAULT_INTEGRATIONS = {
  ga4Id: "G-TRUTHQURAN123",
  gscId: "lTvdLgKMilv0Fo4K8WKaSBqGWsZyrSgLKqSl4yj3I4g",
  gtmId: "GTM-P8QXTR",
  fbPixelId: "9876543210123",
  clarityId: "clrt89abc",
  googleSiteVerification: "lTvdLgKMilv0Fo4K8WKaSBqGWsZyrSgLKqSl4yj3I4g",
  bingSiteVerification: "",
  customHeadScripts: "<!-- Google & Analytics Master Verification Tags -->",
  isConnected: true
};

export const DEFAULT_ANALYTICS = {
  totalVisitors: 0,
  uniqueVisitors: 0,
  returningVisitors: 0,
  pageViews: 0,
  sessions: 0,
  avgSessionDuration: "0m 00s",
  bounceRate: "0.0%",
  realTimeVisitors: 0
};

export const DEFAULT_SEARCH_PERFORMANCE = {
  totalClicks: 0,
  totalImpressions: 0,
  averageCtr: "0.0%",
  averagePosition: 0
};

export const DEFAULT_SEO_HEALTH = {
  score: 88,
  isSitemapActive: true,
  isRobotsTxtActive: true,
  brokenLinksCount: 2
};

export const DEFAULT_POST_IMAGE = tajweedMasteryBg;

export const cleanHTMLToExcerpt = (content: string, existingExcerpt?: string): string => {
  if (existingExcerpt && existingExcerpt.trim().length > 0) {
    const strippedExisting = existingExcerpt
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (strippedExisting.length > 0 && !strippedExisting.startsWith("<")) {
      const words = strippedExisting.split(/\s+/).filter(Boolean);
      if (words.length <= 40) return strippedExisting;
      return words.slice(0, 35).join(" ") + "...";
    }
  }

  if (!content) return "Read full article details on Truth Quran Academy...";

  const cleaned = content
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<code[^>]*>[\s\S]*?<\/code>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return "Read full article details on Truth Quran Academy...";

  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length <= 35) {
    return cleaned;
  }
  return words.slice(0, 32).join(" ") + "...";
};

export const ensureBlogPostSEO = (post: BlogPost): BlogPost => {
  const cleanExcerpt = cleanHTMLToExcerpt(post.content || "", post.excerpt);
  const validImage = post.featuredImage || post.coverImage || post.ogImage || DEFAULT_POST_IMAGE;

  const stripped = (post.content || "").replace(/<[^>]*>/g, "");
  const words = stripped.trim() ? stripped.trim().split(/\s+/).filter(Boolean).length : 0;
  const sentences = stripped.split(/[.!?]+/).filter(s => s.trim().length > 2).length || 1;
  const paragraphs = (post.content || "").split(/<\/p>|<br\s*\/?>|\n\n+/).filter(p => p.trim().length > 0).length || 1;

  return {
    ...post,
    excerpt: cleanExcerpt,
    coverImage: validImage,
    featuredImage: validImage,
    ogImage: post.ogImage || validImage,
    status: post.status || "published",
    author: {
      name: post.author?.name || "Muhammad Zain",
      avatar: post.author?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
      role: post.author?.role || "Senior Quran Scholar"
    },
    date: post.date || post.publishDate || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    readTime: post.readTime || "5 min read",
    category: post.category || "Tajweed Rules",
    tags: post.tags && post.tags.length > 0 ? post.tags : ["Tajweed"],
    content: post.content || "<p>Article content details...</p>",
    seoTitle: post.seoTitle || `${post.title} | Truth Quran Academy`,
    metaTitle: post.metaTitle || post.title,
    metaDescription: post.metaDescription || cleanExcerpt.substring(0, 150),
    focusKeyword: post.focusKeyword || (post.tags && post.tags[0]) || "Tajweed",
    slug: post.slug || post.id || "blog-article",
    canonicalUrl: post.canonicalUrl || `https://truthquranacademy.com/blog/${post.slug || post.id}/`,
    robotsMeta: post.robotsMeta || "index, follow, max-image-preview:large",
    ogTitle: post.ogTitle || post.title,
    ogDescription: post.ogDescription || cleanExcerpt,
    twitterTitle: post.twitterTitle || post.ogTitle || post.title,
    twitterDescription: post.twitterDescription || post.ogDescription || cleanExcerpt,
    twitterCard: post.twitterCard || "summary_large_image",
    imageAltText: post.imageAltText || `${post.title} cover banner`,
    imageTitle: post.imageTitle || `${post.title} featured photo`,
    imageCaption: post.imageCaption || `Illustration for ${post.title}`,
    imageDescription: post.imageDescription || `High quality featured photo for article ${post.title}`,
    imageFileName: post.imageFileName || `${(post.slug || "image").toLowerCase()}.jpg`,
    publishDate: post.publishDate || post.date || new Date().toISOString().split("T")[0],
    lastUpdated: post.lastUpdated || post.publishDate || post.date || new Date().toISOString().split("T")[0],
    wordCount: post.wordCount || words || 450,
    sentenceCount: post.sentenceCount || sentences,
    paragraphCount: post.paragraphCount || paragraphs,
    internalLinksCount: post.internalLinksCount || 2,
    externalLinksCount: post.externalLinksCount || 1,
    schemaType: post.schemaType || "Article",
    customSchemaJson: post.customSchemaJson || `{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${post.title}",
  "description": "${cleanExcerpt}",
  "author": {
    "@type": "Person",
    "name": "${post.author?.name || "Muhammad Zain"}"
  }
}`
  };
};

const STORAGE_KEY = "truth_quran_wordpress_sim_v2";
let isFetchingCMSData = false;

export const getCMSData = (): CMSData => {
  // Trigger background fetch if not already in progress
  if (!isFetchingCMSData) {
    isFetchingCMSData = true;
    fetch("/api/cms-data")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to load DB");
      })
      .then((serverData) => {
        const cached = localStorage.getItem(STORAGE_KEY);
        // Only update cache and dispatch if different to prevent re-rendering loops
        if (!cached || JSON.stringify(serverData) !== cached) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(serverData));
          window.dispatchEvent(new Event("cms_data_updated"));
        }
      })
      .catch((err) => {
        console.warn("Server connection offline or loading; using local cache fallback:", err);
      })
      .finally(() => {
        isFetchingCMSData = false;
      });
  }

  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    try {
      const cleanedCached = cached
        .replace(/Al-Azhar University/g, "Jamia Naeemia Lahore")
        .replace(/Al-Azhar/g, "Jamia Naeemia Lahore");
      const parsed = JSON.parse(cleanedCached);
      
      // Ensure backward compatibility with newer fields
      if (!parsed.sectionsVisibility) {
        parsed.sectionsVisibility = {
          hero: true,
          whyUs: true,
          courses: true,
          process: true,
          pricing: true,
          testimonials: true,
          faqs: true,
          blog: true,
          contact: true,
          map: true
        };
      }
      if (parsed.sectionsVisibility.map === undefined) {
        parsed.sectionsVisibility.map = true;
      }
      if (!parsed.sectionsOrder) {
        parsed.sectionsOrder = ["hero", "whyUs", "courses", "process", "pricing", "testimonials", "faqs", "blog", "contact"];
      }
      if (!parsed.themeColors) {
        parsed.themeColors = {
          primaryGold: "#d9b45c",
          bgDark: "#07080b",
          cardBg: "#12141b",
          textLight: "#f3ecd8",
          textMuted: "#c9c2ab"
        };
      }
      if (!parsed.themeTypography) {
        parsed.themeTypography = {
          headingFont: "Cinzel",
          bodyFont: "Inter",
          baseFontSize: "16px"
        };
      }
      if (!parsed.navigationMenu) {
        parsed.navigationMenu = DEFAULT_NAVIGATION_MENU;
      }
      if (!parsed.comments) {
        parsed.comments = DEFAULT_COMMENTS;
      }
      if (!parsed.mediaLibrary) {
        parsed.mediaLibrary = DEFAULT_MEDIA;
      }
      if (!parsed.userProfiles) {
        parsed.userProfiles = DEFAULT_USERS;
      }
      if (!parsed.teachers) {
        parsed.teachers = DEFAULT_TEACHERS;
      }
      if (!parsed.widgets) {
        parsed.widgets = DEFAULT_WIDGETS;
      }
      if (!parsed.videos) {
        parsed.videos = DEFAULT_VIDEOS;
      }
      if (!parsed.integrations) {
        parsed.integrations = DEFAULT_INTEGRATIONS;
      }
      if (!parsed.analyticsData) {
        parsed.analyticsData = DEFAULT_ANALYTICS;
      }
      if (!parsed.searchPerformance) {
        parsed.searchPerformance = DEFAULT_SEARCH_PERFORMANCE;
      }
      if (!parsed.seoHealth) {
        parsed.seoHealth = DEFAULT_SEO_HEALTH;
      }
      if (!parsed.siteSettings) {
        parsed.siteSettings = {
          title: "Truth Quran Academy",
          tagline: "Uncompromising standards in Quran, Tajweed, and Hifz education",
          permalinkStructure: "/%postname%/",
          defaultLanguage: "en-US",
          isRTL: false,
          isCacheEnabled: true,
          isPerformanceOptimized: true,
          isWooCommerceReady: true,
          childThemeSupported: true,
          gutenbergCompatible: true,
          elementorCompatible: true,
          securityFirewallActive: true
        };
      }
      if (!parsed.customImages) {
        parsed.customImages = DEFAULT_CUSTOM_IMAGES;
      }
      
      // Map courses to resolve dynamic image assets and clean Arabic characters
      if (parsed.courses) {
        parsed.courses = parsed.courses.map((course: any) => {
          let img = course.image;
          let glyph = course.arabicGlyph;
          
          // Clean up corrupted arabic glyphs if present
          if (glyph && (glyph.includes("Ø") || glyph.includes("Ù"))) {
            if (course.id === "noorani-qaida") glyph = "ا ب ت";
            else if (course.id === "tajweed-intensive" || course.id === "tajweed-mastery") glyph = "قُرْآن";
            else if (course.id === "quran-hifz") glyph = "حِفْظ";
            else if (course.id === "quran-tafseer") glyph = "تَفْسِير";
            else if (course.id === "arabic-language") glyph = "عَرَبِيّ";
            else if (course.id === "islamic-studies") glyph = "أَدَب";
          }

          if (!img) {
            if (course.id === "noorani-qaida") {
              img = kidsLearningBg;
            } else if (course.id === "tajweed-intensive" || course.id === "tajweed-mastery") {
              img = tajweedMasteryBg;
            } else if (course.id === "quran-hifz") {
              img = kidsLearningBg;
            } else if (course.id === "quran-tafseer") {
              img = tajweedMasteryBg;
            } else if (course.id === "arabic-language") {
              img = teacherBg;
            } else if (course.id === "islamic-studies") {
              img = kidsLearningBg;
            } else {
              const found = coursesData.find((c: any) => c.id === course.id);
              img = found ? found.image : kidsLearningBg;
            }
          }
          return {
            ...course,
            image: img,
            arabicGlyph: glyph || "قُرْآن"
          };
        });
      }
      
      // map pricing plans to ensure new fee structure ($30, $45, $60) is reflected
      if (parsed.pricingPlans) {
        parsed.pricingPlans = parsed.pricingPlans.map((plan: any) => {
          if (plan.id === "price-1" || plan.id === "tier-1" || plan.name?.toLowerCase().includes("starter") || plan.name?.toLowerCase().includes("2 days")) {
            return { ...plan, price: "$30" };
          }
          if (plan.id === "price-2" || plan.id === "tier-2" || plan.name?.toLowerCase().includes("premium") || plan.name?.toLowerCase().includes("3 days")) {
            return { ...plan, price: "$45" };
          }
          if (plan.id === "price-3" || plan.id === "tier-3" || plan.name?.toLowerCase().includes("mastery") || plan.name?.toLowerCase().includes("5 days")) {
            return { ...plan, price: "$60" };
          }
          return plan;
        });
      }

      // map blog posts to have advanced SEO fields populated
      if (parsed.blogPosts) {
        parsed.blogPosts = parsed.blogPosts.map(ensureBlogPostSEO);
      }

      if (parsed.contactEmail === "zainjalali072@gmail.com") {
        parsed.contactEmail = "muhammadzain92624@gmail.com";
      }
      if (parsed.contactAddress && parsed.contactAddress.includes("Rawalpindi")) {
        parsed.contactAddress = "Altaf Colony, Ranjar Head Quarter, Lahore Cantt, Pakistan";
      }
      if (!parsed.facebookLink || parsed.facebookLink.includes("truthquranacademy")) {
        parsed.facebookLink = academyContact.facebook;
      }
      if (!parsed.instagramLink || parsed.instagramLink.includes("truthquranacademy")) {
        parsed.instagramLink = academyContact.instagram;
      }
      if (!parsed.linkedinLink || parsed.linkedinLink.includes("truthquranacademy")) {
        parsed.linkedinLink = academyContact.linkedin;
      }

      return parsed;
    } catch (e) {
      console.error("Error parsing stored CMS data:", e);
    }
  }

  return {
    siteLogoText: "Truth",
    siteLogoSubText: "Quran",
    heroKicker: "Premium 1-on-1 Online Quranic Academy",
    heroTitle: "Embark on a Spiritual Journey with Divine Precision",
    heroDescription: "Learn Holy Quran recitation, Tajweed, Hifz, and Arabic language from native certified Arab tutors in private 1-on-1 virtual classrooms. Structured curriculums tailored perfectly for children, sisters, and busy professionals.",
    heroPrimaryBtnText: "Book Free Trial Session",
    heroSecondaryBtnText: "Explore Courses",
    contactPhone: academyContact.phone,
    contactEmail: academyContact.email,
    contactAddress: academyContact.address,
    whatsappLink: academyContact.whatsapp,
    facebookLink: academyContact.facebook,
    instagramLink: academyContact.instagram,
    courses: coursesData,
    whyUs: whyUsData,
    pricingPlans: pricingPlans,
    testimonials: testimonialsData,
    faqs: faqItems,
    blogPosts: blogPostsData.map(ensureBlogPostSEO),
    teachers: DEFAULT_TEACHERS,
    developerName: "Muhammad Zain",
    developerRole: academyContact.developerRole,
    developerAvatar: academyContact.developerAvatar,
    seoSettings: DEFAULT_SEO_SETTINGS,
    
    videos: DEFAULT_VIDEOS,
    integrations: DEFAULT_INTEGRATIONS,
    analyticsData: DEFAULT_ANALYTICS,
    searchPerformance: DEFAULT_SEARCH_PERFORMANCE,
    seoHealth: DEFAULT_SEO_HEALTH,

    // Enterprise WordPress simulated additions
    sectionsVisibility: {
      hero: true,
      whyUs: true,
      courses: true,
      process: true,
      pricing: true,
      testimonials: true,
      faqs: true,
      blog: true,
      contact: true
    },
    sectionsOrder: ["hero", "whyUs", "courses", "process", "pricing", "testimonials", "faqs", "blog", "contact"],
    themeColors: {
      primaryGold: "#d9b45c",
      bgDark: "#07080b",
      cardBg: "#12141b",
      textLight: "#f3ecd8",
      textMuted: "#c9c2ab"
    },
    themeTypography: {
      headingFont: "Playfair Display",
      bodyFont: "Inter",
      baseFontSize: "16px"
    },
    navigationMenu: DEFAULT_NAVIGATION_MENU,
    comments: DEFAULT_COMMENTS,
    mediaLibrary: DEFAULT_MEDIA,
    userProfiles: DEFAULT_USERS,
    widgets: DEFAULT_WIDGETS,
    siteSettings: {
      title: "Truth Quran Academy",
      tagline: "Uncompromising standards in Quran, Tajweed, and Hifz education",
      permalinkStructure: "/%postname%/",
      defaultLanguage: "en-US",
      isRTL: false,
      isCacheEnabled: true,
      isPerformanceOptimized: true,
      isWooCommerceReady: true,
      childThemeSupported: true,
      gutenbergCompatible: true,
      elementorCompatible: true,
      securityFirewallActive: true
    },
    aiSettings: DEFAULT_AI_SETTINGS,
    customImages: DEFAULT_CUSTOM_IMAGES
  };
};

export const fetchCMSDataFromServer = async (): Promise<CMSData> => {
  try {
    const res = await fetch("/api/cms-data");
    if (res.ok) {
      const data = await res.json();
      if (data && data.blogPosts) {
        data.blogPosts = data.blogPosts.map(ensureBlogPostSEO);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new Event("cms_data_updated"));
      return data;
    }
  } catch (err) {
    console.warn("Could not fetch CMS data from server:", err);
  }
  return getCMSData();
};

export const saveCMSData = async (data: CMSData): Promise<boolean> => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  // Dispatch a custom event to notify React components of changes
  window.dispatchEvent(new Event("cms_data_updated"));

  try {
    const res = await fetch("/api/cms-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-WP-Admin-Token": "SECURE_WP_WPSECRET_2026"
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      console.error("Failed to sync save with server database");
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error syncing save with server database:", err);
    return true;
  }
};

export const resetCMSData = (): CMSData => {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("cms_data_updated"));
  
  // Save defaults on the server
  fetch("/api/cms-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "X-WP-Admin-Token": "SECURE_WP_WPSECRET_2026"
    },
    body: JSON.stringify(getCMSData())
  }).catch(console.error);

  return getCMSData();
};

export const submitUrlsForIndexing = async (
  urls: string | string[],
  action: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED",
  services: string[] = ["google", "indexnow"]
): Promise<{ success: boolean; message: string; logs?: IndexingLogEntry[]; quotaRemaining?: number }> => {
  const urlList = Array.isArray(urls) ? urls : [urls];
  try {
    const res = await fetch("/api/indexing/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-WP-Admin-Token": "SECURE_WP_WPSECRET_2026"
      },
      body: JSON.stringify({ urls: urlList, action, services })
    });
    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        message: data.message || `Submitted ${urlList.length} URL(s) to Google Search Console & IndexNow.`,
        logs: data.logs,
        quotaRemaining: data.quotaRemaining
      };
    }
    return { success: false, message: "Indexing submission failed on server." };
  } catch (err: any) {
    console.error("Error submitting URLs for indexing:", err);
    return { success: false, message: err.message || "Failed to connect to indexing service." };
  }
};

export const pingSitemaps = async (): Promise<{ success: boolean; message: string; results?: any }> => {
  try {
    const res = await fetch("/api/indexing/ping-sitemap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-WP-Admin-Token": "SECURE_WP_WPSECRET_2026"
      }
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, message: data.message || "Sitemaps pinged to Google and Bing successfully.", results: data.results };
    }
    return { success: false, message: "Failed to ping sitemaps to search engines." };
  } catch (err: any) {
    return { success: false, message: err.message || "Network error while pinging sitemaps." };
  }
};

