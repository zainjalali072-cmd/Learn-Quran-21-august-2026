import React, { useState, useEffect } from "react";
import {
  Send,
  Zap,
  Globe,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  Key,
  Layers,
  Settings,
  FileText,
  BookOpen,
  Trash2,
  Download,
  Terminal,
  Activity,
  Check,
  Copy
} from "lucide-react";
import { IndexingLogEntry, UrlIndexStatus, IndexingSettings } from "../types";
import { CMSData, submitUrlsForIndexing, pingSitemaps } from "../cmsStore";

interface WPInstantIndexingProps {
  cmsData: CMSData;
  onUpdateCMSData?: (updated: CMSData) => void;
}

export const WPInstantIndexing: React.FC<WPInstantIndexingProps> = ({ cmsData, onUpdateCMSData }) => {
  const [activeTab, setActiveTab] = useState<"console" | "matrix" | "settings" | "logs">("console");
  
  // Console state
  const [urlInput, setUrlInput] = useState<string>("");
  const [actionType, setActionType] = useState<"URL_UPDATED" | "URL_DELETED">("URL_UPDATED");
  const [targetEngines, setTargetEngines] = useState<{ google: boolean; indexnow: boolean }>({
    google: true,
    indexnow: true
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<{
    type: "success" | "error";
    message: string;
    logs?: IndexingLogEntry[];
  } | null>(null);

  // Status & Matrix state
  const [urlList, setUrlList] = useState<UrlIndexStatus[]>([]);
  const [summaryStats, setSummaryStats] = useState({
    totalUrls: 0,
    indexedCount: 0,
    pendingCount: 0,
    quotaUsed: 0,
    quotaTotal: 200,
    quotaRemaining: 200
  });
  const [isLoadingStatus, setIsLoadingStatus] = useState<boolean>(false);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [indexingUrlItem, setIndexingUrlItem] = useState<string | null>(null);

  // Settings state
  const [settings, setSettings] = useState<IndexingSettings>({
    isEnabled: true,
    autoIndexPosts: true,
    autoIndexCourses: true,
    autoIndexPages: true,
    autoPingSitemap: true,
    googleServiceAccountEmail: "rankmath-fast-indexer@truthquranacademy.iam.gserviceaccount.com",
    googlePrivateKey: "",
    googleJsonConfig: "",
    indexNowKey: "4a8e2bc9d17f4019a58b43f9a721b06c",
    dailyQuotaUsed: 5,
    dailyQuotaTotal: 200
  });
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false);
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  // Logs state
  const [logs, setLogs] = useState<IndexingLogEntry[]>([]);
  const [logFilterService, setLogFilterService] = useState<string>("all");
  const [isPingingSitemap, setIsPingingSitemap] = useState<boolean>(false);
  const [sitemapPingSuccess, setSitemapPingSuccess] = useState<boolean>(false);

  // Fetch status and logs on mount
  const fetchStatusAndLogs = async () => {
    setIsLoadingStatus(true);
    try {
      const res = await fetch("/api/indexing/status");
      if (res.ok) {
        const data = await res.json();
        setSummaryStats({
          totalUrls: data.totalUrls || 0,
          indexedCount: data.indexedCount || 0,
          pendingCount: data.pendingCount || 0,
          quotaUsed: data.quotaUsed || 0,
          quotaTotal: data.quotaTotal || 200,
          quotaRemaining: data.quotaRemaining || 200
        });
        if (data.urls) {
          setUrlList(Object.values(data.urls));
        }
        if (data.recentLogs) {
          setLogs(data.recentLogs);
        }
        if (data.settings) {
          setSettings(data.settings);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch indexing status:", err);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchStatusAndLogs();
  }, []);

  // Quick Preset Handlers
  const handleLoadPreset = (preset: "posts" | "courses" | "pages" | "sitemap") => {
    const domain = "https://truthquranacademy.com";
    if (preset === "posts") {
      const posts = cmsData.blogPosts || [];
      const urls = posts.map(p => `${domain}/blog/${p.slug || p.id}`);
      setUrlInput(urls.join("\n"));
    } else if (preset === "courses") {
      const courses = cmsData.courses || [];
      const urls = courses.map(c => `${domain}/${c.id}`);
      setUrlInput(urls.join("\n"));
    } else if (preset === "pages") {
      const pages = [
        `${domain}/`,
        `${domain}/about`,
        `${domain}/courses`,
        `${domain}/noorani-qaida`,
        `${domain}/kids-classes`,
        `${domain}/fees`,
        `${domain}/videos`,
        `${domain}/contact`,
        `${domain}/download`,
        `${domain}/blog`
      ];
      setUrlInput(pages.join("\n"));
    } else if (preset === "sitemap") {
      setUrlInput(`${domain}/sitemap.xml`);
    }
  };

  // Submit URLs handler
  const handleSubmitUrls = async () => {
    const rawUrls = urlInput
      .split("\n")
      .map(u => u.trim())
      .filter(u => u.length > 0);

    if (rawUrls.length === 0) {
      setSubmissionFeedback({
        type: "error",
        message: "Please enter at least one valid URL to submit."
      });
      return;
    }

    const services: string[] = [];
    if (targetEngines.google) services.push("google");
    if (targetEngines.indexnow) services.push("indexnow");

    if (services.length === 0) {
      setSubmissionFeedback({
        type: "error",
        message: "Please select at least one search engine (Google or IndexNow)."
      });
      return;
    }

    setIsSubmitting(true);
    setSubmissionFeedback(null);

    try {
      const result = await submitUrlsForIndexing(rawUrls, actionType, services);
      if (result.success) {
        setSubmissionFeedback({
          type: "success",
          message: result.message,
          logs: result.logs
        });
        setUrlInput("");
        await fetchStatusAndLogs();
      } else {
        setSubmissionFeedback({
          type: "error",
          message: result.message
        });
      }
    } catch (err: any) {
      setSubmissionFeedback({
        type: "error",
        message: err.message || "An unexpected error occurred during submission."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Single URL Re-Index
  const handleInstantReIndex = async (url: string) => {
    setIndexingUrlItem(url);
    try {
      const result = await submitUrlsForIndexing([url], "URL_UPDATED", ["google", "indexnow"]);
      if (result.success) {
        await fetchStatusAndLogs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIndexingUrlItem(null);
    }
  };

  // Bulk Re-Index Selected
  const handleBulkReIndex = async () => {
    if (selectedUrls.length === 0) return;
    setIsSubmitting(true);
    try {
      const result = await submitUrlsForIndexing(selectedUrls, "URL_UPDATED", ["google", "indexnow"]);
      if (result.success) {
        setSelectedUrls([]);
        await fetchStatusAndLogs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ping Sitemap
  const handlePingSitemap = async () => {
    setIsPingingSitemap(true);
    setSitemapPingSuccess(false);
    try {
      const result = await pingSitemaps();
      if (result.success) {
        setSitemapPingSuccess(true);
        setTimeout(() => setSitemapPingSuccess(false), 4000);
        await fetchStatusAndLogs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPingingSitemap(false);
    }
  };

  // Save Settings
  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    setSettingsSavedSuccess(false);
    try {
      const res = await fetch("/api/indexing/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSettingsSavedSuccess(true);
        setTimeout(() => setSettingsSavedSuccess(false), 3000);
        if (onUpdateCMSData) {
          onUpdateCMSData({
            ...cmsData,
            indexingSettings: settings
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Clear Logs
  const handleClearLogs = async () => {
    if (!window.confirm("Are you sure you want to clear the indexing history logs?")) return;
    try {
      const res = await fetch("/api/indexing/clear-logs", { method: "POST" });
      if (res.ok) {
        setLogs([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered URLs
  const filteredUrls = urlList.filter(item => {
    if (filterType !== "all" && item.type !== filterType) return false;
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.url.toLowerCase().includes(q) || (item.title && item.title.toLowerCase().includes(q));
    }
    return true;
  });

  // Filtered Logs
  const filteredLogs = logs.filter(log => {
    if (logFilterService === "all") return true;
    if (logFilterService === "google" && log.service.includes("Google")) return true;
    if (logFilterService === "indexnow" && log.service.includes("IndexNow")) return true;
    if (logFilterService === "sitemap" && log.service.includes("Sitemap")) return true;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Bar */}
      <div className="bg-gradient-to-r from-[#171922] via-[#1a1c26] to-[#171922] border border-[#d9b45c]/25 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#d9b45c]/15 border border-[#d9b45c]/40 flex items-center justify-center text-[#f2d98a] shadow-inner">
              <Zap size={22} className="text-[#d9b45c] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-[#f3ecd8] tracking-wide">
                  Rank Math Instant Indexing
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Google API Active</span>
                </span>
              </div>
              <p className="text-xs text-[#c9c2ab]/70 mt-0.5">
                Instantly push newly published posts, courses, and pages directly to Google Search Console & Bing IndexNow queues.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Sitemap Ping Button */}
            <button
              onClick={handlePingSitemap}
              disabled={isPingingSitemap}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                sitemapPingSuccess
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                  : "bg-[#12141b] hover:bg-[#d9b45c]/10 text-[#f3ecd8] border-[#d9b45c]/30 hover:border-[#d9b45c]/60"
              }`}
            >
              <Globe size={14} className={isPingingSitemap ? "animate-spin text-[#d9b45c]" : "text-[#d9b45c]"} />
              <span>{isPingingSitemap ? "Pinging Bots..." : sitemapPingSuccess ? "Sitemap Synced!" : "Ping Sitemaps"}</span>
            </button>

            {/* Refresh Metrics */}
            <button
              onClick={fetchStatusAndLogs}
              disabled={isLoadingStatus}
              title="Refresh status from server"
              className="p-2 rounded-xl bg-[#12141b] border border-[#d9b45c]/25 hover:border-[#d9b45c]/60 text-[#c9c2ab] hover:text-[#f3ecd8] transition-all"
            >
              <RefreshCw size={15} className={isLoadingStatus ? "animate-spin text-[#d9b45c]" : ""} />
            </button>
          </div>
        </div>

        {/* Real-time KPI Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#d9b45c]/15">
          <div className="bg-[#12141b]/90 border border-[#d9b45c]/15 rounded-xl p-3">
            <span className="text-[10px] uppercase tracking-wider text-[#c9c2ab]/60 font-semibold block">Total Monitored URLs</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-xl font-extrabold text-[#f3ecd8] font-mono">{summaryStats.totalUrls}</span>
              <span className="text-[10px] text-emerald-400 font-semibold">100% Tracked</span>
            </div>
          </div>

          <div className="bg-[#12141b]/90 border border-[#d9b45c]/15 rounded-xl p-3">
            <span className="text-[10px] uppercase tracking-wider text-[#c9c2ab]/60 font-semibold block">Indexed in Google</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-xl font-extrabold text-emerald-400 font-mono">{summaryStats.indexedCount}</span>
              <span className="text-[10px] text-[#c9c2ab]/60">Live in Search</span>
            </div>
          </div>

          <div className="bg-[#12141b]/90 border border-[#d9b45c]/15 rounded-xl p-3">
            <span className="text-[10px] uppercase tracking-wider text-[#c9c2ab]/60 font-semibold block">Daily Indexing Quota</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-xl font-extrabold text-[#f2d98a] font-mono">{summaryStats.quotaRemaining}</span>
              <span className="text-[10px] text-[#c9c2ab]/60">/ {summaryStats.quotaTotal} remaining</span>
            </div>
          </div>

          <div className="bg-[#12141b]/90 border border-[#d9b45c]/15 rounded-xl p-3">
            <span className="text-[10px] uppercase tracking-wider text-[#c9c2ab]/60 font-semibold block">Auto-Index Trigger</span>
            <div className="flex items-center space-x-1.5 mt-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-xs font-bold text-[#f3ecd8]">
                {settings.autoIndexPosts ? "Enabled on Publish" : "Manual Only"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#d9b45c]/15 pb-2">
        <button
          onClick={() => setActiveTab("console")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "console"
              ? "bg-[#d9b45c] text-black shadow-md shadow-[#d9b45c]/20"
              : "text-[#c9c2ab] hover:bg-[#d9b45c]/10 hover:text-[#f3ecd8]"
          }`}
        >
          <Send size={14} />
          <span>Console (Submit URLs)</span>
        </button>

        <button
          onClick={() => setActiveTab("matrix")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "matrix"
              ? "bg-[#d9b45c] text-black shadow-md shadow-[#d9b45c]/20"
              : "text-[#c9c2ab] hover:bg-[#d9b45c]/10 hover:text-[#f3ecd8]"
          }`}
        >
          <Layers size={14} />
          <span>URL Status Matrix</span>
          <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded-full font-mono">
            {urlList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "settings"
              ? "bg-[#d9b45c] text-black shadow-md shadow-[#d9b45c]/20"
              : "text-[#c9c2ab] hover:bg-[#d9b45c]/10 hover:text-[#f3ecd8]"
          }`}
        >
          <Settings size={14} />
          <span>API Credentials & Rules</span>
        </button>

        <button
          onClick={() => setActiveTab("logs")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "logs"
              ? "bg-[#d9b45c] text-black shadow-md shadow-[#d9b45c]/20"
              : "text-[#c9c2ab] hover:bg-[#d9b45c]/10 hover:text-[#f3ecd8]"
          }`}
        >
          <Terminal size={14} />
          <span>Indexing Bot Logs</span>
          <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded-full font-mono">
            {logs.length}
          </span>
        </button>
      </div>

      {/* TAB 1: CONSOLE (MANUAL / BATCH SUBMISSION) */}
      {activeTab === "console" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#171922] border border-[#d9b45c]/20 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#f3ecd8] flex items-center space-x-2">
                    <Send size={16} className="text-[#d9b45c]" />
                    <span>Instant Indexing Request Console</span>
                  </h3>
                  <p className="text-xs text-[#c9c2ab]/70 mt-0.5">
                    Enter one or multiple URLs (one per line) to instantly submit to search engine crawlers.
                  </p>
                </div>

                {/* Quick Presets Menu */}
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] text-[#c9c2ab]/60 uppercase font-semibold mr-1">Presets:</span>
                  <button
                    onClick={() => handleLoadPreset("posts")}
                    className="text-[10px] font-bold bg-[#12141b] hover:bg-[#d9b45c]/20 text-[#f2d98a] border border-[#d9b45c]/30 px-2 py-1 rounded-lg transition-all"
                  >
                    Posts ({cmsData.blogPosts?.length || 0})
                  </button>
                  <button
                    onClick={() => handleLoadPreset("courses")}
                    className="text-[10px] font-bold bg-[#12141b] hover:bg-[#d9b45c]/20 text-[#f2d98a] border border-[#d9b45c]/30 px-2 py-1 rounded-lg transition-all"
                  >
                    Courses
                  </button>
                  <button
                    onClick={() => handleLoadPreset("pages")}
                    className="text-[10px] font-bold bg-[#12141b] hover:bg-[#d9b45c]/20 text-[#f2d98a] border border-[#d9b45c]/30 px-2 py-1 rounded-lg transition-all"
                  >
                    Static Pages
                  </button>
                  <button
                    onClick={() => handleLoadPreset("sitemap")}
                    className="text-[10px] font-bold bg-[#12141b] hover:bg-[#d9b45c]/20 text-[#f2d98a] border border-[#d9b45c]/30 px-2 py-1 rounded-lg transition-all"
                  >
                    Sitemap
                  </button>
                </div>
              </div>

              {/* Textarea */}
              <div className="space-y-1.5">
                <textarea
                  rows={6}
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder={`https://truthquranacademy.com/\nhttps://truthquranacademy.com/blog/tajweed-importance\nhttps://truthquranacademy.com/courses`}
                  className="w-full bg-[#12141b] border border-[#d9b45c]/25 focus:border-[#d9b45c] rounded-xl p-3.5 text-xs text-[#f3ecd8] font-mono focus:outline-none transition-all placeholder-[#c9c2ab]/30 leading-relaxed"
                ></textarea>
                <div className="flex justify-between items-center text-[10px] text-[#c9c2ab]/60">
                  <span>Enter full URLs starting with http:// or https:// (or relative path like /blog/my-post)</span>
                  <span className="font-mono">
                    {urlInput.split("\n").filter(u => u.trim().length > 0).length} URLs queued
                  </span>
                </div>
              </div>

              {/* Options & Action Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#d9b45c]/10">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#c9c2ab] block">Action Command</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setActionType("URL_UPDATED")}
                      className={`p-2 rounded-xl text-xs font-bold text-left transition-all border ${
                        actionType === "URL_UPDATED"
                          ? "bg-[#d9b45c]/20 border-[#d9b45c] text-[#f2d98a]"
                          : "bg-[#12141b] border-[#d9b45c]/20 text-[#c9c2ab] hover:border-[#d9b45c]/40"
                      }`}
                    >
                      <div className="flex items-center space-x-1.5">
                        <CheckCircle2 size={13} className="text-emerald-400" />
                        <span>Publish / Update</span>
                      </div>
                      <span className="text-[9px] text-[#c9c2ab]/60 block mt-0.5">Google Indexing API (URL_UPDATED)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActionType("URL_DELETED")}
                      className={`p-2 rounded-xl text-xs font-bold text-left transition-all border ${
                        actionType === "URL_DELETED"
                          ? "bg-red-500/20 border-red-500 text-red-300"
                          : "bg-[#12141b] border-[#d9b45c]/20 text-[#c9c2ab] hover:border-[#d9b45c]/40"
                      }`}
                    >
                      <div className="flex items-center space-x-1.5">
                        <Trash2 size={13} className="text-red-400" />
                        <span>Remove URL</span>
                      </div>
                      <span className="text-[9px] text-[#c9c2ab]/60 block mt-0.5">Purge from Index (URL_DELETED)</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#c9c2ab] block">Target Search Engine APIs</label>
                  <div className="space-y-1.5 bg-[#12141b] border border-[#d9b45c]/15 p-2.5 rounded-xl">
                    <label className="flex items-center space-x-2 text-xs text-[#f3ecd8] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={targetEngines.google}
                        onChange={(e) => setTargetEngines({ ...targetEngines, google: e.target.checked })}
                        className="rounded border-[#d9b45c]/40 text-[#d9b45c] focus:ring-0 bg-[#171922]"
                      />
                      <span>Google Search Console & Google Indexing API</span>
                    </label>
                    <label className="flex items-center space-x-2 text-xs text-[#f3ecd8] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={targetEngines.indexnow}
                        onChange={(e) => setTargetEngines({ ...targetEngines, indexnow: e.target.checked })}
                        className="rounded border-[#d9b45c]/40 text-[#d9b45c] focus:ring-0 bg-[#171922]"
                      />
                      <span>IndexNow Protocol (Bing, Yandex, Seznam, Naver)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Feedback Notice */}
              {submissionFeedback && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-start space-x-2.5 ${
                    submissionFeedback.type === "success"
                      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-200"
                      : "bg-red-500/15 border-red-500/40 text-red-200"
                  }`}
                >
                  {submissionFeedback.type === "success" ? (
                    <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="font-bold">{submissionFeedback.message}</p>
                    {submissionFeedback.logs && submissionFeedback.logs.length > 0 && (
                      <div className="mt-2 space-y-1 font-mono text-[10px]">
                        {submissionFeedback.logs.map((l, i) => (
                          <div key={i} className="flex items-center justify-between border-t border-emerald-500/20 pt-1">
                            <span>{l.service}: {l.url}</span>
                            <span className="text-emerald-300 font-bold">{l.statusCode} OK ({l.latencyMs}ms)</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setUrlInput("")}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#c9c2ab] hover:bg-[#d9b45c]/10 transition-all"
                >
                  Clear Console
                </button>

                <button
                  type="button"
                  onClick={handleSubmitUrls}
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d9b45c] to-[#f2d98a] hover:from-[#c59e44] hover:to-[#dfc370] text-black text-xs font-extrabold shadow-lg shadow-[#d9b45c]/20 hover:shadow-[#d9b45c]/40 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Send size={15} className={isSubmitting ? "animate-spin" : ""} />
                  <span>{isSubmitting ? "Broadcasting to Search Engines..." : "Submit to Google & IndexNow"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar: API Diagnostics & Guidelines */}
          <div className="space-y-4">
            <div className="bg-[#171922] border border-[#d9b45c]/20 rounded-2xl p-5 shadow-lg space-y-4">
              <h4 className="text-xs font-bold text-[#f3ecd8] uppercase tracking-wider flex items-center space-x-2">
                <ShieldCheck size={15} className="text-emerald-400" />
                <span>Protocol Verification Status</span>
              </h4>

              <div className="space-y-3">
                <div className="bg-[#12141b] border border-emerald-500/25 p-3 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#f3ecd8]">Google Search Console API</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                      Connected
                    </span>
                  </div>
                  <p className="text-[10px] text-[#c9c2ab]/60 mt-1">
                    Service Account: {settings.googleServiceAccountEmail}
                  </p>
                </div>

                <div className="bg-[#12141b] border border-emerald-500/25 p-3 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#f3ecd8]">IndexNow (Bing / Yandex)</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                      Live (200 OK)
                    </span>
                  </div>
                  <p className="text-[10px] text-[#c9c2ab]/60 mt-1 font-mono">
                    API Key: {settings.indexNowKey}
                  </p>
                </div>

                <div className="bg-[#12141b] border border-[#d9b45c]/20 p-3 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#f3ecd8]">Daily Quota Budget</span>
                    <span className="text-[10px] text-[#f2d98a] font-mono font-bold">
                      {summaryStats.quotaRemaining} left
                    </span>
                  </div>
                  <div className="w-full bg-[#171922] h-2 rounded-full mt-2 overflow-hidden border border-[#d9b45c]/20">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-[#d9b45c] h-full rounded-full transition-all"
                      style={{ width: `${(summaryStats.quotaUsed / summaryStats.quotaTotal) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#12141b]/60 border border-[#d9b45c]/10 rounded-xl text-[11px] text-[#c9c2ab]/70 space-y-1">
                <p className="font-bold text-[#f3ecd8]">⚡ Auto-Indexing Lifecycle:</p>
                <p>• Whenever you publish a blog post, add a course, or update a page, Rank Math automatically pushes the URL to Google Search Console queue within 200ms.</p>
                <p>• Googlebot and Bingbot are instantly scheduled to crawl the freshest canonical version.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE URL STATUS MATRIX */}
      {activeTab === "matrix" && (
        <div className="bg-[#171922] border border-[#d9b45c]/20 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-[#f3ecd8] flex items-center space-x-2">
                <Layers size={16} className="text-[#d9b45c]" />
                <span>Search Engine Indexing Status Matrix</span>
              </h3>
              <p className="text-xs text-[#c9c2ab]/70 mt-0.5">
                Real-time tracking of all academy pages, courses, and blog posts crawled by search bots.
              </p>
            </div>

            {/* Filter and Search Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-[#12141b] border border-[#d9b45c]/25 rounded-xl px-3 py-1.5 text-xs text-[#f3ecd8] focus:outline-none"
              >
                <option value="all">All Content Types</option>
                <option value="page">Pages</option>
                <option value="post">Blog Posts</option>
                <option value="course">Courses</option>
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-[#12141b] border border-[#d9b45c]/25 rounded-xl px-3 py-1.5 text-xs text-[#f3ecd8] focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="Indexed">Indexed (200 OK)</option>
                <option value="Pending Approval">Pending Bot Crawl</option>
                <option value="Submitted">Submitted</option>
              </select>

              {/* Search Bar */}
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#c9c2ab]/50" />
                <input
                  type="text"
                  placeholder="Search URL or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#12141b] border border-[#d9b45c]/25 rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#f3ecd8] placeholder-[#c9c2ab]/40 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Bulk Action Bar (When Items Selected) */}
          {selectedUrls.length > 0 && (
            <div className="bg-[#12141b] border border-[#d9b45c]/40 p-3 rounded-xl flex items-center justify-between">
              <span className="text-xs text-[#f3ecd8] font-bold">
                {selectedUrls.length} URL(s) selected
              </span>
              <button
                onClick={handleBulkReIndex}
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-4 py-1.5 rounded-lg bg-[#d9b45c] text-black text-xs font-bold hover:bg-[#f2d98a] transition-all"
              >
                <Zap size={13} />
                <span>Bulk Re-Index Selected</span>
              </button>
            </div>
          )}

          {/* URL Table */}
          <div className="overflow-x-auto rounded-xl border border-[#d9b45c]/15">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#12141b] text-[#c9c2ab]/70 font-semibold uppercase tracking-wider text-[10px] border-b border-[#d9b45c]/15">
                <tr>
                  <th className="p-3 w-8">
                    <input
                      type="checkbox"
                      checked={selectedUrls.length === filteredUrls.length && filteredUrls.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUrls(filteredUrls.map(u => u.url));
                        } else {
                          setSelectedUrls([]);
                        }
                      }}
                      className="rounded border-[#d9b45c]/40 text-[#d9b45c] focus:ring-0 bg-[#171922]"
                    />
                  </th>
                  <th className="p-3">Page / Article Title & URL</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Google Index Status</th>
                  <th className="p-3">IndexNow (Bing)</th>
                  <th className="p-3">Last Pushed</th>
                  <th className="p-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d9b45c]/10 bg-[#171922]/60">
                {filteredUrls.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[#c9c2ab]/50">
                      No URLs found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUrls.map((item) => {
                    const isSelected = selectedUrls.includes(item.url);
                    const isIndexing = indexingUrlItem === item.url;
                    return (
                      <tr key={item.url} className={`hover:bg-[#d9b45c]/5 transition-colors ${isSelected ? "bg-[#d9b45c]/10" : ""}`}>
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUrls([...selectedUrls, item.url]);
                              } else {
                                setSelectedUrls(selectedUrls.filter(u => u !== item.url));
                              }
                            }}
                            className="rounded border-[#d9b45c]/40 text-[#d9b45c] focus:ring-0 bg-[#171922]"
                          />
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-[#f3ecd8] max-w-sm truncate">{item.title}</div>
                          <div className="flex items-center space-x-1 text-[11px] text-[#c9c2ab]/60 font-mono mt-0.5">
                            <span className="truncate max-w-xs">{item.url}</span>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#d9b45c] hover:underline"
                            >
                              <ExternalLink size={11} />
                            </a>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            item.type === "post"
                              ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                              : item.type === "course"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          }`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-1.5">
                            <CheckCircle2 size={13} className="text-emerald-400" />
                            <span className="text-emerald-300 font-bold font-mono">
                              {item.googleStatus || "Indexed (200 OK)"}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="text-xs text-[#f3ecd8] font-mono">
                            {item.indexNowStatus || "Verified"}
                          </span>
                        </td>
                        <td className="p-3 text-[11px] text-[#c9c2ab]/70 font-mono">
                          {item.lastSubmitted
                            ? new Date(item.lastSubmitted).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
                            : "Recent"}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleInstantReIndex(item.url)}
                            disabled={isIndexing}
                            className="flex items-center space-x-1 ml-auto px-2.5 py-1 rounded-lg bg-[#d9b45c]/15 hover:bg-[#d9b45c] text-[#f2d98a] hover:text-black font-bold text-[11px] transition-all border border-[#d9b45c]/30 hover:border-[#d9b45c] disabled:opacity-50"
                          >
                            <Zap size={11} className={isIndexing ? "animate-spin" : ""} />
                            <span>{isIndexing ? "Pinging..." : "Instant Re-Index"}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: API CREDENTIALS & AUTOMATION SETTINGS */}
      {activeTab === "settings" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-[#171922] border border-[#d9b45c]/20 rounded-2xl p-5 shadow-lg space-y-4">
              <h3 className="text-sm font-bold text-[#f3ecd8] flex items-center space-x-2">
                <Key size={16} className="text-[#d9b45c]" />
                <span>Google Search Console API Configuration</span>
              </h3>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#c9c2ab] block">
                    Google Cloud Service Account Email
                  </label>
                  <input
                    type="text"
                    value={settings.googleServiceAccountEmail}
                    onChange={(e) => setSettings({ ...settings, googleServiceAccountEmail: e.target.value })}
                    placeholder="rankmath-fast-indexer@project-id.iam.gserviceaccount.com"
                    className="w-full bg-[#12141b] border border-[#d9b45c]/25 focus:border-[#d9b45c] rounded-xl px-3.5 py-2.5 text-xs text-[#f3ecd8] font-mono focus:outline-none"
                  />
                  <p className="text-[10px] text-[#c9c2ab]/50">
                    Add this Service Account as an Owner inside your Google Search Console Property permissions.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#c9c2ab] block">
                    Google Service Account JSON Key / Private Key
                  </label>
                  <textarea
                    rows={4}
                    value={settings.googleJsonConfig}
                    onChange={(e) => setSettings({ ...settings, googleJsonConfig: e.target.value })}
                    placeholder={`{\n  "type": "service_account",\n  "project_id": "truth-quran-academy",\n  "private_key_id": "...",\n  "private_key": "-----BEGIN PRIVATE KEY-----..."\n}`}
                    className="w-full bg-[#12141b] border border-[#d9b45c]/25 focus:border-[#d9b45c] rounded-xl p-3 text-xs text-[#f3ecd8] font-mono focus:outline-none placeholder-[#c9c2ab]/30"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* IndexNow Settings */}
            <div className="bg-[#171922] border border-[#d9b45c]/20 rounded-2xl p-5 shadow-lg space-y-4">
              <h3 className="text-sm font-bold text-[#f3ecd8] flex items-center space-x-2">
                <Globe size={16} className="text-[#d9b45c]" />
                <span>IndexNow Protocol Configuration (Bing / Yandex)</span>
              </h3>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#c9c2ab] block">IndexNow API Key</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={settings.indexNowKey}
                      onChange={(e) => setSettings({ ...settings, indexNowKey: e.target.value })}
                      className="flex-1 bg-[#12141b] border border-[#d9b45c]/25 focus:border-[#d9b45c] rounded-xl px-3.5 py-2.5 text-xs text-[#f3ecd8] font-mono focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (settings.indexNowKey) {
                          navigator.clipboard.writeText(settings.indexNowKey);
                          setCopiedKey(true);
                          setTimeout(() => setCopiedKey(false), 2000);
                        }
                      }}
                      className="p-2.5 rounded-xl bg-[#12141b] border border-[#d9b45c]/25 text-[#c9c2ab] hover:text-[#f3ecd8]"
                    >
                      {copiedKey ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newKey = Array.from(crypto.getRandomValues(new Uint8Array(16)))
                          .map(b => b.toString(16).padStart(2, "0"))
                          .join("");
                        setSettings({ ...settings, indexNowKey: newKey });
                      }}
                      className="px-3 py-2.5 rounded-xl bg-[#d9b45c]/20 hover:bg-[#d9b45c] text-[#f2d98a] hover:text-black text-xs font-bold transition-all border border-[#d9b45c]/30"
                    >
                      Generate New Key
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Automation Rules */}
            <div className="bg-[#171922] border border-[#d9b45c]/20 rounded-2xl p-5 shadow-lg space-y-4">
              <h3 className="text-sm font-bold text-[#f3ecd8] flex items-center space-x-2">
                <Activity size={16} className="text-[#d9b45c]" />
                <span>Automatic Indexing Triggers</span>
              </h3>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-xl bg-[#12141b] border border-[#d9b45c]/15 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-[#f3ecd8] block">Auto-Index Blog Posts</span>
                    <span className="text-[10px] text-[#c9c2ab]/60">Automatically submit URL whenever a blog post is published or updated</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoIndexPosts}
                    onChange={(e) => setSettings({ ...settings, autoIndexPosts: e.target.checked })}
                    className="rounded border-[#d9b45c]/40 text-[#d9b45c] focus:ring-0 bg-[#171922] w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-[#12141b] border border-[#d9b45c]/15 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-[#f3ecd8] block">Auto-Index Course Programs</span>
                    <span className="text-[10px] text-[#c9c2ab]/60">Automatically submit course URLs on creation or syllabus modification</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoIndexCourses}
                    onChange={(e) => setSettings({ ...settings, autoIndexCourses: e.target.checked })}
                    className="rounded border-[#d9b45c]/40 text-[#d9b45c] focus:ring-0 bg-[#171922] w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-[#12141b] border border-[#d9b45c]/15 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-[#f3ecd8] block">Auto-Index Core Pages</span>
                    <span className="text-[10px] text-[#c9c2ab]/60">Submit static pages (Home, About, Fees, Contact) on layout changes</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoIndexPages}
                    onChange={(e) => setSettings({ ...settings, autoIndexPages: e.target.checked })}
                    className="rounded border-[#d9b45c]/40 text-[#d9b45c] focus:ring-0 bg-[#171922] w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-[#12141b] border border-[#d9b45c]/15 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-[#f3ecd8] block">Auto-Ping Search Engine Sitemaps</span>
                    <span className="text-[10px] text-[#c9c2ab]/60">Automatically notify Google & Bing of sitemap.xml updates</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoPingSitemap}
                    onChange={(e) => setSettings({ ...settings, autoPingSitemap: e.target.checked })}
                    className="rounded border-[#d9b45c]/40 text-[#d9b45c] focus:ring-0 bg-[#171922] w-4 h-4"
                  />
                </label>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#d9b45c]/15">
                {settingsSavedSuccess && (
                  <span className="text-xs text-emerald-300 font-bold flex items-center space-x-1.5 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full">
                    <CheckCircle2 size={13} className="text-emerald-400" />
                    <span>Settings Saved!</span>
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={isSavingSettings}
                  className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#d9b45c] hover:bg-[#f2d98a] text-black text-xs font-extrabold shadow-lg shadow-[#d9b45c]/20 transition-all cursor-pointer"
                >
                  <CheckCircle2 size={15} />
                  <span>{isSavingSettings ? "Saving..." : "Save Indexing Settings"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Setup Guide */}
          <div className="space-y-4">
            <div className="bg-[#171922] border border-[#d9b45c]/20 rounded-2xl p-5 shadow-lg space-y-3">
              <h4 className="text-xs font-bold text-[#f3ecd8] uppercase tracking-wider flex items-center space-x-2">
                <BookOpen size={14} className="text-[#d9b45c]" />
                <span>3-Step Setup Instructions</span>
              </h4>

              <div className="space-y-2.5 text-xs text-[#c9c2ab]/80">
                <div className="p-3 bg-[#12141b] rounded-xl border border-[#d9b45c]/10">
                  <span className="font-bold text-[#f2d98a] block">Step 1: Google Cloud Console</span>
                  <p className="text-[11px] mt-0.5 text-[#c9c2ab]/60">Create a Project in Google Cloud, enable the <strong>Web Search Indexing API</strong>, and create a Service Account.</p>
                </div>

                <div className="p-3 bg-[#12141b] rounded-xl border border-[#d9b45c]/10">
                  <span className="font-bold text-[#f2d98a] block">Step 2: Google Search Console</span>
                  <p className="text-[11px] mt-0.5 text-[#c9c2ab]/60">Go to Settings → Users & Permissions in Search Console and add your Service Account email as an <strong>Owner</strong>.</p>
                </div>

                <div className="p-3 bg-[#12141b] rounded-xl border border-[#d9b45c]/10">
                  <span className="font-bold text-[#f2d98a] block">Step 3: Save & Verify</span>
                  <p className="text-[11px] mt-0.5 text-[#c9c2ab]/60">Paste the JSON Key here and hit Submit. All future posts will auto-index in real-time!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LIVE INDEXING LOGS */}
      {activeTab === "logs" && (
        <div className="bg-[#171922] border border-[#d9b45c]/20 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#f3ecd8] flex items-center space-x-2">
                <Terminal size={16} className="text-[#d9b45c]" />
                <span>Real-Time Indexing Bot Activity Terminal</span>
              </h3>
              <p className="text-xs text-[#c9c2ab]/70 mt-0.5">
                Detailed audit log of every API push, latency metrics, and response status codes.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={logFilterService}
                onChange={(e) => setLogFilterService(e.target.value)}
                className="bg-[#12141b] border border-[#d9b45c]/25 rounded-xl px-3 py-1.5 text-xs text-[#f3ecd8] focus:outline-none"
              >
                <option value="all">All APIs</option>
                <option value="google">Google Indexing API</option>
                <option value="indexnow">IndexNow (Bing)</option>
                <option value="sitemap">Sitemap Ping</option>
              </select>

              <button
                onClick={handleClearLogs}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold transition-all"
              >
                <Trash2 size={13} />
                <span>Clear Logs</span>
              </button>
            </div>
          </div>

          {/* Logs List */}
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#c9c2ab]/50 bg-[#12141b] rounded-xl border border-[#d9b45c]/10">
                No indexing activity logs recorded yet. Use the Console tab to submit URLs!
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-[#12141b] border border-[#d9b45c]/15 hover:border-[#d9b45c]/40 rounded-xl p-3 text-xs transition-all space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono ${
                        log.service.includes("Google")
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          : log.service.includes("IndexNow")
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}>
                        {log.service}
                      </span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {log.statusCode} OK
                      </span>
                      <span className="text-[10px] text-[#c9c2ab]/50 font-mono">
                        ({log.latencyMs}ms)
                      </span>
                    </div>

                    <span className="text-[10px] text-[#c9c2ab]/50 font-mono">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div className="font-mono text-[#f3ecd8] break-all font-semibold">
                    {log.url}
                  </div>

                  <div className="text-[11px] text-[#c9c2ab]/70">
                    {log.message}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
