import React, { useEffect } from "react";
import { CMSData, getFaviconUrl } from "../cmsStore";
import { applyFaviconToDocument } from "../utils/favicon";

interface SEOHeadProps {
  cmsData: CMSData;
  currentView: string;
  activePostId: string | null;
  categorySlug?: string | null;
  tagSlug?: string | null;
}

export default function SEOHead({ cmsData, currentView, activePostId, categorySlug, tagSlug }: SEOHeadProps) {
  useEffect(() => {
    // 1. Determine Title & Description
    const getMetaStr = (val: any, fallback: string): string => {
      if (!val) return fallback;
      if (typeof val === "string") return val;
      if (typeof val === "object" && val.metaTitle) return String(val.metaTitle);
      if (typeof val === "object" && val.metaDescription) return String(val.metaDescription);
      return fallback;
    };

    let canonicalPath = window.location.pathname;
    if (canonicalPath.length > 1 && canonicalPath.endsWith("/")) {
      canonicalPath = canonicalPath.slice(0, -1);
    }
    let canonical: string = `https://truthquranacademy.com${canonicalPath}`;
    let title: string = getMetaStr(cmsData.seoSettings?.metaTitle, "Truth Quran Academy | 1-on-1 Online Quran & Tajweed Classes");
    let description: string = getMetaStr(cmsData.seoSettings?.metaDescription, "Learn Holy Quran recitation, Tajweed rules, Hifz, and Quranic Arabic from certified native scholars in private 1-on-1 classrooms.");
    let ogTitle: string = title;
    let ogDesc: string = description;
    let ogImage: string = getMetaStr(cmsData.seoSettings?.ogImage, "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200");
    let twitterCard: string = "summary_large_image";
    let schemaJson: any = null;

    if (currentView === "home") {
      canonical = "https://truthquranacademy.com";
    } else if (currentView === "about") {
      title = "About Truth Quran Academy | Certified Online Quran Scholars & Ijazah Tutors";
      description = "Discover Truth Quran Academy's mission, certified teachers holding traditional Ijazah credentials, 1-on-1 personalized methodology, and female Quran tutors.";
      canonical = "https://truthquranacademy.com/about";
      ogTitle = title;
      ogDesc = description;
    } else if (currentView === "courses") {
      title = "Online Quran Courses & Structured Programs | Truth Quran Academy";
      description = "Explore our comprehensive online Quran curriculums: Noorani Qaida for beginners, Tajweed Intensive recitation mastery, and private Quran Hifz pathways.";
      canonical = activePostId ? `https://truthquranacademy.com/courses/${activePostId}` : "https://truthquranacademy.com/courses";
      ogTitle = title;
      ogDesc = description;
    } else if (currentView === "noorani-qaida") {
      title = "Noorani Qaida Course for Beginners & Kids | Truth Quran Academy";
      description = "Master Arabic alphabet pronunciation, letter joining, and foundational phonetics with certified 1-on-1 tutors in our interactive Noorani Qaida course.";
      canonical = "https://truthquranacademy.com/noorani-qaida";
      ogTitle = title;
      ogDesc = description;
    } else if (currentView === "kids-classes") {
      title = "Online Quran Classes for Kids & Sisters | Truth Quran Academy";
      description = "Specialized 1-on-1 Quran lessons for young children and sisters with patient, certified female tutors using interactive whiteboards and visual aids.";
      canonical = "https://truthquranacademy.com/kids-classes";
      ogTitle = title;
      ogDesc = description;
    } else if (currentView === "fees") {
      title = "Affordable Monthly Quran Tuition Fees & Pricing Plans | Truth Quran Academy";
      description = "Transparent, affordable monthly Quran class fees starting from $30/month. Includes 1-on-1 classes, free trial session, custom syllabus, and flexible schedules.";
      canonical = "https://truthquranacademy.com/fees";
      ogTitle = title;
      ogDesc = description;
    } else if (currentView === "videos") {
      title = "Online Quran & Tajweed Video Lessons Library | Truth Quran Academy";
      description = "Watch recorded video lessons, Tajweed pronunciation guides, Makharij tutorials, and inspirational Quranic lectures from our certified scholars.";
      canonical = "https://truthquranacademy.com/videos";
      ogTitle = title;
      ogDesc = description;
    } else if (currentView === "download") {
      title = "Download Noorani Qaida & Quran Paras (1-30) PDF | Truth Quran Academy";
      description = "Free downloadable high-quality PDF files for Noorani Qaida, Tajweed charts, and all 30 Paras of the Holy Quran for offline reading and study.";
      canonical = "https://truthquranacademy.com/download";
      ogTitle = title;
      ogDesc = description;
    } else if (currentView === "contact") {
      title = "Contact Truth Quran Academy | Book Free 1-on-1 Quran Trial Class";
      description = "Get in touch with Truth Quran Academy. Book your free 1-on-1 trial class via WhatsApp (+92 321 9347471) or email us today.";
      canonical = "https://truthquranacademy.com/contact";
      ogTitle = title;
      ogDesc = description;
    } else if (currentView === "category" || (currentView === "blog" && categorySlug)) {
      const rawCat = categorySlug || "tajweed";
      const catName = rawCat.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
      title = `${catName} Articles & Quran Guides | Truth Quran Academy`;
      description = `Read all insightful Islamic articles, study notes, and Tajweed guides categorized under ${catName} at Truth Quran Academy.`;
      canonical = `https://truthquranacademy.com/category/${rawCat}`;
      ogTitle = title;
      ogDesc = description;
    } else if (currentView === "tag" || (currentView === "blog" && tagSlug)) {
      const rawTag = tagSlug || "beginners";
      const tagName = rawTag.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
      title = `${tagName} - Articles & Topic Guides | Truth Quran Academy`;
      description = `Explore all articles and Quran lessons tagged with #${tagName} at Truth Quran Academy.`;
      canonical = `https://truthquranacademy.com/tag/${rawTag}`;
      ogTitle = title;
      ogDesc = description;
    } else if (currentView === "wp-admin") {
      title = "WordPress Administration Panel ‹ Truth Quran Academy";
      description = "Administrative Control Center and Content Management System for Truth Quran Academy";
      canonical = "https://truthquranacademy.com/wp-admin";
      ogTitle = title;
      ogDesc = description;
    } else if (currentView === "404") {
      title = "Page Not Found (404) | Truth Quran Academy";
      description = "The page you requested could not be found. Return to Truth Quran Academy homepage or explore our online Quran courses and pricing plans.";
      ogTitle = title;
      ogDesc = description;
    } else if (currentView === "blog") {
      title = "Quranic Studies, Tajweed Guides & Hifz Blog | Truth Quran Academy";
      description = "Read educational articles, Tajweed pronunciation breakdowns, Hifz retention techniques, and Islamic studies guides written by certified scholars.";
      canonical = "https://truthquranacademy.com/blog";
      ogTitle = title;
      ogDesc = description;
    } else if (currentView === "blog-post" && activePostId) {
      const posts = cmsData.blogPosts || [];
      const post = posts.find(p => 
        p.id === activePostId || 
        p.slug === activePostId || 
        (p.slug && activePostId && p.slug.toLowerCase() === activePostId.toLowerCase()) ||
        (p.id && activePostId && p.id.toLowerCase() === activePostId.toLowerCase())
      );
      if (post) {
        title = post.metaTitle || post.seoTitle || `${post.title} | Truth Quran Academy`;
        description = post.metaDescription || post.excerpt || description;
        canonical = post.canonicalUrl || `https://truthquranacademy.com/blog/${post.slug || post.id}`;
        ogTitle = post.ogTitle || title;
        ogDesc = post.ogDescription || description;
        ogImage = post.ogImage || post.coverImage || ogImage;
        twitterCard = post.twitterCard || twitterCard;

        if (post.customSchemaJson) {
          try {
            schemaJson = JSON.parse(post.customSchemaJson);
          } catch (e) {
            schemaJson = null;
          }
        }

        if (!schemaJson) {
          schemaJson = {
            "@context": "https://schema.org",
            "@type": post.schemaType || "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.coverImage,
            "datePublished": post.date || post.publishDate || "2026-07-20",
            "author": {
              "@type": "Person",
              "name": post.author?.name || "Muhammad Zain"
            },
            "publisher": {
              "@type": "EducationalOrganization",
              "name": "Truth Quran Academy",
              "url": "https://truthquranacademy.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://truthquranacademy.com/logo.png",
                "width": 512,
                "height": 512
              }
            }
          };
        }
      }
    } else {
      // General Organization & WebSite schema
      schemaJson = {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": "Truth Quran Academy",
        "url": "https://truthquranacademy.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://truthquranacademy.com/logo.png",
          "width": 512,
          "height": 512
        },
        "image": "https://truthquranacademy.com/logo.png",
        "description": description,
        "email": cmsData.contactEmail || "muhammadzain92624@gmail.com",
        "telephone": cmsData.contactPhone || "+92 321 9347471",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": cmsData.contactAddress || "Altaf Colony, Ranjar Head Quarter, Lahore Cantt, Pakistan",
          "addressLocality": "Lahore",
          "addressCountry": "PK"
        },
        "sameAs": [
          cmsData.facebookLink || "https://www.facebook.com/truthquran?mibextid=ZbWKwL",
          cmsData.instagramLink || "https://www.instagram.com/truth_quran_786?igsh=MTM1MmFvc3dtMHFhMQ==",
          cmsData.linkedinLink || "https://www.linkedin.com/in/truth-quran-online-quran-academy-65688b423?utm_source=share_via&utm_content=profile&utm_medium=member_android"
        ].filter(Boolean)
      };
    }

    // 2. Set document title
    document.title = title;

    // Helper function to update or create meta tags
    const setMetaTag = (nameAttr: string, value: string, content: string) => {
      if (!content) return;
      let element = document.querySelector(`meta[${nameAttr}="${value}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(nameAttr, value);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Helper for canonical link
    const setCanonicalLink = (href: string) => {
      let element = document.querySelector(`link[rel="canonical"]`) as HTMLLinkElement;
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", "canonical");
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    // Helper for JSON-LD script
    const setSchemaScript = (jsonObj: any) => {
      let element = document.getElementById("seo-schema-script") as HTMLScriptElement;
      if (!element) {
        element = document.createElement("script");
        element.id = "seo-schema-script";
        element.setAttribute("type", "application/ld+json");
        document.head.appendChild(element);
      }
      element.textContent = JSON.stringify(jsonObj, null, 2);
    };

    // Clean code helper (handles raw code, key=value, or <meta ... content="VALUE" />)
    const cleanVerificationCode = (val?: string): string => {
      if (!val) return "";
      const str = String(val).trim();
      const contentMatch = str.match(/content=["']([^"']+)["']/i);
      if (contentMatch && contentMatch[1]) return contentMatch[1].trim();
      if (str.includes("google-site-verification=")) {
        return str.replace(/^google-site-verification=/, "").trim();
      }
      return str;
    };

    // 3. Inject Meta Tags
    setMetaTag("name", "description", description);
    setMetaTag("name", "keywords", getMetaStr(cmsData.seoSettings?.metaKeywords, "online quran class, tajweed rules, hifz course, quran tutor"));
    const isNoIndex = currentView === "wp-admin" || currentView === "404";
    setMetaTag("name", "robots", isNoIndex ? "noindex, nofollow" : getMetaStr(cmsData.seoSettings?.robotsDirective, "index, follow"));

    // Google Search Console Verification code
    const rawGsc = cmsData.integrations?.googleSiteVerification || cmsData.integrations?.gscId;
    const gscCode = cleanVerificationCode(rawGsc);
    if (gscCode && gscCode !== "TRUTH_QURAN_GSC_VERIFY_2026") {
      setMetaTag("name", "google-site-verification", gscCode);
    } else {
      const existingGsc = document.querySelector('meta[name="google-site-verification"]');
      if (existingGsc) {
        existingGsc.remove();
      }
    }

    // Bing Webmaster Tools Verification code
    const rawBing = cmsData.integrations?.bingSiteVerification;
    const bingCode = cleanVerificationCode(rawBing);
    if (bingCode) {
      setMetaTag("name", "msvalidate.01", bingCode);
    }

    // Google Analytics (GA4)
    if (cmsData.integrations?.ga4Id) {
      const gaId = cleanVerificationCode(cmsData.integrations.ga4Id);
      if (gaId) {
        setMetaTag("name", "google-analytics-id", gaId);
      }
    }

    // Google Tag Manager
    if (cmsData.integrations?.gtmId) {
      const gtmId = cleanVerificationCode(cmsData.integrations.gtmId);
      if (gtmId) {
        setMetaTag("name", "google-tag-manager-id", gtmId);
      }
    }

    // Facebook Pixel
    if (cmsData.integrations?.fbPixelId) {
      const fbId = cleanVerificationCode(cmsData.integrations.fbPixelId);
      if (fbId) {
        setMetaTag("name", "facebook-pixel-id", fbId);
      }
    }

    // Open Graph
    setMetaTag("property", "og:title", ogTitle);
    setMetaTag("property", "og:description", ogDesc);
    setMetaTag("property", "og:image", ogImage);
    setMetaTag("property", "og:url", canonical);
    setMetaTag("property", "og:type", currentView === "blog-post" ? "article" : "website");
    setMetaTag("property", "og:site_name", "Truth Quran Academy");

    // Twitter Cards
    setMetaTag("name", "twitter:card", twitterCard);
    setMetaTag("name", "twitter:title", ogTitle);
    setMetaTag("name", "twitter:description", ogDesc);
    setMetaTag("name", "twitter:image", ogImage);

    // Canonical
    setCanonicalLink(canonical);

    // Dynamic Site Favicon (<link rel="icon" ... />) across all pages
    const activeFaviconUrl = getFaviconUrl(cmsData);
    applyFaviconToDocument(activeFaviconUrl);

    // Schema
    if (schemaJson) {
      setSchemaScript(schemaJson);
    }

  }, [cmsData, currentView, activePostId]);

  return null;
}
