import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { Link } from "react-router-dom";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80";

export default function NewsSection() {
  const { data: stories = [] } = useQuery({
    queryKey: ["news-stories-home"],
    queryFn: () => api.entities.NewsStory.filter({ published: true }, "-publish_date", 3),
  });

  if (stories.length === 0) return null;

  return (
    <section className="py-28 bg-[#F5F5F7]">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-[#C8102E] text-xs tracking-[0.3em] uppercase font-semibold">
            Stay Informed
          </span>
          <h2 className="text-neutral-900 text-4xl md:text-5xl font-bold mt-4 tracking-tight">
            Faris Lee in the News
          </h2>
          <div className="w-12 h-0.5 bg-[#C8102E] mx-auto mt-6" />
        </motion.div>

        {/* News Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image_url || PLACEHOLDER_IMG}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </div>
              <div className="bg-white border border-gray-100 shadow-sm p-6 group-hover:shadow-md transition-all duration-300">
                <div className="flex items-center text-gray-500 text-xs mb-3">
                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                  {formatDate(item.publish_date)}
                </div>
                <h3 className="text-neutral-900 font-bold text-lg leading-tight group-hover:text-[#C8102E] transition-colors duration-300">
                  {item.title}
                </h3>
                {item.excerpt && (
                  <p className="text-gray-600 text-sm mt-3 leading-relaxed line-clamp-3">
                    {item.excerpt}
                  </p>
                )}
                <Link
                  to={`/news/${item.slug || item.id}`}
                  className="inline-flex items-center mt-5 text-[#C8102E] text-xs font-semibold tracking-widest uppercase group/link"
                >
                  Read More
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <Link
            to="/news"
            className="inline-flex items-center px-10 py-4 border border-neutral-900 text-neutral-900 text-sm font-semibold tracking-widest uppercase hover:bg-neutral-900 hover:text-neutral-900 transition-all duration-300"
          >
            All News
            <ArrowRight className="w-4 h-4 ml-3" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}