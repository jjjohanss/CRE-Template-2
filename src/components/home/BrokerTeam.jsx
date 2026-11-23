import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { brokersQuery } from "@/lib/queries";

function BrokerCard({ broker }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={broker.thumbImage}
          alt={broker.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Hover overlay */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 transition-all duration-300 ${
          hovered ? "opacity-100" : "opacity-0"
        } bg-neutral-900/90`}
      >
        <h3 className="text-white text-lg font-bold leading-tight">
          {broker.name}
        </h3>
        <p className="text-[#C8102E] text-xs uppercase tracking-widest mt-1 mb-4">{broker.title}</p>
        <Link
          to={`/team/${broker.slug.replace(/-/g, '')}`}
          className="text-xs uppercase tracking-widest border border-white text-white px-4 py-2 hover:bg-white hover:text-[#C8102E] transition-colors"
        >
          Bio &amp; Contact
        </Link>
      </div>

      {/* Always-visible name below card */}
      <div className="bg-white py-3 px-2 text-center border-t border-gray-100">
        <p className="text-neutral-900 text-sm font-semibold">{broker.name}</p>
        <p className="text-gray-400 text-xs mt-0.5">{broker.title}</p>
      </div>
    </motion.div>
  );
}

export default function BrokerTeam() {
  const { data: brokers = [], isLoading } = useQuery(brokersQuery);

  return (
    <section id="broker-team" className="py-20 bg-[#F7F8FA]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#C8102E] text-xs tracking-[0.3em] uppercase font-semibold mb-3">Our People</p>
          <h2 className="text-neutral-900 text-4xl md:text-5xl font-bold">
            Broker Team
          </h2>
          <div className="w-12 h-0.5 bg-[#C8102E] mx-auto mt-5" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {isLoading ? (
            <div className="col-span-full text-center text-gray-400 text-sm py-12">Loading team...</div>
          ) : (
            brokers.map((broker) => (
              <BrokerCard key={broker.id || broker.slug} broker={broker} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}