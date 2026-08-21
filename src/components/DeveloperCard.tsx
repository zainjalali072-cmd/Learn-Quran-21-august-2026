import React from "react";
import { Shield, Server, Heart } from "lucide-react";
import logoImg from "../assets/images/truth_quran_new_logo_1784203145448.jpg";

export default function DeveloperCard() {
  return (
    <div className="max-w-xl mx-auto bg-[#12141b]/80 border border-[#d9b45c]/20 rounded-2xl p-6 md:p-8 shadow-[0_15px_30px_rgba(0,0,0,0.6)] relative overflow-hidden text-left group">
      {/* Soft golden light glow in the corner on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#d9b45c]/3 blur-xl pointer-events-none group-hover:bg-[#d9b45c]/8 transition-all duration-500 rounded-full" />
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
        {/* Avatar badge representing the Academy Architect / Developer with custom logo */}
        <div className="w-16 h-16 rounded-2xl border-2 border-[#d9b45c] overflow-hidden bg-[#07080b] shadow-[0_0_15px_rgba(217,180,92,0.3)] flex-shrink-0 relative">
          <img 
            src={logoImg} 
            alt="Academy Logo" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover scale-[1.02]"
          />
        </div>

        {/* Info Block */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="font-serif text-[#f3ecd8] text-lg font-bold">Muhammad Zain</h4>
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-[#d9b45c]/10 border border-[#d9b45c]/25 text-[8px] font-sans text-[#d9b45c] uppercase font-bold tracking-wider">
              <Shield size={8} />
              <span>Lead Architect</span>
            </span>
          </div>
          <p className="text-xs text-[#c9c2ab] leading-relaxed font-light">
            Senior Fullstack Software Craftsman specializing in high-performance React architectures, elite Islamic-luxury branding layouts, and secure document processing pipelines.
          </p>
        </div>
      </div>

      {/* Grid of details/specs */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-[#d9b45c]/10 text-left relative z-10">
        <div>
          <span className="text-[9px] font-sans uppercase font-bold tracking-widest text-[#d9b45c]">
            Core Platform Stack
          </span>
          <p className="text-[11px] text-[#f3ecd8] mt-1 font-semibold leading-relaxed">
            React 19 / Tailwind CSS v4 / Motion
          </p>
        </div>
        <div>
          <span className="text-[9px] font-sans uppercase font-bold tracking-widest text-[#d9b45c]">
            Engineered Capabilities
          </span>
          <p className="text-[11px] text-[#f3ecd8] mt-1 font-semibold leading-relaxed">
            PDF Watermarking / Client-Side Cache
          </p>
        </div>
      </div>

      {/* Small footer brand */}
      <div className="mt-6 pt-4 border-t border-[#d9b45c]/10 flex items-center justify-between text-[10px] font-sans text-[#c9c2ab] relative z-10 select-none">
        <span className="flex items-center space-x-1.5">
          <Heart size={10} className="text-red-500 fill-current" />
          <span>Crafted with Sincerity & Sincerity</span>
        </span>
        <span className="text-[#d9b45c] font-bold">Truth Quran Academy Platform</span>
      </div>
    </div>
  );
}
