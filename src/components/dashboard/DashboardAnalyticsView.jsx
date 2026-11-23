import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid,
} from "recharts";
import { Download, ArrowUpRight, ArrowDownRight, Info } from "lucide-react";
import { supabase } from "@/api/supabaseClient";
import { slugify } from "@/lib/slug";

const COLORS = { active: "#2563eb", pending: "#d97706", sold: "#059669" };
const TZ = "America/Los_Angeles";

const fmtInt = (n) => Number(n || 0).toLocaleString("en-US");
const monthLabel = (iso, opts = { month: "long", year: "numeric" }) =>
  new Date(`${iso.slice(0, 10)}T12:00:00Z`).toLocaleDateString("en-US", { ...opts, timeZone: "UTC" });

// "YYYY-MM-01" for this month and the 23 before it, in Pacific time.
function monthOptions() {
  const now = new Date();
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: TZ, year: "numeric", month: "numeric" })
      .formatToParts(now).map((p) => [p.type, p.value])
  );
  let y = Number(parts.year), m = Number(parts.month);
  const out = [];
  for (let i = 0; i < 24; i++) {
    out.push(`${y}-${String(m).padStart(2, "0")}-01`);
    m -= 1;
    if (m === 0) { m = 12; y -= 1; }
  }
  return out;
}

async function rpc(name, args) {
  const { data, error } = await supabase.rpc(name, args);
  if (error) throw new Error(error.message);
  return data;
}

function Change({ current, previous }) {
  if (!previous) return <span className="text-xs text-slate-400">{current ? "new this month" : "—"}</span>;
  const pct = Math.round(((current - previous) / previous) * 100);
  if (pct === 0) return <span className="text-xs text-slate-400">same as last month</span>;
  const up = pct > 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={`inline-flex items-center text-xs font-semibold ${up ? "text-emerald-600" : "text-rose-600"}`}>
      <Icon size={13} className="mr-0.5" />
      {Math.abs(pct)}% vs last month
    </span>
  );
}

const card = "bg-white rounded-xl border border-slate-100 shadow-sm";
const th = "px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap";

function WebsiteActivity() {
  const months = useMemo(monthOptions, []);
  const [month, setMonth] = useState(months[0]);

  const report = useQuery({
    queryKey: ["analytics-month", month],
    queryFn: () => rpc("analytics_month", { p_month: month }),
  });
  const trend = useQuery({
    queryKey: ["analytics-trend"],
    queryFn: () => rpc("analytics_trend", { p_months: 12 }),
  });

  const r = report.data;
  const t = r?.totals ?? {};
  const prev = r?.previous ?? {};
  const trendData = (trend.data ?? []).map((row) => ({
    ...row,
    label: monthLabel(row.month, { month: "short", year: "2-digit" }),
  }));
  const trackingSince = r?.tracking_since ? new Date(r.tracking_since) : null;
  const partial = !trackingSince || trackingSince > new Date(`${month}T00:00:00`);

  const exportCsv = () => {
    const rows = [
      ["Faris Lee website activity", monthLabel(month)],
      [],
      ["Metric", "This month", "Previous month"],
      ["Sessions", t.sessions, prev.sessions],
      ["Page views", t.page_views, prev.page_views],
      ["New sign-ups", t.signups, prev.signups],
      ["OM downloads", t.om_downloads, prev.om_downloads],
      ["NDA requests", t.nda_requests, prev.nda_requests],
      [],
      ["Property", "Address", "Status", "Views", "Visitors (sessions)", "OM downloads", "NDA requests"],
      ...(r?.listings ?? []).map((l) => [l.title || "", l.address || "", l.status || "removed", l.views, l.sessions, l.om_downloads, l.nda_requests]),
    ];
    const csv = rows.map((row) => row.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `website-activity-${month.slice(0, 7)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const kpis = [
    { key: "sessions", label: "Sessions", hint: "Visits to the website. A visit ends when the visitor closes the tab." },
    { key: "page_views", label: "Page Views", hint: "Pages opened across all visits." },
    { key: "signups", label: "New Sign-ups", hint: "New subscribers from the sign-up and OM forms." },
    { key: "om_downloads", label: "OM Downloads", hint: "Offering Memorandums downloaded." },
    { key: "nda_requests", label: "NDA Requests", hint: "NDAs signed on NDA-protected listings." },
  ];

  return (
    <section className="space-y-5" aria-labelledby="activity-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="activity-heading" className="text-slate-900 text-lg font-semibold">Website Activity</h2>
          <p className="text-slate-400 text-xs mt-0.5">Monthly visits, sign-ups and downloads (Pacific time)</p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="month" className="sr-only">Month</label>
          <select
            id="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {months.map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}
          </select>
          <button
            onClick={exportCsv}
            disabled={!r}
            className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-[#1d4ed8] disabled:opacity-40 text-white text-sm font-semibold rounded-lg"
          >
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {report.isError && (
        <div className={`${card} p-5 text-sm text-red-600`}>
          Couldn't load analytics: {report.error.message}. If this is a new setup, run <code>004_analytics.sql</code> in the Supabase SQL Editor.
        </div>
      )}

      {r && partial && (
        <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
          <Info size={14} className="flex-shrink-0 mt-0.5 text-slate-400" />
          <span>
            {trackingSince
              ? `Visit tracking started ${trackingSince.toLocaleDateString("en-US", { timeZone: TZ, month: "long", day: "numeric", year: "numeric" })}. Sessions and page views before then aren't available; sign-ups and downloads are.`
              : "Visit tracking hasn't recorded any visits yet. Sessions and page views will appear here as people visit the site; sign-ups and downloads are already shown."}
          </span>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((k) => (
          <div key={k.key} className={`${card} p-5`} title={k.hint}>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">{k.label}</p>
            <p className="text-slate-900 text-2xl font-bold mt-2 tabular-nums">
              {report.isLoading ? <span className="inline-block w-12 h-6 bg-slate-100 rounded animate-pulse" /> : fmtInt(t[k.key])}
            </p>
            <div className="mt-1 h-4">{r && <Change current={t[k.key]} previous={prev[k.key]} />}</div>
          </div>
        ))}
      </div>

      {/* 12-month trend */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className={`${card} p-5`}>
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="text-slate-800 font-semibold text-sm">Traffic, last 12 months</h3>
            <span className="text-[11px] text-slate-400">{months[0] && monthLabel(months[0], { month: "short" })} is month-to-date</span>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={trendData} margin={{ left: -10, right: 8 }}>
              <CartesianGrid stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="page_views" name="Page views" stroke="#93c5fd" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="sessions" name="Sessions" stroke="#2563eb" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className={`${card} p-5`}>
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="text-slate-800 font-semibold text-sm">Sign-ups and OM downloads, last 12 months</h3>
            <span className="text-[11px] text-slate-400">{months[0] && monthLabel(months[0], { month: "short" })} is month-to-date</span>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={trendData} margin={{ left: -10, right: 8 }} barGap={2}>
              <CartesianGrid stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} cursor={{ fill: "#f8fafc" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="signups" name="New sign-ups" fill="#C8102E" radius={[4, 4, 0, 0]} />
              <Bar dataKey="om_downloads" name="OM downloads" fill="#0f172a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Views per property */}
      <div className={`${card} overflow-hidden`}>
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-slate-800 font-semibold text-sm">Views per Property: {monthLabel(month)}</h3>
          <p className="text-slate-400 text-xs mt-0.5">Visitors counts each session once, however many times it opened the page.</p>
        </div>
        {report.isLoading ? (
          <div className="flex justify-center py-12"><div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
        ) : !r?.listings?.length ? (
          <p className="text-center text-slate-400 text-sm py-12">No property views or downloads this month.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className={th}>#</th>
                  <th className={th}>Property</th>
                  <th className={`${th} text-right`}>Views</th>
                  <th className={`${th} text-right`}>Visitors</th>
                  <th className={`${th} text-right`}>OM Downloads</th>
                  <th className={`${th} text-right`}>NDA Requests</th>
                  <th className={`${th} text-right`}>Download Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {r.listings.map((l, i) => {
                  const href = l.status ? `/listings/${slugify(l.address) || "property"}--${l.listing_id}` : null;
                  return (
                    <tr key={l.listing_id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-400 tabular-nums">{i + 1}</td>
                      <td className="px-4 py-3">
                        {href ? (
                          <a href={href} target="_blank" rel="noreferrer" className="font-medium text-slate-900 hover:text-blue-600">{l.title || l.address}</a>
                        ) : (
                          <span className="font-medium text-slate-900">{l.title || l.address || "Removed listing"}</span>
                        )}
                        <p className="text-xs text-slate-400">
                          {l.address}{l.status && l.status !== "active" ? ` · ${l.status}` : ""}{!l.status ? " · no longer listed" : ""}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900 tabular-nums">{fmtInt(l.views)}</td>
                      <td className="px-4 py-3 text-right text-slate-600 tabular-nums">{fmtInt(l.sessions)}</td>
                      <td className="px-4 py-3 text-right text-slate-600 tabular-nums">{fmtInt(l.om_downloads)}</td>
                      <td className="px-4 py-3 text-right text-slate-600 tabular-nums">{fmtInt(l.nda_requests)}</td>
                      <td className="px-4 py-3 text-right text-slate-600 tabular-nums">
                        {l.sessions ? `${Math.round((l.om_downloads / l.sessions) * 100)}%` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pages + sources */}
      {r && (
        <div className="grid lg:grid-cols-2 gap-5">
          <div className={`${card} p-5`}>
            <h3 className="text-slate-800 font-semibold text-sm mb-3">Most visited pages</h3>
            {r.top_pages.length === 0 ? <p className="text-slate-400 text-sm">No visits recorded this month.</p> : (
              <ul className="divide-y divide-slate-100 text-sm">
                {r.top_pages.map((p) => (
                  <li key={p.path} className="flex justify-between py-2">
                    <span className="text-slate-600 truncate mr-4">{p.path === "/" ? "/ (homepage)" : p.path}</span>
                    <span className="font-semibold text-slate-900 tabular-nums">{fmtInt(p.views)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={`${card} p-5`}>
            <h3 className="text-slate-800 font-semibold text-sm mb-3">Where visitors came from</h3>
            {r.referrers.length === 0 ? <p className="text-slate-400 text-sm">No visits recorded this month.</p> : (
              <ul className="divide-y divide-slate-100 text-sm">
                {r.referrers.map((s) => (
                  <li key={s.source} className="flex justify-between py-2">
                    <span className="text-slate-600 truncate mr-4">{s.source}</span>
                    <span className="font-semibold text-slate-900 tabular-nums">{fmtInt(s.sessions)} <span className="font-normal text-slate-400">sessions</span></span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function PortfolioSummary({ listings }) {
  const statusData = [
    { name: "Active",  value: listings.filter((l) => l.status === "active").length,  fill: COLORS.active },
    { name: "Pending", value: listings.filter((l) => l.status === "pending").length, fill: COLORS.pending },
    { name: "Sold",    value: listings.filter((l) => l.status === "sold").length,    fill: COLORS.sold },
  ];

  const priceRanges = [
    { range: "<$500k",    count: listings.filter((l) => l.price < 500000).length },
    { range: "$500k–$1M", count: listings.filter((l) => l.price >= 500000 && l.price < 1000000).length },
    { range: "$1M–$2M",   count: listings.filter((l) => l.price >= 1000000 && l.price < 2000000).length },
    { range: "$2M+",      count: listings.filter((l) => l.price >= 2000000).length },
  ];

  const totalRevenue = listings
    .filter((l) => l.status === "sold")
    .reduce((s, l) => s + (l.price ?? 0) * ((l.commission_rate ?? 2.5) / 100), 0);

  const avgPrice = listings.length
    ? listings.reduce((s, l) => s + (l.price ?? 0), 0) / listings.length
    : 0;

  return (
    <section className="space-y-5" aria-labelledby="portfolio-heading">
      <h2 id="portfolio-heading" className="text-slate-900 text-lg font-semibold">Portfolio</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Portfolio Value", value: `$${(listings.reduce((s, l) => s + (l.price ?? 0), 0) / 1e6).toFixed(1)}M` },
          { label: "Avg. Listing Price", value: avgPrice >= 1e6 ? `$${(avgPrice / 1e6).toFixed(1)}M` : `$${(avgPrice / 1000).toFixed(0)}k` },
          { label: "Estimated Revenue", value: `$${(totalRevenue / 1000).toFixed(1)}k` },
        ].map((s, i) => (
          <div key={i} className={`${card} p-5`}>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">{s.label}</p>
            <p className="text-slate-900 text-2xl font-bold mt-2">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className={`${card} p-5`}>
          <h3 className="text-slate-800 font-semibold text-sm mb-4">Status Distribution</h3>
          {listings.length === 0 ? (
            <div className="flex items-center justify-center h-44 text-slate-300 text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className={`${card} p-5`}>
          <h3 className="text-slate-800 font-semibold text-sm mb-4">Listings by Price Range</h3>
          {listings.length === 0 ? (
            <div className="flex items-center justify-center h-44 text-slate-300 text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={priceRanges} barSize={36}>
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                  cursor={{ fill: "#f1f5f9" }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </section>
  );
}

export default function DashboardAnalyticsView({ listings }) {
  return (
    <div className="space-y-10">
      <WebsiteActivity />
      <PortfolioSummary listings={listings} />
    </div>
  );
}
