import React, { useState } from "react";
import { CMSData, WPUser } from "../cmsStore";
import { 
  Users as IconUsers, UserPlus as IconUserPlus, Edit as IconEdit, Trash2 as IconTrash, 
  Upload as IconUpload, X as IconX, Check as IconCheck, Shield as IconShield, 
  Mail as IconMail, Phone as IconPhone, Globe as IconGlobe, Lock as IconLock, 
  User as IconUser, Search as IconSearch, Power as IconPower, Image as IconImage, 
  Key as IconKey, FileText as IconFileText, Sparkles as IconSparkles, 
  Twitter as IconTwitter, Facebook as IconFacebook, Linkedin as IconLinkedin,
  AlertTriangle as IconAlert
} from "lucide-react";

interface WPUserManagerProps {
  cmsData: CMSData;
  onSave: (updatedData: CMSData, customMsg?: string) => void;
}

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80";

export const WPUserManager: React.FC<WPUserManagerProps> = ({ cmsData, onSave }) => {
  const users = cmsData.userProfiles || [];

  // Filter & Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Edit User Modal state
  const [editingUser, setEditingUser] = useState<WPUser | null>(null);

  // Delete User Confirmation Modal state
  const [deletingUser, setDeletingUser] = useState<WPUser | null>(null);

  // Add User Form state
  const [newUser, setNewUser] = useState<Partial<WPUser>>({
    name: "",
    username: "",
    email: "",
    role: "Author",
    password: "",
    phone: "",
    bio: "",
    avatar: DEFAULT_AVATAR,
    status: "active",
    socialLinks: { twitter: "", facebook: "", linkedin: "", website: "" }
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [isDragOverAdd, setIsDragOverAdd] = useState(false);
  const [isDragOverEdit, setIsDragOverEdit] = useState(false);

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.username && u.username.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Handle file reader for avatar upload
  const handleAvatarFileUpload = (file: File, callback: (avatarUrl: string) => void) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type)) {
      alert("Unsupported file format! Please upload a JPG, PNG, or WEBP image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        callback(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Create New Account
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);

    if (!newUser.name?.trim()) {
      setAddError("Full Name is required.");
      return;
    }
    if (!newUser.email?.trim()) {
      setAddError("Email Address is required.");
      return;
    }
    if (newUser.password && newUser.password !== confirmPassword) {
      setAddError("Passwords do not match.");
      return;
    }

    const created: WPUser = {
      id: `u-${Date.now()}`,
      name: newUser.name.trim(),
      username: newUser.username?.trim() || newUser.name.toLowerCase().replace(/\s+/g, "_"),
      email: newUser.email.trim(),
      role: newUser.role || "Author",
      avatar: newUser.avatar || DEFAULT_AVATAR,
      registeredDate: new Date().toISOString().split("T")[0],
      phone: newUser.phone?.trim() || "",
      bio: newUser.bio?.trim() || "",
      password: newUser.password || "",
      status: newUser.status || "active",
      socialLinks: newUser.socialLinks || { twitter: "", facebook: "", linkedin: "", website: "" }
    };

    const updatedUsers = [created, ...users];
    onSave({ ...cmsData, userProfiles: updatedUsers }, `✅ User Account "${created.name}" Created & Registered Successfully!`);

    // Reset Form
    setNewUser({
      name: "",
      username: "",
      email: "",
      role: "Author",
      password: "",
      phone: "",
      bio: "",
      avatar: DEFAULT_AVATAR,
      status: "active",
      socialLinks: { twitter: "", facebook: "", linkedin: "", website: "" }
    });
    setConfirmPassword("");
  };

  // Update User in Edit Modal
  const handleSaveEditedUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (!editingUser.name.trim()) {
      alert("User Name cannot be empty.");
      return;
    }
    if (!editingUser.email.trim()) {
      alert("Email Address cannot be empty.");
      return;
    }

    const updatedUsers = users.map((u) => (u.id === editingUser.id ? editingUser : u));
    onSave({ ...cmsData, userProfiles: updatedUsers }, `✅ User Account "${editingUser.name}" Updated Successfully!`);
    setEditingUser(null);
  };

  // Delete User
  const handleConfirmDelete = () => {
    if (!deletingUser) return;
    if (users.length <= 1) {
      alert("Cannot delete the last remaining user account.");
      setDeletingUser(null);
      return;
    }
    const updatedUsers = users.filter((u) => u.id !== deletingUser.id);
    onSave({ ...cmsData, userProfiles: updatedUsers }, `✅ User Account "${deletingUser.name}" Deleted Successfully!`);
    setDeletingUser(null);
  };

  // Quick Toggle Status
  const handleToggleUserStatus = (user: WPUser) => {
    const nextStatus = user.status === "disabled" ? "active" : "disabled";
    const updatedUsers = users.map((u) => (u.id === user.id ? { ...u, status: nextStatus as any } : u));
    const msg = nextStatus === "active" ? `✅ Account "${user.name}" Enabled Successfully!` : `⚠️ Account "${user.name}" Disabled/Suspended.`;
    onSave({ ...cmsData, userProfiles: updatedUsers }, msg);
  };

  // Quick Change Role
  const handleChangeRole = (user: WPUser, newRole: WPUser["role"]) => {
    const updatedUsers = users.map((u) => (u.id === user.id ? { ...u, role: newRole } : u));
    onSave({ ...cmsData, userProfiles: updatedUsers }, `✅ Role for "${user.name}" changed to ${newRole}!`);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="border-b border-[#d9b45c]/15 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl text-[#f3ecd8] font-bold flex items-center space-x-2">
            <IconUsers size={22} className="text-[#d9b45c]" />
            <span>WordPress User Management & Author Profiles</span>
          </h2>
          <p className="text-xs text-[#c9c2ab] mt-1 font-sans">
            Manage scholars, administrators, editors, and author credentials with full database persistence.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-[#12141b] border border-[#d9b45c]/20 px-3 py-1.5 rounded-xl">
          <span className="text-xs text-[#c9c2ab] font-mono">Total Users:</span>
          <span className="text-xs font-extrabold text-[#d9b45c] bg-[#d9b45c]/10 px-2 py-0.5 rounded-md">{users.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: REGISTERED ACCOUNTS LIST (2 COLS ON DESKTOP) */}
        <div className="bg-[#12141b] border border-[#d9b45c]/15 rounded-2xl p-5 space-y-4 lg:col-span-2 shadow-xl">
          
          {/* Top Bar: Search & Role Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d9b45c]/10 pb-3">
            <span className="text-xs text-[#d9b45c] uppercase font-bold tracking-widest flex items-center space-x-2">
              <IconShield size={14} />
              <span>Registered Database Accounts</span>
            </span>

            <div className="flex items-center space-x-2">
              {/* Search */}
              <div className="relative">
                <IconSearch size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#c9c2ab]/50" />
                <input
                  type="text"
                  placeholder="Search user or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#07080b] border border-[#d9b45c]/20 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white font-sans outline-none focus:border-[#d9b45c] w-44"
                />
              </div>

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-[#07080b] border border-[#d9b45c]/20 rounded-xl px-2.5 py-1.5 text-xs text-[#d9b45c] font-sans font-bold cursor-pointer outline-none"
              >
                <option value="all">All Roles</option>
                <option value="Administrator">Administrator</option>
                <option value="Editor">Editor</option>
                <option value="Author">Author</option>
                <option value="Subscriber">Subscriber</option>
              </select>
            </div>
          </div>

          {/* User Cards List */}
          <div className="space-y-3.5 max-h-[680px] overflow-y-auto pr-1">
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-[#c9c2ab]/60 border border-dashed border-[#d9b45c]/20 rounded-xl">
                <IconUser size={32} className="mx-auto text-[#d9b45c]/40 mb-2" />
                <p className="text-xs font-sans">No user accounts found matching your search criteria.</p>
              </div>
            ) : (
              filteredUsers.map((user) => {
                const isDisabled = user.status === "disabled";
                return (
                  <div
                    key={user.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between bg-[#07080b]/80 border ${
                      isDisabled ? "border-red-500/20 opacity-75" : "border-[#d9b45c]/15 hover:border-[#d9b45c]/40"
                    } p-4 rounded-xl transition-all space-y-3 sm:space-y-0`}
                  >
                    {/* User Info */}
                    <div className="flex items-start space-x-3.5">
                      <div className="relative flex-shrink-0">
                        <img
                          src={user.avatar || DEFAULT_AVATAR}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover border border-[#d9b45c]/30 shadow-md"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                          }}
                        />
                        <span
                          className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#07080b] ${
                            isDisabled ? "bg-red-500" : "bg-emerald-500"
                          }`}
                          title={isDisabled ? "Account Disabled" : "Account Active"}
                        ></span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-sans font-bold text-white">{user.name}</span>
                          {user.username && (
                            <span className="text-[11px] text-[#d9b45c]/70 font-mono">@{user.username}</span>
                          )}
                          {isDisabled && (
                            <span className="text-[9px] bg-red-500/20 text-red-300 font-bold px-1.5 py-0.5 rounded uppercase">
                              Disabled
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#c9c2ab]/70">
                          <span className="flex items-center space-x-1">
                            <IconMail size={11} className="text-[#d9b45c]/60" />
                            <span>{user.email}</span>
                          </span>
                          {user.phone && (
                            <span className="flex items-center space-x-1">
                              <IconPhone size={11} className="text-[#d9b45c]/60" />
                              <span>{user.phone}</span>
                            </span>
                          )}
                          {user.registeredDate && (
                            <span className="text-[10px] text-[#c9c2ab]/40">Registered: {user.registeredDate}</span>
                          )}
                        </div>

                        {user.bio && (
                          <p className="text-[11px] text-[#c9c2ab]/80 line-clamp-1 italic max-w-md pt-0.5">
                            "{user.bio}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quick Controls & Action Buttons */}
                    <div className="flex items-center space-x-2 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-[#d9b45c]/10">
                      {/* Quick Role Dropdown */}
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeRole(user, e.target.value as any)}
                        className="bg-[#12141b] border border-[#d9b45c]/25 rounded-lg px-2 py-1 text-[11px] text-[#d9b45c] font-sans font-bold cursor-pointer outline-none hover:border-[#d9b45c]"
                      >
                        <option value="Administrator">Administrator</option>
                        <option value="Editor">Editor</option>
                        <option value="Author">Author</option>
                        <option value="Subscriber">Subscriber</option>
                      </select>

                      {/* Enable/Disable status toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleUserStatus(user)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isDisabled 
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20" 
                            : "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
                        }`}
                        title={isDisabled ? "Enable User Account" : "Disable User Account"}
                      >
                        <IconPower size={13} />
                      </button>

                      {/* Full Edit button */}
                      <button
                        type="button"
                        onClick={() => setEditingUser({ ...user })}
                        className="flex items-center space-x-1 bg-[#d9b45c]/10 border border-[#d9b45c]/30 hover:bg-[#d9b45c]/20 text-[#f2d98a] px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        title="Edit Account Details"
                      >
                        <IconEdit size={13} />
                        <span>Edit</span>
                      </button>

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => setDeletingUser(user)}
                        className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded-lg transition-all cursor-pointer"
                        title="Delete User Account"
                      >
                        <IconTrash size={13} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: CREATE NEW SCHOLAR / USER FORM */}
        <div className="bg-[#12141b] border border-[#d9b45c]/15 rounded-2xl p-5 space-y-4 h-fit shadow-xl">
          <span className="text-xs text-[#d9b45c] uppercase font-bold tracking-widest flex items-center space-x-2 border-b border-[#d9b45c]/10 pb-2">
            <IconUserPlus size={15} />
            <span>Create New Scholar Account</span>
          </span>

          {addError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-2.5 rounded-xl text-xs flex items-center space-x-2">
              <IconAlert size={14} className="flex-shrink-0" />
              <span>{addError}</span>
            </div>
          )}

          <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
            
            {/* Profile Photo Upload */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-[#c9c2ab] uppercase font-bold block">
                Profile Photo (JPG, PNG, WEBP)
              </label>

              <div className="flex items-center space-x-3">
                <img
                  src={newUser.avatar || DEFAULT_AVATAR}
                  alt="Avatar Preview"
                  className="w-12 h-12 rounded-full object-cover border border-[#d9b45c]/40 flex-shrink-0"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 space-y-1">
                  {/* Drag & Drop Upload Zone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOverAdd(true);
                    }}
                    onDragLeave={() => setIsDragOverAdd(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragOverAdd(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleAvatarFileUpload(e.dataTransfer.files[0], (url) =>
                          setNewUser({ ...newUser, avatar: url })
                        );
                      }
                    }}
                    className={`border-2 border-dashed rounded-xl p-2 text-center transition-all cursor-pointer ${
                      isDragOverAdd
                        ? "border-[#d9b45c] bg-[#d9b45c]/10"
                        : "border-[#d9b45c]/25 bg-[#07080b] hover:border-[#d9b45c]/50"
                    }`}
                  >
                    <label className="cursor-pointer flex items-center justify-center space-x-1.5 text-[11px] text-[#d9b45c] font-bold">
                      <IconUpload size={13} />
                      <span>Upload or Drag Photo</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleAvatarFileUpload(e.target.files[0], (url) =>
                              setNewUser({ ...newUser, avatar: url })
                            );
                          }
                        }}
                      />
                    </label>
                  </div>

                  {newUser.avatar && newUser.avatar !== DEFAULT_AVATAR && (
                    <button
                      type="button"
                      onClick={() => setNewUser({ ...newUser, avatar: DEFAULT_AVATAR })}
                      className="text-[10px] text-red-400 hover:underline block"
                    >
                      Remove uploaded photo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[10px] text-[#c9c2ab] uppercase font-bold block">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sheikh Al-Kamil"
                value={newUser.name || ""}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl p-2.5 text-xs text-white font-sans outline-none focus:border-[#d9b45c]"
              />
            </div>

            {/* Username & Email in 2 Cols */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-[#c9c2ab] uppercase font-bold block">Username</label>
                <input
                  type="text"
                  placeholder="sheikh_kamil"
                  value={newUser.username || ""}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl p-2.5 text-xs text-white font-sans outline-none focus:border-[#d9b45c]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#c9c2ab] uppercase font-bold block">User Role</label>
                <select
                  value={newUser.role || "Author"}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                  className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl p-2.5 text-xs text-[#d9b45c] font-sans font-bold outline-none cursor-pointer"
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Editor">Editor</option>
                  <option value="Author">Author</option>
                  <option value="Subscriber">Subscriber</option>
                </select>
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-[10px] text-[#c9c2ab] uppercase font-bold block">Scholar Email *</label>
              <input
                type="email"
                required
                placeholder="sheikh@truthquran.com"
                value={newUser.email || ""}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl p-2.5 text-xs text-white font-sans outline-none focus:border-[#d9b45c]"
              />
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-[#c9c2ab] uppercase font-bold block">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newUser.password || ""}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl p-2.5 text-xs text-white font-sans outline-none focus:border-[#d9b45c]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#c9c2ab] uppercase font-bold block">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl p-2.5 text-xs text-white font-sans outline-none focus:border-[#d9b45c]"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="text-[10px] text-[#c9c2ab] uppercase font-bold block">Phone Number</label>
              <input
                type="text"
                placeholder="+1 (555) 000-1234"
                value={newUser.phone || ""}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl p-2.5 text-xs text-white font-sans outline-none focus:border-[#d9b45c]"
              />
            </div>

            {/* Biography */}
            <div className="space-y-1">
              <label className="text-[10px] text-[#c9c2ab] uppercase font-bold block">Scholar Biography</label>
              <textarea
                rows={2}
                placeholder="Short biography, qualifications, or teaching experience..."
                value={newUser.bio || ""}
                onChange={(e) => setNewUser({ ...newUser, bio: e.target.value })}
                className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl p-2.5 text-xs text-white font-sans outline-none focus:border-[#d9b45c] resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-[#d9b45c] hover:bg-[#f2d98a] text-black text-xs font-sans font-extrabold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg flex items-center justify-center space-x-2"
            >
              <IconUserPlus size={15} />
              <span>Add New Account</span>
            </button>
          </form>
        </div>

      </div>

      {/* ================= EDIT USER MODAL ================= */}
      {editingUser && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#12141b] border border-[#d9b45c]/30 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative my-8 text-left animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#d9b45c]/15 pb-3">
              <div className="flex items-center space-x-3">
                <img
                  src={editingUser.avatar || DEFAULT_AVATAR}
                  alt={editingUser.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#d9b45c]/40"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-base font-serif font-bold text-white">Edit User: {editingUser.name}</h3>
                  <p className="text-xs text-[#c9c2ab]">Update author details, security permissions, and avatar photo.</p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-white p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <IconX size={18} />
              </button>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSaveEditedUser} className="space-y-4 text-xs">
              
              {/* Avatar Section */}
              <div className="bg-[#07080b] border border-[#d9b45c]/15 p-4 rounded-xl space-y-3">
                <span className="text-[10px] text-[#d9b45c] uppercase font-bold tracking-widest block">
                  Profile Photo (Click or Drag & Drop)
                </span>

                <div className="flex items-center space-x-4">
                  <img
                    src={editingUser.avatar || DEFAULT_AVATAR}
                    alt="Current Avatar"
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#d9b45c]/50 flex-shrink-0 shadow-md"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 space-y-2">
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragOverEdit(true);
                      }}
                      onDragLeave={() => setIsDragOverEdit(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragOverEdit(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleAvatarFileUpload(e.dataTransfer.files[0], (url) =>
                            setEditingUser({ ...editingUser, avatar: url })
                          );
                        }
                      }}
                      className={`border-2 border-dashed rounded-xl p-3 text-center transition-all cursor-pointer ${
                        isDragOverEdit
                          ? "border-[#d9b45c] bg-[#d9b45c]/15"
                          : "border-[#d9b45c]/30 bg-[#12141b] hover:border-[#d9b45c]"
                      }`}
                    >
                      <label className="cursor-pointer flex items-center justify-center space-x-2 text-xs text-[#d9b45c] font-bold">
                        <IconUpload size={14} />
                        <span>Upload New Profile Photo (JPG, PNG, WEBP)</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleAvatarFileUpload(e.target.files[0], (url) =>
                                setEditingUser({ ...editingUser, avatar: url })
                              );
                            }
                          }}
                        />
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        placeholder="Or enter Image URL (https://...)"
                        value={editingUser.avatar || ""}
                        onChange={(e) => setEditingUser({ ...editingUser, avatar: e.target.value })}
                        className="flex-1 bg-[#12141b] border border-[#d9b45c]/20 rounded-lg px-2.5 py-1 text-[11px] text-white font-mono outline-none"
                      />
                      {editingUser.avatar !== DEFAULT_AVATAR && (
                        <button
                          type="button"
                          onClick={() => setEditingUser({ ...editingUser, avatar: DEFAULT_AVATAR })}
                          className="text-[11px] text-red-400 hover:text-red-300 font-bold underline cursor-pointer"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Info Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] text-[#c9c2ab] uppercase font-bold block">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl p-2.5 text-xs text-white font-sans outline-none focus:border-[#d9b45c]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-[#c9c2ab] uppercase font-bold block">Username</label>
                  <input
                    type="text"
                    value={editingUser.username || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                    className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl p-2.5 text-xs text-white font-sans outline-none focus:border-[#d9b45c]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-[#c9c2ab] uppercase font-bold block">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl p-2.5 text-xs text-white font-sans outline-none focus:border-[#d9b45c]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-[#c9c2ab] uppercase font-bold block">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-1234"
                    value={editingUser.phone || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl p-2.5 text-xs text-white font-sans outline-none focus:border-[#d9b45c]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-[#c9c2ab] uppercase font-bold block">User Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                    className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl p-2.5 text-xs text-[#d9b45c] font-sans font-bold outline-none cursor-pointer"
                  >
                    <option value="Administrator">Administrator</option>
                    <option value="Editor">Editor</option>
                    <option value="Author">Author</option>
                    <option value="Subscriber">Subscriber</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-[#c9c2ab] uppercase font-bold block">Account Status</label>
                  <select
                    value={editingUser.status || "active"}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as any })}
                    className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl p-2.5 text-xs font-sans font-bold outline-none cursor-pointer"
                  >
                    <option value="active">Active Account</option>
                    <option value="disabled">Disabled / Suspended</option>
                  </select>
                </div>
              </div>

              {/* Password update */}
              <div className="space-y-1">
                <label className="text-[10px] text-[#c9c2ab] uppercase font-bold block">
                  New Password (leave blank to keep existing password)
                </label>
                <input
                  type="password"
                  placeholder="Enter new account password..."
                  value={editingUser.password || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                  className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl p-2.5 text-xs text-white font-sans outline-none focus:border-[#d9b45c]"
                />
              </div>

              {/* Bio */}
              <div className="space-y-1">
                <label className="text-[10px] text-[#c9c2ab] uppercase font-bold block">Biography & Qualifications</label>
                <textarea
                  rows={3}
                  placeholder="Detailed author bio..."
                  value={editingUser.bio || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, bio: e.target.value })}
                  className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl p-2.5 text-xs text-white font-sans outline-none focus:border-[#d9b45c] resize-none"
                ></textarea>
              </div>

              {/* Social Links */}
              <div className="space-y-2 border-t border-[#d9b45c]/10 pt-3">
                <label className="text-[10px] text-[#d9b45c] uppercase font-bold tracking-widest block">
                  Social Media Links
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Twitter / X profile URL"
                    value={editingUser.socialLinks?.twitter || ""}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        socialLinks: { ...editingUser.socialLinks, twitter: e.target.value }
                      })
                    }
                    className="bg-[#07080b] border border-[#d9b45c]/20 rounded-xl p-2 text-xs text-white font-sans outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Facebook profile URL"
                    value={editingUser.socialLinks?.facebook || ""}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        socialLinks: { ...editingUser.socialLinks, facebook: e.target.value }
                      })
                    }
                    className="bg-[#07080b] border border-[#d9b45c]/20 rounded-xl p-2 text-xs text-white font-sans outline-none"
                  />
                  <input
                    type="text"
                    placeholder="LinkedIn profile URL"
                    value={editingUser.socialLinks?.linkedin || ""}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        socialLinks: { ...editingUser.socialLinks, linkedin: e.target.value }
                      })
                    }
                    className="bg-[#07080b] border border-[#d9b45c]/20 rounded-xl p-2 text-xs text-white font-sans outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Personal / Academic Website"
                    value={editingUser.socialLinks?.website || ""}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        socialLinks: { ...editingUser.socialLinks, website: e.target.value }
                      })
                    }
                    className="bg-[#07080b] border border-[#d9b45c]/20 rounded-xl p-2 text-xs text-white font-sans outline-none"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end space-x-3 border-t border-[#d9b45c]/15 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 bg-[#d9b45c] hover:bg-[#f2d98a] text-black rounded-xl text-xs font-sans font-extrabold uppercase tracking-widest transition-all cursor-pointer shadow-lg flex items-center space-x-1.5"
                >
                  <IconCheck size={14} />
                  <span>Save User Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {deletingUser && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141b] border border-red-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3 text-red-400 border-b border-red-500/20 pb-3">
              <IconAlert size={24} className="flex-shrink-0" />
              <h3 className="text-base font-serif font-bold text-white">Confirm Account Deletion</h3>
            </div>

            <div className="space-y-2 text-xs text-gray-300">
              <p>
                Are you sure you want to permanently delete the user account for{" "}
                <span className="font-bold text-white">{deletingUser.name}</span> ({deletingUser.email})?
              </p>
              <p className="text-[#c9c2ab]/70 text-[11px]">
                This operation will erase this scholar's database profile permanently.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#d9b45c]/10">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg flex items-center space-x-1.5"
              >
                <IconTrash size={14} />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
