import React, { useState } from "react";
import { Plus, Pencil, Trash2, Search, Mail, Phone, BadgeCheck } from "lucide-react";

export default function DashboardBrokersView({ brokers, onAdd, onEdit, onDelete }) {
  const [search, setSearch] = useState("");

  const filtered = brokers.filter((b) => {
    const q = search.toLowerCase();
    return !q || `${b.name} ${b.title} ${b.license} ${b.email}`.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
            placeholder="Search brokers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex-shrink-0"
        >
          <Plus size={16} />
          Add Broker
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">Photo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">License</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">Contact</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-400 text-sm">
                    No brokers found. Add your first broker to get started.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors duration-100 group">
                    <td className="px-4 py-3">
                      {b.thumbImage || b.image ? (
                        <img src={b.thumbImage || b.image} alt="" className="w-10 h-10 object-cover rounded-full border border-slate-100" />
                      ) : (
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                          <span className="text-slate-300 text-xs">No img</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-900 text-sm font-medium">{b.name || "—"}</p>
                      <p className="text-slate-400 text-xs mt-0.5">/{b.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-sm">{b.title || "—"}</td>
                    <td className="px-4 py-3">
                      {b.license ? (
                        <span className="inline-flex items-center gap-1 text-slate-600 text-xs">
                          <BadgeCheck size={13} className="text-blue-500" />
                          {b.license}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        {b.email && (
                          <p className="flex items-center gap-1.5 text-slate-500 text-xs">
                            <Mail size={11} /> {b.email}
                          </p>
                        )}
                        {b.phone && (
                          <p className="flex items-center gap-1.5 text-slate-500 text-xs">
                            <Phone size={11} /> {b.phone}
                          </p>
                        )}
                        {!b.email && !b.phone && <span className="text-slate-300 text-xs">—</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(b)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => onDelete(b.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50">
            <p className="text-slate-400 text-xs">{filtered.length} broker{filtered.length !== 1 ? "s" : ""} shown</p>
          </div>
        )}
      </div>
    </div>
  );
}