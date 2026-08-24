import React from "react";
import { motion } from "motion/react";
import { Compass, Home, BookOpen, DollarSign, Phone, ArrowRight, Search } from "lucide-react";

interface NotFoundPageProps {
  setView: (view: string) => void;
}

export default function NotFoundPage({ setView }: NotFoundPageProps) {
  const quickLinks = [
    { label: "Homepage", icon: Home, view: "home", desc: "Return to our main academy overview" },
    { label: "All Quran Courses", icon: BookOpen, view: "courses", desc: "Explore Tajweed, Hifz & Qaida programs" },
    { label: "Tuition & Fees", icon: DollarSign, view: "fees", desc: "View affordable monthly pricing plans" },
    { label: "Academy Blog", icon: Search, view: "blog", desc: "Read free Tajweed guides & study tips" },
    { label: "Contact Us", icon: Phone, view: "contact", desc: "Book your free 1-on-1 trial class" },
  ];

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-6 relative z-10" id="not-found-container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl w-full text-center space-y-8 bg-[#12141b]/80 border border-[#d9b45c]/25 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-md"
      >
        {/* Error Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#d9b45c]/10 border border-[#d9b45c]/30 text-[#d9b45c] text-xs font-sans uppercase font-bold tracking-widest">
          <Compass size={14} className="animate-spin-slow" />
          <span>Error 404 &bull; Page Not Found</span>
        </div>

        {/* Headline */}
        <div className="space-y-3">
          <h1 className="font-serif text-4xl md:text-5xl text-[#f3ecd8] font-bold tracking-tight">
            The Page You Are Looking For <span className="text-[#d9b45c] italic font-normal">Cannot Be Found</span>
          </h1>
          <p className="text-xs md:text-sm text-[#c9c2ab] max-w-lg mx-auto leading-relaxed">
            The URL may have been mistyped, moved, or deleted. Please use the quick navigation below or return to the homepage to explore Truth Quran Academy.
          </p>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
          {quickLinks.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => {
                  setView(item.view);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="p-4 rounded-2xl bg-[#07080b]/70 border border-white/5 hover:border-[#d9b45c]/40 transition-all duration-200 flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center space-x-3 truncate mr-2">
                  <div className="w-10 h-10 rounded-xl bg-[#d9b45c]/10 border border-[#d9b45c]/20 flex items-center justify-center shrink-0 group-hover:bg-[#d9b45c]/20 transition-colors">
                    <Icon size={18} className="text-[#d9b45c]" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-[#f3ecd8] group-hover:text-[#f2d98a] transition-colors">
                      {item.label}
                    </div>
                    <div className="text-[10px] text-[#c9c2ab]/70 truncate">
                      {item.desc}
                    </div>
                  </div>
                </div>
                <ArrowRight size={14} className="text-[#c9c2ab] group-hover:text-[#d9b45c] group-hover:translate-x-1 transition-all shrink-0" />
              </button>
            );
          })}
        </div>

        {/* Primary Home Button */}
        <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              setView("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#f2d98a] to-[#d9b45c] text-[#07080b] font-extrabold text-xs uppercase tracking-wider rounded-full shadow-lg hover:brightness-110 transition-all cursor-pointer"
          >
            &larr; Back to Homepage
          </button>
          <button
            onClick={() => {
              setView("contact");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#12141b] border border-[#d9b45c]/30 text-[#f3ecd8] hover:text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all cursor-pointer"
          >
            Book Free Trial Class
          </button>
        </div>
      </motion.div>
    </div>
  );
}
