import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listingKeys } from "@/lib/queries";
import { api } from "@/api/client";
import { ArrowLeft, MapPin, Maximize2, DollarSign, Building2, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import Navbar from "../components/home/Navbar";
import SocialLinks from "../components/home/SocialLinks";
import EmailSignupModal from "../components/listing/EmailSignupModal";
import NdaPanel from "../components/listing/NdaPanel";
import PropertyMap from "../components/listing/PropertyMap";
import BrokerCard from "../components/listing/BrokerCard";
import FooterSection from "../components/home/FooterSection";
import ClosedListing from "../components/listing/ClosedListing";
import LoadError from "@/components/LoadError";

const statusColors = {
  active: "bg-[#C8102E] text-white",
  pending: "bg-amber-500 text-white",
  sold: "bg-neutral-800 text-white",
};

export default function ListingDetail() {
  const { slug } = useParams();
  const qp = new URLSearchParams(window.location.search);
  // Support /listings/address-city-state--id (new) and ?id= (legacy)
  // ID is after the double dash "--"
  const id = slug ? slug.split("--")[1] : qp.get("id");
  const [activeImg, setActiveImg] = useState(0);
  // "om" = sign up to download this OM; "general" = sign up for property updates only
  const [signupMode, setSignupMode] = useState(null);

  // Check if visitor has already registered via cookie
  const getSubscriberEmail = () => {
    const match = document.cookie.split("; ").find((c) => c.startsWith("fli_subscriber="));
    return match ? decodeURIComponent(match.split("=")[1]) : null;
  };

  const logOmDownload = async (email) => {
    const address = listing.address + (listing.city ? `, ${listing.city}` : "");
    try {
      await api.entities.OmDownload.log({
        subscriber_email: email,
        listing_id: listing.id,
        listing_address: address,
        listing_title: listing.title || "",
      });
    } catch (e) {
      // logging failure shouldn't block the download
    }
    window.open(listing.om_url, "_blank");
  };

  const handleOmDownload = async () => {
    const email = getSubscriberEmail();
    if (!email) {
      setSignupMode("om");
      return;
    }
    await logOmDownload(email);
  };

  const handleRegistered = async (email) => {
    await logOmDownload(email);
  };

  // Active listings load normally. If the listing isn't visible (sold or under
  // contract), fetch its short public summary to show a "has sold" page instead.
  const { data: listing, isLoading, isError, refetch } = useQuery({
    queryKey: listingKeys.detail(id),
    queryFn: async () => {
      const rows = await api.entities.Listing.filter({ id });
      if (rows[0]) return rows[0];
      return await api.entities.Listing.closedSummary(id);
    },
    enabled: !!id,
  });

  const images = listing
    ? listing.images?.length
      ? listing.images
      : listing.image_url
      ? [listing.image_url]
      : []
    : [];

  const prevImg = () => setActiveImg((i) => (i - 1 + images.length) % images.length);
  const nextImg = () => setActiveImg((i) => (i + 1) % images.length);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#C8102E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center px-6">
        <LoadError what="property" onRetry={refetch} />
        <Link to="/listings" className="text-[#C8102E] underline text-base">Back to Listings</Link>
      </div>
    );
  }

  if (listing?.closed) return <ClosedListing summary={listing} />;

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center text-neutral-900 gap-4">
        <p className="text-xl font-semibold">Listing not found.</p>
        <Link to={createPageUrl("Home")} className="text-[#C8102E] underline text-base">Back to Home</Link>
      </div>
    );
  }

  const formatPrice = (p) => p >= 1_000_000 ? `$${(p / 1_000_000).toFixed(2)}M` : `$${Number(p).toLocaleString()}`;

  return (
    <div className="min-h-screen bg-[#F7F8FA]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <Navbar />

      {/* Hero Image */}
      <div className="w-full bg-neutral-100" style={{ paddingTop: "80px" }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Back link */}
        <Link to={createPageUrl("Listings")} className="inline-flex items-center gap-2 text-[#C8102E] transition-colors py-3">
          <ArrowLeft size={16} />
          Back to Listings
        </Link>

        {/* Main image — shrink to fit so the full image is always visible.
            Height = width ÷ 1.295, minus 10px (the padding trick keeps it proportional at every screen width). */}
        <div className="relative bg-neutral-100" style={{ height: 0, paddingTop: "calc(100% / 1.295 - 10px)" }}>
          {images.length > 0 ? (
            <img
              key={activeImg}
              src={images[activeImg]}
              alt={listing.address}
              className="absolute inset-0 w-full h-full object-contain"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-200">
              <Building2 className="w-24 h-24 text-white/20" />
            </div>
          )}

          {/* Nav arrows */}
          {images.length > 1 && (
            <>
              <button onClick={prevImg} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors z-10">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextImg} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors z-10">
                <ChevronRight size={20} />
              </button>
              <div className="absolute top-3 right-4 bg-black/50 text-white text-sm px-2.5 py-1 rounded-full z-10">
                {activeImg + 1} / {images.length}
              </div>
            </>
          )}

          {/* Status badge */}
          <div className="absolute top-3 left-4 z-10">
            <span className={`text-sm tracking-widest uppercase px-3 py-1.5 font-semibold ${statusColors[listing.status] || statusColors.active}`}>
              {listing.status}
            </span>
          </div>

          {/* Title overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-4 pt-10 z-10">
            {listing.price && (
              <p className="text-white/85 text-sm mb-1 font-light tracking-wide">Sale Price:&nbsp;&nbsp;{listing.price >= 1_000_000 ? `$${(listing.price / 1_000_000).toFixed(2)}M` : `$${Number(listing.price).toLocaleString()}`}</p>
            )}
            <h1 className="text-white text-2xl md:text-3xl font-semibold leading-tight">
              {listing.title || listing.address}
            </h1>
            <div className="flex items-center text-white/85 text-sm mt-1.5 gap-1 font-light">
              <MapPin className="w-4 h-4" />
              {[listing.address, listing.city, listing.state, listing.zip].filter(Boolean).join(", ")}
            </div>
          </div>
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="py-3 overflow-x-auto">
            <div className="flex gap-2">
              {images.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-24 rounded overflow-hidden border-2 transition-all ${i === activeImg ? "border-[#C8102E]" : "border-transparent opacity-60 hover:opacity-100"}`}
                  style={{ aspectRatio: "1.295 / 1" }}
                >
                  <img src={url} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-6">

            {/* Price + quick stats — four prominent metric boxes */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Asking Price", value: listing.price ? formatPrice(listing.price) : "—" },
                { label: "Cap Rate", value: listing.cap_rate ? `${listing.cap_rate}%` : "—" },
                { label: "NOI", value: listing.noi ? `$${Number(listing.noi).toLocaleString()}` : "—" },
                { label: "Year Built", value: listing.year_built || "—" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-2 flex flex-col items-center justify-center text-center">
                  <p className="text-neutral-900 font-semibold text-xl md:text-2xl leading-none md:leading-none">{stat.value}</p>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mt-1.5 font-light">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* NDA listings: sign NDA → broker approval → private download */}
            {listing.nda_required && <NdaPanel listing={listing} />}

            {/* Download OM — gated behind registration */}
            {!listing.nda_required && listing.om_url && (
              <button
                onClick={handleOmDownload}
                className="flex items-center justify-center gap-3 w-full py-4 bg-[#C8102E] hover:bg-[#a00d24] text-white font-bold text-base tracking-widest uppercase transition-colors rounded-2xl shadow-sm"
              >
                <Download size={20} />
                Download OM
              </button>
            )}

            {/* Highlights */}
            {listing.highlights?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-neutral-900 text-lg font-semibold mb-3 uppercase tracking-wide">
                  Highlights
                </h2>
                <div className="w-8 h-0.5 bg-[#C8102E] mb-4" />
                <ul className="space-y-2.5">
                  {listing.highlights.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-600 text-sm font-light leading-relaxed">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-[#C8102E] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Description */}
            {listing.description && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-neutral-900 text-lg font-semibold mb-3 uppercase tracking-wide">
                  Property Description
                </h2>
                <div className="w-8 h-0.5 bg-[#C8102E] mb-4" />
                <div
                  className="text-gray-600 leading-relaxed text-sm font-light prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: listing.description }}
                />
              </div>
            )}

          </div>

          {/* Right: Summary card */}
          <div className="space-y-4">
            {/* Brokers */}
            {listing.brokers?.length > 0 && (
              <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
                <h3 className="text-neutral-900 text-base font-semibold mb-2 uppercase tracking-wide">
                  Contact Brokers
                </h3>
                <div className="w-6 h-0.5 bg-[#C8102E] mb-4" />
                <div>
                  {listing.brokers.map((slug) => (
                    <BrokerCard key={slug} slug={slug} />
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 text-neutral-900">
              <h3 className="text-neutral-900 text-sm font-semibold mb-1.5 uppercase tracking-wide">
                Property Details
              </h3>
              <div className="w-6 h-0.5 bg-[#C8102E] mb-3" />
              <dl className="space-y-2">
                {[
                  ["Address", listing.address],
                  ["City", listing.city],
                  ["State", listing.state],
                  ["ZIP Code", listing.zip],
                  ["Status", listing.status ? listing.status.charAt(0).toUpperCase() + listing.status.slice(1) : null],
                  ["Property Type", listing.property_type?.replace(/_/g, " ")],
                  ["Square Footage", listing.sqft ? `${Number(listing.sqft).toLocaleString()} SF` : null],
                  ["Bedrooms", listing.bedrooms || null],
                  ["Bathrooms", listing.bathrooms || null],
                ].filter(([, v]) => v).map(([label, value]) => (
                  <div key={label} className="flex justify-between items-start gap-3 text-sm border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                    <dt className="text-gray-500 capitalize flex-shrink-0">{label}</dt>
                    <dd className="text-neutral-900 font-medium text-right capitalize">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
              <p className="text-neutral-900 font-semibold text-sm mb-1 uppercase tracking-wide">Find Us on Social Media</p>
              <div className="w-6 h-0.5 bg-[#C8102E] mx-auto mb-4" />
              <div className="flex justify-center">
                <SocialLinks variant="card" />
              </div>
            </div>

            {/* CTA */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
              <p className="text-neutral-900 font-semibold text-sm mb-1 uppercase tracking-wide">Stay Ahead of the Market</p>
              <p className="text-gray-500 text-sm mb-4 font-light">Sign up to receive exclusive property listings and investment opportunities.</p>
              <button
                onClick={() => setSignupMode("general")}
                className="block w-full py-3 bg-[#C8102E] text-white text-base font-semibold tracking-widest uppercase hover:bg-[#a00d24] transition-colors rounded-lg"
              >
                Sign Up for Updates
              </button>
              <Link
                to={createPageUrl("Listings")}
                className="block w-full py-3 mt-3 border border-neutral-900 text-neutral-900 text-base font-semibold tracking-widest uppercase hover:bg-neutral-900 hover:text-white transition-colors rounded-lg text-center"
              >
                All Listings
              </Link>
            </div>
          </div>
        </div>

        {/* Map — full content width */}
        <PropertyMap
          latitude={listing.latitude}
          longitude={listing.longitude}
          address={listing.address}
        />
      </div>
      {signupMode === "om" && (
        <EmailSignupModal
          onClose={() => setSignupMode(null)}
          onRegistered={(email) => { setSignupMode(null); handleRegistered(email); }}
        />
      )}
      {signupMode === "general" && (
        <EmailSignupModal onClose={() => setSignupMode(null)} />
      )}
      <FooterSection />
    </div>
  );
}