import React, { useState, useEffect } from "react";
import { X, Upload, User } from "lucide-react";
import { api } from "@/api/client";

// Same style as the existing team addresses: /team/shaunriley
export const teamSlug = (name) => (name || "").toLowerCase().replace(/[^a-z0-9]+/g, "");

const EMPTY = { name: "", title: "", phone: "", email: "", photo: "", bio: "", slug: "" };

export default function DashboardTeamModal({ isOpen, onClose, member, existingSlugs = [], onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(member ? { ...EMPTY, ...member } : EMPTY);
    setSlugTouched(!!member);
    setError("");
  }, [member, isOpen]);

  if (!isOpen) return null;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const handleName = (v) => setForm((f) => ({ ...f, name: v, slug: slugTouched ? f.slug : teamSlug(v) }));

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await api.integrations.Core.UploadFile({ file });
      set("photo", file_url);
    } catch (err) {
      setError("Photo upload failed: " + (err?.message || err));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const slug = teamSlug(form.slug || form.name);
    if (!form.name.trim()) return setError("Please enter a name.");
    if (!slug) return setError("Please enter a web address for the bio page.");
    if (existingSlugs.includes(slug) && slug !== member?.slug) {
      return setError(`Another team member already uses /team/${slug}. Choose a different web address.`);
    }
    setSaving(true);
    setError("");
    try {
      await onSave({
        name: form.name.trim(),
        title: form.title.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        photo: form.photo.trim(),
        bio: form.bio.trim(),
        slug,
      });
    } catch (err) {
      setError(err?.message || String(err));
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400";
  const labelCls = "block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5";
  const slugChanged = member && teamSlug(form.slug) !== member.slug;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h2 className="text-slate-800 font-semibold text-base">{member ? "Edit Team Member" : "Add Team Member"}</h2>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg hover:bg-slate-100">
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="flex gap-5">
            <div className="flex-shrink-0">
              <div className="w-28 h-32 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                {form.photo ? (
                  <img src={form.photo} alt="" className="w-full h-full object-cover object-top" />
                ) : (
                  <User size={32} className="text-slate-300" />
                )}
              </div>
              <label className={`mt-2 w-28 inline-flex items-center justify-center gap-1.5 px-2 py-1.5 border border-dashed border-slate-300 rounded-lg text-xs text-slate-600 hover:bg-slate-50 ${uploading ? "opacity-50" : "cursor-pointer"}`}>
                <Upload size={12} />
                {uploading ? "Uploading…" : form.photo ? "Replace" : "Upload photo"}
                <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} disabled={uploading} />
              </label>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className={labelCls}>Name *</label>
                <input className={inputCls} value={form.name} onChange={(e) => handleName(e.target.value)} required />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Title</label>
                <input className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Financial Analyst" />
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input className={inputCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="949.221.1800" />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input className={inputCls} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="name@farislee.com" />
              </div>
            </div>
          </div>

          <div>
            <label className={labelCls}>Photo URL</label>
            <input className={inputCls} value={form.photo} onChange={(e) => set("photo", e.target.value)} placeholder="Filled in automatically when you upload, or paste an image link" />
            <p className="text-xs text-slate-400 mt-1">Portrait photos work best (the Team page crops to the top of the image).</p>
          </div>

          <div>
            <label className={labelCls}>Bio</label>
            <textarea
              className={`${inputCls} h-56 leading-relaxed`}
              value={form.bio}
              onChange={(e) => set("bio", e.target.value)}
              placeholder="Paste the bio here. Leave a blank line between paragraphs."
            />
          </div>

          <div>
            <label className={labelCls}>Bio page address</label>
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 focus-within:ring-2 focus-within:ring-blue-500">
              <span className="pl-3 text-sm text-slate-400 select-none">/team/</span>
              <input
                className="flex-1 px-1 py-2 text-sm bg-transparent focus:outline-none"
                value={form.slug}
                onChange={(e) => { setSlugTouched(true); set("slug", teamSlug(e.target.value)); }}
              />
            </div>
            {slugChanged ? (
              <p className="text-xs text-amber-700 mt-1">Changing this changes the bio page's web address; old links to /team/{member.slug} will stop working.</p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">Created from the name. For brokers, keep it matching their Broker profile (e.g. shaunriley) so their listings show on the bio page.</p>
            )}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={saving || uploading} className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {saving ? "Saving..." : member ? "Save Changes" : "Add Team Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
