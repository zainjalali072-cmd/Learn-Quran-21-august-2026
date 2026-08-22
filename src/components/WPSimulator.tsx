import React, { useState, useEffect, useRef } from "react";
import { 
  getCMSData, 
  saveCMSData, 
  resetCMSData, 
  CMSData, 
  SEOConfig, 
  WPUser, 
  WPMedia, 
  WPComment, 
  WPMenuItem,
  DEFAULT_FAVICON_DATA,
  getFaviconUrl
} from "../cmsStore";
import { 
  applyFaviconToDocument, 
  DEFAULT_FALLBACK_FAVICON, 
  determineFaviconMimeType 
} from "../utils/favicon";
import { 
  LayoutDashboard, 
  FileText, 
  Layers, 
  Image as ImageIcon, 
  Video,
  MessageSquare, 
  Palette, 
  Users, 
  Settings as SettingsIcon, 
  Wrench, 
  ShieldCheck, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Edit, 
  Globe, 
  AlertCircle, 
  Eye, 
  Check, 
  RotateCcw, 
  X, 
  ChevronUp, 
  ChevronDown, 
  Download, 
  Upload, 
  HelpCircle, 
  Activity, 
  FileCode, 
  Compass, 
  GraduationCap,
  Sparkles,
  Star,
  Quote,
  Sliders,
  DollarSign,
  Lock,
  ArrowLeft,
  Bot
} from "lucide-react";

import WPContentManager from "./WPContentManager";
import { WPMediaLibraryModal } from "./WPMediaLibraryModal";
import { WPUserManager } from "./WPUserManager";
import WPAISettings from "./WPAISettings";

interface WPSimulatorProps {
  onClose?: () => void;
}

export default function WPSimulator({ onClose }: WPSimulatorProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "posts" | "pages" | "media" | "videos" | "comments" | "customizer" | "rankmath" | "seo-settings" | "ai-settings" | "users" | "settings" | "tools" | "theme" | "courses" | "teachers" | "testimonials" | "faqs" | "services" | "pricing"
  >("dashboard");
  const [cmsData, setCmsData] = useState<CMSData>(getCMSData());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastNotification, setToastNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setToastNotification({ message, type });
    setTimeout(() => {
      setToastNotification((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Authentication & Security States
  const [sessionUser, setSessionUser] = useState<any | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [lostPasswordRequested, setLostPasswordRequested] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Sub-tabs for Customizer
  const [customizerSection, setCustomizerSection] = useState<"general" | "colors" | "navigation" | "widgets" | "assets">("general");

  // Theme Assets Media Manager states
  const [isThemeImageManagerOpen, setIsThemeImageManagerOpen] = useState(false);
  const [currentThemeImageKey, setCurrentThemeImageKey] = useState<string | null>(null);

  // New Menu Item simulation state
  const [newMenuLabel, setNewMenuLabel] = useState("");
  const [newMenuId, setNewMenuId] = useState("");

  // Sync data updates across pages
  useEffect(() => {
    const handleSync = () => {
      setCmsData(getCMSData());
    };
    window.addEventListener("cms_data_updated", handleSync);
    return () => window.removeEventListener("cms_data_updated", handleSync);
  }, []);

  // Fetch verified session status from server
  useEffect(() => {
    if (isOpen) {
      fetch("/api/auth/session")
        .then((res) => res.json())
        .then((data) => {
          setSessionUser(data.user);
          setAuthChecked(true);
        })
        .catch((e) => {
          console.warn("Session retrieval offline:", e);
          setAuthChecked(true);
        });
    }
  }, [isOpen]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inputUser = loginEmail.trim().toLowerCase();
    const inputPass = loginPassword;

    if (!inputUser || !inputPass) {
      setLoginError("Please enter your username/email and password.");
      return;
    }

    const isValidUser = inputUser === "muhammadzain92624@gmail.com" || inputUser === "qarizain";
    const isValidPass = inputPass === "MuhammadZain786..";

    if (!isValidUser || !isValidPass) {
      setLoginError("ERROR: Invalid scholar email/username or password credentials.");
      return;
    }

    setLoginError("");
    setIsLoggingIn(true);

    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail, password: loginPassword })
    })
      .then((res) => {
        if (res.ok) return res.json();
        return res.json().then((err) => { throw new Error(err.error || "Failed to log in") });
      })
      .then((data) => {
        setSessionUser(data.user);
        setLoginPassword("");
        const currentData = getCMSData();
        setCmsData(currentData);
      })
      .catch((err) => {
        // Fallback offline authentication for valid credentials
        if (isValidUser && isValidPass) {
          const userObj = {
            id: "u-admin",
            name: "Qarizain",
            email: "muhammadzain92624@gmail.com",
            role: "Administrator",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
            loginTime: new Date().toISOString()
          };
          setSessionUser(userObj);
          setLoginPassword("");
          const currentData = getCMSData();
          setCmsData(currentData);
        } else {
          setLoginError(err.message || "ERROR: Invalid scholar email/username or password credentials.");
        }
      })
      .finally(() => {
        setIsLoggingIn(false);
      });
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out from the administrative dashboard?")) {
      fetch("/api/auth/logout", { method: "POST" })
        .then(() => {
          setSessionUser(null);
        })
        .catch(console.error);
    }
  };

  const handleSave = async (updatedData: CMSData, customMsg?: string) => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const ok = await saveCMSData(updatedData);
      setCmsData(updatedData);
      if (ok !== false) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        showNotification(customMsg || "✅ Changes Saved & Synchronized Successfully!", "success");
      } else {
        showNotification("❌ Failed to Save Changes to Server Database", "error");
      }
    } catch (err) {
      showNotification("❌ Something Went Wrong. Please Try Again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all CMS content back to factory defaults?")) {
      const reseted = resetCMSData();
      setCmsData(reseted);
    }
  };

  // Helper: edit customizer settings directly
  const updateCustomizerField = (key: keyof CMSData, value: any) => {
    const next = { ...cmsData, [key]: value };
    handleSave(next);
  };

  // Menu Management
  const handleAddMenuItem = () => {
    if (!newMenuLabel.trim() || !newMenuId.trim()) return;
    const newItem: WPMenuItem = { label: newMenuLabel, id: newMenuId };
    const nextMenu = [...cmsData.navigationMenu, newItem];
    handleSave({ ...cmsData, navigationMenu: nextMenu });
    setNewMenuLabel("");
    setNewMenuId("");
  };

  const handleDeleteMenuItem = (id: string) => {
    const filtered = cmsData.navigationMenu.filter(m => m.id !== id);
    handleSave({ ...cmsData, navigationMenu: filtered });
  };

  const handleMoveMenuItem = (index: number, direction: "up" | "down") => {
    const nextMenu = [...cmsData.navigationMenu];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= nextMenu.length) return;
    const temp = nextMenu[index];
    nextMenu[index] = nextMenu[targetIdx];
    nextMenu[targetIdx] = temp;
    handleSave({ ...cmsData, navigationMenu: nextMenu });
  };

  // Favicon File Input Ref & Handlers
  const faviconFileInputRef = useRef<HTMLInputElement | null>(null);

  const activeFaviconUrl = getFaviconUrl(cmsData);
  const isCustomFavicon = Boolean(
    (cmsData.customImages?.siteFavicon?.url && cmsData.customImages.siteFavicon.url !== DEFAULT_FALLBACK_FAVICON) ||
    (cmsData.siteSettings?.favicon && cmsData.siteSettings.favicon !== DEFAULT_FALLBACK_FAVICON)
  );

  const handleFaviconLocalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showNotification("Favicon file size must be less than 5MB.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const dataUrl = event.target.result as string;
        const fileSizeKB = Math.max(1, Math.round(file.size / 1024));
        const fileName = file.name;
        
        // Add to Media Library for reuse
        const newMediaItem: WPMedia = {
          id: `fav-${Date.now()}`,
          title: `Site Favicon - ${fileName}`,
          url: dataUrl,
          size: `${fileSizeKB} KB`,
          date: new Date().toISOString().split("T")[0],
          type: file.type || determineFaviconMimeType(fileName),
          dimensions: "512x512",
          alt: "Site Favicon Icon",
          caption: "Uploaded Website Favicon",
          description: "Active site favicon and browser tab icon asset.",
          author: sessionUser?.name || "Administrator"
        };

        const updatedCustomImages = {
          ...(cmsData.customImages || {}),
          siteFavicon: {
            url: dataUrl,
            alt: "Truth Quran Academy Favicon",
            title: `Favicon (${fileName})`,
            dimensions: "512x512",
            size: `${fileSizeKB} KB`
          }
        };

        const updatedSettings = {
          ...(cmsData.siteSettings || {}),
          favicon: dataUrl
        };

        const updatedData: CMSData = {
          ...cmsData,
          customImages: updatedCustomImages,
          siteSettings: updatedSettings as any,
          mediaLibrary: [newMediaItem, ...(cmsData.mediaLibrary || [])]
        };

        handleSave(updatedData, "✅ New site favicon uploaded and injected into HTML <head> dynamically!");
        applyFaviconToDocument(dataUrl);
      }
    };
    reader.readAsDataURL(file);

    if (e.target) {
      e.target.value = "";
    }
  };

  const handleFaviconRemove = () => {
    const updatedCustomImages = {
      ...(cmsData.customImages || {}),
      siteFavicon: {
        ...DEFAULT_FAVICON_DATA
      }
    };

    const updatedSettings = {
      ...(cmsData.siteSettings || {}),
      favicon: ""
    };

    const updatedData: CMSData = {
      ...cmsData,
      customImages: updatedCustomImages,
      siteSettings: updatedSettings as any
    };

    handleSave(updatedData, "✅ Favicon removed & reverted back to default fallback logo!");
    applyFaviconToDocument(DEFAULT_FALLBACK_FAVICON);
  };

  return (
    <>
      {isOpen && !sessionUser && (
        <div className="fixed inset-0 z-50 bg-[#07080b] flex flex-col items-center justify-center p-4 overflow-y-auto select-none animate-in fade-in duration-200">
          <div className="w-full max-w-[360px] my-auto flex flex-col">
            {/* Website Logo and Branding */}
            <div className="flex flex-col items-center mb-6 text-center">
              <div className="w-20 h-20 rounded-full bg-[#12141b] border-2 border-[#d9b45c] flex items-center justify-center shadow-[0_4px_20px_rgba(217,180,92,0.15)] text-[#d9b45c] mb-3 transition-transform duration-300 hover:scale-105">
                {/* Simulated luxury golden Islamic emblem with Arabic calligraphic look */}
                <span className="font-serif font-extrabold text-4xl select-none tracking-tighter">T</span>
              </div>
              <h1 className="text-xl font-serif font-extrabold text-[#f3ecd8] tracking-wide">
                {cmsData.siteSettings?.title || "Truth Quran Academy"}
              </h1>
              <p className="text-[10px] text-[#c9c2ab]/50 font-sans tracking-widest uppercase mt-1">
                {cmsData.siteSettings?.tagline || "Uncompromising standards in Quranic education"}
              </p>
            </div>

            {/* Login Card */}
            <div className="bg-[#12141b] border border-[#d9b45c]/20 rounded shadow-[0_15px_50px_rgba(0,0,0,0.8)] p-6 mb-4 text-left">
              <form onSubmit={handleLoginSubmit} className="space-y-5 text-xs font-sans">
                {loginError && (
                  <div className="bg-[#1b1214] border-l-4 border-red-500 p-3 text-[11px] text-[#f3ecd8] leading-relaxed animate-in shake duration-300">
                    <strong className="text-red-400 block mb-0.5 font-bold uppercase tracking-wider">Error:</strong>
                    <span>{loginError}</span>
                  </div>
                )}

                {lostPasswordRequested && (
                  <div className="bg-[#121b14] border-l-4 border-[#d9b45c] p-3 text-[11px] text-[#f3ecd8] leading-relaxed animate-in fade-in duration-300">
                    <strong className="text-[#d9b45c] block mb-0.5 font-bold uppercase tracking-wider">Reset Initiated:</strong>
                    <span>Please contact the Chief Administrator at <strong className="text-white select-all">muhammadzain92624@gmail.com</strong> to securely update your credentials.</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider block">Username or Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        setLoginError("");
                      }}
                      placeholder="Username or email address"
                      className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded p-3 text-xs text-white font-semibold outline-none focus:border-[#d9b45c] focus:ring-1 focus:ring-[#d9b45c] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider block">Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        setLoginError("");
                      }}
                      placeholder="••••••••"
                      className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded p-3 text-xs text-white outline-none focus:border-[#d9b45c] focus:ring-1 focus:ring-[#d9b45c] transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center space-x-2 text-[#c9c2ab] text-[10px] cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded bg-[#07080b] border-[#d9b45c]/30 text-[#d9b45c] focus:ring-[#d9b45c] w-3.5 h-3.5 cursor-pointer" />
                    <span>Remember Me</span>
                  </label>

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="px-5 py-2.5 rounded bg-[#d9b45c] text-black hover:bg-white active:scale-95 transition-all text-[11px] font-extrabold uppercase tracking-widest disabled:opacity-50 cursor-pointer shadow-[0_4px_12px_rgba(217,180,92,0.2)]"
                  >
                    {isLoggingIn ? "Logging In..." : "Log In"}
                  </button>
                </div>
              </form>
            </div>

              {/* Back Links */}
              <div className="flex flex-col space-y-2.5 px-1 text-left">
                <div className="flex items-center justify-between text-[11px] text-[#c9c2ab] font-sans">
                  <button 
                    type="button"
                    onClick={() => setLostPasswordRequested(prev => !prev)}
                    className="hover:text-white transition-all text-left underline"
                  >
                    Lost your password?
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      if (onClose) onClose();
                      else setIsOpen(false);
                    }}
                    className="hover:text-white transition-all flex items-center space-x-1 underline"
                  >
                    <ArrowLeft size={10} />
                    <span>← Go to Truth Quran Academy</span>
                  </button>
                </div>
              </div>
          </div>
        </div>
      )}

      {isOpen && sessionUser && (
        <div className="fixed inset-0 z-50 bg-[#0e1015] flex flex-col overflow-hidden select-none animate-in fade-in duration-200">
          <div className="w-full h-full flex flex-col overflow-hidden">
            
            {/* Header bar of Simulated WP Admin */}
            <div className="bg-[#12141b] border-b border-[#d9b45c]/20 px-6 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-[#d9b45c] text-[#07080b] font-sans font-extrabold text-base flex items-center justify-center shadow-md">
                  W
                </div>
                <div>
                  <h1 className="text-sm font-sans font-extrabold text-[#f3ecd8] uppercase tracking-wider">
                    WordPress Administration Panel
                  </h1>
                  <span className="text-[10px] text-[#d9b45c] font-semibold tracking-widest uppercase flex items-center space-x-1">
                    <Globe size={10} />
                    <span>Dynamic Content CMS System</span>
                  </span>
                </div>
              </div>

              {/* Saved Status Indicator */}
              <div className="flex items-center space-x-4">
                {sessionUser && (
                  <div className="flex items-center space-x-2 border-r border-[#d9b45c]/25 pr-4">
                    <img src={sessionUser.avatar} className="w-6 h-6 rounded-full object-cover border border-[#d9b45c]/30" alt="avatar" />
                    <div className="text-left hidden sm:block">
                      <span className="text-[10px] font-bold text-white block truncate max-w-[100px]">{sessionUser.name}</span>
                      <span className="text-[8px] text-[#d9b45c] font-semibold uppercase tracking-wider block">{sessionUser.role}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="ml-2 text-[8px] font-extrabold text-red-400 hover:text-white border border-red-500/20 hover:border-red-500 bg-red-500/10 hover:bg-red-500/30 px-2 py-0.5 rounded transition-all uppercase tracking-wider cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}

                {isSaving ? (
                  <span className="text-xs text-amber-300 font-bold flex items-center space-x-2 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full animate-pulse">
                    <span className="w-2.5 h-2.5 rounded-full border-2 border-amber-300 border-t-transparent animate-spin"></span>
                    <span>Saving Changes...</span>
                  </span>
                ) : saveSuccess ? (
                  <span className="text-xs text-emerald-300 font-bold flex items-center space-x-1.5 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full">
                    <CheckCircle2 size={13} className="text-emerald-400" />
                    <span>Saved & Synchronized!</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-[#c9c2ab]/50 tracking-wide font-mono uppercase">
                    Live Session DB Connection Active
                  </span>
                )}

                <button 
                  onClick={handleReset}
                  title="Reset all CMS database items back to default"
                  className="p-1.5 rounded-lg border border-[#d9b45c]/20 hover:border-[#d9b45c]/60 text-[#c9c2ab] hover:text-[#f3ecd8] transition-colors"
                >
                  <RotateCcw size={16} />
                </button>

                <button 
                  onClick={() => {
                    if (onClose) onClose();
                    else setIsOpen(false);
                  }}
                  className="p-1.5 rounded-lg bg-[#d9b45c]/10 text-[#d9b45c] hover:bg-[#d9b45c] hover:text-black transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Split layout: Sidebar navigation & editing panel */}
            <div className="flex flex-1 overflow-hidden">
              
              {/* LEFT SIDEBAR (Standard WP Admin Sidebar Menu with Categories) */}
              <aside className="w-64 bg-[#12141b]/80 border-r border-[#d9b45c]/15 p-4 flex flex-col justify-between flex-shrink-0 overflow-y-auto">
                <div className="space-y-4">
                  
                  {/* Category A: WP Core Menu */}
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-[#d9b45c]/50 px-2 block mb-1">WP Core Menu</span>
                    
                    <button 
                      onClick={() => setActiveTab("dashboard")}
                      className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all text-left ${activeTab === "dashboard" ? "bg-[#d9b45c]/10 text-[#f2d98a] border-l-2 border-[#d9b45c]" : "text-[#c9c2ab] hover:bg-[#d9b45c]/5 hover:text-[#f3ecd8]"}`}
                    >
                      <LayoutDashboard size={14} />
                      <span>Dashboard</span>
                    </button>

                    <button 
                      onClick={() => setActiveTab("posts")}
                      className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all text-left ${activeTab === "posts" ? "bg-[#d9b45c]/10 text-[#f2d98a] border-l-2 border-[#d9b45c]" : "text-[#c9c2ab] hover:bg-[#d9b45c]/5 hover:text-[#f3ecd8]"}`}
                    >
                      <FileText size={14} />
                      <span>Posts (Blogs)</span>
                    </button>

                    <button 
                      onClick={() => setActiveTab("pages")}
                      className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all text-left ${activeTab === "pages" ? "bg-[#d9b45c]/10 text-[#f2d98a] border-l-2 border-[#d9b45c]" : "text-[#c9c2ab] hover:bg-[#d9b45c]/5 hover:text-[#f3ecd8]"}`}
                    >
                      <Layers size={14} />
                      <span>Pages (Homepage)</span>
                    </button>

                    <button 
                      onClick={() => setActiveTab("media")}
                      className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all text-left ${activeTab === "media" ? "bg-[#d9b45c]/10 text-[#f2d98a] border-l-2 border-[#d9b45c]" : "text-[#c9c2ab] hover:bg-[#d9b45c]/5 hover:text-[#f3ecd8]"}`}
                    >
                      <ImageIcon size={14} />
                      <span>Media Library</span>
                    </button>
                  </div>

                  {/* Category B: Custom Post Types (CPTs) */}
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-[#d9b45c]/50 px-2 block mb-1">Custom Post Types</span>
                    
                    <button 
                      onClick={() => setActiveTab("courses")}
                      className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all text-left ${activeTab === "courses" ? "bg-[#d9b45c]/10 text-[#f2d98a] border-l-2 border-[#d9b45c]" : "text-[#c9c2ab] hover:bg-[#d9b45c]/5 hover:text-[#f3ecd8]"}`}
                    >
                      <GraduationCap size={14} />
                      <span>Programs (Courses)</span>
                    </button>

                    <button 
                      onClick={() => setActiveTab("teachers")}
                      className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all text-left ${activeTab === "teachers" ? "bg-[#d9b45c]/10 text-[#f2d98a] border-l-2 border-[#d9b45c]" : "text-[#c9c2ab] hover:bg-[#d9b45c]/5 hover:text-[#f3ecd8]"}`}
                    >
                      <Users size={14} />
                      <span>Teachers / Tutors</span>
                    </button>

                    <button 
                      onClick={() => setActiveTab("testimonials")}
                      className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all text-left ${activeTab === "testimonials" ? "bg-[#d9b45c]/10 text-[#f2d98a] border-l-2 border-[#d9b45c]" : "text-[#c9c2ab] hover:bg-[#d9b45c]/5 hover:text-[#f3ecd8]"}`}
                    >
                      <Star size={14} />
                      <span>Testimonials</span>
                    </button>

                    <button 
                      onClick={() => setActiveTab("faqs")}
                      className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all text-left ${activeTab === "faqs" ? "bg-[#d9b45c]/10 text-[#f2d98a] border-l-2 border-[#d9b45c]" : "text-[#c9c2ab] hover:bg-[#d9b45c]/5 hover:text-[#f3ecd8]"}`}
                    >
                      <HelpCircle size={14} />
                      <span>FAQs Manager</span>
                    </button>

                    <button 
                      onClick={() => setActiveTab("videos")}
                      className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all text-left ${activeTab === "videos" ? "bg-[#d9b45c]/10 text-[#f2d98a] border-l-2 border-[#d9b45c]" : "text-[#c9c2ab] hover:bg-[#d9b45c]/5 hover:text-[#f3ecd8]"}`}
                    >
                      <Video size={14} />
                      <span>Video Manager</span>
                    </button>

                    <button 
                      onClick={() => setActiveTab("services")}
                      className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all text-left ${activeTab === "services" ? "bg-[#d9b45c]/10 text-[#f2d98a] border-l-2 border-[#d9b45c]" : "text-[#c9c2ab] hover:bg-[#d9b45c]/5 hover:text-[#f3ecd8]"}`}
                    >
                      <Sliders size={14} />
                      <span>Why Us / Services</span>
                    </button>

                    <button 
                      onClick={() => setActiveTab("pricing")}
                      className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all text-left ${activeTab === "pricing" ? "bg-[#d9b45c]/10 text-[#f2d98a] border-l-2 border-[#d9b45c]" : "text-[#c9c2ab] hover:bg-[#d9b45c]/5 hover:text-[#f3ecd8]"}`}
                    >
                      <DollarSign size={14} />
                      <span>Pricing Plans</span>
                    </button>
                  </div>

                  {/* Category C: Site Interaction & Systems */}
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-[#d9b45c]/50 px-2 block mb-1">Interaction & Systems</span>
                    
                    <button 
                      onClick={() => setActiveTab("comments")}
                      className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all text-left relative ${activeTab === "comments" ? "bg-[#d9b45c]/10 text-[#f2d98a] border-l-2 border-[#d9b45c]" : "text-[#c9c2ab] hover:bg-[#d9b45c]/5 hover:text-[#f3ecd8]"}`}
                    >
                      <MessageSquare size={14} />
                      <span>Inquiries / Leads</span>
                      {cmsData.comments.filter(c => c.status === "pending").length > 0 && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-500 text-white font-sans font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                          {cmsData.comments.filter(c => c.status === "pending").length}
                        </span>
                      )}
                    </button>

                    <button 
                      onClick={() => setActiveTab("customizer")}
                      className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all text-left ${activeTab === "customizer" ? "bg-[#d9b45c]/10 text-[#f2d98a] border-l-2 border-[#d9b45c]" : "text-[#c9c2ab] hover:bg-[#d9b45c]/5 hover:text-[#f3ecd8]"}`}
                    >
                      <Palette size={14} />
                      <span>Theme Options</span>
                    </button>

                    <button 
                      onClick={() => setActiveTab("rankmath")}
                      className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all text-left ${activeTab === "rankmath" ? "bg-[#d9b45c]/10 text-[#f2d98a] border-l-2 border-[#d9b45c]" : "text-[#c9c2ab] hover:bg-[#d9b45c]/5 hover:text-[#f3ecd8]"}`}
                    >
                      <Compass size={14} />
                      <span>Rank Math SEO</span>
                    </button>

                    <button 
                      onClick={() => setActiveTab("seo-settings")}
                      className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all text-left ${activeTab === "seo-settings" ? "bg-[#d9b45c]/10 text-[#f2d98a] border-l-2 border-[#d9b45c]" : "text-[#c9c2ab] hover:bg-[#d9b45c]/5 hover:text-[#f3ecd8]"}`}
                    >
                      <Globe size={14} />
                      <span>SEO Settings</span>
                    </button>

                    <button 
                      onClick={() => setActiveTab("ai-settings")}
                      className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all text-left ${activeTab === "ai-settings" ? "bg-[#d9b45c]/10 text-[#f2d98a] border-l-2 border-[#d9b45c]" : "text-[#c9c2ab] hover:bg-[#d9b45c]/5 hover:text-[#f3ecd8]"}`}
                    >
                      <Bot size={14} />
                      <span>AI Integrations</span>
                    </button>

                    <button 
                      onClick={() => setActiveTab("users")}
                      className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all text-left ${activeTab === "users" ? "bg-[#d9b45c]/10 text-[#f2d98a] border-l-2 border-[#d9b45c]" : "text-[#c9c2ab] hover:bg-[#d9b45c]/5 hover:text-[#f3ecd8]"}`}
                    >
                      <Users size={14} />
                      <span>Users & Authors</span>
                    </button>

                    <button 
                      onClick={() => setActiveTab("settings")}
                      className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all text-left ${activeTab === "settings" ? "bg-[#d9b45c]/10 text-[#f2d98a] border-l-2 border-[#d9b45c]" : "text-[#c9c2ab] hover:bg-[#d9b45c]/5 hover:text-[#f3ecd8]"}`}
                    >
                      <SettingsIcon size={14} />
                      <span>WP Settings</span>
                    </button>

                    <button 
                      onClick={() => setActiveTab("tools")}
                      className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all text-left ${activeTab === "tools" ? "bg-[#d9b45c]/10 text-[#f2d98a] border-l-2 border-[#d9b45c]" : "text-[#c9c2ab] hover:bg-[#d9b45c]/5 hover:text-[#f3ecd8]"}`}
                    >
                      <Wrench size={14} />
                      <span>WP Tools</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 pt-4 border-t border-[#d9b45c]/10">
                  <button 
                    onClick={() => setActiveTab("theme")}
                    className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all text-left ${activeTab === "theme" ? "bg-gradient-to-r from-[#f2d98a] to-[#d9b45c] text-[#07080b]" : "text-[#d9b45c] border border-[#d9b45c]/30 hover:bg-[#d9b45c]/10 hover:text-white"}`}
                  >
                    <FileCode size={14} />
                    <span>Download Theme</span>
                  </button>
                </div>
              </aside>

              {/* MAIN CONTENT EDITING PANEL */}
              <main className="flex-1 bg-[#07080b] p-6 md:p-8 overflow-y-auto">
                
                {/* TAB 1: DASHBOARD METRICS & PLUGINS STATUS */}
                {activeTab === "dashboard" && (
                  <div className="space-y-6 text-left">
                    <div className="bg-[#12141b]/50 border border-[#d9b45c]/15 rounded-2xl p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Globe size={180} className="text-[#d9b45c]" />
                      </div>
                      <h2 className="font-serif text-2xl text-[#f3ecd8] font-bold">Welcome to WordPress Admin Centre</h2>
                      <p className="text-xs text-[#c9c2ab] mt-2 leading-relaxed">
                        This premium administrative environment allows you to control all content blocks, menus, custom colors, and metadata dynamically. The frontend React template responds to all modifications instantly, simulating real-time headless CMS integration.
                      </p>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-[#12141b] border border-[#d9b45c]/10 rounded-xl p-4 space-y-1">
                        <span className="text-[9px] uppercase font-bold text-[#d9b45c]/50">Post Count</span>
                        <div className="text-xl font-bold font-serif text-white">{cmsData.blogPosts.length} Articles</div>
                      </div>
                      <div className="bg-[#12141b] border border-[#d9b45c]/10 rounded-xl p-4 space-y-1">
                        <span className="text-[9px] uppercase font-bold text-[#d9b45c]/50">Course CPT</span>
                        <div className="text-xl font-bold font-serif text-white">{cmsData.courses.length} Programs</div>
                      </div>
                      <div className="bg-[#12141b] border border-[#d9b45c]/10 rounded-xl p-4 space-y-1">
                        <span className="text-[9px] uppercase font-bold text-[#d9b45c]/50">Unread Leads</span>
                        <div className="text-xl font-bold font-serif text-green-400">{cmsData.comments.filter(c => c.status === "pending").length} Pending</div>
                      </div>
                      <div className="bg-[#12141b] border border-[#d9b45c]/10 rounded-xl p-4 space-y-1">
                        <span className="text-[9px] uppercase font-bold text-[#d9b45c]/50">Media Attachments</span>
                        <div className="text-xl font-bold font-serif text-white">{cmsData.mediaLibrary.length} Items</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Left: Active Plugins Status list */}
                      <div className="bg-[#12141b]/70 border border-[#d9b45c]/10 rounded-xl p-5 space-y-3 md:col-span-2">
                        <h3 className="text-xs font-sans uppercase font-bold tracking-wider text-[#d9b45c]">Active WordPress Plugins</h3>
                        <div className="divide-y divide-[#d9b45c]/10 text-xs">
                          <div className="flex items-center justify-between py-2.5">
                            <span className="font-bold text-white">Rank Math Pro (SEO Suite)</span>
                            <span className="px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold bg-[#1fae5b]/10 text-[#1fae5b] border border-[#1fae5b]/20">Active / Optimized</span>
                          </div>
                          <div className="flex items-center justify-between py-2.5">
                            <span className="font-bold text-white">Advanced Custom Fields Pro (ACF)</span>
                            <span className="px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold bg-[#1fae5b]/10 text-[#1fae5b] border border-[#1fae5b]/20">Active / Injected</span>
                          </div>
                          <div className="flex items-center justify-between py-2.5">
                            <span className="font-bold text-white">Contact Form 7 (Inquiry Capturer)</span>
                            <span className="px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold bg-[#1fae5b]/10 text-[#1fae5b] border border-[#1fae5b]/20">Active</span>
                          </div>
                          <div className="flex items-center justify-between py-2.5">
                            <span className="font-bold text-white">LiteSpeed Cache (LSCache)</span>
                            <span className="px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold bg-[#1fae5b]/10 text-[#1fae5b] border border-[#1fae5b]/20">Object Cache Active</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Site Health indicator */}
                      <div className="bg-[#12141b]/70 border border-[#d9b45c]/10 rounded-xl p-5 space-y-4">
                        <h3 className="text-xs font-sans uppercase font-bold tracking-wider text-[#d9b45c]">Site Health Status</h3>
                        
                        <div className="flex items-center space-x-3 bg-[#1fae5b]/5 border border-[#1fae5b]/20 p-3.5 rounded-xl">
                          <ShieldCheck className="text-[#1fae5b] flex-shrink-0" size={24} />
                          <div>
                            <span className="text-xs font-bold text-white block">Status: Healthy</span>
                            <p className="text-[10px] text-[#c9c2ab]/70 mt-0.5">PHP 8.2 • Secure HTTPS • Database Optimized • 0 Warnings</p>
                          </div>
                        </div>

                        <div className="space-y-1 text-xs">
                          <span className="text-[10px] text-[#c9c2ab]/50 uppercase font-bold tracking-wider block">Server Parameters</span>
                          <div className="flex justify-between text-[11px] font-mono text-[#c9c2ab]">
                            <span>Web Server:</span>
                            <span>LiteSpeed Enterprise</span>
                          </div>
                          <div className="flex justify-between text-[11px] font-mono text-[#c9c2ab]">
                            <span>RTL Toggle:</span>
                            <span>{cmsData.siteSettings?.isRTL ? "Enabled" : "Disabled"}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* GENERAL CONTENT MANAGEMENT ENGINE ROUTER (POSTS, PAGES, COURSES, MEDIA, TEACHERS, TESTIMONIALS, FAQS, VIDEOS, SERVICES, PRICING, COMMENTS, RANKMATH) */}
                {activeTab !== "dashboard" && activeTab !== "customizer" && activeTab !== "users" && activeTab !== "settings" && activeTab !== "tools" && activeTab !== "theme" && (
                  <WPContentManager 
                    cmsData={cmsData}
                    onSave={handleSave}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                  />
                )}

                {/* TAB 7: THEME CUSTOMIZER OPTIONS */}
                {activeTab === "customizer" && (
                  <div className="space-y-6 text-left">
                    <div className="border-b border-[#d9b45c]/15 pb-2">
                      <h2 className="font-serif text-xl text-[#f3ecd8] font-bold">WP Customizer Theme Settings</h2>
                      <p className="text-xs text-[#c9c2ab] mt-1 font-sans">Fine-tune brand colors, font family mappings, coordinates, and navigation layouts dynamically.</p>
                    </div>

                    {/* Section Selector Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 border-b border-white/5 pb-3">
                      <button 
                        onClick={() => setCustomizerSection("general")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold uppercase tracking-wider ${customizerSection === "general" ? "bg-[#d9b45c] text-black" : "bg-[#12141b] text-[#c9c2ab] hover:text-white"}`}
                      >
                        Contact & Coordinates
                      </button>
                      <button 
                        onClick={() => setCustomizerSection("colors")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold uppercase tracking-wider ${customizerSection === "colors" ? "bg-[#d9b45c] text-black" : "bg-[#12141b] text-[#c9c2ab] hover:text-white"}`}
                      >
                        Colors & Typography
                      </button>
                      <button 
                        onClick={() => setCustomizerSection("navigation")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold uppercase tracking-wider ${customizerSection === "navigation" ? "bg-[#d9b45c] text-black" : "bg-[#12141b] text-[#c9c2ab] hover:text-white"}`}
                      >
                        Header Menus
                      </button>
                      <button 
                        onClick={() => setCustomizerSection("widgets")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold uppercase tracking-wider ${customizerSection === "widgets" ? "bg-[#d9b45c] text-black" : "bg-[#12141b] text-[#c9c2ab] hover:text-white"}`}
                      >
                        Widget Slots
                      </button>
                      <button 
                        onClick={() => setCustomizerSection("assets")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold uppercase tracking-wider ${customizerSection === "assets" ? "bg-[#d9b45c] text-black" : "bg-[#12141b] text-[#c9c2ab] hover:text-white"}`}
                      >
                        Theme Graphics & Assets
                      </button>
                    </div>

                    {/* CONTACT COORDINATES */}
                    {customizerSection === "general" && (
                      <div className="bg-[#12141b] border border-[#d9b45c]/10 rounded-xl p-5 space-y-4">
                        <span className="text-[10px] text-[#d9b45c] uppercase font-bold tracking-widest border-b border-[#d9b45c]/10 pb-1.5 block">Header & Footer Coordinates</span>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">Site Brand Name</label>
                              <input 
                                type="text" 
                                value={cmsData.siteLogoText || ""}
                                onChange={(e) => updateCustomizerField("siteLogoText", e.target.value)}
                                className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">Dynamic Developer Name</label>
                              <input 
                                type="text" 
                                value={cmsData.developerName || ""}
                                onChange={(e) => updateCustomizerField("developerName", e.target.value)}
                                className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">Developer Avatar URL</label>
                              <input 
                                type="text" 
                                value={cmsData.developerAvatar || ""}
                                onChange={(e) => updateCustomizerField("developerAvatar", e.target.value)}
                                className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-white font-mono text-[10px]"
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-1">
                              <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">Academy Phone Line</label>
                              <input 
                                type="text" 
                                value={cmsData.contactPhone || ""}
                                onChange={(e) => updateCustomizerField("contactPhone", e.target.value)}
                                className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">Support Inbox Email</label>
                              <input 
                                type="text" 
                                value={cmsData.contactEmail || ""}
                                onChange={(e) => updateCustomizerField("contactEmail", e.target.value)}
                                className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">Office Physical Location</label>
                              <input 
                                type="text" 
                                value={cmsData.contactAddress || ""}
                                onChange={(e) => updateCustomizerField("contactAddress", e.target.value)}
                                className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-white"
                              />
                            </div>
                          </div>

                          <div className="col-span-1 md:col-span-2 pt-4 border-t border-[#d9b45c]/10 space-y-3">
                            <span className="text-[10px] text-[#d9b45c] uppercase font-bold tracking-widest block">Official Social Media Profile Links</span>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">Facebook Profile URL</label>
                                <input 
                                  type="text" 
                                  value={cmsData.facebookLink || ""}
                                  onChange={(e) => updateCustomizerField("facebookLink", e.target.value)}
                                  placeholder="https://facebook.com/yourpage"
                                  className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2 text-xs text-white"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">Instagram Profile URL</label>
                                <input 
                                  type="text" 
                                  value={cmsData.instagramLink || ""}
                                  onChange={(e) => updateCustomizerField("instagramLink", e.target.value)}
                                  placeholder="https://instagram.com/yourhandle"
                                  className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2 text-xs text-white"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">LinkedIn Profile URL</label>
                                <input 
                                  type="text" 
                                  value={cmsData.linkedinLink || ""}
                                  onChange={(e) => updateCustomizerField("linkedinLink", e.target.value)}
                                  placeholder="https://linkedin.com/in/yourprofile"
                                  className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2 text-xs text-white"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* COLORS & TYPOGRAPHY */}
                    {customizerSection === "colors" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#12141b] border border-[#d9b45c]/10 rounded-xl p-5 space-y-4">
                          <span className="text-[10px] text-[#d9b45c] uppercase font-bold tracking-widest border-b border-[#d9b45c]/10 pb-1.5 block">WP Theme Customizer Colors</span>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider block">Primary Gold Accent</label>
                              <div className="flex items-center space-x-2">
                                <input 
                                  type="color" 
                                  value={cmsData.themeColors?.primaryGold || "#d9b45c"}
                                  onChange={(e) => {
                                    const colors = { ...cmsData.themeColors, primaryGold: e.target.value };
                                    handleSave({ ...cmsData, themeColors: colors });
                                  }}
                                  className="w-8 h-8 rounded bg-transparent border-0 cursor-pointer"
                                />
                                <span className="text-xs font-mono">{cmsData.themeColors?.primaryGold || "#d9b45c"}</span>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider block">Site Dark Background</label>
                              <div className="flex items-center space-x-2">
                                <input 
                                  type="color" 
                                  value={cmsData.themeColors?.bgDark || "#07080b"}
                                  onChange={(e) => {
                                    const colors = { ...cmsData.themeColors, bgDark: e.target.value };
                                    handleSave({ ...cmsData, themeColors: colors });
                                  }}
                                  className="w-8 h-8 rounded bg-transparent border-0 cursor-pointer"
                                />
                                <span className="text-xs font-mono">{cmsData.themeColors?.bgDark || "#07080b"}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-[#12141b] border border-[#d9b45c]/10 rounded-xl p-5 space-y-4">
                          <span className="text-[10px] text-[#d9b45c] uppercase font-bold tracking-widest border-b border-[#d9b45c]/10 pb-1.5 block">Customizer Typography Setup</span>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">Headings Font-Family</label>
                              <select 
                                value={cmsData.themeTypography?.headingFont || "Playfair Display"}
                                onChange={(e) => {
                                  const typography = { ...cmsData.themeTypography, headingFont: e.target.value };
                                  handleSave({ ...cmsData, themeTypography: typography });
                                }}
                                className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2 text-xs text-white"
                              >
                                <option value="Cinzel">Cinzel (Swiss/Classic)</option>
                                <option value="Playfair Display">Playfair Display (Serif)</option>
                                <option value="Space Grotesk">Space Grotesk (Tech Modern)</option>
                                <option value="Inter">Inter (Clean UI)</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">Body Font-Family</label>
                              <select 
                                value={cmsData.themeTypography?.bodyFont || "Inter"}
                                onChange={(e) => {
                                  const typography = { ...cmsData.themeTypography, bodyFont: e.target.value };
                                  handleSave({ ...cmsData, themeTypography: typography });
                                }}
                                className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2 text-xs text-white"
                              >
                                <option value="Inter">Inter (Sans-Serif)</option>
                                <option value="JetBrains Mono">JetBrains Mono (Technical)</option>
                                <option value="Lora">Lora (Spiritual serif)</option>
                                <option value="Roboto">Roboto (Google Standard)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* DYNAMIC MENUS */}
                    {customizerSection === "navigation" && (
                      <div className="bg-[#12141b] border border-[#d9b45c]/10 rounded-xl p-5 space-y-5">
                        <span className="text-[10px] text-[#d9b45c] uppercase font-bold tracking-widest border-b border-[#d9b45c]/10 pb-1.5 block">WordPress Navigation Menus Location: Primary Header Menu</span>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          
                          {/* Menu items drag list */}
                          <div className="space-y-2 md:col-span-2">
                            <span className="text-[10px] text-[#c9c2ab]/50 uppercase font-bold tracking-wider block">Active Menu Hierarchy</span>
                            
                            {cmsData.navigationMenu.map((menu, idx) => (
                              <div key={menu.id} className="bg-[#07080b]/50 border border-[#d9b45c]/10 p-3 rounded-lg flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <span className="text-[10px] text-[#d9b45c] font-mono">0{idx + 1}</span>
                                  <span className="text-xs font-sans font-extrabold text-white">{menu.label}</span>
                                  <span className="text-[9px] font-mono text-[#c9c2ab]/40">ID: {menu.id}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <button
                                    disabled={idx === 0}
                                    onClick={() => handleMoveMenuItem(idx, "up")}
                                    className="p-1 rounded bg-[#12141b] text-gray-400 hover:text-white"
                                  >
                                    <ChevronUp size={12} />
                                  </button>
                                  <button
                                    disabled={idx === cmsData.navigationMenu.length - 1}
                                    onClick={() => handleMoveMenuItem(idx, "down")}
                                    className="p-1 rounded bg-[#12141b] text-gray-400 hover:text-white"
                                  >
                                    <ChevronDown size={12} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteMenuItem(menu.id)}
                                    className="p-1 text-red-400 hover:text-red-300 transition-colors ml-2"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Quick Append box */}
                          <div className="bg-[#07080b]/30 p-4 rounded-xl border border-[#d9b45c]/10 space-y-4 h-fit">
                            <span className="text-[10px] text-white uppercase font-bold tracking-wider block">Add Custom Menu Item Link</span>
                            
                            <div className="space-y-1">
                              <label className="text-[10px] text-[#c9c2ab] uppercase font-bold">Link Label Text</label>
                              <input 
                                type="text" 
                                placeholder="e.g. Free Trial" 
                                value={newMenuLabel}
                                onChange={(e) => setNewMenuLabel(e.target.value)}
                                className="w-full bg-[#12141b] border border-[#d9b45c]/15 rounded p-2 text-xs text-white"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] text-[#c9c2ab] uppercase font-bold">Anchor Target (ID)</label>
                              <input 
                                type="text" 
                                placeholder="e.g. contact" 
                                value={newMenuId}
                                onChange={(e) => setNewMenuId(e.target.value)}
                                className="w-full bg-[#12141b] border border-[#d9b45c]/15 rounded p-2 text-xs text-white font-mono"
                              />
                            </div>

                            <button 
                              onClick={handleAddMenuItem}
                              className="w-full py-2 bg-[#d9b45c] text-black text-xs font-sans font-bold uppercase tracking-wider rounded"
                            >
                              Append To Primary
                            </button>
                          </div>

                        </div>
                      </div>
                    )}

                    {/* THEME WIDGETS */}
                    {customizerSection === "widgets" && (
                      <div className="bg-[#12141b] border border-[#d9b45c]/10 rounded-xl p-5 space-y-4">
                        <span className="text-[10px] text-[#d9b45c] uppercase font-bold tracking-widest border-b border-[#d9b45c]/10 pb-1.5 block">Sidebar & Footers Widget Slots</span>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {Object.keys(cmsData.widgets || {}).map((slotKey) => (
                            <div key={slotKey} className="bg-[#07080b]/40 border border-[#d9b45c]/15 p-4 rounded-xl space-y-3">
                              <span className="text-xs font-sans font-bold text-white capitalize block">{slotKey} Area Widgets</span>
                              
                              <div className="space-y-1.5">
                                {cmsData.widgets[slotKey].map((widget, idx) => (
                                  <div key={idx} className="bg-[#12141b]/80 p-2.5 rounded border border-[#d9b45c]/5 text-xs text-[#c9c2ab] font-sans font-medium flex items-center justify-between">
                                    <span>{widget}</span>
                                    <button 
                                      onClick={() => {
                                        const nextSlot = cmsData.widgets[slotKey].filter((_, i) => i !== idx);
                                        handleSave({ ...cmsData, widgets: { ...cmsData.widgets, [slotKey]: nextSlot } });
                                      }}
                                      className="text-red-400 hover:text-red-300"
                                    >
                                      <Trash2 size={11} />
                                    </button>
                                  </div>
                                ))}
                              </div>

                              <button
                                onClick={() => {
                                  const newVal = window.prompt("Enter new widget specification text:");
                                  if (newVal) {
                                    const nextSlot = [...cmsData.widgets[slotKey], newVal];
                                    handleSave({ ...cmsData, widgets: { ...cmsData.widgets, [slotKey]: nextSlot } });
                                  }
                                }}
                                className="w-full py-1.5 border border-dashed border-[#d9b45c]/30 hover:border-[#d9b45c] text-[10px] text-[#d9b45c] rounded font-sans uppercase font-bold transition-all"
                              >
                                + Add Widget Element
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* THEME MEDIA ASSETS (LOGO, FAVICON, BACKGROUNDS) */}
                    {customizerSection === "assets" && (
                      <div className="bg-[#12141b] border border-[#d9b45c]/10 rounded-xl p-5 space-y-6">
                        <div className="border-b border-[#d9b45c]/10 pb-3 text-left">
                          <span className="text-[10px] text-[#d9b45c] uppercase font-bold tracking-widest block">WordPress Dynamic Theme Graphics Customizer</span>
                          <p className="text-[11px] text-[#c9c2ab] mt-1 leading-relaxed">
                            Replace brand logos, section backdrops, and interactive illustrations directly without modifying any source files. All cropped & optimized versions are cached locally in the CMS database.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                          {Object.keys(cmsData.customImages || {}).map((imageKey) => {
                            const imgInfo = cmsData.customImages?.[imageKey];
                            if (!imgInfo) return null;
                            
                            // Human-readable labels
                            const labels: Record<string, string> = {
                              siteLogo: "Header Academy Brand Logo",
                              siteFavicon: "Browser Tab Favicon",
                              heroBg: "Home Hero Section Background",
                              aboutTeacherBg: "Sheikh/Tutor Profile Section",
                              aboutFemaleTeacherBg: "Female Instructor Section BG",
                              kidsLearningBg: "Noorani Qaida/Kids Section Background",
                              tajweedMasteryBg: "Tajweed Specialty Graphic",
                              parentKidsQuranBg: "Family/Sibling Cohort Background",
                              islamicKidsLearningBg: "Recitation Classes Background",
                              islamicGirlQaidaBg: "Foundation Block Background",
                              quran3DIcon: "Golden Holy Quran 3D Icon Element"
                            };
                            
                            return (
                              <div key={imageKey} className="bg-[#07080b]/40 border border-[#d9b45c]/15 rounded-xl p-4 flex flex-col justify-between space-y-3">
                                <div className="space-y-2 text-left">
                                  <span className="text-[10px] text-[#d9b45c] uppercase font-extrabold tracking-widest block font-sans truncate">
                                    {labels[imageKey] || imageKey.replace(/([A-Z])/g, " $1")}
                                  </span>
                                  
                                  {/* Thumbnail Preview */}
                                  <div className="w-full h-24 rounded-lg overflow-hidden border border-white/5 bg-[#12141b] flex items-center justify-center relative group">
                                    <img 
                                      src={imgInfo.url} 
                                      alt={imgInfo.alt || "Theme Asset"} 
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                      <span className="text-[9px] text-[#d9b45c] uppercase font-bold tracking-widest bg-black/60 px-2 py-1 rounded">View Fullscreen</span>
                                    </div>
                                  </div>
                                  
                                  {/* Asset Info */}
                                  <div className="space-y-1 text-[11px] font-sans text-[#c9c2ab]/80 leading-tight">
                                    <p className="truncate"><strong className="text-white">Title:</strong> {imgInfo.title || "Untitled branding asset"}</p>
                                    <p className="truncate"><strong className="text-white">Alt SEO:</strong> {imgInfo.alt || "No alternative description"}</p>
                                    <p className="truncate font-mono text-[10px] text-gray-500"><strong className="text-white font-sans font-bold text-[10px]">Dims:</strong> {imgInfo.dimensions || "Auto Dynamic"}</p>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setCurrentThemeImageKey(imageKey);
                                    setIsThemeImageManagerOpen(true);
                                  }}
                                  className="w-full py-2 bg-[#d9b45c]/10 hover:bg-[#d9b45c] text-[#d9b45c] hover:text-black border border-[#d9b45c]/30 rounded-lg text-[10px] font-sans font-extrabold uppercase tracking-widest transition-all"
                                >
                                  Replace Theme Asset
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {/* TAB: SEO SETTINGS & MASTER VERIFICATIONS */}
                {activeTab === "seo-settings" && (
                  <div className="space-y-6 text-left animate-in fade-in duration-200">
                    <div className="border-b border-[#d9b45c]/15 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Globe className="text-[#d9b45c]" size={22} />
                          <h2 className="font-serif text-xl text-[#f3ecd8] font-bold">WordPress SEO Settings & Master Verifications</h2>
                        </div>
                        <p className="text-xs text-[#c9c2ab] mt-1 font-sans">
                          Manage site-wide webmaster tool verification tags, Google Search Console, analytics IDs, and custom &lt;head&gt; scripts.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          handleSave({ ...cmsData });
                        }}
                        className="px-5 py-2.5 bg-[#d9b45c] text-black hover:bg-[#f2d98a] text-xs font-sans font-extrabold uppercase tracking-wider rounded-lg transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <CheckCircle2 size={14} />
                        <span>Save SEO Settings</span>
                      </button>
                    </div>

                    {/* Google Search Console & Master Webmaster Verification Section */}
                    <div className="bg-[#12141b] border border-[#d9b45c]/25 rounded-xl p-6 space-y-6">
                      <div className="border-b border-[#d9b45c]/15 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <ShieldCheck className="text-blue-400" size={22} />
                            <h3 className="text-sm font-sans font-bold text-white uppercase tracking-wider">
                              Google Search Console Ownership Verification
                            </h3>
                          </div>
                          <p className="text-[11px] text-[#c9c2ab] mt-1 font-sans">
                            Paste the HTML tag or verification token from Google Search Console. It will be automatically parsed and injected into the HTML &lt;head&gt; of every page.
                          </p>
                        </div>

                        {/* Live Detection Status Badge */}
                        {(() => {
                          const raw = cmsData.integrations?.googleSiteVerification || cmsData.integrations?.gscId || "";
                          let code = String(raw).trim();
                          const match = code.match(/content=["']([^"']+)["']/i);
                          if (match && match[1]) code = match[1].trim();
                          if (code.includes("google-site-verification=")) code = code.replace(/^google-site-verification=/, "").trim();
                          
                          const isValid = code.length > 0 && code !== "TRUTH_QURAN_GSC_VERIFY_2026";
                          
                          return isValid ? (
                            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-full text-[11px] font-sans font-semibold">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                              <span>Meta Tag Injected & Detected</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-300 rounded-full text-[11px] font-sans font-semibold">
                              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                              <span>Awaiting Verification Code</span>
                            </span>
                          );
                        })()}
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label htmlFor="gsc-field-main" className="text-xs font-sans font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                              <span>Paste Google Search Console HTML Meta Tag or Verification Code</span>
                            </label>
                            <span className="text-[10px] text-[#d9b45c] font-mono bg-[#d9b45c]/10 px-2 py-0.5 rounded border border-[#d9b45c]/20">
                              google-site-verification
                            </span>
                          </div>

                          <textarea
                            id="gsc-field-main"
                            rows={2}
                            value={cmsData.integrations?.googleSiteVerification || cmsData.integrations?.gscId || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              const updatedIntegrations = {
                                ...(cmsData.integrations || {}),
                                googleSiteVerification: val,
                                gscId: val
                              };
                              handleSave({ ...cmsData, integrations: updatedIntegrations });
                            }}
                            placeholder={`Paste HTML tag from Search Console:\n<meta name="google-site-verification" content="YOUR_VERIFICATION_TOKEN" />`}
                            className="w-full bg-[#07080b] border border-[#d9b45c]/30 rounded-lg p-3 text-xs text-blue-200 font-mono placeholder:text-gray-600 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all leading-relaxed"
                          />
                          <p className="text-[10px] text-[#c9c2ab]/70 font-sans">
                            Supports full &lt;meta name="google-site-verification" content="..." /&gt;, key-value pairs, or raw token strings. Replaces old verification codes automatically.
                          </p>
                        </div>

                        {/* Live Meta Tag & Token Preview Inspector */}
                        {(() => {
                          const raw = cmsData.integrations?.googleSiteVerification || cmsData.integrations?.gscId || "";
                          let token = String(raw).trim();
                          const match = token.match(/content=["']([^"']+)["']/i);
                          if (match && match[1]) token = match[1].trim();
                          if (token.includes("google-site-verification=")) token = token.replace(/^google-site-verification=/, "").trim();
                          const hasToken = token.length > 0 && token !== "TRUTH_QURAN_GSC_VERIFY_2026";

                          return (
                            <div className="bg-[#07080b] border border-blue-500/20 rounded-lg p-4 space-y-3 font-mono text-xs">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 border-b border-white/5 pb-2">
                                <span className="uppercase font-sans font-bold text-[#d9b45c]">HTML &lt;head&gt; Inspection & Live Verification Output</span>
                                <span className={hasToken ? "text-emerald-400 font-bold font-sans" : "text-amber-400 font-sans"}>
                                  {hasToken ? "✓ Ready for Google Search Console Verification" : "⚠️ Paste Token Above"}
                                </span>
                              </div>

                              <div className="space-y-1.5">
                                <div className="flex items-center space-x-2 text-[11px]">
                                  <span className="text-gray-400 text-[10px] font-sans w-24">Extracted Token:</span>
                                  <code className={hasToken ? "text-blue-300 font-bold bg-blue-950/40 px-2 py-0.5 rounded border border-blue-800/40 break-all" : "text-gray-500 italic font-sans"}>
                                    {hasToken ? token : "No token entered yet"}
                                  </code>
                                </div>

                                <div className="flex items-center space-x-2 text-[11px]">
                                  <span className="text-gray-400 text-[10px] font-sans w-24">Live Meta Tag:</span>
                                  <code className={hasToken ? "text-emerald-400 font-bold bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-800/40 break-all" : "text-gray-500 italic font-sans"}>
                                    {hasToken ? `<meta name="google-site-verification" content="${token}" />` : "Not injected (waiting for token)"}
                                  </code>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Other Webmaster Tools (Bing, Analytics, GTM, FB Pixel) */}
                    <div className="bg-[#12141b] border border-[#d9b45c]/15 rounded-xl p-6 space-y-6">
                      <div className="border-b border-[#d9b45c]/10 pb-3 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-sans font-bold text-[#d9b45c] uppercase tracking-wider block">Additional Search Engines & Trackers</span>
                          <p className="text-[11px] text-[#c9c2ab] mt-0.5 font-sans">
                            Configure Bing Webmaster Tools, Google Analytics, Tag Manager, and Meta Pixel.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-5">
                        {/* Bing Webmaster Tools Field */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label htmlFor="bing-field" className="text-xs font-sans font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                              <span>Bing Webmaster Tools</span>
                            </label>
                            <span className="text-[10px] text-[#d9b45c] font-mono bg-[#d9b45c]/10 px-2 py-0.5 rounded border border-[#d9b45c]/20">
                              msvalidate.01
                            </span>
                          </div>
                          
                          <input
                            id="bing-field"
                            type="text"
                            value={cmsData.integrations?.bingSiteVerification || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              const updatedIntegrations = {
                                ...(cmsData.integrations || {}),
                                bingSiteVerification: val
                              };
                              handleSave({ ...cmsData, integrations: updatedIntegrations });
                            }}
                            placeholder="e.g. MS_VALIDATE_TRUTH_QURAN_2026"
                            className="w-full bg-[#07080b] border border-[#d9b45c]/25 rounded-lg p-3 text-xs text-white font-mono placeholder:text-gray-600 outline-none focus:border-[#d9b45c] focus:ring-1 focus:ring-[#d9b45c] transition-all"
                          />

                          <div className="bg-[#07080b]/60 border border-white/10 rounded-lg p-3 space-y-1 font-mono text-[11px]">
                            <span className="text-[9px] text-[#c9c2ab]/60 uppercase font-sans font-bold block">Auto-Injected &lt;head&gt; Meta Tag Preview:</span>
                            <code className="text-teal-400 block break-all">
                              {`<meta name="msvalidate.01" content="${
                                (cmsData.integrations?.bingSiteVerification || "")
                                  .replace(/<meta[^>]*content=["']([^"']+)["'][^>]*>/i, "$1")
                                  .replace(/^msvalidate\.01=/, "") || "YOUR_CODE"
                              }" />`}
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Analytics & Tracking IDs Block */}
                    <div className="bg-[#12141b] border border-[#d9b45c]/15 rounded-xl p-6 space-y-6">
                      <div className="border-b border-[#d9b45c]/10 pb-3">
                        <span className="text-xs font-sans font-bold text-[#d9b45c] uppercase tracking-wider block">Analytics & Pixel Trackers</span>
                        <p className="text-[11px] text-[#c9c2ab] mt-0.5 font-sans">
                          Connect tracking measurement IDs for Google Analytics (GA4), Google Tag Manager, and Facebook Pixel.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {/* GA4 */}
                        <div className="space-y-1.5">
                          <label htmlFor="ga4-field" className="text-xs font-sans font-bold text-white uppercase tracking-wider block">Google Analytics (GA4)</label>
                          <input
                            id="ga4-field"
                            type="text"
                            value={cmsData.integrations?.ga4Id || ""}
                            onChange={(e) => {
                              const updatedIntegrations = {
                                ...(cmsData.integrations || {}),
                                ga4Id: e.target.value
                              };
                              handleSave({ ...cmsData, integrations: updatedIntegrations });
                            }}
                            placeholder="e.g. G-TRUTHQURAN123"
                            className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-white font-mono outline-none focus:border-[#d9b45c]"
                          />
                          <span className="text-[10px] text-[#c9c2ab]/60 block font-sans">Measurement ID (e.g. G-XXXXXXXXXX)</span>
                        </div>

                        {/* GTM */}
                        <div className="space-y-1.5">
                          <label htmlFor="gtm-field" className="text-xs font-sans font-bold text-white uppercase tracking-wider block">Google Tag Manager</label>
                          <input
                            id="gtm-field"
                            type="text"
                            value={cmsData.integrations?.gtmId || ""}
                            onChange={(e) => {
                              const updatedIntegrations = {
                                ...(cmsData.integrations || {}),
                                gtmId: e.target.value
                              };
                              handleSave({ ...cmsData, integrations: updatedIntegrations });
                            }}
                            placeholder="e.g. GTM-P8QXTR"
                            className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-white font-mono outline-none focus:border-[#d9b45c]"
                          />
                          <span className="text-[10px] text-[#c9c2ab]/60 block font-sans">Container ID (e.g. GTM-XXXXXX)</span>
                        </div>

                        {/* FB Pixel */}
                        <div className="space-y-1.5">
                          <label htmlFor="fbpixel-field" className="text-xs font-sans font-bold text-white uppercase tracking-wider block">Facebook Pixel</label>
                          <input
                            id="fbpixel-field"
                            type="text"
                            value={cmsData.integrations?.fbPixelId || ""}
                            onChange={(e) => {
                              const updatedIntegrations = {
                                ...(cmsData.integrations || {}),
                                fbPixelId: e.target.value
                              };
                              handleSave({ ...cmsData, integrations: updatedIntegrations });
                            }}
                            placeholder="e.g. 9876543210123"
                            className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-white font-mono outline-none focus:border-[#d9b45c]"
                          />
                          <span className="text-[10px] text-[#c9c2ab]/60 block font-sans">Meta Pixel ID (e.g. 15-digit ID)</span>
                        </div>
                      </div>
                    </div>

                    {/* Custom Head Scripts Block */}
                    <div className="bg-[#12141b] border border-[#d9b45c]/15 rounded-xl p-6 space-y-4">
                      <div className="border-b border-[#d9b45c]/10 pb-3">
                        <span className="text-xs font-sans font-bold text-[#d9b45c] uppercase tracking-wider block">Custom Head Scripts</span>
                        <p className="text-[11px] text-[#c9c2ab] mt-0.5 font-sans">
                          Insert raw HTML, JavaScript snippets, or additional verification meta tags to be injected inside the &lt;head&gt; element.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <textarea
                          rows={4}
                          value={cmsData.integrations?.customHeadScripts || ""}
                          onChange={(e) => {
                            const updatedIntegrations = {
                              ...(cmsData.integrations || {}),
                              customHeadScripts: e.target.value
                            };
                            handleSave({ ...cmsData, integrations: updatedIntegrations });
                          }}
                          placeholder="<!-- Custom Head Tracking / Verification Snippets -->"
                          className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-3 text-xs text-emerald-400 font-mono leading-relaxed outline-none focus:border-[#d9b45c]"
                        />
                        <span className="text-[10px] text-[#c9c2ab]/60 block font-sans">
                          Supports &lt;script&gt;, &lt;meta&gt;, and &lt;link&gt; tag definitions.
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action bar */}
                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          handleSave({ ...cmsData });
                        }}
                        className="px-6 py-3 bg-[#d9b45c] text-black hover:bg-[#f2d98a] text-xs font-sans font-extrabold uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center space-x-2 cursor-pointer"
                      >
                        <CheckCircle2 size={16} />
                        <span>Save SEO Settings</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 9: USERS & AUTH ROLES */}
                {activeTab === "users" && (
                  <WPUserManager cmsData={cmsData} onSave={handleSave} />
                )}

                {/* TAB 10: SETTINGS */}
                {activeTab === "settings" && (
                  <div className="space-y-6 text-left">
                    <input 
                      type="file" 
                      ref={faviconFileInputRef} 
                      onChange={handleFaviconLocalUpload} 
                      accept=".ico,.png,.svg,.webp,.jpg,.jpeg,image/x-icon,image/png,image/svg+xml,image/webp,image/jpeg" 
                      className="hidden" 
                    />

                    <div className="border-b border-[#d9b45c]/15 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h2 className="font-serif text-xl text-[#f3ecd8] font-bold">WordPress Core Settings & Site Identity</h2>
                        <p className="text-xs text-[#c9c2ab] mt-1 font-sans">Manage Site Icon (Favicon), branding identity, permalinks, caching, and localization.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider ${isCustomFavicon ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/10 text-amber-300 border border-amber-500/30"}`}>
                          <span className={`w-2 h-2 rounded-full ${isCustomFavicon ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}></span>
                          {isCustomFavicon ? "Custom Favicon Active" : "Default Fallback Favicon"}
                        </span>
                      </div>
                    </div>

                    {/* DEDICATED FAVICON MANAGEMENT & SITE ICON MODULE */}
                    <div className="bg-[#12141b] border-2 border-[#d9b45c]/25 rounded-2xl p-6 space-y-6 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-96 h-96 bg-[#d9b45c]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                      
                      <div className="border-b border-[#d9b45c]/15 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#d9b45c]/15 border border-[#d9b45c]/30 flex items-center justify-center text-[#d9b45c]">
                              <Globe className="w-4 h-4" />
                            </div>
                            <div>
                              <h3 className="font-serif text-base text-[#f3ecd8] font-bold">Site Icon (Favicon) Management</h3>
                              <span className="text-[10px] text-[#d9b45c] uppercase font-bold tracking-wider">Dynamic HTML &lt;head&gt; Link Integration</span>
                            </div>
                          </div>
                          <p className="text-xs text-[#c9c2ab] leading-relaxed pt-1">
                            The Site Icon is what visitors see in browser tabs, bookmark bars, and WordPress mobile shortcuts. Upload an icon in <strong>.ico</strong>, <strong>.png</strong>, <strong>.svg</strong>, or <strong>.webp</strong> format (Recommended square size: <strong>512 × 512 pixels</strong>).
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* LEFT: REAL-TIME VISUAL PREVIEWS */}
                        <div className="lg:col-span-6 space-y-4">
                          <span className="text-[10px] text-[#d9b45c] uppercase font-extrabold tracking-widest block">Live Visual Previews</span>
                          
                          {/* 1. Realistic Browser Tab Simulation */}
                          <div className="bg-[#0b0c10] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                            {/* Browser Top Window Bar */}
                            <div className="bg-[#191b22] px-3 py-2 border-b border-white/10 flex items-center gap-2">
                              <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/80"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/80"></div>
                              </div>

                              {/* Active Simulated Tab */}
                              <div className="flex-1 max-w-[240px] bg-[#12141b] border-t border-l border-r border-[#d9b45c]/30 rounded-t-lg px-2.5 py-1.5 flex items-center justify-between gap-2 shadow-inner">
                                <div className="flex items-center gap-2 min-w-0">
                                  {/* Rendered Live Favicon Image in Tab */}
                                  <img 
                                    src={activeFaviconUrl} 
                                    alt="Browser Tab Favicon" 
                                    className="w-4 h-4 rounded-sm object-contain flex-shrink-0 bg-black/40 p-0.5 border border-[#d9b45c]/20" 
                                  />
                                  <span className="text-[11px] text-[#f3ecd8] font-sans font-medium truncate">
                                    {cmsData.siteSettings?.title || "Truth Quran Academy"} - Official
                                  </span>
                                </div>
                                <X className="w-3 h-3 text-gray-400 hover:text-white flex-shrink-0" />
                              </div>

                              {/* Plus New Tab Button */}
                              <Plus className="w-3.5 h-3.5 text-gray-500" />
                            </div>

                            {/* Simulated Browser URL Address Bar */}
                            <div className="bg-[#12141b] px-4 py-2 flex items-center gap-2 border-b border-white/5">
                              <div className="flex-1 bg-[#07080b] border border-white/10 rounded-md px-3 py-1 flex items-center gap-2 text-[11px] text-gray-400 font-mono">
                                <Lock className="w-3 h-3 text-emerald-400" />
                                <span className="text-gray-200 truncate">https://truthquranacademy.com</span>
                              </div>
                            </div>

                            <div className="p-3 text-center bg-[#07080b]/60">
                              <span className="text-[9px] text-[#c9c2ab]/70 font-mono uppercase tracking-wider">
                                Real-World Browser Tab Simulation (Active Favicon &lt;link rel="icon"&gt;)
                              </span>
                            </div>
                          </div>

                          {/* 2. Mobile / App Bookmark Preview */}
                          <div className="bg-[#0b0c10] border border-[#d9b45c]/15 rounded-xl p-4 flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-[#12141b] border-2 border-[#d9b45c]/40 flex items-center justify-center p-2 shadow-lg shadow-[#d9b45c]/10 flex-shrink-0">
                              <img 
                                src={activeFaviconUrl} 
                                alt="App Icon Preview" 
                                className="w-full h-full object-contain" 
                              />
                            </div>
                            <div className="min-w-0 flex-1 text-left">
                              <span className="text-[9px] text-[#d9b45c] uppercase font-bold tracking-widest block">Home Screen & Bookmark Icon</span>
                              <strong className="text-xs text-[#f3ecd8] font-serif block truncate">{cmsData.siteSettings?.title || "Truth Quran Academy"}</strong>
                              <p className="text-[10px] text-[#c9c2ab]/60 font-sans mt-0.5">Retina App Launcher, Safari Touch Icons & PWA Manifest</p>
                            </div>
                          </div>

                        </div>

                        {/* RIGHT: FAVICON CONTROLS, REPLACEMENT & METADATA */}
                        <div className="lg:col-span-6 space-y-4">
                          <span className="text-[10px] text-[#d9b45c] uppercase font-extrabold tracking-widest block">Favicon Controls & Actions</span>

                          {/* Active Favicon Metadata Card */}
                          <div className="bg-[#07080b] border border-[#d9b45c]/15 rounded-xl p-4 space-y-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[#c9c2ab] font-sans">Active Icon Status:</span>
                              <span className={`font-bold font-sans ${isCustomFavicon ? "text-emerald-400" : "text-[#d9b45c]"}`}>
                                {isCustomFavicon ? "Custom Active Favicon" : "Default Academy Emblem"}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-xs border-t border-white/5 pt-2">
                              <span className="text-[#c9c2ab] font-sans">Detected Dimensions:</span>
                              <span className="text-white font-mono text-[11px]">{cmsData.customImages?.siteFavicon?.dimensions || "512 × 512 px"}</span>
                            </div>

                            <div className="flex items-center justify-between text-xs border-t border-white/5 pt-2">
                              <span className="text-[#c9c2ab] font-sans">Format & MIME Type:</span>
                              <span className="text-white font-mono text-[11px]">{determineFaviconMimeType(activeFaviconUrl)}</span>
                            </div>

                            <div className="flex items-center justify-between text-xs border-t border-white/5 pt-2">
                              <span className="text-[#c9c2ab] font-sans">HTML Head Injection:</span>
                              <span className="text-emerald-400 font-sans font-bold text-[10px] flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> &lt;link rel="icon"&gt; Active
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                            {/* Upload from Local Device */}
                            <button
                              type="button"
                              onClick={() => faviconFileInputRef.current?.click()}
                              className="py-2.5 px-3 bg-[#d9b45c] hover:bg-[#c49f47] text-black rounded-lg text-xs font-sans font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                            >
                              <Upload className="w-4 h-4" />
                              Upload Favicon
                            </button>

                            {/* Choose from Media Library */}
                            <button
                              type="button"
                              onClick={() => {
                                setCurrentThemeImageKey("siteFavicon");
                                setIsThemeImageManagerOpen(true);
                              }}
                              className="py-2.5 px-3 bg-[#12141b] hover:bg-[#1a1d26] text-[#d9b45c] border border-[#d9b45c]/40 rounded-lg text-xs font-sans font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                            >
                              <ImageIcon className="w-4 h-4" />
                              Media Library
                            </button>
                          </div>

                          {/* Replace / Change & Remove Buttons */}
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => faviconFileInputRef.current?.click()}
                              className="flex-1 py-2 px-3 bg-[#07080b] hover:bg-white/5 text-gray-200 border border-white/10 rounded-lg text-[11px] font-sans font-semibold flex items-center justify-center gap-1.5 transition-all"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-[#d9b45c]" />
                              Change / Replace Icon
                            </button>

                            <button
                              type="button"
                              onClick={handleFaviconRemove}
                              disabled={!isCustomFavicon}
                              className={`py-2 px-3 rounded-lg text-[11px] font-sans font-semibold flex items-center justify-center gap-1.5 transition-all ${isCustomFavicon ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30" : "bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed"}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Remove (Revert Default)
                            </button>
                          </div>

                          {/* HTML Snippet Notice */}
                          <div className="bg-[#07080b]/80 border border-white/5 rounded-lg p-2.5 font-mono text-[10px] text-[#c9c2ab]/70 leading-relaxed">
                            <span className="text-[#d9b45c] font-bold block mb-1">Dynamic Header Code:</span>
                            &lt;link rel="icon" type="{determineFaviconMimeType(activeFaviconUrl)}" href="{activeFaviconUrl.slice(0, 38)}..." /&gt;
                          </div>

                        </div>
                      </div>
                    </div>

                    {/* GENERAL SITE IDENTITY (TITLE & TAGLINE) */}
                    <div className="bg-[#12141b] border border-[#d9b45c]/10 rounded-xl p-5 space-y-4">
                      <span className="text-[10px] text-[#d9b45c] uppercase font-bold tracking-widest block border-b border-[#d9b45c]/10 pb-1.5">Site Identity & General Branding</span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-[#c9c2ab] uppercase font-bold">Site Title</label>
                          <input 
                            type="text" 
                            value={cmsData.siteSettings?.title || "Truth Quran Academy"}
                            onChange={(e) => {
                              const settings = { ...cmsData.siteSettings, title: e.target.value };
                              handleSave({ ...cmsData, siteSettings: settings });
                            }}
                            className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded p-2.5 text-xs text-white font-serif outline-none focus:border-[#d9b45c]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] text-[#c9c2ab] uppercase font-bold">Tagline</label>
                          <input 
                            type="text" 
                            value={cmsData.siteSettings?.tagline || "Learn Quran Online with Certified Arab & Native Tutors"}
                            onChange={(e) => {
                              const settings = { ...cmsData.siteSettings, tagline: e.target.value };
                              handleSave({ ...cmsData, siteSettings: settings });
                            }}
                            className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded p-2.5 text-xs text-white font-sans outline-none focus:border-[#d9b45c]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* PERMALINKS & LOCALIZATION */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Permalinks & Reading */}
                      <div className="bg-[#12141b] border border-[#d9b45c]/10 rounded-xl p-5 space-y-4">
                        <span className="text-[10px] text-[#d9b45c] uppercase font-bold tracking-widest block border-b border-[#d9b45c]/10 pb-1.5">Permalinks & Reading Structure</span>
                        
                        <div className="space-y-3 text-xs">
                          <div className="space-y-1">
                            <label className="text-[10px] text-[#c9c2ab] uppercase font-bold">SEO Friendly Permalink URL Structure</label>
                            <select 
                              value={cmsData.siteSettings?.permalinkStructure || "/%postname%/"}
                              onChange={(e) => {
                                const settings = { ...cmsData.siteSettings, permalinkStructure: e.target.value };
                                handleSave({ ...cmsData, siteSettings: settings });
                              }}
                              className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded p-2 text-xs text-white font-mono"
                            >
                              <option value="/?p=%post_id%">Plain (/?p=123)</option>
                              <option value="/%year%/%monthnum%/%postname%/">Day and Name</option>
                              <option value="/%category%/%postname%/">Category and Name</option>
                              <option value="/%postname%/">Post Name (/%postname%/) - Recommended</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-[#c9c2ab] uppercase font-bold">Reading: Front page displays</label>
                            <div className="bg-[#07080b]/50 p-2.5 rounded border border-[#d9b45c]/10 text-[#c9c2ab]">
                              📚 FrontPage (Static Landing Page) mapped to <strong>Truth Quran Academy Front-Page template</strong>.
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Direction & RTL toggles */}
                      <div className="bg-[#12141b] border border-[#d9b45c]/10 rounded-xl p-5 space-y-4">
                        <span className="text-[10px] text-[#d9b45c] uppercase font-bold tracking-widest block border-b border-[#d9b45c]/10 pb-1.5">RTL Layout & Translation Settings</span>
                        
                        <div className="space-y-4 text-xs">
                          <div className="flex items-center justify-between">
                            <div>
                              <strong className="text-white block">RTL Layout Support</strong>
                              <span className="text-[10px] text-[#c9c2ab]/50 mt-0.5 block">Mirror alignment directions for Arabic/Urdu languages</span>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => {
                                const settings = { ...cmsData.siteSettings, isRTL: !cmsData.siteSettings?.isRTL };
                                handleSave({ ...cmsData, siteSettings: settings });
                              }}
                              className={`px-3 py-1 rounded text-[10px] font-sans font-extrabold uppercase tracking-wider ${cmsData.siteSettings?.isRTL ? "bg-green-500/10 text-green-400 border border-green-500/30" : "bg-red-500/10 text-red-400 border border-red-500/30"}`}
                            >
                              {cmsData.siteSettings?.isRTL ? "Active (RTL)" : "Disabled (LTR)"}
                            </button>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-[#c9c2ab] uppercase font-bold">Site Language</label>
                            <input 
                              type="text" 
                              value={cmsData.siteSettings?.defaultLanguage || "en-US"}
                              onChange={(e) => {
                                const settings = { ...cmsData.siteSettings, defaultLanguage: e.target.value };
                                handleSave({ ...cmsData, siteSettings: settings });
                              }}
                              className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded p-2 text-xs text-white font-sans outline-none"
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* TAB: AI INTEGRATIONS & API CREDENTIALS */}
                {activeTab === "ai-settings" && (
                  <WPAISettings
                    cmsData={cmsData}
                    onSave={(updatedData, customMsg) => {
                      handleSave(updatedData, customMsg);
                    }}
                  />
                )}

                {/* TAB 11: WP TOOLS */}
                {activeTab === "tools" && (
                  <div className="space-y-6 text-left">
                    <div className="border-b border-[#d9b45c]/15 pb-2">
                      <h2 className="font-serif text-xl text-[#f3ecd8] font-bold">WordPress Theme Database Utilities & Tools</h2>
                      <p className="text-xs text-[#c9c2ab] mt-1 font-sans">Simulate checking database health indices, viewing generated XML sitemaps, or exporting/importing JSON backups.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Database checks */}
                      <div className="bg-[#12141b] border border-[#d9b45c]/10 rounded-xl p-5 space-y-4">
                        <span className="text-[10px] text-[#d9b45c] uppercase font-bold tracking-widest block border-b border-[#d9b45c]/10 pb-1.5">Database Diagnostic Actions</span>
                        
                        <div className="space-y-2 text-xs font-sans">
                          <button
                            type="button"
                            onClick={() => alert("WordPress Database Tables Optimized. 0 orphaned post_meta keys removed.")}
                            className="w-full py-2.5 bg-[#07080b]/50 border border-[#d9b45c]/20 rounded hover:border-[#d9b45c] text-[#f3ecd8] hover:text-white transition-colors uppercase font-bold tracking-wider text-[10px]"
                          >
                            Optimize Database Tables
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              window.open("/sitemap.xml", "_blank");
                            }}
                            className="w-full py-2.5 bg-[#07080b]/50 border border-[#d9b45c]/20 rounded hover:border-[#d9b45c] text-[#f3ecd8] hover:text-white transition-colors uppercase font-bold tracking-wider text-[10px]"
                          >
                            View &amp; Regenerate XML Sitemap
                          </button>
                        </div>
                      </div>

                      {/* Export / Import */}
                      <div className="bg-[#12141b] border border-[#d9b45c]/10 rounded-xl p-5 space-y-4">
                        <span className="text-[10px] text-[#d9b45c] uppercase font-bold tracking-widest block border-b border-[#d9b45c]/10 pb-1.5">Download / Import WordPress XML Backup</span>
                        
                        <div className="space-y-3 text-xs">
                          <button
                            type="button"
                            onClick={() => {
                              const content = JSON.stringify(cmsData, null, 2);
                              const blob = new Blob([content], { type: "application/json" });
                              const url = URL.createObjectURL(blob);
                              const link = document.createElement("a");
                              link.setAttribute("href", url);
                              link.setAttribute("download", "truth_quran_wordpress_backup.json");
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="w-full py-2.5 bg-[#d9b45c] text-black rounded hover:bg-[#f2d98a] transition-all uppercase font-bold tracking-wider text-[10px] flex items-center justify-center space-x-2"
                          >
                            <Download size={14} />
                            <span>Export WordPress Content XML</span>
                          </button>

                          <div className="border border-dashed border-[#d9b45c]/30 rounded p-3 text-center text-[11px] text-[#c9c2ab]/70 font-sans">
                            To import a backup, drag and drop the `.json` configuration backup file here.
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* TAB 12: DIRECT THEME EXPORT GUIDES */}
                {activeTab === "theme" && (
                  <div className="space-y-6 text-left">
                    <div className="bg-[#12141b]/50 border border-[#d9b45c]/15 rounded-2xl p-6">
                      <h2 className="font-serif text-2xl text-[#f3ecd8] font-bold font-medium leading-normal">Your Custom WordPress Theme is Ready!</h2>
                      <p className="text-xs text-[#c9c2ab] mt-2 leading-relaxed font-sans">
                        We have generated the complete custom WordPress theme source files natively in this workspace! You can easily export/download them in one simple step, ready to be uploaded to any standard WordPress site.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xs font-sans uppercase font-bold text-[#d9b45c] tracking-wider border-b border-[#d9b45c]/10 pb-2">How to install your theme in WordPress</h3>
                      
                      <ol className="list-decimal list-inside space-y-3.5 text-xs text-[#c9c2ab] leading-relaxed font-sans">
                        <li>
                          <strong className="text-white">Export this workspace as a ZIP:</strong> Open the top AI Studio settings/export menu and click on <span className="text-[#d9b45c] font-bold">Download ZIP</span>.
                        </li>
                        <li>
                          <strong className="text-white">Locate the Theme Folder:</strong> Extract the downloaded ZIP file and locate the folder named <code className="bg-[#12141b] text-[#f2d98a] px-1.5 py-0.5 rounded border border-[#d9b45c]/20 font-mono">/wordpress-theme/truth-quran-theme/</code>.
                        </li>
                        <li>
                          <strong className="text-white">Compress the theme folder:</strong> Turn just the <code className="bg-[#12141b] text-[#f2d98a] px-1.5 py-0.5 rounded border border-[#d9b45c]/20 font-mono">truth-quran-theme</code> folder into a standard <code className="bg-[#12141b] text-[#f2d98a] px-1.5 py-0.5 rounded border border-[#d9b45c]/20 font-mono">.zip</code>.
                        </li>
                        <li>
                          <strong className="text-white">Upload to WordPress Dashboard:</strong> Log in to your WordPress site, navigate to <strong className="text-white">Appearance › Themes › Add New › Upload Theme</strong>, choose your <code className="bg-[#12141b] text-[#f2d98a] px-1.5 py-0.5 rounded border border-[#d9b45c]/20 font-mono">truth-quran-theme.zip</code>, and click install!
                        </li>
                        <li>
                          <strong className="text-white">Install Rank Math Pro:</strong> Install the Rank Math Pro plugin to manage all titles, canonical tags, redirections, and breadcrumbs seamlessly.
                        </li>
                      </ol>
                    </div>

                    <div className="bg-[#d9b45c]/10 border border-[#d9b45c]/30 rounded-xl p-5 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-[#d9b45c] tracking-wider block">Theme Developer Verification</span>
                        <p className="text-xs text-[#c9c2ab] font-sans">Theme coding compliant with official WP standards, PHP 8+, and modern styling hooks.</p>
                      </div>
                      <div className="px-4 py-2 bg-[#d9b45c] text-black font-sans font-extrabold text-xs rounded-lg uppercase tracking-wider">
                        Verified Build
                      </div>
                    </div>
                  </div>
                )}

              </main>

            </div>

          </div>
        </div>
      )}

      {/* Theme Customizer Advanced Media Library Modal overlay */}
      <WPMediaLibraryModal
        isOpen={isThemeImageManagerOpen}
        onClose={() => setIsThemeImageManagerOpen(false)}
        mediaLibrary={cmsData.mediaLibrary || []}
        onSelect={(img) => {
          if (currentThemeImageKey) {
            const updatedCustomImages = {
              ...(cmsData.customImages || {}),
              [currentThemeImageKey]: {
                url: img.url,
                alt: img.alt || img.title,
                title: img.title,
                caption: img.caption,
                description: img.description,
                dimensions: img.dimensions || "512x512",
                size: img.size
              }
            };
            
            let updatedSettings = cmsData.siteSettings;
            if (currentThemeImageKey === "siteFavicon") {
              updatedSettings = {
                ...(cmsData.siteSettings || {}),
                favicon: img.url
              } as any;
              applyFaviconToDocument(img.url);
            }

            handleSave({
              ...cmsData,
              customImages: updatedCustomImages,
              siteSettings: updatedSettings
            }, currentThemeImageKey === "siteFavicon" ? "✅ Site favicon updated from Media Library and injected into HTML <head>!" : undefined);
          }
        }}
        onSaveMediaLibrary={(updatedMedia) => {
          handleSave({
            ...cmsData,
            mediaLibrary: updatedMedia
          });
        }}
        defaultCropAspect={
          currentThemeImageKey === "siteLogo" || currentThemeImageKey === "siteFavicon" ? "1:1" : "free"
        }
      />

      {/* Floating Global Toast Notification Overlay */}
      {isSaving && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[99999] flex items-center space-x-3 bg-[#12141b]/95 border border-amber-500/50 text-amber-300 px-6 py-3.5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
          <span className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin"></span>
          <span className="text-xs font-sans font-bold uppercase tracking-wider">Saving & Synchronizing Database...</span>
        </div>
      )}

      {!isSaving && toastNotification && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[99999] flex items-center space-x-3 px-6 py-3.5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300 ${
          toastNotification.type === "success" 
            ? "bg-[#0b1b13]/95 border border-emerald-500/60 text-emerald-300" 
            : "bg-[#1b0b0b]/95 border border-red-500/60 text-red-300"
        }`}>
          {toastNotification.type === "success" ? (
            <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
          )}
          <span className="text-xs font-sans font-extrabold tracking-wide">{toastNotification.message}</span>
          <button 
            onClick={() => setToastNotification(null)}
            className="ml-3 text-gray-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </>
  );
}
