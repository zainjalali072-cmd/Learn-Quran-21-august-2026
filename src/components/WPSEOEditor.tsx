import React, { useState, useEffect, useMemo, useRef } from "react";
import { BlogPost } from "../types";
import { saveCMSData, CMSData, cleanHTMLToExcerpt, DEFAULT_POST_IMAGE, submitUrlsForIndexing } from "../cmsStore";
import { 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Link2, 
  Eye, 
  FileText, 
  ImageIcon, 
  Save, 
  Plus, 
  Trash2, 
  Copy, 
  ExternalLink, 
  Clock, 
  User, 
  Tag, 
  Calendar, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Heading1, 
  Heading2, 
  Heading3, 
  Heading4,
  List, 
  Quote, 
  Table as TableIcon, 
  Upload, 
  Crop, 
  RotateCcw, 
  RefreshCw, 
  Globe, 
  X, 
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ListOrdered,
  FileCode,
  Video,
  Download,
  Minus,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Wand2,
  Share2,
  Layers,
  Columns,
  Zap,
  MousePointerClick,
  ArrowRight,
  HelpCircle,
  Type
} from "lucide-react";

interface WPSEOEditorProps {
  cmsData: CMSData;
  onSave: (newData: CMSData) => void;
  externalPostId?: string | null;
}

export default function WPSEOEditor({ cmsData, onSave, externalPostId }: WPSEOEditorProps) {
  // 1. Post Selection State
  const posts = cmsData.blogPosts || [];

  // Helper to create a clean blank draft with all fields empty
  const createBlankPost = (): BlogPost => {
    const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    return {
      id: `post-${Date.now()}`,
      title: "",
      excerpt: "",
      content: "",
      category: "Tajweed Rules",
      coverImage: "",
      featuredImage: "",
      author: {
        name: "Muhammad Zain",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
        role: "Senior Quran Scholar"
      },
      date: today,
      readTime: "1 min read",
      tags: [],
      status: "draft",
      slug: "",
      metaTitle: "",
      metaDescription: "",
      focusKeyword: "",
      robotsMeta: "index, follow",
      imageAltText: "",
      imageTitle: "",
      imageCaption: ""
    };
  };

  // Selected post ID from dropdown or parent
  const [selectedPostId, setSelectedPostId] = useState<string>(() => {
    if (externalPostId && externalPostId !== "new") return externalPostId;
    return "new";
  });

  useEffect(() => {
    if (externalPostId && externalPostId !== "new") {
      setSelectedPostId(externalPostId);
    } else if (externalPostId === "new" || externalPostId === null) {
      setSelectedPostId("new");
    }
  }, [externalPostId]);

  // Current Post loaded
  const currentPostIndex = posts.findIndex((p) => p.id === selectedPostId || p.slug === selectedPostId);
  const activePost = currentPostIndex !== -1 ? posts[currentPostIndex] : null;

  // Local Editable Post State
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(() => {
    if (externalPostId && externalPostId !== "new") {
      const p = posts.find((item) => item.id === externalPostId || item.slug === externalPostId);
      if (p) return p;
    }
    return createBlankPost();
  });

  useEffect(() => {
    if (selectedPostId === "new" || externalPostId === "new" || !selectedPostId) {
      setCurrentPost(createBlankPost());
    } else if (activePost) {
      setCurrentPost({
        ...activePost,
        status: activePost.status || "published",
        title: activePost.title || "",
        content: activePost.content || "",
        excerpt: activePost.excerpt || "",
        category: activePost.category || "Tajweed Rules",
        date: activePost.date || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        readTime: activePost.readTime || "5 min read",
        author: {
          name: activePost.author?.name || "Muhammad Zain",
          avatar: activePost.author?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
          role: activePost.author?.role || "Senior Quran Scholar"
        },
        tags: activePost.tags || [],
        metaTitle: activePost.metaTitle || activePost.title || "",
        metaDescription: activePost.metaDescription || activePost.excerpt || "",
        focusKeyword: activePost.focusKeyword || "",
        slug: activePost.slug || activePost.id || "post-slug",
        robotsMeta: activePost.robotsMeta || "index, follow",
        coverImage: activePost.coverImage || "",
        featuredImage: activePost.featuredImage || activePost.coverImage || "",
        imageAltText: activePost.imageAltText || "",
        imageTitle: activePost.imageTitle || "",
        imageCaption: activePost.imageCaption || ""
      });
    }
  }, [selectedPostId, posts.length]);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Device mode & Editor mode
  const [deviceFrame, setDeviceFrame] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [editorMode, setEditorMode] = useState<"visual" | "code">("visual");
  const [viewLayoutMode, setViewLayoutMode] = useState<"editor" | "split" | "preview">("editor");
  const [snippetDevice, setSnippetDevice] = useState<"desktop" | "mobile">("desktop");

  // Right Sidebar Active Tab ("seo" | "publish")
  const [activeSidebarTab, setActiveSidebarTab] = useState<"seo" | "publish">("seo");
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showChecklistExpanded, setShowChecklistExpanded] = useState(false);

  // Auto Save State
  const [lastSavedTime, setLastSavedTime] = useState<string>("Not saved yet");
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isIndexing, setIsIndexing] = useState(false);

  // Drag & Drop Image State
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // AI Assistant Modal State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiAction, setAiAction] = useState<string>("grammar");
  const [aiCustomPrompt, setAiCustomPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  // History stack for Undo / Redo
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const pushHistory = (newContent: string) => {
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      return [...sliced, newContent];
    });
    setHistoryIndex((prev) => prev + 1);
    setIsDirty(true);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevContent = history[historyIndex - 1];
      setHistoryIndex((prev) => prev - 1);
      if (currentPost) {
        setCurrentPost({ ...currentPost, content: prevContent });
      }
      showToast("Undo applied");
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextContent = history[historyIndex + 1];
      setHistoryIndex((prev) => prev + 1);
      if (currentPost) {
        setCurrentPost({ ...currentPost, content: nextContent });
      }
      showToast("Redo applied");
    }
  };

  // Modals state
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [tableHeaders, setTableHeaders] = useState<string[]>(["Feature / Topic", "Beginner Level", "Advanced Level"]);
  const [tablePreset, setTablePreset] = useState<"custom" | "comparison" | "schedule" | "pricing">("comparison");

  // Call to Action (CTA) Button Modal State
  const [showCtaModal, setShowCtaModal] = useState(false);
  const [ctaButtonText, setCtaButtonText] = useState("Book Free 3-Day Trial Class");
  const [ctaLinkUrl, setCtaLinkUrl] = useState("/contact");
  const [ctaSubtitle, setCtaSubtitle] = useState("1-on-1 Live Online Sessions with Certified Quran Scholars");
  const [ctaStyle, setCtaStyle] = useState<"gold" | "royal" | "whatsapp" | "outline" | "banner">("gold");
  const [ctaAlignment, setCtaAlignment] = useState<"center" | "left" | "right" | "full">("center");
  const [ctaOpenNewTab, setCtaOpenNewTab] = useState(true);
  const [ctaIcon, setCtaIcon] = useState<"arrow" | "whatsapp" | "phone" | "sparkles" | "book" | "none">("arrow");

  const [showMediaLibraryModal, setShowMediaLibraryModal] = useState(false);
  const [mediaTargetField, setMediaTargetField] = useState<"featured" | "internal">("featured");

  // Cropper Studio
  const [showCropModal, setShowCropModal] = useState(false);
  const [pendingCropImage, setPendingCropImage] = useState<string | null>(null);
  const [cropScale, setCropScale] = useState(1.0);
  const [cropPanX, setCropPanX] = useState(0);
  const [cropPanY, setCropPanY] = useState(0);
  const [cropBrightness, setCropBrightness] = useState(100);
  const [cropContrast, setCropContrast] = useState(100);
  const [cropSaturation, setCropSaturation] = useState(100);
  const [cropAspectRatio, setCropAspectRatio] = useState<"3:2" | "16:9" | "1:1" | "4:3">("3:2");

  const featuredFileInputRef = useRef<HTMLInputElement>(null);
  const internalFileInputRef = useRef<HTMLInputElement>(null);

  // Field updater
  const handleUpdateField = (field: keyof BlogPost, value: any) => {
    if (!currentPost) return;
    setCurrentPost((prev) => {
      if (!prev) return null;
      const updated = { ...prev, [field]: value };
      // Auto-generate slug when title changes
      if (field === "title" && (prev.slug === "new-article" || !prev.slug || prev.slug === prev.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))) {
        const generatedSlug = String(value).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        updated.slug = generatedSlug || "article";
        updated.metaTitle = String(value);
      }
      return updated;
    });
    setIsDirty(true);
  };

  // Word count & reading stats
  const contentStats = useMemo(() => {
    if (!currentPost) return { words: 0, chars: 0, sentences: 0, paragraphs: 0, readingTime: "0 min read" };
    const htmlContent = currentPost.content || "";
    const plainText = htmlContent.replace(/<[^>]*>/g, " ");
    const chars = plainText.length;
    const wordList = plainText.trim() ? plainText.trim().split(/\s+/).filter(Boolean) : [];
    const words = wordList.length;
    const sentences = plainText.split(/[.!?]+/).filter((s) => s.trim().length > 2).length || 0;
    const paragraphs = htmlContent.split(/<\/p>|<br\s*\/?>|\n\n+/).filter((p) => p.trim().length > 0).length || 0;
    const readTimeMinutes = Math.max(1, Math.ceil(words / 200));

    return {
      words,
      chars,
      sentences,
      paragraphs,
      readingTime: `${readTimeMinutes} min read`
    };
  }, [currentPost?.content]);

  // Rank Math SEO Audit Engine
  const seoAnalysis = useMemo(() => {
    if (!currentPost) {
      return { score: 0, readability: 0, rules: [], passedCount: 0, failedCount: 0 };
    }

    const keyword = (currentPost.focusKeyword || "").trim().toLowerCase();
    const title = (currentPost.title || "").trim();
    const titleLower = title.toLowerCase();
    const metaTitle = (currentPost.metaTitle || title).trim().toLowerCase();
    const metaDesc = (currentPost.metaDescription || "").trim();
    const metaDescLower = metaDesc.toLowerCase();
    const slug = (currentPost.slug || "").trim().toLowerCase();
    const htmlContent = (currentPost.content || "").trim();
    const plainText = htmlContent.replace(/<[^>]*>/g, " ");

    const words = contentStats.words;
    let rules: Array<{ id: string; label: string; category: string; passed: boolean; feedback: string; points: number }> = [];

    const hasKeyword = keyword.length >= 2;
    rules.push({
      id: "has_keyword",
      label: "Focus Keyword Defined",
      category: "Basic SEO",
      passed: hasKeyword,
      feedback: hasKeyword ? `Focus keyword: "${keyword}"` : "Set a focus keyword for Rank Math audit.",
      points: 15
    });

    const kwInTitle = hasKeyword ? titleLower.includes(keyword) || metaTitle.includes(keyword) : false;
    rules.push({
      id: "kw_title",
      label: "Keyword in Title",
      category: "Basic SEO",
      passed: kwInTitle,
      feedback: kwInTitle ? "Keyword present in post title." : "Include focus keyword in title.",
      points: 15
    });

    const kwInSlug = hasKeyword ? slug.includes(keyword.replace(/\s+/g, "-")) || slug.includes(keyword) : false;
    rules.push({
      id: "kw_slug",
      label: "Keyword in Permalink URL",
      category: "Basic SEO",
      passed: kwInSlug,
      feedback: kwInSlug ? "Keyword in URL slug." : "Add keyword to URL slug.",
      points: 15
    });

    const kwInDesc = hasKeyword ? metaDescLower.includes(keyword) : false;
    rules.push({
      id: "kw_desc",
      label: "Keyword in Meta Description",
      category: "Basic SEO",
      passed: kwInDesc,
      feedback: kwInDesc ? "Keyword found in meta description." : "Include keyword in meta description.",
      points: 10
    });

    const lengthPassed = words >= 300;
    rules.push({
      id: "word_count",
      label: "Content Length (300+ Words)",
      category: "Basic SEO",
      passed: lengthPassed,
      feedback: lengthPassed ? `${words} words written.` : `Current: ${words} words (Min 300).`,
      points: 15
    });

    const imageSet = Boolean(currentPost.coverImage || currentPost.featuredImage);
    rules.push({
      id: "featured_image",
      label: "Featured Image Included",
      category: "Media SEO",
      passed: imageSet,
      feedback: imageSet ? "Featured image set." : "Set a featured image for SEO & previews.",
      points: 15
    });

    const titleLen = title.length;
    const titleLenPassed = titleLen >= 25 && titleLen <= 65;
    rules.push({
      id: "title_length",
      label: "Title Length (25-65 Chars)",
      category: "Title SEO",
      passed: titleLenPassed,
      feedback: titleLenPassed ? `Title length: ${titleLen} chars.` : `Title length: ${titleLen} chars (Ideal 25-65).`,
      points: 15
    });

    const totalAchieved = rules.reduce((acc, r) => acc + (r.passed ? r.points : 0), 0);
    const overallScore = Math.min(100, totalAchieved);

    const wordsPerSentence = words / Math.max(1, contentStats.sentences);
    const readability = Math.max(0, Math.min(100, Math.round(100 - (wordsPerSentence * 1.8))));

    return {
      score: overallScore,
      readability,
      rules,
      passedCount: rules.filter((r) => r.passed).length,
      failedCount: rules.filter((r) => !r.passed).length
    };
  }, [currentPost, contentStats]);

  // Save current post to DB
  const handleSaveArticle = (statusOverride?: "published" | "draft", silent = false) => {
    if (!currentPost) return;

    const newStatus = statusOverride || currentPost.status || "published";
    const postTitle = (currentPost.title || "").trim() || "Untitled Article";
    const postSlug = (currentPost.slug || "").trim() || postTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const cleanExcerpt = cleanHTMLToExcerpt(currentPost.content || "", currentPost.excerpt);
    const validImage = currentPost.coverImage || currentPost.featuredImage || DEFAULT_POST_IMAGE;
    const todayFormatted = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    const updatedPost: BlogPost = {
      ...currentPost,
      title: postTitle,
      slug: postSlug,
      excerpt: cleanExcerpt,
      coverImage: validImage,
      featuredImage: validImage,
      ogImage: validImage,
      category: currentPost.category || "Tajweed Rules",
      date: currentPost.date || todayFormatted,
      readTime: currentPost.readTime || contentStats.readingTime || "5 min read",
      author: {
        name: currentPost.author?.name || "Muhammad Zain",
        avatar: currentPost.author?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
        role: currentPost.author?.role || "Senior Quran Scholar"
      },
      tags: currentPost.tags && currentPost.tags.length > 0 ? currentPost.tags : ["Tajweed Rules"],
      status: newStatus,
      lastUpdated: new Date().toISOString().split("T")[0],
      wordCount: contentStats.words,
      sentenceCount: contentStats.sentences,
      paragraphCount: contentStats.paragraphs,
      seoScore: seoAnalysis.score
    };

    let updatedPosts = [...posts];
    const existingIndex = updatedPosts.findIndex((p) => p.id === currentPost.id || (p.slug && p.slug === postSlug));

    if (existingIndex !== -1) {
      updatedPosts.splice(existingIndex, 1);
      updatedPosts.unshift(updatedPost);
    } else {
      updatedPosts.unshift(updatedPost);
    }

    const updatedCMSData: CMSData = {
      ...cmsData,
      blogPosts: updatedPosts
    };

    saveCMSData(updatedCMSData);
    onSave(updatedCMSData);
    setCurrentPost(updatedPost);
    setSelectedPostId(updatedPost.id);
    setIsDirty(false);

    const timeStr = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setLastSavedTime(`Saved at ${timeStr}`);

    if (!silent) {
      if (newStatus === "published") {
        showToast(`Article "${updatedPost.title}" published & dispatched to Google Indexing API!`);
        // Dispatch instant indexing ping
        const postUrl = `https://truthquranacademy.com/blog/${postSlug}`;
        submitUrlsForIndexing([postUrl], "URL_UPDATED", ["google", "indexnow"]).catch(console.error);
      } else {
        showToast(`Article "${updatedPost.title}" saved successfully!`);
      }
    }
  };

  // Manual Instant Indexing Trigger
  const handleManualInstantIndex = async () => {
    if (!currentPost) return;
    const postSlug = (currentPost.slug || "").trim() || (currentPost.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const postUrl = `https://truthquranacademy.com/blog/${postSlug}`;
    setIsIndexing(true);
    try {
      const res = await submitUrlsForIndexing([postUrl], "URL_UPDATED", ["google", "indexnow"]);
      if (res.success) {
        showToast(`⚡ Dispatched "${postUrl}" to Google Search Console API!`);
      } else {
        showToast(`⚡ Indexing dispatched (${res.message || 'Queued'})`);
      }
    } catch (err: any) {
      showToast(`Indexing failed: ${err.message || 'Error submitting'}`);
    } finally {
      setIsIndexing(false);
    }
  };

  // Auto-Save Effect (Every 30 seconds if dirty)
  useEffect(() => {
    const timer = setInterval(() => {
      if (isDirty && currentPost) {
        setIsAutoSaving(true);
        handleSaveArticle("draft", true);
        setTimeout(() => setIsAutoSaving(false), 1000);
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [isDirty, currentPost]);

  // Create brand new post
  const handleCreateNewPost = () => {
    const newId = `post-${Date.now()}`;
    const newPost: BlogPost = {
      id: newId,
      title: "",
      excerpt: "",
      category: "Tajweed Rules",
      coverImage: "",
      featuredImage: "",
      author: {
        name: "Muhammad Zain",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
        role: "Senior Quran Scholar"
      },
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      readTime: "1 min read",
      tags: [],
      content: "",
      status: "draft",
      metaTitle: "",
      metaDescription: "",
      focusKeyword: "",
      slug: "",
      robotsMeta: "index, follow",
      imageAltText: "",
      imageTitle: "",
      imageCaption: ""
    };

    const updatedCMSData = {
      ...cmsData,
      blogPosts: [newPost, ...posts]
    };

    saveCMSData(updatedCMSData);
    onSave(updatedCMSData);
    setSelectedPostId(newId);
    setCurrentPost(newPost);
    showToast("New blank draft created.");
  };

  // Delete current post
  const handleDeletePost = () => {
    if (!currentPost) return;
    if (!window.confirm(`Are you sure you want to delete "${currentPost.title || "this article"}"?`)) return;

    const remaining = posts.filter((p) => p.id !== currentPost.id);
    const updatedCMSData = {
      ...cmsData,
      blogPosts: remaining
    };

    saveCMSData(updatedCMSData);
    onSave(updatedCMSData);
    if (remaining.length > 0) {
      setSelectedPostId(remaining[0].id);
      setCurrentPost(remaining[0]);
    } else {
      setSelectedPostId("");
      setCurrentPost(null);
    }
    showToast("Article deleted.");
  };

  // Smart Plain-Text / Markdown to HTML Content Formatter
  const formatContentForPreview = (raw?: string): string => {
    if (!raw || !raw.trim()) return "<p class='text-gray-500 italic'>No content written yet.</p>";
    
    // If raw already contains HTML tags like <p>, <h2>, <h3>, <table>, <div>, <ul>, <ol>, <blockquote>
    const hasHtml = /<\/?(p|h[1-6]|table|div|ul|ol|blockquote|hr|section|article)[^>]*>/i.test(raw);
    
    if (hasHtml) {
      return raw;
    }

    // Convert plain text / markdown blocks into clean HTML
    const blocks = raw.split(/\n\n+/);
    const formatted = blocks.map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      
      // Markdown H3
      if (trimmed.startsWith("### ")) {
        return `<h3>${trimmed.replace(/^###\s+/, "")}</h3>`;
      }
      // Markdown H2
      if (trimmed.startsWith("## ")) {
        return `<h2>${trimmed.replace(/^##\s+/, "")}</h2>`;
      }
      // Markdown H1
      if (trimmed.startsWith("# ")) {
        return `<h1>${trimmed.replace(/^#\s+/, "")}</h1>`;
      }
      
      // Bullet list
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.includes("\n- ") || trimmed.includes("\n* ")) {
        const items = trimmed.split(/\n[-*]\s+/).filter(Boolean);
        return `<ul class="list-disc pl-5 space-y-1.5 my-4 text-[#F3F4F6] marker:text-[#d9b45c]">${items.map(it => `<li>${it.replace(/^[-*]\s+/, "")}</li>`).join("")}</ul>`;
      }

      // Numbered list
      if (/^\d+\.\s+/.test(trimmed) || trimmed.includes("\n1. ")) {
        const items = trimmed.split(/\n\d+\.\s+/).filter(Boolean);
        return `<ol class="list-decimal pl-5 space-y-1.5 my-4 text-[#F3F4F6] marker:text-[#d9b45c]">${items.map(it => `<li>${it.replace(/^\d+\.\s+/, "")}</li>`).join("")}</ol>`;
      }

      // Paragraph with <br/> for single newlines
      const withBreaks = trimmed.replace(/\n/g, "<br />");
      return `<p class="my-4 leading-relaxed text-[#F3F4F6]">${withBreaks}</p>`;
    }).filter(Boolean);

    return formatted.join("\n\n");
  };

  // Convert current content into clean structured HTML
  const autoFormatContentToHTML = (raw: string): string => {
    if (!raw.trim()) return raw;
    const blocks = raw.split(/\n\n+/);
    const formatted = blocks.map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      
      if (trimmed.startsWith("### ")) {
        return `<h3>${trimmed.replace(/^###\s+/, "")}</h3>`;
      }
      if (trimmed.startsWith("## ")) {
        return `<h2>${trimmed.replace(/^##\s+/, "")}</h2>`;
      }
      if (trimmed.startsWith("# ")) {
        return `<h1>${trimmed.replace(/^#\s+/, "")}</h1>`;
      }
      if (/^<h[1-6]/i.test(trimmed) || /^<table/i.test(trimmed) || /^<div/i.test(trimmed) || /^<ul/i.test(trimmed) || /^<ol/i.test(trimmed) || /^<blockquote/i.test(trimmed)) {
        return trimmed;
      }
      
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.includes("\n- ") || trimmed.includes("\n* ")) {
        const items = trimmed.split(/\n[-*]\s+/).filter(Boolean);
        return `<ul class="list-disc pl-5 space-y-1.5 my-4 text-[#F3F4F6] marker:text-[#d9b45c]">\n${items.map(it => `  <li>${it.replace(/^[-*]\s+/, "")}</li>`).join("\n")}\n</ul>`;
      }

      if (/^\d+\.\s+/.test(trimmed) || trimmed.includes("\n1. ")) {
        const items = trimmed.split(/\n\d+\.\s+/).filter(Boolean);
        return `<ol class="list-decimal pl-5 space-y-1.5 my-4 text-[#F3F4F6] marker:text-[#d9b45c]">\n${items.map(it => `  <li>${it.replace(/^\d+\.\s+/, "")}</li>`).join("\n")}\n</ol>`;
      }

      const withBreaks = trimmed.replace(/\n/g, "<br />");
      return `<p>${withBreaks}</p>`;
    }).filter(Boolean);

    return formatted.join("\n\n");
  };

  const handleAutoFormatText = () => {
    if (!currentPost || !currentPost.content) {
      showToast("No content to format.");
      return;
    }
    const formatted = autoFormatContentToHTML(currentPost.content);
    handleUpdateField("content", formatted);
    pushHistory(formatted);
    showToast("Formatted plain text into structured HTML paragraphs & headings!");
  };

  // Heading Formatter tool
  const applyHeading = (level: "h2" | "h3" | "h4" | "p") => {
    if (!currentPost) return;
    const textarea = document.getElementById("gutenberg-content-textarea") as HTMLTextAreaElement | null;
    const content = currentPost.content || "";

    if (textarea && textarea.selectionStart !== undefined && textarea.selectionEnd !== undefined && textarea.selectionStart !== textarea.selectionEnd) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end).trim();
      const openTag = `<${level}>`;
      const closeTag = `</${level}>`;
      const newContent = content.substring(0, start) + `\n${openTag}${selectedText}${closeTag}\n` + content.substring(end);
      handleUpdateField("content", newContent);
      pushHistory(newContent);
      showToast(`Applied <${level}> to selected heading`);
    } else {
      const defaultHeading = level === "h2" ? "Main Section Heading" : level === "h3" ? "Sub-section Heading" : level === "h4" ? "Minor Topic" : "Paragraph text here";
      const newContent = content + `\n\n<${level}>${defaultHeading}</${level}>\n\n`;
      handleUpdateField("content", newContent);
      pushHistory(newContent);
      showToast(`Inserted <${level}> block`);
    }
  };

  // Call-to-Action (CTA) Button Inserter
  const handleInsertCta = (position: "cursor" | "bottom" = "cursor") => {
    if (!currentPost) return;
    
    let iconSvg = "";
    if (ctaIcon === "arrow") {
      iconSvg = `<svg class="w-4 h-4 ml-2 inline-block shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>`;
    } else if (ctaIcon === "whatsapp") {
      iconSvg = `<svg class="w-4 h-4 mr-2 inline-block shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>`;
    } else if (ctaIcon === "phone") {
      iconSvg = `<svg class="w-4 h-4 mr-2 inline-block shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>`;
    } else if (ctaIcon === "sparkles") {
      iconSvg = `<span class="mr-2">✨</span>`;
    } else if (ctaIcon === "book") {
      iconSvg = `<span class="mr-2">📖</span>`;
    }

    let buttonClasses = "";
    if (ctaStyle === "gold") {
      buttonClasses = "inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#d9b45c] to-[#f2d98a] text-black font-extrabold text-sm md:text-base shadow-xl hover:scale-105 transition-all transform no-underline border border-[#d9b45c]";
    } else if (ctaStyle === "royal") {
      buttonClasses = "inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-[#1c202b] hover:bg-[#252b3b] text-[#f2d98a] border-2 border-[#d9b45c] font-extrabold text-sm md:text-base shadow-xl hover:scale-105 transition-all transform no-underline";
    } else if (ctaStyle === "whatsapp") {
      buttonClasses = "inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm md:text-base shadow-xl hover:scale-105 transition-all transform no-underline border border-emerald-400";
    } else if (ctaStyle === "outline") {
      buttonClasses = "inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-transparent hover:bg-[#d9b45c]/20 text-[#f2d98a] border-2 border-[#d9b45c] font-bold text-sm md:text-base transition-all no-underline";
    }

    let alignClass = "text-center";
    if (ctaAlignment === "left") alignClass = "text-left";
    else if (ctaAlignment === "right") alignClass = "text-right";
    else if (ctaAlignment === "full") alignClass = "text-center w-full";

    let ctaHtml = "";
    if (ctaStyle === "banner") {
      ctaHtml = `\n<div class="cta-button-block my-10 p-6 md:p-8 bg-gradient-to-br from-[#12141b] to-[#07080b] border border-[#d9b45c]/30 rounded-2xl text-center space-y-4 shadow-2xl">\n  <h3 class="font-serif text-xl md:text-2xl text-[#f3ecd8] font-bold">${ctaButtonText}</h3>\n  ${ctaSubtitle ? `<p class="text-xs md:text-sm text-[#c9c2ab] max-w-lg mx-auto leading-relaxed">${ctaSubtitle}</p>` : ''}\n  <div>\n    <a href="${ctaLinkUrl}" ${ctaOpenNewTab ? 'target="_blank" rel="noopener noreferrer"' : ''} class="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-[#d9b45c] hover:bg-[#f2d98a] text-black font-extrabold text-sm md:text-base shadow-xl hover:scale-105 transition-all transform no-underline border border-[#d9b45c]">\n      <span>Enroll / Book Free Trial Now</span>\n      <svg class="w-4 h-4 ml-2 inline-block" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>\n    </a>\n  </div>\n</div>\n`;
    } else {
      ctaHtml = `\n<div class="cta-button-block my-8 ${alignClass}">\n  <a href="${ctaLinkUrl}" ${ctaOpenNewTab ? 'target="_blank" rel="noopener noreferrer"' : ''} class="${buttonClasses} ${ctaAlignment === 'full' ? 'w-full' : ''}">\n    ${iconSvg}\n    <span>${ctaButtonText}</span>\n  </a>\n  ${ctaSubtitle ? `<p class="text-xs text-[#c9c2ab] mt-2 italic">${ctaSubtitle}</p>` : ''}\n</div>\n`;
    }

    let newContent = "";
    if (position === "bottom") {
      newContent = `${currentPost.content || ""}\n\n${ctaHtml}`;
    } else {
      const textarea = document.getElementById("gutenberg-content-textarea") as HTMLTextAreaElement | null;
      if (textarea && textarea.selectionStart !== undefined) {
        const pos = textarea.selectionStart;
        const content = currentPost.content || "";
        newContent = content.substring(0, pos) + `\n\n${ctaHtml}\n\n` + content.substring(pos);
      } else {
        newContent = `${currentPost.content || ""}\n\n${ctaHtml}`;
      }
    }

    handleUpdateField("content", newContent);
    pushHistory(newContent);
    setShowCtaModal(false);
    showToast("CTA Button inserted into article!");
  };

  // Insert Styled Table
  const handleInsertTable = () => {
    if (!currentPost) return;
    
    let html = `<div class="table-responsive my-6 overflow-x-auto">\n<table class="w-full border-collapse border border-[#d9b45c]/30 rounded-xl overflow-hidden text-xs md:text-sm bg-[#12141b]/90 text-left shadow-lg">\n  <thead>\n    <tr class="bg-[#181b24] border-b border-[#d9b45c]/30">\n`;
    
    for (let c = 0; c < tableCols; c++) {
      const headerTitle = tableHeaders[c] || `Column ${c + 1}`;
      html += `      <th class="p-3.5 font-serif font-bold text-[#f2d98a] border-r border-white/10 uppercase tracking-wider text-xs">${headerTitle}</th>\n`;
    }
    html += `    </tr>\n  </thead>\n  <tbody class="divide-y divide-white/5">\n`;
    
    for (let r = 1; r <= tableRows; r++) {
      html += `    <tr class="hover:bg-white/[0.04] transition-colors">\n`;
      for (let c = 0; c < tableCols; c++) {
        let cellText = `Sample Data ${r}-${c + 1}`;
        if (tablePreset === "comparison") {
          if (c === 0) cellText = ["Live 1-on-1 Classes", "Certified Jamia Scholars", "Flexible Scheduling", "Tajweed & Makharij Rules"][r - 1] || `Feature ${r}`;
          else if (c === 1) cellText = ["Basic", "Yes", "Limited", "Basic Rules"][r - 1] || "Available";
          else cellText = ["Comprehensive", "Senior Scholars", "24/7 Schedule", "Complete Practical Tajweed"][r - 1] || "Full Access";
        } else if (tablePreset === "pricing") {
          if (c === 0) cellText = ["Quran Tajweed Course", "Hifz Quran Program", "Islamic Studies"][r - 1] || `Course ${r}`;
          else if (c === 1) cellText = ["$40 / Month", "$60 / Month", "$35 / Month"][r - 1] || "$50";
          else cellText = ["3 Classes / Week", "5 Classes / Week", "2 Classes / Week"][r - 1] || "30 Mins / Class";
        } else if (tablePreset === "schedule") {
          if (c === 0) cellText = ["Monday - Wednesday", "Tuesday - Thursday", "Saturday - Sunday"][r - 1] || `Day ${r}`;
          else if (c === 1) cellText = ["Morning / Evening", "Flexible Slot", "Weekend Special"][r - 1] || "Slot";
          else cellText = ["Quran Reading & Tajweed", "Hifz & Revision", "Arabic Grammar"][r - 1] || "Subject";
        }
        html += `      <td class="p-3.5 text-[#F3F4F6] border-r border-white/5 last:border-r-0">${cellText}</td>\n`;
      }
      html += `    </tr>\n`;
    }
    html += `  </tbody>\n</table>\n</div>\n`;

    const textarea = document.getElementById("gutenberg-content-textarea") as HTMLTextAreaElement | null;
    let newContent = "";
    if (textarea && textarea.selectionStart !== undefined) {
      const pos = textarea.selectionStart;
      const content = currentPost.content || "";
      newContent = content.substring(0, pos) + `\n\n${html}\n\n` + content.substring(pos);
    } else {
      newContent = `${currentPost.content || ""}\n\n${html}`;
    }

    handleUpdateField("content", newContent);
    pushHistory(newContent);
    setShowTableModal(false);
    showToast("Table inserted into article!");
  };

  // Formatting tools
  const applyFormattingToSelection = (openTag: string, closeTag: string, defaultText = "formatted text") => {
    if (!currentPost) return;
    const textarea = document.getElementById("gutenberg-content-textarea") as HTMLTextAreaElement | null;
    const content = currentPost.content || "";

    if (textarea && textarea.selectionStart !== undefined && textarea.selectionEnd !== undefined && textarea.selectionStart !== textarea.selectionEnd) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      const newContent = content.substring(0, start) + openTag + selectedText + closeTag + content.substring(end);
      handleUpdateField("content", newContent);
      pushHistory(newContent);
    } else {
      const newContent = content + `\n${openTag}${defaultText}${closeTag}`;
      handleUpdateField("content", newContent);
      pushHistory(newContent);
    }
  };

  // Drag and drop image file handling
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith("image/")) {
        showToast("Please drop an image file.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const dataUrl = uploadEvent.target?.result as string;
        if (dataUrl) {
          const imgHtml = `<p><img src="${dataUrl}" alt="Uploaded Image" class="w-full rounded-2xl border border-[#d9b45c]/30 my-6 shadow-2xl" /></p>`;
          const newContent = `${currentPost?.content || ""}\n${imgHtml}`;
          handleUpdateField("content", newContent);
          pushHistory(newContent);
          showToast("Image inserted into article!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Run AI Writing Helper
  const handleRunAiAssistant = async () => {
    if (!currentPost) return;
    setAiLoading(true);
    setAiResult(null);

    const textToProcess = currentPost.content || "";
    const cleanText = textToProcess.replace(/<[^>]*>/g, " ").trim();

    try {
      const res = await fetch("/api/ai/writing-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: aiAction,
          text: cleanText,
          title: currentPost.title,
          keyword: currentPost.focusKeyword,
          prompt: aiCustomPrompt
        })
      });
      const data = await res.json();
      if (data.success && data.result) {
        setAiResult(data.result);
      } else {
        setAiResult("Failed to generate AI response. Please try again.");
      }
    } catch (err) {
      setAiResult("AI Service unavailable. Check network or server configuration.");
    } finally {
      setAiLoading(false);
    }
  };

  // Apply AI result
  const handleApplyAiResult = (target: "replace_content" | "append_content" | "meta_title" | "meta_desc") => {
    if (!aiResult || !currentPost) return;

    if (target === "replace_content") {
      const formatted = aiResult.includes("<p>") ? aiResult : `<p class="my-4 text-xs md:text-sm text-[#c9c2ab] leading-relaxed">${aiResult.replace(/\n\n/g, "</p><p class='my-4 text-xs md:text-sm text-[#c9c2ab] leading-relaxed'>")}</p>`;
      handleUpdateField("content", formatted);
      pushHistory(formatted);
      showToast("Content updated with AI response!");
    } else if (target === "append_content") {
      const formatted = aiResult.includes("<p>") ? aiResult : `<p class="my-4 text-xs md:text-sm text-[#c9c2ab] leading-relaxed">${aiResult.replace(/\n\n/g, "</p><p class='my-4 text-xs md:text-sm text-[#c9c2ab] leading-relaxed'>")}</p>`;
      const newContent = `${currentPost.content || ""}\n${formatted}`;
      handleUpdateField("content", newContent);
      pushHistory(newContent);
      showToast("AI content appended to article!");
    } else if (target === "meta_title") {
      handleUpdateField("metaTitle", aiResult.replace(/^["']|["']$/g, "").slice(0, 60));
      showToast("Meta title updated!");
    } else if (target === "meta_desc") {
      handleUpdateField("metaDescription", aiResult.replace(/^["']|["']$/g, "").slice(0, 160));
      showToast("Meta description updated!");
    }
    setShowAiModal(false);
  };

  // Featured Image Cropper Studio Export
  const handleApplyCropAndOptimize = () => {
    const imgSrc = pendingCropImage || currentPost?.coverImage;
    if (!imgSrc) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgSrc;
    img.onload = () => {
      const targetWidth = 1200;
      const targetHeight = 800;

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.filter = `brightness(${cropBrightness}%) contrast(${cropContrast}%) saturate(${cropSaturation}%)`;
      ctx.fillStyle = "#07080b";
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      const drawWidth = targetWidth * cropScale;
      const drawHeight = targetHeight * cropScale;
      const offsetX = (targetWidth - drawWidth) / 2 + (cropPanX / 100) * targetWidth;
      const offsetY = (targetHeight - drawHeight) / 2 + (cropPanY / 100) * targetHeight;

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      const optimizedDataUrl = canvas.toDataURL("image/jpeg", 0.9);
      handleUpdateField("coverImage", optimizedDataUrl);
      handleUpdateField("featuredImage", optimizedDataUrl);

      setShowCropModal(false);
      setPendingCropImage(null);
      showToast("Featured image cropped & optimized to 1200 × 800 px (3:2 Ratio)!");
    };
  };

  if (!currentPost) {
    return (
      <div className="p-8 text-center text-[#c9c2ab]">
        <p>No articles found.</p>
        <button onClick={handleCreateNewPost} className="mt-4 px-4 py-2 bg-[#d9b45c] text-black font-bold rounded-xl">
          Create First Article
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080b] text-[#f3ecd8] font-sans pb-16">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 bg-[#d9b45c] text-black font-bold text-xs rounded-xl shadow-2xl flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP HEADER BAR - GUTENBERG STYLE */}
      <header className="sticky top-0 z-40 bg-[#0e1017]/95 backdrop-blur-md border-b border-[#d9b45c]/20 px-4 py-2.5 flex items-center justify-between shadow-xl">
        
        {/* Left: Article Switcher & Brand Indicator */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-[#12141b] border border-[#d9b45c]/30 rounded-xl px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-[#d9b45c] animate-pulse"></span>
            <select
              value={selectedPostId}
              onChange={(e) => setSelectedPostId(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#f2d98a] border-none outline-none cursor-pointer max-w-[200px] truncate"
            >
              {posts.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#12141b] text-white">
                  {p.title || "Untitled Draft"} ({p.status})
                </option>
              ))}
              <option value="new" className="bg-[#12141b] text-[#d9b45c]">
                + Create New Post
              </option>
            </select>
          </div>

          <span className="hidden sm:inline-block text-[11px] text-[#c9c2ab]/70 font-mono">
            {isAutoSaving ? "Saving..." : isDirty ? "Unsaved changes" : lastSavedTime}
          </span>
        </div>

        {/* Right: PRIMARY ACTION BUTTONS ONLY */}
        <div className="flex items-center space-x-2">
          
          {/* New Post */}
          <button
            type="button"
            onClick={handleCreateNewPost}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-[#12141b] border border-white/10 rounded-xl text-xs font-bold hover:border-[#d9b45c]/50 hover:text-white transition-all"
            title="Create New Blank Post"
          >
            <Plus size={14} className="text-[#d9b45c]" />
            <span>New Post</span>
          </button>

          {/* Save Draft */}
          <button
            type="button"
            onClick={() => handleSaveArticle("draft")}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#12141b] border border-[#d9b45c]/30 rounded-xl text-xs font-bold text-[#f2d98a] hover:bg-[#d9b45c]/10 transition-all"
          >
            <Save size={14} />
            <span className="hidden sm:inline">Save Draft</span>
          </button>

          {/* Preview */}
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#12141b] border border-white/10 rounded-xl text-xs font-bold text-[#c9c2ab] hover:text-white hover:border-white/30 transition-all"
          >
            <Eye size={14} />
            <span className="hidden sm:inline">Preview</span>
          </button>

          {/* Publish / Update (PRIMARY GOLD BUTTON) */}
          <button
            type="button"
            onClick={() => handleSaveArticle("published")}
            className="flex items-center space-x-1.5 px-4 py-1.5 bg-gradient-to-r from-[#f2d98a] to-[#d9b45c] text-black font-extrabold text-xs rounded-xl shadow-lg hover:brightness-110 transition-all"
          >
            <Globe size={14} />
            <span>{currentPost.status === "published" ? "Update Article" : "Publish Live"}</span>
          </button>

          {/* View Live Post */}
          <a
            href={`/blog/${currentPost.slug || currentPost.id}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleSaveArticle(currentPost.status || "published", true)}
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 bg-[#12141b] border border-emerald-500/30 rounded-xl text-xs font-bold text-emerald-400 hover:bg-emerald-500/10 transition-all"
            title="View Live Article Page"
          >
            <ExternalLink size={14} />
            <span>View Live</span>
          </a>

          {/* More Options (...) Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-1.5 bg-[#12141b] border border-white/10 rounded-xl text-[#c9c2ab] hover:text-white"
            >
              <MoreVertical size={16} />
            </button>

            {showMoreMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-[#12141b] border border-[#d9b45c]/30 rounded-xl shadow-2xl p-2 z-50 space-y-1">
                <button
                  onClick={() => {
                    setEditorMode(editorMode === "visual" ? "code" : "visual");
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-[#c9c2ab] hover:text-white hover:bg-white/5 rounded-lg flex items-center space-x-2"
                >
                  <FileCode size={14} />
                  <span>Switch to {editorMode === "visual" ? "HTML Code Editor" : "Visual Editor"}</span>
                </button>

                <div className="border-t border-white/10 my-1"></div>

                <div className="px-3 py-1.5 text-[10px] font-bold text-[#d9b45c] uppercase">Preview Device Frame</div>
                <div className="flex items-center justify-around p-1 bg-[#07080b] rounded-lg">
                  <button
                    onClick={() => setDeviceFrame("desktop")}
                    className={`p-1.5 rounded ${deviceFrame === "desktop" ? "bg-[#d9b45c] text-black" : "text-[#c9c2ab]"}`}
                    title="Desktop View"
                  >
                    <Monitor size={14} />
                  </button>
                  <button
                    onClick={() => setDeviceFrame("tablet")}
                    className={`p-1.5 rounded ${deviceFrame === "tablet" ? "bg-[#d9b45c] text-black" : "text-[#c9c2ab]"}`}
                    title="Tablet View"
                  >
                    <Tablet size={14} />
                  </button>
                  <button
                    onClick={() => setDeviceFrame("mobile")}
                    className={`p-1.5 rounded ${deviceFrame === "mobile" ? "bg-[#d9b45c] text-black" : "text-[#c9c2ab]"}`}
                    title="Mobile View"
                  >
                    <Smartphone size={14} />
                  </button>
                </div>

                <div className="border-t border-white/10 my-1"></div>

                <button
                  onClick={() => {
                    handleDeletePost();
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg flex items-center space-x-2"
                >
                  <Trash2 size={14} />
                  <span>Delete Article</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* 2. MAIN CONTAINER GRID (LEFT EDITING CANVAS + RIGHT STICKY SIDEBAR) */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: MAIN CONTENT EDITING CANVAS (LG: COL-SPAN-8) */}
        <main className="lg:col-span-8 space-y-6">
          
          {/* ARTICLE TITLE FIELD */}
          <div className="bg-[#12141b] border border-[#d9b45c]/20 rounded-2xl p-6 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#d9b45c]">
                Article Post Title
              </label>
              <span className="text-[10px] font-mono text-[#c9c2ab]/70">
                {(currentPost.title || "").length} chars
              </span>
            </div>
            <input
              type="text"
              value={currentPost.title}
              onChange={(e) => handleUpdateField("title", e.target.value)}
              placeholder="Add title"
              className="w-full text-xl md:text-2xl font-serif font-bold text-white bg-transparent border-b border-white/10 hover:border-white/20 focus:border-[#d9b45c] pb-2.5 outline-none placeholder-white/30 transition-all tracking-tight"
            />

            {/* PERMALINK / URL SLUG BAR */}
            <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-[#c9c2ab]">
              <div className="flex items-center space-x-2 font-mono text-[11px] bg-[#07080b] px-3 py-1.5 rounded-xl border border-white/5 w-full sm:w-auto overflow-x-auto">
                <span className="text-white/40">https://truthquranacademy.com/blog/</span>
                <input
                  type="text"
                  value={currentPost.slug}
                  onChange={(e) => handleUpdateField("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                  placeholder="post-slug"
                  className="bg-transparent text-[#f2d98a] font-bold outline-none border-b border-transparent focus:border-[#d9b45c]"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  const fullUrl = `https://truthquranacademy.com/blog/${currentPost.slug || "article"}`;
                  navigator.clipboard.writeText(fullUrl);
                  showToast("Article URL copied to clipboard!");
                }}
                className="mt-2 sm:mt-0 px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] flex items-center space-x-1 text-[#f2d98a]"
              >
                <Copy size={12} />
                <span>Copy URL</span>
              </button>
            </div>
          </div>

          {/* RICH FORMATTING TOOLBAR & EDITOR CANVAS */}
          <div className="bg-[#12141b] border border-[#d9b45c]/20 rounded-2xl shadow-2xl overflow-hidden">
            
            {/* TOOLBAR */}
            <div className="bg-[#0e1017] border-b border-[#d9b45c]/20 p-3 flex flex-wrap items-center gap-2">
              
              {/* Heading Dropdown */}
              <select
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "p") applyFormattingToSelection("<p class='my-4 leading-relaxed text-[#F3F4F6]'>", "</p>");
                  else if (val === "h1") applyHeading("p");
                  else if (val === "h2") applyHeading("h2");
                  else if (val === "h3") applyHeading("h3");
                  else if (val === "h4") applyHeading("h4");
                }}
                className="bg-[#12141b] text-xs font-bold text-[#f2d98a] border border-[#d9b45c]/30 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer hover:border-[#d9b45c]"
              >
                <option value="p">¶ Paragraph</option>
                <option value="h2">H2 — Main Heading</option>
                <option value="h3">H3 — Sub Heading</option>
                <option value="h4">H4 — Small Topic</option>
              </select>

              {/* Direct Quick Heading 2 & Heading 3 Buttons */}
              <button
                type="button"
                onClick={() => applyHeading("h2")}
                className="px-2 py-1 bg-white/5 hover:bg-[#d9b45c]/20 text-[#f2d98a] hover:text-white border border-[#d9b45c]/30 rounded-lg text-xs font-serif font-bold transition-all"
                title="Heading 2 (H2) - Large Bold Section Title"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => applyHeading("h3")}
                className="px-2 py-1 bg-white/5 hover:bg-[#d9b45c]/20 text-[#f2d98a] hover:text-white border border-[#d9b45c]/30 rounded-lg text-xs font-serif font-bold transition-all"
                title="Heading 3 (H3) - Subsection Title"
              >
                H3
              </button>

              <div className="h-5 w-[1px] bg-white/10 my-auto"></div>

              {/* Formatting Buttons */}
              <button
                type="button"
                onClick={() => applyFormattingToSelection("<strong>", "</strong>")}
                className="p-1.5 bg-white/5 hover:bg-white/10 text-[#c9c2ab] hover:text-white rounded-lg"
                title="Bold (Ctrl+B)"
              >
                <Bold size={14} />
              </button>
              <button
                type="button"
                onClick={() => applyFormattingToSelection("<em>", "</em>")}
                className="p-1.5 bg-white/5 hover:bg-white/10 text-[#c9c2ab] hover:text-white rounded-lg"
                title="Italic (Ctrl+I)"
              >
                <Italic size={14} />
              </button>
              <button
                type="button"
                onClick={() => applyFormattingToSelection("<u>", "</u>")}
                className="p-1.5 bg-white/5 hover:bg-white/10 text-[#c9c2ab] hover:text-white rounded-lg"
                title="Underline (Ctrl+U)"
              >
                <Underline size={14} />
              </button>

              <div className="h-5 w-[1px] bg-white/10 my-auto"></div>

              {/* Lists & Quotes */}
              <button
                type="button"
                onClick={() => applyFormattingToSelection("<ul class='list-disc pl-5 space-y-1.5 my-4 text-[#F3F4F6] marker:text-[#d9b45c]'><li>", "</li></ul>")}
                className="p-1.5 bg-white/5 hover:bg-white/10 text-[#c9c2ab] hover:text-white rounded-lg"
                title="Bullet List"
              >
                <List size={14} />
              </button>
              <button
                type="button"
                onClick={() => applyFormattingToSelection("<ol class='list-decimal pl-5 space-y-1.5 my-4 text-[#F3F4F6] marker:text-[#d9b45c]'><li>", "</li></ol>")}
                className="p-1.5 bg-white/5 hover:bg-white/10 text-[#c9c2ab] hover:text-white rounded-lg"
                title="Numbered List"
              >
                <ListOrdered size={14} />
              </button>
              <button
                type="button"
                onClick={() => applyFormattingToSelection("<blockquote class='border-l-4 border-[#d9b45c] bg-[#12141b] p-4 my-6 rounded-r-xl italic text-[#f2d98a]'>", "</blockquote>")}
                className="p-1.5 bg-white/5 hover:bg-white/10 text-[#c9c2ab] hover:text-white rounded-lg"
                title="Quote Block"
              >
                <Quote size={14} />
              </button>

              <div className="h-5 w-[1px] bg-white/10 my-auto"></div>

              {/* Link (Golden Anchor Tag), Table, CTA Button, Image, HR */}
              <button
                type="button"
                onClick={() => {
                  const url = prompt("Enter Link URL:", "https://");
                  if (url) {
                    applyFormattingToSelection(`<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-[#FACC15] underline hover:text-[#EAB308] font-semibold">`, "</a>");
                  }
                }}
                className="p-1.5 bg-white/5 hover:bg-white/10 text-[#c9c2ab] hover:text-white rounded-lg"
                title="Insert Hyperlink (Gold #FACC15)"
              >
                <Link2 size={14} />
              </button>
              <button
                type="button"
                onClick={() => setShowTableModal(true)}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-[#f2d98a] hover:text-white border border-[#d9b45c]/30 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all"
                title="Insert Comparison or Data Table"
              >
                <TableIcon size={14} />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => setShowCtaModal(true)}
                className="px-2.5 py-1 bg-gradient-to-r from-[#d9b45c]/20 to-[#f2d98a]/20 hover:from-[#d9b45c]/30 hover:to-[#f2d98a]/30 text-[#f2d98a] hover:text-white border border-[#d9b45c]/50 hover:border-[#d9b45c] rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
                title="Insert Call-to-Action (CTA) Button"
              >
                <MousePointerClick size={14} className="text-[#d9b45c]" />
                <span>CTA Button</span>
              </button>
              <button
                type="button"
                onClick={handleAutoFormatText}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-[#c9c2ab] hover:text-[#f2d98a] border border-white/10 hover:border-[#d9b45c]/40 rounded-lg text-xs font-medium flex items-center space-x-1 transition-all"
                title="Auto-format plain text into structured HTML paragraphs & headings"
              >
                <Sparkles size={13} className="text-[#d9b45c]" />
                <span>Auto-Format</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMediaTargetField("internal");
                  setShowMediaLibraryModal(true);
                }}
                className="p-1.5 bg-white/5 hover:bg-white/10 text-[#c9c2ab] hover:text-white rounded-lg"
                title="Insert Image"
              >
                <ImageIcon size={14} />
              </button>
              <button
                type="button"
                onClick={() => applyFormattingToSelection("<hr class='border-[#d9b45c]/30 my-8' />", "")}
                className="p-1.5 bg-white/5 hover:bg-white/10 text-[#c9c2ab] hover:text-white rounded-lg"
                title="Horizontal Rule"
              >
                <Minus size={14} />
              </button>

              <div className="h-5 w-[1px] bg-white/10 my-auto"></div>

              {/* Undo / Redo */}
              <button
                type="button"
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-1.5 bg-white/5 hover:bg-white/10 text-[#c9c2ab] disabled:opacity-30 rounded-lg"
                title="Undo"
              >
                <RotateCcw size={14} />
              </button>
              <button
                type="button"
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-1.5 bg-white/5 hover:bg-white/10 text-[#c9c2ab] disabled:opacity-30 rounded-lg"
                title="Redo"
              >
                <RefreshCw size={14} />
              </button>

              <div className="flex-1"></div>

              {/* DIRECT VISUAL / CODE (HTML) / SPLIT / PREVIEW SWITCHERS */}
              <div className="flex items-center space-x-1 bg-[#12141b] border border-[#d9b45c]/30 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => {
                    setViewLayoutMode("editor");
                    setEditorMode("visual");
                  }}
                  className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-lg transition-all flex items-center space-x-1 ${
                    viewLayoutMode === "editor" && editorMode === "visual"
                      ? "bg-[#d9b45c] text-black shadow-sm"
                      : "text-[#c9c2ab] hover:text-white"
                  }`}
                  title="Visual WYSIWYG Editor"
                >
                  <Eye size={12} />
                  <span>Visual</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setViewLayoutMode("editor");
                    setEditorMode("code");
                  }}
                  className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-lg transition-all flex items-center space-x-1 ${
                    viewLayoutMode === "editor" && editorMode === "code"
                      ? "bg-[#d9b45c] text-black shadow-sm"
                      : "text-[#c9c2ab] hover:text-white"
                  }`}
                  title="Raw HTML Code Editor"
                >
                  <FileCode size={12} />
                  <span>Code (HTML)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewLayoutMode("split")}
                  className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-lg transition-all flex items-center space-x-1 ${
                    viewLayoutMode === "split" ? "bg-[#d9b45c] text-black shadow-sm" : "text-[#c9c2ab] hover:text-white"
                  }`}
                  title="Side-by-Side Live Preview"
                >
                  <Columns size={12} />
                  <span>Split</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewLayoutMode("preview")}
                  className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-lg transition-all flex items-center space-x-1 ${
                    viewLayoutMode === "preview" ? "bg-[#d9b45c] text-black shadow-sm" : "text-[#c9c2ab] hover:text-white"
                  }`}
                  title="Full Live Article Preview"
                >
                  <Globe size={12} />
                  <span>Live View</span>
                </button>
              </div>

              {/* AI WRITING ASSISTANT BUTTON */}
              <button
                type="button"
                onClick={() => setShowAiModal(true)}
                className="px-3 py-1.5 bg-gradient-to-r from-[#d9b45c]/20 to-[#f2d98a]/20 border border-[#d9b45c]/50 hover:border-[#d9b45c] text-[#f2d98a] font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-md hover:scale-105 transition-all"
              >
                <Sparkles size={14} className="text-[#d9b45c] animate-spin" />
                <span>AI Assistant ✨</span>
              </button>

            </div>

            {/* MAIN CONTENT CANVAS / SIDE-BY-SIDE SPLIT PREVIEW */}
            {viewLayoutMode === "preview" ? (
              /* FULL LIVE ARTICLE PREVIEW */
              <div className="p-6 bg-[#07080b] border border-[#d9b45c]/20 rounded-b-2xl space-y-6 max-h-[650px] overflow-y-auto">
                <div className="border-b border-white/10 pb-4">
                  <span className="text-[10px] font-bold text-[#d9b45c] uppercase tracking-wider">{currentPost.category || "Tajweed Rules"}</span>
                  <h1 className="text-2xl md:text-3xl font-serif font-bold text-white mt-1">{currentPost.title || "Untitled Article"}</h1>
                  <p className="text-xs text-[#F3F4F6]/70 mt-2 italic">{currentPost.excerpt || cleanHTMLToExcerpt(currentPost.content, "")}</p>
                </div>
                {(currentPost.coverImage || currentPost.featuredImage) && (
                  <img
                    src={currentPost.coverImage || currentPost.featuredImage}
                    alt={currentPost.imageAltText || "Featured"}
                    className="w-full aspect-video object-cover rounded-2xl border border-white/10"
                  />
                )}
                <div
                  className="prose prose-invert max-w-none text-xs md:text-sm text-[#F3F4F6] leading-relaxed font-sans
                    [&>h1]:font-serif [&>h1]:text-2xl [&>h1]:md:text-3xl [&>h1]:text-white [&>h1]:font-bold [&>h1]:mt-8 [&>h1]:mb-4
                    [&>h2]:font-serif [&>h2]:text-xl [&>h2]:md:text-2xl [&>h2]:text-white [&>h2]:font-bold [&>h2]:border-b [&>h2]:border-[#d9b45c]/30 [&>h2]:pb-2 [&>h2]:mt-8 [&>h2]:mb-4
                    [&_h2]:font-serif [&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:text-white [&_h2]:font-bold [&_h2]:border-b [&_h2]:border-[#d9b45c]/30 [&_h2]:pb-2 [&_h2]:mt-8 [&_h2]:mb-4
                    [&>h3]:font-serif [&>h3]:text-lg [&>h3]:md:text-xl [&>h3]:text-[#f2d98a] [&>h3]:font-bold [&>h3]:mt-6 [&>h3]:mb-3
                    [&_h3]:font-serif [&_h3]:text-lg [&_h3]:md:text-xl [&_h3]:text-[#f2d98a] [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-3
                    [&>h4]:font-serif [&>h4]:text-base [&>h4]:md:text-lg [&>h4]:text-[#f3ecd8] [&>h4]:font-semibold [&>h4]:mt-5 [&>h4]:mb-2
                    [&_h4]:font-serif [&_h4]:text-base [&_h4]:md:text-lg [&_h4]:text-[#f3ecd8] [&_h4]:font-semibold [&_h4]:mt-5 [&_h4]:mb-2
                    [&>p]:mb-4 [&>p]:leading-relaxed [&>p]:text-[#F3F4F6] [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-[#F3F4F6]
                    [&>ul]:my-4 [&>ul]:pl-5 [&>ul]:space-y-1.5 [&>ul>li]:list-disc [&>ul>li]:marker:text-[#d9b45c] [&>ul>li]:text-[#F3F4F6]
                    [&>ol]:my-4 [&>ol]:pl-5 [&>ol]:space-y-1.5 [&>ol>li]:list-decimal [&>ol>li]:marker:text-[#d9b45c] [&>ol>li]:text-[#F3F4F6]
                    [&>blockquote]:my-6 [&>blockquote]:p-4 [&>blockquote]:bg-[#12141b] [&>blockquote]:border-l-4 [&>blockquote]:border-[#d9b45c] [&>blockquote]:italic [&>blockquote]:text-[#f2d98a] [&>blockquote]:rounded-r-xl
                    [&_table]:w-full [&_table]:my-6 [&_table]:border-collapse [&_table]:border [&_table]:border-[#d9b45c]/30 [&_table]:rounded-xl [&_table]:overflow-hidden [&_table]:text-xs [&_table]:md:text-sm [&_table]:bg-[#12141b]/90 [&_table]:text-left [&_table]:shadow-lg
                    [&_th]:bg-[#1c202b] [&_th]:text-[#f2d98a] [&_th]:font-serif [&_th]:font-bold [&_th]:p-3.5 [&_th]:border-b [&_th]:border-[#d9b45c]/30 [&_th]:border-r [&_th]:border-white/10 [&_th]:uppercase [&_th]:tracking-wider [&_th]:text-xs
                    [&_td]:p-3.5 [&_td]:text-xs [&_td]:md:text-sm [&_td]:text-[#F3F4F6] [&_td]:border-b [&_td]:border-white/5 [&_td]:border-r [&_td]:border-white/5
                    [&_tr:hover]:bg-white/[0.04] [&_tr:hover]:transition-colors
                    [&_.cta-button-block]:my-8 [&_.cta-button-block_a]:no-underline [&_.cta-button-block_a]:hover:no-underline
                    [&>a]:text-[#FACC15] [&>a]:underline [&>a]:hover:text-[#EAB308] [&>a]:font-semibold
                    [&_a]:text-[#FACC15] [&_a]:underline [&_a]:hover:text-[#EAB308] [&_a]:font-semibold"
                  dangerouslySetInnerHTML={{ __html: formatContentForPreview(currentPost.content) }}
                />
              </div>
            ) : viewLayoutMode === "split" ? (
              /* SIDE-BY-SIDE SPLIT PREVIEW */
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 bg-[#07080b]">
                {/* LEFT: TEXTAREA EDITOR */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingOver(true);
                  }}
                  onDragLeave={() => setIsDraggingOver(false)}
                  onDrop={handleFileDrop}
                  className={`relative p-4 transition-all ${isDraggingOver ? "bg-[#d9b45c]/10 ring-2 ring-[#d9b45c]" : ""}`}
                >
                  {isDraggingOver && (
                    <div className="absolute inset-0 z-30 bg-[#0e1017]/90 backdrop-blur-sm flex flex-col items-center justify-center border-2 border-dashed border-[#d9b45c] rounded-xl text-[#f2d98a]">
                      <Upload size={36} className="animate-bounce" />
                      <p className="mt-2 text-sm font-bold">Drop Image to Upload & Insert</p>
                    </div>
                  )}
                  <textarea
                    id="gutenberg-content-textarea"
                    value={currentPost.content}
                    onChange={(e) => {
                      handleUpdateField("content", e.target.value);
                      pushHistory(e.target.value);
                    }}
                    placeholder="Write article content in English or HTML..."
                    rows={22}
                    className="w-full bg-transparent text-xs md:text-sm text-white font-mono leading-relaxed p-2 outline-none resize-y"
                  ></textarea>
                </div>

                {/* RIGHT: REAL-TIME LIVE RENDERED PREVIEW */}
                <div className="p-4 bg-[#0e1017]/80 overflow-y-auto max-h-[580px] space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#d9b45c]">Real-time Live Preview</span>
                    <span className="text-[10px] font-mono text-[#c9c2ab]">Truth Quran Theme</span>
                  </div>
                  <h2 className="text-lg font-serif font-bold text-white">{currentPost.title || "Article Title Preview"}</h2>
                  {(currentPost.coverImage || currentPost.featuredImage) && (
                    <img
                      src={currentPost.coverImage || currentPost.featuredImage}
                      alt="Featured"
                      className="w-full h-36 object-cover rounded-xl border border-white/10"
                    />
                  )}
                  <div
                    className="prose prose-invert max-w-none text-xs text-[#F3F4F6] leading-relaxed font-sans
                      [&>h1]:font-serif [&>h1]:text-xl [&>h1]:text-white [&>h1]:font-bold [&>h1]:mt-5 [&>h1]:mb-2
                      [&>h2]:font-serif [&>h2]:text-base [&>h2]:text-white [&>h2]:font-bold [&>h2]:border-b [&>h2]:border-[#d9b45c]/25 [&>h2]:pb-1 [&>h2]:mt-5 [&>h2]:mb-2
                      [&_h2]:font-serif [&_h2]:text-base [&_h2]:text-white [&_h2]:font-bold [&_h2]:border-b [&_h2]:border-[#d9b45c]/25 [&_h2]:pb-1 [&_h2]:mt-5 [&_h2]:mb-2
                      [&>h3]:font-serif [&>h3]:text-sm [&>h3]:text-[#f2d98a] [&>h3]:font-bold [&>h3]:mt-4 [&>h3]:mb-2
                      [&_h3]:font-serif [&_h3]:text-sm [&_h3]:text-[#f2d98a] [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2
                      [&>h4]:font-serif [&>h4]:text-xs [&>h4]:text-[#f3ecd8] [&>h4]:font-semibold [&>h4]:mt-3 [&>h4]:mb-1
                      [&_h4]:font-serif [&_h4]:text-xs [&_h4]:text-[#f3ecd8] [&_h4]:font-semibold [&_h4]:mt-3 [&_h4]:mb-1
                      [&>p]:mb-3 [&>p]:text-[#F3F4F6] [&_p]:mb-3 [&_p]:text-[#F3F4F6]
                      [&>ul]:my-3 [&>ul]:pl-4 [&>ul>li]:list-disc [&>ul>li]:marker:text-[#d9b45c] [&>ul>li]:text-[#F3F4F6]
                      [&>ol]:my-3 [&>ol]:pl-4 [&>ol>li]:list-decimal [&>ol>li]:marker:text-[#d9b45c] [&>ol>li]:text-[#F3F4F6]
                      [&>blockquote]:my-4 [&>blockquote]:p-3 [&>blockquote]:bg-[#12141b] [&>blockquote]:border-l-2 [&>blockquote]:border-[#d9b45c] [&>blockquote]:italic [&>blockquote]:text-[#f2d98a]
                      [&_table]:w-full [&_table]:my-4 [&_table]:border-collapse [&_table]:border [&_table]:border-[#d9b45c]/30 [&_table]:rounded-xl [&_table]:overflow-hidden [&_table]:text-xs [&_table]:bg-[#12141b]/90 [&_table]:text-left
                      [&_th]:bg-[#1c202b] [&_th]:text-[#f2d98a] [&_th]:font-serif [&_th]:font-bold [&_th]:p-2.5 [&_th]:border-b [&_th]:border-[#d9b45c]/30 [&_th]:border-r [&_th]:border-white/10 [&_th]:text-xs
                      [&_td]:p-2.5 [&_td]:text-xs [&_td]:text-[#F3F4F6] [&_td]:border-b [&_td]:border-white/5 [&_td]:border-r [&_td]:border-white/5
                      [&_.cta-button-block]:my-4 [&_.cta-button-block_a]:no-underline
                      [&>a]:text-[#FACC15] [&>a]:underline [&>a]:hover:text-[#EAB308] [&>a]:font-semibold
                      [&_a]:text-[#FACC15] [&_a]:underline [&_a]:hover:text-[#EAB308] [&_a]:font-semibold"
                    dangerouslySetInnerHTML={{ __html: formatContentForPreview(currentPost.content) }}
                  />
                </div>
              </div>
            ) : editorMode === "code" ? (
              /* RAW HTML CODE EDITOR MODE */
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingOver(true);
                }}
                onDragLeave={() => setIsDraggingOver(false)}
                onDrop={handleFileDrop}
                className={`relative p-4 transition-all ${isDraggingOver ? "bg-[#d9b45c]/10 ring-2 ring-[#d9b45c]" : "bg-[#07080b]"}`}
              >
                {isDraggingOver && (
                  <div className="absolute inset-0 z-30 bg-[#0e1017]/90 backdrop-blur-sm flex flex-col items-center justify-center border-2 border-dashed border-[#d9b45c] rounded-xl text-[#f2d98a]">
                    <Upload size={36} className="animate-bounce" />
                    <p className="mt-2 text-sm font-bold">Drop Image to Upload & Insert into Article</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-[10px] text-[#d9b45c] font-mono pb-2 border-b border-white/5">
                  <span>HTML Source Editor (Preserves All Tags)</span>
                  <span className="text-white/40">UTF-8 / Raw Markup</span>
                </div>

                <textarea
                  id="gutenberg-content-textarea"
                  value={currentPost.content}
                  onChange={(e) => {
                    handleUpdateField("content", e.target.value);
                    pushHistory(e.target.value);
                  }}
                  placeholder="<h2>Article Subheading</h2><p>Write your HTML or formatted English article here...</p>"
                  rows={20}
                  className="w-full bg-transparent text-xs md:text-sm text-emerald-300 font-mono leading-relaxed p-2 outline-none resize-y"
                ></textarea>
              </div>
            ) : (
              /* VISUAL EDITOR MODE */
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingOver(true);
                }}
                onDragLeave={() => setIsDraggingOver(false)}
                onDrop={handleFileDrop}
                className={`relative p-5 transition-all ${isDraggingOver ? "bg-[#d9b45c]/10 ring-2 ring-[#d9b45c]" : "bg-[#07080b]"}`}
              >
                {isDraggingOver && (
                  <div className="absolute inset-0 z-30 bg-[#0e1017]/90 backdrop-blur-sm flex flex-col items-center justify-center border-2 border-dashed border-[#d9b45c] rounded-xl text-[#f2d98a]">
                    <Upload size={36} className="animate-bounce" />
                    <p className="mt-2 text-sm font-bold">Drop Image to Upload & Insert into Article</p>
                  </div>
                )}

                {/* TEXTAREA WITH DYNAMIC TYPOGRAPHY */}
                <textarea
                  id="gutenberg-content-textarea"
                  value={currentPost.content}
                  onChange={(e) => {
                    handleUpdateField("content", e.target.value);
                    pushHistory(e.target.value);
                  }}
                  placeholder="Start writing your article here..."
                  rows={20}
                  className="w-full bg-transparent text-xs md:text-sm text-[#F3F4F6] font-sans leading-relaxed p-2 outline-none resize-y"
                ></textarea>
              </div>
            )}

            {/* STATS BAR BELOW CANVAS */}
            <div className="bg-[#0e1017] border-t border-white/10 px-4 py-2.5 flex flex-wrap items-center justify-between text-[11px] text-[#c9c2ab]/80 font-mono">
              <div className="flex items-center space-x-4">
                <span><strong className="text-white">{contentStats.words}</strong> words</span>
                <span><strong className="text-white">{contentStats.chars}</strong> chars</span>
                <span><strong className="text-white">{contentStats.sentences}</strong> sentences</span>
                <span className="text-[#f2d98a] font-bold">{contentStats.readingTime}</span>
              </div>
              <div className="text-[#d9b45c] font-bold flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{isAutoSaving ? "Auto-saving..." : "Auto-save Active"}</span>
              </div>
            </div>

          </div>

        </main>

        {/* RIGHT COLUMN: STICKY SIDEBAR (LG: COL-SPAN-4) */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
          
          {/* TAB SWITCHER HEADER */}
          <div className="bg-[#12141b] border border-[#d9b45c]/30 rounded-2xl p-1.5 flex items-center shadow-xl">
            <button
              type="button"
              onClick={() => setActiveSidebarTab("seo")}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${activeSidebarTab === "seo" ? "bg-[#d9b45c] text-black shadow-lg" : "text-[#c9c2ab] hover:text-white"}`}
            >
              <Sparkles size={14} />
              <span>Rank Math SEO</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSidebarTab("publish")}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${activeSidebarTab === "publish" ? "bg-[#d9b45c] text-black shadow-lg" : "text-[#c9c2ab] hover:text-white"}`}
            >
              <Globe size={14} />
              <span>Post Settings</span>
            </button>
          </div>

          {/* TAB 1: RANK MATH SEO PRO PANEL */}
          {activeSidebarTab === "seo" && (
            <div className="bg-[#12141b] border border-[#d9b45c]/20 rounded-2xl p-6 shadow-2xl space-y-6 animate-in fade-in duration-200">
              
              {/* SEO SCORE GAUGE */}
              <div className="flex items-center justify-between p-4 bg-[#07080b] rounded-2xl border border-white/5">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#d9b45c]">Rank Math Score</h4>
                  <p className="text-[10px] text-[#c9c2ab] mt-0.5">Real-time SEO Audit</p>
                </div>
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-extrabold text-sm border-4 ${
                  seoAnalysis.score >= 80 ? "border-emerald-500 text-emerald-400 bg-emerald-500/10" :
                  seoAnalysis.score >= 50 ? "border-amber-500 text-amber-400 bg-amber-500/10" :
                  "border-red-500 text-red-400 bg-red-500/10"
                }`}>
                  {seoAnalysis.score}%
                </div>
              </div>

              {/* GOOGLE SERP SNIPPET PREVIEW (AUTHENTIC SEARCH ENGINE MOCKUP) */}
              <div className="p-4 bg-[#07080b] rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#d9b45c]">
                    Google SERP Snippet Preview
                  </span>
                  <div className="flex items-center space-x-1 bg-white/5 rounded-lg p-0.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setSnippetDevice("desktop")}
                      className={`px-2 py-0.5 rounded ${snippetDevice === "desktop" ? "bg-[#d9b45c] text-black font-bold" : "text-[#c9c2ab]"}`}
                    >
                      Desktop
                    </button>
                    <button
                      type="button"
                      onClick={() => setSnippetDevice("mobile")}
                      className={`px-2 py-0.5 rounded ${snippetDevice === "mobile" ? "bg-[#d9b45c] text-black font-bold" : "text-[#c9c2ab]"}`}
                    >
                      Mobile
                    </button>
                  </div>
                </div>

                {/* GOOGLE RESULT CARD */}
                <div className="bg-[#202124] p-3.5 rounded-xl border border-white/5 text-left font-sans space-y-1">
                  <div className="flex items-center space-x-2 text-[11px] text-[#bdc1c6] truncate">
                    <span className="w-4 h-4 rounded-full bg-[#d9b45c] text-black flex items-center justify-center text-[9px] font-bold shrink-0">
                      Q
                    </span>
                    <span className="truncate">truthquranacademy.com &gt; blog &gt; {currentPost.slug || "article-slug"}</span>
                  </div>
                  <h4 className="text-[#8ab4f8] text-sm md:text-base font-medium leading-snug hover:underline cursor-pointer line-clamp-2">
                    {currentPost.metaTitle || currentPost.title || "Add article title..."}
                  </h4>
                  <p className="text-[#bdc1c6] text-xs leading-relaxed line-clamp-2">
                    {currentPost.metaDescription || currentPost.excerpt || "Add a meta description to see how your article snippet appears in Google search engine result pages (SERPs)..."}
                  </p>
                </div>
              </div>

              {/* FOCUS KEYWORD */}
              <div>
                <label className="text-[10px] font-bold text-[#c9c2ab] uppercase tracking-wider">
                  Focus Keyword
                </label>
                <input
                  type="text"
                  value={currentPost.focusKeyword || ""}
                  onChange={(e) => handleUpdateField("focusKeyword", e.target.value)}
                  placeholder="e.g. tajweed rules..."
                  className="w-full mt-1 bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#d9b45c]"
                />
              </div>

              {/* META TITLE & CHAR COUNT */}
              <div>
                <div className="flex justify-between text-[10px] text-[#c9c2ab] uppercase font-bold">
                  <span>Meta Title (SEO)</span>
                  <span className={(currentPost.metaTitle || "").length > 60 ? "text-red-400" : "text-[#d9b45c]"}>
                    {(currentPost.metaTitle || "").length} / 60
                  </span>
                </div>
                <input
                  type="text"
                  value={currentPost.metaTitle || ""}
                  onChange={(e) => handleUpdateField("metaTitle", e.target.value)}
                  placeholder="SEO page title..."
                  className="w-full mt-1 bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#d9b45c]"
                />
                {/* Character progress bar */}
                <div className="w-full h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      (currentPost.metaTitle || "").length > 60
                        ? "bg-red-500"
                        : (currentPost.metaTitle || "").length >= 40
                        ? "bg-emerald-400"
                        : "bg-amber-400"
                    }`}
                    style={{ width: `${Math.min(100, ((currentPost.metaTitle || "").length / 60) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* META DESCRIPTION & CHAR COUNT */}
              <div>
                <div className="flex justify-between text-[10px] text-[#c9c2ab] uppercase font-bold">
                  <span>Meta Description</span>
                  <span className={(currentPost.metaDescription || "").length > 160 ? "text-red-400" : "text-[#d9b45c]"}>
                    {(currentPost.metaDescription || "").length} / 160
                  </span>
                </div>
                <textarea
                  value={currentPost.metaDescription || ""}
                  onChange={(e) => handleUpdateField("metaDescription", e.target.value)}
                  placeholder="SEO description summary..."
                  rows={3}
                  className="w-full mt-1 bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#d9b45c]"
                ></textarea>
                {/* Character progress bar */}
                <div className="w-full h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      (currentPost.metaDescription || "").length > 160
                        ? "bg-red-500"
                        : (currentPost.metaDescription || "").length >= 120
                        ? "bg-emerald-400"
                        : "bg-amber-400"
                    }`}
                    style={{ width: `${Math.min(100, ((currentPost.metaDescription || "").length / 160) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* READABILITY BADGE */}
              <div className="flex items-center justify-between text-xs p-3 bg-[#07080b] rounded-xl border border-white/5">
                <span className="text-[#c9c2ab]">Readability Score</span>
                <span className="font-bold text-[#f2d98a]">{seoAnalysis.readability} / 100</span>
              </div>

              {/* COLLAPSIBLE AUDIT CHECKLIST */}
              <div className="border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={() => setShowChecklistExpanded(!showChecklistExpanded)}
                  className="w-full flex items-center justify-between text-xs font-bold text-[#d9b45c]"
                >
                  <span>SEO Audit Checklist ({seoAnalysis.passedCount} Passed)</span>
                  {showChecklistExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {showChecklistExpanded && (
                  <div className="mt-3 space-y-2 text-[11px]">
                    {seoAnalysis.rules.map((rule) => (
                      <div key={rule.id} className="p-2.5 bg-[#07080b] rounded-xl border border-white/5 flex items-start space-x-2">
                        {rule.passed ? (
                          <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                        ) : (
                          <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
                        )}
                        <div>
                          <p className={`font-bold ${rule.passed ? "text-white" : "text-red-300"}`}>{rule.label}</p>
                          <p className="text-[#c9c2ab]/70 text-[10px] mt-0.5">{rule.feedback}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* INSTANT INDEXING ACTION BUTTON */}
              <div className="border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={handleManualInstantIndex}
                  disabled={isIndexing}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-[#d9b45c]/10 hover:bg-[#d9b45c]/20 border border-[#d9b45c]/30 hover:border-[#d9b45c]/60 text-[#f2d98a] text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  <Zap size={14} className={`text-[#d9b45c] ${isIndexing ? "animate-spin" : ""}`} />
                  <span>{isIndexing ? "Submitting to Search Console..." : "Instant Index to Google"}</span>
                </button>
                <p className="text-[10px] text-[#c9c2ab]/60 mt-1 text-center">
                  Dispatches direct API request to Google Search Console & IndexNow
                </p>
              </div>

            </div>
          )}

          {/* TAB 2: POST & PUBLISH SETTINGS PANEL */}
          {activeSidebarTab === "publish" && (
            <div className="bg-[#12141b] border border-[#d9b45c]/20 rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in duration-200">
              
              {/* FEATURED IMAGE COMPONENT (IN SIDEBAR) */}
              <div className="p-4 bg-[#07080b] rounded-2xl border border-[#d9b45c]/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ImageIcon size={16} className="text-[#d9b45c]" />
                    <span className="text-xs font-serif font-bold text-white uppercase tracking-wider">
                      Featured Image
                    </span>
                  </div>
                  <span className="text-[10px] text-[#c9c2ab] font-mono">1200×800 (3:2)</span>
                </div>

                {currentPost.coverImage || currentPost.featuredImage ? (
                  <div className="space-y-3">
                    <div className="relative rounded-xl overflow-hidden border border-[#d9b45c]/30 aspect-[3/2] bg-black flex items-center justify-center group">
                      <img
                        src={currentPost.coverImage || currentPost.featuredImage}
                        alt={currentPost.imageAltText || "Featured Image"}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 p-2">
                        <button
                          type="button"
                          onClick={() => {
                            setPendingCropImage(currentPost.coverImage || currentPost.featuredImage || null);
                            setShowCropModal(true);
                          }}
                          className="px-2.5 py-1.5 bg-black/90 backdrop-blur-md text-[#f2d98a] border border-[#d9b45c]/40 rounded-lg text-[11px] font-bold hover:bg-black flex items-center space-x-1"
                        >
                          <Crop size={12} />
                          <span>Crop (3:2)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleUpdateField("coverImage", "");
                            handleUpdateField("featuredImage", "");
                          }}
                          className="px-2.5 py-1.5 bg-red-950/90 backdrop-blur-md text-red-300 border border-red-500/40 rounded-lg text-[11px] font-bold hover:bg-red-900 flex items-center space-x-1"
                        >
                          <Trash2 size={12} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick action buttons below image */}
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setPendingCropImage(currentPost.coverImage || currentPost.featuredImage || null);
                          setShowCropModal(true);
                        }}
                        className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-[#f2d98a] border border-[#d9b45c]/30 rounded-lg text-[10px] font-bold flex items-center justify-center space-x-1 transition-all"
                      >
                        <Crop size={11} />
                        <span>Crop Studio (3:2)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleUpdateField("coverImage", "");
                          handleUpdateField("featuredImage", "");
                        }}
                        className="py-1.5 px-3 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 rounded-lg text-[10px] font-bold transition-all"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="space-y-2 pt-1 border-t border-white/5">
                      <div>
                        <label className="text-[9px] font-bold text-[#c9c2ab] uppercase tracking-wider block">
                          Image ALT Text (SEO)
                        </label>
                        <input
                          type="text"
                          value={currentPost.imageAltText || ""}
                          onChange={(e) => handleUpdateField("imageAltText", e.target.value)}
                          placeholder="e.g. child learning tajweed rules..."
                          className="w-full mt-1 bg-[#12141b] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#d9b45c]"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-[#c9c2ab] uppercase tracking-wider block">
                          Image Title
                        </label>
                        <input
                          type="text"
                          value={currentPost.imageTitle || ""}
                          onChange={(e) => handleUpdateField("imageTitle", e.target.value)}
                          placeholder="e.g. tajweed-rules-guide..."
                          className="w-full mt-1 bg-[#12141b] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#d9b45c]"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-[#d9b45c]/30 rounded-xl p-5 text-center space-y-2.5 bg-[#12141b]/50">
                    <Upload size={24} className="mx-auto text-[#d9b45c]" />
                    <p className="text-[11px] text-[#c9c2ab]">
                      Set featured image for Google SERP & social share cards.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => featuredFileInputRef.current?.click()}
                        className="w-full sm:w-auto px-3 py-1.5 bg-[#d9b45c] text-black font-bold text-[11px] rounded-lg hover:bg-[#f2d98a] transition-all"
                      >
                        Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMediaTargetField("featured");
                          setShowMediaLibraryModal(true);
                        }}
                        className="w-full sm:w-auto px-3 py-1.5 bg-white/5 border border-white/10 text-white font-bold text-[11px] rounded-lg hover:bg-white/10 transition-all"
                      >
                        Media Library
                      </button>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  ref={featuredFileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const url = ev.target?.result as string;
                        if (url) {
                          handleUpdateField("coverImage", url);
                          handleUpdateField("featuredImage", url);
                        }
                      };
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* STATUS */}
              <div>
                <label className="text-[10px] font-bold text-[#c9c2ab] uppercase tracking-wider">
                  Post Status
                </label>
                <select
                  value={currentPost.status}
                  onChange={(e) => handleUpdateField("status", e.target.value)}
                  className="w-full mt-1 bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#d9b45c]"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              {/* CATEGORY */}
              <div>
                <label className="text-[10px] font-bold text-[#c9c2ab] uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={currentPost.category}
                  onChange={(e) => handleUpdateField("category", e.target.value)}
                  className="w-full mt-1 bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#d9b45c]"
                >
                  <option value="Tajweed Rules">Tajweed Rules</option>
                  <option value="Quranic Studies">Quranic Studies</option>
                  <option value="Arabic Language">Arabic Language</option>
                  <option value="Kids Education">Kids Education</option>
                  <option value="Tafseer">Tafseer</option>
                </select>
              </div>

              {/* TAGS */}
              <div>
                <label className="text-[10px] font-bold text-[#c9c2ab] uppercase tracking-wider">
                  Tags (Comma Separated)
                </label>
                <input
                  type="text"
                  value={(currentPost.tags || []).join(", ")}
                  onChange={(e) => handleUpdateField("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
                  placeholder="Tajweed, Quran, Recitation..."
                  className="w-full mt-1 bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#d9b45c]"
                />
              </div>

              {/* PUBLISH DATE */}
              <div>
                <label className="text-[10px] font-bold text-[#c9c2ab] uppercase tracking-wider">
                  Publish Date
                </label>
                <input
                  type="text"
                  value={currentPost.date}
                  onChange={(e) => handleUpdateField("date", e.target.value)}
                  className="w-full mt-1 bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#d9b45c]"
                />
              </div>

              {/* AUTHOR */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-[#c9c2ab] uppercase tracking-wider">Author Name</label>
                  <input
                    type="text"
                    value={currentPost.author?.name || "Muhammad Zain"}
                    onChange={(e) => handleUpdateField("author", { ...currentPost.author, name: e.target.value })}
                    className="w-full mt-1 bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#d9b45c]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#c9c2ab] uppercase tracking-wider">Role</label>
                  <input
                    type="text"
                    value={currentPost.author?.role || "Senior Quran Scholar"}
                    onChange={(e) => handleUpdateField("author", { ...currentPost.author, role: e.target.value })}
                    className="w-full mt-1 bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#d9b45c]"
                  />
                </div>
              </div>

            </div>
          )}

        </aside>

      </div>

      {/* 3. AI WRITING ASSISTANT MODAL */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12141b] border border-[#d9b45c]/30 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-2">
                <Sparkles size={20} className="text-[#d9b45c]" />
                <h3 className="font-serif text-lg font-bold text-white">English AI Writing Assistant</h3>
              </div>
              <button onClick={() => setShowAiModal(false)} className="p-1 hover:text-white text-[#c9c2ab]">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#d9b45c] uppercase">Choose AI Writing Tool</label>
                <select
                  value={aiAction}
                  onChange={(e) => setAiAction(e.target.value)}
                  className="w-full mt-1.5 bg-[#07080b] border border-[#d9b45c]/30 rounded-xl px-3 py-2 text-xs text-[#f2d98a] font-bold outline-none"
                >
                  <option value="grammar">Grammar & Punctuation Correction</option>
                  <option value="spelling">Spelling Correction</option>
                  <option value="rewrite">Rewrite Paragraph</option>
                  <option value="expand">Expand Content</option>
                  <option value="shorten">Shorten / Summarize Content</option>
                  <option value="readability">Improve Readability</option>
                  <option value="seo">Make Content SEO-Friendly</option>
                  <option value="humanize">Humanize AI Text</option>
                  <option value="tone">Improve Professional Tone</option>
                  <option value="intro">Generate Article Introduction</option>
                  <option value="conclusion">Generate Article Conclusion</option>
                  <option value="faq">Generate FAQ Block</option>
                  <option value="meta_title">Generate SEO Meta Title</option>
                  <option value="meta_desc">Generate SEO Meta Description</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleRunAiAssistant}
                disabled={aiLoading}
                className="w-full py-3 bg-gradient-to-r from-[#f2d98a] to-[#d9b45c] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {aiLoading ? (
                  <span>Generating AI Response...</span>
                ) : (
                  <>
                    <Wand2 size={16} />
                    <span>Generate AI Output</span>
                  </>
                )}
              </button>

              {aiResult && (
                <div className="p-4 bg-[#07080b] border border-[#d9b45c]/30 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#d9b45c] uppercase">AI Result Preview</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(aiResult)}
                      className="text-[10px] text-[#f2d98a] hover:underline"
                    >
                      Copy Result
                    </button>
                  </div>
                  <div className="text-xs text-[#c9c2ab] leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap font-sans">
                    {aiResult}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => handleApplyAiResult("replace_content")}
                      className="px-3 py-1.5 bg-[#d9b45c] text-black font-bold text-xs rounded-lg"
                    >
                      Replace Article Content
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyAiResult("append_content")}
                      className="px-3 py-1.5 bg-white/10 text-white font-bold text-xs rounded-lg"
                    >
                      Append to Bottom
                    </button>
                    {aiAction === "meta_title" && (
                      <button
                        type="button"
                        onClick={() => handleApplyAiResult("meta_title")}
                        className="px-3 py-1.5 bg-emerald-500 text-black font-bold text-xs rounded-lg"
                      >
                        Set as Meta Title
                      </button>
                    )}
                    {aiAction === "meta_desc" && (
                      <button
                        type="button"
                        onClick={() => handleApplyAiResult("meta_desc")}
                        className="px-3 py-1.5 bg-emerald-500 text-black font-bold text-xs rounded-lg"
                      >
                        Set as Meta Description
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 4. PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#07080b] border border-[#d9b45c]/30 rounded-3xl p-6 md:p-8 max-w-4xl w-full h-[85vh] overflow-y-auto shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#d9b45c] uppercase tracking-wider">Live Article Preview</span>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-white mt-1">{currentPost.title || "Untitled Article"}</h2>
              </div>
              <button onClick={() => setShowPreviewModal(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white">
                <X size={18} />
              </button>
            </div>

            {(currentPost.coverImage || currentPost.featuredImage) && (
              <img
                src={currentPost.coverImage || currentPost.featuredImage}
                alt={currentPost.imageAltText || "Featured"}
                className="w-full max-h-96 object-cover rounded-2xl border border-white/10 shadow-2xl"
              />
            )}

            <div
              className="prose prose-invert max-w-none text-xs md:text-sm text-[#F3F4F6] leading-relaxed font-sans
                [&>h1]:font-serif [&>h1]:text-2xl [&>h1]:md:text-3xl [&>h1]:text-white [&>h1]:font-bold [&>h1]:mt-8 [&>h1]:mb-4
                [&>h2]:font-serif [&>h2]:text-xl [&>h2]:md:text-2xl [&>h2]:text-white [&>h2]:font-bold [&>h2]:border-b [&>h2]:border-[#d9b45c]/30 [&>h2]:pb-2 [&>h2]:mt-8 [&>h2]:mb-4
                [&_h2]:font-serif [&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:text-white [&_h2]:font-bold [&_h2]:border-b [&_h2]:border-[#d9b45c]/30 [&_h2]:pb-2 [&_h2]:mt-8 [&_h2]:mb-4
                [&>h3]:font-serif [&>h3]:text-lg [&>h3]:md:text-xl [&>h3]:text-[#f2d98a] [&>h3]:font-bold [&>h3]:mt-6 [&>h3]:mb-3
                [&_h3]:font-serif [&_h3]:text-lg [&_h3]:md:text-xl [&_h3]:text-[#f2d98a] [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-3
                [&>h4]:font-serif [&>h4]:text-base [&>h4]:md:text-lg [&>h4]:text-[#f3ecd8] [&>h4]:font-semibold [&>h4]:mt-5 [&>h4]:mb-2
                [&_h4]:font-serif [&_h4]:text-base [&_h4]:md:text-lg [&_h4]:text-[#f3ecd8] [&_h4]:font-semibold [&_h4]:mt-5 [&_h4]:mb-2
                [&>p]:mb-4 [&>p]:leading-relaxed [&>p]:text-[#F3F4F6] [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-[#F3F4F6]
                [&>ul]:my-4 [&>ul]:pl-5 [&>ul]:space-y-1.5 [&>ul>li]:list-disc [&>ul>li]:marker:text-[#d9b45c] [&>ul>li]:text-[#F3F4F6]
                [&>ol]:my-4 [&>ol]:pl-5 [&>ol]:space-y-1.5 [&>ol>li]:list-decimal [&>ol>li]:marker:text-[#d9b45c] [&>ol>li]:text-[#F3F4F6]
                [&>blockquote]:my-6 [&>blockquote]:p-4 [&>blockquote]:bg-[#12141b] [&>blockquote]:border-l-4 [&>blockquote]:border-[#d9b45c] [&>blockquote]:italic [&>blockquote]:text-[#f2d98a] [&>blockquote]:rounded-r-xl
                [&_table]:w-full [&_table]:my-6 [&_table]:border-collapse [&_table]:border [&_table]:border-[#d9b45c]/30 [&_table]:rounded-xl [&_table]:overflow-hidden [&_table]:text-xs [&_table]:md:text-sm [&_table]:bg-[#12141b]/90 [&_table]:text-left [&_table]:shadow-lg
                [&_th]:bg-[#1c202b] [&_th]:text-[#f2d98a] [&_th]:font-serif [&_th]:font-bold [&_th]:p-3.5 [&_th]:border-b [&_th]:border-[#d9b45c]/30 [&_th]:border-r [&_th]:border-white/10 [&_th]:uppercase [&_th]:tracking-wider [&_th]:text-xs
                [&_td]:p-3.5 [&_td]:text-xs [&_td]:md:text-sm [&_td]:text-[#F3F4F6] [&_td]:border-b [&_td]:border-white/5 [&_td]:border-r [&_td]:border-white/5
                [&_tr:hover]:bg-white/[0.04] [&_tr:hover]:transition-colors
                [&_.cta-button-block]:my-8 [&_.cta-button-block_a]:no-underline [&_.cta-button-block_a]:hover:no-underline
                [&>a]:text-[#FACC15] [&>a]:underline [&>a]:hover:text-[#EAB308] [&>a]:font-semibold
                [&_a]:text-[#FACC15] [&_a]:underline [&_a]:hover:text-[#EAB308] [&_a]:font-semibold"
              dangerouslySetInnerHTML={{ __html: formatContentForPreview(currentPost.content) }}
            />
          </div>
        </div>
      )}

      {/* 5. TABLE BUILDER MODAL */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12141b] border border-[#d9b45c]/30 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <TableIcon size={18} className="text-[#d9b45c]" />
                <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider">Insert Structured Table</h3>
              </div>
              <button onClick={() => setShowTableModal(false)} className="text-[#c9c2ab] hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Preset Selector */}
              <div>
                <label className="text-[#c9c2ab] font-bold block mb-1">Table Preset / Template</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTablePreset("comparison");
                      setTableCols(3);
                      setTableRows(4);
                      setTableHeaders(["Feature", "Standard", "Truth Quran Academy"]);
                    }}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      tablePreset === "comparison"
                        ? "bg-[#d9b45c]/20 border-[#d9b45c] text-[#f2d98a] font-bold"
                        : "bg-[#07080b] border-white/10 text-[#c9c2ab] hover:border-white/20"
                    }`}
                  >
                    Comparison
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTablePreset("pricing");
                      setTableCols(3);
                      setTableRows(3);
                      setTableHeaders(["Course Name", "Monthly Fee", "Class Duration"]);
                    }}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      tablePreset === "pricing"
                        ? "bg-[#d9b45c]/20 border-[#d9b45c] text-[#f2d98a] font-bold"
                        : "bg-[#07080b] border-white/10 text-[#c9c2ab] hover:border-white/20"
                    }`}
                  >
                    Courses & Fee
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTablePreset("schedule");
                      setTableCols(3);
                      setTableRows(3);
                      setTableHeaders(["Days", "Time Slot", "Subject Covered"]);
                    }}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      tablePreset === "schedule"
                        ? "bg-[#d9b45c]/20 border-[#d9b45c] text-[#f2d98a] font-bold"
                        : "bg-[#07080b] border-white/10 text-[#c9c2ab] hover:border-white/20"
                    }`}
                  >
                    Schedule
                  </button>
                </div>
              </div>

              {/* Rows & Cols Count */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#c9c2ab] font-bold block mb-1">Rows Count</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={tableRows}
                    onChange={(e) => setTableRows(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#d9b45c]"
                  />
                </div>
                <div>
                  <label className="text-[#c9c2ab] font-bold block mb-1">Columns Count</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={tableCols}
                    onChange={(e) => {
                      const cols = Math.max(1, Math.min(5, parseInt(e.target.value) || 1));
                      setTableCols(cols);
                      setTableHeaders((prev) => {
                        const next = [...prev];
                        while (next.length < cols) next.push(`Header ${next.length + 1}`);
                        return next.slice(0, cols);
                      });
                    }}
                    className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#d9b45c]"
                  />
                </div>
              </div>

              {/* Column Headers input */}
              <div>
                <label className="text-[#c9c2ab] font-bold block mb-1.5">Column Header Titles</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Array.from({ length: tableCols }).map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      value={tableHeaders[i] || `Col ${i + 1}`}
                      onChange={(e) => {
                        const next = [...tableHeaders];
                        next[i] = e.target.value;
                        setTableHeaders(next);
                      }}
                      placeholder={`Header ${i + 1}`}
                      className="bg-[#07080b] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-[#f2d98a] outline-none focus:border-[#d9b45c]"
                    />
                  ))}
                </div>
              </div>

              {/* Preview Box */}
              <div className="p-3 bg-[#07080b] border border-[#d9b45c]/20 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-[#d9b45c] block mb-2">Table Preview</span>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] border border-[#d9b45c]/30 rounded-lg overflow-hidden">
                    <thead className="bg-[#181b24] text-[#f2d98a]">
                      <tr>
                        {Array.from({ length: tableCols }).map((_, i) => (
                          <th key={i} className="p-2 border-r border-white/10 font-bold">{tableHeaders[i] || `Col ${i + 1}`}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-[#F3F4F6]">
                      <tr>
                        {Array.from({ length: tableCols }).map((_, i) => (
                          <td key={i} className="p-2 border-r border-white/5">Row 1 Sample Data</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                className="px-4 py-2 text-xs text-[#c9c2ab] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertTable}
                className="px-5 py-2.5 bg-gradient-to-r from-[#d9b45c] to-[#f2d98a] text-black font-extrabold text-xs rounded-xl shadow-lg hover:brightness-110 flex items-center space-x-1.5"
              >
                <TableIcon size={14} />
                <span>Insert Table into Article</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. CALL-TO-ACTION (CTA) BUTTON BUILDER MODAL */}
      {showCtaModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12141b] border border-[#d9b45c]/30 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <MousePointerClick size={18} className="text-[#d9b45c]" />
                <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider">
                  Insert Call-to-Action (CTA) Button
                </h3>
              </div>
              <button onClick={() => setShowCtaModal(false)} className="text-[#c9c2ab] hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Button Text */}
              <div>
                <label className="text-[#c9c2ab] font-bold block mb-1">Button Text (Label)</label>
                <input
                  type="text"
                  value={ctaButtonText}
                  onChange={(e) => setCtaButtonText(e.target.value)}
                  placeholder="e.g. Book Free 3-Day Trial Class"
                  className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#d9b45c]"
                />
              </div>

              {/* Target Link URL */}
              <div>
                <label className="text-[#c9c2ab] font-bold block mb-1">Target Link URL</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={ctaLinkUrl}
                    onChange={(e) => setCtaLinkUrl(e.target.value)}
                    placeholder="e.g. /contact or https://wa.me/..."
                    className="flex-1 bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#f2d98a] font-mono outline-none focus:border-[#d9b45c]"
                  />
                  <button
                    type="button"
                    onClick={() => setCtaLinkUrl("/contact")}
                    className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-[10px] text-[#c9c2ab] rounded-lg border border-white/10"
                  >
                    /contact
                  </button>
                </div>
              </div>

              {/* Subtitle / Microcopy */}
              <div>
                <label className="text-[#c9c2ab] font-bold block mb-1">Optional Subtitle / Guarantee</label>
                <input
                  type="text"
                  value={ctaSubtitle}
                  onChange={(e) => setCtaSubtitle(e.target.value)}
                  placeholder="e.g. 1-on-1 Live Online Sessions with Certified Quran Scholars"
                  className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#d9b45c]"
                />
              </div>

              {/* Style & Color Selector */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#c9c2ab] font-bold block mb-1">Button Theme</label>
                  <select
                    value={ctaStyle}
                    onChange={(e: any) => setCtaStyle(e.target.value)}
                    className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#f2d98a] outline-none"
                  >
                    <option value="gold">Gold Luxury Gradient</option>
                    <option value="royal">Dark Royal Navy Card</option>
                    <option value="whatsapp">Emerald Green (WhatsApp)</option>
                    <option value="outline">Gold Outline</option>
                    <option value="banner">Full Promotional Box Banner</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#c9c2ab] font-bold block mb-1">Icon Style</label>
                  <select
                    value={ctaIcon}
                    onChange={(e: any) => setCtaIcon(e.target.value)}
                    className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="arrow">Arrow (➔)</option>
                    <option value="whatsapp">WhatsApp Icon</option>
                    <option value="phone">Phone Call</option>
                    <option value="sparkles">Sparkles (✨)</option>
                    <option value="book">Quran Book (📖)</option>
                    <option value="none">No Icon</option>
                  </select>
                </div>
              </div>

              {/* Alignment & Tab toggle */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <label className="text-[#c9c2ab] font-bold">Align:</label>
                  <div className="flex space-x-1">
                    {(["center", "left", "right", "full"] as const).map((align) => (
                      <button
                        key={align}
                        type="button"
                        onClick={() => setCtaAlignment(align)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition-all ${
                          ctaAlignment === align ? "bg-[#d9b45c] text-black" : "bg-[#07080b] text-[#c9c2ab] border border-white/10"
                        }`}
                      >
                        {align}
                      </button>
                    ))}
                  </div>
                </div>
                <label className="flex items-center space-x-1.5 cursor-pointer text-[#c9c2ab]">
                  <input
                    type="checkbox"
                    checked={ctaOpenNewTab}
                    onChange={(e) => setCtaOpenNewTab(e.target.checked)}
                    className="accent-[#d9b45c]"
                  />
                  <span>Open in New Tab</span>
                </label>
              </div>

              {/* Live Preview of Button */}
              <div className="p-4 bg-[#07080b] border border-[#d9b45c]/20 rounded-2xl text-center space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#d9b45c] block text-left">Live Button Preview</span>
                <div className={`py-2 ${ctaAlignment === "left" ? "text-left" : ctaAlignment === "right" ? "text-right" : "text-center"}`}>
                  <span
                    className={`inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg cursor-pointer ${
                      ctaStyle === "gold"
                        ? "bg-gradient-to-r from-[#d9b45c] to-[#f2d98a] text-black border border-[#d9b45c]"
                        : ctaStyle === "royal"
                        ? "bg-[#1c202b] text-[#f2d98a] border-2 border-[#d9b45c]"
                        : ctaStyle === "whatsapp"
                        ? "bg-emerald-600 text-white border border-emerald-400"
                        : ctaStyle === "outline"
                        ? "bg-transparent text-[#f2d98a] border-2 border-[#d9b45c]"
                        : "bg-[#d9b45c] text-black border border-[#d9b45c]"
                    } ${ctaAlignment === "full" ? "w-full" : ""}`}
                  >
                    {ctaIcon === "whatsapp" && <span className="mr-1.5">💬</span>}
                    {ctaIcon === "phone" && <span className="mr-1.5">📞</span>}
                    {ctaIcon === "sparkles" && <span className="mr-1.5">✨</span>}
                    {ctaIcon === "book" && <span className="mr-1.5">📖</span>}
                    <span>{ctaButtonText || "Button Label"}</span>
                    {ctaIcon === "arrow" && <ArrowRight size={14} className="ml-1.5 inline" />}
                  </span>
                  {ctaSubtitle && <p className="text-[10px] text-[#c9c2ab] mt-1 italic">{ctaSubtitle}</p>}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => handleInsertCta("bottom")}
                className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all"
              >
                Insert at Article End
              </button>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCtaModal(false)}
                  className="px-4 py-2 text-xs text-[#c9c2ab] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertCta("cursor")}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#d9b45c] to-[#f2d98a] text-black font-extrabold text-xs rounded-xl shadow-lg hover:brightness-110 flex items-center space-x-1.5"
                >
                  <MousePointerClick size={14} />
                  <span>Insert at Cursor</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. FEATURED IMAGE CROPPER STUDIO MODAL */}
      {showCropModal && pendingCropImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12141b] border border-[#d9b45c]/30 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white uppercase">Crop & Optimize (3:2 Aspect Ratio)</h3>
              <button onClick={() => setShowCropModal(false)} className="text-[#c9c2ab] hover:text-white"><X size={18} /></button>
            </div>

            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden flex items-center justify-center border border-[#d9b45c]/30">
              <img
                src={pendingCropImage}
                alt="Crop preview"
                style={{
                  transform: `scale(${cropScale}) translate(${cropPanX}px, ${cropPanY}px)`,
                  filter: `brightness(${cropBrightness}%) contrast(${cropContrast}%) saturate(${cropSaturation}%)`
                }}
                className="max-h-full max-w-full object-contain transition-transform"
              />
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#c9c2ab]">Zoom Scale ({cropScale.toFixed(1)}x)</label>
                <input
                  type="range"
                  min={1}
                  max={2.5}
                  step={0.1}
                  value={cropScale}
                  onChange={(e) => setCropScale(parseFloat(e.target.value))}
                  className="w-full accent-[#d9b45c]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/10">
              <button onClick={() => setShowCropModal(false)} className="px-4 py-2 text-xs text-[#c9c2ab]">Cancel</button>
              <button
                onClick={handleApplyCropAndOptimize}
                className="px-5 py-2.5 bg-[#d9b45c] text-black font-bold text-xs rounded-xl"
              >
                Apply 1200 × 800 px Crop
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
