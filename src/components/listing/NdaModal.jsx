import React, { useState, useEffect, useRef } from "react";
import { X, FileSignature, CheckCircle2 } from "lucide-react";
import { api } from "@/api/client";
import { whenRecaptchaReady } from "@/lib/recaptcha";

const RECAPTCHA_SITE_KEY = "6LfDo_IsAAAAAH6woYYtampdTTiOjHMC-ELWPvE5";

// Visitor-facing NDA: read the agreement, tick "I agree", type full legal name, submit.
export default function NdaModal({ listing, defaultEmail = "", onClose, onSigned }) {
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: defaultEmail, phone: "", company: "", job_title: "",
    signed_name: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const recaptchaRef = useRef(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    const render = () => {
      if (recaptchaRef.current && window.grecaptcha?.render && widgetIdRef.current === null) {
        widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, { sitekey: RECAPTCHA_SITE_KEY });
      }
    };
    const cancel = whenRecaptchaReady(render);
    // If Google's script is blocked (ad blocker, network), say so instead of a blank space.
    const timer = setTimeout(() => {
      if (widgetIdRef.current === null) setError("The security check didn't load. Please refresh the page, or turn off any ad blocker for this site.");
    }, 10000);
    return () => { cancel(); clearTimeout(timer); };
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!agreed) return setError("Please tick the box to confirm you agree to the NDA.");
    if (form.signed_name.trim().length < 2) return setError("Please type your full legal name to sign.");
    const token = window.grecaptcha ? window.grecaptcha.getResponse(widgetIdRef.current) : "";
    if (!token) return setError("Please complete the reCAPTCHA verification.");

    setSubmitting(true);
    try {
      const res = await api.nda.sign(listing.id, { ...form, agreed: true }, token);
      const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = `fli_subscriber=${encodeURIComponent(form.email)}; expires=${expires}; path=/`;
      setResult(res);
      onSigned?.(res);
    } catch (err) {
      setError(err.message);
      window.grecaptcha?.reset(widgetIdRef.current);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg text-neutral-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30 focus:border-[#C8102E] transition";
  const labelCls = "block text-xs font-semibold text-neutral-900 uppercase tracking-wide mb-1.5";
  const property = listing.title || listing.address;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
        <div className="px-6 py-5 bg-[#7e7c7c] sticky top-0 z-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 bg-[#C8102E] rounded-lg flex items-center justify-center flex-shrink-0">
                <FileSignature size={16} className="text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-white font-bold text-base" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Non-Disclosure Agreement
                </h2>
                <p className="text-white/70 text-xs truncate">{property}</p>
              </div>
            </div>
            <button onClick={onClose} aria-label="Close" className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors flex-shrink-0">
              <X size={16} className="text-white/70" />
            </button>
          </div>
        </div>

        {result ? (
          <div className="px-6 py-12 text-center">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} className="text-green-500" />
            </div>
            <h3 className="text-neutral-900 font-bold text-lg mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              {result.status === "approved" ? "You're approved" : "NDA received"}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto">
              {result.status === "approved"
                ? "You already have access. You can download the Offering Memorandum from the listing page."
                : result.status === "denied"
                ? "A broker has already reviewed your request. Please contact the listing broker for details."
                : "Thank you. A broker will review your request. Once approved, come back to this listing to download the Offering Memorandum."}
            </p>
            <button onClick={onClose} className="mt-6 px-8 py-2.5 bg-[#C8102E] text-white text-sm font-semibold tracking-widest uppercase rounded-lg hover:bg-[#a00d24] transition-colors">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <p className="text-sm text-gray-600">
              The Offering Memorandum for this property is confidential. Please review and sign the agreement below.
              A broker will approve your request before the OM is released.
            </p>

            <div>
              <label className={labelCls}>Agreement</label>
              <div
                className="h-56 overflow-y-auto whitespace-pre-wrap text-xs leading-relaxed text-gray-700 bg-[#F7F8FA] border border-gray-200 rounded-lg p-4"
                tabIndex={0}
                aria-label="Non-disclosure agreement text"
              >
                {listing.nda_text}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>First Name *</label>
                <input className={inputCls} value={form.first_name} onChange={(e) => set("first_name", e.target.value)} required />
              </div>
              <div>
                <label className={labelCls}>Last Name *</label>
                <input className={inputCls} value={form.last_name} onChange={(e) => set("last_name", e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Email Address *</label>
                <input className={inputCls} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input className={inputCls} type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Company</label>
                <input className={inputCls} value={form.company} onChange={(e) => set("company", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Job Title</label>
                <input className={inputCls} value={form.job_title} onChange={(e) => set("job_title", e.target.value)} />
              </div>
            </div>

            <label className="flex items-start gap-3 text-sm text-neutral-900 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#C8102E]"
              />
              <span>I have read and agree to the Non-Disclosure Agreement above.</span>
            </label>

            <div>
              <label className={labelCls}>Signature: type your full legal name *</label>
              <input
                className={`${inputCls} italic`}
                style={{ fontFamily: "'Playfair Display', serif" }}
                value={form.signed_name}
                onChange={(e) => set("signed_name", e.target.value)}
                placeholder="Jane A. Smith"
                required
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Typing your name is your electronic signature. We record it with the date, time and the agreement text.
              </p>
            </div>

            <div ref={recaptchaRef} />

            <div className="bg-[#F7F8FA] rounded-xl p-4 text-xs text-gray-500 leading-relaxed border border-gray-100">
              By submitting this form, you consent to receive property listings, investment opportunities, and market updates
              from Faris Lee Investments. You may unsubscribe at any time. We respect your privacy and do not sell your
              information to third parties.
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-[#C8102E] text-white text-sm font-semibold tracking-widest uppercase rounded-lg hover:bg-[#a00d24] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...
                </>
              ) : (
                "Sign NDA & Request OM"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
