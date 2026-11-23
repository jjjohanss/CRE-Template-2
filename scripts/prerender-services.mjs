// Runs after `vite build` (see package.json "build").
// 1. Writes a ready-made HTML file for each service page (dist/services/<slug>/index.html)
//    with its own <title>, meta description, canonical URL, social tags, JSON-LD and the
//    full page text, so search engines and link previews see it without running JavaScript.
//    The React app then loads normally on top of it.
// 2. Writes dist/sitemap.xml and dist/robots.txt.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  servicePages, servicePath, parseLinks, serviceJsonLd, SITE_ORIGIN, PHONE, PHONE_HREF, EMAIL,
} from "../src/data/servicePages.js";
import { listingPath } from "../src/lib/slug.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const template = readFileSync(join(dist, "index.html"), "utf8");

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const rich = (text) =>
  parseLinks(text).map((p) => (p.href ? `<a href="${esc(p.href)}">${esc(p.text)}</a>` : esc(p.text))).join("");

function replaceTag(html, pattern, replacement, label) {
  if (!pattern.test(html)) throw new Error(`prerender: couldn't find ${label} in index.html`);
  return html.replace(pattern, replacement);
}

function pageHtml(page) {
  const url = SITE_ORIGIN + servicePath(page.slug);
  let html = template;
  html = replaceTag(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(page.seoTitle)}</title>`, "<title>");
  html = replaceTag(html, /<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${esc(page.metaDescription)}" />`, "meta description");
  html = replaceTag(html, /<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${esc(url)}" />`, "canonical");
  html = replaceTag(html, /<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${esc(page.seoTitle)}" />`, "og:title");
  html = replaceTag(html, /<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${esc(page.metaDescription)}" />`, "og:description");
  html = replaceTag(html, /<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${esc(url)}" />`, "og:url");
  html = replaceTag(html, /<meta name="twitter:title" content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${esc(page.seoTitle)}" />`, "twitter:title");
  html = replaceTag(html, /<meta name="twitter:description" content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${esc(page.metaDescription)}" />`, "twitter:description");

  const jsonLd = JSON.stringify(serviceJsonLd(page)).replace(/</g, "\\u003c");
  html = html.replace("</head>", `  <script type="application/ld+json" data-page-jsonld>${jsonLd}</script>\n  </head>`);

  const others = servicePages.filter((p) => p.slug !== page.slug);
  const body = `
      <header>
        <nav aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/expertise">Services</a> › ${esc(page.title)}</nav>
        <p>${esc(page.eyebrow)}</p>
        <h1>${esc(page.title)}</h1>
        <p>${esc(page.intro)}</p>
      </header>
      <main>
        ${page.sections.map((s) => `<section><h2>${esc(s.heading)}</h2>${s.paragraphs.map((p) => `<p>${rich(p)}</p>`).join("")}</section>`).join("\n        ")}
        ${page.propertyTypes.length ? `<section><h2>${esc(page.listingsHeading)}</h2><p><a href="/listings">View all available listings</a></p></section>` : ""}
        <section><h2>${esc(page.title)}: Frequently Asked Questions</h2>${page.faqs.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("")}</section>
        ${page.disclaimer ? `<p>${esc(page.disclaimer)}</p>` : ""}
        <aside><h2>Talk to an Advisor</h2><p><a href="${PHONE_HREF}">${esc(PHONE)}</a> · <a href="mailto:${EMAIL}">${EMAIL}</a> · <a href="/Team">Meet Our Team</a></p>
        <h2>Other Services</h2><ul>${others.map((o) => `<li><a href="${servicePath(o.slug)}">${esc(o.title)}</a></li>`).join("")}<li><a href="/expertise">Our Expertise</a></li></ul></aside>
      </main>`;
  html = replaceTag(html, /<div id="root"><\/div>/, `<div id="root">${body}\n    </div>`, '<div id="root">');
  return html;
}

for (const page of servicePages) {
  const out = join(dist, "services", page.slug, "index.html");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, pageHtml(page));
}

// Sitemap: main pages, service pages, and (read from Supabase at build time)
// every active property page, team bio and published news article.
const today = new Date().toISOString().slice(0, 10);
const day = (d) => (d ? String(d).slice(0, 10) : today);

async function fetchRows(table, query) {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn(`sitemap: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY not set; skipping ${table}`);
    return [];
  }
  try {
    const res = await fetch(`${url.replace(/\/+$/, "")}/rest/v1/${table}?${query}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn(`sitemap: couldn't read ${table} (${e.message}); continuing without it`);
    return [];
  }
}

const [listings, team, news] = await Promise.all([
  fetchRows("listings", "select=id,address,city,state,updated_date&status=eq.active&order=updated_date.desc"),
  fetchRows("team_members", "select=slug,updated_date&order=sort_order"),
  fetchRows("news_stories", "select=slug,publish_date,updated_date&published=eq.true&order=publish_date.desc"),
]);

const entries = [
  ...["/", "/listings", "/listings-by-state", "/expertise", "/Team", "/news", "/careers"].map((p) => ({ p, lastmod: today })),
  ...servicePages.map((pg) => ({ p: servicePath(pg.slug), lastmod: today })),
  ...listings.map((l) => ({ p: listingPath(l), lastmod: day(l.updated_date) })),
  ...team.filter((t) => t.slug).map((t) => ({ p: `/team/${encodeURIComponent(t.slug)}`, lastmod: day(t.updated_date) })),
  // News pages are looked up by slug, so stories without one have no working page.
  ...news.filter((n) => n.slug).map((n) => ({ p: `/news/${encodeURIComponent(n.slug)}`, lastmod: day(n.updated_date || n.publish_date) })),
];
const skippedNews = news.filter((n) => !n.slug).length;
if (skippedNews) console.warn(`sitemap: ${skippedNews} published news ${skippedNews === 1 ? "story has no slug and was" : "stories have no slug and were"} left out`);

const xmlEsc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
writeFileSync(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    entries.map((e) => `  <url><loc>${xmlEsc(SITE_ORIGIN + e.p)}</loc><lastmod>${e.lastmod}</lastmod></url>`).join("\n") +
    `\n</urlset>\n`
);
const paths = entries;
// /*?nda= : personal NDA access links (sent to approved leads by email)
// /listings?term= : on-site search results (thin duplicates of /listings)
writeFileSync(
  join(dist, "robots.txt"),
  `User-agent: *\nDisallow: /*?nda=\nDisallow: /listings?term=\nAllow: /\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`
);

console.log(`prerendered ${servicePages.length} service pages; sitemap.xml: ${paths.length} URLs (${listings.length} properties, ${team.filter((t) => t.slug).length} team bios, ${news.filter((n) => n.slug).length} news articles); robots.txt`);
