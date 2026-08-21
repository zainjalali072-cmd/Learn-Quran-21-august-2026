import React from "react";
import { Download, FileText, ArrowLeft, Book } from "lucide-react";

interface DownloadPageProps {
  setView: (view: string) => void;
}

export default function DownloadPage({ setView }: DownloadPageProps) {
  // Array of 30 Paras of the Quran with their Arabic text and English transliteration
  const paras = [
    { id: 1, arabic: "المّ", english: "Alif Lam Meem" },
    { id: 2, arabic: "سيقول", english: "Sayaqool" },
    { id: 3, arabic: "تلك الرسل", english: "Tilkal Rusull" },
    { id: 4, arabic: "لن تنالوا", english: "Lan Tana Loo" },
    { id: 5, arabic: "والمحصنات", english: "Wal Mohsanat" },
    { id: 6, arabic: "لا يحب الله", english: "La Yuhibbullah" },
    { id: 7, arabic: "واذا سمعوا", english: "Wa Iza Samiu" },
    { id: 8, arabic: "ولو اننا", english: "Wa Lau Annana" },
    { id: 9, arabic: "قال الملاء", english: "Qalal Malao" },
    { id: 10, arabic: "واعلموا", english: "Wa A'lamu" },
    { id: 11, arabic: "يعتذرون", english: "Yatazeroon" },
    { id: 12, arabic: "وما من دابة", english: "Wa Mamin Da'abat" },
    { id: 13, arabic: "وما ابرئ", english: "Wa Ma Ubrioo" },
    { id: 14, arabic: "ربما", english: "Rubama" },
    { id: 15, arabic: "سبحان الذي", english: "Subhanallazi" },
    { id: 16, arabic: "قال الم", english: "Qal Alam" },
    { id: 17, arabic: "اقترب", english: "Aqtarabo" },
    { id: 18, arabic: "قد افلح", english: "Qadd Aflaha" },
    { id: 19, arabic: "وقال الذين", english: "Wa Qalallazina" },
    { id: 20, arabic: "امن خلق", english: "A'man Khalaq" },
    { id: 21, arabic: "اتل ما اوحي", english: "Utlu Ma Oohi" },
    { id: 22, arabic: "ومن يقنت", english: "Wa Manyaqnut" },
    { id: 23, arabic: "وما لي", english: "Wa Mali" },
    { id: 24, arabic: "فمن اظلم", english: "Faman Azlam" },
    { id: 25, arabic: "اليه يرد", english: "Elahe Yuruddo" },
    { id: 26, arabic: "حم", english: "Ha'a Meem" },
    { id: 27, arabic: "قال فما خطبكم", english: "Qala Fama Khatbukum" },
    { id: 28, arabic: "قد سمع الله", english: "Qadd Sami Allah" },
    { id: 29, arabic: "تبارك الذي", english: "Tabarakallazi" },
    { id: 30, arabic: "عم يتساءلون", english: "Amma Yatasa'aloon" }
  ];

  // Helper to generate a reliable direct PDF download/view link from our local static folder
  const getParaDownloadUrl = (num: number) => {
    return `/paras/para-${String(num).padStart(2, "0")}.pdf`;
  };

  const getQaidaDownloadUrl = () => {
    return "/qaida/noorani-qaida-english-complete.pdf";
  };

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-6" id="download-page">
      {/* Back to Home Button */}
      <button
        onClick={() => setView("home")}
        className="inline-flex items-center space-x-2 text-xs font-sans font-bold uppercase tracking-wider text-[#c9c2ab] hover:text-[#f2d98a] mb-8 group transition-colors cursor-pointer"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to Home</span>
      </button>

      {/* Header Info */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <span className="text-[12px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c] bg-[#d9b45c]/8 border border-[#d9b45c]/15 px-3 py-1 rounded-full">
          Free Resources
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-[#f3ecd8] font-medium tracking-tight">
          Download Para Wise <span className="text-[#d9b45c] italic font-normal">Quran</span>
        </h2>
        <p className="text-xs md:text-sm text-[#c9c2ab] leading-relaxed">
          Access high-quality, clear-script PDF files of the Holy Quran divided Para wise (Juz' by Juz'). Perfect for offline reading, revision, and following along during classes.
        </p>
      </div>

      {/* Table Container */}
      <div className="bg-[#0e1015]/60 backdrop-blur-md border border-[#d9b45c]/15 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#d9b45c]/15 bg-[#12141c]/80 text-[#f3ecd8]">
                <th className="px-6 py-4 text-xs font-sans font-bold tracking-wider uppercase text-center w-20">#</th>
                <th className="px-6 py-4 text-xs font-sans font-bold tracking-wider uppercase text-right">Arabic Name</th>
                <th className="px-6 py-4 text-xs font-sans font-bold tracking-wider uppercase pl-12">English Transliteration</th>
                <th className="px-6 py-4 text-xs font-sans font-bold tracking-wider uppercase text-center w-40">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d9b45c]/8">
              {paras.map((para) => (
                <tr 
                  key={para.id} 
                  className="hover:bg-[#d9b45c]/5 transition-colors duration-150 group"
                >
                  {/* Sr No. */}
                  <td className="px-6 py-4 text-center text-xs font-mono font-medium text-[#d9b45c]/90">
                    {para.id}
                  </td>
                  
                  {/* Arabic Name */}
                  <td className="px-6 py-4 text-right">
                    <span className="font-serif text-lg md:text-xl font-bold text-[#f3ecd8] group-hover:text-[#f2d98a] transition-colors leading-none tracking-normal">
                      {para.arabic}
                    </span>
                  </td>
                  
                  {/* English/Transliteration Name */}
                  <td className="px-6 py-4 pl-12">
                    <span className="text-xs md:text-sm font-sans font-bold tracking-wide text-[#c9c2ab] group-hover:text-[#f3ecd8] transition-colors">
                      {para.english}
                    </span>
                  </td>
                  
                  {/* Action Link */}
                  <td className="px-6 py-4 text-center">
                    <a
                      href={getParaDownloadUrl(para.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#d9b45c]/20 text-[10px] md:text-xs font-sans font-bold uppercase tracking-wider text-[#c9c2ab] bg-[#0e1015]/40 hover:bg-[#d9b45c] hover:border-[#d9b45c] hover:text-[#07080b] transition-all duration-200 cursor-pointer shadow-sm"
                    >
                      <Download size={13} />
                      <span>Download</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* English Noorani Qaida Download Area at bottom */}
      <div className="bg-[#0e1015]/60 backdrop-blur-md border border-[#d9b45c]/15 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_15px_40px_rgba(0,0,0,0.4)]">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-[#d9b45c]/10 border border-[#d9b45c]/20 flex items-center justify-center text-[#d9b45c]">
            <Book size={24} />
          </div>
          <div className="text-left">
            <h3 className="font-sans font-bold text-sm md:text-base text-[#f3ecd8]">
              English Noorani Qaida
            </h3>
            <p className="text-xs text-[#c9c2ab] mt-0.5">
              The foundational guide for beginners learning correct Arabic pronunciation and phonetics.
            </p>
          </div>
        </div>
        <a
          href={getQaidaDownloadUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full md:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-[#d9b45c] text-[#07080b] text-xs md:text-sm font-sans font-extrabold uppercase tracking-wider shadow-[0_4px_15px_rgba(217,180,92,0.25)] hover:bg-[#f2d98a] hover:-translate-y-0.5 transition-all duration-200"
        >
          <Download size={16} />
          <span>Download Noorani Qaida</span>
        </a>
      </div>
    </div>
  );
}
