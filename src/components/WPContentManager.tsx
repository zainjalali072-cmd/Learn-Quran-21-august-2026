import React, { useState, useMemo } from "react";
import { navigateToRoute } from "../utils/router";
import { 
  CMSData, 
  WPTeacher, 
  BlogPost, 
  Course, 
  WPMedia, 
  WPVideo,
  WPComment,
  saveCMSData,
  submitUrlsForIndexing
} from "../cmsStore";
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  Copy, 
  Eye, 
  Check, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle,
  Tag, 
  Folder, 
  Star, 
  HelpCircle, 
  Video, 
  Award, 
  DollarSign, 
  Layers, 
  Image as ImageIcon,
  Users,
  Compass,
  Palette,
  Settings as SettingsIcon,
  Wrench,
  FileCode,
  ArrowUpDown,
  BookOpen
} from "lucide-react";
import WPSEOEditor from "./WPSEOEditor";
import WPAnalytics from "./WPAnalytics";
import { WPMediaLibraryModal } from "./WPMediaLibraryModal";

interface WPContentManagerProps {
  cmsData: CMSData;
  onSave: (updatedData: CMSData, customMsg?: string) => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

export default function WPContentManager({ cmsData, onSave, activeTab, setActiveTab }: WPContentManagerProps) {
  // Navigation & Subview controls
  const [subView, setSubView] = useState<"all" | "add" | "categories" | "tags">("all");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Table Controls
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [authorFilter, setAuthorFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Selection & Bulk actions
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState("");

  // Inline Quick Edit State
  const [quickEditingId, setQuickEditingId] = useState<string | null>(null);
  const [quickEditFields, setQuickEditFields] = useState<any>({});

  // Taxonomy states (for Categories and Tags manager)
  const [newTaxName, setNewTaxName] = useState("");
  const [newTaxSlug, setNewTaxSlug] = useState("");
  const [newTaxDesc, setNewTaxDesc] = useState("");

  // Add / Edit form state
  const [formData, setFormData] = useState<any>({});

  // Advanced Media Manager Modal states
  const [isImageManagerOpen, setIsImageManagerOpen] = useState(false);
  const [currentImageEditField, setCurrentImageEditField] = useState<string | null>(null);

  // Reset page when tab/subview changes
  React.useEffect(() => {
    setCurrentPage(1);
    setSelectedRowIds([]);
    setSearchQuery("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setAuthorFilter("all");
    setDateFilter("all");
    setQuickEditingId(null);
  }, [activeTab, subView]);

  // Dynamic SEO Scoring Helper
  const calculateDynamicPostScore = (post: any): number => {
    let score = 30; // base score

    if (post.focusKeyword && post.focusKeyword.trim().length > 0) {
      score += 15;
      const kw = post.focusKeyword.toLowerCase();
      
      // Keyword in Title
      if (post.title && post.title.toLowerCase().includes(kw)) {
        score += 15;
      }
      // Keyword in meta desc
      if (post.metaDescription && post.metaDescription.toLowerCase().includes(kw)) {
        score += 10;
      }
      // Keyword in Slug
      if (post.slug && post.slug.toLowerCase().includes(kw)) {
        score += 10;
      }
    }

    if (post.metaDescription) {
      const descLen = post.metaDescription.length;
      if (descLen >= 100 && descLen <= 160) {
        score += 10;
      } else if (descLen > 0) {
        score += 5;
      }
    }

    const stripped = (post.content || "").replace(/<[^>]*>/g, "");
    const words = stripped.trim() ? stripped.trim().split(/\s+/).filter(Boolean).length : 0;
    if (words >= 600) {
      score += 15;
    } else if (words >= 300) {
      score += 10;
    } else if (words > 0) {
      score += 5;
    }

    if (post.internalLinksCount && post.internalLinksCount > 0) score += 5;
    if (post.externalLinksCount && post.externalLinksCount > 0) score += 5;
    if (post.imageAltText && post.imageAltText.trim().length > 0) score += 5;
    if (post.schemaType && post.schemaType !== "None") score += 5;

    return Math.min(100, score);
  };

  // Model-specific configurations
  const currentConfig = useMemo(() => {
    switch (activeTab) {
      case "posts":
        return {
          label: "Blog Posts",
          singular: "Post",
          dataKey: "blogPosts" as const,
          hasSEO: true
        };
      case "pages":
        return {
          label: "Pages (Homepage Sections)",
          singular: "Page",
          dataKey: "sectionsOrder" as const,
          hasSEO: false
        };
      case "courses":
        return {
          label: "Courses & Programs",
          singular: "Course",
          dataKey: "courses" as const,
          hasSEO: false
        };
      case "media":
        return {
          label: "Media Library",
          singular: "Media File",
          dataKey: "mediaLibrary" as const,
          hasSEO: false
        };
      case "teachers":
        return {
          label: "Teachers & Tutors",
          singular: "Teacher",
          dataKey: "teachers" as const,
          hasSEO: false
        };
      case "testimonials":
        return {
          label: "Student Testimonials",
          singular: "Testimonial",
          dataKey: "testimonials" as const,
          hasSEO: false
        };
      case "faqs":
        return {
          label: "FAQs",
          singular: "FAQ",
          dataKey: "faqs" as const,
          hasSEO: false
        };
      case "videos":
        return {
          label: "Video Manager",
          singular: "Video",
          dataKey: "videos" as const,
          hasSEO: false
        };
      case "services":
        return {
          label: "Why Us / Services",
          singular: "Service",
          dataKey: "whyUs" as const,
          hasSEO: false
        };
      case "pricing":
        return {
          label: "Pricing Plans",
          singular: "Pricing Plan",
          dataKey: "pricingPlans" as const,
          hasSEO: false
        };
      default:
        return null;
    }
  }, [activeTab]);

  // Construct table items list
  const rawItems = useMemo<any[]>(() => {
    if (!currentConfig) return [];
    
    // Pages is a virtual array derived from sectionsOrder & sectionsVisibility
    if (activeTab === "pages") {
      const order = cmsData.sectionsOrder || [];
      const visibility = cmsData.sectionsVisibility || {};
      return order.map((sectionId, idx) => ({
        id: sectionId,
        title: sectionId.replace(/([A-Z])/g, " $1").trim().replace(/^\w/, (c) => c.toUpperCase()) + " Section",
        slug: sectionId,
        order: idx + 1,
        status: visibility[sectionId] !== false ? "published" : "draft",
        date: "2026-07-20",
        description: `Visual homepage content module mapping active layout hierarchy.`
      }));
    }

    return (cmsData as any)[currentConfig.dataKey] || [];
  }, [cmsData, currentConfig, activeTab]);

  // Collect distinct authors, categories, dates for filtering
  const distinctFilters = useMemo(() => {
    const categories = new Set<string>();
    const authors = new Set<string>();
    const dates = new Set<string>();

    rawItems.forEach(item => {
      if (item.category) categories.add(item.category);
      if (item.author?.name) authors.add(item.author.name);
      if (item.date) {
        // extract month/year
        const parts = item.date.split(" ");
        if (parts.length >= 2) {
          dates.add(`${parts[0]} ${parts[parts.length - 1]}`);
        } else {
          dates.add(item.date);
        }
      }
    });

    return {
      categories: Array.from(categories),
      authors: Array.from(authors),
      dates: Array.from(dates)
    };
  }, [rawItems]);

  // Apply filters & Search
  const filteredItems = useMemo(() => {
    return rawItems.filter(item => {
      // 1. Search Query
      const titleText = (item.title || item.name || item.question || "").toLowerCase();
      const excerptText = (item.excerpt || item.quote || item.bio || item.description || "").toLowerCase();
      const focusKeywordText = (item.focusKeyword || "").toLowerCase();
      const matchesSearch = titleText.includes(searchQuery.toLowerCase()) || 
                            excerptText.includes(searchQuery.toLowerCase()) ||
                            focusKeywordText.includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // 2. Status Filter
      if (statusFilter !== "all") {
        if (item.status !== statusFilter) return false;
      }

      // 3. Category Filter
      if (categoryFilter !== "all") {
        if (item.category !== categoryFilter) return false;
      }

      // 4. Author Filter
      if (authorFilter !== "all") {
        if (item.author?.name !== authorFilter) return false;
      }

      // 5. Date Filter
      if (dateFilter !== "all") {
        const itemDateStr = item.date || "";
        if (!itemDateStr.includes(dateFilter.split(" ")[0])) return false;
      }

      return true;
    });
  }, [rawItems, searchQuery, statusFilter, categoryFilter, authorFilter, dateFilter]);

  // Get status breakdown counts
  const statusCounts = useMemo(() => {
    const counts = { all: rawItems.length, published: 0, draft: 0, scheduled: 0, trash: 0 };
    rawItems.forEach(item => {
      const s = item.status || "published";
      if (s === "published" || s === "approved") counts.published++;
      else if (s === "draft" || s === "pending") counts.draft++;
      else if (s === "scheduled") counts.scheduled++;
      else if (s === "trash" || s === "spam") counts.trash++;
    });
    return counts;
  }, [rawItems]);

  // Pagination Slice
  const paginatedItems = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredItems, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));

  // Bulk Actions dispatcher
  const handleApplyBulkAction = () => {
    if (!bulkAction || selectedRowIds.length === 0) return;

    if (activeTab === "pages") {
      alert("Bulk actions are disabled for static layout configuration pages.");
      return;
    }

    const key = currentConfig?.dataKey;
    if (!key) return;

    let updatedList = [...((cmsData as any)[key] || [])];

    if (bulkAction === "trash") {
      updatedList = updatedList.map(item => 
        selectedRowIds.includes(item.id) ? { ...item, status: "trash" } : item
      );
    } else if (bulkAction === "delete") {
      if (window.confirm(`Are you sure you want to permanently delete these ${selectedRowIds.length} items?`)) {
        updatedList = updatedList.filter(item => !selectedRowIds.includes(item.id));
      } else {
        return;
      }
    } else if (bulkAction === "draft") {
      updatedList = updatedList.map(item => 
        selectedRowIds.includes(item.id) ? { ...item, status: "draft" } : item
      );
    } else if (bulkAction === "publish") {
      updatedList = updatedList.map(item => 
        selectedRowIds.includes(item.id) ? { ...item, status: "published" } : item
      );
    } else if (bulkAction === "duplicate") {
      const duplicates: any[] = [];
      updatedList.forEach(item => {
        if (selectedRowIds.includes(item.id)) {
          duplicates.push({
            ...item,
            id: `dup-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            title: `${item.title || item.name} (Copy)`,
            name: item.name ? `${item.name} (Copy)` : undefined,
            slug: item.slug ? `${item.slug}-copy` : undefined,
            status: "draft",
            date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
          });
        }
      });
      updatedList = [...duplicates, ...updatedList];
    }

    onSave({ ...cmsData, [key]: updatedList }, `✅ Bulk action "${bulkAction}" applied successfully to ${selectedRowIds.length} item(s)!`);
    setSelectedRowIds([]);
    setBulkAction("");
  };

  // Hover actions helpers
  const handleTrashItem = (id: string) => {
    if (activeTab === "pages") {
      alert("Static core layout modules cannot be deleted.");
      return;
    }

    const key = currentConfig?.dataKey;
    if (!key) return;

    const items = (cmsData as any)[key] || [];
    const updated = items.map((item: any) => 
      item.id === id ? { ...item, status: "trash" } : item
    );
    onSave({ ...cmsData, [key]: updated }, "✅ Item moved to trash successfully.");
  };

  const handleRestoreItem = (id: string) => {
    const key = currentConfig?.dataKey;
    if (!key) return;

    const items = (cmsData as any)[key] || [];
    const updated = items.map((item: any) => 
      item.id === id ? { ...item, status: "published" } : item
    );
    onSave({ ...cmsData, [key]: updated }, "✅ Item restored live to website!");
  };

  const handlePermanentDeleteItem = (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this item from the database? This is irreversible.")) {
      const key = currentConfig?.dataKey;
      if (!key) return;

      const items = (cmsData as any)[key] || [];
      const updated = items.filter((item: any) => item.id !== id);
      onSave({ ...cmsData, [key]: updated }, "✅ Item permanently deleted from database!");
    }
  };

  const handleDuplicateItem = (id: string) => {
    if (activeTab === "pages") {
      alert("Static homepage layout sections cannot be duplicated.");
      return;
    }

    const key = currentConfig?.dataKey;
    if (!key) return;

    const items = (cmsData as any)[key] || [];
    const target = items.find((item: any) => item.id === id);
    if (!target) return;

    const duplicate = {
      ...target,
      id: `dup-${Date.now()}`,
      title: target.title ? `${target.title} (Copy)` : undefined,
      name: target.name ? `${target.name} (Copy)` : undefined,
      slug: target.slug ? `${target.slug}-copy` : undefined,
      status: "draft",
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      publishDate: new Date().toISOString().split("T")[0]
    };

    onSave({ ...cmsData, [key]: [duplicate, ...items] }, "✅ Item duplicated successfully as Draft!");
  };

  // Launch Full Editor view
  const handleEditItem = (id: string) => {
    if (activeTab === "posts") {
      setEditingItemId(id);
      setSubView("add");
    } else {
      const key = currentConfig?.dataKey;
      if (!key) return;

      if (activeTab === "pages") {
        // Find page item details
        const visibility = cmsData.sectionsVisibility || {};
        const p = {
          id,
          title: id.replace(/([A-Z])/g, " $1").trim().replace(/^\w/, (c) => c.toUpperCase()) + " Section",
          slug: id,
          status: visibility[id] !== false ? "published" : "draft",
          description: `Visual homepage content module mapping active layout hierarchy.`
        };
        setFormData(p);
        setEditingItemId(id);
        setSubView("add");
      } else {
        const items = (cmsData as any)[key] || [];
        const item = items.find((i: any) => i.id === id);
        if (item) {
          setFormData({ ...item });
          setEditingItemId(id);
          setSubView("add");
        }
      }
    }
  };

  // Create clean blank form for Add New
  const handleAddNewItemTrigger = () => {
    setEditingItemId(null);
    
    if (activeTab === "posts") {
      setSubView("add");
    } else {
      // Setup blank default schema based on active content type
      let blankFields: any = {};
      if (activeTab === "courses") {
        blankFields = { title: "", arabicGlyph: "ق", tag: "Basic", description: "", difficulty: "Beginners", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80" };
      } else if (activeTab === "teachers") {
        blankFields = { name: "", role: "Instructor", bio: "", photo: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=300", rating: 5, experience: "5 Years", status: "draft", publishDate: new Date().toISOString().split("T")[0], category: "Quran Study", tags: [] };
      } else if (activeTab === "testimonials") {
        blankFields = { name: "", quote: "", rating: 5, country: "United Kingdom", status: "published" };
      } else if (activeTab === "faqs") {
        blankFields = { question: "", answer: "", status: "published" };
      } else if (activeTab === "videos") {
        blankFields = { title: "", description: "", category: "Tajweed Rules", duration: "10:00", thumbnail: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=300", embedId: "", enabled: true, pages: ["home"], status: "published", publishDate: new Date().toISOString().split("T")[0] };
      } else if (activeTab === "services") {
        blankFields = { title: "", description: "", iconName: "Award", status: "published" };
      } else if (activeTab === "pricing") {
        blankFields = { name: "", price: "$49", period: "Monthly", features: ["1-on-1 private rooms", "Certified tutors", "Flexible hours"], status: "published" };
      } else if (activeTab === "media") {
        blankFields = { title: "", url: "", type: "image/jpeg", size: "150 KB", dimensions: "1200x800", date: new Date().toISOString().split("T")[0] };
      }

      setFormData(blankFields);
      setSubView("add");
    }
  };

  // Save Add / Edit form
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const key = currentConfig?.dataKey;
    if (!key) return;

    if (activeTab === "pages") {
      // Save static pages
      const nextVis = { ...cmsData.sectionsVisibility, [formData.id]: formData.status === "published" };
      onSave({ ...cmsData, sectionsVisibility: nextVis }, `✅ Page "${formData.title}" visibility updated!`);
      setSubView("all");
      setEditingItemId(null);
      return;
    }

    let items = [...((cmsData as any)[key] || [])];

    if (editingItemId) {
      // Update
      items = items.map((item: any) => 
        item.id === editingItemId ? { ...item, ...formData } : item
      );
    } else {
      // Insert New
      const newId = `${activeTab.slice(0,3)}-${Date.now()}`;
      items = [{ id: newId, ...formData, status: formData.status || "published", date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }), publishDate: new Date().toISOString().split("T")[0] }, ...items];
    }

    const itemLabel = currentConfig?.singular || "Item";
    const actionLabel = editingItemId ? "updated" : "created & published";
    onSave({ ...cmsData, [key]: items }, `✅ ${itemLabel} "${formData.title || formData.name || formData.question || ''}" ${actionLabel} & submitted to Google Indexing API!`);

    // Instant Google Search Console & IndexNow Auto-Ping
    const domain = "https://truthquranacademy.com";
    let targetUrl = "";
    if (activeTab === "posts") {
      targetUrl = `${domain}/blog/${formData.slug || editingItemId || "new-post"}`;
    } else if (activeTab === "courses") {
      targetUrl = `${domain}/${formData.id || editingItemId || "new-course"}`;
    }

    if (targetUrl) {
      submitUrlsForIndexing([targetUrl], "URL_UPDATED", ["google", "indexnow"]).catch(console.error);
    }

    setSubView("all");
    setEditingItemId(null);
  };

  // Inline Quick Edit Actions
  const handleStartQuickEdit = (item: any) => {
    setQuickEditingId(item.id);
    setQuickEditFields({
      title: item.title || item.name || item.question || "",
      slug: item.slug || item.id,
      status: item.status || "published",
      date: item.date || "",
      category: item.category || "",
      tags: item.tags ? item.tags.join(", ") : ""
    });
  };

  const handleSaveQuickEdit = (itemId: string) => {
    if (activeTab === "pages") {
      const nextVis = { ...cmsData.sectionsVisibility, [itemId]: quickEditFields.status === "published" };
      onSave({ ...cmsData, sectionsVisibility: nextVis }, "✅ Page section quick edit saved!");
      setQuickEditingId(null);
      return;
    }

    const key = currentConfig?.dataKey;
    if (!key) return;

    const items = [...((cmsData as any)[key] || [])];
    const updated = items.map((item: any) => {
      if (item.id === itemId) {
        const nextItem = { 
          ...item, 
          status: quickEditFields.status,
          date: quickEditFields.date
        };
        if (item.title !== undefined) nextItem.title = quickEditFields.title;
        else if (item.name !== undefined) nextItem.name = quickEditFields.title;
        else if (item.question !== undefined) nextItem.question = quickEditFields.title;

        if (item.slug !== undefined) nextItem.slug = quickEditFields.slug;
        if (item.category !== undefined) nextItem.category = quickEditFields.category;
        if (item.tags !== undefined) {
          nextItem.tags = quickEditFields.tags.split(",").map((t: string) => t.trim()).filter(Boolean);
        }
        return nextItem;
      }
      return item;
    });

    onSave({ ...cmsData, [key]: updated }, "✅ Quick edit changes saved successfully!");
    setQuickEditingId(null);
  };

  // Row selection checkbox state helpers
  const handleSelectAllRows = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRowIds(paginatedItems.map(i => i.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRowIds(prev => [...prev, id]);
    } else {
      setSelectedRowIds(prev => prev.filter(rId => rId !== id));
    }
  };

  // Taxonomy Helpers (Adding Category or Tag)
  const handleAddTaxonomy = (type: "category" | "tag") => {
    if (!newTaxName.trim()) return;
    const slug = newTaxSlug.trim() || newTaxName.toLowerCase().replace(/\s+/g, "-");
    
    // Create simulated post to house this category/tag so that it shows up in count metrics
    const newPostId = `tax-trigger-${Date.now()}`;
    const mockPost: BlogPost = {
      id: newPostId,
      title: `Simulated placeholder for taxonomy tag ${newTaxName}`,
      excerpt: newTaxDesc || `System taxonomy anchor representation.`,
      status: "draft",
      coverImage: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=400",
      category: type === "category" ? newTaxName : "Tajweed Rules",
      tags: type === "tag" ? [newTaxName] : [],
      author: { name: "System Admin", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde", role: "WP System" },
      date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      content: "Taxonomy simulation anchor.",
      readTime: "1 min read"
    };

    onSave({
      ...cmsData,
      blogPosts: [mockPost, ...cmsData.blogPosts]
    });

    setNewTaxName("");
    setNewTaxSlug("");
    setNewTaxDesc("");
    alert(`Success: Standard WordPress dynamic ${type} [${newTaxName}] created and integrated!`);
  };

  const taxonomyList = useMemo(() => {
    const map = new Map<string, { name: string; slug: string; description: string; count: number }>();
    
    if (subView === "categories") {
      // Default standard categories
      const defaults = [
        { name: "Tajweed Rules", slug: "tajweed-rules", description: "Learn articulation points (Makharij) and recitation rules." },
        { name: "Hifz Guide", slug: "hifz-guide", description: "Advice and traditional methodologies for Quran memorization." },
        { name: "Quranic Arabic", slug: "quranic-arabic", description: "Grammar, syntax, and classical vocabulary studies." },
        { name: "Parenting Guide", slug: "parenting-guide", description: "How to guide young children into Quran habits." },
        { name: "Academy Lectures", slug: "academy-lectures", description: "Transcripts of global webinars and academic notes." }
      ];
      defaults.forEach(d => map.set(d.name, { ...d, count: 0 }));

      // dynamically read counts and custom ones from posts
      cmsData.blogPosts.forEach(post => {
        if (!post.category) return;
        const existing = map.get(post.category);
        if (existing) {
          existing.count++;
        } else {
          map.set(post.category, {
            name: post.category,
            slug: post.category.toLowerCase().replace(/\s+/g, "-"),
            description: "Custom user-generated categories",
            count: 1
          });
        }
      });
    } else if (subView === "tags") {
      const defaults = [
        { name: "Hifz", slug: "hifz", description: "Topics detailing Hifz tracks." },
        { name: "Quran Memorization", slug: "quran-memorization", description: "Retention memory methods." },
        { name: "Spiritual Tips", slug: "spiritual-tips", description: "Motivation and Islamic theology reminders." },
        { name: "Phonetics", slug: "phonetics", description: "Microscopic mouth articulation markers." },
        { name: "Makharij", slug: "makharij", description: "Where letter sounds emerge." }
      ];
      defaults.forEach(d => map.set(d.name, { ...d, count: 0 }));

      cmsData.blogPosts.forEach(post => {
        if (!post.tags) return;
        post.tags.forEach(t => {
          const existing = map.get(t);
          if (existing) {
            existing.count++;
          } else {
            map.set(t, {
              name: t,
              slug: t.toLowerCase().replace(/\s+/g, "-"),
              description: "Custom tagging keyword descriptor",
              count: 1
            });
          }
        });
      });
    }

    return Array.from(map.values());
  }, [cmsData.blogPosts, subView]);

  const handleDeleteTaxonomy = (name: string) => {
    if (window.confirm(`Are you sure you want to delete this taxonomy item?`)) {
      // remove simulated posts holding this category or rename tags
      let nextPosts = [...cmsData.blogPosts];
      if (subView === "categories") {
        nextPosts = nextPosts.filter(p => !p.id.startsWith("tax-trigger") || p.category !== name);
        nextPosts = nextPosts.map(p => p.category === name ? { ...p, category: "Uncategorized" } : p);
      } else {
        nextPosts = nextPosts.filter(p => !p.id.startsWith("tax-trigger") || !p.tags?.includes(name));
        nextPosts = nextPosts.map(p => p.tags ? { ...p, tags: p.tags.filter(t => t !== name) } : p);
      }
      onSave({ ...cmsData, blogPosts: nextPosts });
    }
  };


  // SPECIAL VIEWS RENDERING: COMMENTS, RANK MATH, CUSTOMIZER, SETTINGS, TOOLS, THEME
  if (activeTab === "comments") {
    // MODERATION INTERFACE FOR LEADS & COMMENTS
    return (
      <div className="space-y-6 text-left">
        <div className="flex justify-between items-center pb-2 border-b border-[#d9b45c]/15">
          <div>
            <h2 className="font-serif text-xl text-[#f3ecd8] font-bold">Comments Moderation & Inquiry Leads</h2>
            <p className="text-xs text-[#c9c2ab] mt-1">Review contact form entries, lesson trial requests, and blog reader feedback comments.</p>
          </div>
          <button 
            onClick={() => {
              // Export CSV
              const headers = ["ID", "Name", "Email", "Age", "Country", "Course", "Message", "Date", "Status", "Type"];
              const rows = cmsData.comments.map(c => [
                c.id, c.name, c.email, c.age || "", c.country || "", c.course || "", `"${c.message.replace(/"/g, '""')}"`, c.date, c.status, c.type
              ]);
              const content = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
              const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.setAttribute("href", url);
              link.setAttribute("download", "truth_quran_academy_leads.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="px-4 py-2 bg-[#d9b45c] text-black font-sans font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#f2d98a] transition-all"
          >
            Export leads to CSV
          </button>
        </div>

        <div className="bg-[#12141b]/90 border border-[#d9b45c]/15 rounded-xl overflow-hidden">
          <div className="p-4 bg-[#12141b] border-b border-[#d9b45c]/10 text-xs font-sans uppercase font-extrabold text-[#d9b45c] tracking-widest">
            Inbox Queue ({cmsData.comments.length} total entries)
          </div>

          <div className="divide-y divide-[#d9b45c]/10">
            {cmsData.comments.map((comment: WPComment) => (
              <div key={comment.id} className={`p-5 transition-all ${comment.status === "pending" ? "bg-[#d9b45c]/3" : ""}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-full bg-[#d9b45c]/20 border border-[#d9b45c]/40 text-[#d9b45c] flex items-center justify-center font-extrabold font-sans uppercase text-sm">
                      {comment.name.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <strong className="text-white text-sm">{comment.name}</strong>
                        <span className="text-[10px] text-[#c9c2ab]/50 font-mono">{comment.email}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[8px] uppercase tracking-wider font-sans font-extrabold border ${
                          comment.type === "inquiry" 
                            ? "bg-green-500/10 text-green-400 border-green-500/20" 
                            : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        }`}>
                          {comment.type === "inquiry" ? "Trial Registration Lead" : "Blog Comment"}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-[#d9b45c] font-sans font-bold mt-1 uppercase tracking-wide">
                        {comment.age && <span>Age: {comment.age} yrs</span>}
                        {comment.country && <span>Country: {comment.country}</span>}
                        {comment.course && <span>Target: {comment.course.replace("-", " ")}</span>}
                        <span>Date: {comment.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {comment.status === "pending" && (
                      <button 
                        onClick={() => {
                          const updated = cmsData.comments.map(c => c.id === comment.id ? { ...c, status: "approved" as const } : c);
                          onSave({ ...cmsData, comments: updated });
                        }}
                        className="px-2.5 py-1 text-[10px] font-sans font-bold uppercase tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 rounded hover:bg-green-500/20"
                      >
                        Approve / Verify
                      </button>
                    )}
                    {comment.status !== "spam" && (
                      <button 
                        onClick={() => {
                          const updated = cmsData.comments.map(c => c.id === comment.id ? { ...c, status: "spam" as const } : c);
                          onSave({ ...cmsData, comments: updated });
                        }}
                        className="px-2.5 py-1 text-[10px] font-sans font-bold uppercase tracking-wider text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 rounded hover:bg-yellow-500/20"
                      >
                        Spam
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        if (window.confirm("Permanently delete this inquiry from database?")) {
                          const filtered = cmsData.comments.filter(c => c.id !== comment.id);
                          onSave({ ...cmsData, comments: filtered });
                        }
                      }}
                      className="p-1 text-red-400 hover:text-red-300 transition-colors"
                      title="Delete permanently"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="mt-3 text-xs text-[#c9c2ab] bg-[#07080b]/50 border border-[#d9b45c]/5 rounded-lg p-3 leading-relaxed font-sans max-w-4xl">
                  {comment.message}
                </div>
              </div>
            ))}

            {cmsData.comments.length === 0 && (
              <div className="p-12 text-center text-xs text-[#c9c2ab]/50">
                Inbox is clean! No comments or registration leads in the database.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "rankmath") {
    return <WPAnalytics cmsData={cmsData} onSave={onSave} />;
  }

  // GENERAL LIST TABLES VIEW / FORM RENDERER DISPATCHER
  if (!currentConfig) return null;

  return (
    <div className="space-y-6 text-left">
      
      {/* 1. SECTION TITLES AND SUB-NAVIGATION BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-[#d9b45c]/15 gap-4">
        <div>
          <h2 className="font-serif text-xl text-[#f3ecd8] font-bold tracking-tight">
            {currentConfig.label} Manager
          </h2>
          {/* WordPress Page Meta Stats Links (All | Published | Draft | Trashed) */}
          {subView === "all" && (
            <div className="flex flex-wrap items-center text-xs font-sans mt-2 divide-x divide-white/10 text-[#c9c2ab]">
              <button 
                onClick={() => setStatusFilter("all")} 
                className={`pr-2.5 font-bold hover:text-[#d9b45c] ${statusFilter === "all" ? "text-[#d9b45c]" : ""}`}
              >
                All <span className="text-[10px] font-mono font-light text-white/50">({statusCounts.all})</span>
              </button>
              <button 
                onClick={() => setStatusFilter("published")} 
                className={`px-2.5 font-bold hover:text-[#d9b45c] ${statusFilter === "published" ? "text-[#d9b45c]" : ""}`}
              >
                Published <span className="text-[10px] font-mono font-light text-white/50">({statusCounts.published})</span>
              </button>
              <button 
                onClick={() => setStatusFilter("draft")} 
                className={`px-2.5 font-bold hover:text-[#d9b45c] ${statusFilter === "draft" ? "text-[#d9b45c]" : ""}`}
              >
                Draft <span className="text-[10px] font-mono font-light text-white/50">({statusCounts.draft})</span>
              </button>
              <button 
                onClick={() => setStatusFilter("scheduled")} 
                className={`px-2.5 font-bold hover:text-[#d9b45c] ${statusFilter === "scheduled" ? "text-[#d9b45c]" : ""}`}
              >
                Scheduled <span className="text-[10px] font-mono font-light text-white/50">({statusCounts.scheduled})</span>
              </button>
              <button 
                onClick={() => setStatusFilter("trash")} 
                className={`pl-2.5 font-bold hover:text-[#d9b45c] ${statusFilter === "trash" ? "text-[#d9b45c]" : ""}`}
              >
                Trash <span className="text-[10px] font-mono font-light text-white/50">({statusCounts.trash})</span>
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons (Add New, Manage Categories, Manage Tags) */}
        <div className="flex flex-wrap items-center gap-2">
          {subView !== "all" && (
            <button 
              onClick={() => { setSubView("all"); setEditingItemId(null); }}
              className="px-4 py-2 border border-[#d9b45c]/30 text-[#d9b45c] hover:bg-[#d9b45c]/10 text-xs font-sans font-bold uppercase tracking-wider rounded-lg transition-colors"
            >
              Back to list
            </button>
          )}

          {subView === "all" && activeTab !== "pages" && (
            <button 
              onClick={handleAddNewItemTrigger}
              className="px-4 py-2 bg-[#d9b45c] text-black hover:bg-[#f2d98a] text-xs font-sans font-bold uppercase tracking-wider rounded-lg flex items-center space-x-1 transition-all"
            >
              <Plus size={14} />
              <span>Add New {currentConfig.singular}</span>
            </button>
          )}

          {activeTab === "posts" && subView === "all" && (
            <>
              <button 
                onClick={() => setSubView("categories")}
                className="px-4 py-2 bg-[#12141b] border border-[#d9b45c]/20 text-[#c9c2ab] hover:text-[#d9b45c] hover:border-[#d9b45c]/60 text-xs font-sans font-bold uppercase tracking-wider rounded-lg flex items-center space-x-1.5 transition-all"
              >
                <Folder size={13} />
                <span>Categories</span>
              </button>
              <button 
                onClick={() => setSubView("tags")}
                className="px-4 py-2 bg-[#12141b] border border-[#d9b45c]/20 text-[#c9c2ab] hover:text-[#d9b45c] hover:border-[#d9b45c]/60 text-xs font-sans font-bold uppercase tracking-wider rounded-lg flex items-center space-x-1.5 transition-all"
              >
                <Tag size={13} />
                <span>Tags</span>
              </button>
            </>
          )}
        </div>
      </div>


      {/* VIEW A: DYNAMIC TAXONOMY WRITER (Categories & Tags) */}
      {(subView === "categories" || subView === "tags") && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
          
          {/* Left Panel: Create Taxonomy */}
          <div className="lg:col-span-4 bg-[#12141b] border border-[#d9b45c]/15 rounded-xl p-5 space-y-4">
            <span className="text-[10px] text-[#d9b45c] uppercase font-bold tracking-widest block border-b border-[#d9b45c]/10 pb-1.5">
              Add New {subView === "categories" ? "Category" : "Tag"}
            </span>

            <div className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">Name</label>
                <input 
                  type="text" 
                  value={newTaxName}
                  onChange={(e) => {
                    setNewTaxName(e.target.value);
                    setNewTaxSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                  }}
                  className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-white"
                  placeholder={`e.g. ${subView === "categories" ? "Tajweed Mastery" : "tajweed"}`}
                />
                <span className="text-[9px] text-[#c9c2ab]/50 block">How it appears on your site.</span>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">Slug</label>
                <input 
                  type="text" 
                  value={newTaxSlug}
                  onChange={(e) => setNewTaxSlug(e.target.value)}
                  className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-white font-mono"
                  placeholder="e.g. tajweed-mastery"
                />
                <span className="text-[9px] text-[#c9c2ab]/50 block">The URL-friendly version of the name.</span>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">Description</label>
                <textarea 
                  rows={4}
                  value={newTaxDesc}
                  onChange={(e) => setNewTaxDesc(e.target.value)}
                  className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-[#c9c2ab]"
                  placeholder="Add a detailed description..."
                />
                <span className="text-[9px] text-[#c9c2ab]/50 block">The description is not prominent by default; however, some themes show it.</span>
              </div>

              <button 
                onClick={() => handleAddTaxonomy(subView === "categories" ? "category" : "tag")}
                className="w-full py-2.5 bg-[#d9b45c] text-black font-sans font-extrabold uppercase tracking-widest rounded-lg hover:bg-[#f2d98a] transition-all"
              >
                Add New {subView === "categories" ? "Category" : "Tag"}
              </button>
            </div>
          </div>

          {/* Right Panel: Taxonomies Listing */}
          <div className="lg:col-span-8 bg-[#12141b]/40 border border-[#d9b45c]/10 rounded-xl overflow-hidden">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-[#12141b] text-[#d9b45c] uppercase font-extrabold text-[9px] tracking-wider border-b border-[#d9b45c]/10">
                <tr>
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4 text-center">Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d9b45c]/5 text-[#c9c2ab]">
                {taxonomyList.map((tax) => (
                  <tr key={tax.slug} className="hover:bg-white/1 flex-row group">
                    <td className="py-3.5 px-4 font-bold text-white">
                      <span>{tax.name}</span>
                      <div className="flex items-center space-x-1.5 text-[9px] font-sans font-bold mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setNewTaxName(tax.name); setNewTaxSlug(tax.slug); setNewTaxDesc(tax.description); }}
                          className="text-[#d9b45c] hover:underline"
                        >
                          Quick Edit
                        </button>
                        <span className="text-white/20">|</span>
                        <button 
                          onClick={() => handleDeleteTaxonomy(tax.name)}
                          className="text-red-400 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-[#c9c2ab]/70 max-w-[240px] truncate">{tax.description}</td>
                    <td className="py-3.5 px-4 font-mono text-[10px]">{tax.slug}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#d9b45c] font-mono">{tax.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}


      {/* VIEW B: INTEGRATED ADVANCED EDITORS (Yoast SEO Blog Writer vs custom Structured Forms) */}
      {subView === "add" && (
        <div className="animate-in fade-in duration-200">
          {activeTab === "posts" ? (
            // Yoast SEO / Gutenberg style Advanced blog editor
            <WPSEOEditor 
              cmsData={cmsData} 
              onSave={onSave} 
              externalPostId={editingItemId}
            />
          ) : (
            // Structured custom post type / homepage sections editors
            <form onSubmit={handleSaveForm} className="bg-[#12141b]/40 border border-[#d9b45c]/10 rounded-xl p-6 space-y-6">
              <h3 className="text-sm font-sans font-extrabold text-[#d9b45c] uppercase tracking-widest border-b border-[#d9b45c]/10 pb-2">
                {editingItemId ? `Edit ${currentConfig.singular}: ${formData.title || formData.name || ""}` : `Create New ${currentConfig.singular}`}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Title or Primary Field */}
                {(formData.title !== undefined || formData.name !== undefined || formData.question !== undefined) && (
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">
                      {activeTab === "faqs" ? "Question Text" : activeTab === "teachers" || activeTab === "testimonials" ? "Full Name" : `${currentConfig.singular} Title`}
                    </label>
                    <input 
                      type="text" 
                      required
                      value={formData.title !== undefined ? formData.title : formData.name !== undefined ? formData.name : formData.question}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (formData.title !== undefined) setFormData((prev: any) => ({ ...prev, title: val }));
                        else if (formData.name !== undefined) setFormData((prev: any) => ({ ...prev, name: val }));
                        else setFormData((prev: any) => ({ ...prev, question: val }));
                      }}
                      className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-white font-bold focus:border-[#d9b45c] outline-none"
                    />
                  </div>
                )}

                {/* Slug */}
                {formData.slug !== undefined && (
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">Permalink Slug</label>
                    <input 
                      type="text" 
                      value={formData.slug || ""}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, slug: e.target.value }))}
                      className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-white font-mono"
                    />
                  </div>
                )}

                {/* Subtitle / Excerpt / Description Fields */}
                {(formData.excerpt !== undefined || formData.quote !== undefined || formData.bio !== undefined || formData.description !== undefined || formData.answer !== undefined) && (
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">
                      {activeTab === "faqs" ? "Answer content" : activeTab === "testimonials" ? "Student Review Quote" : activeTab === "teachers" ? "Teacher Biography Profile" : "Content / Description Details"}
                    </label>
                    <textarea 
                      rows={5}
                      required
                      value={formData.excerpt !== undefined ? formData.excerpt : formData.quote !== undefined ? formData.quote : formData.bio !== undefined ? formData.bio : formData.description !== undefined ? formData.description : formData.answer}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (formData.excerpt !== undefined) setFormData((prev: any) => ({ ...prev, excerpt: val }));
                        else if (formData.quote !== undefined) setFormData((prev: any) => ({ ...prev, quote: val }));
                        else if (formData.bio !== undefined) setFormData((prev: any) => ({ ...prev, bio: val }));
                        else if (formData.description !== undefined) setFormData((prev: any) => ({ ...prev, description: val }));
                        else setFormData((prev: any) => ({ ...prev, answer: val }));
                      }}
                      className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-[#c9c2ab]"
                    />
                  </div>
                )}

                {/* Courses-specific Fields */}
                {activeTab === "courses" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">Arabic Emblem Glyph</label>
                      <input 
                        type="text" 
                        value={formData.arabicGlyph || ""}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, arabicGlyph: e.target.value }))}
                        className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-white font-serif text-center font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">Kicker Tag</label>
                      <input 
                        type="text" 
                        value={formData.tag || ""}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, tag: e.target.value }))}
                        className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">Difficulty Track</label>
                      <input 
                        type="text" 
                        value={formData.difficulty || ""}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, difficulty: e.target.value }))}
                        className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                  </>
                )}

                {/* Teachers-specific Fields */}
                {activeTab === "teachers" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">Role Title</label>
                      <input 
                        type="text" 
                        value={formData.role || ""}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, role: e.target.value }))}
                        className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">Rating Star Rating (1-5)</label>
                      <input 
                        type="number" 
                        max={5} min={1}
                        value={formData.rating || 5}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, rating: parseInt(e.target.value) || 5 }))}
                        className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-white text-center font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">Experience Years</label>
                      <input 
                        type="text" 
                        value={formData.experience || ""}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, experience: e.target.value }))}
                        className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">Subject Specialty</label>
                      <input 
                        type="text" 
                        value={formData.category || ""}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                  </>
                )}

                {/* Testimonials-specific Fields */}
                {activeTab === "testimonials" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">Country Location</label>
                      <input 
                        type="text" 
                        value={formData.country || ""}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, country: e.target.value }))}
                        className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">Star Rating (1-5)</label>
                      <input 
                        type="number" 
                        max={5} min={1}
                        value={formData.rating || 5}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, rating: parseInt(e.target.value) || 5 }))}
                        className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-white text-center font-bold"
                      />
                    </div>
                  </>
                )}

                {/* Videos-specific Fields */}
                {activeTab === "videos" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">YouTube / Vimeo Embed URL or ID</label>
                      <input 
                        type="text" 
                        required
                        value={formData.embedId || ""}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, embedId: e.target.value }))}
                        className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-white font-mono"
                        placeholder="e.g. dGwW1yVw7OQ"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">Video Category</label>
                      <input 
                        type="text" 
                        value={formData.category || ""}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-white"
                        placeholder="Tajweed Rules"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">Video Duration</label>
                      <input 
                        type="text" 
                        value={formData.duration || ""}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, duration: e.target.value }))}
                        className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-white"
                        placeholder="e.g. 12:45"
                      />
                    </div>
                  </>
                )}

                {/* Services-specific Fields */}
                {activeTab === "services" && (
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">Icon Badge Name</label>
                    <select 
                      value={formData.iconName || "Award"}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, iconName: e.target.value }))}
                      className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-white"
                    >
                      <option value="Award">Award Badge</option>
                      <option value="BookOpen">Book Open</option>
                      <option value="Star">Star Point</option>
                      <option value="Users">Users Cohort</option>
                      <option value="Video">Video Camera</option>
                    </select>
                  </div>
                )}

                {/* Pricing-specific Fields */}
                {activeTab === "pricing" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">Price Cost</label>
                      <input 
                        type="text" 
                        value={formData.price || ""}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, price: e.target.value }))}
                        className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">Billing Period</label>
                      <input 
                        type="text" 
                        value={formData.period || ""}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, period: e.target.value }))}
                        className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                  </>
                )}

                {/* Media-specific Fields */}
                {activeTab === "media" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">Image / File URL</label>
                      <input 
                        type="text" 
                        value={formData.url || ""}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, url: e.target.value }))}
                        className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-white font-mono"
                        placeholder="https://images.unsplash.com/photo-..."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">File Size</label>
                      <input 
                        type="text" 
                        value={formData.size || "150 KB"}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, size: e.target.value }))}
                        className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">Dimensions</label>
                      <input 
                        type="text" 
                        value={formData.dimensions || "1024x768"}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, dimensions: e.target.value }))}
                        className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                  </>
                )}

                {/* Common Fields: Status, Featured Image */}
                {formData.status !== undefined && (
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-wider">Publish Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, status: e.target.value }))}
                      className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-white"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft / Private</option>
                      <option value="scheduled">Scheduled</option>
                    </select>
                  </div>
                )}

                {/* Unified Advanced Image Management Fieldset for Custom Post Types */}
                {(formData.image !== undefined || formData.photo !== undefined || formData.avatar !== undefined || formData.coverImage !== undefined || formData.thumbnail !== undefined) && (
                  <div className="space-y-4 md:col-span-2 bg-[#07080b]/50 border border-[#d9b45c]/10 p-5 rounded-xl text-left">
                    <span className="text-[10px] text-[#d9b45c] uppercase font-extrabold tracking-widest block border-b border-[#d9b45c]/10 pb-1">Featured / Profile Image Management</span>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-6 mt-3">
                      <div className="w-24 h-24 rounded-xl border border-[#d9b45c]/20 bg-[#12141b] overflow-hidden flex items-center justify-center flex-shrink-0 relative group">
                        <img 
                          src={formData.image || formData.photo || formData.avatar || formData.coverImage || formData.thumbnail || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80"} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="text-[#d9b45c]" size={16} />
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-2 w-full text-center sm:text-left">
                        <span className="text-[11px] font-sans text-[#c9c2ab] block">
                          Current Asset Path: <code className="font-mono text-[10px] bg-[#07080b] px-1.5 py-0.5 rounded text-white border border-white/5 truncate max-w-[200px] inline-block align-middle">{(formData.image || formData.photo || formData.avatar || formData.coverImage || formData.thumbnail || "").slice(0, 40)}...</code>
                        </span>
                        
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentImageEditField(
                                formData.image !== undefined ? "image" :
                                formData.photo !== undefined ? "photo" :
                                formData.avatar !== undefined ? "avatar" :
                                formData.coverImage !== undefined ? "coverImage" : "thumbnail"
                              );
                              setIsImageManagerOpen(true);
                            }}
                            className="px-3.5 py-1.5 bg-[#d9b45c] hover:bg-[#f2d98a] text-black font-sans font-extrabold text-[10px] uppercase tracking-widest rounded-lg transition-all"
                          >
                            Replace / Change Image
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const f = formData.image !== undefined ? "image" :
                                        formData.photo !== undefined ? "photo" :
                                        formData.avatar !== undefined ? "avatar" :
                                        formData.coverImage !== undefined ? "coverImage" : "thumbnail";
                              setFormData((prev: any) => ({ ...prev, [f]: "" }));
                            }}
                            className="px-3.5 py-1.5 border border-red-500/30 hover:bg-red-500/10 text-red-400 font-sans font-bold text-[10px] uppercase tracking-widest rounded-lg transition-all"
                          >
                            Remove Image
                          </button>
                        </div>
                        
                        <p className="text-[9px] text-[#c9c2ab]/50 leading-relaxed mt-1">
                          Upload, crop, resize, and automatically optimize images directly from your dashboard. Fully client-side compressed to accelerate SEO load time.
                        </p>
                      </div>
                    </div>

                    {/* Image SEO Metadata Sub-panel */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#d9b45c]/10 text-[11px] font-sans text-left">
                      <div className="space-y-1">
                        <label className="text-[9px] text-[#c9c2ab] uppercase font-bold tracking-wider">Alt Text (Critical for Google SEO)</label>
                        <input 
                          type="text" 
                          value={formData.imageAltText || ""}
                          placeholder="e.g. child memorizing holy quran in class"
                          onChange={(e) => setFormData((prev: any) => ({ ...prev, imageAltText: e.target.value }))}
                          className="w-full bg-[#07080b] border border-white/10 rounded p-2 text-[11px] text-white focus:border-[#d9b45c]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-[#c9c2ab] uppercase font-bold tracking-wider">Image Title Tag</label>
                        <input 
                          type="text" 
                          value={formData.imageTitle || ""}
                          placeholder="e.g. online-quran-class"
                          onChange={(e) => setFormData((prev: any) => ({ ...prev, imageTitle: e.target.value }))}
                          className="w-full bg-[#07080b] border border-white/10 rounded p-2 text-[11px] text-white focus:border-[#d9b45c]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-[#c9c2ab] uppercase font-bold tracking-wider">Image Caption</label>
                        <input 
                          type="text" 
                          value={formData.imageCaption || ""}
                          placeholder="Displays beneath the media asset"
                          onChange={(e) => setFormData((prev: any) => ({ ...prev, imageCaption: e.target.value }))}
                          className="w-full bg-[#07080b] border border-white/10 rounded p-2 text-[11px] text-white focus:border-[#d9b45c]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-[#c9c2ab] uppercase font-bold tracking-wider">Image Meta Description</label>
                        <input 
                          type="text" 
                          value={formData.imageDescription || ""}
                          placeholder="Detailed metadata description"
                          onChange={(e) => setFormData((prev: any) => ({ ...prev, imageDescription: e.target.value }))}
                          className="w-full bg-[#07080b] border border-white/10 rounded p-2 text-[11px] text-white focus:border-[#d9b45c]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t border-[#d9b45c]/10">
                <button 
                  type="submit"
                  className="px-6 py-3 bg-[#d9b45c] text-black font-sans font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-[#f2d98a] transition-all"
                >
                  Save & Publish Database
                </button>
                <button 
                  type="button"
                  onClick={() => { setSubView("all"); setEditingItemId(null); }}
                  className="px-6 py-3 border border-white/10 text-[#c9c2ab] hover:bg-white/5 text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}


      {/* VIEW C: NATIVE WORDPRESS-STYLE ALL ITEMS LIST TABLE */}
      {subView === "all" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          {/* 1. TABLE TOP CONTROLS (Bulk Actions Dropdown + Search + Filters) */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-[#12141b]/50 p-4 border border-[#d9b45c]/10 rounded-xl">
            
            {/* Left side: Bulk actions */}
            <div className="flex items-center space-x-2">
              <select 
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="bg-[#07080b] border border-[#d9b45c]/20 rounded-lg px-3 py-2 text-xs text-[#c9c2ab] focus:border-[#d9b45c] outline-none"
              >
                <option value="">Bulk Actions</option>
                <option value="duplicate">Duplicate Selected</option>
                <option value="draft">Change to Draft</option>
                <option value="publish">Change to Published</option>
                <option value="trash">Move to Trash</option>
                <option value="delete">Delete Permanently</option>
              </select>
              <button 
                onClick={handleApplyBulkAction}
                disabled={!bulkAction || selectedRowIds.length === 0}
                className="px-4 py-2 bg-[#d9b45c]/10 text-[#d9b45c] border border-[#d9b45c]/35 hover:bg-[#d9b45c] hover:text-black disabled:opacity-40 disabled:pointer-events-none text-xs font-sans font-extrabold uppercase tracking-wider rounded-lg transition-all"
              >
                Apply
              </button>
            </div>

            {/* Right side: Search & Taxonomies Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Distinct Category Filter */}
              {distinctFilters.categories.length > 0 && (
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-[#07080b] border border-[#d9b45c]/20 rounded-lg px-2.5 py-2 text-xs text-[#c9c2ab]"
                >
                  <option value="all">All Categories</option>
                  {distinctFilters.categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              )}

              {/* Distinct Author Filter */}
              {distinctFilters.authors.length > 0 && (
                <select
                  value={authorFilter}
                  onChange={(e) => setAuthorFilter(e.target.value)}
                  className="bg-[#07080b] border border-[#d9b45c]/20 rounded-lg px-2.5 py-2 text-xs text-[#c9c2ab]"
                >
                  <option value="all">All Authors</option>
                  {distinctFilters.authors.map(aut => (
                    <option key={aut} value={aut}>{aut}</option>
                  ))}
                </select>
              )}

              {/* Distinct Date Filter */}
              {distinctFilters.dates.length > 0 && (
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-[#07080b] border border-[#d9b45c]/20 rounded-lg px-2.5 py-2 text-xs text-[#c9c2ab]"
                >
                  <option value="all">All Dates</option>
                  {distinctFilters.dates.map(dt => (
                    <option key={dt} value={dt}>{dt}</option>
                  ))}
                </select>
              )}

              {/* Search Bar */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c9c2ab]/50" />
                <input 
                  type="text"
                  placeholder={`Search ${currentConfig.label.toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#07080b] border border-[#d9b45c]/20 rounded-lg pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-[#d9b45c] w-64 font-sans font-medium"
                />
              </div>
            </div>

          </div>


          {/* 2. THE ACTUAL LIST TABLE */}
          <div className="bg-[#12141b]/40 border border-[#d9b45c]/10 rounded-xl overflow-hidden shadow-xl">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-[#12141b]/80 border-b border-[#d9b45c]/10 text-[#d9b45c] font-sans font-extrabold text-[9px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <input 
                      type="checkbox"
                      onChange={handleSelectAllRows}
                      checked={paginatedItems.length > 0 && paginatedItems.every(i => selectedRowIds.includes(i.id))}
                      className="rounded border-[#d9b45c]/30 text-[#d9b45c] focus:ring-[#d9b45c]"
                    />
                  </th>
                  {activeTab === "posts" && <th className="py-3 px-4 w-12 text-center">Image</th>}
                  {activeTab === "teachers" && <th className="py-3 px-4 w-12 text-center">Photo</th>}
                  {activeTab === "courses" && <th className="py-3 px-4 w-12 text-center">Emblem</th>}
                  {activeTab === "media" && <th className="py-3 px-4 w-12 text-center">File</th>}
                  
                  <th className="py-3 px-4">Title / Identifier</th>
                  
                  {activeTab === "posts" && <th className="py-3 px-4">Author</th>}
                  {(activeTab === "posts" || activeTab === "teachers" || activeTab === "videos") && <th className="py-3 px-4">Category</th>}
                  {activeTab === "posts" && <th className="py-3 px-4">Tags</th>}
                  {activeTab === "posts" && <th className="py-3 px-4 text-center">SEO Score</th>}
                  {activeTab === "teachers" && <th className="py-3 px-4">Role / Experience</th>}
                  {activeTab === "testimonials" && <th className="py-3 px-4">Country</th>}
                  
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d9b45c]/5 text-[#c9c2ab]">
                {paginatedItems.map((item) => {
                  const isChecked = selectedRowIds.includes(item.id);
                  const isQuickEditing = quickEditingId === item.id;

                  if (isQuickEditing) {
                    // INLINE QUICK EDIT ROW LAYOUT
                    return (
                      <tr key={item.id} className="bg-[#d9b45c]/5">
                        <td className="py-4 px-4" colSpan={activeTab === "posts" ? 9 : 8}>
                          <div className="space-y-3 font-sans text-xs p-2 text-left">
                            <span className="text-[10px] text-[#d9b45c] uppercase font-bold tracking-widest block">Quick Edit Fields</span>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div className="space-y-1 md:col-span-2">
                                <label className="text-[9px] uppercase font-bold text-[#c9c2ab]">Title / Header</label>
                                <input 
                                  type="text" 
                                  value={quickEditFields.title}
                                  onChange={(e) => setQuickEditFields((prev: any) => ({ ...prev, title: e.target.value }))}
                                  className="w-full bg-[#07080b] border border-[#d9b45c]/25 rounded px-2.5 py-1.5 text-xs text-white"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] uppercase font-bold text-[#c9c2ab]">Slug</label>
                                <input 
                                  type="text" 
                                  value={quickEditFields.slug}
                                  onChange={(e) => setQuickEditFields((prev: any) => ({ ...prev, slug: e.target.value }))}
                                  className="w-full bg-[#07080b] border border-[#d9b45c]/25 rounded px-2.5 py-1.5 text-xs text-white font-mono"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] uppercase font-bold text-[#c9c2ab]">Status</label>
                                <select 
                                  value={quickEditFields.status}
                                  onChange={(e) => setQuickEditFields((prev: any) => ({ ...prev, status: e.target.value }))}
                                  className="w-full bg-[#07080b] border border-[#d9b45c]/25 rounded px-2.5 py-1.5 text-xs text-white"
                                >
                                  <option value="published">Published</option>
                                  <option value="draft">Draft</option>
                                  <option value="scheduled">Scheduled</option>
                                  <option value="trash">Trash</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] uppercase font-bold text-[#c9c2ab]">Date Stamp</label>
                                <input 
                                  type="text" 
                                  value={quickEditFields.date}
                                  onChange={(e) => setQuickEditFields((prev: any) => ({ ...prev, date: e.target.value }))}
                                  className="w-full bg-[#07080b] border border-[#d9b45c]/25 rounded px-2.5 py-1.5 text-xs text-white font-mono"
                                />
                              </div>

                              {activeTab === "posts" && (
                                <>
                                  <div className="space-y-1">
                                    <label className="text-[9px] uppercase font-bold text-[#c9c2ab]">Category</label>
                                    <select
                                      value={quickEditFields.category}
                                      onChange={(e) => setQuickEditFields((prev: any) => ({ ...prev, category: e.target.value }))}
                                      className="w-full bg-[#07080b] border border-[#d9b45c]/25 rounded px-2.5 py-1.5 text-xs text-white"
                                    >
                                      <option value="Tajweed Rules">Tajweed Rules</option>
                                      <option value="Hifz Guide">Hifz Guide</option>
                                      <option value="Quranic Arabic">Quranic Arabic</option>
                                      <option value="Parenting Guide">Parenting Guide</option>
                                      <option value="Academy Lectures">Academy Lectures</option>
                                    </select>
                                  </div>

                                  <div className="space-y-1 md:col-span-3">
                                    <label className="text-[9px] uppercase font-bold text-[#c9c2ab]">Tags (comma-separated)</label>
                                    <input 
                                      type="text" 
                                      value={quickEditFields.tags}
                                      onChange={(e) => setQuickEditFields((prev: any) => ({ ...prev, tags: e.target.value }))}
                                      className="w-full bg-[#07080b] border border-[#d9b45c]/25 rounded px-2.5 py-1.5 text-xs text-white"
                                    />
                                  </div>
                                </>
                              )}
                            </div>

                            <div className="flex items-center space-x-2 pt-2">
                              <button 
                                type="button"
                                onClick={() => handleSaveQuickEdit(item.id)}
                                className="px-3.5 py-1.5 bg-[#d9b45c] text-black font-sans font-bold text-[10px] uppercase tracking-wider rounded"
                              >
                                Update Row
                              </button>
                              <button 
                                type="button"
                                onClick={() => setQuickEditingId(null)}
                                className="px-3.5 py-1.5 bg-white/5 border border-white/10 text-white font-sans font-bold text-[10px] uppercase tracking-wider rounded"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  // SEO scores dynamic calculations
                  const score = activeTab === "posts" ? calculateDynamicPostScore(item) : 0;
                  const scoreColorClass = score >= 85 ? "bg-green-500 text-white" : score >= 60 ? "bg-yellow-500 text-black" : "bg-red-500 text-white";

                  return (
                    <tr key={item.id} className={`hover:bg-white/1 flex-row group ${isChecked ? "bg-[#d9b45c]/3" : ""}`}>
                      
                      {/* Checkbox */}
                      <td className="py-3.5 px-4">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleSelectRow(item.id, e.target.checked)}
                          className="rounded border-[#d9b45c]/30 text-[#d9b45c] focus:ring-[#d9b45c]"
                        />
                      </td>

                      {/* Image Thumbnail Preview Columns */}
                      {activeTab === "posts" && (
                        <td className="py-3.5 px-4 text-center">
                          <img 
                            src={item.coverImage || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=150"} 
                            alt="" 
                            className="w-10 h-10 object-cover rounded-lg border border-white/5"
                            referrerPolicy="no-referrer"
                          />
                        </td>
                      )}

                      {activeTab === "teachers" && (
                        <td className="py-3.5 px-4 text-center">
                          <img 
                            src={item.photo || "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=150"} 
                            alt="" 
                            className="w-9 h-9 object-cover rounded-full border border-white/5"
                            referrerPolicy="no-referrer"
                          />
                        </td>
                      )}

                      {activeTab === "courses" && (
                        <td className="py-3.5 px-4 text-center">
                          <span className="w-9 h-9 rounded-lg bg-[#d9b45c]/10 text-[#d9b45c] border border-[#d9b45c]/25 font-bold font-serif flex items-center justify-center text-sm">
                            {item.arabicGlyph || "ق"}
                          </span>
                        </td>
                      )}

                      {activeTab === "media" && (
                        <td className="py-3.5 px-4 text-center">
                          {item.type?.startsWith("image/") ? (
                            <img 
                              src={item.url} 
                              alt="" 
                              className="w-10 h-10 object-cover rounded border border-white/5"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span className="w-10 h-10 rounded bg-[#d9b45c]/10 text-[#d9b45c] flex items-center justify-center text-[9px] font-mono font-bold uppercase">
                              DOC
                            </span>
                          )}
                        </td>
                      )}

                      {/* Primary Text column with Hover Actions */}
                      <td className="py-3.5 px-4 font-bold text-white max-w-sm">
                        <span className="text-xs hover:text-[#d9b45c] transition-colors cursor-pointer block leading-normal">
                          {item.title || item.name || item.question || item.id}
                        </span>

                        {/* HOVER ACTIONS LINKS ROW */}
                        <div className="flex items-center space-x-2 text-[9px] font-sans font-bold mt-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity text-[#c9c2ab]/60">
                          {item.status === "trash" ? (
                            <>
                              <button onClick={() => handleRestoreItem(item.id)} className="text-green-400 hover:underline">Restore</button>
                              <span>|</span>
                              <button onClick={() => handlePermanentDeleteItem(item.id)} className="text-red-400 hover:underline">Delete Permanently</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleEditItem(item.id)} className="text-[#d9b45c] hover:underline">Edit</button>
                              <span>|</span>
                              <button onClick={() => handleStartQuickEdit(item)} className="text-[#d9b45c] hover:underline">Quick Edit</button>
                              <span>|</span>
                              <button onClick={() => handleTrashItem(item.id)} className="text-red-400 hover:underline">Trash</button>
                              {activeTab !== "pages" && (
                                <>
                                  <span>|</span>
                                  <button onClick={() => handleDuplicateItem(item.id)} className="text-blue-400 hover:underline">Duplicate</button>
                                </>
                              )}
                              <span>|</span>
                              <a 
                                href={`/blog/${item.slug || item.id}`} 
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigateToRoute("blog-post", item.slug || item.id);
                                }} 
                                className="text-blue-400 hover:underline cursor-pointer"
                              >
                                View
                              </a>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Dynamic metadata columns depending on content type */}
                      {activeTab === "posts" && <td className="py-3.5 px-4 font-sans text-xs">{item.author?.name || "Scholar Admin"}</td>}
                      {(activeTab === "posts" || activeTab === "teachers" || activeTab === "videos") && (
                        <td className="py-3.5 px-4 text-xs font-semibold text-[#d9b45c]">{item.category || "Uncategorized"}</td>
                      )}
                      
                      {activeTab === "posts" && (
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="flex flex-wrap gap-1.5">
                            {item.tags?.map((tag: string, idx: number) => (
                              <span key={idx} className="bg-[#d9b45c]/8 text-[#f2d98a] border border-[#d9b45c]/12 text-[8px] font-mono px-1 py-0.5 rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </td>
                      )}

                      {/* Realtime dynamic SEO Score circle preview */}
                      {activeTab === "posts" && (
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex items-center justify-center font-mono font-bold text-[10px] w-7 h-7 rounded-full shadow-sm ${scoreColorClass}`}>
                            {score}
                          </span>
                        </td>
                      )}

                      {activeTab === "teachers" && (
                        <td className="py-3.5 px-4 font-sans text-xs">
                          <div className="font-semibold text-white">{item.role}</div>
                          <div className="text-[10px] text-[#c9c2ab]/60 font-mono mt-0.5">{item.experience}</div>
                        </td>
                      )}

                      {activeTab === "testimonials" && <td className="py-3.5 px-4 font-sans text-xs font-semibold">{item.country || "United Kingdom"}</td>}

                      {/* Status Badges */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[8px] uppercase tracking-wider font-extrabold font-sans border ${
                          item.status === "trash" || item.status === "spam"
                            ? "bg-red-500/10 text-red-400 border-red-500/15 animate-pulse"
                            : item.status === "draft" || item.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/15"
                            : "bg-green-500/10 text-green-400 border-green-500/15"
                        }`}>
                          {item.status || "published"}
                        </span>
                      </td>

                      {/* Date details */}
                      <td className="py-3.5 px-4 font-mono text-[10px] text-[#c9c2ab]/70">
                        <div className="font-semibold text-white">{item.date || "July 20, 2026"}</div>
                        <div className="text-[9px] text-[#c9c2ab]/40 mt-0.5 uppercase">Last Updated</div>
                      </td>

                    </tr>
                  );
                })}

                {filteredItems.length === 0 && (
                  <tr>
                    <td className="py-12 px-4 text-center text-[#c9c2ab]/50 text-xs" colSpan={activeTab === "posts" ? 9 : 8}>
                      No {currentConfig.label.toLowerCase()} found matching current search and filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>


          {/* 3. TABLE BOTTOM PAGINATION FOOTER */}
          <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 p-4 bg-[#12141b]/50 border border-[#d9b45c]/10 rounded-xl">
            <span className="text-[11px] font-sans text-[#c9c2ab]">
              Showing <strong className="text-white">{filteredItems.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong> to{" "}
              <strong className="text-white">{Math.min(currentPage * itemsPerPage, filteredItems.length)}</strong> of{" "}
              <strong className="text-white">{filteredItems.length}</strong> {currentConfig.label.toLowerCase()}
            </span>

            <div className="flex items-center space-x-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1.5 rounded-lg bg-[#07080b] border border-[#d9b45c]/15 text-[#c9c2ab] hover:border-[#d9b45c] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              
              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-sans font-extrabold uppercase transition-all ${
                    currentPage === idx + 1 
                      ? "bg-[#d9b45c] text-black" 
                      : "bg-[#07080b] text-[#c9c2ab] border border-[#d9b45c]/10 hover:border-[#d9b45c]"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-1.5 rounded-lg bg-[#07080b] border border-[#d9b45c]/15 text-[#c9c2ab] hover:border-[#d9b45c] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* WordPress Advanced Media Library Modal overlay */}
      <WPMediaLibraryModal
        isOpen={isImageManagerOpen}
        onClose={() => setIsImageManagerOpen(false)}
        mediaLibrary={cmsData.mediaLibrary || []}
        onSelect={(img) => {
          if (currentImageEditField) {
            setFormData((prev: any) => ({
              ...prev,
              [currentImageEditField]: img.url,
              imageAltText: img.alt || prev.imageAltText || "",
              imageTitle: img.title || prev.imageTitle || "",
              imageCaption: img.caption || prev.imageCaption || "",
              imageDescription: img.description || prev.imageDescription || ""
            }));
          }
        }}
        onSaveMediaLibrary={(updatedMedia) => {
          const updated = {
            ...cmsData,
            mediaLibrary: updatedMedia
          };
          onSave(updated);
        }}
        defaultCropAspect={
          currentImageEditField === "avatar" || currentImageEditField === "photo" ? "1:1" : "free"
        }
      />

    </div>
  );
}
