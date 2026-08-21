import React from "react";
import { motion } from "motion/react";
import quran3DIconImg from "../assets/images/holy_quran_icon_1784372106996.jpg";

export default function AutoOpeningQuran() {
  // Complete majestic Arabic text of Surah Al-Ikhlas with verse markers and elegant stars
  const surahIkhlasText = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✦ قُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾ اللَّهُ الصَّمَدُ ﴿٢﴾ لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ ﴿٤﴾ ✦";

  return (
    <div className="relative w-full max-w-lg mx-auto flex flex-col items-center justify-center p-4 md:p-8 select-none">
      
      {/* Background Spiritual Ambient Radiance */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="absolute w-80 h-80 md:w-[450px] md:h-[450px] rounded-full bg-[radial-gradient(circle,rgba(217,180,92,0.18)_0%,rgba(10,18,32,0.65)_50%,transparent_75%)] blur-2xl animate-pulse" />
        <div className="absolute w-64 h-64 md:w-80 md:h-80 rounded-full bg-[radial-gradient(circle,rgba(217,180,92,0.08)_0%,transparent_60%)] blur-xl" />
      </div>

      {/* Main Container holding the entire premium calligraphic layout */}
      <div className="relative w-[340px] h-[340px] md:w-[410px] md:h-[410px] flex items-center justify-center z-10" id="quran-emblem-container">
        
        {/* Outer Ring with Solid Gold Borders & Premium Shimmering Shadows */}
        <div className="absolute inset-0 rounded-full border-4 border-[#d9b45c] shadow-[0_0_60px_rgba(217,180,92,0.45)] bg-gradient-to-tr from-[#07080b] via-[#12141b] to-[#07080b] flex items-center justify-center overflow-hidden">
          
          {/* Elegant Bezel/Inlay Borders */}
          <div className="absolute inset-1.5 rounded-full border border-[#d9b45c]/55 pointer-events-none z-20" />
          <div className="absolute inset-3 rounded-full border-2 border-double border-[#d9b45c]/30 pointer-events-none z-20" />
          
          {/* Rotating Surah Al-Ikhlas Calligraphy written around the circle */}
          <motion.div 
            className="absolute inset-0 w-full h-full flex items-center justify-center rounded-full pointer-events-none z-10"
            animate={{ rotate: 360 }}
            transition={{ ease: "linear", duration: 40, repeat: Infinity }}
          >
            <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
              <defs>
                {/* Precise circular path for Surah Al-Ikhlas text alignment */}
                <path
                  id="ikhlasCirclePath"
                  d="M 200, 200 m -152, 0 a 152,152 0 1,1 304,0 a 152,152 0 1,1 -304,0"
                  fill="none"
                />
              </defs>
              
              {/* Soft, premium Gold Arabic Scripture tracing the circle with high contrast and zero blur */}
              <text className="font-arabic font-medium text-[17px] md:text-[19px] tracking-[0.04em]">
                <textPath 
                  href="#ikhlasCirclePath" 
                  fill="#d9b45c"
                  className="fill-current drop-shadow-[0_2px_3px_rgba(0,0,0,0.98)]"
                >
                  {surahIkhlasText}
                </textPath>
              </text>
            </svg>
          </motion.div>

          {/* Deep Black Inner vignette mask for high contrast legibility of the scripture */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,transparent_68%,rgba(7,8,11,0.95)_94%)] pointer-events-none z-10" />

          {/* Centered Solid Golden Circle Frame containing the Quran Pak Image */}
          {/* Made slightly larger (64% width/height) to look beautifully prominent */}
          <div 
            className="absolute w-[62%] h-[62%] rounded-full bg-[#07080b] border-[3px] border-[#d9b45c] shadow-[0_0_40px_rgba(217,180,92,0.55),inset_0_0_25px_rgba(0,0,0,0.95)] overflow-hidden flex items-center justify-center p-0.5 z-20 group"
          >
            <div className="w-full h-full rounded-full overflow-hidden relative flex items-center justify-center">
              {/* High-Resolution 3D Quran Cover Image */}
              <img 
                src={quran3DIconImg} 
                alt="Premium 3D Holy Quran Cover" 
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover scale-[1.05] group-hover:scale-[1.12] transition-transform duration-700 select-none pointer-events-none"
                style={{ filter: "brightness(112%) contrast(128%)" }}
              />
              
              {/* Divine Shimmer Reflection Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rotate-45 transform translate-y-full group-hover:translate-y-[-100%] transition-transform duration-1000 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#07080b]/20 to-[#07080b]/50 pointer-events-none" />

              {/* Inner Circular Fine-line Borders */}
              <div className="absolute inset-2.5 border border-[#d9b45c]/35 rounded-full pointer-events-none" />
              <div className="absolute inset-3.5 border border-dashed border-[#d9b45c]/15 rounded-full pointer-events-none" />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
