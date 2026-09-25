import React, { useState, useEffect, useRef } from "react";
import { 
  ContentBlock, 
  ContentBlockType, 
  BlogPost 
} from "../types";
import { 
  serializeBlocksToHTML, 
  parseHTMLToBlocks, 
  calculateReadingTime, 
  slugifyAnchor,
  generateAutoSchemaJson
} from "../utils/blockParser";
import { WPMediaLibraryModal } from "./WPMediaLibraryModal";
import { CMSData, WPMedia } from "../cmsStore";
import { 
  Type, 
  Heading, 
  Image as ImageIcon, 
  List, 
  ListOrdered, 
  Quote, 
  Table as TableIcon, 
  HelpCircle, 
  Code, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Copy, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Maximize2, 
  Bold, 
  Italic, 
  Underline, 
  Link2, 
  Eye, 
  Sparkles, 
  AlertCircle, 
  Check, 
  X,
  Clock,
  Layers,
  FileCode,
  CheckCircle2,
  ExternalLink
} from "lucide-react";

interface WPBlockCanvasProps {
  post: BlogPost;
  onChange: (updatedPost: BlogPost) => void;
  cmsData: CMSData;
}

export default function WPBlockCanvas({ post, onChange, cmsData }: WPBlockCanvasProps) {
  // Initialize blocks from post.blocks or parse from post.content
  const [blocks, setBlocks] = useState<ContentBlock[]>(() => {
    if (post.blocks && post.blocks.length > 0) {
      return post.blocks;
    }
    if (post.content && post.content.trim()) {
      return parseHTMLToBlocks(post.content);
    }
    return [
      {
        id: `blk-${Date.now()}-1`,
        type: "paragraph",
        text: ""
      }
    ];
  });

  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [isBlockPickerOpen, setIsBlockPickerOpen] = useState(false);
  const [insertAtIndex, setInsertAtIndex] = useState<number | null>(null);
  const [mediaPickerTargetBlockId, setMediaPickerTargetBlockId] = useState<string | null>(null);

  // Sync state when external post changes
  useEffect(() => {
    if (post.blocks && post.blocks.length > 0) {
      setBlocks(post.blocks);
    } else if (post.content && post.content.trim()) {
      const parsed = parseHTMLToBlocks(post.content);
      setBlocks(parsed);
    }
  }, [post.id]);

  // Synchronize changes back to the parent post
  const updateBlocksAndSync = (newBlocks: ContentBlock[]) => {
    setBlocks(newBlocks);
    const htmlContent = serializeBlocksToHTML(newBlocks);
    const { words, readTime } = calculateReadingTime(newBlocks);
    const autoSchema = generateAutoSchemaJson({
      ...post,
      blocks: newBlocks,
      content: htmlContent,
      wordCount: words,
      readTime
    });

    onChange({
      ...post,
      blocks: newBlocks,
      content: htmlContent,
      wordCount: words,
      readTime,
      customSchemaJson: JSON.stringify(autoSchema, null, 2)
    });
  };

  // Add new block
  const handleAddBlock = (type: ContentBlockType, atIndex?: number) => {
    const newId = `blk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    let newBlock: ContentBlock;

    switch (type) {
      case "heading":
        newBlock = {
          id: newId,
          type: "heading",
          level: 2,
          text: "",
          anchorId: ""
        };
        break;
      case "image":
        newBlock = {
          id: newId,
          type: "image",
          imageUrl: "",
          altText: "",
          caption: "",
          alignment: "center"
        };
        break;
      case "list":
        newBlock = {
          id: newId,
          type: "list",
          listStyle: "bullet",
          items: [""]
        };
        break;
      case "quote":
        newBlock = {
          id: newId,
          type: "quote",
          boxType: "quote",
          quoteText: "",
          citation: ""
        };
        break;
      case "table":
        newBlock = {
          id: newId,
          type: "table",
          headers: ["Topic / Rule", "Arabic Example", "Explanation"],
          rows: [
            ["Noon Sakinah", "مَنْ يَقُولُ", "Idgham with Ghunnah"],
            ["Qalqalah", "قُلْ هُوَ اللَّهُ أَحَدٌ", "Echoing sound on Daal"]
          ]
        };
        break;
      case "faq":
        newBlock = {
          id: newId,
          type: "faq",
          faqItems: [
            { question: "What is the recommended age to begin Tajweed?", answer: "Children can comfortably begin from 4 to 5 years of age with Noorani Qaida foundational phonetics." }
          ]
        };
        break;
      case "code":
        newBlock = {
          id: newId,
          type: "code",
          code: '<div class="custom-widget">\n  <!-- Enter HTML Embed or Widget Code -->\n</div>',
          language: "html"
        };
        break;
      case "paragraph":
      default:
        newBlock = {
          id: newId,
          type: "paragraph",
          text: ""
        };
        break;
    }

    const nextBlocks = [...blocks];
    const targetIdx = atIndex !== undefined && atIndex !== null ? atIndex : nextBlocks.length;
    nextBlocks.splice(targetIdx, 0, newBlock);

    updateBlocksAndSync(nextBlocks);
    setActiveBlockId(newId);
    setIsBlockPickerOpen(false);
    setInsertAtIndex(null);
  };

  // Block field updates
  const handleUpdateBlock = (id: string, updates: Partial<ContentBlock>) => {
    const updated = blocks.map((b) => {
      if (b.id !== id) return b;
      const merged = { ...b, ...updates };
      // If heading text changed and anchor was empty, auto-generate anchor
      if (merged.type === "heading" && updates.text !== undefined && !merged.anchorId) {
        merged.anchorId = slugifyAnchor(updates.text);
      }
      return merged;
    });
    updateBlocksAndSync(updated);
  };

  // Move block up or down
  const handleMoveBlock = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === blocks.length - 1) return;

    const newBlocks = [...blocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;

    updateBlocksAndSync(newBlocks);
  };

  // Duplicate block
  const handleDuplicateBlock = (index: number) => {
    const original = blocks[index];
    const duplicate: ContentBlock = {
      ...JSON.parse(JSON.stringify(original)),
      id: `blk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, duplicate);
    updateBlocksAndSync(newBlocks);
    setActiveBlockId(duplicate.id);
  };

  // Delete block
  const handleDeleteBlock = (id: string) => {
    if (blocks.length <= 1) {
      // Keep at least one empty paragraph
      const resetBlocks: ContentBlock[] = [
        {
          id: `blk-${Date.now()}`,
          type: "paragraph",
          text: ""
        }
      ];
      updateBlocksAndSync(resetBlocks);
      setActiveBlockId(resetBlocks[0].id);
      return;
    }
    const filtered = blocks.filter((b) => b.id !== id);
    updateBlocksAndSync(filtered);
    if (activeBlockId === id) {
      setActiveBlockId(null);
    }
  };

  // Media Library Selection callback
  const handleMediaSelect = (mediaItem: WPMedia) => {
    if (mediaPickerTargetBlockId) {
      handleUpdateBlock(mediaPickerTargetBlockId, {
        imageUrl: mediaItem.url,
        altText: mediaItem.alt || mediaItem.title || "",
        caption: mediaItem.caption || ""
      });
      setMediaPickerTargetBlockId(null);
    }
  };

  return (
    <div className="w-full flex flex-col font-sans select-none">
      {/* Top Block Editor Header & Quick Stats */}
      <div className="bg-[#12141b] border border-[#d9b45c]/20 rounded-xl p-3 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-lg bg-[#d9b45c]/10 text-[#d9b45c] flex items-center justify-center font-bold text-xs border border-[#d9b45c]/30">
            <Layers size={14} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#f3ecd8] uppercase tracking-wider">
              Modular Gutenberg & Webflow Block Canvas
            </h3>
            <p className="text-[10px] text-[#c9c2ab]/70">
              Drag, reorder, and configure individual modular content blocks with instant Schema & SEO sync.
            </p>
          </div>
        </div>

        {/* Dynamic Word Count & Reading Time Badges */}
        <div className="flex items-center space-x-3 text-xs">
          <span className="px-2.5 py-1 rounded bg-[#07080b] border border-[#d9b45c]/20 text-[#c9c2ab] flex items-center gap-1.5 text-[11px]">
            <Clock size={12} className="text-[#d9b45c]" />
            <strong className="text-white">{post.readTime || "1 min read"}</strong>
          </span>
          <span className="px-2.5 py-1 rounded bg-[#07080b] border border-[#d9b45c]/20 text-[#c9c2ab] flex items-center gap-1.5 text-[11px]">
            <Type size={12} className="text-[#d9b45c]" />
            <strong className="text-white">{post.wordCount || 0}</strong> words
          </span>
          <button
            type="button"
            onClick={() => {
              setInsertAtIndex(blocks.length);
              setIsBlockPickerOpen(true);
            }}
            className="px-3 py-1.5 rounded bg-[#d9b45c] text-black font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-1 hover:bg-white transition-all cursor-pointer shadow-md"
          >
            <Plus size={13} />
            <span>Add Block</span>
          </button>
        </div>
      </div>

      {/* Main Blocks Stream */}
      <div className="space-y-4">
        {blocks.map((block, index) => {
          const isActive = activeBlockId === block.id;

          return (
            <div
              key={block.id}
              onClick={() => setActiveBlockId(block.id)}
              className={`relative rounded-xl border transition-all duration-200 group text-left ${
                isActive
                  ? "border-[#d9b45c] bg-[#12141b]/95 shadow-[0_4px_25px_rgba(217,180,92,0.12)] ring-1 ring-[#d9b45c]/40"
                  : "border-white/10 bg-[#0e1015]/80 hover:border-[#d9b45c]/40"
              }`}
            >
              {/* Block Action Controls Bar (Top Header of Block) */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-[#07080b]/50 rounded-t-xl text-[10px] text-[#c9c2ab]">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded bg-[#d9b45c]/10 text-[#d9b45c] flex items-center justify-center font-bold text-[10px]">
                    {index + 1}
                  </span>
                  <span className="font-bold uppercase tracking-wider text-[#d9b45c]">
                    {block.type === "paragraph" && "Paragraph"}
                    {block.type === "heading" && `Heading (H${block.level || 2})`}
                    {block.type === "image" && "Image & Media"}
                    {block.type === "list" && (block.listStyle === "numbered" ? "Numbered List" : "Bullet List")}
                    {block.type === "quote" && (block.boxType === "quote" ? "Blockquote" : `Callout (${block.boxType || "tip"})`)}
                    {block.type === "table" && "Responsive Table"}
                    {block.type === "faq" && "FAQ Accordion (Schema.org)"}
                    {block.type === "code" && "Custom Code / HTML Embed"}
                  </span>
                </div>

                {/* Up/Down/Duplicate/Delete Buttons */}
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    title="Move Block Up"
                    disabled={index === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveBlock(index, "up");
                    }}
                    className="p-1 rounded hover:bg-white/10 text-[#c9c2ab] hover:text-white disabled:opacity-20 cursor-pointer"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    type="button"
                    title="Move Block Down"
                    disabled={index === blocks.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveBlock(index, "down");
                    }}
                    className="p-1 rounded hover:bg-white/10 text-[#c9c2ab] hover:text-white disabled:opacity-20 cursor-pointer"
                  >
                    <ChevronDown size={14} />
                  </button>
                  <button
                    type="button"
                    title="Duplicate Block"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicateBlock(index);
                    }}
                    className="p-1 rounded hover:bg-white/10 text-[#c9c2ab] hover:text-white cursor-pointer"
                  >
                    <Copy size={13} />
                  </button>
                  <button
                    type="button"
                    title="Insert Block Below"
                    onClick={(e) => {
                      e.stopPropagation();
                      setInsertAtIndex(index + 1);
                      setIsBlockPickerOpen(true);
                    }}
                    className="p-1 rounded hover:bg-[#d9b45c]/20 text-[#d9b45c] cursor-pointer"
                  >
                    <Plus size={13} />
                  </button>
                  <button
                    type="button"
                    title="Delete Block"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBlock(block.id);
                    }}
                    className="p-1 rounded hover:bg-red-500/20 text-red-400 cursor-pointer ml-1"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Block Content Body */}
              <div className="p-4">
                {/* 1. PARAGRAPH BLOCK */}
                {block.type === "paragraph" && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-1 pb-1 text-xs text-[#c9c2ab]/60">
                      <span className="text-[10px] uppercase font-bold text-[#c9c2ab]/40">Rich Text Formatter</span>
                    </div>
                    <textarea
                      rows={3}
                      value={block.text || ""}
                      onChange={(e) => handleUpdateBlock(block.id, { text: e.target.value })}
                      placeholder="Write your paragraph text here... HTML formatting such as <strong>, <em>, and <a href='...'> are fully supported."
                      className="w-full bg-[#07080b] border border-white/10 rounded-lg p-3 text-xs md:text-sm text-[#f3ecd8] placeholder-[#c9c2ab]/30 leading-relaxed outline-none focus:border-[#d9b45c] font-sans resize-y"
                    />
                  </div>
                )}

                {/* 2. HEADING BLOCK */}
                {block.type === "heading" && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-1 bg-[#07080b] p-1 rounded-lg border border-white/10">
                        {([2, 3, 4] as const).map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => handleUpdateBlock(block.id, { level: lvl })}
                            className={`px-2.5 py-1 rounded text-xs font-bold ${
                              (block.level || 2) === lvl
                                ? "bg-[#d9b45c] text-black"
                                : "text-[#c9c2ab] hover:text-white"
                            }`}
                          >
                            H{lvl}
                          </button>
                        ))}
                      </div>

                      {/* Anchor ID for Table of Contents */}
                      <div className="flex items-center space-x-1.5 text-xs">
                        <span className="text-[10px] text-[#c9c2ab] uppercase font-bold">Anchor ID:</span>
                        <input
                          type="text"
                          value={block.anchorId || ""}
                          onChange={(e) => handleUpdateBlock(block.id, { anchorId: slugifyAnchor(e.target.value) })}
                          placeholder="e.g. tajweed-rules"
                          className="bg-[#07080b] border border-white/10 rounded px-2 py-1 text-[11px] text-[#f2d98a] font-mono outline-none focus:border-[#d9b45c] w-36"
                        />
                      </div>
                    </div>

                    <input
                      type="text"
                      value={block.text || ""}
                      onChange={(e) => handleUpdateBlock(block.id, { text: e.target.value })}
                      placeholder={`Enter H${block.level || 2} heading text...`}
                      className="w-full bg-[#07080b] border border-white/10 rounded-lg p-3 text-base md:text-lg font-bold text-[#d9b45c] placeholder-[#c9c2ab]/30 outline-none focus:border-[#d9b45c]"
                    />
                  </div>
                )}

                {/* 3. IMAGE BLOCK */}
                {block.type === "image" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-[#c9c2ab] uppercase font-bold block mb-1">
                          Image Source URL
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={block.imageUrl || ""}
                            onChange={(e) => handleUpdateBlock(block.id, { imageUrl: e.target.value })}
                            placeholder="https://... or select from library"
                            className="flex-1 bg-[#07080b] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#d9b45c]"
                          />
                          <button
                            type="button"
                            onClick={() => setMediaPickerTargetBlockId(block.id)}
                            className="px-3 py-2 bg-[#d9b45c]/20 hover:bg-[#d9b45c] text-[#d9b45c] hover:text-black rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer"
                          >
                            Media Library
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-[#c9c2ab] uppercase font-bold block mb-1">
                          Custom Alt Text <span className="text-[#d9b45c] font-normal">(SEO & Accessibility)</span>
                        </label>
                        <input
                          type="text"
                          value={block.altText || ""}
                          onChange={(e) => handleUpdateBlock(block.id, { altText: e.target.value })}
                          placeholder="Descriptive image keywords for Google Image Search..."
                          className="w-full bg-[#07080b] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#d9b45c]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-[#c9c2ab] uppercase font-bold block mb-1">
                          Image Caption
                        </label>
                        <input
                          type="text"
                          value={block.caption || ""}
                          onChange={(e) => handleUpdateBlock(block.id, { caption: e.target.value })}
                          placeholder="Optional visible caption below image..."
                          className="w-full bg-[#07080b] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#d9b45c]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-[#c9c2ab] uppercase font-bold block mb-1">
                          Alignment
                        </label>
                        <div className="flex items-center space-x-1 bg-[#07080b] p-1 rounded-lg border border-white/10">
                          {(["center", "left", "right", "wide"] as const).map((align) => (
                            <button
                              key={align}
                              type="button"
                              onClick={() => handleUpdateBlock(block.id, { alignment: align })}
                              className={`flex-1 py-1 rounded text-[11px] font-bold uppercase ${
                                (block.alignment || "center") === align
                                  ? "bg-[#d9b45c] text-black"
                                  : "text-[#c9c2ab] hover:text-white"
                              }`}
                            >
                              {align}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Image Preview */}
                    {block.imageUrl && (
                      <div className="mt-2 p-2 bg-[#07080b] rounded-lg border border-white/5 flex flex-col items-center">
                        <img
                          src={block.imageUrl}
                          alt={block.altText || ""}
                          className="max-h-48 rounded object-cover shadow-md"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600";
                          }}
                        />
                        {block.caption && (
                          <span className="text-[10px] text-[#c9c2ab]/70 italic mt-1.5">{block.caption}</span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 4. BULLET & NUMBERED LIST BLOCK */}
                {block.type === "list" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 bg-[#07080b] p-1 rounded-lg border border-white/10">
                        <button
                          type="button"
                          onClick={() => handleUpdateBlock(block.id, { listStyle: "bullet" })}
                          className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 ${
                            block.listStyle !== "numbered"
                              ? "bg-[#d9b45c] text-black"
                              : "text-[#c9c2ab] hover:text-white"
                          }`}
                        >
                          <List size={13} />
                          <span>Bullet List</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateBlock(block.id, { listStyle: "numbered" })}
                          className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 ${
                            block.listStyle === "numbered"
                              ? "bg-[#d9b45c] text-black"
                              : "text-[#c9c2ab] hover:text-white"
                          }`}
                        >
                          <ListOrdered size={13} />
                          <span>Numbered List</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const currentItems = block.items || [];
                          handleUpdateBlock(block.id, { items: [...currentItems, ""] });
                        }}
                        className="px-2.5 py-1 bg-[#d9b45c]/20 hover:bg-[#d9b45c] text-[#d9b45c] hover:text-black rounded text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Plus size={12} />
                        <span>Add Item</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(block.items || [""]).map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-center space-x-2">
                          <span className="w-5 text-center text-[#d9b45c] font-bold text-xs">
                            {block.listStyle === "numbered" ? `${itemIdx + 1}.` : "•"}
                          </span>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const newItems = [...(block.items || [])];
                              newItems[itemIdx] = e.target.value;
                              handleUpdateBlock(block.id, { items: newItems });
                            }}
                            placeholder={`List item ${itemIdx + 1}...`}
                            className="flex-1 bg-[#07080b] border border-white/10 rounded px-3 py-1.5 text-xs text-white outline-none focus:border-[#d9b45c]"
                          />
                          {(block.items || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newItems = (block.items || []).filter((_, i) => i !== itemIdx);
                                handleUpdateBlock(block.id, { items: newItems });
                              }}
                              className="p-1 text-red-400/60 hover:text-red-400 cursor-pointer"
                              title="Delete Item"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. BLOCKQUOTE / CALLOUT BOX */}
                {block.type === "quote" && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-1 bg-[#07080b] p-1 rounded-lg border border-white/10 w-fit">
                      {(["quote", "tip", "warning", "info"] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleUpdateBlock(block.id, { boxType: type })}
                          className={`px-3 py-1 rounded text-xs font-bold uppercase ${
                            (block.boxType || "quote") === type
                              ? "bg-[#d9b45c] text-black"
                              : "text-[#c9c2ab] hover:text-white"
                          }`}
                        >
                          {type === "quote" && "Classic Quote"}
                          {type === "tip" && "💡 Key Takeaway"}
                          {type === "warning" && "⚠️ Caution"}
                          {type === "info" && "ℹ️ Info Note"}
                        </button>
                      ))}
                    </div>

                    <textarea
                      rows={3}
                      value={block.quoteText || ""}
                      onChange={(e) => handleUpdateBlock(block.id, { quoteText: e.target.value })}
                      placeholder="Enter quote or callout text..."
                      className="w-full bg-[#07080b] border border-white/10 rounded-lg p-3 text-xs md:text-sm text-[#f3ecd8] placeholder-[#c9c2ab]/30 italic leading-relaxed outline-none focus:border-[#d9b45c]"
                    />

                    {block.boxType === "quote" && (
                      <div>
                        <label className="text-[10px] text-[#c9c2ab] uppercase font-bold block mb-1">
                          Citation / Author (e.g. Sahih al-Bukhari, Sheikh Al-Husary)
                        </label>
                        <input
                          type="text"
                          value={block.citation || ""}
                          onChange={(e) => handleUpdateBlock(block.id, { citation: e.target.value })}
                          placeholder="Source or speaker..."
                          className="w-full bg-[#07080b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#d9b45c]"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* 6. RESPONSIVE TABLE BUILDER */}
                {block.type === "table" && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[10px] uppercase font-bold text-[#d9b45c]">
                        Mobile-Responsive Table Builder
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            const headers = block.headers || [];
                            const rows = block.rows || [];
                            handleUpdateBlock(block.id, {
                              headers: [...headers, `Column ${headers.length + 1}`],
                              rows: rows.map((r) => [...r, ""])
                            });
                          }}
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded text-[10px] font-bold text-white cursor-pointer"
                        >
                          + Add Column
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const headers = block.headers || ["Col 1", "Col 2"];
                            const rows = block.rows || [];
                            handleUpdateBlock(block.id, {
                              rows: [...rows, new Array(headers.length).fill("")]
                            });
                          }}
                          className="px-2.5 py-1 bg-[#d9b45c]/20 hover:bg-[#d9b45c] text-[#d9b45c] hover:text-black rounded text-[10px] font-bold transition-all cursor-pointer"
                        >
                          + Add Row
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto border border-white/10 rounded-xl">
                      <table className="min-w-full divide-y divide-white/10 bg-[#07080b] text-xs">
                        <thead className="bg-[#12141b]">
                          <tr>
                            {(block.headers || []).map((h, colIdx) => (
                              <th key={colIdx} className="p-2 border-r border-white/10 text-left">
                                <input
                                  type="text"
                                  value={h}
                                  onChange={(e) => {
                                    const nextH = [...(block.headers || [])];
                                    nextH[colIdx] = e.target.value;
                                    handleUpdateBlock(block.id, { headers: nextH });
                                  }}
                                  className="w-full bg-transparent font-bold text-[#d9b45c] outline-none text-xs"
                                />
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {(block.rows || []).map((row, rIdx) => (
                            <tr key={rIdx}>
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="p-2 border-r border-white/10">
                                  <input
                                    type="text"
                                    value={cell}
                                    onChange={(e) => {
                                      const nextRows = (block.rows || []).map((r, i) =>
                                        i === rIdx
                                          ? r.map((c, j) => (j === cIdx ? e.target.value : c))
                                          : r
                                      );
                                      handleUpdateBlock(block.id, { rows: nextRows });
                                    }}
                                    className="w-full bg-transparent text-white outline-none text-xs"
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 7. FAQ ACCORDION BLOCK */}
                {block.type === "faq" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] uppercase font-bold text-[#d9b45c]">
                          FAQ Accordion Pairs
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                          Schema.org FAQPage Compatible
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const items = block.faqItems || [];
                          handleUpdateBlock(block.id, {
                            faqItems: [...items, { question: "", answer: "" }]
                          });
                        }}
                        className="px-2.5 py-1 bg-[#d9b45c]/20 hover:bg-[#d9b45c] text-[#d9b45c] hover:text-black rounded text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Plus size={12} />
                        <span>Add Question</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(block.faqItems || []).map((faq, fIdx) => (
                        <div key={fIdx} className="p-3 bg-[#07080b] rounded-xl border border-white/10 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold text-[#d9b45c] uppercase">Q{fIdx + 1}:</span>
                            <input
                              type="text"
                              value={faq.question}
                              onChange={(e) => {
                                const nextFaqs = [...(block.faqItems || [])];
                                nextFaqs[fIdx] = { ...nextFaqs[fIdx], question: e.target.value };
                                handleUpdateBlock(block.id, { faqItems: nextFaqs });
                              }}
                              placeholder="Enter frequently asked question..."
                              className="flex-1 bg-transparent border-b border-white/10 pb-1 text-xs font-bold text-white outline-none focus:border-[#d9b45c]"
                            />
                            {(block.faqItems || []).length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const nextFaqs = (block.faqItems || []).filter((_, i) => i !== fIdx);
                                  handleUpdateBlock(block.id, { faqItems: nextFaqs });
                                }}
                                className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                                title="Delete Question"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                          <div>
                            <textarea
                              rows={2}
                              value={faq.answer}
                              onChange={(e) => {
                                const nextFaqs = [...(block.faqItems || [])];
                                nextFaqs[fIdx] = { ...nextFaqs[fIdx], answer: e.target.value };
                                handleUpdateBlock(block.id, { faqItems: nextFaqs });
                              }}
                              placeholder="Provide clear, concise answer..."
                              className="w-full bg-transparent border border-white/5 rounded p-2 text-xs text-[#c9c2ab] outline-none focus:border-[#d9b45c]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 8. CODE / CUSTOM HTML EMBED BLOCK */}
                {block.type === "code" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-[#d9b45c]">
                        Embed HTML / YouTube iFrame / Custom Widget
                      </span>
                      <span className="text-[10px] text-[#c9c2ab]/50 font-mono">HTML / JS / CSS</span>
                    </div>
                    <textarea
                      rows={5}
                      value={block.code || ""}
                      onChange={(e) => handleUpdateBlock(block.id, { code: e.target.value })}
                      placeholder="Paste <iframe>, <script>, or custom widget HTML here..."
                      className="w-full bg-[#07080b] border border-white/10 rounded-lg p-3 font-mono text-xs text-[#d9b45c] outline-none focus:border-[#d9b45c]"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Add Block Trigger */}
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => {
            setInsertAtIndex(blocks.length);
            setIsBlockPickerOpen(true);
          }}
          className="px-5 py-2.5 rounded-full border-2 border-dashed border-[#d9b45c]/40 hover:border-[#d9b45c] text-[#d9b45c] bg-[#12141b]/60 hover:bg-[#12141b] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:scale-105"
        >
          <Plus size={16} />
          <span>Insert New Content Block</span>
        </button>
      </div>

      {/* Block Picker Modal */}
      {isBlockPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#12141b] border border-[#d9b45c]/30 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles size={16} className="text-[#d9b45c]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Select Content Block to Insert
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsBlockPickerOpen(false)}
                className="text-[#c9c2ab] hover:text-white p-1 rounded"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <button
                type="button"
                onClick={() => handleAddBlock("paragraph", insertAtIndex ?? undefined)}
                className="p-3 rounded-xl bg-[#07080b] border border-white/10 hover:border-[#d9b45c] hover:bg-[#d9b45c]/10 flex flex-col items-center space-y-2 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#d9b45c]/10 text-[#d9b45c] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Type size={16} />
                </div>
                <span className="text-xs font-bold text-white">Paragraph</span>
                <span className="text-[9px] text-[#c9c2ab]/60">Rich text</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddBlock("heading", insertAtIndex ?? undefined)}
                className="p-3 rounded-xl bg-[#07080b] border border-white/10 hover:border-[#d9b45c] hover:bg-[#d9b45c]/10 flex flex-col items-center space-y-2 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#d9b45c]/10 text-[#d9b45c] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heading size={16} />
                </div>
                <span className="text-xs font-bold text-white">Heading</span>
                <span className="text-[9px] text-[#c9c2ab]/60">H2, H3, H4</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddBlock("image", insertAtIndex ?? undefined)}
                className="p-3 rounded-xl bg-[#07080b] border border-white/10 hover:border-[#d9b45c] hover:bg-[#d9b45c]/10 flex flex-col items-center space-y-2 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#d9b45c]/10 text-[#d9b45c] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ImageIcon size={16} />
                </div>
                <span className="text-xs font-bold text-white">Image</span>
                <span className="text-[9px] text-[#c9c2ab]/60">With Alt Text</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddBlock("list", insertAtIndex ?? undefined)}
                className="p-3 rounded-xl bg-[#07080b] border border-white/10 hover:border-[#d9b45c] hover:bg-[#d9b45c]/10 flex flex-col items-center space-y-2 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#d9b45c]/10 text-[#d9b45c] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <List size={16} />
                </div>
                <span className="text-xs font-bold text-white">List</span>
                <span className="text-[9px] text-[#c9c2ab]/60">Bullet & 1, 2, 3</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddBlock("quote", insertAtIndex ?? undefined)}
                className="p-3 rounded-xl bg-[#07080b] border border-white/10 hover:border-[#d9b45c] hover:bg-[#d9b45c]/10 flex flex-col items-center space-y-2 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#d9b45c]/10 text-[#d9b45c] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Quote size={16} />
                </div>
                <span className="text-xs font-bold text-white">Callout / Quote</span>
                <span className="text-[9px] text-[#c9c2ab]/60">Takeaway boxes</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddBlock("table", insertAtIndex ?? undefined)}
                className="p-3 rounded-xl bg-[#07080b] border border-white/10 hover:border-[#d9b45c] hover:bg-[#d9b45c]/10 flex flex-col items-center space-y-2 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#d9b45c]/10 text-[#d9b45c] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TableIcon size={16} />
                </div>
                <span className="text-xs font-bold text-white">Table</span>
                <span className="text-[9px] text-[#c9c2ab]/60">Responsive grid</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddBlock("faq", insertAtIndex ?? undefined)}
                className="p-3 rounded-xl bg-[#07080b] border border-white/10 hover:border-[#d9b45c] hover:bg-[#d9b45c]/10 flex flex-col items-center space-y-2 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#d9b45c]/10 text-[#d9b45c] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <HelpCircle size={16} />
                </div>
                <span className="text-xs font-bold text-white">FAQ Accordion</span>
                <span className="text-[9px] text-[#c9c2ab]/60">Schema.org</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddBlock("code", insertAtIndex ?? undefined)}
                className="p-3 rounded-xl bg-[#07080b] border border-white/10 hover:border-[#d9b45c] hover:bg-[#d9b45c]/10 flex flex-col items-center space-y-2 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#d9b45c]/10 text-[#d9b45c] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Code size={16} />
                </div>
                <span className="text-xs font-bold text-white">Embed / Code</span>
                <span className="text-[9px] text-[#c9c2ab]/60">iFrames & HTML</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Library Modal Integration */}
      <WPMediaLibraryModal
        isOpen={Boolean(mediaPickerTargetBlockId)}
        onClose={() => setMediaPickerTargetBlockId(null)}
        cmsData={cmsData}
        onSelectMedia={handleMediaSelect}
      />
    </div>
  );
}
