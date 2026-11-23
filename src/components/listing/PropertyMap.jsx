import React from "react";

export default function PropertyMap({ latitude, longitude, address }) {
  if (!latitude || !longitude) return null;

  const src = `https://maps.google.com/maps?q=${encodeURIComponent(
    `${latitude},${longitude}`
  )}&z=15&output=embed`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <h2
        className="text-[#0A1628] text-xl font-bold mb-4"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Property Location
      </h2>
      <div className="w-8 h-0.5 bg-[#C8102E] mb-6" />
      <div className="rounded-xl overflow-hidden" style={{ height: "466px" }}>
        <iframe
          title={`Map of ${address || "property"}`}
          src={src}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}