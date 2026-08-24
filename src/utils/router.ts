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
  const pathname = window.location.pathname.replace(/\/$/, "") || "/";

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
    return { view: "services", activePostId: null, isWpAdmin: false };
  }

  if (pathname === "/contact") {
    return { view: "contact", activePostId: null, isWpAdmin: false };
  }

  if (pathname === "/courses") {
    return { view: "courses", activePostId: null, isWpAdmin: false };
  }

  if (pathname.startsWith("/courses/")) {
    const courseSlug = pathname.replace("/courses/", "").replace(/\/$/, "");
    if (courseSlug === "noorani-qaida") {
      return { view: "noorani-qaida", activePostId: courseSlug, isWpAdmin: false };
    }
    return { view: "courses", activePostId: courseSlug, isWpAdmin: false };
  }

  if (pathname === "/noorani-qaida") {
    return { view: "noorani-qaida", activePostId: null, isWpAdmin: false };
  }

  if (pathname === "/kids-classes") {
    return { view: "kids-classes", activePostId: null, isWpAdmin: false };
  }

  if (pathname === "/fees" || pathname === "/pricing") {
    return { view: "fees", activePostId: null, isWpAdmin: false };
  }

  if (pathname === "/videos") {
    return { view: "videos", activePostId: null, isWpAdmin: false };
  }

  if (pathname === "/download") {
    return { view: "download", activePostId: null, isWpAdmin: false };
  }

  if (pathname === "/blog") {
    return { view: "blog", activePostId: null, isWpAdmin: false };
  }

  if (pathname.startsWith("/category/") || pathname.startsWith("/blog/category/")) {
    const rawCat = pathname.replace(/^\/(blog\/)?category\//, "").replace(/\/$/, "");
    return { view: "blog", activePostId: null, categorySlug: decodeURIComponent(rawCat), isWpAdmin: false };
  }

  if (pathname.startsWith("/tag/") || pathname.startsWith("/blog/tag/")) {
    const rawTag = pathname.replace(/^\/(blog\/)?tag\//, "").replace(/\/$/, "");
    return { view: "blog", activePostId: null, tagSlug: decodeURIComponent(rawTag), isWpAdmin: false };
  }

  if (pathname.startsWith("/blog/")) {
    const rawSlug = pathname.replace("/blog/", "").replace(/\/$/, "");
    const slug = decodeURIComponent(rawSlug);
    return { view: "blog-post", activePostId: slug, isWpAdmin: false };
  }

  const fallbackView = pathname.replace("/", "");
  return { view: fallbackView, activePostId: null, isWpAdmin: false };
}

export function navigateToRoute(view: string, activePostId?: string | null) {
  let targetPath = "/";

  if (view === "wp-admin") {
    targetPath = "/wp-admin";
  } else if (view === "home") {
    targetPath = "/";
  } else if (view === "about") {
    targetPath = "/about";
  } else if (view === "services") {
    targetPath = "/services";
  } else if (view === "contact") {
    targetPath = "/contact";
  } else if (view === "courses") {
    targetPath = "/courses";
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
  } else if (view === "blog" || view === "blog-post") {
    if (activePostId) {
      targetPath = `/blog/${activePostId}`;
    } else {
      targetPath = "/blog";
    }
  } else {
    targetPath = `/${view}`;
  }

  if (window.location.pathname !== targetPath) {
    window.history.pushState({ view, activePostId }, "", targetPath);
  }

  window.dispatchEvent(new Event("app_route_changed"));
}
