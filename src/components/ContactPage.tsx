import React from "react";
import ContactForm from "./ContactForm";
import MapSection from "./MapSection";

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12" id="contact-page-panel">
      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
        <span className="text-[12px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c] bg-[#d9b45c]/8 border border-[#d9b45c]/15 px-3 py-1 rounded-full">
          Get in Touch
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-[#f3ecd8] font-medium tracking-tight">
          Connect with <span className="text-[#d9b45c] italic font-normal">Our Coordinators</span>
        </h2>
        <p className="text-xs md:text-sm text-[#c9c2ab] leading-relaxed">
          Have specific schedule requests, multi-student discounts, or curriculum queries? Reach out to us anytime, our coordination desk operates 24/7.
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-16">
        <ContactForm />
        <MapSection className="border-t-0 py-0" />
      </div>
    </div>
  );
}
