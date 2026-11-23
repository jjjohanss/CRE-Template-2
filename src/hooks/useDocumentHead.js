import { useEffect } from "react";

// Sets the page title, meta description, canonical URL, social tags and JSON-LD
// while a page is open, and restores the site defaults when you navigate away.
function setMeta(selector, attr, key, value) {
  let el = document.head.querySelector(selector);
  const prev = el ? el.getAttribute("content") : null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
  return () => (prev === null ? el.remove() : el.setAttribute("content", prev));
}

export function useDocumentHead({ title, description, canonical, jsonLd }) {
  useEffect(() => {
    const undo = [];
    const prevTitle = document.title;
    document.title = title;
    undo.push(() => { document.title = prevTitle; });

    if (description) {
      undo.push(setMeta('meta[name="description"]', "name", "description", description));
      undo.push(setMeta('meta[property="og:description"]', "property", "og:description", description));
      undo.push(setMeta('meta[name="twitter:description"]', "name", "twitter:description", description));
    }
    undo.push(setMeta('meta[property="og:title"]', "property", "og:title", title));
    undo.push(setMeta('meta[name="twitter:title"]', "name", "twitter:title", title));

    if (canonical) {
      undo.push(setMeta('meta[property="og:url"]', "property", "og:url", canonical));
      let link = document.head.querySelector('link[rel="canonical"]');
      const prevHref = link?.getAttribute("href");
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
      undo.push(() => (prevHref ? link.setAttribute("href", prevHref) : link.remove()));
    }

    if (jsonLd) {
      // The prerendered HTML already contains this block; reuse it instead of duplicating.
      let script = document.head.querySelector('script[data-page-jsonld]');
      const created = !script;
      if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-page-jsonld", "");
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
      undo.push(() => (created ? script.remove() : script.remove()));
    }

    return () => undo.reverse().forEach((fn) => fn());
  }, [title, description, canonical, jsonLd]);
}
