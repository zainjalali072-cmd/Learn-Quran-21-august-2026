import React, { useState, useEffect } from "react";
import { Menu, X, MessageCircle, ChevronDown, Facebook, Instagram, Linkedin } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import { academyContact } from "../data";
import logoImg from "../assets/images/truth_quran_new_logo_1784203145448.jpg";
import { getCMSData } from "../cmsStore";

interface HeaderProps {
  currentView: string;
  setView: (view: any) => void;
  onNavigate: (sectionId: string) => void;
}

export default function Header({ currentView, setView, onNavigate }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileDropdowns, setMobileDropdowns] = useState<Record<string, boolean>>({
    "about-dropdown": true,
    "courses-dropdown": true,
  });
  const [cms, setCms] = useState(getCMSData());

  useEffect(() => {
    const handleSync = () => setCms(getCMSData());
    window.addEventListener("cms_data_updated", handleSync);
    return () => window.removeEventListener("cms_data_updated", handleSync);
  }, []);


  const navigation = cms.navigationMenu || [
    { label: "Home", id: "home" },
    { 
      label: "About Us", 
      id: "about-dropdown",
      children: [
        { label: "Our Story / Mission", id: "about" },
        { label: "Videos / Gallery", id: "videos" },
      ]
    },
    { 
      label: "Courses", 
      id: "courses-dropdown",
      children: [
        { label: "All Courses", id: "courses" },
        { label: "Noorani Qaida", id: "noorani-qaida" },
        { label: "Kids Quran Classes", id: "kids-classes" },
      ]
    },
    { label: "Pricing", id: "fees" },
    { label: "Blog", id: "blog" },
    { label: "Download", id: "download" },
    { label: "Contact Us", id: "contact" },
  ];

  const isViewActive = (navId: string) => {
    if (navId === currentView) return true;
    if (navId === "blog" && ["blog", "category", "tag", "blog-post"].includes(currentView)) return true;
    if (navId === "courses" && ["courses"].includes(currentView)) return true;
    return false;
  };

  const getViewHref = (id: string) => {
    if (id === "home") return "/";
    if (id === "about") return "/about";
    if (id === "courses") return "/courses";
    if (id === "noorani-qaida") return "/noorani-qaida";
    if (id === "kids-classes") return "/kids-classes";
    if (id === "fees" || id === "pricing") return "/fees";
    if (id === "videos") return "/videos";
    if (id === "download") return "/download";
    if (id === "blog") return "/blog";
    if (id === "contact") return "/contact";
    return `/${id}`;
  };

  const handleLinkClick = (id: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsMobileMenuOpen(false);
    setView(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleMobileDropdown = (id: string) => {
    setMobileDropdowns(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <header className="sticky top-0 w-full z-50 bg-[#07080b]/80 backdrop-blur-md border-b border-[#d9b45c]/18 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo Left */}
        <a 
          href="/"
          onClick={handleLogoClick}
          className="flex items-center space-x-2.5 cursor-pointer select-none group"
          id="header-logo-container"
        >
          <div className="w-12 h-12 rounded-xl border border-[#d9b45c]/40 flex items-center justify-center overflow-hidden bg-[#0e1015] shadow-[0_0_15px_rgba(217,180,92,0.15)] group-hover:border-[#d9b45c] transition-colors flex-shrink-0">
            <img 
              src={cms.customImages?.siteLogo?.url || logoImg} 
              alt={cms.customImages?.siteLogo?.alt || "Truth Quran Logo"} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain" 
            />
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-extrabold text-sm tracking-widest text-[#f3ecd8] uppercase">
              {cms.siteLogoText} <span className="text-[#d9b45c]">{cms.siteLogoSubText}</span>
            </span>
            <span className="font-serif italic text-[11px] text-[#d9b45c] tracking-wider leading-none">
              Academy
            </span>
          </div>
        </a>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden lg:flex items-center space-x-7" id="desktop-nav">
          {navigation.map((link) => {
            if (link.children) {
              const isDropdownOpen = activeDropdown === link.id;
              const isParentActive = link.children.some((sub) => isViewActive(sub.id));
              return (
                <div
                  key={link.id}
                  className="relative py-6"
                  onMouseEnter={() => setActiveDropdown(link.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={`flex items-center space-x-1.5 text-xs font-sans font-semibold tracking-wider uppercase transition-colors cursor-pointer ${
                      isParentActive || activeDropdown === link.id
                        ? "text-[#f2d98a]"
                        : "text-[#c9c2ab] hover:text-[#f2d98a]"
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronDown 
                      size={13} 
                      className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180 text-[#d9b45c]" : "text-[#c9c2ab]"}`} 
                    />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute top-[80%] left-1/2 -translate-x-1/2 w-52 bg-[#0e1015]/95 backdrop-blur-md border border-[#d9b45c]/25 rounded-xl p-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-top-2 duration-150 flex flex-col space-y-1">
                      {link.children.map((subLink) => (
                        <a
                          key={subLink.id}
                          href={getViewHref(subLink.id)}
                          onClick={(e) => handleLinkClick(subLink.id, e)}
                          className={`text-left px-3 py-2 text-[11px] font-sans font-bold tracking-wider uppercase rounded-lg transition-colors cursor-pointer block ${
                            isViewActive(subLink.id)
                              ? "bg-[#d9b45c]/12 text-[#f2d98a]"
                              : "text-[#c9c2ab] hover:bg-[#d9b45c]/8 hover:text-[#f3ecd8]"
                          }`}
                        >
                          {subLink.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <a
                key={link.id}
                href={getViewHref(link.id)}
                onClick={(e) => handleLinkClick(link.id, e)}
                className={`text-xs font-sans font-semibold tracking-wider uppercase transition-colors cursor-pointer ${
                  isViewActive(link.id) ? "text-[#f2d98a]" : "text-[#c9c2ab] hover:text-[#f2d98a]"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right CTA (Desktop) */}
        <div className="hidden lg:flex items-center space-x-4" id="desktop-cta">
          <a
            href={`${academyContact.whatsapp}?text=Salam,%20I%20would%20like%20to%20register%20for%20a%20Free%20Trial%20at%20Truth%20Quran%20Academy.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full border border-[#d9b45c]/30 text-xs font-sans font-semibold text-[#f3ecd8] hover:bg-[#d9b45c]/10 hover:border-[#d9b45c] transition-all duration-300 flex items-center space-x-1 cursor-pointer"
          >
            <span>Free Trial</span>
          </a>
          <a
            href="/contact"
            onClick={(e) => handleLinkClick("contact", e)}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#f2d98a] to-[#d9b45c] text-xs font-sans font-extrabold text-[#07080b] shadow-[0_4px_15px_rgba(217,180,92,0.3)] hover:shadow-[0_4px_25px_rgba(217,180,92,0.5)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer inline-block"
          >
            Enquire
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-[#f3ecd8] hover:text-[#d9b45c] transition-colors cursor-pointer"
          aria-label="Toggle Menu"
          id="mobile-menu-toggle"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden w-full bg-[#0e1015] border-b border-[#d9b45c]/18 py-6 px-6 absolute top-20 left-0 shadow-xl transition-all duration-300 z-50 max-h-[80vh] overflow-y-auto"
          id="mobile-dropdown-panel"
        >
          <div className="flex flex-col space-y-4">
            {navigation.map((link) => {
              if (link.children) {
                const isOpen = !!mobileDropdowns[link.id];
                const isParentActive = link.children.some((sub) => sub.id === currentView);
                return (
                  <div key={link.id} className="flex flex-col space-y-2">
                    <button
                      onClick={() => toggleMobileDropdown(link.id)}
                      className="flex items-center justify-between w-full py-2 font-sans font-semibold tracking-wider uppercase text-sm transition-colors cursor-pointer text-left text-[#c9c2ab] hover:text-[#f2d98a]"
                    >
                      <span className={isParentActive ? "text-[#f2d98a]" : ""}>{link.label}</span>
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-[#d9b45c]" : "text-[#c9c2ab]"}`} 
                      />
                    </button>
                    {isOpen && (
                      <div className="pl-4 flex flex-col space-y-2 border-l border-[#d9b45c]/20 py-1">
                        {link.children.map((subLink) => (
                          <a
                            key={subLink.id}
                            href={getViewHref(subLink.id)}
                            onClick={(e) => handleLinkClick(subLink.id, e)}
                            className={`text-left py-1.5 font-sans font-semibold tracking-wider text-xs uppercase transition-colors cursor-pointer block ${
                              isViewActive(subLink.id) ? "text-[#f2d98a]" : "text-[#c9c2ab]/80 hover:text-[#f2d98a]"
                            }`}
                          >
                            {subLink.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <a
                  key={link.id}
                  href={getViewHref(link.id)}
                  onClick={(e) => handleLinkClick(link.id, e)}
                  className={`text-left py-2 font-sans font-semibold tracking-wider uppercase text-sm transition-colors cursor-pointer block ${
                    isViewActive(link.id) ? "text-[#f2d98a]" : "text-[#c9c2ab] hover:text-[#f2d98a]"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
             <div className="pt-4 border-t border-[#d9b45c]/10 flex flex-col space-y-3">
              <a
                href={`${academyContact.whatsapp}?text=Salam,%20I%20would%20like%20to%20register%20for%20a%20Free%20Trial%20at%20Truth%20Quran%20Academy.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-3 rounded-full border border-[#d9b45c]/30 text-sm font-sans font-semibold text-[#f3ecd8] hover:bg-[#d9b45c]/10 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Free Trial</span>
              </a>
              <a
                href="/contact"
                onClick={(e) => handleLinkClick("contact", e)}
                className="w-full text-center py-3 rounded-full bg-gradient-to-r from-[#f2d98a] to-[#d9b45c] text-sm font-sans font-extrabold text-[#07080b] shadow-lg block"
              >
                Enquire
              </a>

              {/* Social Media Links */}
              <div className="flex items-center justify-center space-x-3 pt-3 border-t border-[#d9b45c]/10">
                {(cms.facebookLink || academyContact.facebook) && (
                  <a
                    href={cms.facebookLink || academyContact.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border border-[#1877F2]/40 bg-[#1877F2]/15 flex items-center justify-center text-[#4285F4] hover:bg-[#1877F2] hover:text-white transition-colors"
                    aria-label="Facebook Profile"
                  >
                    <Facebook size={16} />
                  </a>
                )}
                {(cms.instagramLink || academyContact.instagram) && (
                  <a
                    href={cms.instagramLink || academyContact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border border-[#E4405F]/40 bg-[#E4405F]/15 flex items-center justify-center text-[#f43f5e] hover:bg-[#E4405F] hover:text-white transition-colors"
                    aria-label="Instagram Profile"
                  >
                    <Instagram size={16} />
                  </a>
                )}
                {(cms.linkedinLink || academyContact.linkedin) && (
                  <a
                    href={cms.linkedinLink || academyContact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border border-[#0A66C2]/40 bg-[#0A66C2]/15 flex items-center justify-center text-[#38bdf8] hover:bg-[#0A66C2] hover:text-white transition-colors"
                    aria-label="LinkedIn Profile"
                  >
                    <Linkedin size={16} />
                  </a>
                )}
                {(cms.whatsappLink || academyContact.whatsapp) && (
                  <a
                    href={`${cms.whatsappLink || academyContact.whatsapp}?text=Salam%20Truth%20Quran%20Academy.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border border-[#25D366]/40 bg-[#25D366]/15 flex items-center justify-center text-[#4ade80] hover:bg-[#25D366] hover:text-white transition-colors"
                    aria-label="WhatsApp Support"
                  >
                    <WhatsAppIcon size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
