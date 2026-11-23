import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { api } from "@/api/client";

const fallbackStories = [
  {
    title: "Plaza Pacifica",
    subtitle: "Premier Neighborhood Retail Center",
    location: "San Clemente, CA",
    salePrice: "$21,000,000",
    sqft: "67,500 SF",
    description:
      "Faris Lee Investments successfully completed the sale of this high-quality neighborhood retail center, achieving above-market pricing through a strategic marketing campaign that attracted multiple competitive offers from institutional and private capital.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    year: "2026",
  },
  {
    title: "Princeton Plaza",
    subtitle: "Newly Constructed Retail Asset",
    location: "Dallas, TX",
    salePrice: "$14,500,000",
    sqft: "32,000 SF",
    description:
      "This newly constructed, 100% occupied retail center was strategically positioned to attract both experienced and first-time commercial investors. Faris Lee's expertise ensured a seamless closing and optimal terms for all parties involved.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    year: "2026",
  },
  {
    title: "Lakewood Forest Center",
    subtitle: "Major Retail Power Center",
    location: "Houston, TX",
    salePrice: "$18,700,000",
    sqft: "108,000 SF",
    description:
      "Faris Lee Investments leveraged its deep retail expertise to complete the sale of this 108,000 sqft retail center, implementing a comprehensive repositioning narrative that highlighted the property's long-term growth potential and stable tenant mix.",
    image: "https://images.unsplash.com/photo-1582407947092-67a93da2c9ef?w=800&q=80",
    year: "2026",
  },
  {
    title: "Crossroads Town Center",
    subtitle: "Grocery-Anchored Community Center",
    location: "Denver, CO",
    salePrice: "$42,000,000",
    sqft: "185,000 SF",
    description:
      "A premier grocery-anchored community center sold at a record-setting cap rate for the Denver submarket. Faris Lee's national reach and deep investor relationships produced an aggressive, all-cash buyer within 45 days of launch.",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
    year: "2025",
  },
];

const money = (v) => (v || v === 0 ? `$${Number(v).toLocaleString()}` : "");
const size = (v) => (v || v === 0 ? `${Number(v).toLocaleString()} SF` : "");

const toStory = (s) => ({
  title: s.title,
  subtitle: s.tagline || "",
  location: [s.city, s.state].filter(Boolean).join(", "),
  salePrice: money(s.sale_price),
  sqft: size(s.sqft),
  description: s.excerpt || "",
  image: s.image_url,
  year: s.publish_date ? String(new Date(s.publish_date).getFullYear()) : "",
});

export default function SuccessStories() {
  const [stories, setStories] = useState(fallbackStories);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    api.entities.NewsStory.filter(
      { homepage: true, published: true },
      { sort: "-publish_date", limit: 20 }
    ).then((page) => {
      const items = (Array.isArray(page) ? page : page.items || []).map(toStory).filter((s) => s.title && s.image);
      if (items.length) {
        setStories(items);
        setCurrent(0);
      }
    }).catch(() => {});
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % stories.length);
  const prev = () => setCurrent((prev) => (prev - 1 + stories.length) % stories.length);
  const story = stories[current];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <h2 className="text-neutral-900 text-4xl md:text-5xl font-bold tracking-tight">
            Success Stories
          </h2>
          <div className="w-12 h-0.5 bg-[#C8102E] mx-auto mt-6" />
        </motion.div>

        {/* Story Showcase */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="grid lg:grid-cols-2 gap-0 bg-[#F7F8FA] overflow-hidden shadow-xl"
            >
              {/* Image Side */}
              <div className="relative h-72 lg:h-auto min-h-[400px] overflow-hidden">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                {story.year && (
                  <div className="absolute top-6 left-6">
                    <span className="bg-[#C8102E] text-white text-xs tracking-widest uppercase px-4 py-2 font-semibold">
                      Closed {story.year}
                    </span>
                  </div>
                )}
              </div>

              {/* Content Side */}
              <div className="p-10 lg:p-14 flex flex-col justify-center">
                {story.location && (
                  <div className="flex items-center text-gray-400 text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-1.5 text-[#C8102E]" />
                    {story.location}
                  </div>
                )}

                <h3 className="text-neutral-900 text-3xl md:text-4xl font-bold tracking-tight">
                  {story.title}
                </h3>
                {story.subtitle && (
                  <p className="text-neutral-600 text-sm tracking-wider uppercase mt-1 font-medium">
                    {story.subtitle}
                  </p>
                )}

                {/* Key Metrics */}
                {(story.salePrice || story.sqft) && (
                  <div className="grid grid-cols-2 gap-6 mt-8 py-6 border-y border-gray-200">
                    {story.salePrice && (
                      <div>
                        <div className="text-xs text-gray-400 tracking-wider uppercase">
                          Sale Price
                        </div>
                        <div className="text-2xl font-bold text-neutral-900 mt-1">
                          {story.salePrice}
                        </div>
                      </div>
                    )}
                    {story.sqft && (
                      <div>
                        <div className="text-xs text-gray-400 tracking-wider uppercase">
                          Property Size
                        </div>
                        <div className="text-2xl font-bold text-neutral-900 mt-1">
                          {story.sqft}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {story.description && (
                  <p className="text-gray-500 mt-6 leading-relaxed text-sm">
                    {story.description}
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {stories.length > 1 && (
            <div className="flex items-center justify-between mt-8">
              <div className="flex items-center gap-3">
                {stories.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-1 transition-all duration-300 ${
                      i === current
                        ? "w-10 bg-[#C8102E]"
                        : "w-6 bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="w-12 h-12 border border-gray-300 flex items-center justify-center hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  className="w-12 h-12 border border-gray-300 flex items-center justify-center hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-300"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}