export interface RouteState {
  view: string;
  activePostId: string | null;
  categorySlug?: string | null;
  tagSlug?: string | null;
  isWpAdmin: boolean;
}

export function slugify(text: string): string {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseCurrentRoute(): RouteState {
  const rawPath = typeof window !== "undefined" ? window.location.pathname || "/" : "/";
  let pathname = rawPath.length > 1 ? rawPath.replace(/\/+$/, "") : "/";
  const normalizedPath = pathname.toLowerCase();
  
  const rawHash = typeof window !== "undefined" ? (window.location.hash || "").replace(/^#/, "").trim().toLowerCase() : "";
  const cleanHash = rawHash.replace(/^\/+/, "").replace(/\/+$/, "");

  // =========================================================================
  // PRIORITY 1: EXCLUSIVE ADMIN / BLOG MANAGEMENT ACCESS (/wp-admin)
  // Highest priority so public hash routes (like #about or #dashboard) never hijack /wp-admin
  // =========================================================================
  const isDirectWpAdminPath = 
    normalizedPath === "/wp-admin" || 
    normalizedPath.startsWith("/wp-admin/") ||
    normalizedPath === "/wp-admin.php" ||
    normalizedPath.startsWith("/wp-admin.php");

  const isHashWpAdmin = 
    cleanHash === "wp-admin" || 
    cleanHash.startsWith("wp-admin/") || 
    cleanHash === "admin-panel";

  if (isDirectWpAdminPath || isHashWpAdmin) {
    if (isHashWpAdmin && typeof window !== "undefined" && window.history && window.history.replaceState) {
      window.history.replaceState(null, "", "/wp-admin");
    }
    return { view: "wp-admin", activePostId: null, isWpAdmin: true };
  }

  // =========================================================================
  // PRIORITY 2: STRICTLY RESTRICT & BLOCK OTHER ADMINISTRATIVE ALIASES
  // Block: /admin, /admin-login, /login, /dashboard, /wp-login, /wp-login.php
  // Redirect them cleanly to homepage (/)
  // =========================================================================
  const restrictedAdminAliases = ["/admin", "/admin-login", "/login", "/dashboard", "/wp-login", "/wp-login.php"];
  const isRestrictedAlias = 
    restrictedAdminAliases.includes(normalizedPath) ||
    restrictedAdminAliases.some(alias => normalizedPath.startsWith(`${alias}/`)) ||
    restrictedAdminAliases.map(a => a.replace(/^\//, "")).includes(cleanHash);

  if (isRestrictedAlias) {
    if (typeof window !== "undefined" && window.history && window.history.replaceState) {
      window.history.replaceState(null, "", "/");
    }
    return { view: "home", activePostId: null, isWpAdmin: false };
  }

  // =========================================================================
  // PRIORITY 3: PUBLIC HASH ROUTES
  // =========================================================================
  if (cleanHash) {
    if (cleanHash === "about") {
      if (window.history.replaceState) window.history.replaceState(null, "", "/about");
      return { view: "about", activePostId: null, isWpAdmin: false };
    }
    if (cleanHash === "courses" || cleanHash === "all-courses") {
      if (window.history.replaceState) window.history.replaceState(null, "", "/courses");
      return { view: "courses", activePostId: null, isWpAdmin: false };
    }
    if (cleanHash === "noorani-qaida" || cleanHash === "courses#noorani-qaida") {
      if (window.history.replaceState) window.history.replaceState(null, "", "/noorani-qaida");
      return { view: "noorani-qaida", activePostId: "noorani-qaida", isWpAdmin: false };
    }
    if (cleanHash === "kids-classes" || cleanHash === "kids-quran-classes") {
      if (window.history.replaceState) window.history.replaceState(null, "", "/kids-classes");
      return { view: "kids-classes", activePostId: "kids-classes", isWpAdmin: false };
    }
    if (cleanHash === "tajweed-intensive" || cleanHash === "tajweed") {
      if (window.history.replaceState) window.history.replaceState(null, "", "/courses/tajweed-intensive");
      return { view: "courses", activePostId: "tajweed-intensive", isWpAdmin: false };
    }
    if (cleanHash === "quran-hifz" || cleanHash === "hifz") {
      if (window.history.replaceState) window.history.replaceState(null, "", "/courses/quran-hifz");
      return { view: "courses", activePostId: "quran-hifz", isWpAdmin: false };
    }
    if (cleanHash === "fees" || cleanHash === "pricing" || cleanHash === "faq" || cleanHash === "faqs") {
      if (window.history.replaceState) window.history.replaceState(null, "", "/fees");
      return { view: "fees", activePostId: null, isWpAdmin: false };
    }
    if (cleanHash === "videos") {
      if (window.history.replaceState) window.history.replaceState(null, "", "/videos");
      return { view: "videos", activePostId: null, isWpAdmin: false };
    }
    if (cleanHash === "download" || cleanHash === "downloads") {
      if (window.history.replaceState) window.history.replaceState(null, "", "/download");
      return { view: "download", activePostId: null, isWpAdmin: false };
    }
    if (cleanHash === "contact" || cleanHash === "enquiry") {
      if (window.history.replaceState) window.history.replaceState(null, "", "/contact");
      return { view: "contact", activePostId: null, isWpAdmin: false };
    }
    if (cleanHash === "blog") {
      if (window.history.replaceState) window.history.replaceState(null, "", "/blog");
      return { view: "blog", activePostId: null, isWpAdmin: false };
    }
  }

  // =========================================================================
  // PRIORITY 4: PUBLIC PATHWAYS
  // =========================================================================
  if (normalizedPath === "/" || normalizedPath === "") {
    return { view: "home", activePostId: null, isWpAdmin: false };
  }

  if (normalizedPath === "/about") {
    return { view: "about", activePostId: null, isWpAdmin: false };
  }

  if (normalizedPath === "/services") {
    return { view: "courses", activePostId: null, isWpAdmin: false };
  }

  if (normalizedPath === "/contact") {
    return { view: "contact", activePostId: null, isWpAdmin: false };
  }

  if (normalizedPath === "/courses") {
    return { view: "courses", activePostId: null, isWpAdmin: false };
  }

  if (normalizedPath.startsWith("/courses/")) {
    const courseSlug = normalizedPath.replace("/courses/", "").replace(/\/+$/, "");
    if (courseSlug === "noorani-qaida") {
      return { view: "noorani-qaida", activePostId: courseSlug, isWpAdmin: false };
    }
    if (courseSlug === "kids-classes" || courseSlug === "kids-quran-classes") {
      return { view: "kids-classes", activePostId: courseSlug, isWpAdmin: false };
    }
    return { view: "courses", activePostId: courseSlug, isWpAdmin: false };
  }

  if (normalizedPath === "/noorani-qaida") {
    return { view: "noorani-qaida", activePostId: null, isWpAdmin: false };
  }

  if (normalizedPath === "/kids-classes" || normalizedPath === "/kids-quran-classes") {
    return { view: "kids-classes", activePostId: null, isWpAdmin: false };
  }

  if (normalizedPath === "/fees" || normalizedPath === "/pricing" || normalizedPath === "/fees-faq" || normalizedPath === "/faq" || normalizedPath === "/faqs") {
    return { view: "fees", activePostId: null, isWpAdmin: false };
  }

  if (normalizedPath === "/videos") {
    return { view: "videos", activePostId: null, isWpAdmin: false };
  }

  if (normalizedPath === "/download" || normalizedPath === "/downloads") {
    return { view: "download", activePostId: null, isWpAdmin: false };
  }

  if (normalizedPath === "/blog") {
    return { view: "blog", activePostId: null, isWpAdmin: false };
  }

  if (normalizedPath.startsWith("/category/") || normalizedPath.startsWith("/blog/category/")) {
    const rawCat = normalizedPath.replace(/^\/(blog\/)?category\//, "").replace(/\/+$/, "");
    const decodedCat = decodeURIComponent(rawCat).trim();
    return { view: "category", activePostId: null, categorySlug: decodedCat, isWpAdmin: false };
  }

  if (normalizedPath.startsWith("/tag/") || normalizedPath.startsWith("/blog/tag/")) {
    const rawTag = normalizedPath.replace(/^\/(blog\/)?tag\//, "").replace(/\/+$/, "");
    const decodedTag = decodeURIComponent(rawTag).trim();
    return { view: "tag", activePostId: null, tagSlug: decodedTag, isWpAdmin: false };
  }

  if (normalizedPath.startsWith("/blog/")) {
    const rawSlug = normalizedPath.replace("/blog/", "").replace(/\/+$/, "");
    const slug = decodeURIComponent(rawSlug).trim();
    if (slug) {
      return { view: "blog-post", activePostId: slug, isWpAdmin: false };
    }
    return { view: "blog", activePostId: null, isWpAdmin: false };
  }

  // Direct blog post ID or slug (e.g. /blog-1)
  if (normalizedPath === "/blog-1" || normalizedPath === "/blog-post-1") {
    if (window.history.replaceState) window.history.replaceState(null, "", "/blog/blog-1");
    return { view: "blog-post", activePostId: "blog-1", isWpAdmin: false };
  }

  // Any unmatched path shows 404
  return { view: "404", activePostId: null, isWpAdmin: false };
}

export function navigateToRoute(
  view: string,
  activePostId?: string | null,
  categorySlug?: string | null,
  tagSlug?: string | null
) {
  let targetPath = "/";

  if (view === "wp-admin" || view === "admin") {
    targetPath = "/wp-admin";
  } else if (view === "home") {
    targetPath = "/";
  } else if (view === "about") {
    targetPath = "/about";
  } else if (view === "services") {
    targetPath = "/courses";
  } else if (view === "contact") {
    targetPath = "/contact";
  } else if (view === "courses") {
    if (activePostId && activePostId !== "all") {
      targetPath = `/courses/${slugify(activePostId)}`;
    } else {
      targetPath = "/courses";
    }
  } else if (view === "noorani-qaida") {
    targetPath = "/noorani-qaida";
  } else if (view === "kids-classes") {
    targetPath = "/kids-classes";
  } else if (view === "fees" || view === "pricing") {
    targetPath = "/fees";
  } else if (view === "videos") {
    targetPath = "/videos";
  } else if (view === "download") {
    targetPath = "/download";
  } else if (view === "category" || (view === "blog" && categorySlug)) {
    const cat = categorySlug || "all";
    if (cat.toLowerCase() === "all") {
      targetPath = "/blog";
    } else {
      targetPath = `/category/${slugify(cat)}`;
    }
  } else if (view === "tag" || (view === "blog" && tagSlug)) {
    const tag = tagSlug || "";
    targetPath = tag ? `/tag/${slugify(tag)}` : "/blog";
  } else if (view === "blog-post") {
    if (activePostId) {
      targetPath = `/blog/${slugify(activePostId)}`;
    } else {
      targetPath = "/blog";
    }
  } else if (view === "blog") {
    targetPath = "/blog";
  } else if (view === "404") {
    // Keep current path in URL for 404 status
    targetPath = window.location.pathname;
  } else {
    targetPath = `/${view}`;
  }

  if (window.location.pathname !== targetPath && view !== "404") {
    window.history.pushState({ view, activePostId, categorySlug, tagSlug }, "", targetPath);
  }

  window.dispatchEvent(new Event("app_route_changed"));
}
