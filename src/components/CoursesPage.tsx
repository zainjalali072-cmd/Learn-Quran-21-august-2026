import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Sparkles, Star, ChevronRight, MessageCircle } from "lucide-react";
import { coursesData, academyContact } from "../data";
import { getCourseFallbackImage } from "../cmsStore";

export default function CoursesPage() {
  const [filter, setFilter] = useState<string>("All");

  const categories = ["All", "Beginner", "Intermediate", "Advanced"];

  const filteredCourses = filter === "All"
    ? coursesData
    : coursesData.filter(c => c.difficulty === filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-6 py-12 text-left space-y-12"
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[12px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c] bg-[#d9b45c]/8 border border-[#d9b45c]/15 px-3 py-1 rounded-full">
          Structured Quran Programs
        </span>
        <h1 className="font-serif text-4xl md:text-5xl text-[#f3ecd8] font-medium tracking-tight">
          Explore Our Highly <br />
          <span className="text-[#d9b45c] italic font-normal">Syllabused Curriculums</span>
        </h1>
        <p className="text-xs md:text-sm text-[#c9c2ab] leading-relaxed">
          From toddlers learning their first Arabic alphabet to advanced scholars seeking a complete certified Ijazah track. Select the perfect learning trajectory below.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2 justify-center" id="courses-filter-row">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2.5 rounded-full font-sans font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer ${
              filter === cat
                ? "bg-gradient-to-r from-[#f2d98a] to-[#d9b45c] text-[#07080b] shadow-lg"
                : "bg-[#12141b]/80 border border-[#d9b45c]/15 text-[#c9c2ab] hover:text-[#f3ecd8] hover:border-[#d9b45c]/35"
            }`}
          >
            {cat} Level
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="courses-page-grid">
        <AnimatePresence mode="popLayout">
          {filteredCourses.map((course, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              key={course.id}
              className="bg-[#12141b] border border-[#d9b45c]/12 rounded-2xl overflow-hidden hover:border-[#d9b45c]/35 hover:-translate-y-1.5 hover:shadow-[0_25px_50px_rgba(0,0,0,0.6)] transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Image Banner */}
              <div className="h-48 relative overflow-hidden bg-zinc-950">
                <img
                  src={course.image || getCourseFallbackImage(course.id || course.title)}
                  alt={course.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const fallback = getCourseFallbackImage(course.id || course.title);
                    if (target.src !== fallback) {
                      target.src = fallback;
                    }
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12141b] via-black/25 to-transparent" />
                
                {/* Level Tag Overlay */}
                <span className="absolute top-4 right-4 text-[9px] font-sans uppercase font-bold text-[#d9b45c] bg-[#07080b]/90 border border-[#d9b45c]/25 px-2.5 py-1 rounded-full">
                  {course.difficulty}
                </span>

                {/* Left Tag Overlay */}
                <span className="absolute bottom-4 left-4 text-[9px] font-sans uppercase tracking-widest font-semibold text-[#c9c2ab] bg-black/60 px-2.5 py-1 rounded border border-[#d9b45c]/10">
                  {course.tag}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-sans font-bold text-base md:text-lg text-[#f3ecd8] group-hover:text-[#f2d98a] transition-colors">
                      {course.title}
                    </h3>
                    <span className="font-arabic text-[#d9b45c] text-sm font-semibold">{course.arabicGlyph}</span>
                  </div>
                  <p className="text-xs text-[#c9c2ab] leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#d9b45c]/8 mt-4 grid grid-cols-2 gap-3">
                  <a
                    href={`${academyContact.whatsapp}?text=Salam!%20I%20would%20like%20to%20enroll%20in%20the%20${encodeURIComponent(course.title)}%20course%20at%20Truth%20Quran%20Academy.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-2.5 rounded-full bg-gradient-to-r from-[#f2d98a] to-[#d9b45c] text-[10px] font-sans font-extrabold uppercase tracking-widest text-[#07080b] hover:shadow-[0_4px_15px_rgba(217,180,92,0.3)] transition-all flex items-center justify-center space-x-1"
                  >
                    <span>Enroll Now</span>
                  </a>

                  <a
                    href={`${academyContact.whatsapp}?text=Salam!%20I%20would%20like%20to%20request%20a%20Free%20Trial%20lesson%20for%20the%20${encodeURIComponent(course.title)}%20program.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-2.5 rounded-full border border-[#d9b45c]/20 text-[10px] font-sans font-extrabold uppercase tracking-widest text-[#c9c2ab] hover:bg-[#d9b45c]/8 hover:border-[#d9b45c] hover:text-[#f3ecd8] transition-all flex items-center justify-center"
                  >
                    <span>Free Trial</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* General Advice Banner */}
      <div className="bg-[#12141b]/50 border border-[#d9b45c]/12 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="space-y-2 text-left">
          <div className="flex items-center space-x-2 text-[#d9b45c]">
            <Sparkles size={16} />
            <h4 className="font-serif text-lg font-bold">Unsure about your recitation level?</h4>
          </div>
          <p className="text-xs text-[#c9c2ab] max-w-2xl leading-relaxed">
            Register for our 100% free evaluation class. Our senior Arab tutor will test your phonetic foundations, check your pronunciation, and guide you directly toward the optimal starting plan.
          </p>
        </div>
        <a
          href={`${academyContact.whatsapp}?text=Salam!%20I%20want%20to%20book%20a%20Free%20Evaluation%20class%20to%20choose%20the%20right%20course.`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-full bg-[#1fae5b] text-white text-xs font-sans font-extrabold uppercase tracking-wider shadow-lg hover:bg-[#1fae5b]/90 transition-all flex-shrink-0"
        >
          <MessageCircle size={16} className="fill-current" />
          <span>Book Free Evaluation</span>
        </a>
      </div>
    </motion.div>
  );
}
