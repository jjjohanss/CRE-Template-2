import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, MapPin, Building2, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/api/client";
import { listingKeys } from "@/lib/queries";
import Navbar from "../home/Navbar";
import FooterSection from "../home/FooterSection";
import BrokerCard from "./BrokerCard";
import ListingRows from "./ListingRows";
import EmailSignupModal from "./EmailSignupModal";

// Shown instead of "Listing not found" when a property has sold or gone under contract.
export default function ClosedListing({ summary }) {
  const [showSignup, setShowSignup] = useState(false);
  const sold = summary.status === "sold";
  const name = summary.title || summary.address;
  const place = [summary.city, summary.state].filter(Boolean).join(", ");
  const brokers = Array.isArray(summary.brokers) ? summary.brokers : [];

  useEffect(() => {
    const prev = document.title;
    document.title = `${name} | ${sold ? "Sold" : "Under Contract"} | Faris Lee Investments`;
    return () => { document.title = prev; };
  }, [name, sold]);

  // Up to three similar properties that are still available.
  const { data: similar = [] } = useQuery({
    queryKey: [...listingKeys.all, "similar", summary.property_type || "any"],
    queryFn: () =>
      api.entities.Listing.filter(summary.property_type ? { status: "active", property_type: summary.property_type } : { status: "active" }, "-created_date", 3),
  });

  return (
    <div className="min-h-screen bg-[#F7F8FA]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <Navbar />
      <div className="max-w-[1200px] mx-auto px-6 md:px-12" style={{ paddingTop: "80px" }}>
        <Link to="/listings" className="inline-flex items-center gap-2 text-[#C8102E] transition-colors py-3">
          <ArrowLeft size={16} />
          Back to Listings
        </Link>

        <div className="grid md:grid-cols-5 gap-8 bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="md:col-span-2 relative bg-neutral-100 min-h-[220px]">
            {summary.image ? (
              <img src={summary.image} alt={summary.address} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Building2 className="w-14 h-14 text-gray-300" />
              </div>
            )}
            <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase ${sold ? "bg-neutral-800 text-white" : "bg-amber-500 text-white"}`}>
              {sold ? "Sold" : "Under Contract"}
            </span>
          </div>

          <div className="md:col-span-3 p-6 md:p-8 md:pl-0">
            <p className="text-[#C8102E] text-xs tracking-[0.25em] uppercase font-semibold">
              {sold ? "This property has sold" : "This property is under contract"}
            </p>
            <h1 className="text-neutral-900 text-2xl md:text-3xl font-bold mt-2 leading-tight">{name}</h1>
            {(summary.address || place) && (
              <p className="flex items-center text-gray-500 text-sm mt-2">
                <MapPin className="w-4 h-4 mr-1.5 text-[#C8102E] flex-shrink-0" />
                {[summary.address !== name ? summary.address : null, place].filter(Boolean).join(", ")}
              </p>
            )}
            {(summary.property_type || summary.sqft) && (
              <p className="text-gray-500 text-sm mt-1">
                {[summary.property_type, summary.sqft ? `${Number(summary.sqft).toLocaleString()} SF` : null].filter(Boolean).join(" · ")}
              </p>
            )}
            <p className="text-gray-600 mt-5 leading-relaxed">
              {sold
                ? "This property is no longer available. Browse our current listings, or get new properties like this one by email as soon as they come to market."
                : "An offer has been accepted, so this property is no longer available. Browse our current listings, or get new properties like this one by email as soon as they come to market."}
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link to="/listings" className="inline-flex items-center gap-2 px-5 py-3 bg-[#C8102E] hover:bg-[#a00d24] text-white text-sm font-semibold tracking-wide uppercase rounded-lg transition-colors">
                View Available Listings <ArrowRight size={16} />
              </Link>
              <button type="button" onClick={() => setShowSignup(true)} className="inline-flex items-center gap-2 px-5 py-3 border-2 border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white text-sm font-semibold tracking-wide uppercase rounded-lg transition-colors">
                <Mail size={16} /> Get Property Updates
              </button>
            </div>
          </div>
        </div>

        {brokers.length > 0 && (
          <div className="mt-10 bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-neutral-900 text-sm font-bold uppercase tracking-widest">
              Talk to the {brokers.length === 1 ? "broker" : "brokers"} on this {sold ? "sale" : "deal"}
            </h2>
            <div className="grid md:grid-cols-2 gap-x-8 mt-2">
              {brokers.map((slug) => <BrokerCard key={slug} slug={slug} />)}
            </div>
          </div>
        )}

        {similar.length > 0 && (
          <div className="mt-12 mb-4">
            <h2 className="text-neutral-900 text-2xl font-bold tracking-tight mb-6">
              Available {summary.property_type ? `${summary.property_type} ` : ""}Properties
            </h2>
            <ListingRows listings={similar} />
          </div>
        )}
        <div className="h-16" />
      </div>
      <FooterSection />
      {showSignup && <EmailSignupModal onClose={() => setShowSignup(false)} />}
    </div>
  );
}
