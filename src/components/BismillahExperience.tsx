import React, { useState, useEffect, useRef, useCallback } from "react";
import { Volume2, Sparkles } from "lucide-react";

/**
 * BISMILLAH_AUDIO_URL
 * Easily configurable audio file path for the opening Bismillah recitation.
 * The MP3 file is located at /public/assets/audio/bismillah.mp3
 * (also mirrored at /public/audio/bismillah.mp3).
 */
export const BISMILLAH_AUDIO_URL = "/assets/audio/bismillah.mp3";

const SESSION_STORAGE_KEY = "truth_quran_bismillah_played";

export default function BismillahExperience() {
  // State: 'checking' | 'blocked' | 'autoplay_playing' | 'fading_out' | 'dismissed'
  const [state, setState] = useState<"checking" | "blocked" | "autoplay_playing" | "fading_out" | "dismissed">(() => {
    // If already played in this session, dismiss immediately (do not repeat on SPA navigation)
    if (typeof window !== "undefined") {
      try {
        if (sessionStorage.getItem(SESSION_STORAGE_KEY) === "true") {
          return "dismissed";
        }
      } catch {
        // Fallback if sessionStorage is disabled or restricted
      }
    }
    return "checking";
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimeoutRef = useRef<number | null>(null);
  const audioEndTimeoutRef = useRef<number | null>(null);

  // Restore body scroll safely
  const unlockScroll = useCallback(() => {
    try {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    } catch {
      // safe
    }
  }, []);

  // Lock body scroll during full-screen overlay
  const lockScroll = useCallback(() => {
    try {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } catch {
      // safe
    }
  }, []);

  // Dismiss overlay smoothly
  const handleDismiss = useCallback(() => {
    setState("fading_out");
    unlockScroll();

    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
    } catch {
      // safe
    }

    fadeTimeoutRef.current = window.setTimeout(() => {
      setState("dismissed");
    }, 700); // matches duration-700
  }, [unlockScroll]);

  // User taps "Tap to Enter"
  const handleUserEnter = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
    } catch {
      // safe
    }

    // Play audio immediately from user gesture
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = 0;
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn("Audio playback notice:", err);
          });
        }
      } catch (err) {
        console.warn("Audio play trigger error:", err);
      }
    }

    // Start fading out overlay smoothly to reveal the website
    handleDismiss();
  }, [handleDismiss]);

  // Initialize and attempt autoplay on mount
  useEffect(() => {
    if (state === "dismissed") {
      return;
    }

    // Create single dedicated Audio instance
    const audio = new Audio(BISMILLAH_AUDIO_URL);
    audio.preload = "auto";
    audio.volume = 0.65; // Respectful, pleasant, non-aggressive volume
    audioRef.current = audio;

    // Listen for audio finish
    const onEnded = () => {
      handleDismiss();
    };
    audio.addEventListener("ended", onEnded);

    // Attempt autoplay immediately
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Autoplay is allowed by the browser!
          // Mark session so it never repeats on SPA page navigation
          try {
            sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
          } catch {
            // safe
          }
          setState("autoplay_playing");

          // Automatically fade out after audio completes or safe timeout
          audioEndTimeoutRef.current = window.setTimeout(() => {
            handleDismiss();
          }, 4500);
        })
        .catch((_error) => {
          // Autoplay was blocked by browser policy -> show elegant "Tap to Enter" overlay
          lockScroll();
          setState("blocked");
        });
    } else {
      // In older browsers where play() doesn't return a promise
      lockScroll();
      setState("blocked");
    }

    // Listen for keyboard Enter / Space for accessibility
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        if (state === "blocked") {
          e.preventDefault();
          handleUserEnter();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      audio.removeEventListener("ended", onEnded);
      if (fadeTimeoutRef.current) window.clearTimeout(fadeTimeoutRef.current);
      if (audioEndTimeoutRef.current) window.clearTimeout(audioEndTimeoutRef.current);
      unlockScroll();
    };
  }, [state === "dismissed"]); // eslint-disable-line react-hooks/exhaustive-deps

  // If already dismissed, do not render anything
  if (state === "dismissed") {
    return null;
  }

  // If autoplay is checking or successfully playing without user blocking,
  // we do not show the blocking "Tap to Enter" overlay
  if (state === "checking") {
    return null;
  }

  if (state === "autoplay_playing") {
    // Autoplay allowed: subtle non-blocking notification or quick fade-out
    return null;
  }

  const isFading = state === "fading_out";

  return (
    <div
      id="bismillah-opening-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome Bismillah Experience"
      onClick={handleUserEnter}
      className={`fixed inset-0 w-full h-full min-h-[100vh] min-h-[100dvh] z-[99999] flex flex-col items-center justify-center p-6 select-none cursor-pointer transition-opacity duration-700 ease-out ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        background: "linear-gradient(135deg, #FDFBF7 0%, #FAF5EB 40%, #F5EFE1 100%)",
      }}
    >
      {/* Background Subtle Islamic Geometric Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.055]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpath d='M40 0l10 30 30 10-30 10-10 30-10-30-30-10 30-10z' fill='%239c7a2d'/%3E%3Ccircle cx='40' cy='40' r='14' fill='none' stroke='%239c7a2d' stroke-width='1.5'/%3E%3Cpath d='M0 40l10-10 10 10-10 10zm80 0l-10-10-10 10 10 10zM40 80l-10-10-10 10 10 10zm0-80l-10 10-10-10 10-10z' fill='%239c7a2d'/%3E%3C/svg%3E")`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Subtle Radial Warm Glow in Center */}
      <div className="absolute w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] rounded-full bg-[radial-gradient(circle,rgba(217,180,92,0.14)_0%,transparent_70%)] blur-2xl pointer-events-none" />

      {/* Ornate Circular Mihrab Border Frame */}
      <div className="relative z-10 max-w-xl w-full flex flex-col items-center text-center px-4 py-8 sm:py-12">
        
        {/* Top Decorative Islamic Medallion */}
        <div className="mb-6 sm:mb-8 flex items-center justify-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-b from-[#FAF5EB] to-[#F1E7D0] border border-[#d9b45c]/40 shadow-[0_4px_20px_rgba(217,180,92,0.18)] flex items-center justify-center text-[#a9822f]">
            <Sparkles size={22} className="text-[#d9b45c] animate-pulse" />
          </div>
        </div>

        {/* Outer Arch Border around Calligraphy */}
        <div className="w-full max-w-lg bg-[#FAF5EB]/80 backdrop-blur-sm border border-[#d9b45c]/30 rounded-3xl p-6 sm:p-10 shadow-[0_12px_45px_rgba(169,130,47,0.10)] relative overflow-hidden">
          
          {/* Inner hairline gold border */}
          <div className="absolute inset-2 sm:inset-3 rounded-2xl border border-[#d9b45c]/20 pointer-events-none" />

          {/* Corner gold ornaments */}
          <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-[#d9b45c]/60 rounded-tl-sm pointer-events-none" />
          <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-[#d9b45c]/60 rounded-tr-sm pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-[#d9b45c]/60 rounded-bl-sm pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-[#d9b45c]/60 rounded-br-sm pointer-events-none" />

          {/* Majestic Arabic Bismillah Calligraphy */}
          <div className="my-2 sm:my-4">
            <h1 
              lang="ar" 
              dir="rtl"
              className="font-arabic text-3xl sm:text-4xl md:text-5xl lg:text-[54px] text-[#241c12] font-semibold leading-[1.8] sm:leading-[1.9] tracking-wide select-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
              style={{
                fontFamily: '"Noto Naskh Arabic", "Amiri", Georgia, serif',
              }}
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </h1>
          </div>

          {/* Delicate Divider Ornament */}
          <div className="flex items-center justify-center space-x-3 my-4 sm:my-5 opacity-70">
            <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#d9b45c] to-transparent" />
            <span className="text-[#a9822f] text-xs font-serif">✦</span>
            <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#d9b45c] to-transparent" />
          </div>

          {/* Peaceful Translation / Meaning */}
          <p className="text-xs sm:text-sm text-[#73634e] font-serif italic tracking-wide">
            In the name of Allah, the Most Gracious, the Most Merciful
          </p>
        </div>

        {/* Enter Button (Click / Tap) */}
        <div className="mt-8 sm:mt-10 flex flex-col items-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleUserEnter();
            }}
            className="group relative inline-flex items-center justify-center space-x-2.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#d9b45c] via-[#e5c575] to-[#c79d43] text-[#07080b] font-sans font-extrabold text-xs sm:text-sm tracking-[0.16em] uppercase shadow-[0_6px_25px_rgba(217,180,92,0.38)] hover:shadow-[0_8px_32px_rgba(217,180,92,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
            aria-label="Tap to Enter Website with Bismillah"
          >
            <Volume2 size={16} className="text-[#07080b] group-hover:scale-110 transition-transform" />
            <span>Tap to Enter</span>
          </button>

          {/* Gentle Hint */}
          <span className="mt-3 text-[11px] sm:text-xs text-[#8c785d] font-sans tracking-wide">
            Click anywhere or press Enter to begin
          </span>
        </div>

      </div>
    </div>
  );
}
