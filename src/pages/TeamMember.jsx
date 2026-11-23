import React from "react";
import { Link, useParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import Navbar from "../components/home/Navbar";
import { ArrowLeft, Mail, Phone, ChevronRight } from "lucide-react";
import BrokerListings from "../components/team/BrokerListings";

export default function TeamMember() {
  const { slug: paramSlug } = useParams();
  const urlParams = new URLSearchParams(window.location.search);
  const slug = paramSlug || urlParams.get("slug");
  const { members: teamMembers, isLoading } = useTeamMembers();
  const member = teamMembers.find((m) => m.slug === slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Navbar />
        <div className="w-8 h-8 border-2 border-[#C8102E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
        <Navbar />
        <div className="text-center text-white pt-24">
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Team Member Not Found</h1>
          <Link to={createPageUrl("Team")} className="text-[#C8102E] hover:underline">← Back to Team</Link>
        </div>
      </div>
    );
  }

  const paragraphs = (member.bio || "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  const currentIndex = teamMembers.findIndex((m) => m.slug === slug);
  const nextMember = teamMembers[(currentIndex + 1) % teamMembers.length];
  const prevMember = teamMembers[(currentIndex - 1 + teamMembers.length) % teamMembers.length];

  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Hero Banner */}
      <div className="bg-[#0A1628] pt-28 pb-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <Link
            to={createPageUrl("Team")}
            className="inline-flex items-center text-white/60 hover:text-white text-sm tracking-widest uppercase transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Team
          </Link>
          <div className="flex items-center text-white/40 text-xs tracking-widest uppercase gap-2">
            <Link to={createPageUrl("Home")} className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={createPageUrl("Team")} className="hover:text-white transition-colors">Team</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/70">{member.name}</span>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <section className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12">

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-28">
              <div className="relative overflow-hidden shadow-xl">
                {member.photo && (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full object-cover object-top"
                    style={{ maxHeight: "480px" }}
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C8102E]" />
              </div>

              <div className="mt-6 p-6 bg-[#F7F8FA] border-l-4 border-[#C8102E]">
                <h1 className="text-[#0A1628] text-2xl font-bold leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {member.name}
                </h1>
                <p className="text-gray-500 text-xs tracking-[0.15em] uppercase mt-2">{member.title}</p>

                {member.phone && (
                  <a
                    href={`tel:${member.phone.replace(/\./g, "-")}`}
                    className="flex items-center mt-5 text-[#1E3A5F] hover:text-[#C8102E] transition-colors text-sm group"
                  >
                    <div className="w-8 h-8 bg-[#0A1628] flex items-center justify-center mr-3 group-hover:bg-[#C8102E] transition-colors">
                      <Phone className="w-3.5 h-3.5 text-white" />
                    </div>
                    {member.phone}
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center mt-3 text-[#1E3A5F] hover:text-[#C8102E] transition-colors text-sm group"
                  >
                    <div className="w-8 h-8 bg-[#0A1628] flex items-center justify-center mr-3 group-hover:bg-[#C8102E] transition-colors">
                      <Mail className="w-3.5 h-3.5 text-white" />
                    </div>
                    {member.email}
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-2"
          >
            <div className="mb-8">
              <div className="w-12 h-0.5 bg-[#C8102E] mb-4" />
              <h2 className="text-[#0A1628] text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                About {member.name.split(" ")[0]}
              </h2>
            </div>

            <div className="space-y-5">
              {paragraphs.map((para, i) => (
                <p key={i} className="text-gray-600 leading-relaxed text-[0.97rem]">
                  {para}
                </p>
              ))}
            </div>

            {/* Broker's Active Listings */}
            <BrokerListings brokerSlug={slug} brokerName={member.name} />

            {/* Contact CTA */}
            <div className="mt-12 p-8 bg-[#0A1628]">
              <h3 className="text-white text-xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Work with {member.name.split(" ")[0]}
              </h3>
              <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                Ready to discuss your retail investment goals? Reach out directly.
              </p>
              <div className="flex flex-wrap gap-3">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center px-6 py-3 bg-[#C8102E] text-white text-sm font-semibold tracking-widest uppercase hover:bg-[#a00d24] transition-colors"
                  >
                    <Mail className="w-4 h-4 mr-2" /> Email
                  </a>
                )}
                <a
                  href="https://farislee.com/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-white/30 text-white text-sm font-semibold tracking-widest uppercase hover:bg-white/10 transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Prev / Next Navigation */}
      <div className="bg-[#F7F8FA] border-t border-gray-200">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-2">
          <Link
            to={`/team/${prevMember.slug}`}
            className="flex items-center gap-4 py-8 pr-6 hover:bg-white transition-colors group border-r border-gray-200"
          >
            <ArrowLeft className="w-5 h-5 text-[#C8102E] flex-shrink-0" />
            <div>
              <p className="text-gray-400 text-xs tracking-widest uppercase mb-1">Previous</p>
              <p className="text-[#0A1628] font-bold group-hover:text-[#C8102E] transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                {prevMember.name}
              </p>
            </div>
          </Link>
          <Link
            to={`/team/${nextMember.slug}`}
            className="flex items-center justify-end gap-4 py-8 pl-6 hover:bg-white transition-colors group"
          >
            <div className="text-right">
              <p className="text-gray-400 text-xs tracking-widest uppercase mb-1">Next</p>
              <p className="text-[#0A1628] font-bold group-hover:text-[#C8102E] transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                {nextMember.name}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#C8102E] flex-shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
}