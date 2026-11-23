import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/client";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, ExternalLink, User } from "lucide-react";
import DashboardTeamModal from "./DashboardTeamModal";

export default function DashboardTeamView() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);

  const { data: members = [], isLoading, isError, error } = useQuery({
    queryKey: ["team-members"],
    queryFn: () => api.entities.TeamMember.list("sort_order", 500),
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["team-members"] });

  const handleSave = async (data) => {
    if (editing) {
      await api.entities.TeamMember.update(editing.id, data);
    } else {
      const last = members.reduce((m, t) => Math.max(m, t.sort_order || 0), 0);
      await api.entities.TeamMember.create({ ...data, sort_order: last + 10 });
    }
    await refresh();
    setModalOpen(false);
    setEditing(null);
  };

  const handleDelete = async (member) => {
    if (!window.confirm(`Remove ${member.name} from the team?\n\nTheir card disappears from the Team page and their bio page (/team/${member.slug}) is deleted. This can't be undone.`)) return;
    setBusy(true);
    try {
      await api.entities.TeamMember.delete(member.id);
      await refresh();
    } catch (err) {
      window.alert("Delete failed: " + (err?.message || err));
    } finally {
      setBusy(false);
    }
  };

  // Swap with the neighbour, renumbering 10, 20, 30… so positions are always distinct.
  const move = async (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= members.length) return;
    const order = members.map((m) => m.id);
    [order[index], order[target]] = [order[target], order[index]];
    setBusy(true);
    try {
      const updates = order
        .map((id, i) => ({ id, sort_order: (i + 1) * 10 }))
        .filter(({ id, sort_order }) => members.find((m) => m.id === id).sort_order !== sort_order);
      for (const u of updates) await api.entities.TeamMember.update(u.id, { sort_order: u.sort_order });
      await refresh();
    } catch (err) {
      window.alert("Couldn't reorder: " + (err?.message || err));
    } finally {
      setBusy(false);
    }
  };

  const iconBtn = "p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors";

  return (
    <div className="space-y-5" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-[#0F172A]" style={{ letterSpacing: "-0.02em" }}>Team Page</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-semibold tabular-nums">
            {members.length} member{members.length === 1 ? "" : "s"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a href="/Team" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50">
            <ExternalLink size={14} /> View Team page
          </a>
          <button
            onClick={() => { setEditing(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-md transition-colors"
          >
            <Plus size={15} /> Add Team Member
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-500">
        Members appear on the Team page in this order, and each gets a bio page. Use the arrows to reorder.
      </p>

      <div className="bg-white rounded-md border border-[#E2E8F0] overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-7 h-7 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isError ? (
          <div className="p-8 text-sm text-red-600">
            Couldn't load the team ({error?.message}). If this is a new setup, run <code>003_team.sql</code> in the Supabase SQL Editor.
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-16 text-[#475569] text-sm">No team members yet. Click Add Team Member.</div>
        ) : (
          <ul className="divide-y divide-[#E2E8F0]">
            {members.map((m, i) => (
              <li key={m.id} className="flex items-center gap-4 px-4 py-3 hover:bg-[#F8FAFC]">
                <div className="flex flex-col">
                  <button className={iconBtn} disabled={busy || i === 0} onClick={() => move(i, -1)} aria-label={`Move ${m.name} up`}><ArrowUp size={14} /></button>
                  <button className={iconBtn} disabled={busy || i === members.length - 1} onClick={() => move(i, 1)} aria-label={`Move ${m.name} down`}><ArrowDown size={14} /></button>
                </div>
                <span className="w-6 text-xs text-slate-400 tabular-nums text-right">{i + 1}</span>
                {m.photo ? (
                  <img src={m.photo} alt="" className="w-11 h-12 object-cover object-top rounded-md border border-slate-100" />
                ) : (
                  <div className="w-11 h-12 rounded-md bg-slate-100 flex items-center justify-center"><User size={16} className="text-slate-300" /></div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0F172A] truncate">{m.name}</p>
                  <p className="text-xs text-slate-500 truncate">{m.title || "—"}</p>
                </div>
                <div className="hidden md:block w-56 min-w-0 text-xs text-slate-500">
                  <p className="truncate">{m.email || "—"}</p>
                  <p className="tabular-nums">{m.phone || ""}</p>
                </div>
                <a href={`/team/${m.slug}`} target="_blank" rel="noreferrer" className="hidden lg:block text-xs text-[#2563EB] hover:underline w-40 truncate">
                  /team/{m.slug}
                </a>
                <div className="flex items-center gap-1">
                  <button className={iconBtn} onClick={() => { setEditing(m); setModalOpen(true); }} aria-label={`Edit ${m.name}`}><Pencil size={15} /></button>
                  <button className={`${iconBtn} hover:text-red-600 hover:bg-red-50`} disabled={busy} onClick={() => handleDelete(m)} aria-label={`Delete ${m.name}`}><Trash2 size={15} /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <DashboardTeamModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        member={editing}
        existingSlugs={members.map((m) => m.slug)}
        onSave={handleSave}
      />
    </div>
  );
}
