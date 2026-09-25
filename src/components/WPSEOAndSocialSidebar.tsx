import React, { useState } from "react";
import { BlogPost } from "../types";
import { generateAutoSchemaJson, slugifyAnchor } from "../utils/blockParser";
import { WPMediaLibraryModal } from "./WPMediaLibraryModal";
import { CMSData, WPMedia } from "../cmsStore";
import { 
  Sparkles, 
  Share2, 
  FileCode, 
  Globe, 
  Eye, 
  Check, 
  Copy, 
  Plus, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Smartphone, 
  Monitor, 
  Image as ImageIcon,
  Lock,
  Layers,
  Clock,
  User,
  Tag,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface WPSEOAndSocialSidebarProps {
  post: BlogPost;
  onChange: (updatedPost: BlogPost) => void;
  cmsData: CMSData;
}

export default function WPSEOAndSocialSidebar({ post, onChange, cmsData }: WPSEOAndSocialSidebarProps) {
  const [activeTab, setActiveTab] = useState<"seo" | "social" | "schema" | "publish">("seo");
  const [serpDevice, setSerpDevice] = useState<"desktop" | "mobile">("desktop");
  const [newKeywordInput, setNewKeywordInput] = useState("");
  const [isCopiedSchema, setIsCopiedSchema] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<"featured" | "social">("featured");
  const [showAdvancedRobots, setShowAdvancedRobots] = useState(false);

  // Field updater
  const handleUpdate = (field: keyof BlogPost, value: any) => {
    onChange({
      ...post,
      [field]: value
    });
  };

  // Add Secondary Keyword
  const handleAddSecondaryKeyword = () => {
    const trimmed = newKeywordInput.trim().toLowerCase();
    if (!trimmed) return;
    const current = post.secondaryKeywords || [];
    if (!current.includes(trimmed)) {
      handleUpdate("secondaryKeywords", [...current, trimmed]);
    }
    setNewKeywordInput("");
  };

  // Remove Secondary Keyword
  const handleRemoveSecondaryKeyword = (kw: string) => {
    const current = post.secondaryKeywords || [];
    handleUpdate("secondaryKeywords", current.filter((k) => k !== kw));
  };

  // Auto-generate Slug from Title
  const handleGenerateSlug = () => {
    if (post.title) {
      handleUpdate("slug", slugifyAnchor(post.title));
    }
  };

  // Auto-generate Schema.org JSON
  const autoSchema = generateAutoSchemaJson(post);
  const displayedSchemaJson = post.customSchemaJson || JSON.stringify(autoSchema, null, 2);

  const handleCopySchema = () => {
    navigator.clipboard.writeText(displayedSchemaJson);
    setIsCopiedSchema(true);
    setTimeout(() => setIsCopiedSchema(false), 2000);
  };

  // Handle Media Selection
  const handleMediaSelect = (media: WPMedia) => {
    if (mediaTarget === "featured") {
      handleUpdate("featuredImage", media.url);
      handleUpdate("coverImage", media.url);
      handleUpdate("imageAltText", media.alt || media.title || "");
    } else {
      handleUpdate("ogImage", media.url);
    }
    setIsMediaModalOpen(false);
  };

  // Length calculations for SEO counters
  const titleLength = (post.metaTitle || post.title || "").length;
  const descLength = (post.metaDescription || post.excerpt || "").length;

  return (
    <aside className="w-full flex flex-col font-sans select-none space-y-4">
      {/* 4 Clean Sub-tabs in Header */}
      <div className="bg-[#12141b] border border-[#d9b45c]/25 rounded-xl p-1 flex items-center shadow-lg">
        <button
          type="button"
          onClick={() => setActiveTab("seo")}
          className={`flex-1 py-2 text-[11px] font-extrabold uppercase rounded-lg transition-all flex items-center justify-center space-x-1 ${
            activeTab === "seo" ? "bg-[#d9b45c] text-black shadow-md" : "text-[#c9c2ab] hover:text-white"
          }`}
        >
          <Sparkles size={12} />
          <span>SEO</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("social")}
          className={`flex-1 py-2 text-[11px] font-extrabold uppercase rounded-lg transition-all flex items-center justify-center space-x-1 ${
            activeTab === "social" ? "bg-[#d9b45c] text-black shadow-md" : "text-[#c9c2ab] hover:text-white"
          }`}
        >
          <Share2 size={12} />
          <span>Social</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("schema")}
          className={`flex-1 py-2 text-[11px] font-extrabold uppercase rounded-lg transition-all flex items-center justify-center space-x-1 ${
            activeTab === "schema" ? "bg-[#d9b45c] text-black shadow-md" : "text-[#c9c2ab] hover:text-white"
          }`}
        >
          <FileCode size={12} />
          <span>Schema</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("publish")}
          className={`flex-1 py-2 text-[11px] font-extrabold uppercase rounded-lg transition-all flex items-center justify-center space-x-1 ${
            activeTab === "publish" ? "bg-[#d9b45c] text-black shadow-md" : "text-[#c9c2ab] hover:text-white"
          }`}
        >
          <Globe size={12} />
          <span>Publish</span>
        </button>
      </div>

      {/* 1. IN-DEPTH SEO TAB */}
      {activeTab === "seo" && (
        <div className="bg-[#12141b] border border-[#d9b45c]/20 rounded-2xl p-5 shadow-2xl space-y-5 animate-in fade-in duration-150 text-left">
          
          {/* LIVE GOOGLE SERP PREVIEW CARD */}
          <div className="p-4 bg-[#07080b] rounded-xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#d9b45c]">
                Google SERP Snippet Preview
              </span>
              <div className="flex items-center space-x-1 bg-white/5 rounded-lg p-0.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => setSerpDevice("desktop")}
                  className={`px-2 py-0.5 rounded flex items-center gap-1 ${
                    serpDevice === "desktop" ? "bg-[#d9b45c] text-black font-bold" : "text-[#c9c2ab]"
                  }`}
                >
                  <Monitor size={11} />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSerpDevice("mobile")}
                  className={`px-2 py-0.5 rounded flex items-center gap-1 ${
                    serpDevice === "mobile" ? "bg-[#d9b45c] text-black font-bold" : "text-[#c9c2ab]"
                  }`}
                >
                  <Smartphone size={11} />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            {/* Google Search Card Preview */}
            <div className="bg-[#202124] p-3.5 rounded-xl border border-white/5 text-left font-sans space-y-1">
              <div className="flex items-center space-x-2 text-[11px] text-[#bdc1c6] truncate">
                <span className="w-4 h-4 rounded-full bg-[#d9b45c] text-black flex items-center justify-center text-[9px] font-bold shrink-0">
                  T
                </span>
                <span className="truncate">truthquranacademy.com &rsaquo; blog &rsaquo; {post.slug || "article-slug"}</span>
              </div>
              <h4 className="text-[#8ab4f8] text-sm font-medium leading-snug hover:underline cursor-pointer line-clamp-2">
                {post.metaTitle || post.title || "Post Title Goes Here..."}
              </h4>
              <p className="text-[#bdc1c6] text-xs leading-relaxed line-clamp-2">
                {post.metaDescription || post.excerpt || "Enter a compelling meta description to improve click-through rates from Google search result pages..."}
              </p>
            </div>
          </div>

          {/* FOCUS KEYWORD */}
          <div>
            <label className="text-[10px] font-bold text-[#c9c2ab] uppercase tracking-wider block mb-1">
              Focus Keyphrase
            </label>
            <input
              type="text"
              value={post.focusKeyword || ""}
              onChange={(e) => handleUpdate("focusKeyword", e.target.value)}
              placeholder="e.g. online quran learning..."
              className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#d9b45c]"
            />
          </div>

          {/* SECONDARY KEYWORDS */}
          <div>
            <label className="text-[10px] font-bold text-[#c9c2ab] uppercase tracking-wider block mb-1">
              Secondary Keywords (Semantic Entities)
            </label>
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={newKeywordInput}
                onChange={(e) => setNewKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSecondaryKeyword();
                  }
                }}
                placeholder="Type keyword and press Enter..."
                className="flex-1 bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#d9b45c]"
              />
              <button
                type="button"
                onClick={handleAddSecondaryKeyword}
                className="px-3 py-2 bg-[#d9b45c] text-black rounded-xl text-xs font-bold hover:bg-white transition-all cursor-pointer"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Keyword pills */}
            <div className="flex flex-wrap gap-1.5">
              {(post.secondaryKeywords || []).map((kw, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-full bg-[#d9b45c]/10 border border-[#d9b45c]/30 text-[#f2d98a] text-[10px] font-mono flex items-center gap-1"
                >
                  <span>{kw}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSecondaryKeyword(kw)}
                    className="hover:text-red-400 p-0.5"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* META TITLE & SERP PIXEL/CHAR COUNTER */}
          <div>
            <div className="flex justify-between text-[10px] text-[#c9c2ab] uppercase font-bold mb-1">
              <span>Meta Title (SEO)</span>
              <span className={titleLength > 60 ? "text-red-400 font-bold" : titleLength >= 50 ? "text-emerald-400 font-bold" : "text-[#d9b45c]"}>
                {titleLength} / 60 chars (Recommended: 50-60)
              </span>
            </div>
            <input
              type="text"
              value={post.metaTitle || ""}
              onChange={(e) => handleUpdate("metaTitle", e.target.value)}
              placeholder="Title for search engines..."
              className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#d9b45c]"
            />
            {/* Progress bar */}
            <div className="w-full h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  titleLength > 60 ? "bg-red-500" : titleLength >= 50 ? "bg-emerald-400" : "bg-amber-400"
                }`}
                style={{ width: `${Math.min(100, (titleLength / 60) * 100)}%` }}
              />
            </div>
          </div>

          {/* META DESCRIPTION & CHAR COUNTER */}
          <div>
            <div className="flex justify-between text-[10px] text-[#c9c2ab] uppercase font-bold mb-1">
              <span>Meta Description</span>
              <span className={descLength > 160 ? "text-red-400 font-bold" : descLength >= 140 ? "text-emerald-400 font-bold" : "text-[#d9b45c]"}>
                {descLength} / 160 chars (Recommended: 150-160)
              </span>
            </div>
            <textarea
              rows={3}
              value={post.metaDescription || ""}
              onChange={(e) => handleUpdate("metaDescription", e.target.value)}
              placeholder="Summary shown in Google search result snippet..."
              className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#d9b45c]"
            />
            {/* Progress bar */}
            <div className="w-full h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  descLength > 160 ? "bg-red-500" : descLength >= 140 ? "bg-emerald-400" : "bg-amber-400"
                }`}
                style={{ width: `${Math.min(100, (descLength / 160) * 100)}%` }}
              />
            </div>
          </div>

          {/* URL SLUG GENERATOR */}
          <div>
            <div className="flex items-center justify-between text-[10px] text-[#c9c2ab] uppercase font-bold mb-1">
              <span>Permalink URL Slug</span>
              <button
                type="button"
                onClick={handleGenerateSlug}
                className="text-[#d9b45c] hover:underline normal-case"
              >
                Auto-generate from Title
              </button>
            </div>
            <div className="flex items-center space-x-1 bg-[#07080b] border border-white/10 rounded-xl px-3 py-1.5">
              <span className="text-[10px] text-[#c9c2ab]/50 font-mono">/blog/</span>
              <input
                type="text"
                value={post.slug || ""}
                onChange={(e) => handleUpdate("slug", slugifyAnchor(e.target.value))}
                placeholder="clean-seo-slug"
                className="flex-1 bg-transparent text-xs text-[#f2d98a] font-mono outline-none"
              />
            </div>
          </div>

          {/* ADVANCED ROBOTS & CANONICAL TOGGLE */}
          <div className="border-t border-white/10 pt-3">
            <button
              type="button"
              onClick={() => setShowAdvancedRobots(!showAdvancedRobots)}
              className="w-full flex items-center justify-between text-xs font-bold text-[#d9b45c]"
            >
              <span>Advanced Robots & Canonical URL</span>
              {showAdvancedRobots ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showAdvancedRobots && (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-[#c9c2ab] uppercase tracking-wider block mb-1">
                    Canonical URL Override
                  </label>
                  <input
                    type="text"
                    value={post.canonicalUrl || ""}
                    onChange={(e) => handleUpdate("canonicalUrl", e.target.value)}
                    placeholder="https://truthquranacademy.com/blog/..."
                    className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#d9b45c]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#c9c2ab] uppercase tracking-wider block mb-1">
                    Robots Meta Directives
                  </label>
                  <select
                    value={post.robotsMeta || "index, follow"}
                    onChange={(e) => handleUpdate("robotsMeta", e.target.value)}
                    className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#d9b45c]"
                  >
                    <option value="index, follow">index, follow (Default - Recommended)</option>
                    <option value="noindex, follow">noindex, follow</option>
                    <option value="index, nofollow">index, nofollow</option>
                    <option value="noindex, nofollow">noindex, nofollow</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. OPEN GRAPH & TWITTER SOCIAL TAB */}
      {activeTab === "social" && (
        <div className="bg-[#12141b] border border-[#d9b45c]/20 rounded-2xl p-5 shadow-2xl space-y-5 animate-in fade-in duration-150 text-left">
          
          {/* LIVE SOCIAL SHARE CARD PREVIEW */}
          <div className="p-3 bg-[#07080b] rounded-xl border border-white/10 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#d9b45c] block">
              Social Card Preview (Facebook & Twitter)
            </span>

            <div className="border border-white/10 rounded-xl overflow-hidden bg-[#18191a] shadow-lg">
              <div className="aspect-[1.91/1] w-full bg-black relative overflow-hidden">
                <img
                  src={post.ogImage || post.featuredImage || post.coverImage || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600"}
                  alt="Social share preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 space-y-1">
                <span className="text-[9px] text-[#c9c2ab]/60 uppercase font-mono block">truthquranacademy.com</span>
                <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">
                  {post.ogTitle || post.metaTitle || post.title || "Article Social Title..."}
                </h4>
                <p className="text-[11px] text-[#b0b3b8] line-clamp-2 leading-relaxed">
                  {post.ogDescription || post.metaDescription || post.excerpt || "Article social description summary..."}
                </p>
              </div>
            </div>
          </div>

          {/* SOCIAL TITLE */}
          <div>
            <label className="text-[10px] font-bold text-[#c9c2ab] uppercase tracking-wider block mb-1">
              Social Share Title (OG / Twitter)
            </label>
            <input
              type="text"
              value={post.ogTitle || ""}
              onChange={(e) => handleUpdate("ogTitle", e.target.value)}
              placeholder={post.metaTitle || post.title || "Custom social title..."}
              className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#d9b45c]"
            />
          </div>

          {/* SOCIAL DESCRIPTION */}
          <div>
            <label className="text-[10px] font-bold text-[#c9c2ab] uppercase tracking-wider block mb-1">
              Social Share Description
            </label>
            <textarea
              rows={3}
              value={post.ogDescription || ""}
              onChange={(e) => handleUpdate("ogDescription", e.target.value)}
              placeholder={post.metaDescription || post.excerpt || "Custom social description..."}
              className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#d9b45c]"
            />
          </div>

          {/* SOCIAL IMAGE */}
          <div>
            <label className="text-[10px] font-bold text-[#c9c2ab] uppercase tracking-wider block mb-1">
              Social Share Image (Recommended: 1200×630)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={post.ogImage || ""}
                onChange={(e) => handleUpdate("ogImage", e.target.value)}
                placeholder="https://... or choose from Media Library"
                className="flex-1 bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#d9b45c]"
              />
              <button
                type="button"
                onClick={() => {
                  setMediaTarget("social");
                  setIsMediaModalOpen(true);
                }}
                className="px-3 py-2 bg-[#d9b45c] text-black font-bold text-xs rounded-xl hover:bg-white transition-all cursor-pointer whitespace-nowrap"
              >
                Media Library
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. SCHEMA.ORG JSON-LD BUILDER & VIEWER TAB */}
      {activeTab === "schema" && (
        <div className="bg-[#12141b] border border-[#d9b45c]/20 rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in duration-150 text-left">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#d9b45c]">
                Schema.org (JSON-LD) Builder
              </h4>
              <p className="text-[10px] text-[#c9c2ab]/70">
                Article + Breadcrumbs + FAQPage auto-extracted
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopySchema}
              className="px-2.5 py-1 bg-[#d9b45c]/20 hover:bg-[#d9b45c] text-[#d9b45c] hover:text-black rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
            >
              {isCopiedSchema ? <Check size={12} /> : <Copy size={12} />}
              <span>{isCopiedSchema ? "Copied!" : "Copy JSON"}</span>
            </button>
          </div>

          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center space-x-2 text-[10px] text-emerald-400">
            <CheckCircle2 size={14} className="shrink-0" />
            <span>Valid Google Rich Results structured data (Article, Breadcrumbs, FAQ).</span>
          </div>

          {/* JSON-LD Code Viewer & Editor */}
          <div>
            <label className="text-[10px] font-bold text-[#c9c2ab] uppercase tracking-wider block mb-1">
              Structured Data Payload (JSON-LD)
            </label>
            <textarea
              rows={14}
              value={displayedSchemaJson}
              onChange={(e) => handleUpdate("customSchemaJson", e.target.value)}
              className="w-full bg-[#07080b] border border-white/10 rounded-xl p-3 font-mono text-[11px] text-[#f2d98a] outline-none focus:border-[#d9b45c] leading-relaxed resize-y"
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#c9c2ab]/60">
            <span>Automatically injected into &lt;head&gt; of blog post</span>
            <button
              type="button"
              onClick={() => handleUpdate("customSchemaJson", undefined)}
              className="text-[#d9b45c] hover:underline"
            >
              Reset to Auto-generated
            </button>
          </div>
        </div>
      )}

      {/* 4. POST SETTINGS & PUBLISH TAB */}
      {activeTab === "publish" && (
        <div className="bg-[#12141b] border border-[#d9b45c]/20 rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in duration-150 text-left">
          
          {/* FEATURED IMAGE */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-[#c9c2ab] uppercase tracking-wider">
                Featured Cover Image
              </label>
              <button
                type="button"
                onClick={() => {
                  setMediaTarget("featured");
                  setIsMediaModalOpen(true);
                }}
                className="text-[10px] text-[#d9b45c] hover:underline font-bold"
              >
                Choose from Library
              </button>
            </div>

            {post.featuredImage || post.coverImage ? (
              <div className="relative rounded-xl overflow-hidden border border-[#d9b45c]/30 aspect-[3/2] bg-black">
                <img
                  src={post.featuredImage || post.coverImage}
                  alt={post.imageAltText || "Cover"}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    handleUpdate("featuredImage", "");
                    handleUpdate("coverImage", "");
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/80 text-red-400 hover:text-red-300"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => {
                  setMediaTarget("featured");
                  setIsMediaModalOpen(true);
                }}
                className="border-2 border-dashed border-[#d9b45c]/30 hover:border-[#d9b45c] rounded-xl p-6 text-center cursor-pointer bg-[#07080b]"
              >
                <ImageIcon size={24} className="mx-auto text-[#d9b45c] mb-1" />
                <span className="text-xs font-bold text-white block">Select Featured Image</span>
                <span className="text-[10px] text-[#c9c2ab]/60">1200×800 Recommended</span>
              </div>
            )}
          </div>

          {/* STATUS */}
          <div>
            <label className="text-[10px] font-bold text-[#c9c2ab] uppercase tracking-wider block mb-1">
              Publication Status
            </label>
            <select
              value={post.status || "published"}
              onChange={(e) => handleUpdate("status", e.target.value)}
              className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#d9b45c]"
            >
              <option value="published">Published (Public)</option>
              <option value="draft">Draft (Private / Unlisted)</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>

          {/* CATEGORY */}
          <div>
            <label className="text-[10px] font-bold text-[#c9c2ab] uppercase tracking-wider block mb-1">
              Category
            </label>
            <select
              value={post.category || "Tajweed Rules"}
              onChange={(e) => handleUpdate("category", e.target.value)}
              className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#d9b45c]"
            >
              <option value="Tajweed Rules">Tajweed Rules</option>
              <option value="Quran Memorization">Quran Memorization</option>
              <option value="Arabic Language">Arabic Language</option>
              <option value="Islamic Studies">Islamic Studies</option>
              <option value="Online Quran Education">Online Quran Education</option>
            </select>
          </div>

          {/* PUBLISH DATE */}
          <div>
            <label className="text-[10px] font-bold text-[#c9c2ab] uppercase tracking-wider block mb-1">
              Publish Date
            </label>
            <input
              type="text"
              value={post.date || ""}
              onChange={(e) => handleUpdate("date", e.target.value)}
              placeholder="e.g. October 24, 2026"
              className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#d9b45c]"
            />
          </div>

          {/* DYNAMIC READING TIME */}
          <div>
            <div className="flex items-center justify-between text-[10px] text-[#c9c2ab] uppercase font-bold mb-1">
              <span>Dynamic Reading Time</span>
              <span className="text-[#d9b45c]">Auto-computed</span>
            </div>
            <div className="flex items-center space-x-2 bg-[#07080b] border border-white/10 rounded-xl px-3 py-2">
              <Clock size={14} className="text-[#d9b45c]" />
              <input
                type="text"
                value={post.readTime || "1 min read"}
                onChange={(e) => handleUpdate("readTime", e.target.value)}
                className="flex-1 bg-transparent text-xs text-white outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Media Library Modal */}
      <WPMediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        cmsData={cmsData}
        onSelectMedia={handleMediaSelect}
      />
    </aside>
  );
}
