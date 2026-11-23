import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Phone, Mail, Users } from "lucide-react";
import Navbar from "../components/home/Navbar";
import { api } from "@/api/client";

export default function BrokerBio() {
  const { slug } = useParams();
  const { data: brokers = [], isLoading } = useQuery({
    queryKey: ["brokers"],
    queryFn: () => api.entities.Broker.list("order", 100),
  });
  const broker = brokers.find((b) => b.slug === slug);
  const idx = brokers.findIndex((b) => b.slug === slug);
  const prev = idx > 0 ? brokers[idx - 1] : null;
  const next = idx >= 0 && idx < brokers.length - 1 ? brokers[idx + 1] : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]" style={{ paddingTop: "80px" }}>
          <div className="w-8 h-8 border-2 border-neutral-300 border-t-[#C8102E] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!broker) {
    return (
      <div className="min-h-screen bg-[#F7F8FA]">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4" style={{ paddingTop: "80px" }}>
          <p className="text-xl font-semibold text-neutral-900">Broker not found.</p>
          <Link to="/" className="text-[#C8102E] underline text-sm">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Page header band */}
      <div className="bg-[#F5F5F7] text-neutral-900" style={{ paddingTop: "80px" }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-10">
          <Link
            to="/#broker-team"
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 text-sm transition-colors mb-4"
          >
            <ArrowLeft size={15} />
            Back to Broker Team
          </Link>
          <h1
            className="text-3xl md:text-4xl font-bold text-neutral-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {broker.name}
          </h1>
          <p className="text-[#C8102E] uppercase tracking-widest text-xs mt-2">{broker.title}</p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-14">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Left sidebar */}
          <div className="md:col-span-1 space-y-6">
            {/* Photo */}
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <img
                src={broker.image}
                alt={broker.name}
                className="w-full object-cover"
              />
            </div>

            {/* Contact card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h3 className="text-neutral-900 font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                Contact
              </h3>
              <div className="w-6 h-0.5 bg-[#C8102E]" />

              {broker.phone && (
                <a
                  href={`tel:${broker.phone.replace(/\./g, "-")}`}
                  className="flex items-center gap-3 text-neutral-900 hover:text-[#C8102E] transition-colors text-sm"
                >
                  <Phone size={16} className="text-[#C8102E] flex-shrink-0" />
                  {broker.phone}
                </a>
              )}
              {broker.email && (
                <a
                  href={`mailto:${broker.email}`}
                  className="flex items-center gap-3 text-neutral-900 hover:text-[#C8102E] transition-colors text-sm"
                >
                  <Mail size={16} className="text-[#C8102E] flex-shrink-0" />
                  {broker.email}
                </a>
              )}
              {!broker.phone && !broker.email && (
                <p className="text-gray-400 text-sm">Contact information available upon request.</p>
              )}
            </div>

            {/* Back to team */}
            <Link
              to="/#broker-team"
              className="flex items-center gap-2 text-neutral-900 hover:text-[#C8102E] transition-colors text-sm font-semibold"
            >
              <Users size={16} />
              All Team Members
            </Link>
          </div>

          {/* Right: Bio */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2
                className="text-[#C8102E] text-2xl font-bold mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Biography
              </h2>
              <p className="text-gray-500 text-sm mb-6">{broker.title}</p>
              <div className="w-10 h-0.5 bg-[#C8102E] mb-8" />
              <div className="space-y-5">
                {broker.bio.map((para, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed text-base">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Prev / Next navigation */}
        {(prev || next) && (
          <div className="mt-14 flex justify-between items-center border-t border-gray-200 pt-8 gap-4">
            {prev ? (
              <Link
                to={`/team/${prev.slug}`}
                className="flex items-center gap-3 group"
              >
                <ArrowLeft size={18} className="text-[#C8102E] group-hover:-translate-x-1 transition-transform" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">Previous</p>
                  <p className="text-neutral-900 font-semibold group-hover:text-[#C8102E] transition-colors">{prev.name}</p>
                </div>
              </Link>
            ) : <div />}
            {next ? (
              <Link
                to={`/team/${next.slug}`}
                className="flex items-center gap-3 group text-right"
              >
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">Next</p>
                  <p className="text-neutral-900 font-semibold group-hover:text-[#C8102E] transition-colors">{next.name}</p>
                </div>
                <ArrowLeft size={18} className="text-[#C8102E] rotate-180 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : <div />}
          </div>
        )}
      </div>
    </div>
  );
}