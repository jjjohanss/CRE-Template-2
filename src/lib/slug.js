// Turns text into a web-address-friendly slug: "Faris Lee Closes Sale!" -> "faris-lee-closes-sale".
// Optional maxLength trims long slugs (used for news addresses).
export function slugify(text, maxLength) {
  let s = String(text ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  if (maxLength) s = s.slice(0, maxLength).replace(/-+$/, "");
  return s;
}

// The web address of a property page: /listings/<address>-<city>-<state>--<id>.
// The property page only reads the part after "--", so older addresses keep working.
// Also used by scripts/prerender-services.mjs for the sitemap, so links and sitemap always match.
export function listingPath(listing) {
  // Blank parts are skipped: a "--" inside the words would confuse the page about where the ID starts.
  const words = [listing.address, listing.city, listing.state].map((s) => slugify(s)).filter(Boolean).join("-") || "property";
  return `/listings/${words}--${encodeURIComponent(listing.id)}`;
}
