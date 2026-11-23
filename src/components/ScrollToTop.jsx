import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// Opens every newly visited page at the top. Links to an anchor (#section) scroll
// to that section instead, and the browser's Back/Forward buttons keep their own
// scroll position.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === "POP") return;
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash, navigationType]);

  return null;
}
