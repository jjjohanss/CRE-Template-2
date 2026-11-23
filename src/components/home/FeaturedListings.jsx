import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { listingKeys } from "@/lib/queries";
import { api } from "@/api/client";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { listingPath } from "@/lib/slug";
import LoadError from "@/components/LoadError";

export default function FeaturedListings() {
  const { data: listings = [], isLoading, isError, refetch } = useQuery({
    queryKey: listingKeys.featured,
    queryFn: () => api.entities.Listing.filter({ status: "active" }, "-price", 10)
  });
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const term = searchTerm.trim();
    navigate(term ? `/listings?term=${encodeURIComponent(term)}` : "/listings");
  };

  return (
    <section className="py-28 bg-[#F7F8FA]">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16">
          
          <span className="text-[#C8102E] text-xs tracking-[0.3em] uppercase font-semibold">
            Investment Opportunities
          </span>
          <h2 className="text-neutral-900 text-4xl md:text-5xl font-bold mt-4 tracking-tight">
            Available Listings
          </h2>
          <form onSubmit={handleSearch} className="flex justify-center mt-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, address, city, or state"
                className="w-full pl-9 pr-4 py-2 text-sm border-2 border-[#C8102E] rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30 text-neutral-700 placeholder:text-neutral-400"
              />
            </div>
          </form>
        </motion.div>

        {isLoading &&
        <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#C8102E] border-t-transparent rounded-full animate-spin" />
          </div>
        }

        {!isLoading && isError && <LoadError onRetry={refetch} />}
        {!isLoading && !isError && listings.length === 0 &&
        <p className="text-center text-gray-400 py-16 text-lg">No active listings at this time.</p>
        }

        {!isLoading && !isError && listings.length > 0 &&
        <div className="bg-white border border-gray-200 shadow-sm divide-y divide-gray-100">
            {listings.slice(0, 4).map((listing, i) => {
            const detailUrl = listingPath(listing);
            return (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 px-6 py-5 hover:bg-gray-50 transition-colors duration-200"
              >
                {/* Title + Address */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-neutral-900 font-bold text-lg leading-tight">
                    {listing.title || listing.address}
                  </h3>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-[#C8102E]" />
                    {[listing.address, listing.city, listing.state].filter(Boolean).join(", ")}
                  </div>
                </div>

                {/* Price */}
                <div className="md:text-right md:w-32">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Price</div>
                  <div className="text-neutral-900 font-semibold text-base">
                    {listing.price ? `$${(listing.price / 1e6).toFixed(2)}M` : "—"}
                  </div>
                </div>

                {/* Cap Rate */}
                <div className="md:text-right md:w-24">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Cap Rate</div>
                  <div className="text-neutral-900 font-semibold text-base">
                    {listing.cap_rate ? `${listing.cap_rate}%` : "—"}
                  </div>
                </div>

                {/* View Details */}
                <Link
                  to={detailUrl}
                  className="inline-flex items-center text-sm font-semibold tracking-wider uppercase text-[#C8102E] hover:text-[#a00d24] transition-colors whitespace-nowrap"
                >
                  View Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </motion.div>
            );
          })}
        </div>
        }

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-14">
          
          <Link
            to={createPageUrl("Listings")}
            className="inline-flex items-center px-10 py-4 bg-neutral-900 text-white text-sm font-semibold tracking-widest uppercase hover:bg-neutral-700 transition-colors duration-300">
            
            View All Listings
            <ArrowRight className="w-4 h-4 ml-3" />
          </Link>
        </motion.div>
      </div>
    </section>);

}