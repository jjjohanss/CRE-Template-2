import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { slugify } from "@/lib/slug";

const EMPTY = {
  slug: "",
  name: "",
  title: "",
  license: "",
  phone: "",
  email: "",
  image: "",
  thumbImage: "",
  bio: [],
  order: 0,
};

export default function DashboardBrokerModal({ isOpen, onClose, broker, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (broker) {
      setForm({ ...EMPTY, ...broker, bio: broker.bio || [] });
      setSlugTouched(true);
    } else {
      setForm(EMPTY);
      setSlugTouched(false);
    }
  }, [broker, isOpen]);

  if (!isOpen) return null;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleNameChange = (val) => {
    set("name", val);
    if (!slugTouched) set("slug", slugify(val));
  };

  const addBioPara = () => set("bio", [...form.bio, ""]);
  const updateBioPara = (i, val) => set("bio", form.bio.map((p, idx) => (idx === i ? val : p)));
  const removeBioPara = (i) => set("bio", form.bio.filter((_, idx) => idx !== i));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      slug: form.slug || slugify(form.name),
      order: Number(form.order) || 0,
      bio: form.bio.filter((p) => p.trim()),
    };
    onSave(payload);
  };

  const inputCls = "w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400";
  const labelCls = "block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <h2 className="text-slate-900 font-semibold text-base">{broker ? "Edit Broker" : "Add Broker"}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-5">
            {/* Name + Slug */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Name *</label>
                <input className={inputCls} value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Jane Doe" required />
              </div>
              <div>
                <label className={labelCls}>Slug *</label>
                <input className={inputCls} value={form.slug} onChange={(e) => { set("slug", slugify(e.target.value)); setSlugTouched(true); }} placeholder="jane-doe" required />
              </div>
            </div>

            {/* Title + License */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Title</label>
                <input className={inputCls} value={form.title || ""} onChange={(e) => set("title", e.target.value)} placeholder="Managing Principal" />
              </div>
              <div>
                <label className={labelCls}>License</label>
                <input className={inputCls} value={form.license || ""} onChange={(e) => set("license", e.target.value)} placeholder="DRE# 01234567" />
              </div>
            </div>

            {/* Phone + Email */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Phone</label>
                <input className={inputCls} value={form.phone || ""} onChange={(e) => set("phone", e.target.value)} placeholder="949.221.1800" />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" className={inputCls} value={form.email || ""} onChange={(e) => set("email", e.target.value)} placeholder="name@farislee.com" />
              </div>
            </div>

            {/* Image URLs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Photo URL</label>
                <input className={inputCls} value={form.image || ""} onChange={(e) => set("image", e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <label className={labelCls}>Thumbnail URL</label>
                <input className={inputCls} value={form.thumbImage || ""} onChange={(e) => set("thumbImage", e.target.value)} placeholder="https://..." />
              </div>
            </div>

            {/* Order */}
            <div className="w-32">
              <label className={labelCls}>Sort Order</label>
              <input type="number" className={inputCls} value={form.order || 0} onChange={(e) => set("order", e.target.value)} placeholder="0" />
            </div>

            {/* Bio paragraphs */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelCls + " mb-0"}>Bio Paragraphs</label>
                <button type="button" onClick={addBioPara} className="flex items-center gap-1 text-blue-600 text-xs font-semibold hover:underline">
                  <Plus size={13} /> Add paragraph
                </button>
              </div>
              <div className="space-y-2">
                {form.bio.length === 0 && (
                  <p className="text-slate-400 text-xs italic">No bio paragraphs yet. Click "Add paragraph" to begin.</p>
                )}
                {form.bio.map((para, i) => (
                  <div key={i} className="flex gap-2">
                    <textarea
                      className="flex-1 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[80px]"
                      value={para}
                      onChange={(e) => updateBioPara(i, e.target.value)}
                      placeholder={`Paragraph ${i + 1}...`}
                    />
                    <button type="button" onClick={() => removeBioPara(i)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50 flex-shrink-0">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
              {broker ? "Save Changes" : "Add Broker"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}