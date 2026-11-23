import React from "react";
import { useQuery } from "@tanstack/react-query";
import { brokersQuery } from "@/lib/queries";
import { Mail, Phone } from "lucide-react";

export default function BrokerCard({ slug }) {
  const { data: brokers = [] } = useQuery(brokersQuery);
  const broker = brokers.find((b) => b.slug === slug);
  if (!broker) return null;

  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-200 last:border-0 last:pb-0">
      <img
        src={broker.thumbImage || broker.image}
        alt={broker.name}
        className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-gray-200"
      />
      <div className="min-w-0">
        <p className="text-neutral-900 font-semibold text-sm leading-tight">{broker.name}</p>
        <p className="text-gray-500 text-xs mt-0.5">{broker.title}</p>
        {broker.license && (
          <p className="text-gray-400 text-xs mt-0.5">{broker.license}</p>
        )}
        {broker.email && (
          <a href={`mailto:${broker.email}`} className="flex items-center gap-1.5 text-[#C8102E] text-xs mt-2 hover:text-[#e03050] transition-colors">
            <Mail size={11} />
            {broker.email}
          </a>
        )}
        {broker.phone && (
          <a href={`tel:${broker.phone}`} className="flex items-center gap-1.5 text-gray-600 text-xs mt-1 hover:text-neutral-900 transition-colors">
            <Phone size={11} />
            {broker.phone}
          </a>
        )}
      </div>
    </div>
  );
}