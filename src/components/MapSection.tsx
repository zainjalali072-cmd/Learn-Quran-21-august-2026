import React from "react";
import { MapPin, Navigation, Phone, ExternalLink, Sparkles } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import { academyContact } from "../data";
import { getCMSData } from "../cmsStore";

interface MapSectionProps {
  className?: string;
}

export default function MapSection({ className = "" }: MapSectionProps) {
  const cms = getCMSData();
  const locationAddress = cms.contactAddress || "Altaf Colony, Ranjar Head Quarter, Lahore Cantt, Pakistan";
  const encodedAddress = encodeURIComponent(locationAddress);
  
  // Google Maps navigation & embed URLs
  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  const embedUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <section id="map-location" className={`py-16 md:py-24 relative overflow-hidden border-t border-[#d9b45c]/15 ${className}`}>
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#d9b45c]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="inline-flex items-center space-x-2 text-[11px] md:text-[12px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c] bg-[#d9b45c]/8 border border-[#d9b45c]/20 px-4 py-1.5 rounded-full shadow-inner">
            <Sparkles size={13} className="text-[#d9b45c]" />
            <span>Campus Location</span>
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-[#f3ecd8] font-medium tracking-tight">
            Visit Our <span className="text-[#d9b45c] italic font-normal">Academy Campus</span>
          </h2>
          <p className="text-xs md:text-sm text-[#c9c2ab] leading-relaxed max-w-lg mx-auto">
            Located in Lahore Cantt, Pakistan. Get instant directions or contact our administration desk directly.
          </p>
        </div>

        {/* Grid: Details Card + Map Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Location Info Card */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 md:p-8 rounded-3xl bg-[#0e1015]/90 border border-[#d9b45c]/20 shadow-[0_15px_40px_rgba(0,0,0,0.6)] backdrop-blur-md relative overflow-hidden group">
            
            {/* Soft decorative accent corner */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#d9b45c]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#d9b45c]/20 transition-all duration-500" />

            <div className="space-y-6">
              
              {/* Header badge */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-[#d9b45c]/12 border border-[#d9b45c]/30 flex items-center justify-center text-[#d9b45c] shadow-[0_0_15px_rgba(217,180,92,0.15)] flex-shrink-0">
                  <MapPin size={22} />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#f3ecd8] font-semibold">Head Campus Address</h3>
                  <p className="text-[11px] text-[#d9b45c] font-sans uppercase tracking-widest font-bold">Lahore Cantt, Pakistan</p>
                </div>
              </div>

              {/* Exact Location Text */}
              <div className="p-4 rounded-2xl bg-[#07080b]/80 border border-[#d9b45c]/10 space-y-2">
                <p className="text-xs text-[#d9b45c] font-sans uppercase tracking-wider font-bold">Physical Address</p>
                <p className="text-sm md:text-base font-sans text-[#f3ecd8] leading-relaxed font-medium">
                  {locationAddress}
                </p>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                
                {/* Phone */}
                <div className="p-3.5 rounded-xl bg-[#07080b]/50 border border-[#d9b45c]/10 flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-[#d9b45c]/10 flex items-center justify-center text-[#d9b45c]">
                    <Phone size={15} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-[#c9c2ab] font-sans uppercase tracking-wider">Helpline</p>
                    <a 
                      href={`tel:${(cms.contactPhone || academyContact.phone).replace(/\s+/g, "")}`}
                      className="text-xs font-semibold text-[#f3ecd8] hover:text-[#d9b45c] transition-colors truncate block"
                    >
                      {cms.contactPhone || academyContact.phone}
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="p-3.5 rounded-xl bg-[#07080b]/50 border border-[#25D366]/20 flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-[#25D366]/15 flex items-center justify-center text-[#4ade80]">
                    <WhatsAppIcon size={15} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-[#c9c2ab] font-sans uppercase tracking-wider">WhatsApp</p>
                    <a 
                      href={`${cms.whatsappLink || academyContact.whatsapp}?text=Salam!%20I%20want%20to%20inquire%20about%20Truth%20Quran%20Academy%20Campus.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-[#4ade80] hover:underline truncate block"
                    >
                      Chat Admin
                    </a>
                  </div>
                </div>

              </div>

            </div>

            {/* Action Buttons */}
            <div className="pt-6 space-y-3">
              <a
                href={mapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#d9b45c] to-[#f2d98a] text-[#07080b] font-sans font-extrabold text-xs uppercase tracking-wider shadow-[0_8px_25px_rgba(217,180,92,0.3)] hover:shadow-[0_12px_30px_rgba(217,180,92,0.5)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <Navigation size={16} />
                <span>Open in Google Maps</span>
                <ExternalLink size={14} className="opacity-70" />
              </a>
            </div>

          </div>

          {/* Right Column: Google Maps Interactive Container */}
          <div className="lg:col-span-7 h-[380px] lg:h-[480px] rounded-3xl overflow-hidden border border-[#d9b45c]/20 shadow-[0_20px_50px_rgba(0,0,0,0.7)] relative bg-[#0e1015]">
            <iframe
              title="Truth Quran Academy Google Map Location"
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, filter: "contrast(1.05) saturate(1.1)" }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full rounded-3xl"
            />

            {/* Floating location pin badge overlay on map top right */}
            <div className="absolute top-4 right-4 bg-[#07080b]/90 border border-[#d9b45c]/30 px-3.5 py-2 rounded-full text-xs font-sans text-[#f3ecd8] flex items-center space-x-2 shadow-xl backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              <span className="font-semibold text-[#d9b45c]">Lahore Cantt</span>
              <span className="text-[#c9c2ab]">| Pakistan</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
