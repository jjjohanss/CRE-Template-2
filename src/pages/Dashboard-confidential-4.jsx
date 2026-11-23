import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminListingsQuery, brokersQuery, listingKeys } from "@/lib/queries";
import { api } from "@/api/client";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardMetrics from "../components/dashboard/DashboardMetrics";
import DashboardListingsView from "../components/dashboard/DashboardListingsView";
import DashboardListingModal from "../components/dashboard/DashboardListingModal.jsx";
import DashboardAnalyticsView from "../components/dashboard/DashboardAnalyticsView";
import DashboardSubscribersView from "../components/dashboard/DashboardSubscribersView";
import DashboardNewsView from "../components/dashboard/DashboardNewsView";
import DashboardNewsModal from "../components/dashboard/DashboardNewsModal";
import DashboardBrokersView from "../components/dashboard/DashboardBrokersView";
import DashboardBrokerModal from "../components/dashboard/DashboardBrokerModal";
import DashboardNdaRequestsView from "../components/dashboard/DashboardNdaRequestsView";
import DashboardTeamView from "../components/dashboard/DashboardTeamView";
import { Bell, Search, ChevronDown, Building2, Users, Settings, FileSignature } from "lucide-react";
import DashboardPasswordGate from "../components/dashboard/DashboardPasswordGate";

function DashboardContent() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeView, setActiveView] = useState("overview");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [brokerModalOpen, setBrokerModalOpen] = useState(false);
  const [editingBroker, setEditingBroker] = useState(null);

  const qc = useQueryClient();

  // NDA requests: polled so new signings show up without reloading.
  const { data: ndaRequests = [] } = useQuery({
    queryKey: ["nda-requests"],
    queryFn: () => api.entities.NdaRequest.list("-created_date", 1000),
    refetchInterval: 60000,
  });
  const pendingNda = ndaRequests.filter((r) => r.status === "pending").length;

  const { data: listings = [], isLoading } = useQuery(adminListingsQuery);

  const createMutation = useMutation({
    mutationFn: (data) => api.entities.Listing.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: listingKeys.all }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.entities.Listing.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: listingKeys.all }),
  });

  const deleteMutation = useMutation({
    onError: (err) => window.alert("Delete failed: " + (err?.message || err)),
    mutationFn: (id) => api.entities.Listing.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: listingKeys.all }),
  });

  const handleSave = async (data) => {
    try {
      if (editingListing) {
        await updateMutation.mutateAsync({ id: editingListing.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (err) {
      window.alert("Could not save listing: " + (err?.message || err));
      return;
    }
    setModalOpen(false);
    setEditingListing(null);
  };

  const handleEdit = (listing) => {
    setEditingListing(listing);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingListing(null);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Remove this listing?")) deleteMutation.mutate(id);
  };

  const { data: newsStories = [] } = useQuery({
    queryKey: ["news-stories"],
    queryFn: () => api.entities.NewsStory.list("-publish_date", 200),
  });

  const createNewsMutation = useMutation({
    mutationFn: (data) => api.entities.NewsStory.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["news-stories"] }),
  });

  const updateNewsMutation = useMutation({
    mutationFn: ({ id, data }) => api.entities.NewsStory.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["news-stories"] }),
  });

  const deleteNewsMutation = useMutation({
    onError: (err) => window.alert("Delete failed: " + (err?.message || err)),
    mutationFn: (id) => api.entities.NewsStory.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["news-stories"] }),
  });

  const handleNewsSave = async (data) => {
    try {
      if (editingStory) {
        await updateNewsMutation.mutateAsync({ id: editingStory.id, data });
      } else {
        await createNewsMutation.mutateAsync(data);
      }
    } catch (err) {
      window.alert("Could not save story: " + (err?.message || err));
      return;
    }
    setNewsModalOpen(false);
    setEditingStory(null);
  };

  const handleNewsEdit = (story) => { setEditingStory(story); setNewsModalOpen(true); };
  const handleNewsAdd = () => { setEditingStory(null); setNewsModalOpen(true); };
  const handleNewsDelete = (id) => { if (window.confirm("Delete this story?")) deleteNewsMutation.mutate(id); };

  const { data: brokers = [] } = useQuery(brokersQuery);

  const createBrokerMutation = useMutation({
    mutationFn: (data) => api.entities.Broker.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["brokers"] }),
  });

  const updateBrokerMutation = useMutation({
    mutationFn: ({ id, data }) => api.entities.Broker.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["brokers"] }),
  });

  const deleteBrokerMutation = useMutation({
    onError: (err) => window.alert("Delete failed: " + (err?.message || err)),
    mutationFn: (id) => api.entities.Broker.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["brokers"] }),
  });

  const handleBrokerSave = async (data) => {
    try {
      if (editingBroker) {
        await updateBrokerMutation.mutateAsync({ id: editingBroker.id, data });
      } else {
        await createBrokerMutation.mutateAsync(data);
      }
    } catch (err) {
      window.alert("Could not save broker: " + (err?.message || err));
      return;
    }
    setBrokerModalOpen(false);
    setEditingBroker(null);
  };

  const handleBrokerEdit = (broker) => { setEditingBroker(broker); setBrokerModalOpen(true); };
  const handleBrokerAdd = () => { setEditingBroker(null); setBrokerModalOpen(true); };
  const handleBrokerDelete = (id) => { if (window.confirm("Remove this broker?")) deleteBrokerMutation.mutate(id); };

  const viewTitles = {
    overview: "Dashboard Overview",
    listings: "Property Listings",
    news: "News Stories",
    brokers: "Broker Profiles",
    team: "Team Page",
    clients: "Subscribers",
    nda: "NDA Requests",
    analytics: "Analytics",
    settings: "Settings",
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <DashboardSidebar
        activeView={activeView}
        setActiveView={setActiveView}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        badges={{ nda: pendingNda }}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
          <div>
            <h1 className="text-slate-900 font-semibold text-base">{viewTitles[activeView]}</h1>
            <p className="text-slate-400 text-xs mt-0.5">
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="pl-8 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                placeholder="Quick search..."
              />
            </div>
            <button
              onClick={() => setActiveView("nda")}
              title={pendingNda ? `${pendingNda} NDA request${pendingNda === 1 ? "" : "s"} awaiting approval` : "No pending NDA requests"}
              className="relative w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition-colors"
            >
              <Bell size={16} className="text-slate-500" />
              {pendingNda > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />}
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">FL</div>
              <div className="hidden sm:block">
                <p className="text-slate-800 text-sm font-medium leading-tight">Faris Lee</p>
                <p className="text-slate-400 text-xs">Admin</p>
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {activeView === "overview" && (
                <div className="space-y-6">
                  {pendingNda > 0 && (
                    <button
                      onClick={() => setActiveView("nda")}
                      className="w-full flex items-center gap-3 px-5 py-4 bg-amber-50 border border-amber-200 rounded-xl text-left hover:bg-amber-100/60 transition-colors"
                    >
                      <FileSignature size={18} className="text-amber-600 flex-shrink-0" />
                      <span className="text-sm text-slate-800">
                        <strong>{pendingNda}</strong> NDA request{pendingNda === 1 ? "" : "s"} awaiting broker approval
                      </span>
                      <span className="ml-auto text-amber-700 text-xs font-semibold">Review →</span>
                    </button>
                  )}
                  <DashboardMetrics listings={listings} />

                  {/* Quick summary table */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                      <div>
                        <h2 className="text-slate-800 font-semibold text-sm">Recent Listings</h2>
                        <p className="text-slate-400 text-xs mt-0.5">Your most recently added properties</p>
                      </div>
                      <button
                        onClick={() => setActiveView("listings")}
                        className="text-blue-600 text-xs font-semibold hover:underline"
                      >
                        View All →
                      </button>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {listings.slice(0, 5).map((l) => (
                        <div key={l.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors group">
                          {l.image_url ? (
                            <img src={l.image_url} alt="" className="w-10 h-9 object-cover rounded-lg border border-slate-100 flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-9 bg-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                              <Building2 size={14} className="text-slate-300" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-800 text-sm font-medium truncate">{l.address || "Unnamed"}</p>
                            <p className="text-slate-400 text-xs">{[l.city, l.state].filter(Boolean).join(", ")}</p>
                          </div>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                            l.status === "active" ? "bg-emerald-50 text-emerald-700" :
                            l.status === "pending" ? "bg-amber-50 text-amber-700" :
                            "bg-blue-50 text-blue-700"
                          }`}>{l.status}</span>
                          <span className="text-slate-700 text-sm font-bold">${Number(l.price || 0).toLocaleString()}</span>
                        </div>
                      ))}
                      {listings.length === 0 && (
                        <div className="text-center py-12 text-slate-400 text-sm">
                          No listings yet —{" "}
                          <button onClick={handleAdd} className="text-blue-600 hover:underline font-medium">
                            add your first one
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeView === "listings" && (
                <DashboardListingsView
                  listings={listings}
                  onAdd={handleAdd}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}

              {activeView === "news" && (
                <DashboardNewsView
                  stories={newsStories}
                  onAdd={handleNewsAdd}
                  onEdit={handleNewsEdit}
                  onDelete={handleNewsDelete}
                />
              )}

              {activeView === "brokers" && (
                <DashboardBrokersView
                  brokers={brokers}
                  onAdd={handleBrokerAdd}
                  onEdit={handleBrokerEdit}
                  onDelete={handleBrokerDelete}
                />
              )}

              {activeView === "analytics" && <DashboardAnalyticsView listings={listings} />}

              {activeView === "clients" && <DashboardSubscribersView />}

              {activeView === "nda" && <DashboardNdaRequestsView />}

              {activeView === "team" && <DashboardTeamView />}

              {activeView === "settings" && (
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center">
                  <Settings size={40} className="text-slate-200 mx-auto mb-4" />
                  <h3 className="text-slate-700 font-semibold text-lg">Settings</h3>
                  <p className="text-slate-400 text-sm mt-2">Account and system settings coming soon.</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <DashboardNewsModal
        isOpen={newsModalOpen}
        onClose={() => { setNewsModalOpen(false); setEditingStory(null); }}
        story={editingStory}
        onSave={handleNewsSave}
      />

      <DashboardListingModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingListing(null); }}
        listing={editingListing}
        onSave={handleSave}
      />

      <DashboardBrokerModal
        isOpen={brokerModalOpen}
        onClose={() => { setBrokerModalOpen(false); setEditingBroker(null); }}
        broker={editingBroker}
        onSave={handleBrokerSave}
      />
    </div>
  );
}

// Keep the dashboard out of search engines: swap the site's "index, follow" robots tag
// for "noindex, nofollow" while this page is open. (vercel.json also sends an
// X-Robots-Tag header for crawlers that don't run JavaScript.)
function useNoIndex() {
  useEffect(() => {
    let tag = document.head.querySelector('meta[name="robots"]');
    const created = !tag;
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", "robots");
      document.head.appendChild(tag);
    }
    const prev = tag.getAttribute("content");
    tag.setAttribute("content", "noindex, nofollow");
    return () => (created ? tag.remove() : tag.setAttribute("content", prev));
  }, []);
}

export default function DashboardConfidential4() {
  useNoIndex();
  return (
    <DashboardPasswordGate>
      <DashboardContent />
    </DashboardPasswordGate>
  );
}