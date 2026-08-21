import React, { useState, useEffect } from "react";
import { Play, Sparkles, Video, Calendar, Clock, BookOpen, Share2 } from "lucide-react";
import { motion } from "motion/react";
import { getCMSData } from "../cmsStore";
import { WPVideo } from "../types";

export default function VideosPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedVideo, setSelectedVideo] = useState<WPVideo | null>(null);
  const [cmsData, setCmsData] = useState(getCMSData());

  useEffect(() => {
    const handleUpdate = () => {
      setCmsData(getCMSData());
    };
    window.addEventListener("cms_data_updated", handleUpdate);
    return () => window.removeEventListener("cms_data_updated", handleUpdate);
  }, []);

  const categories = ["All", "Tajweed Guides", "Lectures", "Student Recitations"];

  // Filter only enabled videos
  const enabledVideos = cmsData.videos ? cmsData.videos.filter(v => v.enabled) : [];

  const filteredVideos =
    activeCategory === "All"
      ? enabledVideos
      : enabledVideos.filter((v) => v.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12" id="videos-page-panel">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
        <span className="text-[12px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c] bg-[#d9b45c]/8 border border-[#d9b45c]/15 px-3 py-1 rounded-full">
          Video Gallery & Tutorials
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-[#f3ecd8] font-medium tracking-tight">
          Academy <span className="text-[#d9b45c] italic font-normal">Video Center</span>
        </h2>
        <p className="text-xs md:text-sm text-[#c9c2ab] leading-relaxed">
          Watch structured Tajweed tutorials, inspiring general lectures on Islamic values, and beautiful recitations from our top global students.
        </p>
      </div>

      {/* Categories Filtering Row */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-[10px] font-sans font-extrabold uppercase tracking-widest border transition-all duration-300 cursor-pointer ${
              activeCategory === cat
                ? "bg-gradient-to-r from-[#f2d98a] to-[#d9b45c] text-[#07080b] border-[#d9b45c] shadow-[0_4px_12px_rgba(217,180,92,0.25)]"
                : "bg-[#12141b]/60 text-[#c9c2ab] border-[#d9b45c]/15 hover:border-[#d9b45c]/40 hover:text-[#f3ecd8]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVideos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="bg-[#12141b]/70 border border-[#d9b45c]/12 rounded-2xl overflow-hidden hover:border-[#d9b45c]/35 transition-all duration-300 flex flex-col h-full group"
          >
            {/* Video Cover Area with Play Hover Button */}
            <div 
              className="relative h-48 bg-[#07080b] overflow-hidden cursor-pointer flex items-center justify-center"
              onClick={() => setSelectedVideo(video)}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12141b]/80 via-transparent to-transparent pointer-events-none" />
              
              {/* Pulsing Play Button overlay */}
              <div className="w-14 h-14 rounded-full bg-[#d9b45c]/95 flex items-center justify-center text-[#07080b] shadow-[0_5px_15px_rgba(217,180,92,0.3)] group-hover:scale-110 group-hover:bg-[#f2d98a] transition-all duration-300 relative z-10">
                <Play size={20} className="fill-current ml-1" />
              </div>

              {/* Tag Category Pill */}
              <span className="absolute top-4 left-4 text-[9px] font-sans uppercase font-bold text-[#f2d98a] bg-[#07080b]/85 border border-[#d9b45c]/25 px-2.5 py-1 rounded-full z-10">
                {video.category}
              </span>

              {/* Duration Tag */}
              <span className="absolute bottom-4 right-4 text-[9px] font-sans font-bold text-[#f3ecd8] bg-[#07080b]/80 border border-white/10 px-2 py-0.5 rounded">
                {video.duration}
              </span>
            </div>

            {/* Video Content Block */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4 text-left">
              <div className="space-y-2">
                <div className="flex items-center space-x-3 text-[10px] font-sans text-[#c9c2ab]">
                  <span className="flex items-center space-x-1">
                    <Calendar size={11} className="text-[#d9b45c]" />
                    <span>{video.publishDate}</span>
                  </span>
                </div>
                <h3 
                  onClick={() => setSelectedVideo(video)}
                  className="font-serif text-[#f3ecd8] hover:text-[#f2d98a] text-sm md:text-base font-medium tracking-tight leading-snug line-clamp-2 transition-colors cursor-pointer"
                >
                  {video.title}
                </h3>
                <p className="text-xs text-[#c9c2ab] leading-relaxed line-clamp-3">
                  {video.description}
                </p>
              </div>

              {/* Action footer link */}
              <div className="pt-3 border-t border-[#d9b45c]/8 flex items-center justify-between">
                <button
                  onClick={() => setSelectedVideo(video)}
                  className="text-[10px] font-sans uppercase font-extrabold tracking-widest text-[#d9b45c] hover:text-[#f2d98a] flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Video size={12} />
                  <span>Watch Video</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Video Modal Player (Simulated Premium Visual Overlay) */}
      {selectedVideo && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#07080b]/95 backdrop-blur-md p-4">
          <div className="w-full max-w-3xl bg-[#12141b] border border-[#d9b45c]/35 rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col relative animate-in zoom-in-95 duration-200">
            {/* Header toolbar */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#d9b45c]/10 text-left">
              <div className="space-y-0.5">
                <span className="text-[8px] font-sans uppercase font-bold tracking-widest text-[#d9b45c]">
                  Active Lecture / {selectedVideo.category}
                </span>
                <h4 className="font-serif text-[#f3ecd8] text-xs md:text-sm font-bold line-clamp-1">
                  {selectedVideo.title}
                </h4>
              </div>
              <button 
                onClick={() => setSelectedVideo(null)}
                className="w-8 h-8 rounded-full border border-white/10 hover:border-[#d9b45c] text-white hover:text-[#d9b45c] flex items-center justify-center transition-colors text-sm font-sans font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Video Canvas Simulated Block */}
            <div className="w-full aspect-video bg-[#07080b] relative flex items-center justify-center group overflow-hidden">
              <img 
                src={selectedVideo.thumbnail} 
                alt="Video Content" 
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-45 select-none"
              />
              
              {/* Overlay golden pattern gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e1015]/90 via-transparent to-[#0e1015]/90" />
              
              {/* Simulated Loading/Play screen */}
              <div className="relative z-10 text-center space-y-4 max-w-md px-6">
                <div className="w-20 h-20 rounded-full border-2 border-double border-[#d9b45c] flex items-center justify-center bg-[#0e1015]/75 text-[#d9b45c] mx-auto shadow-inner shadow-[#d9b45c]/10">
                  <Play size={28} className="fill-current ml-1" />
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-sans text-[#f2d98a] font-bold uppercase tracking-widest animate-pulse">
                    Streaming Media Channel Active
                  </p>
                  <p className="text-[10px] font-sans text-[#c9c2ab] leading-relaxed">
                    Classes and video lectures are streamed securely in high definition on-demand within our exclusive student portal.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom details */}
            <div className="p-5 border-t border-[#d9b45c]/10 bg-[#0e1015]/40 text-left text-xs text-[#c9c2ab] space-y-2">
              <p className="leading-relaxed">
                {selectedVideo.description}
              </p>
              <div className="flex flex-wrap items-center justify-between text-[10px] font-sans text-[#d9b45c]/85 pt-2">
                <span>Published: {selectedVideo.publishDate}</span>
                <span>Duration: {selectedVideo.duration} mins</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
