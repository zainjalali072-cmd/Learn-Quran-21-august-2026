import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Tag, 
  Sparkles, 
  Search, 
  X,
  Share2,
  Copy,
  Check,
  Facebook,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Award,
  CheckCircle2,
  Bookmark,
  ExternalLink
} from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import { blogPostsData } from "../data";
import { getCMSData, DEFAULT_POST_IMAGE, cleanHTMLToExcerpt, ensureBlogPostSEO, BlogPost } from "../cmsStore";
import { parseCurrentRoute, slugify } from "../utils/router";

interface BlogSectionProps {
  currentView: string;
  setView: (view: string) => void;
  activePostId: string | null;
  setActivePostId: (id: string | null) => void;
}

interface Comment {
  id: string;
  author: string;
  date: string;
  text: string;
  avatar: string;
}

interface BlogCardProps {
  key?: string | number;
  post: BlogPost;
  index: number;
  onClick: () => void;
}

// Standardized Reusable Blog Card Component matching exact design specs
export function BlogCard({ post, index, onClick }: BlogCardProps) {
  const cardImg = post.coverImage || post.featuredImage || DEFAULT_POST_IMAGE;
  const cleanExcerpt = cleanHTMLToExcerpt(post.content, post.excerpt);
  const displayCategory = post.category || "Tajweed Rules";
  const displayDate = post.date || post.publishDate || "August 2026";
  const displayReadTime = post.readTime || "5 min read";
  const displayAuthor = post.author?.name || "Muhammad Zain";

  return (
    <motion.div
      key={post.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.01, transition: { duration: 0.25 } }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.4) }}
      onClick={onClick}
      className="bg-[#12141b]/70 border border-[#d9b45c]/12 rounded-2xl overflow-hidden hover:border-[#d9b45c]/35 transition-all duration-300 flex flex-col h-full cursor-pointer group shadow-lg"
    >
      {/* 1. Media Card Cover & Featured Image */}
      <div className="w-full aspect-[3/2] bg-[#07080b] relative overflow-hidden">
        <img
          src={cardImg}
          alt={post.title || "Blog Article"}
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_POST_IMAGE;
          }}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12141b] via-transparent to-transparent pointer-events-none" />
        {/* 2. Category Badge */}
        <span className="absolute top-4 left-4 text-[9px] font-sans uppercase font-bold text-[#f2d98a] bg-[#07080b]/85 border border-[#d9b45c]/25 px-2.5 py-1 rounded-full z-10 shadow-md">
          {displayCategory}
        </span>
      </div>

      {/* Content Card Panel */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4 text-left">
        <div className="space-y-2">
          {/* Metadata Row: 3. Publish Date & 4. Reading Time */}
          <div className="flex items-center space-x-3 text-[10px] font-sans text-[#c9c2ab]">
            <span className="flex items-center space-x-1">
              <Calendar size={11} className="text-[#d9b45c]" />
              <span>{displayDate}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#d9b45c]/20" />
            <span className="flex items-center space-x-1">
              <Clock size={11} className="text-[#d9b45c]" />
              <span>{displayReadTime}</span>
            </span>
          </div>

          {/* 5. Article Title */}
          <h3 className="font-serif text-[#f3ecd8] group-hover:text-[#f2d98a] text-sm md:text-base font-medium tracking-tight leading-snug line-clamp-2 transition-colors">
            {post.title}
          </h3>

          {/* 6. Short Description (Excerpt) */}
          <p className="text-xs text-[#c9c2ab] leading-relaxed line-clamp-3">
            {cleanExcerpt}
          </p>
        </div>

        {/* Card Footer: 7. "Read Article" Button & 8. Author Name */}
        <div className="pt-2 border-t border-[#d9b45c]/8 flex items-center justify-between">
          <span className="text-[10px] font-sans uppercase font-extrabold tracking-widest text-[#d9b45c] group-hover:text-[#f2d98a] flex items-center space-x-1 transition-colors">
            <span>Read Article</span>
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </span>
          <span className="text-[10px] font-sans text-[#c9c2ab] italic">
            By {displayAuthor}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function BlogSection({
  currentView,
  setView,
  activePostId,
  setActivePostId
}: BlogSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cms, setCms] = useState(getCMSData());
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Comments state
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "c1",
      author: "Hafiz Abdullah",
      date: "August 2, 2026",
      text: "MashaAllah, an amazingly clear explanation of Makharij and Tajweed rules. The examples were incredibly helpful for my daily revision!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
    },
    {
      id: "c2",
      author: "Fatima Khan",
      date: "August 3, 2026",
      text: "JazakAllah Khair for this guide. I shared this with my Hifz study group, highly recommended reading for beginners.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80"
    }
  ]);
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentEmail, setNewCommentEmail] = useState("");
  const [newCommentText, setNewCommentText] = useState("");
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  useEffect(() => {
    const handleSync = () => setCms(getCMSData());
    window.addEventListener("cms_data_updated", handleSync);
    return () => window.removeEventListener("cms_data_updated", handleSync);
  }, []);

  const rawPosts = (cms.blogPosts && cms.blogPosts.length > 0) ? cms.blogPosts : (cms.posts || blogPostsData);
  const allPosts = rawPosts.map(ensureBlogPostSEO);

  const publishedPosts = allPosts.filter(p => {
    if (!p.status) return true;
    const s = String(p.status).trim().toLowerCase();
    return s === "published" || s === "approved" || s === "publish" || s === "active";
  });

  const parsePostDate = (dateStr?: string) => {
    if (!dateStr) return 0;
    const time = Date.parse(dateStr);
    return isNaN(time) ? 0 : time;
  };

  const currentPosts = [...publishedPosts].sort((a, b) => {
    const timeA = parsePostDate(a.date || a.publishDate || a.lastUpdated);
    const timeB = parsePostDate(b.date || b.publishDate || b.lastUpdated);
    return timeB - timeA;
  });

  const categories = ["All", ...Array.from(new Set(allPosts.map(p => p.category).filter(Boolean)))];

  useEffect(() => {
    const route = parseCurrentRoute();
    if (route.categorySlug) {
      const targetSlug = route.categorySlug.toLowerCase();
      const match = categories.find(c => slugify(String(c)) === targetSlug);
      if (match) {
        setSelectedCategory(match);
      }
    }
  }, []);

  // Handle post clicks
  const handlePostClick = (postId: string) => {
    const normalizeStr = (s?: string) => (s || "").trim().toLowerCase();
    const found = allPosts.find(p => 
      p.id === postId || 
      p.slug === postId || 
      normalizeStr(p.id) === normalizeStr(postId) ||
      normalizeStr(p.slug) === normalizeStr(postId)
    );
    const identifier = found?.slug || found?.id || postId;
    setActivePostId(identifier);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Back navigation
  const handleBackToBlog = () => {
    setActivePostId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Copy article link handler
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Handle new comment submission
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) return;

    const newC: Comment = {
      id: `comment-${Date.now()}`,
      author: newCommentName.trim(),
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      text: newCommentText.trim(),
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80"
    };

    setComments([newC, ...comments]);
    setNewCommentName("");
    setNewCommentEmail("");
    setNewCommentText("");
    setCommentSubmitted(true);
    setTimeout(() => setCommentSubmitted(false), 4000);
  };

  // Render Single Full Blog Post View
  if (currentView === "blog-post" && activePostId) {
    const normalize = (str?: string) => {
      if (!str) return "";
      let s = decodeURIComponent(str).trim().toLowerCase();
      s = s.replace(/^blog\//, "").replace(/\/$/, "");
      return s.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    };

    const target = normalize(activePostId);
    const post = allPosts.find((p) => {
      if (p.id === activePostId || p.slug === activePostId) return true;
      const pid = normalize(p.id);
      const pslug = normalize(p.slug);
      const ptitleSlug = normalize(p.title);
      return pid === target || pslug === target || ptitleSlug === target;
    });
    if (!post) {
      return (
        <div className="text-center py-20">
          <p className="text-base text-[#c9c2ab]">Article not found.</p>
          <button 
            onClick={handleBackToBlog}
            className="mt-4 px-6 py-2.5 rounded-full bg-[#d9b45c] text-[#07080b] font-sans font-bold uppercase text-xs tracking-wider cursor-pointer"
          >
            Back to Blog
          </button>
        </div>
      );
    }

    const postCoverImage = post.coverImage || post.featuredImage || DEFAULT_POST_IMAGE;
    const authorAvatar = post.author?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80";
    const authorName = post.author?.name || "Muhammad Zain";
    const authorRole = post.author?.role || "Senior Quran Scholar & Tajweed Instructor";

    // Dynamic Related posts in same category or general
    let relatedPosts = currentPosts
      .filter(p => p.id !== post.id && p.slug !== post.slug)
      .filter(p => p.category === post.category);

    if (relatedPosts.length < 3) {
      const extra = currentPosts.filter(p => p.id !== post.id && p.slug !== post.slug && !relatedPosts.some(r => r.id === p.id));
      relatedPosts = [...relatedPosts, ...extra].slice(0, 3);
    } else {
      relatedPosts = relatedPosts.slice(0, 3);
    }

    // Article FAQs
    const defaultFaqs = [
      {
        question: `Why is learning ${post.category || "Tajweed"} essential for Quran recitation?`,
        answer: `Mastering ${post.category || "Tajweed"} ensures that every Arabic phoneme and letter is articulated from its correct point (Makhraj) with proper characteristics (Sifat), preserving the precise divine revelation of the Holy Quran.`
      },
      {
        question: "How long does it take to complete this course module?",
        answer: "Most students master the foundational principles within 4 to 6 weeks with 2 one-on-one live practice sessions per week under scholar guidance."
      },
      {
        question: "Is this lesson suitable for children and beginners?",
        answer: "Yes! Our curriculum at Jamia Naeemia Lahore & Truth Quran is tailored step-by-step for absolute beginners, young students, and adults alike."
      }
    ];

    // Schema JSON-LD Data for Rank Math & Google rich snippet SEO
    const schemaJsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt || cleanHTMLToExcerpt(post.content, ""),
      "image": [postCoverImage],
      "datePublished": post.date || post.publishDate || "2026-07-01",
      "dateModified": post.lastUpdated || post.date || "2026-08-01",
      "author": [{
        "@type": "Person",
        "name": authorName,
        "jobTitle": authorRole
      }],
      "publisher": {
        "@type": "Organization",
        "name": "Truth Quran & Jamia Naeemia",
        "logo": {
          "@type": "ImageObject",
          "url": "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=400"
        }
      }
    };

    return (
      <article className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-10 text-left" id="single-blog-post-article">
        {/* Schema JSON-LD Integration */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />

        {/* BREADCRUMB NAVIGATION */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center space-x-2 text-[11px] font-sans text-[#c9c2ab]">
          <button onClick={() => setView("home")} className="hover:text-[#d9b45c] transition-colors">Home</button>
          <span>/</span>
          <button onClick={handleBackToBlog} className="hover:text-[#d9b45c] transition-colors">Blog</button>
          <span>/</span>
          <span className="text-[#d9b45c] font-semibold">{post.category || "Articles"}</span>
          <span className="hidden sm:inline">/</span>
          <span className="hidden sm:inline text-white/60 truncate max-w-[200px]">{post.title}</span>
        </nav>

        {/* Back Button & Category Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            onClick={handleBackToBlog}
            className="inline-flex items-center space-x-2 text-xs font-sans font-bold uppercase tracking-wider text-[#d9b45c] hover:text-[#f3ecd8] transition-colors cursor-pointer group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Articles</span>
          </button>

          <span className="inline-block text-[10px] font-sans uppercase font-extrabold text-[#f2d98a] bg-[#07080b]/90 border border-[#d9b45c]/30 px-3 py-1 rounded-full shadow-sm">
            {post.category || "Tajweed Rules"}
          </span>
        </div>

        {/* ARTICLE H1 TITLE */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#f3ecd8] font-semibold leading-[1.18] tracking-tight mb-6">
          {post.title}
        </h1>

        {/* AUTHOR & METADATA BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-[#d9b45c]/15 py-4 mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-full border border-[#d9b45c]/40 overflow-hidden bg-[#0e1015] shrink-0">
              <img
                src={authorAvatar}
                alt={authorName}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80";
                }}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-xs md:text-sm font-sans font-bold text-[#f3ecd8]">{authorName}</div>
              <div className="text-[10px] md:text-xs font-sans text-[#c9c2ab]">{authorRole}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] font-sans text-[#c9c2ab]">
            <span className="flex items-center space-x-1.5">
              <Calendar size={13} className="text-[#d9b45c]" />
              <span>Published: {post.date || post.publishDate || "July 2026"}</span>
            </span>
            {post.lastUpdated && (
              <span className="hidden sm:inline text-[10px] text-[#d9b45c]/80 italic">
                (Updated: {post.lastUpdated})
              </span>
            )}
            <span className="w-1 h-1 rounded-full bg-[#d9b45c]/30" />
            <span className="flex items-center space-x-1.5">
              <Clock size={13} className="text-[#d9b45c]" />
              <span>{post.readTime || "5 min read"}</span>
            </span>
          </div>

          {/* SOCIAL SHARE TOOLBAR */}
          <div className="w-full sm:w-auto flex items-center space-x-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
            <span className="text-[10px] uppercase font-bold text-[#d9b45c] mr-1 hidden md:inline">Share:</span>
            <button
              onClick={handleCopyLink}
              className="px-2.5 py-1.5 rounded-lg bg-[#12141b] border border-[#d9b45c]/25 hover:border-[#d9b45c] text-[#f3ecd8] hover:text-white transition-colors relative text-xs flex items-center space-x-1.5"
              title="Copy Article Link"
            >
              {copiedLink ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span className="text-[10px] font-bold">{copiedLink ? "Copied!" : "Copy"}</span>
            </button>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-lg bg-[#12141b] border border-[#1877F2]/40 hover:border-[#1877F2] text-[#4285F4] hover:text-white hover:bg-[#1877F2]/20 text-[10px] font-bold flex items-center space-x-1.5 transition-all shadow-sm"
              title="Share Article on Facebook"
            >
              <Facebook size={13} className="text-[#1877F2]" />
              <span>Facebook</span>
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + " " + (typeof window !== "undefined" ? window.location.href : ""))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-lg bg-[#12141b] border border-emerald-500/40 hover:border-emerald-500 text-emerald-400 hover:text-white hover:bg-emerald-500/20 text-[10px] font-bold flex items-center space-x-1.5 transition-all shadow-sm"
              title="Share Article on WhatsApp"
            >
              <WhatsAppIcon size={13} className="text-emerald-400" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* FEATURED IMAGE & CAPTION */}
        <div className="w-full mb-8">
          <div className="w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden border border-[#d9b45c]/20 shadow-xl relative bg-[#07080b]">
            <img
              src={postCoverImage}
              alt={post.imageAltText || post.title}
              title={post.imageTitle || post.title}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_POST_IMAGE;
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07080b]/40 via-transparent to-transparent pointer-events-none" />
          </div>
          <p className="mt-2 text-center text-[11px] font-sans text-[#c9c2ab]/70 italic">
            {post.imageCaption || `Featured Image: ${post.title} — Truth Quran & Jamia Naeemia Academy`}
          </p>
        </div>

        {/* KEY TAKEAWAYS BOX */}
        <div className="bg-[#12141b] border-l-4 border-[#d9b45c] rounded-r-2xl p-5 md:p-6 mb-10 shadow-lg">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#d9b45c] mb-2">
            <Sparkles size={16} />
            <span>Article Key Takeaways</span>
          </div>
          <p className="text-xs md:text-sm text-[#f3ecd8] leading-relaxed italic font-serif">
            "{post.excerpt || cleanHTMLToExcerpt(post.content, "")}"
          </p>
        </div>

        {/* HIGHLIGHTED ARABIC VERSE BLOCK (IF AVAILABLE) */}
        {post.arabicVerse && (
          <div className="bg-[#12141b]/90 border border-[#d9b45c]/30 rounded-2xl p-6 md:p-8 mb-10 relative overflow-hidden shadow-md text-left">
            <div className="absolute right-4 top-4 text-[#d9b45c]/5 pointer-events-none font-serif text-8xl leading-none">
              ✦
            </div>
            <div className="space-y-4">
              <div className="font-arabic text-[#f2d98a] text-xl md:text-2xl leading-relaxed text-right font-semibold">
                {post.arabicVerse.arabic}
              </div>
              <p className="text-xs md:text-sm text-[#f3ecd8] italic font-serif leading-relaxed">
                "{post.arabicVerse.translation}"
              </p>
              <div className="text-[10px] font-sans uppercase font-bold tracking-widest text-[#d9b45c]">
                — {post.arabicVerse.citation}
              </div>
            </div>
          </div>
        )}

        {/* ARTICLE CONTENT CONTAINER (OPTIMIZED FOR READABILITY: ~750-850PX) */}
        <div className="max-w-[820px] mx-auto space-y-6">
          <div 
            className="prose prose-invert max-w-none text-sm md:text-base text-[#F3F4F6] leading-relaxed font-sans
              [&>h1]:font-serif [&>h1]:text-3xl [&>h1]:md:text-4xl [&>h1]:text-[#FFFFFF] [&>h1]:font-bold [&>h1]:mt-10 [&>h1]:mb-4
              [&>h2]:font-serif [&>h2]:text-2xl [&>h2]:md:text-3xl [&>h2]:text-[#FFFFFF] [&>h2]:font-bold [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:border-b [&>h2]:border-[#d9b45c]/30 [&>h2]:pb-2
              [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:text-[#FFFFFF] [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:border-b [&_h2]:border-[#d9b45c]/30 [&_h2]:pb-2
              [&>h3]:font-serif [&>h3]:text-xl [&>h3]:md:text-2xl [&>h3]:text-[#FFFFFF] [&>h3]:font-bold [&>h3]:mt-8 [&>h3]:mb-3
              [&_h3]:font-serif [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:text-[#FFFFFF] [&_h3]:font-bold [&_h3]:mt-8 [&_h3]:mb-3
              [&>h4]:font-serif [&>h4]:text-lg [&>h4]:text-[#f3ecd8] [&>h4]:font-semibold [&>h4]:mt-6 [&>h4]:mb-2
              [&_h4]:font-serif [&_h4]:text-lg [&_h4]:text-[#f3ecd8] [&_h4]:font-semibold [&_h4]:mt-6 [&_h4]:mb-2
              [&>p]:mb-6 [&>p]:leading-relaxed [&>p]:text-[#F3F4F6]
              [&_p]:mb-6 [&_p]:leading-relaxed [&_p]:text-[#F3F4F6]
              [&>ul]:my-6 [&>ul]:pl-6 [&>ul]:space-y-2 [&>ul>li]:list-disc [&>ul>li]:marker:text-[#d9b45c] [&>ul>li]:text-[#F3F4F6]
              [&>ol]:my-6 [&>ol]:pl-6 [&>ol]:space-y-2 [&>ol>li]:list-decimal [&>ol>li]:marker:text-[#d9b45c] [&>ol>li]:text-[#F3F4F6]
              [&>blockquote]:my-8 [&>blockquote]:p-6 [&>blockquote]:bg-[#12141b] [&>blockquote]:border-l-4 [&>blockquote]:border-[#d9b45c] [&>blockquote]:italic [&>blockquote]:text-[#F3F4F6] [&>blockquote]:rounded-r-2xl [&>blockquote]:font-serif
              [&_table]:w-full [&_table]:my-8 [&_table]:border-collapse [&_table]:border [&_table]:border-[#d9b45c]/30 [&_table]:rounded-2xl [&_table]:overflow-hidden [&_table]:text-xs [&_table]:md:text-sm [&_table]:bg-[#12141b]/90 [&_table]:text-left [&_table]:shadow-xl
              [&_th]:bg-[#1c202b] [&_th]:text-[#f2d98a] [&_th]:font-serif [&_th]:font-bold [&_th]:p-3.5 [&_th]:border-b [&_th]:border-[#d9b45c]/30 [&_th]:border-r [&_th]:border-white/10 [&_th]:uppercase [&_th]:tracking-wider [&_th]:text-xs
              [&_td]:p-3.5 [&_td]:text-xs [&_td]:md:text-sm [&_td]:text-[#F3F4F6] [&_td]:border-b [&_td]:border-white/5 [&_td]:border-r [&_td]:border-white/5
              [&_tr:hover]:bg-white/[0.04] [&_tr:hover]:transition-colors
              [&_.cta-button-block]:my-10 [&_.cta-button-block_a]:no-underline [&_.cta-button-block_a]:hover:no-underline
              [&>a]:text-[#FACC15] [&>a]:underline [&>a]:hover:text-[#FEF08A] [&>a]:font-semibold
              [&_a]:text-[#FACC15] [&_a]:underline [&_a]:hover:text-[#FEF08A] [&_a]:font-semibold
              [&>pre]:bg-[#07080b] [&>pre]:p-4 [&>pre]:rounded-xl [&>pre]:text-[#f2d98a] [&>pre]:font-mono [&>pre]:text-xs [&>pre]:overflow-x-auto [&>pre]:border [&>pre]:border-white/10"
            dangerouslySetInnerHTML={{ __html: post.content || "<p>No article content provided for this post.</p>" }}
          />

          {/* TAGS & SHARE BLOCK */}
          <div className="pt-8 border-t border-[#d9b45c]/15 mt-10 space-y-4">
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-sans uppercase font-bold tracking-widest text-[#d9b45c] mr-2">
                  Article Tags:
                </span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center space-x-1 px-3 py-1 rounded-md bg-[#12141b] border border-[#d9b45c]/15 text-[10px] font-sans font-semibold text-[#c9c2ab]"
                  >
                    <Tag size={10} className="text-[#d9b45c]" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Bottom Social Share Bar */}
            <div className="p-4 bg-[#12141b]/90 border border-[#d9b45c]/25 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
              <div className="flex items-center space-x-2 text-xs text-[#f3ecd8]">
                <Share2 size={16} className="text-[#d9b45c]" />
                <span className="font-serif font-bold text-sm">Spread Islamic Knowledge:</span>
                <span className="text-[11px] text-[#c9c2ab] hidden md:inline">Share this beneficial article with family & friends</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-xl bg-[#07080b] border border-[#d9b45c]/25 hover:border-[#d9b45c] text-[#f3ecd8] hover:text-white text-xs font-bold flex items-center space-x-1.5 transition-all"
                  title="Copy Article Link"
                >
                  {copiedLink ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copiedLink ? "Link Copied!" : "Copy Link"}</span>
                </button>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[#1877F2]/15 border border-[#1877F2]/40 hover:bg-[#1877F2] text-[#4285F4] hover:text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm"
                  title="Share Article on Facebook"
                >
                  <Facebook size={13} />
                  <span>Facebook</span>
                </a>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + " " + (typeof window !== "undefined" ? window.location.href : ""))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600/15 border border-emerald-500/40 hover:bg-emerald-600 text-emerald-400 hover:text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm"
                  title="Share Article on WhatsApp"
                >
                  <WhatsAppIcon size={13} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* INTERACTIVE FAQ ACCORDION SECTION */}
          <div className="mt-12 pt-8 border-t border-[#d9b45c]/15">
            <h3 className="font-serif text-xl md:text-2xl text-[#f3ecd8] font-semibold mb-6 flex items-center space-x-2">
              <HelpCircle className="text-[#d9b45c]" size={22} />
              <span>Frequently Asked Questions</span>
            </h3>

            <div className="space-y-3">
              {defaultFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div 
                    key={idx}
                    className="bg-[#12141b] border border-[#d9b45c]/15 rounded-xl overflow-hidden transition-all duration-200"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left font-serif text-sm md:text-base font-medium text-[#f3ecd8] hover:text-[#f2d98a] cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? <ChevronUp size={18} className="text-[#d9b45c] shrink-0 ml-2" /> : <ChevronDown size={18} className="text-[#c9c2ab] shrink-0 ml-2" />}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs md:text-sm text-[#c9c2ab] leading-relaxed border-t border-white/5 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CONCLUSION & ACADEMY TRIAL CTA */}
          <div className="mt-12 p-6 md:p-8 bg-gradient-to-br from-[#12141b] to-[#07080b] border border-[#d9b45c]/30 rounded-2xl text-center space-y-4 shadow-xl">
            <span className="inline-block p-3 rounded-full bg-[#d9b45c]/10 text-[#d9b45c]">
              <Award size={28} />
            </span>
            <h3 className="font-serif text-2xl text-[#f3ecd8] font-bold">
              Ready to Master Quranic Recitation & Tajweed?
            </h3>
            <p className="text-xs md:text-sm text-[#c9c2ab] max-w-lg mx-auto leading-relaxed">
              Book your complimentary 1-on-1 trial session with certified scholars from Jamia Naeemia Lahore. Flexible schedules available for kids, adults, and female students.
            </p>
            <div>
              <button
                onClick={() => setView("contact")}
                className="px-8 py-3.5 bg-gradient-to-r from-[#f2d98a] to-[#d9b45c] text-[#07080b] font-extrabold text-xs uppercase tracking-wider rounded-full shadow-lg hover:brightness-110 transition-all cursor-pointer"
              >
                Book Free Trial Class →
              </button>
            </div>
          </div>

          {/* EXPANDED AUTHOR BIO CARD */}
          <div className="mt-12 p-6 bg-[#12141b]/90 border border-[#d9b45c]/20 rounded-2xl flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-5 text-center md:text-left">
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-20 h-20 rounded-full border-2 border-[#d9b45c]/50 object-cover shrink-0"
            />
            <div className="space-y-2 flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                <div>
                  <h4 className="font-serif text-lg text-[#f3ecd8] font-bold">{authorName}</h4>
                  <p className="text-xs text-[#d9b45c] font-semibold">{authorRole}</p>
                </div>
                <span className="text-[10px] font-sans uppercase font-bold tracking-widest text-[#c9c2ab]/60">
                  Certified Instructor
                </span>
              </div>
              <p className="text-xs text-[#c9c2ab] leading-relaxed">
                Dedicated Quran teacher and Tajweed specialist with over 10 years of experience educating students globally in Quranic phonetics, Hifz retention, and classical Arabic studies.
              </p>
            </div>
          </div>

          {/* INTERACTIVE COMMENTS SECTION */}
          <div className="mt-12 pt-8 border-t border-[#d9b45c]/15">
            <h3 className="font-serif text-xl md:text-2xl text-[#f3ecd8] font-semibold mb-6 flex items-center space-x-2">
              <MessageSquare className="text-[#d9b45c]" size={20} />
              <span>Article Discussion ({comments.length})</span>
            </h3>

            {/* List existing comments */}
            <div className="space-y-4 mb-8">
              {comments.map((c) => (
                <div key={c.id} className="p-4 bg-[#12141b] border border-white/5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#f2d98a]">{c.author}</span>
                    <span className="text-[10px] text-[#c9c2ab]/60">{c.date}</span>
                  </div>
                  <p className="text-xs text-[#c9c2ab] leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="bg-[#12141b]/70 border border-[#d9b45c]/15 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs uppercase font-bold text-[#d9b45c]">Leave a Comment</h4>
              {commentSubmitted && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  ✓ JazakAllah! Your comment has been posted successfully.
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Your Name *"
                  value={newCommentName}
                  onChange={(e) => setNewCommentName(e.target.value)}
                  className="w-full bg-[#07080b] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#f3ecd8] placeholder-[#c9c2ab]/50 focus:outline-none focus:border-[#d9b45c]"
                />
                <input
                  type="email"
                  placeholder="Your Email (Optional)"
                  value={newCommentEmail}
                  onChange={(e) => setNewCommentEmail(e.target.value)}
                  className="w-full bg-[#07080b] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#f3ecd8] placeholder-[#c9c2ab]/50 focus:outline-none focus:border-[#d9b45c]"
                />
              </div>
              <textarea
                required
                rows={3}
                placeholder="Share your thoughts or questions on this article..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="w-full bg-[#07080b] border border-white/10 rounded-xl p-4 text-xs text-[#f3ecd8] placeholder-[#c9c2ab]/50 focus:outline-none focus:border-[#d9b45c]"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#d9b45c] hover:bg-[#f2d98a] text-[#07080b] font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Post Comment
              </button>
            </form>
          </div>
        </div>

        {/* RELATED ARTICLES SECTION */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#d9b45c]/20">
            <h3 className="font-serif text-xl md:text-2xl text-[#f3ecd8] font-semibold tracking-tight mb-6">
              Related Articles & Tajweed Guides
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => {
                const relImage = rel.coverImage || rel.featuredImage || DEFAULT_POST_IMAGE;
                return (
                  <div
                    key={rel.id}
                    onClick={() => handlePostClick(rel.id)}
                    className="bg-[#12141b]/80 border border-[#d9b45c]/15 rounded-xl overflow-hidden hover:border-[#d9b45c]/40 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="aspect-[3/2] overflow-hidden bg-[#07080b] relative">
                      <img
                        src={relImage}
                        alt={rel.title}
                        loading="lazy"
                        onError={(e) => { e.currentTarget.src = DEFAULT_POST_IMAGE; }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 text-[9px] font-sans uppercase font-bold text-[#f2d98a] bg-[#07080b]/85 border border-[#d9b45c]/25 px-2.5 py-0.5 rounded-full z-10">
                        {rel.category}
                      </span>
                    </div>
                    <div className="p-4 space-y-2 text-left flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif text-sm text-[#f3ecd8] group-hover:text-[#f2d98a] font-medium line-clamp-2 transition-colors">
                          {rel.title}
                        </h4>
                        <p className="text-[11px] text-[#c9c2ab] line-clamp-2 mt-1">
                          {cleanHTMLToExcerpt(rel.content, rel.excerpt)}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-[#d9b45c]/10 flex items-center justify-between text-[10px] text-[#d9b45c] font-sans uppercase font-bold">
                        <span>Read Article</span>
                        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </article>
    );
  }

  // Filter logic including category and search query
  const filteredPosts = currentPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase().trim();
    const titleMatch = (post.title || "").toLowerCase().includes(q);
    const excerptMatch = (post.excerpt || "").toLowerCase().includes(q);
    const categoryMatch = (post.category || "").toLowerCase().includes(q);
    const tagMatch = post.tags && post.tags.some(t => t.toLowerCase().includes(q));
    const authorMatch = post.author && (post.author.name || "").toLowerCase().includes(q);
    return titleMatch || excerptMatch || categoryMatch || tagMatch || authorMatch;
  });

  // Home View (Show latest 3 previews)
  if (currentView === "home") {
    return (
      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="home-blog-grid">
          {currentPosts.slice(0, 3).map((post, index) => (
            <BlogCard
              key={post.id || post.slug}
              post={post}
              index={index}
              onClick={() => handlePostClick(post.id)}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <button
            onClick={() => setView("blog")}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-full border border-[#d9b45c]/30 text-xs font-sans font-bold uppercase tracking-wider text-[#f3ecd8] hover:bg-[#d9b45c]/10 hover:border-[#d9b45c] transition-all duration-300 cursor-pointer"
          >
            <span>View All Articles & Guides</span>
            <ArrowRight size={14} className="text-[#d9b45c]" />
          </button>
        </div>
      </div>
    );
  }

  // Blog Page View
  return (
    <div className="space-y-10" id="blog-page-panel">
      {/* Search and Category Filter Row */}
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Search Field */}
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d9b45c]/70" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title, keywords, or topics..."
            className="w-full bg-[#12141b]/90 border border-[#d9b45c]/25 rounded-full pl-11 pr-10 py-3 text-xs text-[#f3ecd8] placeholder-[#c9c2ab]/50 focus:outline-none focus:border-[#d9b45c] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c9c2ab] hover:text-[#f3ecd8]"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Filter Pills Row */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-[10px] font-sans font-extrabold uppercase tracking-widest border transition-all duration-300 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-[#f2d98a] to-[#d9b45c] text-[#07080b] border-[#d9b45c] shadow-[0_4px_12px_rgba(217,180,92,0.25)]"
                  : "bg-[#12141b]/60 text-[#c9c2ab] border-[#d9b45c]/15 hover:border-[#d9b45c]/40 hover:text-[#f3ecd8]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {searchQuery && (
        <div className="text-center text-xs font-sans text-[#c9c2ab]">
          Showing search results for <span className="text-[#d9b45c] font-bold">"{searchQuery}"</span> ({filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} found)
        </div>
      )}

      {/* Full Grid Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="blog-grid">
        {filteredPosts.map((post, index) => (
          <BlogCard
            key={post.id || post.slug}
            post={post}
            index={index}
            onClick={() => handlePostClick(post.id)}
          />
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-sm text-[#c9c2ab]">No articles found matching your criteria.</p>
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
              className="mt-4 px-6 py-2 rounded-full bg-[#d9b45c]/20 border border-[#d9b45c] text-[#f3ecd8] text-xs font-sans uppercase font-bold"
            >
              Clear Search & Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
