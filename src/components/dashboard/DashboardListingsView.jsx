import React, { useState } from "react";
import { Plus, ArrowUpDown, ArrowUp, ArrowDown, Eye, Pencil, Trash2, Search, Filter } from "lucide-react";
import ListingsPrintButton, { generateListingsPrintReport } from "./ListingsPrintReport";

const statusConfig = {
  active:  { label: "Active",  cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
  pending: { label: "Pending", cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
  sold:    { label: "Sold",    cls: "bg-blue-50 text-blue-700 ring-1 ring-blue-200" },
};

const fmt = (n) => n ? `$${Number(n).toLocaleString()}` : "—";

export default function DashboardListingsView({ listings, onAdd, onEdit, onDelete }) {
  const [sortField, setSortField] = useState("created_date");
  const [sortDir, setSortDir] = useState("desc");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  const filtered = listings
    .filter((l) => {
      const q = search.toLowerCase();
      const matchSearch = !q || `${l.address} ${l.city} ${l.state}`.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || l.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      let va = a[sortField], vb = b[sortField];
      if (typeof va === "string") va = va?.toLowerCase();
      if (typeof vb === "string") vb = vb?.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ArrowUpDown size={13} className="text-slate-300" />;
    return sortDir === "asc" ? <ArrowUp size={13} className="text-blue-500" /> : <ArrowDown size={13} className="text-blue-500" />;
  };

  const thCls = "px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 cursor-pointer select-none hover:bg-slate-100 transition-colors";

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
              placeholder="Search properties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1">
            {["all", "active", "pending", "sold"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize ${
                  statusFilter === s ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <ListingsPrintButton listings={listings} />
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={16} />
            Add Listing
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className={`${thCls} w-16`}>Photo</th>
                <th className={thCls} onClick={() => handleSort("address")}>
                  <div className="flex items-center gap-1.5">Address <SortIcon field="address" /></div>
                </th>
                <th className={thCls} onClick={() => handleSort("status")}>
                  <div className="flex items-center gap-1.5">Status <SortIcon field="status" /></div>
                </th>
                <th className={thCls} onClick={() => handleSort("price")}>
                  <div className="flex items-center gap-1.5">Price <SortIcon field="price" /></div>
                </th>
                <th className={thCls} onClick={() => handleSort("cap_rate")}>
                  <div className="flex items-center gap-1.5">Cap Rate <SortIcon field="cap_rate" /></div>
                </th>
                <th className={thCls} onClick={() => handleSort("sqft")}>
                  <div className="flex items-center gap-1.5">Sq Ft <SortIcon field="sqft" /></div>
                </th>
                <th className={`${thCls} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-400 text-sm">
                    No listings found. Add your first listing to get started.
                  </td>
                </tr>
              ) : (
                filtered.map((l) => {
                  const sc = statusConfig[l.status] ?? statusConfig.active;
                  return (
                    <tr key={l.id} className="hover:bg-slate-50/70 transition-colors duration-100 group">
                      <td className="px-4 py-3">
                        {l.image_url ? (
                          <img src={l.image_url} alt="" className="w-12 h-10 object-cover rounded-lg border border-slate-100" />
                        ) : (
                          <div className="w-12 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                            <span className="text-slate-300 text-xs">No img</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-slate-900 text-sm font-medium">
                          {l.address || "—"}
                          {l.nda_required && (
                            <span className="ml-2 align-middle text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-slate-800 text-white">NDA</span>
                          )}
                        </p>
                        <p className="text-slate-400 text-xs mt-0.5">{[l.city, l.state, l.zip].filter(Boolean).join(", ")}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${sc.cls}`}>
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-900 text-sm font-semibold">{fmt(l.price)}</td>
                      <td className="px-4 py-3 text-slate-600 text-sm">
                        {l.cap_rate ? `${l.cap_rate}%` : "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-sm">
                        {l.sqft ? Number(l.sqft).toLocaleString() : "—"} sf
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEdit(l)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => onDelete(l.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50">
            <p className="text-slate-400 text-xs">{filtered.length} listing{filtered.length !== 1 ? "s" : ""} shown</p>
          </div>
        )}
      </div>
    </div>
  );
}