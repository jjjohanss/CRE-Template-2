import React from "react";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { listingPath } from "@/lib/slug";

// Listing rows in the same style as "Available Listings" on the homepage.
export default function ListingRows({ listings }) {
  return (
    <div className="bg-white border border-gray-200 shadow-sm divide-y divide-gray-100">
      {listings.map((listing, i) => {
        const detailUrl = listingPath(listing);
        return (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.05 }}
            className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 px-6 py-5 hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex-1 min-w-0">
              <h3 className="text-neutral-900 font-bold text-lg leading-tight">
                <Link to={detailUrl} className="hover:text-[#C8102E] transition-colors">
                  {listing.title || listing.address}
                </Link>
              </h3>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <MapPin className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-[#C8102E]" />
                {[listing.address, listing.city, listing.state].filter(Boolean).join(", ")}
              </div>
            </div>
            <div className="md:text-right md:w-32">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Price</div>
              <div className="text-neutral-900 font-semibold text-base">
                {listing.price ? `$${(listing.price / 1e6).toFixed(2)}M` : "—"}
              </div>
            </div>
            <div className="md:text-right md:w-24">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Cap Rate</div>
              <div className="text-neutral-900 font-semibold text-base">
                {listing.cap_rate ? `${listing.cap_rate}%` : "—"}
              </div>
            </div>
            <Link
              to={detailUrl}
              aria-label={`View details for ${listing.title || listing.address}`}
              className="inline-flex items-center text-sm font-semibold tracking-wider uppercase text-[#C8102E] hover:text-[#a00d24] transition-colors whitespace-nowrap"
            >
              View Details
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
