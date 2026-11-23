import React, { useState, useEffect } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { api } from "@/api/client";
import { slugify } from "@/lib/slug";

const empty = {
  title: "",
  slug: "",
  publish_date: new Date().toISOString().split("T")[0],
  image_url: "",
  excerpt: "",
  body: "",
  category: "",
  published: true,
  homepage: false,
  tagline: "",
  sale_price: "",
  sqft: "",
  city: "",
  state: "",
};

export default function DashboardNewsModal({ isOpen, onClose, story, onSave }) {
  const [form, setForm] = useState(empty);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  // New stories (and old ones with no web address yet) get their address from the title
  // until it's edited by hand. Existing addresses are never changed automatically,
  // so links already shared keep working.
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    setForm(story ? { ...empty, ...story, slug: story.slug || slugify(story.title, 80) } : { ...empty, publish_date: new Date().toISOString().split("T")[0] });
    setSlugTouched(!!story?.slug);
  }, [story, isOpen]);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await api.integrations.Core.UploadFile({ file });
      set("image_url", file_url);
    } catch (err) {
      window.alert("Image upload failed: " + (err?.message || err));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ ...form, slug: slugify(form.slug || form.title, 80) });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const inputCls = "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";
  const labelCls = "block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <h2 className="text-slate-900 font-semibold text-base">
            {story ? "Edit News Story" : "Add News Story"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Title */}
          <div>
            <label className={labelCls}>Title *</label>
            <input
              required
              className={inputCls}
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title, 80) }));
              }}
              placeholder="Story headline..."
            />
          </div>

          {/* Web address */}
          <div>
            <label className={labelCls}>Web Address</label>
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 focus-within:ring-2 focus-within:ring-blue-500">
              <span className="pl-3 text-sm text-slate-400 whitespace-nowrap">/news/</span>
              <input
                className="flex-1 min-w-0 px-1 py-2 text-sm bg-transparent focus:outline-none"
                value={form.slug}
                onChange={(e) => { set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-")); setSlugTouched(true); }}
                onBlur={() => set("slug", slugify(form.slug || form.title, 80))}
                placeholder="filled in from the title"
              />
            </div>
            {story?.slug && form.slug !== story.slug && (
              <p className="text-xs text-amber-600 mt-1">Changing this breaks any links to the old address (/news/{story.slug}).</p>
            )}
          </div>

          {/* Row: Date + Category + Published */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Publish Date *</label>
              <input
                type="date"
                required
                className={inputCls}
                value={form.publish_date}
                onChange={(e) => set("publish_date", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <input
                className={inputCls}
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                placeholder="e.g. Press Release"
              />
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select
                className={inputCls}
                value={form.published ? "published" : "draft"}
                onChange={(e) => set("published", e.target.value === "published")}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Homepage Success Story */}
          <div className="border border-slate-200 rounded-lg p-4">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 accent-blue-600"
                checked={!!form.homepage}
                onChange={(e) => set("homepage", e.target.checked)}
              />
              <span className="text-sm font-semibold text-slate-700">
                Feature on homepage (Success Stories)
              </span>
            </label>

            {form.homepage && (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Sale Price ($)</label>
                    <input
                      type="number"
                      className={inputCls}
                      value={form.sale_price ?? ""}
                      onChange={(e) => set("sale_price", e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="21000000"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Square Feet</label>
                    <input
                      type="number"
                      className={inputCls}
                      value={form.sqft ?? ""}
                      onChange={(e) => set("sqft", e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="67500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>City</label>
                    <input
                      className={inputCls}
                      value={form.city || ""}
                      onChange={(e) => set("city", e.target.value)}
                      placeholder="San Clemente"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>State</label>
                    <input
                      className={inputCls}
                      value={form.state || ""}
                      onChange={(e) => set("state", e.target.value)}
                      placeholder="CA"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Tagline</label>
                  <input
                    className={inputCls}
                    value={form.tagline || ""}
                    onChange={(e) => set("tagline", e.target.value)}
                    placeholder="Premier Neighborhood Retail Center"
                  />
                </div>
                <p className="text-xs text-slate-400">
                  The image, excerpt, title and date above are used in the Success Stories section.
                </p>
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className={labelCls}>Main Image</label>
            <div className="flex items-center gap-4">
              {form.image_url && (
                <img src={form.image_url} alt="" className="w-24 h-16 object-cover rounded-lg border border-slate-200 flex-shrink-0" />
              )}
              <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm text-slate-500">
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                {uploading ? "Uploading..." : "Upload Image"}
                <input type="file" accept="image/*" className="hidden" onChange={handleImage} disabled={uploading} />
              </label>
              {form.image_url && (
                <button type="button" onClick={() => set("image_url", "")} className="text-xs text-red-500 hover:underline">Remove</button>
              )}
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className={labelCls}>Excerpt / Summary</label>
            <textarea
              rows={2}
              className={inputCls}
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              placeholder="Short summary shown on the news listing page..."
            />
          </div>

          {/* Body */}
          <div>
            <label className={labelCls}>Full Story</label>
            <textarea
              rows={10}
              className={inputCls}
              value={form.body}
              onChange={(e) => set("body", e.target.value)}
              placeholder="Write the full story here... (HTML is supported)"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 flex-shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || uploading}
            className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {story ? "Save Changes" : "Publish Story"}
          </button>
        </div>
      </div>
    </div>
  );
}