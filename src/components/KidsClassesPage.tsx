import React from "react";
import { motion } from "motion/react";
import { Smile, Award, Shield, Compass, Check, Calendar, HelpCircle, MessageCircle } from "lucide-react";
import { academyContact } from "../data";
import islamicKidsLearning from "../assets/images/islamic_kids_learning_1784120227940.jpg";
import parentKidsQuran from "../assets/images/parent_kids_quran_1784121554278.jpg";

export default function KidsClassesPage() {
  const kidHighlights = [
    {
      title: "Patient Pedagogical Tutors",
      desc: "Our instructors are specialized in child behavioral sciences, using soft speaking tones, constant praise, and warm smiles.",
      icon: Smile
    },
    {
      title: "Certified Female Scholars",
      desc: "For young girls and toddlers, we host highly qualified, certified female scholars who maintain comfort, safety, and respect.",
      icon: Shield
    },
    {
      title: "Fun Quizzes & Digital Rewards",
      desc: "We ditch dry rote memorization. We use colourful digital workbooks, interactive spelling tools, and award performance badges.",
      icon: Award
    },
    {
      title: "Interactive Whiteboards",
      desc: "Using tablet stylus drawing in live Zooms, teachers can draw Makharij articulation charts directly on the student's screen.",
      icon: Compass
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
        {/* Left Column: Text */}
        <div className="lg:col-span-7 space-y-6">
          <span className="text-[12px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c] bg-[#d9b45c]/8 border border-[#d9b45c]/15 px-3 py-1 rounded-full">
            Specialized Youth Program
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-[#f3ecd8] font-medium leading-[1.15] tracking-tight">
            Nurturing Quranic Love inside <br />
            <span className="text-[#d9b45c] italic font-normal">Our Children's Hearts</span>
          </h1>
          <p className="text-xs md:text-sm text-[#c9c2ab] leading-relaxed max-w-xl">
            We understand that kids require a completely different pedagogical blueprint compared to adults. At Truth Quran Academy, our certified tutors specialize in child-centered education, transforming standard Quran learning into a joyful, interactive spiritual quest.
          </p>

          {/* Highlight list */}
          <div className="space-y-3 pt-2 text-xs md:text-sm text-[#c9c2ab]">
            <div className="flex items-center space-x-2.5">
              <Check size={16} className="text-[#d9b45c] flex-shrink-0" />
              <span>1-on-1 private classrooms: zero group distractions or peer pressure.</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <Check size={16} className="text-[#d9b45c] flex-shrink-0" />
              <span>30-minute high-attention focus sessions.</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <Check size={16} className="text-[#d9b45c] flex-shrink-0" />
              <span>Interactive whiteboard, games, and screen-sharing worksheets.</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-4">
            <a
              href={`${academyContact.whatsapp}?text=Salam!%20I%20would%20like%20to%20register%20my%20child%20for%20a%20Free%20Trial%20lesson%20at%20Truth%20Quran%20Academy.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-4 rounded-full bg-[#1fae5b] text-white text-xs font-sans font-extrabold uppercase tracking-wider shadow-lg hover:bg-[#1fae5b]/90 transition-all duration-300"
            >
              <MessageCircle size={18} className="fill-current" />
              <span>Schedule Kids Free Trial</span>
            </a>
          </div>
        </div>

        {/* Right Column: Beautiful realistic child studying image */}
        <div className="lg:col-span-5 relative">
          <div className="absolute inset-0 bg-[#d9b45c]/5 rounded-3xl filter blur-[50px] pointer-events-none" />
          <div className="relative rounded-3xl overflow-hidden border border-[#d9b45c]/25 shadow-2xl">
            <img
              src={islamicKidsLearning}
              alt="Muslim child learning the Holy Quran online"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-cover aspect-[4/3] hover:scale-105 transition-transform duration-700"
            />
            {/* Visual Soft Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/75 border border-[#d9b45c]/20 backdrop-blur-md">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#d9b45c] block mb-1">Our Core Promise</span>
              <p className="text-xs text-[#f3ecd8] font-semibold">"Patience, gentle correction, and endless encouragement."</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Highlights Section */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-serif text-2xl md:text-3xl text-[#f3ecd8] font-bold tracking-tight">Designed Specifically For Young Learners</h2>
          <p className="text-xs md:text-sm text-[#c9c2ab]">
            Every element of our learning management system has been refined to engage children constructively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="kids-highlights-grid">
          {kidHighlights.map((hl, i) => {
            const Icon = hl.icon;
            return (
              <div
                key={i}
                className="bg-[#12141b]/50 border border-[#d9b45c]/10 rounded-2xl p-6 flex flex-col md:flex-row items-start gap-5 hover:border-[#d9b45c]/35 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-[#d9b45c]/8 border border-[#d9b45c]/20 flex items-center justify-center text-[#d9b45c] flex-shrink-0">
                  <Icon size={22} />
                </div>
                <div className="space-y-2 text-left">
                  <h3 className="font-sans font-bold text-sm md:text-base text-[#f3ecd8] group-hover:text-[#f2d98a] transition-colors">
                    {hl.title}
                  </h3>
                  <p className="text-xs text-[#c9c2ab] leading-relaxed">
                    {hl.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Parents Portal Integration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-[#12141b]/30 border border-[#d9b45c]/12 rounded-3xl p-8 lg:p-12 items-center">
        <div className="relative rounded-2xl overflow-hidden border border-[#d9b45c]/15 shadow-xl">
          <img
            src={parentKidsQuran}
            alt="Parent supervising child's online education happily"
            referrerPolicy="no-referrer"
            className="w-full h-auto object-cover aspect-[4/3]"
          />
        </div>

        <div className="space-y-6 text-left">
          <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#d9b45c]">Parents Dashboard</span>
          <h3 className="font-serif text-2xl text-[#f3ecd8] font-bold tracking-tight">Stay Fully Integrated In <br />Your Child's Progress</h3>
          <p className="text-xs md:text-sm text-[#c9c2ab] leading-relaxed">
            We don't leave parents in the dark. Our system synchronizes progress reports directly with your dashboard so you can monitor your child's milestones:
          </p>

          <div className="space-y-4">
            <div className="flex items-start space-x-3 text-xs text-[#c9c2ab]">
              <div className="w-6 h-6 rounded-full bg-[#d9b45c]/10 text-[#d9b45c] flex items-center justify-center font-bold flex-shrink-0 mt-0.5">1</div>
              <div>
                <h5 className="font-sans font-semibold text-xs text-[#f3ecd8]">Monthly Progress Reports</h5>
                <p className="text-[10px] text-[#c9c2ab] mt-0.5">A detailed checklist evaluating Tajweed rules mastered, memorization speed, and attention levels.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-xs text-[#c9c2ab]">
              <div className="w-6 h-6 rounded-full bg-[#d9b45c]/10 text-[#d9b45c] flex items-center justify-center font-bold flex-shrink-0 mt-0.5">2</div>
              <div>
                <h5 className="font-sans font-semibold text-xs text-[#f3ecd8]">Direct Teacher Contact</h5>
                <p className="text-[10px] text-[#c9c2ab] mt-0.5">Connect with your child's tutor directly via secure text messaging to review homework and offer specific guidance.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-xs text-[#c9c2ab]">
              <div className="w-6 h-6 rounded-full bg-[#d9b45c]/10 text-[#d9b45c] flex items-center justify-center font-bold flex-shrink-0 mt-0.5">3</div>
              <div>
                <h5 className="font-sans font-semibold text-xs text-[#f3ecd8]">Lesson Video Recordings</h5>
                <p className="text-[10px] text-[#c9c2ab] mt-0.5">Access playbacks of actual 1-on-1 sessions so your child can easily revise correct pronunciations during homework time.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Contact Call-To-Action */}
      <div className="bg-[#FAF8F5]/80 border border-[#d9b45c]/30 rounded-3xl p-8 text-center space-y-4 max-w-4xl mx-auto shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#1fae5b]/5 blur-2xl rounded-full" />
        <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#a9822f] font-bold">Admissions Helpdesk</span>
        <h3 className="font-serif text-2xl text-[#1E1B15] font-semibold">Ready to Setup Your Child's Free Trial?</h3>
        <p className="text-xs text-[#5D5749] max-w-xl mx-auto leading-relaxed">
          Need custom timings, weekend slots, or want to pick a specialized female instructor? Our WhatsApp admissions desk is open 24/7. Connect with us instantly!
        </p>
        <div className="pt-2">
          <a
            href={`${academyContact.whatsapp}?text=Salam!%20I%20would%20like%20to%20know%20more%20and%20schedule%20a%20Free%20Trial%20for%20my%20child.`}
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
