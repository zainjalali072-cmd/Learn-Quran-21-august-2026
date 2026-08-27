import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Award, 
  Shield, 
  Calendar, 
  UserCheck, 
  Star, 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  ArrowRight, 
  Check, 
  Sparkles, 
  ArrowUpRight,
  BookOpen,
  HelpCircle,
  GraduationCap
} from "lucide-react";

import { 
  academyContact, 
  coursesData, 
  whyUsData, 
  processSteps, 
  pricingPlans, 
  testimonialsData 
} from "./data";

import Header from "./components/Header";
import Starfield from "./components/Starfield";
import WhatsAppModal from "./components/WhatsAppModal";
import logoImg from "./assets/images/truth_quran_new_logo_1784203145448.jpg";
import kidsLearningBg from "./assets/images/kids_quran_learning_1784116863937.jpg";
import teacherBg from "./assets/images/online_quran_teacher_1784116886285.jpg";
import femaleTeacherBg from "./assets/images/female_quran_tutor_1784119152017.jpg";
import tajweedMasteryBg from "./assets/images/tajweed_mastery_art_1784119171753.jpg";
import islamicKidsLearningBg from "./assets/images/islamic_kids_learning_1784120227940.jpg";
import islamicGirlQaidaBg from "./assets/images/islamic_girl_qaida_1784120204322.jpg";
import FAQAccordion from "./components/FAQAccordion";
import ContactForm from "./components/ContactForm";
import MapSection from "./components/MapSection";
import DeveloperCard from "./components/DeveloperCard";
import Footer from "./components/Footer";
import AutoOpeningQuran from "./components/AutoOpeningQuran";
import BlogSection from "./components/BlogSection";
import WPSimulator from "./components/WPSimulator";
import SEOHead from "./components/SEOHead";
import { getCMSData, fetchCMSDataFromServer, getCourseFallbackImage } from "./cmsStore";

import AboutPage from "./components/AboutPage";
import CoursesPage from "./components/CoursesPage";
import NooraniQaidaPage from "./components/NooraniQaidaPage";
import KidsClassesPage from "./components/KidsClassesPage";
import FeesPage from "./components/FeesPage";
import VideosPage from "./components/VideosPage";
import ContactPage from "./components/ContactPage";
import DownloadPage from "./components/DownloadPage";
import NotFoundPage from "./components/NotFoundPage";

// Simple custom count-up component using React state and native frame scheduler
function CountUpNumber({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

import { parseCurrentRoute, navigateToRoute } from "./utils/router";

export default function App() {
  const [routeState, setRouteState] = useState(() => parseCurrentRoute());
  const [cms, setCms] = useState(getCMSData());

  const currentView = routeState.view;
  const activePostId = routeState.activePostId;
  const isWpAdmin = routeState.isWpAdmin;

  const setView = (newView: string, postId?: string | null, catSlug?: string | null, tagSlug?: string | null) => {
    navigateToRoute(newView, postId !== undefined ? postId : activePostId, catSlug !== undefined ? catSlug : routeState.categorySlug, tagSlug !== undefined ? tagSlug : routeState.tagSlug);
  };

  const setActivePostId = (id: string | null) => {
    if (id) {
      navigateToRoute("blog-post", id);
    } else {
      navigateToRoute("blog", null);
    }
  };

  const setIsWpAdmin = (val: boolean) => {
    if (val) {
      navigateToRoute("wp-admin");
    } else {
      navigateToRoute("home");
    }
  };

  useEffect(() => {
    const handleRoute = () => {
      setRouteState(parseCurrentRoute());
    };
    window.addEventListener("popstate", handleRoute);
    window.addEventListener("app_route_changed", handleRoute);
    return () => {
      window.removeEventListener("popstate", handleRoute);
      window.removeEventListener("app_route_changed", handleRoute);
    };
  }, []);

  useEffect(() => {
    fetchCMSDataFromServer();
    const handleSync = () => setCms(getCMSData());
    window.addEventListener("cms_data_updated", handleSync);
    return () => window.removeEventListener("cms_data_updated", handleSync);
  }, []);

  // Track real-time page views and session activity on the server
  useEffect(() => {
    let pageName = currentView;
    if (currentView === "blog" && activePostId) {
      pageName = `blog/${activePostId}`;
    }

    let sessionId = sessionStorage.getItem("tqa_session_id");
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem("tqa_session_id", sessionId);
    }

    const path = `/${pageName === "home" ? "" : pageName}`;
    const payload = {
      page: path,
      url: window.location.pathname,
      referrer: document.referrer,
      sessionId,
      userAgent: navigator.userAgent
    };

    fetch("/api/track-view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest"
      },
      body: JSON.stringify(payload)
    }).catch((e) => console.warn("Traffic tracker offline:", e));

    // Active heartbeat ping every 25 seconds
    const heartbeatInterval = setInterval(() => {
      fetch("/api/analytics/heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, page: path })
      }).catch(() => {});
    }, 25000);

    return () => clearInterval(heartbeatInterval);
  }, [currentView, activePostId]);

  // In-page navigation helper
  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (isWpAdmin) {
    return (
      <WPSimulator 
        onClose={() => {
          window.history.pushState(null, "", "/");
          setIsWpAdmin(false);
          setView("home");
        }} 
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-[#07080b] text-[#f3ecd8] font-sans selection:bg-[#d9b45c] selection:text-[#07080b]">
      
      {/* Dynamic Style Overrides from WordPress Admin Dashboard Theme Customizer */}
      <style>{`
        :root {
          --color-gold: ${cms.themeColors?.primaryGold || "#d9b45c"};
          --color-bg-dark: ${cms.themeColors?.bgDark || "#07080b"};
          --color-card-bg: ${cms.themeColors?.cardBg || "#12141b"};
          --color-text-light: ${cms.themeColors?.textLight || "#f3ecd8"};
          --color-text-muted: ${cms.themeColors?.textMuted || "#c9c2ab"};
          --font-headings: "${cms.themeTypography?.headingFont || "Playfair Display"}", serif;
          --font-body: "${cms.themeTypography?.bodyFont || "Inter"}", sans-serif;
        }

        /* Set base colors and fonts dynamically */
        body, .min-h-screen {
          background-color: var(--color-bg-dark) !important;
          color: var(--color-text-light) !important;
          font-family: var(--font-body) !important;
          font-size: ${cms.themeTypography?.baseFontSize || "16px"} !important;
        }

        h1, h2, h3, h4, h5, h6, .font-serif {
          font-family: var(--font-headings) !important;
        }

        .text-\\[\\#f3ecd8\\] {
          color: var(--color-text-light) !important;
        }

        .text-\\[\\#c9c2ab\\] {
          color: var(--color-text-muted) !important;
        }

        .text-\\[\\#d9b45c\\] {
          color: var(--color-gold) !important;
        }

        .border-\\[\\#d9b45c\\] {
          border-color: var(--color-gold) !important;
        }

        .bg-\\[\\#d9b45c\\] {
          background-color: var(--color-gold) !important;
        }

        .bg-\\[\\#12141b\\] {
          background-color: var(--color-card-bg) !important;
        }

        /* Dynamic Section Background Images from Media Library / CMS */
        .hero-section-bg {
          background-image: linear-gradient(to bottom, rgba(14, 16, 21, 0.94), rgba(7, 8, 11, 0.97)), url("${cms.customImages?.heroBg?.url || kidsLearningBg}") !important;
        }
        .why-us-section-bg {
          background-image: linear-gradient(to bottom, rgba(7, 8, 11, 0.95), rgba(14, 16, 21, 0.96)), url("${cms.customImages?.aboutFemaleTeacherBg?.url || femaleTeacherBg}") !important;
        }
        .courses-section-bg {
          background-image: linear-gradient(to bottom, rgba(14, 16, 21, 0.94), rgba(7, 8, 11, 0.96)), url("${cms.customImages?.tajweedMasteryBg?.url || tajweedMasteryBg}") !important;
        }
        .process-section-bg {
          background-image: linear-gradient(to bottom, rgba(7, 8, 11, 0.94), rgba(14, 16, 21, 0.97)), url("${cms.customImages?.islamicKidsLearningBg?.url || islamicKidsLearningBg}") !important;
        }
        .pricing-section-bg {
          background-image: linear-gradient(to bottom, rgba(14, 16, 21, 0.95), rgba(7, 8, 11, 0.95)), url("${cms.customImages?.aboutTeacherBg?.url || teacherBg}") !important;
        }
        .reviews-section-bg {
          background-image: linear-gradient(to bottom, rgba(7, 8, 11, 0.95), rgba(14, 16, 21, 0.95)), url("${cms.customImages?.aboutFemaleTeacherBg?.url || femaleTeacherBg}") !important;
        }
        .blog-section-bg {
          background-image: linear-gradient(to bottom, rgba(14, 16, 21, 0.95), rgba(7, 8, 11, 0.97)), url("${cms.customImages?.tajweedMasteryBg?.url || tajweedMasteryBg}") !important;
        }
        .faq-section-bg {
          background-image: linear-gradient(to bottom, rgba(7, 8, 11, 0.95), rgba(14, 16, 21, 0.96)), url("${cms.customImages?.islamicGirlQaidaBg?.url || islamicGirlQaidaBg}") !important;
        }
        .contact-section-bg {
          background-image: linear-gradient(to bottom, rgba(14, 16, 21, 0.94), rgba(7, 8, 11, 0.97)), url("${cms.customImages?.aboutTeacherBg?.url || teacherBg}") !important;
        }

        /* RTL Layout Support */
        ${cms.siteSettings?.isRTL ? `
          body {
            direction: rtl !important;
            text-align: right !important;
          }
          .text-left {
            text-align: right !important;
          }
          .text-right {
            text-align: left !important;
          }
        ` : ""}
      `}</style>

      {/* Dynamic SEO Head with Auto Metadata & Google Search Console verification */}
      <SEOHead 
        cmsData={cms} 
        currentView={currentView} 
        activePostId={activePostId} 
        categorySlug={routeState.categorySlug}
        tagSlug={routeState.tagSlug}
      />

      {/* 1. Global Translucent Twinkling Starfield Background */}
      <Starfield />

      {/* 2. Translucent Translucent Header */}
      <Header 
        currentView={currentView} 
        setView={setView} 
        onNavigate={handleScrollToSection} 
      />

      {/* Main Content Area */}
      <main className="relative z-10">
        
        {currentView === "home" && (
          <>
            {/* HERO SECTION */}
            {cms.sectionsVisibility?.hero !== false && (
              <section 
                id="hero" 
                className="hero-section-bg pt-10 pb-20 md:py-28 overflow-hidden flex items-center min-h-[calc(100vh-80px)]"
              >
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
                
                {/* Left Column: Text & Stats */}
                <div className="lg:col-span-7 space-y-8 text-left" id="hero-left-content">
                  
                  {/* Eyebrow kicker label */}
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d9b45c] animate-ping" />
                    <span className="text-[12px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c]">
                      {cms.heroKicker}
                    </span>
                  </div>

                  {/* Headline with serif and custom gold italicized word */}
                  <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#f3ecd8] font-medium leading-[1.1] tracking-tight">
                    {cms.heroTitle.includes("Spiritual") ? (
                      <>
                        Embark on a Spiritual <br />
                        Journey with <span className="text-[#d9b45c] italic font-normal font-serif">Divine</span> Precision
                      </>
                    ) : (
                      cms.heroTitle
                    )}
                  </h1>

                  {/* Supporting paragraph */}
                  <p className="text-xs md:text-sm lg:text-base text-[#c9c2ab] leading-relaxed max-w-xl font-light">
                    {cms.heroDescription}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-4 pt-2">
                    {/* Primary Green WhatsApp CTA */}
                    <a
                      href={`${cms.whatsappLink}?text=Salam,%20I%20would%20like%20to%20register%20for%20a%20Free%20Trial%20at%20Truth%20Quran%20Academy.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-6 py-4 rounded-full bg-[#1fae5b] text-white text-xs md:text-sm font-sans font-extrabold uppercase tracking-wider shadow-[0_8px_20px_rgba(31,174,91,0.35)] hover:shadow-[0_8px_30px_rgba(31,174,91,0.55)] hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <MessageCircle size={18} className="fill-current" />
                      <span>{cms.heroPrimaryBtnText}</span>
                    </a>

                    {/* Secondary Outline CTA */}
                    <button
                      onClick={() => handleScrollToSection("courses")}
                      className="px-6 py-4 rounded-full border border-[#d9b45c]/30 text-xs md:text-sm font-sans font-bold uppercase tracking-wider text-[#f3ecd8] hover:bg-[#d9b45c]/10 hover:border-[#d9b45c] transition-all duration-300 cursor-pointer"
                    >
                      {cms.heroSecondaryBtnText}
                    </button>
                  </div>

                  {/* Class Platforms Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-3 text-left">
                    <span className="text-[10px] font-sans uppercase tracking-widest text-[#d9b45c] font-bold">
                      Classes Held Live Via:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#12141b]/80 border border-[#d9b45c]/20 text-[11px] text-[#f3ecd8] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span>Zoom</span>
                      </span>
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#12141b]/80 border border-[#d9b45c]/20 text-[11px] text-[#f3ecd8] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1fae5b] animate-pulse" />
                        <span>WhatsApp</span>
                      </span>
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#12141b]/80 border border-[#d9b45c]/20 text-[11px] text-[#f3ecd8] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                        <span>Google Meet</span>
                      </span>
                    </div>
                  </div>

                  {/* Divider line */}
                  <div className="w-full h-[1px] bg-[#d9b45c]/15 pt-2" />

                  {/* Stat Badges Count-Up */}
                  <div className="grid grid-cols-3 gap-4" id="hero-stat-badges">
                    <div className="bg-[#12141b]/40 border border-[#d9b45c]/10 rounded-2xl p-4 text-center">
                      <div className="font-serif text-xl md:text-2xl lg:text-3xl font-bold text-[#f2d98a]">
                        <CountUpNumber end={5000} suffix="+" />
                      </div>
                      <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-[#c9c2ab] mt-1 font-semibold">
                        Students Taught
                      </div>
                    </div>

                    <div className="bg-[#12141b]/40 border border-[#d9b45c]/10 rounded-2xl p-4 text-center">
                      <div className="font-serif text-xl md:text-2xl lg:text-3xl font-bold text-[#f2d98a]">
                        <CountUpNumber end={45} suffix="+" />
                      </div>
                      <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-[#c9c2ab] mt-1 font-semibold">
                        Certified Tutors
                      </div>
                    </div>

                    <div className="bg-[#12141b]/40 border border-[#d9b45c]/10 rounded-2xl p-4 text-center">
                      <div className="font-serif text-xl md:text-2xl lg:text-3xl font-bold text-[#f2d98a]">
                        <CountUpNumber end={99} suffix=".6%" />
                      </div>
                      <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-[#c9c2ab] mt-1 font-semibold">
                        Success Rate
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column: Auto-Opening Holy Quran with Rotating Surah Al-Ikhlas */}
                <div className="lg:col-span-5 flex justify-center items-center relative" id="hero-right-visual">
                  <div className="relative w-full aspect-square max-w-[26rem] md:max-w-[30rem] flex items-center justify-center">
                    <AutoOpeningQuran />
                  </div>
                </div>

              </div>
            </section>
            )}

            {/* ARABIC VERSE TICKER */}
            <div className="w-full bg-[#0e1015] border-y border-[#d9b45c]/18 py-4 overflow-hidden relative select-none">
              <div className="flex animate-marquee-loop whitespace-nowrap items-center space-x-12">
                
                {/* Text Block repeated for infinite loop */}
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-12 flex-shrink-0">
                    <span className="font-arabic text-[#f2d98a] text-lg md:text-xl font-bold">
                      وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ
                    </span>
                    <span className="text-xs md:text-sm font-serif text-[#f3ecd8] italic">
                      "And We have indeed made the Quran easy to understand and remember..." — Surah Al-Qamar, 54:17
                    </span>
                    <span className="text-[#d9b45c] text-sm">✦</span>
                    
                    <span className="font-arabic text-[#f2d98a] text-lg md:text-xl font-bold">
                      أَوْ زِدْ عَلَيْهِ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا
                    </span>
                    <span className="text-xs md:text-sm font-serif text-[#f3ecd8] italic">
                      "And recite the Quran with measured, beautiful recitation (Tajweed)." — Surah Al-Muzzammil, 73:4
                    </span>
                    <span className="text-[#d9b45c] text-sm">✦</span>
                  </div>
                ))}

              </div>
            </div>

            {/* WHY CHOOSE US */}
            {cms.sectionsVisibility?.whyUs !== false && (
            <section id="why-us" className="why-us-section-bg border-y border-[#d9b45c]/10">
              <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 relative">
                {/* Decorative side blurs */}
                <div className="absolute top-1/4 left-0 w-72 h-72 bg-[#d9b45c]/3 blur-[120px] pointer-events-none rounded-full" />
                <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-[#d9b45c]/3 blur-[120px] pointer-events-none rounded-full" />

                {/* Centered Heading */}
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-3 relative z-10">
                  <span className="text-[12px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c] bg-[#d9b45c]/8 border border-[#d9b45c]/15 px-3 py-1 rounded-full">
                    Our Uncompromising Standards
                  </span>
                  <h2 className="font-serif text-3xl md:text-5xl text-[#f3ecd8] font-medium tracking-tight leading-[1.15]">
                    Why Families Choose <br />
                    <span className="text-[#d9b45c] italic font-normal">Truth Quran Academy</span>
                  </h2>
                  <p className="text-xs md:text-sm text-[#c9c2ab] leading-relaxed max-w-lg mx-auto">
                    We blend traditional Jamia Naeemia Lahore pedagogical values with cutting-edge global streaming software, ensuring comfortable, safe, and elite lessons for your household.
                  </p>
                </div>

                {/* 4-Column Responsive Bento-Style Card Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10" id="why-us-grid">
                  {whyUsData.map((item, index) => {
                    let IconComp = Award;
                    if (item.iconName === "UserCheck") IconComp = UserCheck;
                    if (item.iconName === "Shield") IconComp = Shield;
                    if (item.iconName === "Calendar") IconComp = Calendar;

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.25 } }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="bg-[#12141b]/70 border border-[#d9b45c]/15 rounded-2xl p-6 text-left hover:border-[#d9b45c]/50 hover:shadow-[0_20px_45px_rgba(217,180,92,0.1)] transition-all duration-300 group flex flex-col justify-between cursor-pointer"
                      >
                        <div>
                          {/* Beautiful Badge with Glow */}
                          <div className="w-12 h-12 rounded-xl bg-[#0e1015] border border-[#d9b45c]/20 flex items-center justify-center text-[#d9b45c] mb-6 group-hover:bg-[#d9b45c] group-hover:text-[#07080b] group-hover:border-[#d9b45c] transition-all duration-300 relative overflow-hidden shadow-inner">
                            {/* Halo effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#d9b45c]/5 to-transparent pointer-events-none" />
                            <IconComp size={20} className="relative z-10" />
                          </div>
                          
                          {/* Title */}
                          <h3 className="font-sans font-bold text-sm md:text-base text-[#f3ecd8] group-hover:text-[#f2d98a] transition-colors">
                            {item.title}
                          </h3>
                          
                          {/* Description */}
                          <p className="text-xs text-[#c9c2ab] mt-3 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        {/* Small visual card footer dot */}
                        <div className="w-1.5 h-1.5 rounded-full bg-[#d9b45c]/20 group-hover:bg-[#d9b45c] transition-colors mt-6" />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </section>
            )}

            {/* COURSES SECTION */}
            {cms.sectionsVisibility?.courses !== false && (
            <section id="courses" className="courses-section-bg py-20 md:py-28 border-y border-[#d9b45c]/12">
              <div className="max-w-7xl mx-auto px-6">
                
                {/* Centered Heading */}
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                  <span className="text-[12px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c]">
                    Curriculums
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl text-[#f3ecd8] font-medium tracking-tight">
                    Our Structured <span className="text-[#d9b45c] italic font-normal">Quran Programs</span>
                  </h2>
                  <p className="text-xs md:text-sm text-[#c9c2ab] leading-relaxed">
                    Designed by Jamia Naeemia Lahore pedagogical specialists, our courses cater to absolute beginners taking their first phonetics steps, up to students seeking complete Ijazah.
                  </p>
                </div>

                {/* 3-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="courses-grid">
                  {cms.courses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -6, scale: 1.015, transition: { duration: 0.25 } }}
                      transition={{ duration: 0.6, delay: index * 0.08 }}
                      className="bg-[#12141b] border border-[#d9b45c]/15 rounded-2xl overflow-hidden hover:border-[#d9b45c]/45 hover:shadow-[0_25px_50px_rgba(217,180,92,0.1)] transition-all duration-300 flex flex-col justify-between group"
                    >
                      {/* Media Area with Image & Radial Gold Glow */}
                      <div className="h-44 bg-[#07080b] relative flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
                        
                        {/* Course Image Background */}
                        <img 
                          src={course.image || getCourseFallbackImage(course.id || course.title)} 
                          alt=""
                          aria-hidden="true"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const target = e.currentTarget;
                            const fallback = getCourseFallbackImage(course.id || course.title);
                            if (target.src !== fallback) {
                              target.src = fallback;
                            } else {
                              target.style.display = "none";
                            }
                          }}
                          className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:scale-110 transition-transform duration-700 pointer-events-none"
                        />
                        
                        {/* Glowing backdrop & overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1015] via-[#07080b]/65 to-transparent pointer-events-none" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,180,92,0.15)_0%,transparent_85%)] pointer-events-none" />
                        
                        {/* Uppercase difficulty tag pill */}
                        <span className="absolute top-4 right-4 text-[9px] font-sans uppercase font-bold text-[#d9b45c] bg-[#07080b]/80 border border-[#d9b45c]/35 px-2.5 py-1 rounded-full backdrop-blur-sm z-10">
                          {course.difficulty}
                        </span>

                        {/* Large Arabic Calligraphic Glyph representative */}
                        <div className="font-arabic text-[#d9b45c] text-5xl font-bold tracking-widest drop-shadow-[0_4px_15px_rgba(217,180,92,0.4)] group-hover:scale-110 transition-transform duration-500 relative z-10">
                          {course.arabicGlyph}
                        </div>
                        
                        <span className="absolute bottom-4 left-4 text-[9px] font-sans uppercase tracking-widest font-bold text-[#f3ecd8] bg-[#07080b]/60 px-2 py-0.5 rounded border border-[#d9b45c]/10 backdrop-blur-xs z-10">
                          {course.tag}
                        </span>
                      </div>

                      {/* Card Content Body */}
                      <div className="p-6 space-y-3 text-left">
                        <h3 className="font-sans font-bold text-base md:text-lg text-[#f3ecd8] group-hover:text-[#f2d98a] transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-xs text-[#c9c2ab] leading-relaxed">
                          {course.description}
                        </p>
                      </div>

                      {/* Card Buttons */}
                      <div className="px-6 pb-6 pt-3 border-t border-[#d9b45c]/8 grid grid-cols-2 gap-3">
                        <a
                          href={`${academyContact.whatsapp}?text=Salam!%20I%20would%20like%20to%20enroll%20in%20the%20${encodeURIComponent(course.title)}%20course%20at%20Truth%20Quran%20Academy.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full text-center py-2.5 rounded-full bg-gradient-to-r from-[#f2d98a] to-[#d9b45c] text-[10px] font-sans font-extrabold uppercase tracking-widest text-[#07080b] hover:shadow-[0_4px_15px_rgba(217,180,92,0.3)] transition-all flex items-center justify-center space-x-1"
                        >
                          <span>Enroll</span>
                        </a>

                        <a
                          href={`${academyContact.whatsapp}?text=Salam!%20I%20would%20like%20to%20request%20a%20Free%20Trial%20lesson%20for%20the%20${encodeURIComponent(course.title)}%20program.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full text-center py-2.5 rounded-full border border-[#d9b45c]/20 text-[10px] font-sans font-extrabold uppercase tracking-widest text-[#c9c2ab] hover:bg-[#d9b45c]/8 hover:border-[#d9b45c] hover:text-[#f3ecd8] transition-all flex items-center justify-center"
                        >
                          <span>Trial</span>
                        </a>
                      </div>

                    </motion.div>
                  ))}
                </div>

              </div>
            </section>
            )}

            {/* PROCESS SECTION */}
            {cms.sectionsVisibility?.process !== false && (
            <section id="process" className="process-section-bg border-y border-[#d9b45c]/10">
              <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
                
                {/* Centered Heading */}
                <div className="text-center max-w-2xl mx-auto mb-20 space-y-3">
                  <span className="text-[12px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c]">
                    Your Roadmap
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl text-[#f3ecd8] font-medium tracking-tight">
                    How Our Online Academy <span className="text-[#d9b45c] italic font-normal">Works</span>
                  </h2>
                  <p className="text-xs md:text-sm text-[#c9c2ab] leading-relaxed">
                    Start learning from anywhere globally in 4 elementary steps. No physical files, fully digital synchronization.
                  </p>
                </div>

                {/* 4-Step Process Grid connected by thin gold gradient line */}
                <div className="relative" id="process-steps-container">
                  
                  {/* Connecting Line (Desktop Only) */}
                  <div className="hidden lg:block absolute top-14 left-16 right-16 h-[1.5px] bg-gradient-to-r from-[#d9b45c]/5 via-[#d9b45c]/35 to-[#d9b45c]/5 z-0" />

                  {/* Steps Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10" id="process-row">
                    {processSteps.map((step, index) => (
                      <motion.div
                        key={step.stepNumber}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.12 }}
                        className="text-left space-y-4"
                      >
                        {/* Number Circle */}
                        <div className="w-16 h-16 rounded-full bg-[#0e1015] border-2 border-[#d9b45c] flex items-center justify-center shadow-[0_0_20px_rgba(217,180,92,0.15)] relative">
                          <span className="font-serif text-[#f2d98a] font-bold text-xl">
                            0{step.stepNumber}
                          </span>
                        </div>

                        {/* Text */}
                        <div className="space-y-2">
                          <h3 className="font-sans font-bold text-sm md:text-base text-[#f3ecd8]">
                            {step.title}
                          </h3>
                          <p className="text-xs text-[#c9c2ab] leading-relaxed">
                            {step.description}
                          </p>
                        </div>

                      </motion.div>
                    ))}
                  </div>

                </div>
              </div>
            </section>
            )}

            {/* PRICING SECTION */}
            {cms.sectionsVisibility?.pricing !== false && (
            <section id="pricing" className="pricing-section-bg py-20 md:py-28 border-y border-[#d9b45c]/12 relative">
              <div className="max-w-7xl mx-auto px-6">
                
                {/* Centered Heading */}
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                  <span className="text-[12px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c]">
                    Investment Plans
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl text-[#f3ecd8] font-medium tracking-tight">
                    Affordable <span className="text-[#d9b45c] italic font-normal">Monthly Tuition</span>
                  </h2>
                  <p className="text-xs md:text-sm text-[#c9c2ab] leading-relaxed">
                    No long-term contracts. Choose the monthly commitment that perfectly aligns with your schedule and budget.
                  </p>
                </div>

                {/* 3-Column Price Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start" id="pricing-grid">
                  {(cms.pricingPlans || pricingPlans).map((plan, index) => {
                    const isPopular = plan.isPopular;
                    const basePrice = parseInt((plan.price || "").replace("$", ""), 10) || 30;
                    
                    // PKR equivalencies for new $30, $45, $60 base fees
                    let pkrEquivalent = "";
                    if (basePrice === 30 || plan.id === "tier-1" || plan.id === "price-1" || plan.name?.toLowerCase().includes("2 days") || plan.name?.toLowerCase().includes("starter")) {
                      pkrEquivalent = "3,500";
                    } else if (basePrice === 45 || plan.id === "tier-2" || plan.id === "price-2" || plan.name?.toLowerCase().includes("3 days") || plan.name?.toLowerCase().includes("premium")) {
                      pkrEquivalent = "5,000";
                    } else if (basePrice === 60 || plan.id === "tier-3" || plan.id === "price-3" || plan.name?.toLowerCase().includes("5 days") || plan.name?.toLowerCase().includes("mastery")) {
                      pkrEquivalent = "7,000";
                    } else {
                      pkrEquivalent = Math.round(basePrice * 116.66).toLocaleString();
                    }

                    // Dynamic other currency equivalents for $30, $45, $60
                    const gbpEquivalent = basePrice === 30 ? 23 : (basePrice === 45 ? 35 : (basePrice === 60 ? 47 : Math.round(basePrice * 0.78)));
                    const eurEquivalent = basePrice === 30 ? 28 : (basePrice === 45 ? 41 : (basePrice === 60 ? 55 : Math.round(basePrice * 0.92)));
                    const cadEquivalent = basePrice === 30 ? 41 : (basePrice === 45 ? 62 : (basePrice === 60 ? 82 : Math.round(basePrice * 1.37)));
                    const audEquivalent = basePrice === 30 ? 45 : (basePrice === 45 ? 68 : (basePrice === 60 ? 91 : Math.round(basePrice * 1.51)));

                    return (
                      <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ y: isPopular ? -20 : -8, scale: 1.025, transition: { duration: 0.25 } }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className={`rounded-3xl p-6 md:p-8 text-left transition-all duration-300 relative ${
                          isPopular
                            ? "bg-[#12141b] border-2 border-[#d9b45c] shadow-[0_25px_50px_rgba(217,180,92,0.2)] lg:-translate-y-4"
                            : "bg-[#12141b]/70 border border-[#d9b45c]/15 shadow-[0_15px_35px_rgba(0,0,0,0.5)]"
                        }`}
                      >
                        {/* Ribbon Badge for Popular Plan */}
                        {isPopular && (
                          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#f2d98a] to-[#d9b45c] text-[#07080b] font-sans font-extrabold text-[9px] uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
                            Most Popular Plan
                          </span>
                        )}

                        <div className="space-y-4">
                          {/* Plan Name */}
                          <h3 className="font-sans font-bold text-sm md:text-base text-[#c9c2ab] uppercase tracking-wider">
                            {plan.name}
                          </h3>

                          {/* Price */}
                          <div className="space-y-3">
                            <div className="flex items-baseline border-b border-[#d9b45c]/10 pb-2">
                              <span className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#f3ecd8] font-bold">
                                {plan.price}
                              </span>
                              <span className="font-sans text-xs text-[#c9c2ab] ml-2">
                                /{plan.period}
                              </span>
                            </div>
                            
                            {/* Line-wise Country Equivalents (USD, PKR, then others) */}
                            <div className="space-y-1.5 pt-0.5 text-[11px] text-[#c9c2ab]">
                              <div className="flex justify-between items-center bg-[#d9b45c]/5 border border-[#d9b45c]/15 rounded-lg px-2.5 py-1.5">
                                <span className="font-bold text-[#d9b45c]">PKR Equivalent:</span>
                                <span className="font-extrabold text-[#f3ecd8]">
                                  Rs. {pkrEquivalent}
                                </span>
                              </div>
                              <div className="flex justify-between items-center px-1">
                                <span>GBP Equivalent:</span>
                                <span className="font-semibold text-[#f3ecd8]">
                                  £{gbpEquivalent}
                                </span>
                              </div>
                              <div className="flex justify-between items-center px-1">
                                <span>EUR Equivalent:</span>
                                <span className="font-semibold text-[#f3ecd8]">
                                  €{eurEquivalent}
                                </span>
                              </div>
                              <div className="flex justify-between items-center px-1">
                                <span>CAD Equivalent:</span>
                                <span className="font-semibold text-[#f3ecd8]">
                                  C${cadEquivalent}
                                </span>
                              </div>
                              <div className="flex justify-between items-center px-1">
                                <span>AUD Equivalent:</span>
                                <span className="font-semibold text-[#f3ecd8]">
                                  A${audEquivalent}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="w-full h-[1px] bg-[#d9b45c]/10 my-2" />

                          {/* Features List */}
                          <ul className="space-y-3" id={`features-${plan.id}`}>
                            {plan.features.map((feat, fIdx) => (
                              <li key={fIdx} className="flex items-start space-x-3 text-xs text-[#c9c2ab] leading-relaxed">
                                <Check size={14} className="text-[#d9b45c] mt-0.5 flex-shrink-0" />
                                <span className="select-none">{feat}</span>
                              </li>
                            ))}
                          </ul>

                          {/* CTA Button */}
                          <div className="pt-4">
                            <a
                              href={`${academyContact.whatsapp}?text=Salam!%20I%20would%20like%20to%20register%20for%20the%20${encodeURIComponent(plan.name)}%20fee%20plan%20at%20Truth%20Quran%20Academy.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`w-full py-3.5 rounded-full font-sans font-bold text-xs uppercase tracking-widest text-center flex items-center justify-center space-x-2 transition-all duration-300 ${
                                isPopular
                                  ? "bg-gradient-to-r from-[#f2d98a] to-[#d9b45c] text-[#07080b] shadow-[0_4px_15px_rgba(217,180,92,0.3)] hover:shadow-[0_4px_25px_rgba(217,180,92,0.5)] hover:-translate-y-0.5"
                                  : "border border-[#d9b45c]/30 text-[#f3ecd8] hover:bg-[#d9b45c]/10 hover:border-[#d9b45c]"
                              }`}
                            >
                              <span>Enroll Under This Plan</span>
                            </a>
                          </div>

                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Subtext Disclaimer */}
                <p className="text-[10px] md:text-xs text-[#c9c2ab] text-center mt-12 max-w-lg mx-auto select-none leading-relaxed">
                  * Customs slots and multi-student sibling discounts are available upon request. Please connect with the coordination desk to customize your schedule.
                </p>

              </div>
            </section>
            )}

            {/* TESTIMONIALS */}
            {cms.sectionsVisibility?.testimonials !== false && (
            <section id="reviews" className="reviews-section-bg py-20 md:py-28 overflow-hidden border-y border-[#d9b45c]/12">
              
              {/* Centered Heading */}
              <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                <span className="text-[12px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c]">
                  Global Voices
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-[#f3ecd8] font-medium tracking-tight">
                  What Our <span className="text-[#d9b45c] italic font-normal">Students Say</span>
                </h2>
                <p className="text-xs md:text-sm text-[#c9c2ab] leading-relaxed">
                  Empowering thousands of believers across USA, UK, Canada, Australia, and Western Europe to master recitation elegantly.
                </p>
              </div>

              {/* Infinite Auto-scrolling Testimonials Marquee Track (pure CSS marquee loop) */}
              <div className="w-full relative hover-pause py-4">
                <div className="flex animate-marquee-loop whitespace-nowrap space-x-6">
                  
                  {/* Duplicated track to loop perfectly seamless */}
                  {Array.from({ length: 2 }).map((_, trackIdx) => (
                    <div key={trackIdx} className="flex space-x-6 flex-shrink-0">
                      {testimonialsData.map((testimonial) => (
                        <div
                          key={`${testimonial.id}-${trackIdx}`}
                          className="inline-block w-[320px] md:w-[380px] bg-[#12141b]/70 border border-[#d9b45c]/10 rounded-2xl p-6 whitespace-normal text-left select-none"
                        >
                          {/* 5-Star Row */}
                          <div className="flex items-center space-x-1 text-[#f2d98a] mb-4">
                            {Array.from({ length: testimonial.rating }).map((_, starIdx) => (
                              <Star key={starIdx} size={14} className="fill-current" />
                            ))}
                          </div>

                          {/* Quote */}
                          <p className="text-xs md:text-sm text-[#c9c2ab] italic leading-relaxed min-h-[72px]">
                            "{testimonial.quote}"
                          </p>

                          {/* Author line */}
                          <div className="border-t border-[#d9b45c]/10 pt-4 mt-4 flex items-center justify-between">
                            <span className="font-sans font-bold text-xs text-[#f3ecd8]">
                              {testimonial.name}
                            </span>
                            <span className="text-[10px] font-sans font-semibold text-[#d9b45c]">
                              {testimonial.country}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}

                </div>
              </div>
            </section>
            )}

            {/* ACADEMY BLOG SECTION (Archive Mode) */}
            {cms.sectionsVisibility?.blog !== false && (
            <section id="blog" className="blog-section-bg py-20 md:py-28 border-y border-[#d9b45c]/12">
              <div className="max-w-7xl mx-auto px-6">
                
                {/* Centered Heading */}
                <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
                  <span className="text-[12px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c]">
                    Education & Insights
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl text-[#f3ecd8] font-medium tracking-tight">
                    The Academy <span className="text-[#d9b45c] italic font-normal">Insights Blog</span>
                  </h2>
                  <p className="text-xs md:text-sm text-[#c9c2ab] leading-relaxed">
                    Read professional guide articles on Tajweed mechanics, traditional Hifz strategies, and classical Arabic linguistic studies.
                  </p>
                </div>

                {/* Interactive Blog Component (handles category filtering & navigation) */}
                <BlogSection
                  currentView={currentView}
                  setView={setView}
                  activePostId={activePostId}
                  setActivePostId={setActivePostId}
                />

              </div>
            </section>
            )}

            {/* GENERAL FAQ SECTION */}
            {cms.sectionsVisibility?.faqs !== false && (
            <section id="faq" className="faq-section-bg border-y border-[#d9b45c]/10">
              <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
                
                {/* Centered Heading */}
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                  <span className="text-[12px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c]">
                    Got Questions?
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl text-[#f3ecd8] font-medium tracking-tight">
                    Frequently Asked <span className="text-[#d9b45c] italic font-normal">Questions</span>
                  </h2>
                  <p className="text-xs md:text-sm text-[#c9c2ab] leading-relaxed">
                    Clear, objective answers detailing global class delivery, tutoring standards, and secure cancellation rules.
                  </p>
                </div>

                {/* Interactive single-open accordion */}
                <FAQAccordion />

              </div>
            </section>
            )}

            {/* CTA BAND (Full Width Contrasting Gradient Band) */}
            <section className="contact-section-bg py-16 md:py-20 relative overflow-hidden border-y border-[#d9b45c]/20">
              
              {/* Soft gold backdrop glow */}
              <div className="absolute inset-0 bg-[#d9b45c]/3 pointer-events-none filter blur-[80px]" />

              <div className="max-w-4xl mx-auto px-6 text-center space-y-6 relative z-10" id="cta-band-content">
                <span className="text-[10px] md:text-[11px] font-sans uppercase font-extrabold tracking-[0.25em] text-[#d9b45c]">
                  Begin Your Journey
                </span>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#f3ecd8] font-medium tracking-tight leading-none">
                  Let Us Guide You Towards <br />
                  <span className="text-[#d9b45c] italic font-normal font-serif">Perfect Quranic Recitation</span>
                </h2>
                <p className="text-xs md:text-sm text-[#c9c2ab] leading-relaxed max-w-xl mx-auto">
                  Take a risk-free 30-minute evaluation class today. We evaluate pronunciation, formulate a customized path, and match you with native instructors.
                </p>

                {/* Buttons row */}
                <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
                  <a
                    href={`${academyContact.whatsapp}?text=Salam!%20I%20would%20like%20to%20register%20for%20a%20Free%20Evaluation%20Class%20at%20Truth%20Quran%20Academy.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-6 py-4 rounded-full bg-[#1fae5b] text-white text-xs md:text-sm font-sans font-extrabold uppercase tracking-wider shadow-[0_8px_20px_rgba(31,174,91,0.35)] hover:bg-[#1fae5b]/90 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <MessageCircle size={18} className="fill-current" />
                    <span>WhatsApp Trial Session</span>
                  </a>

                  <a
                    href={`tel:${academyContact.phone.replace(/\s+/g, "")}`}
                    className="inline-flex items-center space-x-2 px-6 py-4 rounded-full border border-[#d9b45c]/30 text-xs md:text-sm font-sans font-bold uppercase tracking-wider text-[#f3ecd8] hover:bg-[#d9b45c]/10 hover:border-[#d9b45c] hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <Phone size={16} />
                    <span>Call Helpline Now</span>
                  </a>
                </div>
              </div>
            </section>

            {/* CONTACT SECTION (Two Column) */}
            {cms.sectionsVisibility?.contact !== false && (
            <section id="contact" className="py-20 md:py-28 max-w-7xl mx-auto px-6">
              <ContactForm />
            </section>
            )}

            {/* GOOGLE MAP LOCATION SECTION */}
            {cms.sectionsVisibility?.map !== false && (
              <MapSection />
            )}
          </>
        )}

        {currentView === "about" && <AboutPage setView={setView} />}
        {currentView === "courses" && <CoursesPage />}
        {currentView === "noorani-qaida" && <NooraniQaidaPage />}
        {currentView === "kids-classes" && <KidsClassesPage />}
        {currentView === "fees" && <FeesPage />}
        {currentView === "download" && <DownloadPage setView={setView} />}
        {currentView === "videos" && <VideosPage />}
        {(currentView === "blog" || currentView === "category" || currentView === "tag") && (
          <div className="max-w-7xl mx-auto px-6 py-12 text-left space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-[12px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c] bg-[#d9b45c]/8 border border-[#d9b45c]/15 px-3 py-1 rounded-full">
                Education & Insights
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-[#f3ecd8] font-medium tracking-tight">
                {currentView === "category" ? (
                  <>Category: <span className="text-[#d9b45c] italic font-normal">{routeState.categorySlug?.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) || "Articles"}</span></>
                ) : currentView === "tag" ? (
                  <>Tagged: <span className="text-[#d9b45c] italic font-normal">#{routeState.tagSlug?.replace(/-/g, " ") || "Topics"}</span></>
                ) : (
                  <>The Academy <span className="text-[#d9b45c] italic font-normal">Insights Blog</span></>
                )}
              </h2>
              <p className="text-xs md:text-sm text-[#c9c2ab] leading-relaxed">
                Read professional guide articles on Tajweed mechanics, traditional Hifz strategies, and classical Arabic linguistic studies.
              </p>
            </div>
            <BlogSection
              currentView={currentView}
              setView={setView}
              activePostId={activePostId}
              setActivePostId={setActivePostId}
              categorySlug={routeState.categorySlug}
              tagSlug={routeState.tagSlug}
            />
          </div>
        )}
        {currentView === "contact" && <ContactPage />}
        {currentView === "blog-post" && (
          <div className="py-12 bg-[#07080b]">
            <BlogSection
              currentView={currentView}
              setView={setView}
              activePostId={activePostId}
              setActivePostId={setActivePostId}
              categorySlug={routeState.categorySlug}
              tagSlug={routeState.tagSlug}
            />
          </div>
        )}
        {currentView === "404" && <NotFoundPage setView={setView} />}

      </main>

      {/* 15. Academy Footer */}
      <Footer 
        setView={setView} 
        onNavigate={handleScrollToSection} 
      />



       {/* 16. Floating WhatsApp Pulse Button & Modal */}
       <WhatsAppModal />
 
     </div>
   );
 }
