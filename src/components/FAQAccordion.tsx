import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { faqItems } from "../data";

export default function FAQAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4" id="faq-accordion-container">
      {faqItems.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
              isOpen
                ? "bg-[#12141b] border-[#d9b45c]/40 shadow-[0_4px_25px_rgba(217,180,92,0.06)]"
                : "bg-[#0e1015]/60 border-[#d9b45c]/10 hover:border-[#d9b45c]/25 hover:bg-[#0e1015]"
            }`}
          >
            {/* Accordion Trigger */}
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full text-left px-6 py-5 flex items-center justify-between cursor-pointer focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="font-sans font-bold text-sm md:text-base text-[#f3ecd8] pr-4 select-none">
                {item.question}
              </span>
              <div
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                  isOpen
                    ? "border-[#f2d98a]/50 text-[#f2d98a] bg-[#d9b45c]/10 rotate-45"
                    : "border-[#d9b45c]/20 text-[#c9c2ab] bg-[#07080b]"
                }`}
              >
                <Plus size={16} />
              </div>
            </button>

            {/* Accordion Content with animated expand */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-[300px] border-t border-[#d9b45c]/10" : "max-h-0"
              } overflow-hidden`}
            >
              <div className="px-6 py-5 text-xs md:text-sm text-[#c9c2ab] leading-relaxed select-none">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
