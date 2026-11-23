import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminListingsQuery } from "@/lib/queries";
import { api } from "@/api/client";
import { useAuth } from "@/lib/AuthContext";
import { Check, X, FileText, Link2, Download, RotateCcw } from "lucide-react";
import { listingPath } from "@/lib/slug";
import { formatPST } from "@/lib/format";

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-emerald-50 text-emerald-700",
  denied: "bg-slate-100 text-slate-600",
};

const TABS = [
  { id: "pending", label: "Awaiting approval" },
  { id: "approved", label: "Approved" },
  { id: "denied", label: "Not approved" },
  { id: "all", label: "All" },
];

export default function DashboardNdaRequestsView() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [tab, setTab] = useState("pending");
  const [viewing, setViewing] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["nda-requests"],
    queryFn: () => api.entities.NdaRequest.list("-created_date", 1000),
  });

  const { data: listings = [] } = useQuery(adminListingsQuery);
  const listingById = useMemo(() => Object.fromEntries(listings.map((l) => [l.id, l])), [listings]);

  const decide = useMutation({
    mutationFn: ({ id, status }) =>
      api.entities.NdaRequest.update(id, {
        status,
        decided_at: status === "pending" ? null : new Date().toISOString(),
        decided_by: status === "pending" ? null : user?.email ?? null,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["nda-requests"] }),
    onError: (err) => window.alert("Couldn't update: " + (err?.message || err)),
  });

  const counts = useMemo(() => {
    const c = { pending: 0, approved: 0, denied: 0, all: requests.length };
    for (const r of requests) c[r.status] = (c[r.status] || 0) + 1;
    return c;
  }, [requests]);

  const rows = tab === "all" ? requests : requests.filter((r) => r.status === tab);

  // Personal access link for the lead: opens the listing and unlocks the OM once approved.
  const accessLink = (r) => {
    const l = listingById[r.listing_id] || {};
    return `${window.location.origin}${listingPath({ ...l, id: r.listing_id })}?nda=${r.access_token}`;
  };

  const copyLink = async (r) => {
    try {
      await navigator.clipboard.writeText(accessLink(r));
      setCopiedId(r.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      window.prompt("Copy this link:", accessLink(r));
    }
  };

  const downloadCSV = () => {
    const headers = ["Status", "First Name", "Last Name", "Email", "Phone", "Company", "Job Title", "Property", "Signed Name", "Signed At (PT)", "Decided By", "Decided At (PT)"];
    const lines = rows.map((r) =>
      [r.status, r.first_name, r.last_name, r.email, r.phone, r.company, r.job_title,
       r.listing_title || r.listing_address, r.signed_name, formatPST(r.agreed_at), r.decided_by, r.decided_at ? formatPST(r.decided_at) : ""]
        .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","));
    const blob = new Blob([[headers.join(","), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `nda-requests-${tab}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const actionBtn = "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors disabled:opacity-50";

  return (
    <div className="space-y-5" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1 bg-white border border-[#E2E8F0] rounded-md p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                tab === t.id ? "bg-[#EFF6FF] text-[#2563EB]" : "text-[#475569] hover:bg-[#F8FAFC]"
              }`}
            >
              {t.label}
              <span className="ml-1.5 tabular-nums text-xs opacity-70">{counts[t.id] || 0}</span>
            </button>
          ))}
        </div>
        <button
          onClick={downloadCSV}
          disabled={rows.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-[#1d4ed8] disabled:opacity-40 text-white text-sm font-semibold rounded-md transition-colors"
        >
          <Download size={15} />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-md border border-[#E2E8F0] overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-7 h-7 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center py-16 text-[#475569] text-sm">
            {tab === "pending" ? "No NDA requests are waiting for approval." : "No NDA requests here yet."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F1F5F9]">
                  {["Lead", "Contact", "Company", "Property", "Signed", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#475569] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F8FAFC] transition-colors align-top">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#0F172A] whitespace-nowrap">{r.first_name} {r.last_name}</p>
                      {r.job_title && <p className="text-xs text-[#64748B]">{r.job_title}</p>}
                    </td>
                    <td className="px-4 py-3 text-[#475569]">
                      <a href={`mailto:${r.email}`} className="hover:underline">{r.email}</a>
                      {r.phone && <p className="text-xs tabular-nums whitespace-nowrap">{r.phone}</p>}
                    </td>
                    <td className="px-4 py-3 text-[#475569]">{r.company || "—"}</td>
                    <td className="px-4 py-3 text-[#0F172A] font-medium">
                      {r.listing_title || r.listing_address || "—"}
                      {r.listing_title && r.listing_address && <p className="text-xs text-[#64748B] font-normal">{r.listing_address}</p>}
                    </td>
                    <td className="px-4 py-3 text-[#475569] whitespace-nowrap">
                      <p className="italic" style={{ fontFamily: "'Playfair Display', serif" }}>{r.signed_name}</p>
                      <p className="text-xs tabular-nums">{formatPST(r.agreed_at)}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[r.status]}`}>
                        {r.status === "pending" ? "Pending" : r.status === "approved" ? "Approved" : "Not approved"}
                      </span>
                      {r.decided_by && (
                        <p className="text-[11px] text-[#64748B] mt-1">by {r.decided_by}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {r.status !== "approved" && (
                          <button
                            onClick={() => decide.mutate({ id: r.id, status: "approved" })}
                            disabled={decide.isPending}
                            className={`${actionBtn} bg-emerald-600 hover:bg-emerald-700 text-white`}
                          >
                            <Check size={13} /> Approve
                          </button>
                        )}
                        {r.status !== "denied" && (
                          <button
                            onClick={() => decide.mutate({ id: r.id, status: "denied" })}
                            disabled={decide.isPending}
                            className={`${actionBtn} border border-[#E2E8F0] text-[#475569] hover:bg-slate-50`}
                          >
                            <X size={13} /> {r.status === "approved" ? "Revoke" : "Don't approve"}
                          </button>
                        )}
                        {r.status !== "pending" && (
                          <button
                            onClick={() => decide.mutate({ id: r.id, status: "pending" })}
                            disabled={decide.isPending}
                            title="Move back to Awaiting approval"
                            className={`${actionBtn} text-[#64748B] hover:bg-slate-50`}
                          >
                            <RotateCcw size={13} />
                          </button>
                        )}
                        <button onClick={() => setViewing(r)} className={`${actionBtn} text-[#2563EB] hover:bg-[#EFF6FF]`}>
                          <FileText size={13} /> NDA
                        </button>
                        {r.status === "approved" && (
                          <button onClick={() => copyLink(r)} className={`${actionBtn} text-[#2563EB] hover:bg-[#EFF6FF]`} title="Copy the lead's personal download link to email them">
                            <Link2 size={13} /> {copiedId === r.id ? "Copied!" : "Copy link"}
                          </button>
                        )}
                      </div>
                      {r.status === "approved" && !listingById[r.listing_id]?.nda_om_path && (
                        <p className="text-[11px] text-amber-700 mt-1.5">No OM uploaded for this listing yet.</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setViewing(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
              <h2 className="text-slate-800 font-semibold text-base">Signed NDA: {viewing.first_name} {viewing.last_name}</h2>
              <button onClick={() => setViewing(null)} className="p-1.5 rounded-lg hover:bg-slate-100"><X size={18} className="text-slate-500" /></button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <dl className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-1.5 text-slate-600">
                <dt className="text-slate-400">Property</dt><dd>{viewing.listing_title || viewing.listing_address}</dd>
                <dt className="text-slate-400">Signed as</dt><dd className="italic">{viewing.signed_name}</dd>
                <dt className="text-slate-400">Signed at</dt><dd>{formatPST(viewing.agreed_at)} PT</dd>
                <dt className="text-slate-400">Email</dt><dd>{viewing.email}</dd>
                {viewing.ip_address && (<><dt className="text-slate-400">IP address</dt><dd className="tabular-nums">{viewing.ip_address}</dd></>)}
                {viewing.user_agent && (<><dt className="text-slate-400">Browser</dt><dd className="text-xs break-all">{viewing.user_agent}</dd></>)}
              </dl>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Agreement text they accepted</p>
                <div className="whitespace-pre-wrap text-xs leading-relaxed bg-slate-50 border border-slate-200 rounded-lg p-4 max-h-80 overflow-y-auto">
                  {viewing.nda_text}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
