import React, { useState } from "react";
import { Plus, Pencil, Trash2, Search, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";

export default function DashboardNewsView({ stories, onAdd, onEdit, onDelete }) {
  const [search, setSearch] = useState("");

  const filtered = stories.filter((s) => {
    const q = search.toLowerCase();
    return !q || `${s.title} ${s.category || ""}`.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
            placeholder="Search stories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex-shrink-0"
        >
          <Plus size={16} />
          Add Story
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 w-16">Image</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-400 text-sm">
                    No news stories yet.{" "}
                    <button onClick={onAdd} className="text-blue-600 hover:underline font-medium">
                      Add your first story
                    </button>
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="px-4 py-3">
                      {s.image_url ? (
                        <img src={s.image_url} alt="" className="w-14 h-10 object-cover rounded-lg border border-slate-100" />
                      ) : (
                        <div className="w-14 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-300 text-xs">No img</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-900 text-sm font-medium line-clamp-1">{s.title}</p>
                      {s.excerpt && <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{s.excerpt}</p>}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-sm">{s.category || "—"}</td>
                    <td className="px-4 py-3 text-slate-500 text-sm">
                      {s.publish_date ? format(new Date(s.publish_date), "MMM d, yyyy") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {s.published !== false ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                          <Eye size={11} /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 ring-1 ring-slate-200">
                          <EyeOff size={11} /> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(s)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => onDelete(s.id)}
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
            <p className="text-slate-400 text-xs">{filtered.length} stor{filtered.length !== 1 ? "ies" : "y"} shown</p>
          </div>
        )}
      </div>
    </div>
  );
}