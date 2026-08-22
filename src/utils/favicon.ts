import logoImg from "../assets/images/truth_quran_new_logo_1784203145448.jpg";

export const DEFAULT_FALLBACK_FAVICON = logoImg;

/**
 * Detects the MIME type of a favicon URL or Data URI.
 */
export function determineFaviconMimeType(url: string): string {
  if (!url) return "image/png";

  const lower = url.toLowerCase();
  if (lower.startsWith("data:image/svg+xml") || lower.endsWith(".svg")) {
    return "image/svg+xml";
  }
  if (lower.startsWith("data:image/x-icon") || lower.startsWith("data:image/vnd.microsoft.icon") || lower.endsWith(".ico")) {
    return "image/x-icon";
  }
  if (lower.startsWith("data:image/webp") || lower.endsWith(".webp")) {
    return "image/webp";
  }
  if (lower.startsWith("data:image/jpeg") || lower.startsWith("data:image/jpg") || lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
    return "image/jpeg";
  }
  return "image/png";
}

/**
 * Dynamically updates or creates all favicon and app icon link tags in the document <head>.
 * Supports .ico, .png, .svg, .webp, and base64 Data URIs.
 */
export function applyFaviconToDocument(faviconUrl?: string): void {
  if (typeof document === "undefined") return;

  const activeUrl = faviconUrl && faviconUrl.trim() !== "" ? faviconUrl : DEFAULT_FALLBACK_FAVICON;
  const mimeType = determineFaviconMimeType(activeUrl);

  const updateOrCreateLink = (rel: string, sizes?: string) => {
    const selector = sizes ? `link[rel="${rel}"][sizes="${sizes}"]` : `link[rel="${rel}"]:not([sizes])`;
    let link = document.querySelector(selector) as HTMLLinkElement | null;

    if (!link) {
      // Check if there's any link with this rel
      link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
    }

    if (!link) {
      link = document.createElement("link");
      link.rel = rel;
      if (sizes) {
        link.setAttribute("sizes", sizes);
      }
      document.head.appendChild(link);
    }

    link.type = mimeType;
    link.href = activeUrl;
  };

  // Update primary icon tags
  updateOrCreateLink("icon");
  updateOrCreateLink("shortcut icon");
  updateOrCreateLink("apple-touch-icon");

  // Update all sized icon tags if present
  const sizedLinks = document.querySelectorAll('link[rel="icon"][sizes], link[rel="apple-touch-icon"][sizes]');
  sizedLinks.forEach((el) => {
    const htmlLink = el as HTMLLinkElement;
    htmlLink.href = activeUrl;
    htmlLink.type = mimeType;
  });
}
