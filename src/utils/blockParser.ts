import { ContentBlock, ContentBlockType, BlogPost } from "../types";

export function slugifyAnchor(text: string): string {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Converts an array of Gutenberg/Webflow-style modular blocks into semantic, responsive HTML string.
 */
export function serializeBlocksToHTML(blocks: ContentBlock[]): string {
  if (!blocks || blocks.length === 0) return "";

  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading": {
          const level = block.level || 2;
          const anchor = block.anchorId || slugifyAnchor(block.text || "");
          const anchorAttr = anchor ? ` id="${anchor}"` : "";
          return `<h${level}${anchorAttr}>${block.text || ""}</h${level}>`;
        }

        case "paragraph": {
          const cleanText = block.text || "";
          if (!cleanText.trim()) return "";
          return `<p>${cleanText}</p>`;
        }

        case "image": {
          if (!block.imageUrl) return "";
          const altAttr = block.altText ? ` alt="${block.altText.replace(/"/g, "&quot;")}"` : ' alt=""';
          const align = block.alignment || "center";
          let alignClass = "my-6 mx-auto text-center";
          if (align === "left") alignClass = "my-6 mr-auto text-left max-w-lg";
          if (align === "right") alignClass = "my-6 ml-auto text-right max-w-lg";
          if (align === "wide") alignClass = "my-8 w-full";

          const captionHtml = block.caption
            ? `<figcaption class="text-center text-xs text-[#c9c2ab]/70 mt-2 italic">${block.caption}</figcaption>`
            : "";

          return `<figure class="${alignClass}"><img src="${block.imageUrl}"${altAttr} class="rounded-xl shadow-lg mx-auto object-cover max-h-[500px] w-full" loading="lazy" />${captionHtml}</figure>`;
        }

        case "list": {
          const items = (block.items || []).filter((i) => i.trim().length > 0);
          if (items.length === 0) return "";
          const listTag = block.listStyle === "numbered" ? "ol" : "ul";
          const listClass = block.listStyle === "numbered" ? "list-decimal pl-6 space-y-2 my-4" : "list-disc pl-6 space-y-2 my-4";
          const liItems = items.map((item) => `<li>${item}</li>`).join("");
          return `<${listTag} class="${listClass}">${liItems}</${listTag}>`;
        }

        case "quote": {
          const boxType = block.boxType || "quote";
          if (boxType === "quote") {
            const citeHtml = block.citation
              ? `<cite class="block text-xs not-italic text-[#d9b45c] mt-2 font-bold tracking-wide">— ${block.citation}</cite>`
              : "";
            return `<blockquote class="border-l-4 border-[#d9b45c] pl-5 my-6 italic text-[#f3ecd8] bg-[#d9b45c]/5 p-4 rounded-r-xl"><p class="text-base">${block.quoteText || ""}</p>${citeHtml}</blockquote>`;
          }

          // Callout boxes: tip, warning, info
          let borderClass = "border-[#d9b45c]/40 bg-[#d9b45c]/10 text-[#f3ecd8]";
          let label = "💡 KEY TAKEAWAY";
          if (boxType === "warning") {
            borderClass = "border-amber-500/40 bg-amber-500/10 text-amber-100";
            label = "⚠️ CAUTION & ADVICE";
          } else if (boxType === "info") {
            borderClass = "border-blue-500/40 bg-blue-500/10 text-blue-100";
            label = "ℹ️ IMPORTANT NOTE";
          }

          return `<div class="callout callout-${boxType} border-l-4 ${borderClass} p-4 rounded-r-xl my-6"><span class="text-[10px] font-bold uppercase tracking-widest block mb-1 opacity-90">${label}</span><p class="text-sm leading-relaxed">${block.quoteText || ""}</p></div>`;
        }

        case "table": {
          const headers = block.headers || [];
          const rows = block.rows || [];
          if (headers.length === 0 && rows.length === 0) return "";

          const theadHtml = headers.length > 0
            ? `<thead class="bg-[#12141b] text-[#d9b45c] text-xs font-bold uppercase tracking-wider"><tr>${headers.map((h) => `<th class="py-3 px-4 border border-[#d9b45c]/20 text-left">${h}</th>`).join("")}</tr></thead>`
            : "";

          const tbodyHtml = `<tbody class="divide-y divide-[#d9b45c]/10 text-xs text-[#c9c2ab]">${rows.map((row) => `<tr>${row.map((cell) => `<td class="py-2.5 px-4 border border-[#d9b45c]/15">${cell}</td>`).join("")}</tr>`).join("")}</tbody>`;

          return `<div class="overflow-x-auto my-6 border border-[#d9b45c]/20 rounded-xl shadow-lg"><table class="min-w-full bg-[#07080b] divide-y divide-[#d9b45c]/20">${theadHtml}${tbodyHtml}</table></div>`;
        }

        case "faq": {
          const items = (block.faqItems || []).filter((item) => item.question && item.question.trim().length > 0);
          if (items.length === 0) return "";

          const itemsHtml = items.map((item) => `
            <div class="faq-item p-4 rounded-xl border border-[#d9b45c]/20 bg-[#12141b]/60 my-3">
              <h4 class="font-bold text-[#d9b45c] text-base mb-1.5">${item.question}</h4>
              <p class="text-sm text-[#c9c2ab] leading-relaxed">${item.answer}</p>
            </div>
          `).join("");

          return `<div class="faq-accordion-block my-6 space-y-3"><div class="text-xs font-extrabold uppercase tracking-widest text-[#d9b45c] mb-2">Frequently Asked Questions</div>${itemsHtml}</div>`;
        }

        case "code": {
          const codeContent = (block.code || "").trim();
          if (!codeContent) return "";
          // Check if it's an embed (iframe or script or div)
          if (codeContent.startsWith("<iframe") || codeContent.startsWith("<div") || codeContent.startsWith("<embed")) {
            return `<div class="custom-embed-block my-6 overflow-hidden rounded-xl">${codeContent}</div>`;
          }
          return `<pre class="bg-[#07080b] p-4 rounded-xl font-mono text-xs overflow-x-auto border border-white/10 my-6 text-[#d9b45c]"><code>${codeContent.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`;
        }

        default:
          return "";
      }
    })
    .filter(Boolean)
    .join("\n\n");
}

/**
 * Parses raw HTML string into structured modular Gutenberg blocks.
 */
export function parseHTMLToBlocks(html: string): ContentBlock[] {
  if (!html || !html.trim()) {
    return [
      {
        id: `blk-${Date.now()}-1`,
        type: "paragraph",
        text: ""
      }
    ];
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${html}</div>`, "text/html");
    const container = doc.body.firstElementChild || doc.body;
    const blocks: ContentBlock[] = [];
    let counter = 1;

    const children = Array.from(container.children);

    if (children.length === 0 && container.textContent?.trim()) {
      return [
        {
          id: `blk-${Date.now()}-1`,
          type: "paragraph",
          text: container.textContent.trim()
        }
      ];
    }

    for (const el of children) {
      const tag = el.tagName.toLowerCase();

      // Heading 2, 3, 4
      if (tag === "h2" || tag === "h3" || tag === "h4") {
        const level = parseInt(tag.charAt(1), 10) as 2 | 3 | 4;
        const text = el.textContent?.trim() || "";
        const anchorId = el.getAttribute("id") || slugifyAnchor(text);
        blocks.push({
          id: `blk-${Date.now()}-${counter++}`,
          type: "heading",
          level,
          text,
          anchorId
        });
        continue;
      }

      // Paragraph
      if (tag === "p") {
        // Check if paragraph contains only an image
        const img = el.querySelector("img");
        if (img && el.children.length === 1 && !el.textContent?.trim()) {
          blocks.push({
            id: `blk-${Date.now()}-${counter++}`,
            type: "image",
            imageUrl: img.getAttribute("src") || "",
            altText: img.getAttribute("alt") || "",
            caption: img.getAttribute("title") || "",
            alignment: "center"
          });
          continue;
        }

        blocks.push({
          id: `blk-${Date.now()}-${counter++}`,
          type: "paragraph",
          text: el.innerHTML || el.textContent || ""
        });
        continue;
      }

      // Figure / Image
      if (tag === "figure") {
        const img = el.querySelector("img");
        const caption = el.querySelector("figcaption")?.textContent?.trim() || "";
        if (img) {
          blocks.push({
            id: `blk-${Date.now()}-${counter++}`,
            type: "image",
            imageUrl: img.getAttribute("src") || "",
            altText: img.getAttribute("alt") || "",
            caption,
            alignment: "center"
          });
          continue;
        }
      }

      if (tag === "img") {
        blocks.push({
          id: `blk-${Date.now()}-${counter++}`,
          type: "image",
          imageUrl: el.getAttribute("src") || "",
          altText: el.getAttribute("alt") || "",
          caption: el.getAttribute("title") || "",
          alignment: "center"
        });
        continue;
      }

      // Lists
      if (tag === "ul" || tag === "ol") {
        const items = Array.from(el.querySelectorAll("li")).map((li) => li.innerHTML || li.textContent || "");
        blocks.push({
          id: `blk-${Date.now()}-${counter++}`,
          type: "list",
          listStyle: tag === "ol" ? "numbered" : "bullet",
          items: items.length > 0 ? items : [""]
        });
        continue;
      }

      // Blockquote / Callout
      if (tag === "blockquote") {
        const citeEl = el.querySelector("cite");
        const citation = citeEl?.textContent?.trim() || "";
        const clone = el.cloneNode(true) as HTMLElement;
        const cloneCite = clone.querySelector("cite");
        if (cloneCite) cloneCite.remove();
        const quoteText = clone.textContent?.trim() || "";

        blocks.push({
          id: `blk-${Date.now()}-${counter++}`,
          type: "quote",
          boxType: "quote",
          quoteText,
          citation
        });
        continue;
      }

      // Callout Div
      if (el.classList.contains("callout") || el.classList.contains("callout-box")) {
        let boxType: "quote" | "tip" | "warning" | "info" = "tip";
        if (el.classList.contains("callout-warning")) boxType = "warning";
        if (el.classList.contains("callout-info")) boxType = "info";
        blocks.push({
          id: `blk-${Date.now()}-${counter++}`,
          type: "quote",
          boxType,
          quoteText: el.querySelector("p")?.textContent?.trim() || el.textContent?.trim() || ""
        });
        continue;
      }

      // FAQ Accordion Block
      if (el.classList.contains("faq-accordion-block") || el.classList.contains("faq-block")) {
        const itemEls = el.querySelectorAll(".faq-item");
        const faqItems: Array<{ question: string; answer: string }> = [];
        itemEls.forEach((item) => {
          const q = item.querySelector("h4, h3, strong")?.textContent?.trim() || "";
          const a = item.querySelector("p")?.textContent?.trim() || "";
          if (q) faqItems.push({ question: q, answer: a });
        });
        if (faqItems.length > 0) {
          blocks.push({
            id: `blk-${Date.now()}-${counter++}`,
            type: "faq",
            faqItems
          });
          continue;
        }
      }

      // Table
      if (tag === "table" || el.querySelector("table")) {
        const table = tag === "table" ? el : el.querySelector("table")!;
        const headers = Array.from(table.querySelectorAll("thead th, thead td")).map((h) => h.textContent?.trim() || "");
        const rows = Array.from(table.querySelectorAll("tbody tr")).map((tr) =>
          Array.from(tr.querySelectorAll("td, th")).map((c) => c.textContent?.trim() || "")
        );
        blocks.push({
          id: `blk-${Date.now()}-${counter++}`,
          type: "table",
          headers: headers.length > 0 ? headers : ["Header 1", "Header 2", "Header 3"],
          rows: rows.length > 0 ? rows : [["Sample 1", "Sample 2", "Sample 3"]]
        });
        continue;
      }

      // Code / Embed
      if (tag === "pre" || tag === "code" || el.classList.contains("custom-embed-block")) {
        blocks.push({
          id: `blk-${Date.now()}-${counter++}`,
          type: "code",
          code: el.textContent?.trim() || el.innerHTML || ""
        });
        continue;
      }

      // Fallback: parse as paragraph
      if (el.textContent?.trim()) {
        blocks.push({
          id: `blk-${Date.now()}-${counter++}`,
          type: "paragraph",
          text: el.innerHTML || el.textContent || ""
        });
      }
    }

    if (blocks.length === 0) {
      return [
        {
          id: `blk-${Date.now()}-1`,
          type: "paragraph",
          text: html
        }
      ];
    }

    return blocks;
  } catch (e) {
    return [
      {
        id: `blk-${Date.now()}-1`,
        type: "paragraph",
        text: html
      }
    ];
  }
}

/**
 * Calculates dynamic reading time based on 200 words per minute.
 * Bounded between 1 and 15+ minutes.
 */
export function calculateReadingTime(contentOrBlocks: string | ContentBlock[]): {
  words: number;
  readTime: string;
  minutes: number;
} {
  let text = "";
  if (Array.isArray(contentOrBlocks)) {
    text = contentOrBlocks
      .map((b) => {
        if (b.type === "paragraph" || b.type === "heading") return b.text || "";
        if (b.type === "list") return (b.items || []).join(" ");
        if (b.type === "quote") return b.quoteText || "";
        if (b.type === "faq") return (b.faqItems || []).map((f) => `${f.question} ${f.answer}`).join(" ");
        if (b.type === "table") return (b.headers || []).join(" ") + " " + (b.rows || []).flat().join(" ");
        return "";
      })
      .join(" ");
  } else {
    text = (contentOrBlocks || "").replace(/<[^>]*>/g, " ");
  }

  const cleanWords = text.trim() ? text.trim().split(/\s+/).filter(Boolean) : [];
  const words = cleanWords.length;
  // 200 words per minute standard reading speed
  const calculatedMins = Math.ceil(words / 200);
  const minutes = Math.max(1, Math.min(15, calculatedMins || 1));
  const readTime = `${minutes} min read`;

  return { words, readTime, minutes };
}

/**
 * Builds clean, valid Schema.org JSON-LD structure including Article, Breadcrumbs, and FAQPage.
 */
export function generateAutoSchemaJson(post: BlogPost): any {
  const domain = "https://truthquranacademy.com";
  const postUrl = `${domain}/blog/${post.slug || post.id}`;
  const imageUrl = post.featuredImage || post.coverImage || `${domain}/logo.png`;

  // 1. Article Schema
  const articleSchema: any = {
    "@type": "BlogPosting",
    "@id": `${postUrl}#article`,
    "isPartOf": {
      "@type": "WebPage",
      "@id": postUrl
    },
    "headline": post.title,
    "description": post.excerpt || post.metaDescription,
    "image": [imageUrl],
    "datePublished": post.date || post.publishDate || new Date().toISOString().split("T")[0],
    "dateModified": post.lastUpdated || post.date || new Date().toISOString().split("T")[0],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl
    },
    "author": {
      "@type": "Person",
      "name": post.author?.name || "Muhammad Zain",
      "jobTitle": post.author?.role || "Senior Quran Scholar"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Truth Quran Academy",
      "url": domain,
      "logo": {
        "@type": "ImageObject",
        "url": `${domain}/logo.png`,
        "width": 512,
        "height": 512
      }
    }
  };

  if (post.wordCount) {
    articleSchema["wordCount"] = post.wordCount;
  }

  // 2. Breadcrumbs Schema
  const breadcrumbSchema: any = {
    "@type": "BreadcrumbList",
    "@id": `${postUrl}#breadcrumb`,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": domain
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${domain}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.category || "Tajweed Rules",
        "item": `${domain}/category/${slugifyAnchor(post.category || "tajweed-rules")}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": post.title,
        "item": postUrl
      }
    ]
  };

  // 3. Extract FAQ items if present in blocks or content
  let faqList: Array<{ question: string; answer: string }> = [];
  if (post.blocks && Array.isArray(post.blocks)) {
    post.blocks.forEach((b) => {
      if (b.type === "faq" && b.faqItems) {
        faqList.push(...b.faqItems);
      }
    });
  }

  const graph: any[] = [articleSchema, breadcrumbSchema];

  if (faqList.length > 0) {
    const faqSchema: any = {
      "@type": "FAQPage",
      "@id": `${postUrl}#faq`,
      "mainEntity": faqList.map((item) => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };
    graph.push(faqSchema);
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}
