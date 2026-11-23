import React, { useState, useEffect, useRef } from "react";
import { X, Mail, CheckCircle2 } from "lucide-react";
import { api } from "@/api/client";
import { whenRecaptchaReady } from "@/lib/recaptcha";

export default function EmailSignupModal({ onClose, onRegistered }) {
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "", company: "", job_title: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [recaptchaError, setRecaptchaError] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [recaptchaUnavailable, setRecaptchaUnavailable] = useState(false);
  const recaptchaRef = useRef(null);
  // With onRegistered (the listing page's Download OM button) the form unlocks an OM;
  // without it (homepage, "Sign Up for Updates") it's a general newsletter sign-up.
  const forOm = typeof onRegistered === "function";
  const widgetIdRef = useRef(null);

  useEffect(() => {
    const renderWidget = () => {
      if (recaptchaRef.current && window.grecaptcha?.render && widgetIdRef.current === null) {
        widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
          sitekey: '6LfDo_IsAAAAAH6woYYtampdTTiOjHMC-ELWPvE5'
        });
        setRecaptchaUnavailable(false);
      }
    };
    const cancel = whenRecaptchaReady(renderWidget);
    // If Google's script is blocked (ad blocker, network), say so instead of a blank space.
    const timer = setTimeout(() => {
      if (widgetIdRef.current === null) setRecaptchaUnavailable(true);
    }, 10000);
    return () => { cancel(); clearTimeout(timer); };
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const checkEmail = async (email) => {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRe.test(email)) return;
    try {
      setIsReturning(await api.entities.Subscriber.exists(email));
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRecaptchaError(false);
    setSubmitError("");

    const token = window.grecaptcha ? window.grecaptcha.getResponse(widgetIdRef.current) : null;
    if (!token) {
      setRecaptchaError(true);
      return;
    }

    setSubmitting(true);

    // Server-side reCAPTCHA check (Supabase Edge Function: verify-recaptcha).
    // If the function isn't deployed yet, proceed anyway — the widget still acts as a bot gate.
    try {
      const verifyRes = await api.functions.invoke('verifyRecaptcha', { token });
      if (!verifyRes.data?.success) {
        setRecaptchaError(true);
        setSubmitting(false);
        window.grecaptcha?.reset(widgetIdRef.current);
        return;
      }
    } catch {
      // verification backend unavailable — continue with submission
    }

    try {
      const returning = await api.entities.Subscriber.signup(form);
      setIsReturning(returning);
    } catch (err) {
      console.error("Signup failed:", err);
      setSubmitError("Sorry, we couldn't complete your sign-up. Please try again, or call us at (949) 221-1800.");
      setSubmitting(false);
      // A reCAPTCHA answer can only be used once, so ask for a fresh one.
      window.grecaptcha?.reset(widgetIdRef.current);
      return;
    }

    // Set cookie so we don't ask again (365 days — persistent)
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `fli_subscriber=${encodeURIComponent(form.email)}; expires=${expires}; path=/`;
    setSubmitted(true);
    setSubmitting(false);
    if (onRegistered) onRegistered(form.email);
  };

  const inputCls = "w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg text-neutral-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30 focus:border-[#C8102E] transition";
  const labelCls = "block text-xs font-semibold text-neutral-900 uppercase tracking-wide mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="px-6 py-5 bg-[#7e7c7c]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#C8102E] rounded-lg flex items-center justify-center">
                <Mail size={16} className="text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-base" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Stay Informed
                </h2>
                <p className="text-white/50 text-xs">Faris Lee property updates & news</p>
                <p className="text-white/70 text-xs mt-1">{forOm
                  ? (isReturning ? "Welcome back! Confirm your details to continue." : "Sign up to be able to download Offering Memorandums")
                  : (isReturning ? "Welcome back! Confirm your details to stay subscribed." : "Get new listings and investment opportunities by email")}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors">
              <X size={16} className="text-white/70" />
            </button>
          </div>
        </div>

        {submitted ?
        <div className="px-6 py-12 text-center">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} className="text-green-500" />
            </div>
            <h3 className="text-neutral-900 font-bold text-lg mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              {isReturning ? "Welcome Back!" : "You're on the list!"}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              {isReturning
                ? (forOm
                  ? "Your information has been updated. Your Offering Memorandum download will begin shortly."
                  : "Your information has been updated. You'll keep receiving property updates and investment opportunities.")
                : "Thank you for signing up. You'll receive exclusive property updates and investment opportunities directly to your inbox."}
            </p>
            <button
            onClick={onClose}
            className="mt-6 px-8 py-2.5 bg-[#C8102E] text-white text-sm font-semibold tracking-widest uppercase rounded-lg hover:bg-[#a00d24] transition-colors">
            
              Close
            </button>
          </div> :

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>First Name {isReturning ? "" : "*"}</label>
                <input className={inputCls} placeholder="Jane" value={form.first_name} onChange={(e) => set("first_name", e.target.value)} required={!isReturning} />
              </div>
              <div>
                <label className={labelCls}>Last Name {isReturning ? "" : "*"}</label>
                <input className={inputCls} placeholder="Smith" value={form.last_name} onChange={(e) => set("last_name", e.target.value)} required={!isReturning} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Email Address *</label>
              <input className={inputCls} type="email" placeholder="jane@company.com" value={form.email} onChange={(e) => { set("email", e.target.value); setIsReturning(false); }} onBlur={(e) => checkEmail(e.target.value)} required />
              <p className="text-xs text-gray-400 mt-1.5">If you are a returning user, simply enter your email to continue.</p>
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input className={inputCls} type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Company</label>
              <input className={inputCls} placeholder="Acme Investments" value={form.company} onChange={(e) => set("company", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Job Title</label>
              <input className={inputCls} placeholder="Investment Manager" value={form.job_title} onChange={(e) => set("job_title", e.target.value)} />
            </div>

            {/* reCAPTCHA */}
            <div>
              <div ref={recaptchaRef}></div>
              {recaptchaError &&
            <p className="text-red-500 text-xs mt-1">Please complete the reCAPTCHA verification.</p>
            }
              {recaptchaUnavailable &&
            <p className="text-red-500 text-xs mt-1">The security check didn't load. Please refresh the page, or turn off any ad blocker for this site.</p>
            }
            </div>

            {/* Opt-in language */}
            <div className="bg-[#F7F8FA] rounded-xl p-4 text-xs text-gray-500 leading-relaxed border border-gray-100">
              By submitting this form, you consent to receive property listings, investment opportunities, and market updates from Faris Lee Investments. You may unsubscribe at any time. We respect your privacy and do not sell your information to third parties. You can revoke your consent to receive emails at any time by using the Safe Unsubscribe® link, found at the bottom of every email.
            </div>

            {submitError &&
            <p role="alert" className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">{submitError}</p>
            }

            <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#C8102E] text-white text-sm font-semibold tracking-widest uppercase rounded-lg hover:bg-[#a00d24] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            
              {submitting ?
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</> :

              (isReturning ? (forOm ? "Download OM" : "Update My Details") : "Sign Up for Property Updates")
              }
            </button>
          </form>
        }
      </div>
    </div>);

}