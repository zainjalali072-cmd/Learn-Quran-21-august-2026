import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { BookOpen, Award, CheckCircle, Shield, Users, Target, Check } from "lucide-react";
import { academyContact } from "../data";
import teacherBg from "../assets/images/online_quran_teacher_1784116886285.jpg";
import femaleTeacherBg from "../assets/images/female_quran_tutor_1784119152017.jpg";

import sheikhAbdulRahmanImg from "../assets/images/sheikh_abdul_rahman_1784121404292.jpg";
import ustadhHafizZainImg from "../assets/images/ustadh_hafiz_zain_1784121424995.jpg";
import ustadhaMaryamImg from "../assets/images/female_quran_tutor_1784119152017.jpg";
import DeveloperCard from "./DeveloperCard";
import { getCMSData } from "../cmsStore";

export default function AboutPage({ setView }: { setView: (view: string) => void }) {
  const [cms, setCms] = useState(getCMSData());

  useEffect(() => {
    const handleSync = () => setCms(getCMSData());
    window.addEventListener("cms_data_updated", handleSync);
    return () => window.removeEventListener("cms_data_updated", handleSync);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-6 py-12 text-left space-y-16"
    >
      {/* Page Header */}
      <div className="relative text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[12px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c] bg-[#d9b45c]/8 border border-[#d9b45c]/15 px-3 py-1 rounded-full">
          About Truth Quran Academy
        </span>
        <h1 className="font-serif text-4xl md:text-5xl text-[#f3ecd8] font-medium tracking-tight">
          Pioneering Spiritual & Educational <br />
          <span className="text-[#d9b45c] italic font-normal">Excellence Globally</span>
        </h1>
        <p className="text-xs md:text-sm text-[#c9c2ab] leading-relaxed">
          Headquartered in the cultural capital of <span className="text-[#f2d98a] font-bold">Lahore, Pakistan</span>, we connect aspiring students worldwide with elite, certified scholars and Huffadha for life-changing Quranic study.
        </p>
      </div>

      {/* Main Feature Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left: High Quality Image */}
        <div className="lg:col-span-6 relative">
          <div className="absolute inset-0 bg-[#d9b45c]/5 rounded-3xl filter blur-[40px] pointer-events-none" />
          <div className="relative rounded-3xl overflow-hidden border border-[#d9b45c]/20 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <img
              src={cms.customImages?.aboutTeacherBg?.url || teacherBg}
              alt={cms.customImages?.aboutTeacherBg?.alt || "Online Quran tutor teaching a lesson"}
              referrerPolicy="no-referrer"
              className="w-full h-auto object-cover aspect-[4/3] hover:scale-105 transition-transform duration-700"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#07080b]/90 via-transparent to-transparent" />
            
            {/* Bottom Floating Info Card */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/75 border border-[#d9b45c]/20 backdrop-blur-md flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-[#d9b45c]/10 flex items-center justify-center text-[#d9b45c]">
                <Award size={20} />
              </div>
              <div>
                <h5 className="font-sans font-bold text-xs text-[#f3ecd8]">100% Certified Native Scholars</h5>
                <p className="text-[10px] text-[#c9c2ab]">Possessing Authentic Ijazah credentials</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Mission, Vision & Highlights */}
        <div className="lg:col-span-6 space-y-6">
          <h2 className="font-serif text-2xl md:text-3xl text-[#f3ecd8] font-bold tracking-tight">
            Our Holy Core <span className="text-[#d9b45c] italic font-normal">Mission</span>
          </h2>
          <p className="text-xs md:text-sm text-[#c9c2ab] leading-relaxed">
            At Truth Quran Academy, we believe learning the Holy Quran is a sacred trust. Our programs are engineered to preserve authentic phonetic traditions (Tajweed) while providing interactive, comfortable virtual spaces designed for students of every age, culture, and timezone.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-[#12141b]/60 border border-[#d9b45c]/10 rounded-2xl p-4 flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-[#d9b45c]/8 text-[#d9b45c]">
                <Target size={16} />
              </div>
              <div>
                <h4 className="font-sans font-bold text-xs text-[#f3ecd8]">Dynamic Pedagogy</h4>
                <p className="text-[10px] text-[#c9c2ab] mt-1 leading-relaxed">Customised syllabuses tailored to each child's speed.</p>
              </div>
            </div>

            <div className="bg-[#12141b]/60 border border-[#d9b45c]/10 rounded-2xl p-4 flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-[#d9b45c]/8 text-[#d9b45c]">
                <Shield size={16} />
              </div>
              <div>
                <h4 className="font-sans font-bold text-xs text-[#f3ecd8]">Safe Learning Env</h4>
                <p className="text-[10px] text-[#c9c2ab] mt-1 leading-relaxed">Highly-trained, certified female tutors for young sisters.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-2 border-t border-[#d9b45c]/10">
            <h4 className="font-sans font-bold text-xs text-[#f3ecd8] uppercase tracking-wider">Academic Milestones:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-[#c9c2ab]">
              <div className="flex items-center space-x-2">
                <Check size={12} className="text-[#d9b45c]" />
                <span>12,000+ Graduated</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check size={12} className="text-[#d9b45c]" />
                <span>24/7 Global Timing</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check size={12} className="text-[#d9b45c]" />
                <span>Jamia Naeemia Lahore Curriculum</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check size={12} className="text-[#d9b45c]" />
                <span>Ijazah-Qualified Faculty</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Team Section */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-2xl md:text-3xl text-[#f3ecd8] font-bold tracking-tight">Our Dedicated Faculty Leadership</h2>
          <p className="text-xs md:text-sm text-[#c9c2ab] max-w-xl mx-auto">
            Our leadership brings decades of collective experience in online Quranic teaching, child psychology, and theological science.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(cms.teachers || []).filter(t => t.status === "published").map((teacher) => (
            <div key={teacher.id} className="bg-[#12141b]/50 border border-[#d9b45c]/12 rounded-2xl p-6 text-center space-y-4 hover:border-[#d9b45c]/40 transition-colors flex flex-col justify-between">
              <div>
                <div className="w-20 h-20 rounded-full border-2 border-[#d9b45c]/50 overflow-hidden mx-auto bg-zinc-900">
                  <img
                    src={teacher.photo}
                    alt={teacher.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-4">
                  <h4 className="font-sans font-bold text-sm text-[#f3ecd8]">{teacher.name}</h4>
                  <p className="text-[10px] text-[#d9b45c] uppercase tracking-widest mt-0.5">{teacher.role}</p>
                </div>
                <p className="text-xs text-[#c9c2ab] leading-relaxed mt-3">
                  {teacher.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Architect Section */}
      <div className="py-12 md:py-16 bg-[#0e1015]/40 border border-[#d9b45c]/10 relative z-10 rounded-3xl">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
          <div className="space-y-2">
            <span className="text-[10px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c]">
              Verified Developer Credential
            </span>
            <h3 className="font-serif text-2xl text-[#f3ecd8] font-medium tracking-tight">
              Academy Platform <span className="text-[#d9b45c] italic font-normal font-serif">Architect</span>
            </h3>
          </div>
          <DeveloperCard />
        </div>
      </div>

      {/* CTA Button */}
      <div className="text-center pt-4">
        <button
          onClick={() => setView("contact")}
          className="px-8 py-4 rounded-full bg-gradient-to-r from-[#f2d98a] to-[#d9b45c] text-xs font-sans font-extrabold text-[#07080b] uppercase tracking-widest shadow-xl hover:-translate-y-0.5 transition-all duration-300"
        >
          Get In Touch With Us
        </button>
      </div>
    </motion.div>
  );
}
