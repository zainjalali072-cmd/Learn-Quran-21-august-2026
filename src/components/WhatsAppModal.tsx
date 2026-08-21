import React, { useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { academyContact } from "../data";

export default function WhatsAppModal() {
  const [isOpen, setIsOpen] = useState(false);

  const presets = [
    {
      title: "Enroll in a Course",
      desc: "Register for regular classes",
      message: "Salam! I would like to enroll in a course at Truth Quran Academy. Please guide me about the registration process."
    },
    {
      title: "Book a Free Trial",
      desc: "Try a 30-min evaluation",
      message: "Salam! I would like to book a Free Trial session for my child/myself at Truth Quran Academy."
    },
    {
      title: "Course Catalog Info",
      desc: "Learn details about syllabi",
      message: "Salam! I would like to learn more about the courses you offer, specifically Tajweed and Memorization."
    },
    {
      title: "Class Timings & Days",
      desc: "Discuss 24/7 schedules",
      message: "Salam! Can you please share the available time slots and scheduling options for online classes?"
    },
    {
      title: "Fee Plans & Discounts",
      desc: "Pricing details per month",
      message: "Salam! Could you please share the details of your monthly fees and payment options?"
    },
    {
      title: "General Inquiry",
      desc: "Ask any other question",
      message: "Salam! I have a general question about Truth Quran Academy. Could you please connect me to an advisor?"
    }
  ];

  const handlePresetClick = (msg: string) => {
    const encoded = encodeURIComponent(msg);
    const url = `${academyContact.whatsapp}?text=${encoded}`;
    window.open(url, "_blank");
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 rounded-full bg-gradient-to-r from-[#1fae5b] to-[#15803d] text-white flex items-center justify-center px-4 shadow-[0_8px_30px_rgba(31,174,91,0.4)] hover:shadow-[0_8px_35px_rgba(31,174,91,0.6)] cursor-pointer hover:scale-105 transition-all duration-300 relative group border border-[#d9b45c]/25"
          aria-label="Contact WhatsApp"
          id="floating-whatsapp-btn"
        >
          {/* Pulsing ring */}
          <span className="absolute -inset-1.5 rounded-full border border-[#1fae5b]/40 animate-ping pointer-events-none" />
          
          <div className="flex items-center space-x-2">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M12.012 2c-5.506 0-9.988 4.479-9.988 9.985 0 1.764.459 3.49 1.33 5.009L1.395 23l6.194-1.623c1.456.794 3.084 1.211 4.743 1.211 5.506 0 9.988-4.479 9.988-9.985a9.94 9.94 0 0 0-2.928-7.06A9.94 9.94 0 0 0 12.012 2zm4.957 14.124c-.213.6-1.248 1.153-1.724 1.219-.465.066-.928.117-2.754-.619-2.333-.941-3.824-3.3-3.94-3.46-.116-.16-.94-1.249-.94-2.384 0-1.135.592-1.693.805-1.912.213-.219.465-.274.62-.274.156 0 .311.002.448.008.14.006.326-.053.51.391.19.46.649 1.583.706 1.7.057.117.095.252.016.411-.079.159-.118.258-.236.396-.118.138-.248.309-.354.415-.118.119-.241.248-.104.484.137.235.609 1.005 1.302 1.62.893.794 1.644 1.039 1.88 1.157.236.119.373.1.512-.06.138-.16.592-.689.75-1.01.156-.32.311-.274.526-.195.213.079 1.36.641 1.593.753.235.114.39.171.448.271.058.1.058.579-.155 1.18z"/>
            </svg>
            <span className="text-xs font-sans font-extrabold uppercase tracking-wider pr-1">
              {isOpen ? "Close" : "Chat Support"}
            </span>
          </div>
        </button>
      </div>

      {/* Slide-up Quick-Reply Modal */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 w-[360px] max-w-[calc(100vw-48px)] bg-white border border-[#d9b45c]/35 rounded-2xl shadow-[0_15px_40px_rgba(40,30,10,0.12)] overflow-hidden z-50 transition-all duration-300 flex flex-col"
          id="whatsapp-quick-reply-modal"
        >
          {/* Modal Header */}
          <div className="bg-[#F6F3EB] px-5 py-4 border-b border-[#d9b45c]/20 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-[#1fae5b]/10 border border-[#1fae5b]/25 flex items-center justify-center text-[#1fae5b]">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12.012 2c-5.506 0-9.988 4.479-9.988 9.985 0 1.764.459 3.49 1.33 5.009L1.395 23l6.194-1.623c1.456.794 3.084 1.211 4.743 1.211 5.506 0 9.988-4.479 9.988-9.985a9.94 9.94 0 0 0-2.928-7.06A9.94 9.94 0 0 0 12.012 2zm4.957 14.124c-.213.6-1.248 1.153-1.724 1.219-.465.066-.928.117-2.754-.619-2.333-.941-3.824-3.3-3.94-3.46-.116-.16-.94-1.249-.94-2.384 0-1.135.592-1.693.805-1.912.213-.219.465-.274.62-.274.156 0 .311.002.448.008.14.006.326-.053.51.391.19.46.649 1.583.706 1.7.057.117.095.252.016.411-.079.159-.118.258-.236.396-.118.138-.248.309-.354.415-.118.119-.241.248-.104.484.137.235.609 1.005 1.302 1.62.893.794 1.644 1.039 1.88 1.157.236.119.373.1.512-.06.138-.16.592-.689.75-1.01.156-.32.311-.274.526-.195.213.079 1.36.641 1.593.753.235.114.39.171.448.271.058.1.058.579-.155 1.18z"/>
                </svg>
              </div>
              <div>
                <h4 className="font-sans font-bold text-xs text-[#1E1B15] uppercase tracking-wider">
                  Truth Quran Support
                </h4>
                <p className="text-[10px] text-[#1fae5b] font-semibold flex items-center space-x-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1fae5b] inline-block animate-pulse mr-1" />
                  Typically replies instantly
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#5D5749] hover:text-[#1E1B15] transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 bg-white max-h-[360px] overflow-y-auto space-y-2">
            <p className="text-[11px] text-[#5D5749] px-1 mb-3">
              Assalamu Alaikum! Select an inquiry topic below to start a secure chat with an advisor on WhatsApp:
            </p>

            {presets.map((preset, index) => (
              <button
                key={index}
                onClick={() => handlePresetClick(preset.message)}
                className="w-full text-left p-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F6F3EB] border border-[#d9b45c]/15 hover:border-[#d9b45c]/50 transition-all duration-200 cursor-pointer flex items-center justify-between group"
              >
                <div className="pr-3">
                  <h5 className="font-sans font-bold text-xs text-[#1E1B15] group-hover:text-[#a9822f] transition-colors">
                    {preset.title}
                  </h5>
                  <p className="text-[10px] text-[#5D5749] mt-0.5">
                    {preset.desc}
                  </p>
                </div>
                <Send size={12} className="text-[#5D5749] group-hover:text-[#1fae5b] group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>

          {/* Modal Footer */}
          <div className="bg-[#F6F3EB]/80 px-5 py-3 border-t border-[#d9b45c]/15 text-center">
            <p className="text-[9px] text-[#5D5749] uppercase tracking-widest flex items-center justify-center space-x-1">
              <Sparkles size={8} className="text-[#d9b45c]" />
              <span>Truth Quran Academy</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
