import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { publicListingsQuery } from "@/lib/queries";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Search } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import FooterSection from "../components/home/FooterSection";
import XWidget from "../components/home/XWidget";
import { listingPath } from "@/lib/slug";
import ImageCarousel from "@/components/listing/ImageCarousel";
import LoadError from "@/components/LoadError";

const FILTERS = ["all", "Single Tenant", "Multi Tenant", "under5m", "over5m"];
const filterLabel = { all: "All", "Single Tenant": "Single Tenant", "Multi Tenant": "Multi Tenant", under5m: "Under $5M", over5m: "Over $5M" };
const FILTER_SLUG = { all: "all", "Single Tenant": "single-tenant", "Multi Tenant": "multi-tenant", under5m: "under5m", over5m: "over5m" };
const SLUG_TO_FILTER = Object.fromEntries(Object.entries(FILTER_SLUG).map(([k, v]) => [v, k]));
const STATE_LINK = "list-by-state";

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState(() => SLUG_TO_FILTER[searchParams.get("type")] || "all");
  const search = searchParams.get("term") || "";
  const setSearch = (value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set("term", value);
    else next.delete("term");
    setSearchParams(next, { replace: true });
  };
  const changeFilter = (value) => {
    setStatusFilter(value);
    const next = new URLSearchParams(searchParams);
    if (value === "all") next.delete("type");
    else next.set("type", FILTER_SLUG[value]);
    setSearchParams(next, { replace: true });
  };

  const { data: listings = [], isLoading, isError, refetch } = useQuery(publicListingsQuery);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return listings
      .filter((l) => l.status === "active")
      .filter((l) => {
        if (statusFilter === "all") return true;
        if (statusFilter === "Single Tenant") return l.property_type === "Single Tenant";
        if (statusFilter === "Multi Tenant") return l.property_type === "Multi Tenant";
        if (statusFilter === "under5m") return l.price < 5000000;
        if (statusFilter === "over5m") return l.price >= 5000000;
        return true;
      })
      .filter((l) => {
        if (!q) return true;
        return [l.title, l.address, l.city, l.state].some((v) => (v || "").toLowerCase().includes(q));
      })
      .sort((a, b) => (b.price || 0) - (a.price || 0));
  }, [listings, statusFilter, search]);

  return (
    <div className="min-h-screen bg-[#F7F8FA]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Page Header */}
      <div className="px-6 pt-32 pb-6 bg-[#F5F5F7]">
        <div className="max-w-[1200px] mx-auto text-center">
          <h1 className="text-neutral-900 text-4xl md:text-5xl font-bold">
            Commercial Property Listings
          </h1>
          <div className="w-12 h-0.5 bg-[#C8102E] mx-auto mt-3" />

          {/* Filter buttons */}
          <div className="flex items-center justify-center gap-2 flex-wrap mt-4">
            {FILTERS.map((s) =>
            <button
              key={s}
              onClick={() => changeFilter(s)}
              className={`px-5 py-2 text-xs font-semibold tracking-widest uppercase transition-all border ${
              statusFilter === s ?
              "bg-[#C8102E] border-[#C8102E] text-white" :
              "border-white/20 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"}`
              }>
              
                {filterLabel[s]}
              </button>
            )}
            <Link
              to="/listings-by-state"
              className="px-5 py-2 text-xs font-semibold tracking-widest uppercase transition-all border border-white/20 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
            >
              List by State
            </Link>
          </div>

          {/* Search bar */}
          <div className="flex justify-center mt-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, address, city, or state"
                className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30 focus:border-[#C8102E]/40 text-neutral-700 placeholder:text-neutral-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[1200px] mx-auto px-6 pt-8 pb-16">
        {isLoading &&
        <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-[#C8102E] border-t-transparent rounded-full animate-spin" />
          </div>
        }

        {!isLoading && isError && <LoadError onRetry={refetch} />}
        {!isLoading && !isError && filtered.length === 0 &&
        <p className="text-center text-gray-400 py-20 text-lg">No listings found.</p>
        }

        {!isLoading && !isError && filtered.length > 0 &&
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((listing, i) => {
            const imgs = listing.images?.length ?
            listing.images :
            listing.image_url ? [listing.image_url] : [];
            return (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group bg-white shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden">
                
                  <div className="relative h-52 overflow-hidden">
                    <ImageCarousel images={imgs} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                    {listing.status !== "active" && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className={`text-xs tracking-widest uppercase px-3 py-1.5 font-semibold ${
                    listing.status === "pending" ? "bg-amber-500 text-white" :
                    "bg-neutral-800 text-white"}`
                    }>
                        {listing.status}
                      </span>
                    </div>
                    )}
                    <div className="absolute bottom-4 left-4 right-4 pointer-events-none z-10">
                      <h2 className="text-white text-lg font-bold leading-tight">{listing.title || listing.address}</h2>
                      <div className="flex items-center text-white/80 text-sm mt-1">
                        <MapPin className="w-3.5 h-3.5 mr-1" />
                        {[listing.city, listing.state].filter(Boolean).join(", ")}
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 flex items-center justify-between gap-2">
                    <dl className="text-[11px] leading-5 grid grid-cols-[auto,auto] gap-x-2 whitespace-nowrap">
                      <dt className="text-gray-400">Price</dt>
                      <dd className="text-neutral-900 font-semibold">{listing.price ? `$${(listing.price / 1e6).toFixed(1)}M` : "—"}</dd>
                      <dt className="text-gray-400">Cap Rate</dt>
                      <dd className="text-neutral-900 font-semibold">{listing.cap_rate ? `${listing.cap_rate}%` : "—"}</dd>
                      <dt className="text-gray-400">Size</dt>
                      <dd className="text-neutral-900 font-semibold">{listing.sqft ? `${Number(listing.sqft).toLocaleString()} SF` : "—"}</dd>
                    </dl>
                    <Link
                    to={listingPath(listing)}
                    className="flex-shrink-0 inline-flex items-center px-2 py-1.5 text-[11px] font-semibold tracking-wide uppercase border-2 border-[#C8102E] bg-white text-[#C8102E] hover:bg-[#C8102E] hover:text-white transition-colors duration-200">
                      View Details
                      <ArrowRight className="w-3 h-3 ml-1.5" />
                    </Link>
                  </div>
                </motion.div>);

          })}
          </div>
        }
      </div>

      <div className="max-w-[1200px] mx-auto px-6">
        <XWidget />
      </div>

      <FooterSection />
    </div>);

}