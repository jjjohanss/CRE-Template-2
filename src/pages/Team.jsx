import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import Navbar from "../components/home/Navbar";
import XWidget from "../components/home/XWidget";
import FooterSection from "../components/home/FooterSection";
import { ArrowRight, Mail, Phone } from "lucide-react";

export default function Team() {
  const { members: teamMembers, isLoading } = useTeamMembers();
  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <div className="relative bg-[#F5F5F7] pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
          <div className="w-16 h-0.5 bg-[#C8102E] mx-auto mb-6" />
          <span className="text-[#C8102E] text-xs tracking-[0.3em] uppercase font-semibold">
            Collaboration, Expertise & Teamwork
          </span>
          <h1 className="text-neutral-900 text-5xl md:text-6xl font-bold mt-4 tracking-tight">
            Our Team
          </h1>
          <p className="text-neutral-500 mt-6 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Our team members possess in-depth industry experience, committed to a collaborative, open culture — giving you a rare combination of retail real estate insight and steadfast client service.
          </p>
        </div>
      </div>

      {/* History Section */}
      <section className="py-24 bg-[#F7F8FA]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}>
              
              <span className="text-[#C8102E] text-xs tracking-[0.3em] uppercase font-semibold">
                Since 1996
              </span>
              <h2 className="text-neutral-900 text-4xl md:text-5xl font-bold mt-4 leading-tight">
                We've Always <br /><em className="italic">Been Different</em>
              </h2>
              <div className="w-12 h-0.5 bg-[#C8102E] mt-6" />
              <p className="text-gray-500 mt-8 text-lg leading-relaxed font-light">
                Faris Lee was founded in 1996 on the premise that there was a place in the industry for a firm with a commitment to openness, transparency and the willingness to share ideas. We believed that a multidisciplinary approach would yield superior results. An atmosphere of continual self-improvement was a key objective, as was behaving with the highest level of integrity in all client interactions. Even our approach to staffing was innovative: We didn't necessarily hire for retail real estate experience, but rather for the quality of the person.
              </p>
              <p className="text-gray-500 mt-5 text-lg leading-relaxed font-light">
                The passing of nearly 29 years has confirmed our business model. We continue to rely on forward-thinking market expertise, collaborative teamwork, and creative insight to deliver outstanding value. Faris Lee has become one of the leading retail real estate advisory firms nationwide. Our transactional experience spans billions of dollars and thousands of deals, and we're proud to say we have the industry's highest closing percentage.
              </p>
              <div className="mt-8 p-6 border-l-4 border-[#C8102E] bg-white">
                <p className="text-neutral-900 font-semibold text-base italic">
                  "The Faris Lee Promise: To Protect, Enhance, and Create Value."
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative">
              
              <img
                src="https://farislee.com/wp-content/uploads/freshizer/efb98f99416605a412e12bfbc04edecc_Faris-Lee-14-scaled-1365-1024-c-100.jpg"
                alt="Faris Lee Team"
                className="w-full h-96 object-cover shadow-xl" />
              
              <div className="absolute -bottom-6 -left-6 bg-[#C8102E] p-6 hidden md:block">
                <p className="text-white text-6xl font-bold">30+</p>
                <p className="text-white/80 text-sm tracking-widest uppercase mt-1">Years of Excellence</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16">
            
            <span className="text-[#C8102E] text-xs tracking-[0.3em] uppercase font-semibold">The People Behind the Performance</span>
            <h2 className="text-neutral-900 text-4xl md:text-5xl font-bold mt-4">
              Meet the Team
            </h2>
            <div className="w-12 h-0.5 bg-[#C8102E] mx-auto mt-6" />
          </motion.div>

          {isLoading && (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-[#C8102E] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {teamMembers.map((member, i) =>
            <motion.div
              key={member.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i % 4 * 0.1 }}>
              
                <Link
                to={`/team/${member.slug}`}
                className="group block bg-white border border-gray-100 hover:shadow-2xl transition-all duration-500 overflow-hidden">
                
                  <div className="relative overflow-hidden h-72">
                    {member.photo ? (
                    <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                    <div className="w-full h-full bg-[#F1F2F4] flex items-center justify-center text-5xl font-bold text-gray-300">
                        {member.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                      </div>
                    )}
                  
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <span className="inline-flex items-center text-white text-xs font-semibold tracking-widest uppercase">
                        View Bio <ArrowRight className="w-3 h-3 ml-2" />
                      </span>
                    </div>
                  </div>
                  <div className="p-5 border-t-2 border-transparent group-hover:border-[#C8102E] transition-colors duration-300">
                    <h3 className="text-neutral-900 font-bold text-lg leading-tight">
                      {member.name}
                    </h3>
                    <p className="text-gray-500 text-xs tracking-[0.12em] uppercase mt-1">{member.title}</p>
                    {member.email &&
                  <div className="flex items-center mt-3 text-neutral-700 text-xs">
                        <Mail className="w-3 h-3 mr-1.5 text-[#C8102E]" />
                        {member.email}
                      </div>
                  }
                    {member.phone &&
                  <div className="flex items-center mt-1.5 text-neutral-700 text-xs">
                        <Phone className="w-3 h-3 mr-1.5 text-[#C8102E]" />
                        {member.phone}
                      </div>
                  }
                  </div>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <XWidget />
      <FooterSection />
    </div>);

}