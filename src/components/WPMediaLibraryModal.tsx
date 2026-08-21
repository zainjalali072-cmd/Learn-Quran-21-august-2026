import React, { useState, useRef, useEffect } from "react";
import { Upload, X, Check, Image as ImageIcon, Search, Scissors, Maximize2, Info, Trash2, Sliders, RefreshCw } from "lucide-react";
import { WPMedia } from "../cmsStore";

interface WPMediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaLibrary: WPMedia[];
  onSelect: (imageDetails: { url: string; alt: string; title: string; caption?: string; description?: string }) => void;
  onSaveMediaLibrary: (updatedMedia: WPMedia[], customMsg?: string) => void;
  title?: string;
  defaultCropAspect?: "1:1" | "16:9" | "4:3" | "free";
}

export const WPMediaLibraryModal: React.FC<WPMediaLibraryModalProps> = ({
  isOpen,
  onClose,
  mediaLibrary,
  onSelect,
  onSaveMediaLibrary,
  title = "WordPress Advanced Media Manager",
  defaultCropAspect = "free"
}) => {
  const [activeTab, setActiveTab] = useState<"library" | "upload" | "crop">("library");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  
  // Upload and Crop state
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [cropAspect, setCropAspect] = useState<"1:1" | "16:9" | "4:3" | "free">(defaultCropAspect);
  
  // Crop settings
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropWidth, setCropWidth] = useState(100);
  const [cropHeight, setCropHeight] = useState(100);
  const [zoom, setZoom] = useState(100); // 100%
  const [rotate, setRotate] = useState(0);
  const [imageQuality, setImageQuality] = useState(80); // 80% JPEG quality
  
  // Metadata inputs
  const [mediaAlt, setMediaAlt] = useState("");
  const [mediaTitle, setMediaTitle] = useState("");
  const [mediaCaption, setMediaCaption] = useState("");
  const [mediaDescription, setMediaDescription] = useState("");
  
  // Image sizing details
  const [originalSize, setOriginalSize] = useState("");
  const [optimizedSize, setOptimizedSize] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ w: 0, h: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Filtered media list
  const filteredMedia = mediaLibrary.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.alt && item.alt.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Sync selected media details to state when library selection changes
  useEffect(() => {
    if (selectedMediaId) {
      const selectedItem = mediaLibrary.find(m => m.id === selectedMediaId);
      if (selectedItem) {
        setMediaAlt(selectedItem.alt || "");
        setMediaTitle(selectedItem.title || "");
        setMediaCaption(selectedItem.caption || "");
        setMediaDescription(selectedItem.description || "");
      }
    } else {
      setMediaAlt("");
      setMediaTitle("");
      setMediaCaption("");
      setMediaDescription("");
    }
  }, [selectedMediaId, mediaLibrary]);

  // Load uploaded image onto Canvas and calculate properties
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      // Human readable original size
      const sizeKB = Math.round(file.size / 1024);
      setOriginalSize(`${sizeKB} KB`);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedFileUrl(event.target.result as string);
          setActiveTab("crop");
          setImageLoaded(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    setImageDimensions({ w, h });
    
    // Set default cropping window
    setCropX(0);
    setCropY(0);
    
    if (cropAspect === "1:1") {
      const size = Math.min(w, h);
      setCropWidth(size);
      setCropHeight(size);
    } else if (cropAspect === "16:9") {
      const width = w;
      const height = Math.round((w * 9) / 16);
      if (height <= h) {
        setCropWidth(width);
        setCropHeight(height);
      } else {
        setCropWidth(Math.round((h * 16) / 9));
        setCropHeight(h);
      }
    } else if (cropAspect === "4:3") {
      const width = w;
      const height = Math.round((w * 3) / 4);
      if (height <= h) {
        setCropWidth(width);
        setCropHeight(height);
      } else {
        setCropWidth(Math.round((h * 4) / 3));
        setCropHeight(h);
      }
    } else {
      setCropWidth(w);
      setCropHeight(h);
    }

    setMediaTitle(uploadedFileName.split(".")[0].replace(/[-_]/g, " "));
    setMediaAlt(uploadedFileName.split(".")[0].replace(/[-_]/g, " "));
    setImageLoaded(true);
  };

  // Redraw cropped canvas whenever settings change
  useEffect(() => {
    if (activeTab === "crop" && imageLoaded && imageRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = imageRef.current;

      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Apply crop proportions
        canvas.width = cropWidth * (zoom / 100);
        canvas.height = cropHeight * (zoom / 100);

        // Configure smooth rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        ctx.save();
        
        // Translate to center if rotating
        if (rotate !== 0) {
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((rotate * Math.PI) / 180);
          ctx.translate(-canvas.width / 2, -canvas.height / 2);
        }

        // Draw selection
        ctx.drawImage(
          img,
          cropX, cropY, cropWidth, cropHeight, // Source bounding box
          0, 0, canvas.width, canvas.height // Destination box
        );

        ctx.restore();

        // Calculate dynamic optimized file size
        const compressedDataUrl = canvas.toDataURL("image/jpeg", imageQuality / 100);
        const head = "data:image/jpeg;base64,";
        const byteLength = Math.round(((compressedDataUrl.length - head.length) * 3) / 4);
        setOptimizedSize(`${Math.round(byteLength / 1024)} KB`);
      }
    }
  }, [activeTab, imageLoaded, cropX, cropY, cropWidth, cropHeight, zoom, rotate, imageQuality, cropAspect]);

  // Handle aspect ratio preset changes
  const applyAspectPreset = (aspect: "1:1" | "16:9" | "4:3" | "free") => {
    setCropAspect(aspect);
    const w = imageDimensions.w;
    const h = imageDimensions.h;

    if (aspect === "1:1") {
      const size = Math.min(w, h);
      setCropWidth(size);
      setCropHeight(size);
    } else if (aspect === "16:9") {
      const width = w;
      const height = Math.round((w * 9) / 16);
      if (height <= h) {
        setCropWidth(width);
        setCropHeight(height);
      } else {
        setCropWidth(Math.round((h * 16) / 9));
        setCropHeight(h);
      }
    } else if (aspect === "4:3") {
      const width = w;
      const height = Math.round((w * 3) / 4);
      if (height <= h) {
        setCropWidth(width);
        setCropHeight(height);
      } else {
        setCropWidth(Math.round((h * 4) / 3));
        setCropHeight(h);
      }
    } else {
      setCropWidth(w);
      setCropHeight(h);
    }
    setCropX(0);
    setCropY(0);
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const sizeKB = Math.round(file.size / 1024);
      setOriginalSize(`${sizeKB} KB`);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedFileUrl(event.target.result as string);
          setActiveTab("crop");
          setImageLoaded(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Deletion logic
  const handleDeleteMediaItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to permanently delete this asset from the Media Library database? This will break any dynamic paths using it.")) {
      const updated = mediaLibrary.filter(item => item.id !== id);
      onSaveMediaLibrary(updated, "✅ Media asset deleted from library successfully!");
      if (selectedMediaId === id) {
        setSelectedMediaId(null);
      }
    }
  };

  // Saving details inside Media Library
  const handleUpdateMetadata = () => {
    if (!selectedMediaId) return;
    const updated = mediaLibrary.map(item => {
      if (item.id === selectedMediaId) {
        return {
          ...item,
          title: mediaTitle,
          alt: mediaAlt,
          caption: mediaCaption,
          description: mediaDescription
        };
      }
      return item;
    });
    onSaveMediaLibrary(updated, "✅ Media SEO metadata saved & updated successfully!");
  };

  // Confirm image selection
  const handleSelectActiveImage = () => {
    if (selectedMediaId) {
      const selected = mediaLibrary.find(m => m.id === selectedMediaId);
      if (selected) {
        onSelect({
          url: selected.url,
          alt: mediaAlt || selected.alt || selected.title,
          title: mediaTitle || selected.title,
          caption: mediaCaption || selected.caption,
          description: mediaDescription || selected.description
        });
        onClose();
      }
    }
  };

  // Save Cropped Image to Media Library and Select
  const handleSaveCroppedImage = () => {
    if (!canvasRef.current) return;
    const croppedUrl = canvasRef.current.toDataURL("image/jpeg", imageQuality / 100);
    
    const newMediaId = `m-${Date.now()}`;
    const newMediaItem: WPMedia = {
      id: newMediaId,
      title: mediaTitle || uploadedFileName.split(".")[0],
      url: croppedUrl,
      size: optimizedSize || "Unknown KB",
      date: new Date().toISOString().split("T")[0],
      type: "image/jpeg",
      dimensions: `${Math.round(cropWidth * (zoom / 100))}x${Math.round(cropHeight * (zoom / 100))}`,
      alt: mediaAlt || mediaTitle || "Optimized Asset",
      caption: mediaCaption,
      description: mediaDescription,
      author: "WordPress CMS Admin"
    };

    const updated = [newMediaItem, ...mediaLibrary];
    onSaveMediaLibrary(updated, "✅ Asset optimized & saved to Media Library successfully!");
    
    // Select the newly cropped image
    onSelect({
      url: newMediaItem.url,
      alt: newMediaItem.alt || newMediaItem.title,
      title: newMediaItem.title,
      caption: newMediaItem.caption,
      description: newMediaItem.description
    });
    
    // Reset States
    setUploadedFileUrl(null);
    setActiveTab("library");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-5xl h-[85vh] bg-[#12141b] border border-[#d9b45c]/25 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        
        {/* MODAL HEADER */}
        <div className="bg-[#07080b] border-b border-[#d9b45c]/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ImageIcon className="text-[#d9b45c]" size={20} />
            <div>
              <h2 className="font-serif text-base text-[#f3ecd8] font-bold">{title}</h2>
              <p className="text-[10px] text-[#c9c2ab] uppercase font-bold tracking-widest font-sans">v5.9 WordPress Core Engine</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-[#c9c2ab] hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* SUB TAB SELECTORS */}
        <div className="flex items-center justify-between border-b border-white/5 bg-[#12141b] px-6 py-1.5">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab("library")}
              className={`px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === "library" ? "border-[#d9b45c] text-[#d9b45c]" : "border-transparent text-[#c9c2ab] hover:text-white"}`}
            >
              Media Library ({filteredMedia.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("upload");
                setUploadedFileUrl(null);
              }}
              className={`px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === "upload" ? "border-[#d9b45c] text-[#d9b45c]" : "border-transparent text-[#c9c2ab] hover:text-white"}`}
            >
              Upload New Files
            </button>
            {uploadedFileUrl && (
              <button
                onClick={() => setActiveTab("crop")}
                className={`px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === "crop" ? "border-[#d9b45c] text-[#d9b45c]" : "border-transparent text-[#c9c2ab] hover:text-white"}`}
              >
                Crop & Optimizer Stage
              </button>
            )}
          </div>
          
          {activeTab === "library" && (
            <div className="relative w-48 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 text-[#c9c2ab]/50" size={13} />
              <input 
                type="text" 
                placeholder="Search media files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#07080b] border border-[#d9b45c]/25 rounded-lg py-1.5 pl-8 pr-3 text-[11px] text-white focus:outline-none focus:border-[#d9b45c]"
              />
            </div>
          )}
        </div>

        {/* MODAL MAIN STAGE */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* TAB 1: MEDIA LIBRARY BROWSER */}
          {activeTab === "library" && (
            <>
              {/* Media Grid */}
              <div className="flex-1 overflow-y-auto p-6 bg-[#07080b]/35">
                {filteredMedia.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-[#c9c2ab]/40 space-y-3">
                    <ImageIcon size={48} className="stroke-[1]" />
                    <span className="text-xs font-sans">No matching files found in WordPress uploads folder.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredMedia.map(item => (
                      <div 
                        key={item.id}
                        onClick={() => setSelectedMediaId(item.id)}
                        className={`relative aspect-square bg-[#12141b] rounded-xl border overflow-hidden cursor-pointer transition-all ${selectedMediaId === item.id ? "border-[#d9b45c] ring-2 ring-[#d9b45c]/20" : "border-white/5 hover:border-[#d9b45c]/40"}`}
                      >
                        <img 
                          src={item.url} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 p-1.5 text-[9px] text-[#c9c2ab] truncate font-sans">
                          {item.title}
                        </div>
                        
                        {/* Overlay Controls */}
                        <div className="absolute top-1.5 right-1.5 flex space-x-1 opacity-0 hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={(e) => handleDeleteMediaItem(item.id, e)}
                            className="p-1 bg-red-500 hover:bg-red-600 rounded text-white transition-all shadow-md"
                            title="Delete permanently"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>

                        {selectedMediaId === item.id && (
                          <div className="absolute top-1.5 left-1.5 p-1 bg-[#d9b45c] text-black rounded-full">
                            <Check size={10} className="stroke-[3]" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar Metadata editor */}
              <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-white/5 bg-[#12141b] overflow-y-auto p-5 flex flex-col justify-between">
                {selectedMediaId ? (
                  <div className="space-y-4 text-xs font-sans text-left">
                    <span className="text-[10px] text-[#d9b45c] uppercase font-bold tracking-wider block">Attachment Details</span>
                    
                    {/* Tiny visual thumbnail */}
                    {(() => {
                      const sel = mediaLibrary.find(m => m.id === selectedMediaId);
                      if (!sel) return null;
                      return (
                        <div className="flex items-start space-x-3 pb-3 border-b border-white/5">
                          <div className="w-16 h-16 rounded bg-[#07080b] overflow-hidden flex-shrink-0 border border-white/10">
                            <img src={sel.url} alt={sel.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <p className="text-[11px] font-bold text-white truncate">{sel.title}</p>
                            <p className="text-[9px] text-[#c9c2ab]/50">{sel.date}</p>
                            <p className="text-[9px] text-[#c9c2ab]/50">{sel.dimensions} • {sel.size}</p>
                            <p className="text-[9px] text-[#c9c2ab]/50 font-mono truncate">{sel.url.startsWith("data:") ? "Base64 Compressed File" : "Dynamic Path"}</p>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Metadata fields */}
                    <div className="space-y-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-[9px] text-[#c9c2ab] uppercase font-bold tracking-wider">Alternative Text (Alt - Google SEO)</label>
                        <input 
                          type="text" 
                          value={mediaAlt}
                          onChange={(e) => setMediaAlt(e.target.value)}
                          className="w-full bg-[#07080b] border border-white/10 rounded p-2 text-[11px] text-white focus:border-[#d9b45c]"
                          placeholder="e.g. child memorizing holy Quran in class"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] text-[#c9c2ab] uppercase font-bold tracking-wider">Title</label>
                        <input 
                          type="text" 
                          value={mediaTitle}
                          onChange={(e) => setMediaTitle(e.target.value)}
                          className="w-full bg-[#07080b] border border-white/10 rounded p-2 text-[11px] text-white focus:border-[#d9b45c]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] text-[#c9c2ab] uppercase font-bold tracking-wider">Caption</label>
                        <input 
                          type="text" 
                          value={mediaCaption}
                          onChange={(e) => setMediaCaption(e.target.value)}
                          className="w-full bg-[#07080b] border border-white/10 rounded p-2 text-[11px] text-white focus:border-[#d9b45c]"
                          placeholder="Displays under some layout configurations"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] text-[#c9c2ab] uppercase font-bold tracking-wider">Description</label>
                        <textarea 
                          rows={3}
                          value={mediaDescription}
                          onChange={(e) => setMediaDescription(e.target.value)}
                          className="w-full bg-[#07080b] border border-white/10 rounded p-2 text-[11px] text-white focus:border-[#d9b45c]"
                          placeholder="Internal database context"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleUpdateMetadata}
                        className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded text-[10px] uppercase font-extrabold tracking-wider transition-all"
                      >
                        Update Image Metadata
                      </button>
                    </div>

                    {/* Choose Select */}
                    <div className="pt-4 border-t border-white/5">
                      <button
                        type="button"
                        onClick={handleSelectActiveImage}
                        className="w-full py-3 bg-[#d9b45c] hover:bg-[#f2d98a] text-black rounded-lg text-xs font-sans font-extrabold uppercase tracking-widest transition-all"
                      >
                        Select & Apply File
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-[#c9c2ab]/30 p-4 space-y-2">
                    <Info size={28} className="stroke-[1]" />
                    <span className="text-[11px] font-sans">Select an image from the library grid to view detailed attachments metadata and insert.</span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 2: UPLOAD FILE DRAG ZONE */}
          {activeTab === "upload" && (
            <div className="flex-1 overflow-y-auto p-12 bg-[#07080b]/35 flex flex-col items-center justify-center">
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="w-full max-w-xl aspect-[16/9] border-2 border-dashed border-[#d9b45c]/30 hover:border-[#d9b45c] bg-[#12141b]/50 rounded-2xl flex flex-col items-center justify-center p-8 space-y-4 cursor-pointer transition-all group"
              >
                <div className="p-4 bg-[#d9b45c]/10 text-[#d9b45c] rounded-full group-hover:scale-110 transition-transform">
                  <Upload size={32} />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="font-sans text-sm font-extrabold text-white">Drag and drop file here to upload</h3>
                  <p className="text-xs text-[#c9c2ab]">or click to browse local storage explorer</p>
                </div>
                <p className="text-[10px] text-[#c9c2ab]/40 uppercase font-bold tracking-widest font-sans">Maximum upload size: 10 MB (PNG, JPEG, WEBP)</p>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* TAB 3: CROP & OPTIMIZER WORKBENCH */}
          {activeTab === "crop" && uploadedFileUrl && (
            <>
              {/* Image Editor Area */}
              <div className="flex-1 overflow-y-auto p-6 bg-[#07080b] flex flex-col items-center justify-center relative">
                <div className="max-w-full max-h-[50vh] overflow-hidden border border-white/10 rounded-xl relative">
                  
                  {/* Invisible Image used to crop */}
                  <img 
                    ref={imageRef}
                    src={uploadedFileUrl} 
                    alt="Source upload"
                    onLoad={handleImageLoad}
                    className="max-w-full max-h-[50vh] object-contain select-none pointer-events-none opacity-40"
                  />

                  {/* Canvas rendering Crop Selection */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <canvas 
                      ref={canvasRef} 
                      className="border-2 border-[#d9b45c] shadow-2xl bg-[#12141b]/20"
                    />
                  </div>
                </div>

                {/* Cropping Instructions / Live Details */}
                <div className="mt-4 flex items-center space-x-6 text-xs font-sans bg-[#12141b]/60 border border-white/5 rounded-lg px-4 py-2.5">
                  <div>
                    <span className="text-[#c9c2ab]/50 block text-[9px] uppercase font-bold">Source Dimension</span>
                    <span className="text-white font-bold">{imageDimensions.w} x {imageDimensions.h} px</span>
                  </div>
                  <div className="text-[#c9c2ab]/20">|</div>
                  <div>
                    <span className="text-[#c9c2ab]/50 block text-[9px] uppercase font-bold">Cropped Output</span>
                    <span className="text-[#d9b45c] font-bold">{cropWidth} x {cropHeight} px</span>
                  </div>
                  <div className="text-[#c9c2ab]/20">|</div>
                  <div>
                    <span className="text-[#c9c2ab]/50 block text-[9px] uppercase font-bold">Original Size</span>
                    <span className="text-white font-mono">{originalSize}</span>
                  </div>
                  <div className="text-[#c9c2ab]/20">|</div>
                  <div>
                    <span className="text-[#c9c2ab]/50 block text-[9px] uppercase font-bold">Optimized Jpeg Size</span>
                    <span className="text-green-400 font-mono font-bold">{optimizedSize}</span>
                  </div>
                </div>
              </div>

              {/* Cropping Controls Sidebar */}
              <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-white/5 bg-[#12141b] overflow-y-auto p-5 text-xs text-left font-sans space-y-4">
                <span className="text-[10px] text-[#d9b45c] uppercase font-bold tracking-wider block">Image Editor & Optimizer Settings</span>
                
                {/* 1. ASPECT RATIO PRESETS */}
                <div className="space-y-1.5">
                  <label className="text-[9px] text-[#c9c2ab] uppercase font-bold tracking-wider">Aspect Ratio Preset</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: "free", label: "Freeform" },
                      { id: "1:1", label: "1:1 Sq" },
                      { id: "16:9", label: "16:9 Lnd" },
                      { id: "4:3", label: "4:3 Cls" }
                    ].map(preset => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => applyAspectPreset(preset.id as any)}
                        className={`py-1.5 text-[10px] font-bold uppercase rounded-md border tracking-wider transition-all ${cropAspect === preset.id ? "bg-[#d9b45c]/10 text-[#d9b45c] border-[#d9b45c]/50" : "bg-white/5 border-transparent text-[#c9c2ab] hover:bg-white/10"}`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. CROP POSITION SLIDERS */}
                <div className="space-y-3 bg-[#07080b]/30 p-3 border border-white/5 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white font-bold uppercase flex items-center gap-1">
                      <Scissors size={10} /> Cropping Window
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setCropX(0); setCropY(0);
                        applyAspectPreset(cropAspect);
                        setZoom(100); setRotate(0);
                      }}
                      className="text-[9px] text-[#d9b45c] hover:underline"
                    >
                      Reset Focus
                    </button>
                  </div>
                  
                  {/* Slider X */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] text-[#c9c2ab]/70">
                      <span>X OFFSET</span>
                      <span>{cropX} px</span>
                    </div>
                    <input 
                      type="range"
                      min={0}
                      max={Math.max(0, imageDimensions.w - cropWidth)}
                      value={cropX}
                      onChange={(e) => setCropX(parseInt(e.target.value))}
                      className="w-full h-1 bg-[#07080b] rounded-lg appearance-none cursor-pointer accent-[#d9b45c]"
                    />
                  </div>

                  {/* Slider Y */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] text-[#c9c2ab]/70">
                      <span>Y OFFSET</span>
                      <span>{cropY} px</span>
                    </div>
                    <input 
                      type="range"
                      min={0}
                      max={Math.max(0, imageDimensions.h - cropHeight)}
                      value={cropY}
                      onChange={(e) => setCropY(parseInt(e.target.value))}
                      className="w-full h-1 bg-[#07080b] rounded-lg appearance-none cursor-pointer accent-[#d9b45c]"
                    />
                  </div>

                  {/* Slider Scale / Size */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] text-[#c9c2ab]/70">
                      <span>CROP WIDTH</span>
                      <span>{cropWidth} px</span>
                    </div>
                    <input 
                      type="range"
                      min={20}
                      max={imageDimensions.w}
                      value={cropWidth}
                      onChange={(e) => {
                        const newW = parseInt(e.target.value);
                        setCropWidth(newW);
                        if (cropAspect === "1:1") {
                          setCropHeight(newW);
                        } else if (cropAspect === "16:9") {
                          setCropHeight(Math.round((newW * 9) / 16));
                        } else if (cropAspect === "4:3") {
                          setCropHeight(Math.round((newW * 3) / 4));
                        }
                      }}
                      className="w-full h-1 bg-[#07080b] rounded-lg appearance-none cursor-pointer accent-[#d9b45c]"
                    />
                  </div>
                </div>

                {/* 3. PERFORMANCE AUTO-OPTIMIZATION Jpeg quality compression */}
                <div className="space-y-2 bg-[#07080b]/30 p-3 border border-white/5 rounded-lg">
                  <span className="text-[10px] text-white font-bold uppercase flex items-center gap-1">
                    <Sliders size={10} /> Auto-Optimization Engine
                  </span>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] text-[#c9c2ab]/70">
                      <span>JPEG COMPRESSION QUALITY</span>
                      <span className="text-green-400 font-bold">{imageQuality}%</span>
                    </div>
                    <input 
                      type="range"
                      min={10}
                      max={100}
                      value={imageQuality}
                      onChange={(e) => setImageQuality(parseInt(e.target.value))}
                      className="w-full h-1 bg-[#07080b] rounded-lg appearance-none cursor-pointer accent-[#d9b45c]"
                    />
                  </div>
                  <p className="text-[9px] text-[#c9c2ab]/40 leading-tight">
                    Lower compression yields faster site loading performance, improving Core Web Vitals (LCP) scores and Generative Engine Crawling speed.
                  </p>
                </div>

                {/* 4. METADATA INPUTS */}
                <div className="space-y-2.5">
                  <div className="space-y-1">
                    <label className="text-[9px] text-[#c9c2ab] uppercase font-bold tracking-wider">Alt Text (SEO Title)</label>
                    <input 
                      type="text" 
                      value={mediaAlt}
                      onChange={(e) => setMediaAlt(e.target.value)}
                      className="w-full bg-[#07080b] border border-white/10 rounded p-2 text-[11px] text-white focus:border-[#d9b45c]"
                      placeholder="Image SEO contextual alternative text"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-[#c9c2ab] uppercase font-bold tracking-wider">Asset Title</label>
                    <input 
                      type="text" 
                      value={mediaTitle}
                      onChange={(e) => setMediaTitle(e.target.value)}
                      className="w-full bg-[#07080b] border border-white/10 rounded p-2 text-[11px] text-white focus:border-[#d9b45c]"
                    />
                  </div>
                </div>

                {/* SAVE & CLOSE TRIGGER */}
                <div className="pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={handleSaveCroppedImage}
                    className="w-full py-3 bg-[#d9b45c] hover:bg-[#f2d98a] text-black rounded-lg text-xs font-sans font-extrabold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Check size={14} className="stroke-[3]" /> Compress, Save & Apply
                  </button>
                </div>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
