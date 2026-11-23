import React from "react";
import { useQuery } from "@tanstack/react-query";
import { listingKeys } from "@/lib/queries";
import { api } from "@/api/client";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { listingPath } from "@/lib/slug";
import LoadError from "@/components/LoadError";

export default function BrokerListings({ brokerSlug, brokerName }) {
  const { data: listings = [], isLoading, isError, refetch } = useQuery({
    queryKey: listingKeys.broker(brokerSlug),
    queryFn: () => api.entities.Listing.filter({ status: "active" }, "-price", 100),
    enabled: !!brokerSlug,
  });

  const normalize = (s) => (s || "").toLowerCase().replace(/-/g, "");
  const brokerListings = listings.filter(
    (l) =>
      Array.isArray(l.brokers) &&
      l.brokers.some((b) => normalize(b) === normalize(brokerSlug))
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-7 h-7 border-2 border-[#C8102E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <LoadError onRetry={refetch} className="mt-16" />;
  }

  if (brokerListings.length === 0) {
    return (
      <div className="mt-16">
        <div className="w-12 h-0.5 bg-[#C8102E] mb-4" />
        <h2 className="text-[#0A1628] text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
          Available Listings
        </h2>
        <p className="text-gray-500 mt-4 text-sm">
          {brokerName ? `${brokerName.split(" ")[0]} has no active listings at this time.` : "No active listings at this time."}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-16">
      <div className="w-12 h-0.5 bg-[#C8102E] mb-4" />
      <h2 className="text-[#0A1628] text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
        Available Listings
      </h2>
      <p className="text-gray-500 mt-2 text-sm">
        {brokerListings.length} active {brokerListings.length === 1 ? "property" : "properties"}
      </p>

      <div className="grid sm:grid-cols-2 gap-6 mt-8">
        {brokerListings.map((listing, i) => {
          const thumb = (listing.images && listing.images[0]) || listing.image_url;
          const detailUrl = listingPath(listing);
          return (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                to={detailUrl}
                className="group block bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="w-full h-44 overflow-hidden bg-[#F7F8FA]">
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={listing.title || listing.address}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                      No image
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-5">
                  <h3 className="text-[#0A1628] font-bold text-base leading-tight group-hover:text-[#C8102E] transition-colors">
                    {listing.title || listing.address}
                  </h3>
                  <div className="flex items-center text-gray-500 text-xs mt-2">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-[#C8102E]" />
                    {[listing.city, listing.state].filter(Boolean).join(", ")}
                  </div>

                  <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider">Price</div>
                      <div className="text-[#0A1628] font-semibold text-sm">
                        {listing.price ? `$${(listing.price / 1e6).toFixed(2)}M` : "—"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider">Cap Rate</div>
                      <div className="text-[#0A1628] font-semibold text-sm">
                        {listing.cap_rate ? `${listing.cap_rate}%` : "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}