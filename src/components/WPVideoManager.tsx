import React, { useState } from "react";
import { CMSData } from "../cmsStore";
import { WPVideo } from "../types";
import { 
  Video, 
  Plus, 
  Trash2, 
  Edit, 
  Play, 
  Eye, 
  EyeOff, 
  Check, 
  Sparkles, 
  Upload, 
  Link2, 
  FolderOpen 
} from "lucide-react";

interface WPVideoManagerProps {
  cmsData: CMSData;
  onSave: (updatedData: CMSData) => void;
}

export default function WPVideoManager({ cmsData, onSave }: WPVideoManagerProps) {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  
  // Form states for creating/editing
  const [isEditing, setIsEditing] = useState(false);
  const [videoForm, setVideoForm] = useState<Partial<WPVideo>>({
    title: "",
    description: "",
    category: "Tajweed Guides",
    duration: "10:00",
    thumbnail: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800",
    embedId: "",
    enabled: true,
    pages: ["videos"]
  });

  const categories = ["Tajweed Guides", "Lectures", "Student Recitations"];
  const availablePages = ["home", "about", "videos", "courses"];

  const handleSelectVideo = (video: WPVideo) => {
    setSelectedVideoId(video.id);
    setVideoForm(video);
    setIsEditing(true);
  };

  const handleStartNew = () => {
    setSelectedVideoId(null);
    setVideoForm({
      title: "",
      description: "",
      category: "Tajweed Guides",
      duration: "10:00",
      thumbnail: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=800",
      embedId: "sample-youtube-id",
      enabled: true,
      pages: ["videos"]
    });
    setIsEditing(true);
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.title || !videoForm.embedId) {
      alert("Please specify a Title and a Video ID/URL.");
      return;
    }

    let updatedVideos = [...(cmsData.videos || [])];

    if (selectedVideoId) {
      // Update
      updatedVideos = updatedVideos.map(v => 
        v.id === selectedVideoId ? { ...v, ...videoForm as WPVideo } : v
      );
    } else {
      // Create
      const newVideo: WPVideo = {
        id: `video-${Date.now()}`,
        title: videoForm.title || "",
        description: videoForm.description || "",
        category: videoForm.category || "Tajweed Guides",
        duration: videoForm.duration || "10:00",
        publishDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        thumbnail: videoForm.thumbnail || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800",
        embedId: videoForm.embedId || "",
        enabled: videoForm.enabled ?? true,
        pages: videoForm.pages || ["videos"]
      };
      updatedVideos = [newVideo, ...updatedVideos];
      setSelectedVideoId(newVideo.id);
    }

    onSave({
      ...cmsData,
      videos: updatedVideos
    });
    setIsEditing(false);
  };

  const handleDeleteVideo = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this video?")) {
      const filtered = (cmsData.videos || []).filter(v => v.id !== id);
      onSave({
        ...cmsData,
        videos: filtered
      });
      if (selectedVideoId === id) {
        setSelectedVideoId(null);
        setIsEditing(false);
      }
    }
  };

  const togglePageAssociation = (page: string) => {
    const currentPages = videoForm.pages || [];
    if (currentPages.includes(page)) {
      setVideoForm({
        ...videoForm,
        pages: currentPages.filter(p => p !== page)
      });
    } else {
      setVideoForm({
        ...videoForm,
        pages: [...currentPages, page]
      });
    }
  };

  const handleSimulateUpload = () => {
    // Generate a random high-quality stock thumbnail for quranic studies
    const stockThumbnails = [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800"
    ];
    const chosen = stockThumbnails[Math.floor(Math.random() * stockThumbnails.length)];
    setVideoForm({
      ...videoForm,
      thumbnail: chosen,
      title: videoForm.title || "Uploaded Lecture - Tajweed Mastery Class",
      embedId: "uploaded-file-simulated-" + Math.floor(Math.random() * 1000)
    });
    alert("Simulated video file selected from computer! Thumbnail & ID automatically updated.");
  };

  return (
    <div className="space-y-6 text-left" id="wp-video-manager-section">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#f3ecd8] flex items-center space-x-2">
            <Video className="text-[#d9b45c]" size={22} />
            <span>WordPress Video Hub & Management</span>
          </h2>
          <p className="text-[11px] text-[#c9c2ab] mt-1">
            Publish YouTube/Vimeo tutorials or upload custom video clips, then embed them onto specific web pages seamlessly.
          </p>
        </div>
        <button
          onClick={handleStartNew}
          className="flex items-center space-x-1.5 px-4 py-2 text-[10px] font-sans font-bold uppercase tracking-wider text-black bg-[#d9b45c] rounded-lg hover:bg-[#f2d98a] transition-all cursor-pointer"
        >
          <Plus size={14} />
          <span>Add Video</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Videos List */}
        <div className="lg:col-span-5 space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {cmsData.videos && cmsData.videos.length > 0 ? (
            cmsData.videos.map((video) => (
              <div
                key={video.id}
                onClick={() => handleSelectVideo(video)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex space-x-3 items-center ${
                  selectedVideoId === video.id
                    ? "bg-[#d9b45c]/10 border-[#d9b45c]"
                    : "bg-[#12141b]/70 border-[#d9b45c]/10 hover:border-[#d9b45c]/30"
                }`}
              >
                <div className="relative w-16 h-12 bg-black rounded overflow-hidden flex-shrink-0">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play size={14} className="text-[#d9b45c]" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-sans uppercase font-bold text-[#d9b45c]/80 tracking-widest block">
                      {video.category}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      {video.enabled ? (
                        <Eye size={10} className="text-green-400" title="Visible" />
                      ) : (
                        <EyeOff size={10} className="text-red-400" title="Hidden" />
                      )}
                      <button
                        onClick={(e) => handleDeleteVideo(video.id, e)}
                        className="p-1 rounded text-[#c9c2ab] hover:text-red-400 transition-colors"
                        title="Delete video"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <h4 className="text-xs font-serif text-white font-medium truncate mt-0.5">
                    {video.title}
                  </h4>
                  <div className="flex items-center justify-between text-[9px] font-mono text-[#c9c2ab]/60 mt-1">
                    <span>{video.duration}</span>
                    <span className="bg-[#d9b45c]/5 border border-[#d9b45c]/10 px-1 py-0.5 rounded truncate max-w-[120px]">
                      {video.pages.join(", ")}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-[#12141b]/50 border border-dashed border-[#d9b45c]/15 rounded-xl text-[#c9c2ab]">
              <Video className="mx-auto text-[#d9b45c]/40 mb-2" size={32} />
              <p className="text-xs">No videos added yet.</p>
              <button
                onClick={handleStartNew}
                className="mt-2 text-[10px] text-[#d9b45c] underline font-bold"
              >
                Create your first video
              </button>
            </div>
          )}
        </div>

        {/* Editor Form */}
        <div className="lg:col-span-7 bg-[#12141b]/40 border border-[#d9b45c]/15 rounded-2xl p-5">
          {isEditing ? (
            <form onSubmit={handleSaveVideo} className="space-y-4">
              <h3 className="text-sm font-sans font-extrabold text-[#f3ecd8] uppercase tracking-wider pb-2 border-b border-[#d9b45c]/10">
                {selectedVideoId ? "Edit Video Details" : "Create New Video Embedding"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#d9b45c]/75">Video Title</label>
                  <input
                    type="text"
                    required
                    value={videoForm.title || ""}
                    onChange={e => setVideoForm({ ...videoForm, title: e.target.value })}
                    className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d9b45c] transition-colors"
                    placeholder="e.g., Understanding basic Tajweed rules"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#d9b45c]/75">Category</label>
                  <select
                    value={videoForm.category || "Tajweed Guides"}
                    onChange={e => setVideoForm({ ...videoForm, category: e.target.value })}
                    className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d9b45c] transition-colors"
                  >
                    {categories.map(c => (
                      <option key={c} value={c} className="bg-[#07080b]">{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#d9b45c]/75">Description</label>
                <textarea
                  value={videoForm.description || ""}
                  onChange={e => setVideoForm({ ...videoForm, description: e.target.value })}
                  rows={2}
                  className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d9b45c] transition-colors resize-none"
                  placeholder="Summarize the core lessons or topics covered in this lecture..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#d9b45c]/75">Video Link / Embed ID</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={videoForm.embedId || ""}
                      onChange={e => setVideoForm({ ...videoForm, embedId: e.target.value })}
                      className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#d9b45c] transition-colors font-mono"
                      placeholder="YouTube ID (e.g., dQw4w9WgXcQ) or File Name"
                    />
                    <Link2 size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d9b45c]/50" />
                  </div>
                  <span className="text-[9px] text-[#c9c2ab]/50 block">Paste standard YouTube video ID or Vimeo slug.</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#d9b45c]/75">Duration (e.g. MM:SS)</label>
                  <input
                    type="text"
                    required
                    value={videoForm.duration || "10:00"}
                    onChange={e => setVideoForm({ ...videoForm, duration: e.target.value })}
                    className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d9b45c] transition-colors"
                    placeholder="e.g., 14:20"
                  />
                </div>
              </div>

              {/* Media Upload Simulation Row */}
              <div className="p-3 bg-[#d9b45c]/5 border border-[#d9b45c]/10 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FolderOpen size={16} className="text-[#d9b45c]" />
                  <div>
                    <span className="text-[10px] font-sans font-bold text-[#f3ecd8] block">Upload Video Clip</span>
                    <span className="text-[9px] text-[#c9c2ab]/70 block">Select a locally hosted video file from your drive.</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSimulateUpload}
                  className="flex items-center space-x-1.5 px-3 py-1.5 text-[9px] font-sans font-bold uppercase tracking-wider text-[#d9b45c] border border-[#d9b45c]/20 rounded-lg hover:bg-[#d9b45c]/10 transition-colors"
                >
                  <Upload size={12} />
                  <span>Browse Files</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#d9b45c]/75">Thumbnail Cover Image URL</label>
                  <input
                    type="text"
                    value={videoForm.thumbnail || ""}
                    onChange={e => setVideoForm({ ...videoForm, thumbnail: e.target.value })}
                    className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d9b45c] transition-colors font-mono"
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#d9b45c]/75">Visibility status</label>
                  <div className="flex items-center space-x-4 h-full pt-1">
                    <label className="flex items-center space-x-2 text-xs text-white cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={videoForm.enabled ?? true}
                        onChange={e => setVideoForm({ ...videoForm, enabled: e.target.checked })}
                        className="rounded border-[#d9b45c]/30 text-[#d9b45c] focus:ring-0 bg-[#07080b]"
                      />
                      <span>Enable video presentation globally</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Pages associations checklist */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[10px] uppercase font-bold text-[#d9b45c]/75 block">Embed & Show on Webpages</label>
                <div className="flex flex-wrap gap-2">
                  {availablePages.map(page => {
                    const isSelected = (videoForm.pages || []).includes(page);
                    return (
                      <button
                        type="button"
                        key={page}
                        onClick={() => togglePageAssociation(page)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-sans font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#d9b45c] text-black border-[#d9b45c]"
                            : "bg-[#07080b] text-[#c9c2ab] border-[#d9b45c]/10 hover:border-[#d9b45c]/35"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                <span className="text-[9px] text-[#c9c2ab]/40 block">Configure which custom panels or subpages can access and display this video item.</span>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-[#d9b45c]/10">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-[10px] font-sans font-bold uppercase tracking-wider text-[#c9c2ab] bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-1 px-4 py-2 text-[10px] font-sans font-bold uppercase tracking-wider text-black bg-[#d9b45c] hover:bg-[#f2d98a] rounded-lg transition-all cursor-pointer"
                >
                  <Check size={12} />
                  <span>{selectedVideoId ? "Update Video" : "Embed Video"}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="h-full flex flex-col justify-center items-center text-center p-8 text-[#c9c2ab] space-y-3 min-h-[350px]">
              <Video className="text-[#d9b45c]/30 animate-bounce" size={42} />
              <div>
                <h4 className="font-serif text-[#f3ecd8] font-bold text-sm">Interactive Video Sandbox</h4>
                <p className="text-xs max-w-sm mx-auto mt-1 leading-relaxed">
                  Select an existing video from the list on the left to edit its parameters, or click "Add Video" to upload/embed a new video immediately.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
