import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  LayoutDashboard, Building2, Users, BarChart3, Settings,
  ChevronLeft, ChevronRight, Home, Newspaper, FileSignature, Contact
} from "lucide-react";

const navItems = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "listings", label: "Listings", icon: Building2 },
  { id: "news", label: "News", icon: Newspaper },
  { id: "brokers", label: "Brokers", icon: Users },
  { id: "team", label: "Team Page", icon: Contact },
  { id: "clients", label: "Clients", icon: Users },
  { id: "nda", label: "NDA Requests", icon: FileSignature },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function DashboardSidebar({ activeView, setActiveView, collapsed, setCollapsed, badges = {} }) {
  return (
    <aside
      className={`relative flex flex-col h-screen bg-white border-r border-slate-200 transition-all duration-300 flex-shrink-0 ${
        collapsed ? "w-16" : "w-60"
      }`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 h-16 border-b border-slate-100 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Building2 className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-slate-900 font-semibold text-sm leading-tight">Faris Lee</p>
            <p className="text-slate-400 text-xs">Agent Dashboard</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveView(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              activeView === id
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            } ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? label : ""}
          >
            <span className="relative flex-shrink-0">
              <Icon className={`w-4.5 h-4.5 ${activeView === id ? "text-blue-600" : "text-slate-400"}`} size={18} />
              {collapsed && badges[id] > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
              )}
            </span>
            {!collapsed && <span>{label}</span>}
            {!collapsed && badges[id] > 0 ? (
              <span className="ml-auto min-w-[20px] px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[11px] font-bold text-center tabular-nums">
                {badges[id]}
              </span>
            ) : !collapsed && activeView === id && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
            )}
          </button>
        ))}
      </nav>

      {/* Back to Site */}
      <div className="px-2 pb-3 border-t border-slate-100 pt-3">
        <Link
          to={createPageUrl("Home")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "Back to Site" : ""}
        >
          <Home size={18} className="flex-shrink-0 text-slate-400" />
          {!collapsed && <span>Back to Site</span>}
        </Link>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow z-10"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-slate-500" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-slate-500" />
        )}
      </button>
    </aside>
  );
}