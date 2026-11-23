import React, { useState, useEffect, useRef } from "react";
import { X, Upload, Plus, Trash2, FileLock2 } from "lucide-react";
import { api } from "@/api/client";
import ReactQuill from "react-quill";
import { useQuery } from "@tanstack/react-query";
import { brokersQuery } from "@/lib/queries";

const EMPTY = {
  title: "", address: "", city: "", state: "", zip: "",
  price: "", status: "active", property_type: "",
  sqft: "", year_built: "", cap_rate: "", noi: "",
  listing_number: "", listed_date: "", closing_date: "", coe_psa: "", offers: "",
  description: "", images: [], highlights: [], brokers: [],
  om_url: "", latitude: "", longitude: "",
  nda_required: false, nda_text: "", nda_om_path: "", nda_om_filename: "",
};

export default function DashboardListingModal({ isOpen, onClose, listing, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  // Brokers come from Dashboard → Brokers, so new brokers appear here automatically.
  const { data: brokerRows = [], isLoading: brokersLoading, isError: brokersError } = useQuery(brokersQuery);
  const [uploading, setUploading] = useState(false);
  const [omUploading, setOmUploading] = useState(false);
  const [highlightInput, setHighlightInput] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (listing) {
      setForm({ ...EMPTY, ...listing });
    } else {
      setForm(EMPTY);
    }
  }, [listing, isOpen]);

  if (!isOpen) return null;

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    e.target.value = "";
    if (!files.length) return;
    setUploading(true);
    const failed = [];
    try {
      for (const file of files) {
        try {
          const { file_url } = await api.integrations.Core.UploadFile({ file });
          setForm(f => {
            const existing = Array.isArray(f.images) ? f.images : [];
            return {
              ...f,
              images: [...existing, file_url],
              image_url: f.image_url || file_url,
            };
          });
        } catch (err) {
          failed.push(`${file.name}: ${err?.message || err}`);
        }
      }
    } finally {
      setUploading(false);
    }
    if (failed.length) {
      window.alert(`${failed.length} of ${files.length} image${files.length === 1 ? "" : "s"} could not be uploaded:\n\n${failed.join("\n")}`);
    }
  };

  const handleNdaOmUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setOmUploading(true);
    try {
      const { path, filename } = await api.integrations.Core.UploadPrivateOm({ file });
      setForm(f => ({ ...f, nda_om_path: path, nda_om_filename: filename }));
    } catch (err) {
      window.alert("OM upload failed: " + (err?.message || err));
    } finally {
      setOmUploading(false);
    }
  };

  const removeImage = (idx) => {
    setForm(f => {
      const imgs = (Array.isArray(f.images) ? f.images : []).filter((_, i) => i !== idx);
      return { ...f, images: imgs, image_url: imgs[0] || "" };
    });
  };

  const addHighlight = () => {
    if (!highlightInput.trim()) return;
    setForm(f => ({ ...f, highlights: [...(f.highlights || []), highlightInput.trim()] }));
    setHighlightInput("");
  };

  const removeHighlight = (idx) => {
    setForm(f => ({ ...f, highlights: f.highlights.filter((_, i) => i !== idx) }));
  };

  const toggleBroker = (slug) => {
    setForm(f => {
      const brokers = f.brokers || [];
      return {
        ...f,
        brokers: brokers.includes(slug) ? brokers.filter(b => b !== slug) : [...brokers, slug],
      };
    });
  };

  // Every broker in the Brokers table, plus any slug already on this listing that no
  // longer matches a broker (shown as "removed" so it can be un-assigned).
  const brokerOptions = [
    ...brokerRows.filter(b => b.slug).map(b => ({ value: b.slug, label: b.name || b.slug })),
    ...(brokersLoading || brokersError ? [] : form.brokers || [])
      .filter(slug => !brokerRows.some(b => b.slug === slug))
      .map(slug => ({ value: slug, label: slug, missing: true })),
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.nda_required && !(form.nda_text || "").trim()) {
      window.alert("Paste the NDA text, or untick \"Require NDA\".");
      return;
    }
    setSaving(true);
    const data = {
      ...form,
      price: parseFloat(form.price) || 0,
      sqft: parseFloat(form.sqft) || undefined,
      year_built: parseInt(form.year_built) || undefined,
      cap_rate: parseFloat(form.cap_rate) || undefined,
      noi: parseFloat(form.noi) || undefined,
      offers: form.offers !== "" ? parseInt(form.offers) : undefined,
      latitude: parseFloat(form.latitude) || undefined,
      longitude: parseFloat(form.longitude) || undefined,
      nda_required: !!form.nda_required,
      // NDA listings must never expose a public OM link.
      om_url: form.nda_required ? "" : form.om_url,
    };
    await onSave(data);
    setSaving(false);
  };

  const inputCls = "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";
  const labelCls = "block text-xs font-medium text-slate-600 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h2 className="text-slate-800 font-semibold text-base">
            {listing ? "Edit Listing" : "Add New Listing"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Address */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Location</h3>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className={labelCls}>Title</label>
                <input className={inputCls} value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Prime Retail Investment" />
              </div>
              <div>
                <label className={labelCls}>Address *</label>
                <input className={inputCls} value={form.address} onChange={e => set("address", e.target.value)} required />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>City</label>
                  <input className={inputCls} value={form.city} onChange={e => set("city", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>State</label>
                  <input className={inputCls} value={form.state} onChange={e => set("state", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Zip</label>
                  <input className={inputCls} value={form.zip} onChange={e => set("zip", e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Latitude</label>
                  <input className={inputCls} type="number" step="any" value={form.latitude} onChange={e => set("latitude", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Longitude</label>
                  <input className={inputCls} type="number" step="any" value={form.longitude} onChange={e => set("longitude", e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Property Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Price *</label>
                <input className={inputCls} type="number" value={form.price} onChange={e => set("price", e.target.value)} required />
              </div>
              <div>
                <label className={labelCls}>Status</label>
                <select className={inputCls} value={form.status} onChange={e => set("status", e.target.value)}>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Property Type</label>
                <select className={inputCls} value={form.property_type} onChange={e => set("property_type", e.target.value)}>
                  <option value="">— Select —</option>
                  <option value="Single Tenant">Single Tenant</option>
                  <option value="Multi Tenant">Multi Tenant</option>
                  <option value="Grocery Anchored">Grocery Anchored</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Sq Ft</label>
                <input className={inputCls} type="number" value={form.sqft} onChange={e => set("sqft", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Year Built</label>
                <input className={inputCls} type="number" value={form.year_built} onChange={e => set("year_built", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Cap Rate (%)</label>
                <input className={inputCls} type="number" step="0.01" value={form.cap_rate} onChange={e => set("cap_rate", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>NOI ($)</label>
                <input className={inputCls} type="number" value={form.noi} onChange={e => set("noi", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>OM URL</label>
                {form.nda_required ? (
                  <p className="px-3 py-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg">
                    NDA listing: upload the OM privately in the NDA section below.
                  </p>
                ) : (
                  <input className={inputCls} value={form.om_url || ""} onChange={e => set("om_url", e.target.value)} placeholder="https://..." />
                )}
              </div>
              <div>
                <label className={labelCls}>Listings #</label>
                <input className={inputCls} value={form.listing_number || ""} onChange={e => set("listing_number", e.target.value)} placeholder="e.g. FL-2025-001" />
              </div>
              <div>
                <label className={labelCls}>Listed Date</label>
                <input className={inputCls} type="date" value={form.listed_date || ""} onChange={e => set("listed_date", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Closing Date</label>
                <input className={inputCls} type="date" value={form.closing_date || ""} onChange={e => set("closing_date", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>COE/PSA</label>
                <input className={inputCls} value={form.coe_psa || ""} onChange={e => set("coe_psa", e.target.value)} placeholder="e.g. 03/2025 or yes" />
              </div>
              <div>
                <label className={labelCls}>Offers</label>
                <input className={inputCls} type="number" value={form.offers || ""} onChange={e => set("offers", e.target.value)} placeholder="0" />
              </div>
            </div>
          </div>

          {/* NDA */}
          <div className="rounded-xl border border-slate-200 p-4 space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={!!form.nda_required}
                onChange={e => set("nda_required", e.target.checked)}
                className="w-4 h-4 accent-blue-600"
              />
              <FileLock2 size={16} className="text-slate-500" />
              <span className="text-sm font-medium text-slate-800">Require NDA before OM access</span>
            </label>
            <p className="text-xs text-slate-500 -mt-1 ml-6">
              Visitors sign the NDA, then a broker approves them under NDA Requests before they can download the OM.
            </p>

            {form.nda_required && (
              <div className="space-y-3 ml-6">
                <div>
                  <label className={labelCls}>NDA text *</label>
                  <textarea
                    className={`${inputCls} h-48 font-mono text-xs leading-relaxed`}
                    value={form.nda_text || ""}
                    onChange={e => set("nda_text", e.target.value)}
                    placeholder="Paste the full confidentiality agreement here. Line breaks are kept."
                  />
                </div>
                <div>
                  <label className={labelCls}>Offering Memorandum (private)</label>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className={`inline-flex items-center gap-2 px-4 py-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors ${omUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                      <Upload size={15} />
                      {omUploading ? "Uploading..." : form.nda_om_path ? "Replace OM" : "Upload OM (PDF)"}
                      <input type="file" accept="application/pdf,.pdf" className="hidden" onChange={handleNdaOmUpload} disabled={omUploading} />
                    </label>
                    {form.nda_om_path ? (
                      <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                        {form.nda_om_filename || "OM uploaded"}
                      </span>
                    ) : (
                      <span className="text-xs text-amber-700">No OM uploaded yet. Approved leads can't download until you add one.</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">Stored privately. Only approved leads get a download link, which expires after 5 minutes.</p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <ReactQuill
              value={form.description || ""}
              onChange={(val) => set("description", val)}
              modules={{ toolbar: [["bold", "italic", "underline"], [{ list: "ordered" }, { list: "bullet" }], ["clean"]] }}
              className="bg-white rounded-lg"
              style={{ minHeight: "100px" }}
            />
          </div>

          {/* Highlights */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Highlights</h3>
            <div className="flex gap-2 mb-2">
              <input
                className={inputCls}
                placeholder="Add a highlight..."
                value={highlightInput}
                onChange={e => setHighlightInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addHighlight())}
              />
              <button type="button" onClick={addHighlight} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-1">
              {(form.highlights || []).map((h, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg text-sm text-slate-700">
                  <span className="flex-1">{h}</span>
                  <button type="button" onClick={() => removeHighlight(i)}><Trash2 size={13} className="text-slate-400 hover:text-red-500" /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Images</h3>
            <label
              className={`inline-flex items-center gap-2 px-4 py-2.5 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:bg-slate-50 transition-colors ${uploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              onClick={e => e.stopPropagation()}
            >
              <Upload size={15} />
              {uploading ? "Uploading..." : "Upload Images"}
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
            </label>
            <div className="flex flex-wrap gap-2 mt-3">
              {(form.images || []).map((url, i) => (
                <div key={i} className="relative group">
                  <img src={url} alt="" className="w-20 h-16 object-cover rounded-lg border border-slate-200" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} className="text-white" />
                  </button>
                  {i === 0 && <span className="absolute bottom-0 left-0 right-0 text-center text-white text-xs bg-black/50 rounded-b-lg py-0.5">Primary</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Brokers */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Assigned Brokers</h3>
            {brokersLoading && <p className="text-xs text-slate-400">Loading brokers...</p>}
            {brokersError && <p className="text-xs text-red-500">Couldn't load the broker list. Close this window and try again.</p>}
            {!brokersLoading && !brokersError && brokerOptions.length === 0 && (
              <p className="text-xs text-slate-400">No brokers yet. Add them under Brokers first.</p>
            )}
            <div className="flex flex-wrap gap-2">
              {brokerOptions.map(b => (
                <button
                  key={b.value}
                  type="button"
                  onClick={() => toggleBroker(b.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    (form.brokers || []).includes(b.value)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-slate-600 border-slate-200 hover:border-blue-400"
                  }`}
                >
                  {b.label}
                  {b.missing && <span className="ml-1 opacity-75">(removed)</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {saving ? "Saving..." : listing ? "Save Changes" : "Add Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}