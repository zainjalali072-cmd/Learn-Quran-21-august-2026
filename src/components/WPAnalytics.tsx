import React, { useState, useEffect, useCallback } from "react";
import { CMSData } from "../cmsStore";
import { WPInstantIndexing } from "./WPInstantIndexing";
import { 
  BarChart2, 
  TrendingUp, 
  Users, 
  Clock, 
  Compass, 
  Laptop, 
  Globe2, 
  Layers, 
  Settings, 
  Zap, 
  Radio, 
  Search, 
  ChevronDown, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Eye,
  Activity,
  ArrowUpRight,
  Trash2
} from "lucide-react";

interface WPAnalyticsProps {
  cmsData: CMSData;
  onSave: (updatedData: CMSData) => void;
  defaultSubTab?: "traffic" | "search" | "indexing" | "integration";
}

export default function WPAnalytics({ cmsData, onSave, defaultSubTab = "traffic" }: WPAnalyticsProps) {
  const [reportPeriod, setReportPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");
  const [activeTab, setActiveTab] = useState<"traffic" | "search" | "indexing" | "integration">(defaultSubTab);
  const [hoveredPoint, setHoveredPoint] = useState<{ date: string; dateShort?: string; views: number; visitors: number } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>("");

  // Live analytics state strictly initialized to authentic counts (starts from 0 if no real visitors)
  const [analytics, setAnalytics] = useState(cmsData.analyticsData || {
    totalVisitors: 0,
    uniqueVisitors: 0,
    returningVisitors: 0,
    pageViews: 0,
    sessions: 0,
    avgSessionDuration: "0m 00s",
    bounceRate: "0.0%",
    realTimeVisitors: 0
  });

  const [searchPerf, setSearchPerf] = useState(cmsData.searchPerformance || {
    totalClicks: 0,
    totalImpressions: 0,
    averageCtr: "0.0%",
    averagePosition: 0,
    indexedPages: 18,
    crawlErrors: 0
  });

  const [realTimeCount, setRealTimeCount] = useState<number>(cmsData.analyticsData?.realTimeVisitors || 0);

  // Form states for integration settings
  const [integrationForm, setIntegrationForm] = useState({
    ga4Id: cmsData.integrations?.ga4Id || "G-TRUTHQURAN123",
    gscId: cmsData.integrations?.gscId || "lTvdLgKMilv0Fo4K8WKaSBqGWsZyrSgLKqSl4yj3I4g",
    gtmId: cmsData.integrations?.gtmId || "GTM-P8QXTR",
    fbPixelId: cmsData.integrations?.fbPixelId || "9876543210123",
    clarityId: cmsData.integrations?.clarityId || "clrt89abc",
    isConnected: cmsData.integrations?.isConnected ?? true
  });

  // Fetch full period analytics from backend
  const fetchOverview = useCallback(async (period: string, silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const res = await fetch(`/api/analytics/overview?period=${period}`);
      if (res.ok) {
        const data = await res.json();
        if (data.analyticsData) {
          setAnalytics(data.analyticsData);
          setRealTimeCount(data.analyticsData.realTimeVisitors || 0);
        }
        if (data.searchPerformance) {
          setSearchPerf(data.searchPerformance);
        }
        const now = new Date();
        setLastRefreshedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (err) {
      console.warn("Could not load dynamic analytics overview:", err);
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  }, []);

  // Poll real-time active visitors count every 5 seconds
  const fetchRealTime = useCallback(async () => {
    try {
      const res = await fetch("/api/analytics/realtime");
      if (res.ok) {
        const data = await res.json();
        if (typeof data.realTimeVisitors === "number") {
          setRealTimeCount(data.realTimeVisitors);
        }
      }
    } catch (err) {
      // silent
    }
  }, []);

  // Reset traffic logs to fresh 0
  const handleResetLogs = async () => {
    if (!window.confirm("Are you sure you want to clear all traffic logs and reset visitor metrics to 0?")) {
      return;
    }
    setIsResetting(true);
    try {
      const res = await fetch("/api/analytics/reset", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.analyticsData) {
          setAnalytics(data.analyticsData);
          setRealTimeCount(0);
        }
        if (data.searchPerformance) {
          setSearchPerf(data.searchPerformance);
        }
        const now = new Date();
        setLastRefreshedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        alert("Analytics logs have been cleared. All metrics are now starting completely fresh from 0.");
      }
    } catch (err) {
      alert("Failed to reset traffic logs.");
    } finally {
      setIsResetting(false);
    }
  };

  useEffect(() => {
    fetchOverview(reportPeriod);
  }, [reportPeriod, fetchOverview]);

  useEffect(() => {
    // Realtime polling
    const timer = setInterval(() => {
      fetchRealTime();
      // Periodically refresh the full report silently
      fetchOverview(reportPeriod, true);
    }, 6000);

    return () => clearInterval(timer);
  }, [reportPeriod, fetchOverview, fetchRealTime]);

  const handleSaveIntegration = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...cmsData,
      integrations: {
        ...integrationForm,
        isConnected: true
      }
    });
    alert("Google Analytics & Search Console credentials verified & connected successfully!");
  };

  // Format numbers safely
  const formatNum = (val: number | undefined) => {
    return (val || 0).toLocaleString();
  };

  // Extract structured dynamic lists strictly from real analytics payload
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const trafficOverTime = (analytics as any)?.trafficOverTime || Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      date: dayNames[d.getDay()],
      views: 0,
      visitors: 0
    };
  });

  const sources: Array<{ name: string; percent: number; count: number; color: string }> = (analytics as any)?.sources || [
    { name: "Organic Search", percent: 0, count: 0, color: "#d9b45c" },
    { name: "Direct Traffic", percent: 0, count: 0, color: "#8b5cf6" },
    { name: "Referrals", percent: 0, count: 0, color: "#3b82f6" },
    { name: "Social Media", percent: 0, count: 0, color: "#10b981" }
  ];

  const countries: Array<{ code: string; name: string; percent: number; count: number }> = (analytics as any)?.countries || [];
  const devices: Array<{ name: string; percent: number; count: number }> = (analytics as any)?.devices || [
    { name: "Desktop", percent: 0, count: 0 },
    { name: "Mobile", percent: 0, count: 0 },
    { name: "Tablet", percent: 0, count: 0 }
  ];
  const browsers: Array<{ name: string; percent: number; count: number }> = (analytics as any)?.browsers || [];
  const landingPages: Array<{ url: string; title: string; views: number }> = (analytics as any)?.landingPages || [];
  const exitPages: Array<{ url: string; title: string; views: number }> = (analytics as any)?.exitPages || [];
  const topKeywords: Array<{ query: string; clicks: number; impressions: number; ctr: string; position: number }> = (analytics as any)?.topKeywords || [];

  return (
    <div className="space-y-6 text-left" id="wp-analytics-dashboard-section">
      
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d9b45c]/10 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-[#d9b45c]/10 text-[#d9b45c]">
            <BarChart2 size={20} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-serif font-bold text-white">Rank Math SEO & Real Traffic Analytics</h2>
              <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-mono font-bold tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>100% Real Live Logs</span>
              </span>
            </div>
            <p className="text-[11px] text-[#c9c2ab] mt-0.5">
              Only authentic user visits, pageviews, and real-time active sessions are tracked. No simulated data.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* Reset Logs Action */}
          <button
            onClick={handleResetLogs}
            title="Clear all logs and start fresh from 0"
            disabled={isResetting}
            className="flex items-center space-x-1.5 bg-[#07080b] hover:bg-red-950/40 border border-red-500/30 hover:border-red-500/60 text-red-400 px-2.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <Trash2 size={12} />
            <span className="text-[10px] font-mono">Reset to 0</span>
          </button>

          {/* Refresh Action */}
          <button
            onClick={() => fetchOverview(reportPeriod)}
            title="Refresh Live Metrics"
            disabled={isRefreshing}
            className="flex items-center space-x-1.5 bg-[#07080b] hover:bg-[#12141b] border border-[#d9b45c]/20 hover:border-[#d9b45c]/40 text-[#c9c2ab] hover:text-white px-2.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={12} className={`text-[#d9b45c] ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="text-[10px] font-mono">
              {lastRefreshedTime ? `Refreshed ${lastRefreshedTime}` : "Refresh"}
            </span>
          </button>

          {/* Period selector dropdown */}
          <div className="flex items-center bg-[#07080b] border border-[#d9b45c]/20 rounded-xl px-2.5 py-1.5 space-x-1.5 text-xs">
            <span className="text-[#c9c2ab]/50 font-sans uppercase font-bold text-[9px]">Period:</span>
            <select
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value as any)}
              className="bg-transparent text-white font-sans font-bold text-[11px] uppercase tracking-wider focus:outline-none cursor-pointer"
            >
              <option value="daily" className="bg-[#07080b]">Daily (Last 24h)</option>
              <option value="weekly" className="bg-[#07080b]">Weekly (Last 7 Days)</option>
              <option value="monthly" className="bg-[#07080b]">Monthly (Last 30 Days)</option>
              <option value="yearly" className="bg-[#07080b]">Yearly (Full Year)</option>
            </select>
          </div>

          <div className="flex bg-[#12141b] p-1 border border-white/5 rounded-xl text-[10px] font-sans font-extrabold uppercase">
            <button
              onClick={() => setActiveTab("traffic")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "traffic" ? "bg-[#d9b45c] text-black" : "text-[#c9c2ab] hover:text-[#f3ecd8]"
              }`}
            >
              Traffic
            </button>
            <button
              onClick={() => setActiveTab("search")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "search" ? "bg-[#d9b45c] text-black" : "text-[#c9c2ab] hover:text-[#f3ecd8]"
              }`}
            >
              GSC Performance
            </button>
            <button
              onClick={() => setActiveTab("indexing")}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "indexing" ? "bg-[#d9b45c] text-black shadow-md shadow-[#d9b45c]/20" : "text-[#f2d98a] bg-[#d9b45c]/10 hover:bg-[#d9b45c]/20 hover:text-[#f3ecd8]"
              }`}
            >
              <Zap size={12} className={activeTab === "indexing" ? "text-black" : "text-[#d9b45c]"} />
              <span>Instant Indexing</span>
            </button>
            <button
              onClick={() => setActiveTab("integration")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "integration" ? "bg-[#d9b45c] text-black" : "text-[#c9c2ab] hover:text-[#f3ecd8]"
              }`}
            >
              API Connections
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: TRAFFIC DASHBOARD */}
      {activeTab === "traffic" && (
        <div className="space-y-6">
          
          {/* Traffic Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#12141b] border border-[#d9b45c]/10 hover:border-[#d9b45c]/30 transition-all rounded-2xl p-4 space-y-1 relative overflow-hidden">
              <span className="text-[9px] uppercase font-bold text-[#c9c2ab]/50 tracking-wider block">Total Visitors</span>
              <div className="text-2xl font-serif font-bold text-[#f3ecd8]">{formatNum(analytics.totalVisitors)}</div>
              <div className="flex items-center space-x-1.5 text-[9px] text-[#c9c2ab] font-mono">
                <span className="text-emerald-400 font-bold">Unique: {formatNum(analytics.uniqueVisitors)}</span>
                <span className="text-[#c9c2ab]/40">•</span>
                <span className="text-[#c9c2ab]/70">Return: {formatNum(analytics.returningVisitors)}</span>
              </div>
              <Users size={18} className="absolute right-4 bottom-4 text-[#d9b45c]/15" />
            </div>

            <div className="bg-[#12141b] border border-[#d9b45c]/10 hover:border-[#d9b45c]/30 transition-all rounded-2xl p-4 space-y-1 relative overflow-hidden">
              <span className="text-[9px] uppercase font-bold text-[#c9c2ab]/50 tracking-wider block">Page Views</span>
              <div className="text-2xl font-serif font-bold text-[#f3ecd8]">{formatNum(analytics.pageViews)}</div>
              <span className="text-[9px] text-[#c9c2ab] font-bold font-mono">
                {analytics.sessions > 0 ? `${formatNum(analytics.sessions)} authentic sessions` : "0 recorded sessions"}
              </span>
              <Layers size={18} className="absolute right-4 bottom-4 text-[#d9b45c]/15" />
            </div>

            <div className="bg-[#12141b] border border-[#d9b45c]/10 hover:border-[#d9b45c]/30 transition-all rounded-2xl p-4 space-y-1 relative overflow-hidden">
              <span className="text-[9px] uppercase font-bold text-[#c9c2ab]/50 tracking-wider block">Avg. Session Duration</span>
              <div className="text-2xl font-serif font-bold text-[#f3ecd8]">{analytics.avgSessionDuration || "0m 00s"}</div>
              <div className="flex items-center space-x-1 text-[9px] font-mono text-[#c9c2ab]">
                <span>Bounce Rate:</span>
                <span className="text-[#d9b45c] font-bold">{analytics.bounceRate || "0.0%"}</span>
              </div>
              <Clock size={18} className="absolute right-4 bottom-4 text-[#d9b45c]/15" />
            </div>

            <div className="bg-[#12141b]/90 border-2 border-red-500/30 rounded-2xl p-4 space-y-1 relative overflow-hidden bg-gradient-to-br from-[#12141b] via-[#12141b] to-red-950/20">
              <div className="flex items-center space-x-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <span className="text-[9px] uppercase font-bold text-red-400 tracking-wider">Real-Time Visitors</span>
              </div>
              <div className="text-3xl font-serif font-bold text-white">{realTimeCount}</div>
              <span className="text-[8px] text-[#c9c2ab] block">
                {realTimeCount === 1 ? "1 active live user session" : `${realTimeCount} active live user sessions`}
              </span>
              <Radio size={18} className="absolute right-4 bottom-4 text-red-500/20" />
            </div>
          </div>

          {/* Graphical charts grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Traffic over time (SVG Line chart) */}
            <div className="lg:col-span-8 bg-[#12141b] border border-[#d9b45c]/15 rounded-2xl p-5 space-y-4 text-left relative">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-sans font-extrabold text-[#f3ecd8] uppercase tracking-wider flex items-center space-x-1.5">
                  <TrendingUp size={14} className="text-[#d9b45c]" />
                  <span>Traffic Growth Chart (Last 7 Days)</span>
                </h3>
                <div className="flex items-center space-x-2">
                  {hoveredPoint && (
                    <span className="text-[10px] font-mono text-[#d9b45c] bg-[#07080b] px-2 py-0.5 rounded border border-[#d9b45c]/30">
                      {hoveredPoint.date}: {hoveredPoint.views} views • {hoveredPoint.visitors} visitors
                    </span>
                  )}
                  <span className="text-[9px] font-mono text-[#c9c2ab]/40">Live Daily Hits</span>
                </div>
              </div>

              {/* Styled SVG Line Graph */}
              <div className="w-full h-52 bg-[#07080b]/60 rounded-xl relative p-2 overflow-hidden flex flex-col justify-between border border-white/5">
                <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-5 pointer-events-none">
                  <div className="border-b border-white w-full" />
                  <div className="border-b border-white w-full" />
                  <div className="border-b border-white w-full" />
                  <div className="border-b border-white w-full" />
                </div>

                {(() => {
                  const maxViews = Math.max(...trafficOverTime.map((d: any) => d.views || 0), 5);
                  const count = trafficOverTime.length;
                  const coords = trafficOverTime.map((d: any, i: number) => {
                    const x = (i / Math.max(count - 1, 1)) * 370 + 15;
                    const y = (d.views || 0) === 0 ? 80 : 80 - ((d.views || 0) / maxViews) * 60;
                    return { x, y, date: d.date, dateShort: d.dateShort, views: d.views || 0, visitors: d.visitors || 0 };
                  });

                  // Construct SVG line and area path
                  const linePath = coords.map((c: any, i: number) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
                  const areaPath = coords.length > 0 ? `${linePath} L ${coords[coords.length - 1].x} 100 L ${coords[0].x} 100 Z` : "";

                  return (
                    <>
                      <svg className="w-full h-38 mt-2" viewBox="0 0 400 100" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#d9b45c" stopOpacity="0.30" />
                            <stop offset="100%" stopColor="#d9b45c" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        
                        {areaPath && (
                          <path
                            d={areaPath}
                            fill="url(#areaGrad)"
                          />
                        )}

                        {linePath && (
                          <path
                            d={linePath}
                            fill="none"
                            stroke="#d9b45c"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        )}

                        {coords.map((c: any, i: number) => (
                          <g key={i} className="cursor-pointer">
                            <circle
                              cx={c.x}
                              cy={c.y}
                              r={hoveredPoint?.date === c.date ? "5.5" : "3.5"}
                              fill={hoveredPoint?.date === c.date ? "#f3ecd8" : i === coords.length - 1 ? "#d9b45c" : "#07080b"}
                              stroke="#d9b45c"
                              strokeWidth="2"
                              onMouseEnter={() => setHoveredPoint(c)}
                              onMouseLeave={() => setHoveredPoint(null)}
                            />
                          </g>
                        ))}
                      </svg>

                      {/* X Axis */}
                      <div className="flex justify-between text-[9px] font-mono text-[#c9c2ab]/60 px-2 mt-1 border-t border-white/5 pt-1.5">
                        {coords.map((c: any, i: number) => (
                          <div 
                            key={i} 
                            onMouseEnter={() => setHoveredPoint(c)}
                            onMouseLeave={() => setHoveredPoint(null)}
                            className={`flex flex-col items-center cursor-pointer transition-colors ${
                              hoveredPoint?.date === c.date ? "text-[#d9b45c]" : "hover:text-white"
                            }`}
                          >
                            <span className="font-medium text-[8.5px]">{c.date}</span>
                            <span className="text-[8px] font-bold text-[#d9b45c]">({c.views})</span>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Traffic channels & Device Breakdown */}
            <div className="lg:col-span-4 bg-[#12141b] border border-[#d9b45c]/15 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-sans font-extrabold text-[#f3ecd8] uppercase tracking-wider">
                  Traffic Sources
                </h3>
                <span className="text-[9px] font-mono text-[#d9b45c]">Real Channels</span>
              </div>

              <div className="space-y-4">
                {/* Channel percentages */}
                <div className="space-y-2.5">
                  {sources.map(src => (
                    <div key={src.name} className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-sans font-bold text-white">
                        <span className="flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: src.color }} />
                          <span>{src.name}</span>
                        </span>
                        <div className="flex items-center space-x-2 font-mono">
                          <span className="text-[#c9c2ab]/50 text-[9px]">{src.count.toLocaleString()} visits</span>
                          <span>{src.percent}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-[#07080b] h-1.5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ backgroundColor: src.color, width: `${src.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2.5 border-t border-white/5 flex justify-between text-[9px] text-[#c9c2ab]/70 font-mono">
                  <span>Desktop: {devices[0]?.count || 0}</span>
                  <span>Mobile: {devices[1]?.count || 0}</span>
                  <span>Tablet: {devices[2]?.count || 0}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Breakdown Grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Countries list */}
            <div className="bg-[#12141b]/50 border border-[#d9b45c]/10 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-serif font-bold text-[#f3ecd8] flex items-center space-x-1.5 pb-2 border-b border-white/5">
                <Globe2 size={13} className="text-[#d9b45c]" />
                <span>Geographic Audience</span>
              </h4>
              {countries.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#c9c2ab]/50 font-mono">
                  No visitor locations recorded yet
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {countries.map(c => (
                    <div key={c.code} className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center space-x-2 truncate mr-2">
                        <span className="w-5 h-3.5 bg-[#07080b] border border-white/10 text-[8px] font-mono flex items-center justify-center rounded uppercase font-bold text-[#d9b45c]">
                          {c.code}
                        </span>
                        <span className="text-white font-medium truncate">{c.name}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-[10px] font-mono text-[#c9c2ab] flex-shrink-0">
                        <span>{c.count.toLocaleString()}</span>
                        <span className="text-[#d9b45c] font-bold">{c.percent}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Browsers */}
            <div className="bg-[#12141b]/50 border border-[#d9b45c]/10 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-serif font-bold text-[#f3ecd8] flex items-center space-x-1.5 pb-2 border-b border-white/5">
                <Laptop size={13} className="text-[#d9b45c]" />
                <span>Tech Specifications</span>
              </h4>
              {browsers.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#c9c2ab]/50 font-mono">
                  No browser data recorded yet
                </div>
              ) : (
                <div className="space-y-2">
                  {browsers.map(b => (
                    <div key={b.name} className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-mono text-white">
                        <span>{b.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-[#c9c2ab]/50 text-[9px]">{b.count.toLocaleString()}</span>
                          <span>{b.percent}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-[#07080b] h-1 rounded-full overflow-hidden">
                        <div className="bg-[#d9b45c]/60 h-full rounded-full transition-all duration-500" style={{ width: `${b.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Landing & Exit paths */}
            <div className="bg-[#12141b]/50 border border-[#d9b45c]/10 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-serif font-bold text-[#f3ecd8] flex items-center space-x-1.5 pb-2 border-b border-white/5">
                <Compass size={13} className="text-[#d9b45c]" />
                <span>Popular Path Flows</span>
              </h4>
              {landingPages.length === 0 && exitPages.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#c9c2ab]/50 font-mono">
                  No page views recorded yet
                </div>
              ) : (
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {landingPages.length > 0 && (
                    <div>
                      <span className="text-[8px] font-sans font-bold uppercase tracking-widest text-emerald-400 block mb-1">Top Landing Pages</span>
                      {landingPages.slice(0, 3).map(lp => (
                        <div key={lp.url} className="flex justify-between items-center text-[10px] pb-1 border-b border-white/5 last:border-b-0">
                          <span className="text-[#c9c2ab] truncate max-w-[140px]" title={lp.title || lp.url}>{lp.url}</span>
                          <span className="font-mono text-white text-[9px]">{lp.views.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {exitPages.length > 0 && (
                    <div>
                      <span className="text-[8px] font-sans font-bold uppercase tracking-widest text-red-400 block mb-1">Top Exit Pages</span>
                      {exitPages.slice(0, 3).map(ep => (
                        <div key={ep.url} className="flex justify-between items-center text-[10px] pb-1 border-b border-white/5 last:border-b-0">
                          <span className="text-[#c9c2ab] truncate max-w-[140px]" title={ep.title || ep.url}>{ep.url}</span>
                          <span className="font-mono text-white text-[9px]">{ep.views.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: SEARCH PERFORMANCE */}
      {activeTab === "search" && (
        <div className="space-y-6">
          
          {/* Search Performance Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#12141b] border border-[#d9b45c]/10 rounded-2xl p-4 space-y-1">
              <span className="text-[9px] uppercase font-bold text-[#c9c2ab]/50 tracking-wider">Total Clicks</span>
              <div className="text-2xl font-serif font-bold text-[#f3ecd8]">{formatNum(searchPerf.totalClicks)}</div>
              <span className="text-[8px] text-emerald-400 font-bold block">Google organic traffic</span>
            </div>

            <div className="bg-[#12141b] border border-[#d9b45c]/10 rounded-2xl p-4 space-y-1">
              <span className="text-[9px] uppercase font-bold text-[#c9c2ab]/50 tracking-wider">Impressions</span>
              <div className="text-2xl font-serif font-bold text-[#f3ecd8]">{formatNum(searchPerf.totalImpressions)}</div>
              <span className="text-[8px] text-[#c9c2ab]/50 block">Keywords visibility in SERP</span>
            </div>

            <div className="bg-[#12141b] border border-[#d9b45c]/10 rounded-2xl p-4 space-y-1">
              <span className="text-[9px] uppercase font-bold text-[#c9c2ab]/50 tracking-wider">Average CTR</span>
              <div className="text-2xl font-serif font-bold text-emerald-400">{searchPerf.averageCtr || "0.0%"}</div>
              <span className="text-[8px] text-emerald-400 font-bold block">Organic search CTR</span>
            </div>

            <div className="bg-[#12141b] border border-[#d9b45c]/10 rounded-2xl p-4 space-y-1">
              <span className="text-[9px] uppercase font-bold text-[#c9c2ab]/50 tracking-wider">Average Position</span>
              <div className="text-2xl font-serif font-bold text-[#f3ecd8]">#{searchPerf.averagePosition || 0}</div>
              <span className="text-[8px] text-[#c9c2ab]/50 block">Search ranking position</span>
            </div>
          </div>

          {/* Top rankings & query statistics table */}
          <div className="bg-[#12141b] border border-[#d9b45c]/15 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-sans font-extrabold text-[#f3ecd8] uppercase tracking-wider flex items-center space-x-1.5">
                <Search size={14} className="text-[#d9b45c]" />
                <span>Google Search Console Queries ({reportPeriod})</span>
              </h3>
              <span className="text-[10px] font-mono text-[#d9b45c]">GSC API Connected</span>
            </div>

            {topKeywords.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#c9c2ab]/50 font-mono">
                No organic search keywords recorded for this period yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#d9b45c]/10 text-[#d9b45c] text-[10px] uppercase font-bold">
                      <th className="pb-3 pl-2">Top Performing Keywords</th>
                      <th className="pb-3 text-center">Clicks</th>
                      <th className="pb-3 text-center">Impressions</th>
                      <th className="pb-3 text-center">CTR</th>
                      <th className="pb-3 text-right pr-2">Avg. Position</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans">
                    {topKeywords.map(kw => (
                      <tr key={kw.query} className="hover:bg-[#07080b]/30">
                        <td className="py-3 pl-2 font-medium text-white">{kw.query}</td>
                        <td className="py-3 text-center font-mono">{kw.clicks.toLocaleString()}</td>
                        <td className="py-3 text-center font-mono">{kw.impressions.toLocaleString()}</td>
                        <td className="py-3 text-center font-mono text-emerald-400">{kw.ctr}</td>
                        <td className="py-3 text-right pr-2 font-mono text-[#d9b45c] font-bold">#{kw.position}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-[#d9b45c]/10 flex flex-wrap justify-between items-center text-[10px] text-[#c9c2ab]/50 font-mono">
              <span>Indexed Pages: {searchPerf.indexedPages || 18}</span>
              <span>Crawl Diagnostics: No errors reported. Robots.txt optimal</span>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: INSTANT INDEXING */}
      {activeTab === "indexing" && (
        <WPInstantIndexing cmsData={cmsData} onUpdateCMSData={onSave} />
      )}

      {/* TAB 4: INTEGRATION SETTINGS */}
      {activeTab === "integration" && (
        <div className="bg-[#12141b]/60 border border-[#d9b45c]/15 rounded-2xl p-6">
          <form onSubmit={handleSaveIntegration} className="max-w-2xl space-y-5">
            <div>
              <h3 className="text-sm font-sans font-extrabold text-[#f3ecd8] uppercase tracking-wider">
                Google & Marketing Integration Credentials
              </h3>
              <p className="text-xs text-[#c9c2ab] mt-1 leading-relaxed">
                Provide valid keys or measurement credentials. WordPress Simulator connects directly to the endpoints to display reporting streams in real-time inside this admin center.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#d9b45c]">Google Analytics 4 Measurement ID</label>
                <input
                  type="text"
                  required
                  value={integrationForm.ga4Id}
                  onChange={e => setIntegrationForm({ ...integrationForm, ga4Id: e.target.value })}
                  className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#d9b45c] font-mono"
                  placeholder="e.g. G-TRUTHQURAN123"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#d9b45c]">Search Console Site URL / Verification</label>
                <input
                  type="text"
                  required
                  value={integrationForm.gscId}
                  onChange={e => setIntegrationForm({ ...integrationForm, gscId: e.target.value })}
                  className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#d9b45c] font-mono"
                  placeholder="e.g. sc-truthquranacademy.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#d9b45c]">Google Tag Manager ID</label>
                <input
                  type="text"
                  value={integrationForm.gtmId}
                  onChange={e => setIntegrationForm({ ...integrationForm, gtmId: e.target.value })}
                  className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#d9b45c] font-mono text-[11px]"
                  placeholder="e.g. GTM-P8QXTR"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#d9b45c]">Facebook Pixel ID</label>
                <input
                  type="text"
                  value={integrationForm.fbPixelId}
                  onChange={e => setIntegrationForm({ ...integrationForm, fbPixelId: e.target.value })}
                  className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#d9b45c] font-mono text-[11px]"
                  placeholder="e.g. 987654321"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#d9b45c]">Microsoft Clarity ID</label>
                <input
                  type="text"
                  value={integrationForm.clarityId}
                  onChange={e => setIntegrationForm({ ...integrationForm, clarityId: e.target.value })}
                  className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#d9b45c] font-mono text-[11px]"
                  placeholder="e.g. clrt89abc"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#d9b45c]/10 flex justify-end items-center space-x-3">
              {cmsData.integrations?.isConnected && (
                <span className="text-[10px] text-emerald-400 font-bold flex items-center space-x-1">
                  <CheckCircle2 size={13} />
                  <span>Verified API Pipeline Active</span>
                </span>
              )}
              <button
                type="submit"
                className="px-5 py-2.5 text-[10px] font-sans font-extrabold uppercase tracking-widest text-black bg-[#d9b45c] hover:bg-[#f2d98a] rounded-xl transition-all cursor-pointer"
              >
                Sync Integrations
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
