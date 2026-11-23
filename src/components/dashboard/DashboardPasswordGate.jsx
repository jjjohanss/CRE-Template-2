import React, { useState } from "react";
import { Lock } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

// Real admin login (Supabase Auth). Replaces the old hard-coded access code,
// which was only a client-side check. Data is protected by database RLS policies,
// which require app_metadata.role = 'admin'.
export default function DashboardPasswordGate({ children }) {
  const { isAdmin, isAuthenticated, isLoadingAuth, signIn, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await signIn(email, password);
      setPassword("");
    } catch (err) {
      setError(err.message || "Sign in failed.");
    } finally {
      setBusy(false);
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (isAdmin) return children;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <Lock size={20} className="text-slate-500" />
        </div>
        <h1 className="text-slate-900 font-semibold text-lg">Restricted Area</h1>
        <p className="text-slate-400 text-sm mt-1">Sign in with your admin account.</p>

        <input
          autoFocus type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
          className="mt-6 w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
        />
        <input
          type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
          className="mt-3 w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
        />

        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        {isAuthenticated && !isAdmin && (
          <p className="text-red-500 text-xs mt-2">This account doesn't have admin access.</p>
        )}

        <button
          type="submit" disabled={busy}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
        {isAuthenticated && (
          <button type="button" onClick={logout} className="mt-3 text-xs text-slate-400 hover:text-slate-600">
            Sign out
          </button>
        )}
      </form>
    </div>
  );
}
