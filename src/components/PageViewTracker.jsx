import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/api/supabaseClient";

// Records one anonymous page view per page visited (see 004_analytics.sql).
// Skips the Dashboard, signed-in admins, and obvious bots. Never blocks the page.
const BOT_RE = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|embedly|monitor/i;

function sessionId() {
  try {
    let id = sessionStorage.getItem("fli_session");
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem("fli_session", id);
    }
    return id;
  } catch {
    return null; // storage blocked (private mode etc.): don't track
  }
}

export default function PageViewTracker() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (/^\/dashboard/i.test(pathname)) return;
    if (BOT_RE.test(navigator.userAgent || "")) return;

    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled || data.session?.user?.app_metadata?.role === "admin") return;
      const sid = sessionId();
      if (!sid) return;
      const listingMatch = pathname.match(/^\/listings\/[^/]*--([^/]+)$/);
      const ref = document.referrer && !document.referrer.startsWith(window.location.origin) ? document.referrer : null;
      await supabase.rpc("track_page_view", {
        p_session_id: sid,
        p_path: pathname.slice(0, 300),
        p_listing_id: listingMatch ? decodeURIComponent(listingMatch[1]) : null,
        p_referrer: ref,
      });
    })().catch(() => {});

    return () => { cancelled = true; };
  }, [pathname]);

  return null;
}
