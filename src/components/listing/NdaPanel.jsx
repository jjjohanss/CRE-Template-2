import React, { useState, useEffect, useCallback } from "react";
import { Download, FileSignature, Clock, XCircle, Mail } from "lucide-react";
import { api } from "@/api/client";
import NdaModal from "./NdaModal";

const storageKey = (listingId) => `fli_nda_${listingId}`;
const readToken = (listingId) => {
  try { return localStorage.getItem(storageKey(listingId)); } catch { return null; }
};
const saveToken = (listingId, token) => {
  try { localStorage.setItem(storageKey(listingId), token); } catch { /* private mode */ }
};
const subscriberEmail = () => {
  const m = document.cookie.split("; ").find((c) => c.startsWith("fli_subscriber="));
  return m ? decodeURIComponent(m.split("=")[1]) : "";
};

const btn = "flex items-center justify-center gap-3 w-full py-4 font-bold text-base tracking-widest uppercase transition-colors rounded-2xl shadow-sm";

// Replaces the plain "Download OM" button on listings that require an NDA.
export default function NdaPanel({ listing }) {
  const [token, setToken] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | none | pending | approved | denied
  const [showModal, setShowModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [message, setMessage] = useState("");
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [linkEmail, setLinkEmail] = useState(subscriberEmail());
  const [linkSent, setLinkSent] = useState(false);
  const [linkSending, setLinkSending] = useState(false);
  const [linkError, setLinkError] = useState("");

  const refresh = useCallback(async (t) => {
    if (!t) return setStatus("none");
    try {
      const res = await api.nda.status(t);
      setStatus(res.status === "none" || res.listing_id !== listing.id ? "none" : res.status);
    } catch {
      setStatus("none");
    }
  }, [listing.id]);

  useEffect(() => {
    // A personal link (?nda=…) from an email takes priority and is remembered on this device.
    const params = new URLSearchParams(window.location.search);
    const fromLink = params.get("nda");
    if (fromLink) {
      saveToken(listing.id, fromLink);
      params.delete("nda");
      const qs = params.toString();
      window.history.replaceState({}, "", window.location.pathname + (qs ? `?${qs}` : ""));
    }
    const t = fromLink || readToken(listing.id);
    setToken(t);
    refresh(t);
  }, [listing.id, refresh]);

  const handleSigned = (res) => {
    saveToken(listing.id, res.token);
    setToken(res.token);
    setStatus(res.status);
  };

  const handleDownload = async () => {
    setMessage("");
    setDownloading(true);
    try {
      const { url } = await api.nda.download(token);
      window.location.href = url;
    } catch (err) {
      setMessage(err.message);
      if (err.status) setStatus(err.status);
    } finally {
      setDownloading(false);
    }
  };

  const handleSendLink = async (e) => {
    e.preventDefault();
    setLinkError("");
    setLinkSending(true);
    try {
      const res = await api.nda.sendLink(listing.id, linkEmail);
      if (res?.ok === false) {
        setLinkError("We can't email access links right now. Please call us at (949) 221-1800 and we'll send it to you.");
      } else {
        setLinkSent(true);
      }
    } catch {
      setLinkError("Something went wrong sending your link. Please try again.");
    } finally {
      setLinkSending(false);
    }
  };

  if (status === "loading") {
    return <div className={`${btn} bg-gray-100 text-gray-400`}>Checking access…</div>;
  }

  return (
    <div className="space-y-3">
      {status === "none" && (
        <button onClick={() => setShowModal(true)} className={`${btn} bg-[#C8102E] hover:bg-[#a00d24] text-white`}>
          <FileSignature size={20} />
          Sign NDA to Request OM
        </button>
      )}

      {status === "pending" && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 flex items-start gap-3">
          <Clock size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-neutral-900">NDA signed: awaiting broker approval</p>
            <p className="text-gray-600 mt-1">
              A broker will review your request. Check back on this page; the download appears here once you're approved.
            </p>
            <button onClick={() => refresh(token)} className="mt-2 text-[#C8102E] font-semibold hover:underline">
              Check again
            </button>
          </div>
        </div>
      )}

      {status === "approved" && (
        <button onClick={handleDownload} disabled={downloading} className={`${btn} bg-[#C8102E] hover:bg-[#a00d24] text-white disabled:opacity-60`}>
          <Download size={20} />
          {downloading ? "Preparing…" : "Download OM"}
        </button>
      )}

      {status === "denied" && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 flex items-start gap-3">
          <XCircle size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-neutral-900">Access to this OM wasn't approved</p>
            <p className="text-gray-600 mt-1">Please contact the listing broker if you have questions.</p>
          </div>
        </div>
      )}

      {message && <p className="text-sm text-red-600 text-center">{message}</p>}

      {status === "none" && (
        <div className="text-center text-xs text-gray-500">
          {!showLinkForm ? (
            <button onClick={() => setShowLinkForm(true)} className="hover:underline">
              Already signed on another device? Email me my access link
            </button>
          ) : linkSent ? (
            <p>If you've signed the NDA for this property, we've emailed you a personal access link.</p>
          ) : (
            <>
            <form onSubmit={handleSendLink} className="flex gap-2 justify-center items-center">
              <Mail size={14} className="text-gray-400" />
              <input
                type="email"
                required
                value={linkEmail}
                onChange={(e) => setLinkEmail(e.target.value)}
                placeholder="you@company.com"
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm w-56"
              />
              <button type="submit" disabled={linkSending} className="px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold disabled:opacity-60">
                {linkSending ? "Sending…" : "Send"}
              </button>
            </form>
            {linkError && <p role="alert" className="text-red-600 mt-2">{linkError}</p>}
            </>
          )}
        </div>
      )}

      {showModal && (
        <NdaModal
          listing={listing}
          defaultEmail={subscriberEmail()}
          onClose={() => setShowModal(false)}
          onSigned={handleSigned}
        />
      )}
    </div>
  );
}
