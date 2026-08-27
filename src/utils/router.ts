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
  // Normalize pathname: remove trailing slash, handle base path
  const rawPath = window.location.pathname || "/";
  let pathname = rawPath.length > 1 ? rawPath.replace(/\/+$/, "") : "/";
  const hash = (window.location.hash || "").replace(/^#/, "").trim().toLowerCase();

  // If there is a hash route (e.g. /#about, /#courses, /courses#noorani-qaida, /fees#faq)
  if (hash) {
    if (hash === "about") {
      if (window.history.replaceState) window.history.replaceState(null, "", "/about");
      return { view: "about", activePostId: null, isWpAdmin: false };
    }
    if (hash === "courses" || hash === "all-courses") {
      if (window.history.replaceState) window.history.replaceState(null, "", "/courses");
      return { view: "courses", activePostId: null, isWpAdmin: false };
    }
    if (hash === "noorani-qaida" || hash === "courses#noorani-qaida") {
      if (window.history.replaceState) window.history.replaceState(null, "", "/noorani-qaida");
      return { view: "noorani-qaida", activePostId: "noorani-qaida", isWpAdmin: false };
    }
    if (hash === "kids-classes" || hash === "kids-quran-classes") {
      if (window.history.replaceState) window.history.replaceState(null, "", "/kids-classes");
      return { view: "kids-classes", activePostId: "kids-classes", isWpAdmin: false };
    }
    if (hash === "tajweed-intensive" || hash === "tajweed") {
      if (window.history.replaceState) window.history.replaceState(null, "", "/courses/tajweed-intensive");
      return { view: "courses", activePostId: "tajweed-intensive", isWpAdmin: false };
    }
    if (hash === "quran-hifz" || hash === "hifz") {
      if (window.history.replaceState) window.history.replaceState(null, "", "/courses/quran-hifz");
      return { view: "courses", activePostId: "quran-hifz", isWpAdmin: false };
    }
    if (hash === "fees" || hash === "pricing" || hash === "faq" || hash === "faqs") {
      if (window.history.replaceState) window.history.replaceState(null, "", "/fees");
      return { view: "fees", activePostId: null, isWpAdmin: false };
    }
    if (hash === "videos") {
      if (window.history.replaceState) window.history.replaceState(null, "", "/videos");
      return { view: "videos", activePostId: null, isWpAdmin: false };
    }
    if (hash === "download" || hash === "downloads") {
      if (window.history.replaceState) window.history.replaceState(null, "", "/download");
      return { view: "download", activePostId: null, isWpAdmin: false };
    }
    if (hash === "contact" || hash === "enquiry") {
      if (window.history.replaceState) window.history.replaceState(null, "", "/contact");
      return { view: "contact", activePostId: null, isWpAdmin: false };
    }
    if (hash === "blog") {
      if (window.history.replaceState) window.history.replaceState(null, "", "/blog");
      return { view: "blog", activePostId: null, isWpAdmin: false };
    }
  }

  if (pathname === "/wp-admin" || pathname.startsWith("/wp-admin")) {
    return { view: "home", activePostId: null, isWpAdmin: true };
  }

  if (pathname === "/" || pathname === "") {
    return { view: "home", activePostId: null, isWpAdmin: false };
  }

  if (pathname === "/about") {
    return { view: "about", activePostId: null, isWpAdmin: false };
  }

  if (pathname === "/services") {
    return { view: "courses", activePostId: null, isWpAdmin: false };
  }

  if (pathname === "/contact") {
    return { view: "contact", activePostId: null, isWpAdmin: false };
  }

  if (pathname === "/courses") {
    return { view: "courses", activePostId: null, isWpAdmin: false };
  }

  if (pathname.startsWith("/courses/")) {
    const courseSlug = pathname.replace("/courses/", "").replace(/\/+$/, "");
    if (courseSlug === "noorani-qaida") {
      return { view: "noorani-qaida", activePostId: courseSlug, isWpAdmin: false };
    }
    if (courseSlug === "kids-classes" || courseSlug === "kids-quran-classes") {
      return { view: "kids-classes", activePostId: courseSlug, isWpAdmin: false };
    }
    return { view: "courses", activePostId: courseSlug, isWpAdmin: false };
  }

  if (pathname === "/noorani-qaida") {
    return { view: "noorani-qaida", activePostId: null, isWpAdmin: false };
  }

  if (pathname === "/kids-classes" || pathname === "/kids-quran-classes") {
    return { view: "kids-classes", activePostId: null, isWpAdmin: false };
  }

  if (pathname === "/fees" || pathname === "/pricing" || pathname === "/fees-faq" || pathname === "/faq" || pathname === "/faqs") {
    return { view: "fees", activePostId: null, isWpAdmin: false };
  }

  if (pathname === "/videos") {
    return { view: "videos", activePostId: null, isWpAdmin: false };
  }

  if (pathname === "/download" || pathname === "/downloads") {
    return { view: "download", activePostId: null, isWpAdmin: false };
  }

  if (pathname === "/blog") {
    return { view: "blog", activePostId: null, isWpAdmin: false };
  }

  if (pathname.startsWith("/category/") || pathname.startsWith("/blog/category/")) {
    const rawCat = pathname.replace(/^\/(blog\/)?category\//, "").replace(/\/+$/, "");
    const decodedCat = decodeURIComponent(rawCat).trim();
    return { view: "category", activePostId: null, categorySlug: decodedCat, isWpAdmin: false };
  }

  if (pathname.startsWith("/tag/") || pathname.startsWith("/blog/tag/")) {
    const rawTag = pathname.replace(/^\/(blog\/)?tag\//, "").replace(/\/+$/, "");
    const decodedTag = decodeURIComponent(rawTag).trim();
    return { view: "tag", activePostId: null, tagSlug: decodedTag, isWpAdmin: false };
  }

  if (pathname.startsWith("/blog/")) {
    const rawSlug = pathname.replace("/blog/", "").replace(/\/+$/, "");
    const slug = decodeURIComponent(rawSlug).trim();
    if (slug) {
      return { view: "blog-post", activePostId: slug, isWpAdmin: false };
    }
    return { view: "blog", activePostId: null, isWpAdmin: false };
  }

  // Direct blog post ID or slug (e.g. /blog-1)
  if (pathname === "/blog-1" || pathname === "/blog-post-1") {
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

  if (view === "wp-admin") {
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
