import React from "react";
import { motion } from "motion/react";
import { Award, BookOpen, Star, HelpCircle, Check, ArrowRight, MessageCircle } from "lucide-react";
import { academyContact } from "../data";
import islamicGirlQaida from "../assets/images/islamic_girl_qaida_1784120204322.jpg";
import islamicGirlLearningNoorani from "../assets/images/islamic_girl_learning_noorani_qaida_1784200315762.jpg";

export default function NooraniQaidaPage() {
  const syllabusSteps = [
    {
      num: "01",
      title: "The Arabic Alphabet (Makharij)",
      desc: "Mastering the 29 letters in their solitary forms, ensuring correct articulation from the throat, tongue, and lips using accurate phonetic science."
    },
    {
      num: "02",
      title: "Letter Joint Combinations (Compound Letters)",
      desc: "Learning how letters change shapes when connected in pairs or triplets. This builds visual fluency in identifying letters in words."
    },
    {
      num: "03",
      title: "Short Movements (Harakat)",
      desc: "Mastering the foundational vocalic sounds: Fathah, Kasrah, and Dammah. This introduces vocal rhythmic pacing and pronunciation speed."
    },
    {
      num: "04",
      title: "The Tanween (Double Vowels)",
      desc: "Understanding the double vowel symbols (Fathatain, Kasratain, Dammatain) which produce the nasalized 'n' ending sound."
    },
    {
      num: "05",
      title: "Madd and Sukoon Rules (Elongation & Silence)",
      desc: "Learning how to stretch vowels (Madd letters) and sound non-voweled resting letters (Sukoon) cleanly without hesitation."
    },
    {
      num: "06",
      title: "Shaddah (Doubled Sounds) & Flow",
      desc: "Practicing the doubling of letters (Shaddah), leading directly to fluent, uninterrupted pronunciation of complete Quranic words."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-6 py-12 text-left space-y-16"
    >
      {/* Hero Banner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left text */}
        <div className="lg:col-span-7 space-y-6">
          <span className="text-[12px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c] bg-[#d9b45c]/8 border border-[#d9b45c]/15 px-3 py-1 rounded-full">
            The Foundation Curriculum
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-[#f3ecd8] font-medium leading-[1.15] tracking-tight">
            Master Quranic Phonetics with <br />
            <span className="text-[#d9b45c] italic font-normal">Our Noorani Qaida Course</span>
          </h1>
          <p className="text-xs md:text-sm text-[#c9c2ab] leading-relaxed max-w-xl">
            The Noorani Qaida is the gold-standard classical curriculum designed for absolute beginners, young toddlers, and converts. It serves as the ultimate manual to master the Arabic alphabet, pronunciation, and letter joining rules, ensuring flawless articulation before moving to the Holy Quran.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href={`${academyContact.whatsapp}?text=Salam!%20I%20would%20like%20to%20register%20my%20child%20for%20the%20Noorani%20Qaida%20course%20at%20Truth%20Quran%20Academy.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-4 rounded-full bg-[#1fae5b] text-white text-xs font-sans font-extrabold uppercase tracking-wider shadow-lg hover:bg-[#1fae5b]/90 transition-all duration-300"
            >
              <MessageCircle size={18} className="fill-current" />
              <span>Book Trial Lesson</span>
            </a>
          </div>
        </div>

        {/* Right high-quality image */}
        <div className="lg:col-span-5 relative">
          <div className="absolute inset-0 bg-[#d9b45c]/5 rounded-3xl filter blur-[50px] pointer-events-none" />
          <div className="relative rounded-3xl overflow-hidden border border-[#d9b45c]/25 shadow-2xl">
            {/* Real high quality child learning image */}
            <img
              src={islamicGirlQaida}
              alt="Child happily learning Noorani Qaida online"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-cover aspect-[4/3] hover:scale-105 transition-transform duration-700"
            />
            {/* Visual Glass Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/70 border border-[#d9b45c]/20 backdrop-blur-md">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#d9b45c] block mb-1">Recommended Age</span>
              <p className="text-xs text-[#f3ecd8] font-semibold">Perfect for kids aged 4-12 & Adult absolute beginners</p>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Roadmap */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-serif text-2xl md:text-3xl text-[#f3ecd8] font-bold tracking-tight">The 6-Phase Pronunciation Roadmap</h2>
          <p className="text-xs md:text-sm text-[#c9c2ab]">
            Our pedagogical approach splits the Noorani Qaida into 6 logical blocks of learning, enabling child-paced mastering without stress or cognitive fatigue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="noorani-roadmap-grid">
          {syllabusSteps.map((step) => (
            <div
              key={step.num}
              className="bg-[#12141b]/50 border border-[#d9b45c]/10 rounded-2xl p-6 hover:border-[#d9b45c]/35 transition-all duration-300 relative group overflow-hidden"
            >
              <div className="space-y-4">
                <span className="w-8 h-8 rounded-lg bg-[#d9b45c]/8 border border-[#d9b45c]/20 flex items-center justify-center font-sans font-extrabold text-[#d9b45c] text-xs">
                  {step.num}
                </span>

                <div className="space-y-2">
                  <h3 className="font-sans font-bold text-sm md:text-base text-[#f3ecd8] group-hover:text-[#f2d98a] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#c9c2ab] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual why choose us banner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#12141b]/40 border border-[#d9b45c]/15 rounded-3xl p-8 lg:p-12 items-center">
        <div className="space-y-6">
          <h3 className="font-serif text-2xl text-[#f3ecd8] font-bold tracking-tight">
            How We Make Noorani Qaida <br />
            <span className="text-[#d9b45c] italic font-normal">Fun & Interactive for Kids</span>
          </h3>
          <p className="text-xs md:text-sm text-[#c9c2ab] leading-relaxed">
            Many traditional centers rely on monotonous rote-learning. At Truth Quran Academy, our certified pediatric tutors utilize modern educational software:
          </p>

          <ul className="space-y-3">
            {[
              "Digital colorful highlighter pens to trace Arabic letters in real-time.",
              "Pronunciation game-cards and sound files for sensory learning.",
              "Generous positive reinforcement with customized digital badges and performance certificates.",
              "Short 30-minute sessions matching short child attention spans perfectly."
            ].map((pt, i) => (
              <li key={i} className="flex items-start space-x-3 text-xs text-[#c9c2ab]">
                <Check size={14} className="text-[#d9b45c] mt-0.5 flex-shrink-0" />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-[#d9b45c]/20 shadow-xl">
          <img
            src={islamicGirlLearningNoorani}
            alt="Young Muslim girl smiling and happily studying Noorani Qaida"
            referrerPolicy="no-referrer"
            className="w-full h-auto object-cover aspect-[4/3] hover:scale-105 transition-transform duration-700"
          />
        </div>
      </div>

      {/* WhatsApp Contact Call-To-Action */}
      <div className="bg-[#FAF8F5]/80 border border-[#d9b45c]/30 rounded-3xl p-8 text-center space-y-4 max-w-4xl mx-auto shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#1fae5b]/5 blur-2xl rounded-full" />
        <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#a9822f] font-bold">Admissions Helpdesk</span>
        <h3 className="font-serif text-2xl text-[#1E1B15] font-semibold">Start the Noorani Qaida Journey Today</h3>
        <p className="text-xs text-[#5D5749] max-w-xl mx-auto leading-relaxed">
          Have questions about your child's lessons, trial times, or schedules? Speak directly with our admissions advisor on WhatsApp right now for instant assistance.
        </p>
        <div className="pt-2">
          <a
            href={`${academyContact.whatsapp}?text=Salam!%20I%20have%20questions%20regarding%20the%20Noorani%20Qaida%20course%20for%20my%20household.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#1fae5b] text-white text-xs font-sans font-bold uppercase tracking-wider shadow-md hover:bg-[#1fae5b]/95 transition-all"
          >
            <MessageCircle size={16} className="fill-current" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
