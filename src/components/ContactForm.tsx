import React, { useState, useEffect } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle, 
  Sparkles, 
  User, 
  Globe, 
  GraduationCap, 
  Calendar,
  Facebook,
  Instagram,
  Linkedin
} from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import { academyContact } from "../data";
import { getCMSData, saveCMSData } from "../cmsStore";

export default function ContactForm() {
  const [cms, setCms] = useState(getCMSData());

  useEffect(() => {
    const handleSync = () => setCms(getCMSData());
    window.addEventListener("cms_data_updated", handleSync);
    return () => window.removeEventListener("cms_data_updated", handleSync);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    country: "",
    course: "noorani-qaida",
    email: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Simple validation
    if (!formData.name || !formData.age || !formData.country || !formData.email) {
      setErrorMessage("Please fill in all fields before submitting.");
      return;
    }

    // Identify selected course title
    const currentCourses = cms.courses || [];
    const selectedCourseObj = currentCourses.find((c) => c.id === formData.course);
    const courseTitle = selectedCourseObj ? selectedCourseObj.title : formData.course;

    // Build pre-filled WhatsApp message
    const message = `Salam! I have submitted an enrollment inquiry on your website. Here are my details:\n\n👤 *Student Name:* ${formData.name}\n👶 *Student Age:* ${formData.age} years\n🌍 *Country:* ${formData.country}\n📚 *Selected Course:* ${courseTitle}\n✉️ *Email Address:* ${formData.email}\n\nPlease guide me regarding the trial session.`;
    
    const encoded = encodeURIComponent(message);
    const whatsappUrl = `${cms.whatsappLink || "https://wa.me/+923219347471"}?text=${encoded}`;

    // Push lead inquiry to Simulated WordPress Database
    const newInquiry = {
      id: `inquiry-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      age: formData.age,
      country: formData.country,
      course: formData.course,
      message: `Enrolling in ${courseTitle}. Student age is ${formData.age} years from ${formData.country}.`,
      date: new Date().toISOString().split("T")[0],
      status: "pending" as const,
      type: "inquiry" as const
    };
    const nextComments = [newInquiry, ...(cms.comments || [])];
    saveCMSData({
      ...cms,
      comments: nextComments
    });

    // Mark as submitted
    setIsSubmitted(true);

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start" id="contact-grid">
      
      {/* 1. Contact Info Panel (Placed FIRST in DOM so on desktop it is on the Left, and on mobile on top) */}
      <div className="lg:col-span-5 space-y-8 text-left" id="contact-info-panel">
        <div className="space-y-4">
          <span className="text-[12px] font-sans uppercase font-bold tracking-[0.25em] text-[#d9b45c] bg-[#d9b45c]/8 border border-[#d9b45c]/15 px-3.5 py-1.5 rounded-full inline-block">
            Get In Touch
          </span>
          <h3 className="font-serif text-3xl md:text-4.5xl text-[#f3ecd8] font-medium tracking-tight leading-snug">
            Have Questions? <br />
            <span className="text-[#d9b45c] italic font-normal font-serif">Connect With Us</span>
          </h3>
          <p className="text-xs md:text-sm text-[#c9c2ab] leading-relaxed max-w-md font-light">
            Our student coordination desk operates round-the-clock to assist global students. Whether you want to book a custom trial slot or have general inquiries, reach out using any channel below.
          </p>
        </div>

        {/* Info List styled as beautiful, high-fidelity card buttons */}
        <div className="grid grid-cols-1 gap-4" id="contact-details-list">
          
          {/* Card 1: Address */}
          <div className="p-5 rounded-2xl bg-[#12141b]/65 border-2 border-[#d9b45c]/10 hover:border-[#d9b45c]/40 hover:bg-[#12141b]/95 transition-all duration-300 flex items-start space-x-4 group shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-[#d9b45c]/8 border border-[#d9b45c]/20 flex items-center justify-center text-[#d9b45c] flex-shrink-0 group-hover:bg-[#d9b45c] group-hover:text-[#07080b] group-hover:shadow-[0_0_15px_rgba(217,180,92,0.4)] transition-all duration-300 shadow-inner">
              <MapPin size={20} />
            </div>
            <div className="space-y-1">
              <h5 className="font-sans font-bold text-[10px] text-[#d9b45c] uppercase tracking-widest">Academy Location</h5>
              <p className="text-xs md:text-sm text-[#c9c2ab] leading-normal group-hover:text-[#f3ecd8] transition-colors">{cms.contactAddress}</p>
            </div>
          </div>

          {/* Card 2: Phone */}
          <div className="p-5 rounded-2xl bg-[#12141b]/65 border-2 border-[#d9b45c]/10 hover:border-[#d9b45c]/40 hover:bg-[#12141b]/95 transition-all duration-300 flex items-start space-x-4 group shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-[#d9b45c]/8 border border-[#d9b45c]/20 flex items-center justify-center text-[#d9b45c] flex-shrink-0 group-hover:bg-[#d9b45c] group-hover:text-[#07080b] group-hover:shadow-[0_0_15px_rgba(217,180,92,0.4)] transition-all duration-300 shadow-inner">
              <Phone size={20} />
            </div>
            <div className="space-y-1">
              <h5 className="font-sans font-bold text-[10px] text-[#d9b45c] uppercase tracking-widest">Phone Helpline</h5>
              <a 
                href={`tel:${cms.contactPhone.replace(/\s+/g, "")}`} 
                className="text-xs md:text-sm text-[#c9c2ab] font-bold leading-normal group-hover:text-[#f2d98a] transition-colors block"
              >
                {cms.contactPhone}
              </a>
            </div>
          </div>

          {/* Card 3: Email */}
          <div className="p-5 rounded-2xl bg-[#12141b]/65 border-2 border-[#d9b45c]/10 hover:border-[#d9b45c]/40 hover:bg-[#12141b]/95 transition-all duration-300 flex items-start space-x-4 group shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-[#d9b45c]/8 border border-[#d9b45c]/20 flex items-center justify-center text-[#d9b45c] flex-shrink-0 group-hover:bg-[#d9b45c] group-hover:text-[#07080b] group-hover:shadow-[0_0_15px_rgba(217,180,92,0.4)] transition-all duration-300 shadow-inner">
              <Mail size={20} />
            </div>
            <div className="space-y-1">
              <h5 className="font-sans font-bold text-[10px] text-[#d9b45c] uppercase tracking-widest">Official Email</h5>
              <a 
                href={`mailto:${cms.contactEmail}`} 
                className="text-xs md:text-sm text-[#c9c2ab] font-bold leading-normal group-hover:text-[#f2d98a] transition-colors block break-all"
              >
                {cms.contactEmail}
              </a>
            </div>
          </div>

          {/* Card 4: WhatsApp */}
          <div className="p-5 rounded-2xl bg-[#12141b]/65 border-2 border-[#1fae5b]/10 hover:border-[#1fae5b]/45 hover:bg-[#12141b]/95 transition-all duration-300 flex items-start space-x-4 group shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-[#1fae5b]/10 border border-[#1fae5b]/20 flex items-center justify-center text-[#5fe396] flex-shrink-0 group-hover:bg-[#1fae5b] group-hover:text-white group-hover:shadow-[0_0_15px_rgba(31,174,91,0.4)] transition-all duration-300 shadow-inner">
              <WhatsAppIcon size={20} />
            </div>
            <div className="space-y-1">
              <h5 className="font-sans font-bold text-[10px] text-[#5fe396] uppercase tracking-widest">Secure WhatsApp</h5>
              <p className="text-xs md:text-sm text-[#c9c2ab] leading-normal group-hover:text-[#f3ecd8] transition-colors font-bold">Instant Response: {cms.contactPhone}</p>
            </div>
          </div>

        </div>

        {/* Big WhatsApp CTA Button with Green Gradient Pulse */}
        <div className="pt-2 space-y-3">
          <a
            href={`${cms.whatsappLink || "https://wa.me/+923219347471"}?text=Salam!%20I%20have%20a%20question%20regarding%20Truth%20Quran%20Academy.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center space-x-3 px-6 py-4 rounded-full bg-[#1fae5b]/10 border-2 border-[#1fae5b]/30 text-xs md:text-sm font-sans font-extrabold uppercase tracking-wider text-[#5fe396] hover:bg-[#1fae5b] hover:text-white hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(31,174,91,0.45)] transition-all duration-300"
          >
            <WhatsAppIcon size={18} />
            <span>Chat Securely on WhatsApp Now</span>
          </a>

          {/* Social Media Accounts Bar */}
          <div className="p-4 rounded-2xl bg-[#12141b]/65 border border-[#d9b45c]/15 flex items-center justify-between flex-wrap gap-3">
            <span className="text-[10px] font-sans font-bold text-[#d9b45c] uppercase tracking-wider">
              Official Social Profiles
            </span>
            <div className="flex items-center space-x-2.5">
              {(cms.facebookLink || academyContact.facebook) && (
                <a
                  href={cms.facebookLink || academyContact.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-[#1877F2]/40 bg-[#1877F2]/15 flex items-center justify-center text-[#4285F4] hover:bg-[#1877F2] hover:text-white transition-colors"
                  aria-label="Facebook Profile"
                >
                  <Facebook size={15} />
                </a>
              )}
              {(cms.instagramLink || academyContact.instagram) && (
                <a
                  href={cms.instagramLink || academyContact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-[#E4405F]/40 bg-[#E4405F]/15 flex items-center justify-center text-[#f43f5e] hover:bg-[#E4405F] hover:text-white transition-colors"
                  aria-label="Instagram Profile"
                >
                  <Instagram size={15} />
                </a>
              )}
              {(cms.linkedinLink || academyContact.linkedin) && (
                <a
                  href={cms.linkedinLink || academyContact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-[#0A66C2]/40 bg-[#0A66C2]/15 flex items-center justify-center text-[#38bdf8] hover:bg-[#0A66C2] hover:text-white transition-colors"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin size={15} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Lead Capture Form Card (Placed SECOND in DOM so on desktop it is on the Right, and on mobile below) */}
      <div className="lg:col-span-7 w-full" id="contact-form-panel">
        <div className="bg-[#12141b] border-2 border-[#d9b45c]/30 rounded-[2.5rem] p-6 md:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.85)] relative overflow-hidden group transition-all duration-500 hover:border-[#d9b45c]/60">
          
          {/* Subtle gold glow inside */}
          <div className="absolute -top-10 -right-10 w-80 h-80 bg-[#d9b45c]/5 blur-[120px] pointer-events-none rounded-full group-hover:bg-[#d9b45c]/10 transition-all duration-700" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#d9b45c]/3 blur-[90px] pointer-events-none rounded-full" />

          {isSubmitted ? (
            <div className="text-center py-12 space-y-6 animate-in fade-in zoom-in-95 duration-500" id="form-success-state">
              <div className="w-24 h-24 rounded-full bg-[#5fe396]/10 border border-[#5fe396]/35 flex items-center justify-center text-[#5fe396] mx-auto animate-bounce">
                <CheckCircle size={48} />
              </div>
              <div className="space-y-2">
                <h4 className="font-serif text-3xl text-[#f3ecd8] font-bold tracking-tight">
                  Inquiry Initiated Successfully!
                </h4>
                <p className="text-xs text-[#d9b45c] font-semibold tracking-[0.25em] uppercase">
                  Connecting to Academic Advisor...
                </p>
              </div>
              <p className="text-xs md:text-sm text-[#c9c2ab] max-w-md mx-auto leading-relaxed font-light">
                Thank you, <strong className="text-[#f2d98a]">{formData.name}</strong>. Your academic profile has been registered. We are now redirecting you to WhatsApp to instantly establish your live chat connection.
              </p>
              <div className="pt-6">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-8 py-3.5 rounded-full border-2 border-[#d9b45c]/30 text-xs font-sans font-bold text-[#c9c2ab] hover:text-[#07080b] hover:bg-[#d9b45c] hover:border-[#d9b45c] transition-all duration-300 cursor-pointer shadow-md"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-left animate-in fade-in duration-500" id="lead-capture-form">
              <div className="border-b border-[#d9b45c]/15 pb-6">
                <div className="flex items-center space-x-2 text-[#d9b45c] mb-2">
                  <Sparkles size={16} className="animate-spin" style={{ animationDuration: '8s' }} />
                  <span className="text-[11px] font-sans uppercase font-extrabold tracking-[0.25em]">Direct Enrollment Access</span>
                </div>
                <h4 className="font-serif text-2xl md:text-3xl text-[#f3ecd8] font-semibold leading-tight tracking-tight">
                  Schedule Your Free Trial Lesson
                </h4>
                <p className="text-xs md:text-sm text-[#c9c2ab] mt-2 font-light leading-relaxed">
                  Provide details below. We immediately customize your curriculum, align tutor availability, and set up your private classroom.
                </p>
              </div>

              {errorMessage && (
                <div className="p-4 bg-red-950/60 border border-red-500/40 text-red-200 rounded-2xl text-xs font-semibold leading-relaxed animate-shake">
                  ⚠️ {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Student Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-[11px] font-sans font-extrabold text-[#c9c2ab] uppercase tracking-wider">
                    Student Full Name *
                  </label>
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#d9b45c]/40 group-focus-within/input:text-[#d9b45c] transition-colors">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Zain Ali"
                      className="w-full bg-[#07080b]/90 border border-[#d9b45c]/20 focus:border-[#d9b45c] rounded-2xl pl-11 pr-4 py-4 text-xs md:text-sm text-[#f3ecd8] placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#d9b45c]/10 transition-all duration-300 shadow-inner"
                      required
                    />
                  </div>
                </div>

                {/* Student Age */}
                <div className="space-y-2">
                  <label htmlFor="age" className="block text-[11px] font-sans font-extrabold text-[#c9c2ab] uppercase tracking-wider">
                    Student Age (years) *
                  </label>
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#d9b45c]/40 group-focus-within/input:text-[#d9b45c] transition-colors">
                      <Calendar size={16} />
                    </div>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="e.g. 12"
                      min="4"
                      max="99"
                      className="w-full bg-[#07080b]/90 border border-[#d9b45c]/20 focus:border-[#d9b45c] rounded-2xl pl-11 pr-4 py-4 text-xs md:text-sm text-[#f3ecd8] placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#d9b45c]/10 transition-all duration-300 shadow-inner"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Country */}
                <div className="space-y-2">
                  <label htmlFor="country" className="block text-[11px] font-sans font-extrabold text-[#c9c2ab] uppercase tracking-wider">
                    Your Country *
                  </label>
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#d9b45c]/40 group-focus-within/input:text-[#d9b45c] transition-colors">
                      <Globe size={16} />
                    </div>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="e.g. United Kingdom"
                      className="w-full bg-[#07080b]/90 border border-[#d9b45c]/20 focus:border-[#d9b45c] rounded-2xl pl-11 pr-4 py-4 text-xs md:text-sm text-[#f3ecd8] placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#d9b45c]/10 transition-all duration-300 shadow-inner"
                      required
                    />
                  </div>
                </div>

                {/* Course Select */}
                <div className="space-y-2">
                  <label htmlFor="course" className="block text-[11px] font-sans font-extrabold text-[#c9c2ab] uppercase tracking-wider">
                    Select Quran Program
                  </label>
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#d9b45c]/40 group-focus-within/input:text-[#d9b45c] transition-colors">
                      <GraduationCap size={16} />
                    </div>
                    <select
                      id="course"
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      className="w-full bg-[#07080b]/90 border border-[#d9b45c]/20 focus:border-[#d9b45c] rounded-2xl pl-11 pr-10 py-4 text-xs md:text-sm text-[#f3ecd8] focus:outline-none focus:ring-2 focus:ring-[#d9b45c]/10 transition-all duration-300 appearance-none cursor-pointer shadow-inner"
                    >
                      {(cms.courses || []).map((course) => (
                        <option key={course.id} value={course.id} className="bg-[#12141b] text-[#f3ecd8]">
                          {course.title}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#d9b45c]">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-[11px] font-sans font-extrabold text-[#c9c2ab] uppercase tracking-wider">
                  Email Address *
                  <span className="text-[10px] text-[#c9c2ab]/50 font-normal normal-case tracking-normal ml-1"> (For scheduling confirmation)</span>
                </label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#d9b45c]/40 group-focus-within/input:text-[#d9b45c] transition-colors">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. parent@example.com"
                    className="w-full bg-[#07080b]/90 border border-[#d9b45c]/20 focus:border-[#d9b45c] rounded-2xl pl-11 pr-4 py-4 text-xs md:text-sm text-[#f3ecd8] placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#d9b45c]/10 transition-all duration-300 shadow-inner"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-[#f2d98a] to-[#d9b45c] text-[#07080b] font-sans font-extrabold text-xs md:text-sm uppercase tracking-widest shadow-[0_8px_30px_rgba(217,180,92,0.35)] hover:shadow-[0_12px_45px_rgba(217,180,92,0.55)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center justify-center space-x-3 cursor-pointer"
                >
                  <Send size={16} className="fill-current" />
                  <span>Submit Inquiry & Start Free Trial</span>
                </button>
              </div>

              <div className="flex items-start space-x-2.5 text-[10px] text-[#c9c2ab]/80 leading-relaxed justify-center text-center select-none pt-2 max-w-lg mx-auto">
                <span className="text-[#5fe396] text-xs">🛡️</span>
                <span>Your privacy is fully protected. By submitting this form, you authorize our admissions department to connect with you via email and secure WhatsApp chat.</span>
              </div>
            </form>
          )}
        </div>
      </div>

    </div>
  );
}
