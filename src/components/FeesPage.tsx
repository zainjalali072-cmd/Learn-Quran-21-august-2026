import React, { useState } from "react";
import { motion } from "motion/react";
import { Check, Shield, HelpCircle, Calculator, Sparkles, MessageCircle, RefreshCw } from "lucide-react";
import { pricingPlans, academyContact } from "../data";
import { getCMSData } from "../cmsStore";

type CurrencyType = "USD" | "PKR" | "GBP" | "EUR" | "CAD" | "AUD";

export default function FeesPage() {
  const cms = getCMSData();
  const activePricingPlans = cms.pricingPlans || pricingPlans;
  const [currency, setCurrency] = useState<CurrencyType>("USD");
  const [numStudents, setNumStudents] = useState<number>(1);
  const [selectedPlanDays, setSelectedPlanDays] = useState<number>(3); // 2, 3, or 5 days

  const currencySymbols: Record<CurrencyType, string> = {
    USD: "$",
    PKR: "Rs. ",
    GBP: "£",
    EUR: "€",
    CAD: "C$",
    AUD: "A$"
  };

  // Static pricing mappings for days per week in USD base
  const planPricesUSD: Record<number, number> = {
    2: 30,
    3: 45,
    5: 60
  };

  // Convert USD base price to other currencies
  const conversionRates: Record<CurrencyType, number> = {
    USD: 1.0,
    PKR: 278,
    GBP: 0.78,
    EUR: 0.92,
    CAD: 1.37,
    AUD: 1.51
  };

  const convertPrice = (usdPrice: number, curr: CurrencyType, baseUSD: number = 30): number => {
    if (curr === "PKR") {
      let basePKR = 3500;
      if (baseUSD === 45) basePKR = 5000;
      if (baseUSD === 60) basePKR = 7000;
      
      const ratio = usdPrice / baseUSD;
      return Math.round(basePKR * ratio);
    }
    return Math.round(usdPrice * conversionRates[curr]);
  };

  // Calculate dynamic tuition
  const basePriceUSD = planPricesUSD[selectedPlanDays] || 45;
  const rawTotalUSD = basePriceUSD * numStudents;
  
  // Apply 10% Sibling discount if students > 1
  const discountMultiplier = numStudents > 1 ? 0.9 : 1.0;
  const discountedTotalUSD = rawTotalUSD * discountMultiplier;
  
  const finalCalculatedPrice = convertPrice(discountedTotalUSD, currency, basePriceUSD);
  const perStudentPriceConverted = convertPrice(basePriceUSD * discountMultiplier, currency, basePriceUSD);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-6 py-12 text-left space-y-16"
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[12px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c] bg-[#d9b45c]/8 border border-[#d9b45c]/15 px-3 py-1 rounded-full">
          Affordable Global Tuition
        </span>
        <h1 className="font-serif text-4xl md:text-5xl text-[#f3ecd8] font-medium tracking-tight">
          Flexible & Transparent <br />
          <span className="text-[#d9b45c] italic font-normal">Monthly Fee Plans</span>
        </h1>
        <p className="text-xs md:text-sm text-[#c9c2ab] leading-relaxed">
          No admission fees, no contracts, and no hidden cancellation fines. Choose the plan that fits your family's routine. Multi-student sibling discounts applied automatically.
        </p>
      </div>

      {/* Currency Switcher & Static Pricing Card Grid */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#d9b45c]/15 pb-6">
          <div className="space-y-1">
            <h3 className="font-serif text-xl text-[#f3ecd8] font-bold tracking-tight">Standard Subscriptions</h3>
            <p className="text-xs text-[#c9c2ab]">Select your preferred local billing currency:</p>
          </div>
          
          {/* Currency Switcher Pills */}
          <div className="flex flex-wrap gap-1.5 bg-[#12141b] border border-[#d9b45c]/20 p-1 rounded-full">
            {(["USD", "PKR", "GBP", "EUR", "CAD", "AUD"] as CurrencyType[]).map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`px-3 py-1.5 rounded-full font-sans font-bold text-[10px] uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  currency === curr
                    ? "bg-[#d9b45c] text-[#07080b] shadow-md font-extrabold"
                    : "text-[#c9c2ab] hover:text-[#f3ecd8]"
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Static Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start" id="pricing-page-grid">
          {activePricingPlans.map((plan) => {
            const isPopular = plan.isPopular;
            // Get base price from text (e.g. "$45" -> 45)
            const basePrice = parseInt(plan.price.replace("$", ""), 10);
            const convertedVal = convertPrice(basePrice, currency, basePrice);

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 md:p-8 text-left transition-all duration-300 relative ${
                  isPopular
                    ? "bg-[#12141b]/95 border-2 border-[#d9b45c] shadow-[0_20px_50px_rgba(217,180,92,0.15)] lg:-translate-y-2"
                    : "bg-[#12141b]/60 border border-[#d9b45c]/12 shadow-[0_15px_35px_rgba(0,0,0,0.5)]"
                }`}
              >
                {isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#f2d98a] to-[#d9b45c] text-[#07080b] font-sans font-extrabold text-[9px] uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
                    Most Popular Plan
                  </span>
                )}

                <div className="space-y-4">
                  <h3 className="font-sans font-bold text-sm md:text-base text-[#c9c2ab] uppercase tracking-wider">
                    {plan.name}
                  </h3>

                  <div className="flex items-baseline">
                    <span className="font-serif text-4xl md:text-5xl text-[#f3ecd8] font-bold">
                      {currencySymbols[currency]}
                      {convertedVal.toLocaleString()}
                    </span>
                    <span className="font-sans text-xs text-[#c9c2ab] ml-2">
                      /{plan.period}
                    </span>
                  </div>

                  <div className="w-full h-[1px] bg-[#d9b45c]/10 my-2" />

                  <ul className="space-y-3">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start space-x-3 text-xs text-[#c9c2ab] leading-relaxed">
                        <Check size={14} className="text-[#d9b45c] mt-0.5 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4">
                    <a
                      href={`${academyContact.whatsapp}?text=Salam!%20I%20would%20like%20to%20register%20for%20the%20${encodeURIComponent(plan.name)}%20fee%20plan%20at%20${convertedVal}%20${currency}%20at%20Truth%20Quran%20Academy.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-3.5 rounded-full font-sans font-bold text-xs uppercase tracking-widest text-center flex items-center justify-center space-x-2 transition-all duration-300 ${
                        isPopular
                          ? "bg-gradient-to-r from-[#f2d98a] to-[#d9b45c] text-[#07080b] shadow-lg hover:scale-[1.01]"
                          : "border border-[#d9b45c]/30 text-[#f3ecd8] hover:bg-[#d9b45c]/10"
                      }`}
                    >
                      <span>Enroll This Plan</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Fee Calculator Section */}
      <div className="bg-[#12141b]/40 border border-[#d9b45c]/15 rounded-3xl p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center" id="tuition-calculator">
        {/* Left Interactive Side */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center space-x-2 text-[#d9b45c]">
            <Calculator size={20} />
            <h3 className="font-serif text-2xl font-bold tracking-tight">Tuition Cost Calculator</h3>
          </div>
          <p className="text-xs text-[#c9c2ab] leading-relaxed">
            Adjust the controls below to calculate the exact custom monthly tuition for your household. Sibling discount is applied instantly!
          </p>

          <div className="space-y-5">
            {/* 1. Choose Course Schedule */}
            <div className="space-y-2">
              <label className="text-xs font-sans font-bold text-[#f3ecd8] uppercase tracking-wider block">1. Select Weekly Frequency:</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { days: 2, label: "2 Days / Wk" },
                  { days: 3, label: "3 Days / Wk" },
                  { days: 5, label: "5 Days / Wk" }
                ].map((item) => (
                  <button
                    key={item.days}
                    onClick={() => setSelectedPlanDays(item.days)}
                    className={`py-3 rounded-xl font-sans font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                      selectedPlanDays === item.days
                        ? "bg-[#d9b45c]/15 border-2 border-[#d9b45c] text-[#f2d98a]"
                        : "bg-[#0e1015]/60 border border-[#d9b45c]/10 text-[#c9c2ab] hover:border-[#d9b45c]/25"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Choose Students */}
            <div className="space-y-2">
              <label className="text-xs font-sans font-bold text-[#f3ecd8] uppercase tracking-wider block">2. Number of Students / Siblings:</label>
              <div className="flex items-center space-x-3">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => setNumStudents(num)}
                    className={`w-12 h-12 rounded-xl font-sans font-bold text-sm transition-colors cursor-pointer ${
                      numStudents === num
                        ? "bg-[#d9b45c]/15 border-2 border-[#d9b45c] text-[#f2d98a]"
                        : "bg-[#0e1015]/60 border border-[#d9b45c]/10 text-[#c9c2ab] hover:border-[#d9b45c]/25"
                    }`}
                  >
                    {num}
                  </button>
                ))}
                {numStudents > 1 && (
                  <span className="text-[10px] font-sans font-extrabold uppercase tracking-widest text-[#1fae5b] bg-[#1fae5b]/10 px-3 py-1.5 rounded-full animate-pulse border border-[#1fae5b]/20">
                    🎉 10% Sibling Discount Applied!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Side */}
        <div className="lg:col-span-5 bg-[#0e1015]/90 border border-[#d9b45c]/20 rounded-2xl p-6 lg:p-8 space-y-6 text-center shadow-2xl relative overflow-hidden">
          {/* Subtle gold pattern or card glows */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,180,92,0.05)_0%,transparent_75%)] pointer-events-none" />

          <div className="space-y-1">
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#d9b45c]">Monthly Valuation</span>
            <h4 className="font-sans font-extrabold text-xs text-[#c9c2ab] uppercase">Total Tuition Fee</h4>
          </div>

          <div className="space-y-1">
            <div className="font-serif text-5xl lg:text-6xl text-[#f3ecd8] font-extrabold flex items-center justify-center">
              <span className="text-[#d9b45c] mr-1">{currencySymbols[currency]}</span>
              <span>{finalCalculatedPrice.toLocaleString()}</span>
            </div>
            <p className="text-[10px] text-[#c9c2ab] uppercase tracking-wider">
              {currencySymbols[currency]}
              {perStudentPriceConverted.toLocaleString()} monthly per student
            </p>
          </div>

          <div className="w-full h-[1px] bg-[#d9b45c]/10 my-1" />

          <div className="text-[11px] text-[#c9c2ab] space-y-1 select-none text-left">
            <div className="flex justify-between">
              <span>Selected Track:</span>
              <span className="font-bold text-[#f3ecd8]">{selectedPlanDays} Lessons / Week</span>
            </div>
            <div className="flex justify-between">
              <span>Total Sessions / Month:</span>
              <span className="font-bold text-[#f3ecd8]">{selectedPlanDays * 4 * numStudents} Lessons</span>
            </div>
            <div className="flex justify-between">
              <span>Billing Currency:</span>
              <span className="font-bold text-[#d9b45c]">{currency}</span>
            </div>
            <div className="flex justify-between border-t border-[#d9b45c]/10 pt-1.5 mt-1">
              <span>Classes Conducted Via:</span>
              <span className="font-bold text-[#f2d98a]">Zoom, WhatsApp, or Google Meet only</span>
            </div>
          </div>

          <a
            href={`${academyContact.whatsapp}?text=Salam!%20I%20used%20the%20Calculator%20on%20your%20website.%20I%20want%20to%20register%20${numStudents}%20student(s)%20for%20the%20${selectedPlanDays}%20days/week%20plan%20valued%20at%20${finalCalculatedPrice}%20${currency}/month.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center space-x-2 py-4 rounded-full bg-[#1fae5b] text-white text-xs font-sans font-extrabold uppercase tracking-wider shadow-lg hover:bg-[#1fae5b]/90 transition-all"
          >
            <MessageCircle size={16} className="fill-current" />
            <span>Submit Registration via WhatsApp</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
