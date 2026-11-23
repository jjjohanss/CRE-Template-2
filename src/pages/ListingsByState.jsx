import React from "react";
import { useQuery } from "@tanstack/react-query";
import { publicListingsQuery } from "@/lib/queries";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Maximize2, DollarSign, Search } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import FooterSection from "../components/home/FooterSection";
import XWidget from "../components/home/XWidget";
import { listingPath, slugify } from "@/lib/slug";
import ImageCarousel from "@/components/listing/ImageCarousel";
import LoadError from "@/components/LoadError";

function ListingCard({ listing, i }) {
  const imgs = listing.images?.length ? listing.images : listing.image_url ? [listing.image_url] : [];
  return (
    <motion.div
      key={listing.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: i * 0.05 }}
      className="group bg-white shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden"
    >
      <div className="relative h-52 overflow-hidden">
        <ImageCarousel images={imgs} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
        {listing.status !== "active" && (
          <div className="absolute top-4 left-4 z-10">
            <span className={`text-xs tracking-widest uppercase px-3 py-1.5 font-semibold ${
              listing.status === "pending" ? "bg-amber-500 text-white" : "bg-neutral-800 text-white"}`
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

      <div className="p-3.5">
        <div className="grid grid-cols-3 gap-2 pb-2.5 border-b border-gray-100">
          <div>
            <div className="flex items-center text-gray-400 text-[10px] mb-0.5"><DollarSign className="w-2.5 h-2.5 mr-0.5" />Price</div>
            <span className="text-neutral-900 font-semibold text-xs">{listing.price ? `$${(listing.price / 1e6).toFixed(1)}M` : "—"}</span>
          </div>
          <div>
            <div className="text-gray-400 text-[10px] mb-0.5">Cap Rate</div>
            <span className="text-neutral-900 font-semibold text-xs">{listing.cap_rate ? `${listing.cap_rate}%` : "—"}</span>
          </div>
          <div>
            <div className="flex items-center text-gray-400 text-[10px] mb-0.5"><Maximize2 className="w-2.5 h-2.5 mr-0.5" />Size</div>
            <span className="text-neutral-900 font-semibold text-xs">{listing.sqft ? `${Number(listing.sqft).toLocaleString()} SF` : "—"}</span>
          </div>
        </div>
        <div className="mt-2.5">
          <Link
            to={listingPath(listing)}
            className="inline-flex items-center px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase border-2 border-[#C8102E] bg-white text-[#C8102E] hover:bg-[#C8102E] hover:text-white transition-colors duration-200"
          >
            View Details
            <ArrowRight className="w-3 h-3 ml-1.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function ListingsByState() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("term") || "";
  const setSearch = (value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set("term", value);
    else next.delete("term");
    setSearchParams(next, { replace: true });
  };

  const { data: listings = [], isLoading, isError, refetch } = useQuery(publicListingsQuery);

  const filtered = listings.filter((l) => {
    if (l.status !== "active") return false;
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return [l.title, l.address, l.state].some((v) => (v || "").toLowerCase().includes(q));
  });

  // Group by state alphabetically
  const byState = filtered.reduce((acc, l) => {
    const st = (l.state || "Unknown").trim();
    if (!acc[st]) acc[st] = [];
    acc[st].push(l);
    return acc;
  }, {});
  const states = Object.keys(byState).sort((a, b) => a.localeCompare(b));

  return (
    <div className="min-h-screen bg-[#F7F8FA]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Page Header */}
      <div className="px-6 pt-32 pb-12 bg-[#F5F5F7]">
        <div className="max-w-[1200px] mx-auto text-center">
          <span className="text-[#C8102E] text-xs tracking-[0.3em] uppercase font-semibold">
            Investment Opportunities
          </span>
          <h1 className="text-neutral-900 text-4xl md:text-5xl font-bold mt-2">
            Listings by State
          </h1>
          <div className="w-12 h-0.5 bg-[#C8102E] mx-auto mt-3" />

          {/* Search bar */}
          <div className="flex justify-center mt-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, address, or state"
                className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30 focus:border-[#C8102E]/40 text-neutral-700 placeholder:text-neutral-400"
              />
            </div>
          </div>

          {/* Back to main listings */}
          <div className="mt-4">
            <Link
              to="/listings"
              className="text-xs tracking-[0.15em] uppercase font-medium text-[#0A1628]/70 hover:text-[#C8102E] transition-colors"
            >
              ← Back to All Listings
            </Link>
          </div>
        </div>
      </div>

      {/* State sections */}
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        {isLoading &&
        <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-[#C8102E] border-t-transparent rounded-full animate-spin" />
          </div>
        }

        {!isLoading && isError && <LoadError onRetry={refetch} />}
        {!isLoading && !isError && filtered.length === 0 &&
        <p className="text-center text-gray-400 py-20 text-lg">No listings found.</p>
        }

        {!isLoading && !isError && filtered.length > 0 && states.map((state) => (
          <section key={state} className="mb-16" id={slugify(state)}>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-[#0A1628] text-2xl font-bold tracking-tight">
                {state}
              </h2>
              <span className="text-gray-400 text-sm">({byState[state].length})</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {byState[state].map((listing, i) => (
                <ListingCard key={listing.id} listing={listing} i={i} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="max-w-[1200px] mx-auto px-6">
        <XWidget />
      </div>

      <FooterSection />
    </div>);
}