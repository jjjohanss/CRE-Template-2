import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminListingsQuery, brokersQuery } from "@/lib/queries";
import { api } from "@/api/client";
import { Download } from "lucide-react";
import { formatPST } from "@/lib/format";

export default function DashboardSubscribersView() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data: subscribers = [], isLoading: loadingSubs } = useQuery({
    queryKey: ["subscribers"],
    queryFn: () => api.entities.Subscriber.list("-created_date", 1000),
  });

  const { data: omDownloads = [], isLoading: loadingOm } = useQuery({
    queryKey: ["om-downloads-all"],
    queryFn: () => api.entities.OmDownload.list("-created_date", 1000),
  });

  const { data: listings = [] } = useQuery(adminListingsQuery);

  const { data: brokers = [] } = useQuery(brokersQuery);

  // Map broker slug -> initials (e.g. "Shaun Riley" -> "SR")
  const brokerInitialsBySlug = useMemo(() => {
    const map = {};
    for (const b of brokers) {
      if (!b.slug || !b.name) continue;
      const parts = b.name.trim().split(/\s+/);
      const initials = parts.map((p) => p[0] || "").join("").toUpperCase().slice(0, 2);
      map[b.slug] = initials;
    }
    return map;
  }, [brokers]);

  // Map listing id -> broker initials string (e.g. "SR, JC")
  const listingBrokersById = useMemo(() => {
    const map = {};
    for (const l of listings) {
      if (!l.id) continue;
      const initials = (l.brokers || [])
        .map((slug) => brokerInitialsBySlug[slug])
        .filter(Boolean)
        .join(", ");
      map[l.id] = initials;
    }
    return map;
  }, [listings, brokerInitialsBySlug]);

  // Join each OM download with its subscriber details (looked up by email)
  const rows = useMemo(() => {
    const byEmail = {};
    for (const s of subscribers) {
      byEmail[(s.email || "").toLowerCase()] = s;
    }
    return omDownloads
      .map((d) => {
        const sub = byEmail[(d.subscriber_email || "").toLowerCase()] || {};
        return {
          id: d.id,
          first_name: sub.first_name || "",
          last_name: sub.last_name || "",
          email: d.subscriber_email || sub.email || "",
          phone: sub.phone || "",
          company: sub.company || "",
          job_title: sub.job_title || "",
          property_title: d.listing_title || "",
          property_address: d.listing_address || "",
          downloaded_at: d.created_date,
          brokers: listingBrokersById[d.listing_id] || "",
        };
      })
      .sort((a, b) => new Date(b.downloaded_at || 0) - new Date(a.downloaded_at || 0));
  }, [subscribers, omDownloads, listingBrokersById]);

  const filtered = rows.filter((r) => {
    const ts = new Date(r.downloaded_at);
    if (dateFrom && ts < new Date(dateFrom)) return false;
    if (dateTo && ts > new Date(dateTo + "T23:59:59")) return false;
    return true;
  });

  const downloadCSV = () => {
    const headers = ["First Name", "Last Name", "Email", "Phone", "Company", "Job Title", "OM Downloaded", "Brokers", "Download Date"];
    const csvRows = filtered.map((r) =>
      [
        r.first_name,
        r.last_name,
        r.email,
        r.phone,
        r.company,
        r.job_title,
        r.property_title || r.property_address,
        r.brokers,
        formatPST(r.downloaded_at, ""),
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `om-download-activity-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputCls = "px-3 py-2 text-sm border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white";
  const isLoading = loadingSubs || loadingOm;

  return (
    <div className="space-y-5" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-[#0F172A]" style={{ letterSpacing: "-0.02em" }}>
            OM Download Activity
          </h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-semibold tabular-nums">
            {filtered.length} event{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
        <button
          onClick={downloadCSV}
          disabled={filtered.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-[#1d4ed8] disabled:opacity-40 text-white text-sm font-semibold rounded-md transition-colors"
        >
          <Download size={15} />
          Export CSV
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-md border border-[#E2E8F0] px-5 py-4 flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wide mb-1.5">From</label>
          <input type="date" className={inputCls} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wide mb-1.5">To</label>
          <input type="date" className={inputCls} value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
        {(dateFrom || dateTo) && (
          <button
            onClick={() => { setDateFrom(""); setDateTo(""); }}
            className="text-sm text-[#2563EB] hover:underline font-medium ml-auto"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-md border border-[#E2E8F0] overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-7 h-7 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-[#475569] text-sm">No OM download events found for the selected date range.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F1F5F9]">
                  {["Name", "Email", "Phone", "Company", "Job Title", "OM Downloaded", "Brokers", "Date"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#475569] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-4 py-3 font-medium text-[#0F172A] whitespace-nowrap">
                      {r.first_name || r.last_name ? `${r.first_name} ${r.last_name}`.trim() : "—"}
                    </td>
                    <td className="px-4 py-3 text-[#475569]">{r.email || "—"}</td>
                    <td className="px-4 py-3 text-[#475569] whitespace-nowrap tabular-nums">{r.phone || "—"}</td>
                    <td className="px-4 py-3 text-[#475569]">{r.company || "—"}</td>
                    <td className="px-4 py-3 text-[#475569]">{r.job_title || "—"}</td>
                    <td className="px-4 py-3 text-[#0F172A] font-medium">
                      {r.property_title || r.property_address || "—"}
                    </td>
                    <td className="px-4 py-3 text-[#475569] whitespace-nowrap font-medium">
                      {r.brokers || "—"}
                    </td>
                    <td className="px-4 py-3 text-[#475569] whitespace-nowrap tabular-nums">
                      {formatPST(r.downloaded_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}