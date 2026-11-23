import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import FooterSection from "../components/home/FooterSection";
import XWidget from "../components/home/XWidget";

const SMALL_PAGE_SIZE = 9; // articles per page in the grid (after the 2 featured)

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

function articleUrl(story) {
  return `/news/${story.slug || story.id}`;
}

function FeaturedArticle({ story, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
    >
      <Link to={articleUrl(story)} className="flex flex-col flex-1">
        {story.image_url && (
          <div className="overflow-hidden" style={{ height: "260px" }}>
            <img
              src={story.image_url}
              alt={story.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        <div className="p-7 flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-3">
            {story.category && (
              <span className="text-[#C8102E] text-xs tracking-[0.2em] uppercase font-semibold">
                {story.category}
              </span>
            )}
            <span className="flex items-center text-gray-400 text-xs gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(story.publish_date)}
            </span>
          </div>
          <h3 className="text-[#0A1628] text-2xl font-bold leading-snug mb-3">
            {story.title}
          </h3>
          {story.excerpt && (
            <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">
              {story.excerpt}
            </p>
          )}
          <span className="text-[#C8102E] text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all w-fit mt-auto">
            Read More
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

function SmallArticle({ story, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col"
    >
      <Link to={articleUrl(story)} className="flex flex-col flex-1">
        {story.image_url && (
          <div className="overflow-hidden" style={{ height: "160px" }}>
            <img
              src={story.image_url}
              alt={story.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {story.category && (
              <span className="text-[#C8102E] text-xs tracking-[0.15em] uppercase font-semibold">
                {story.category}
              </span>
            )}
            <span className="flex items-center text-gray-400 text-xs gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(story.publish_date)}
            </span>
          </div>
          <h3 className="text-[#0A1628] text-base font-bold leading-snug mb-2 line-clamp-3">
            {story.title}
          </h3>
          {story.excerpt && (
            <p className="text-gray-500 text-xs leading-relaxed mb-3 flex-1 line-clamp-3">
              {story.excerpt}
            </p>
          )}
          <span className="text-[#C8102E] text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all w-fit mt-auto">
            Read More
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

export default function News() {
  const [page, setPage] = useState(1);

  const { data: stories = [], isLoading } = useQuery({
    queryKey: ["news-stories-public"],
    queryFn: () => api.entities.NewsStory.filter({ published: true }, "-publish_date", 200),
  });

  const featured = stories.slice(0, 2);
  const rest = stories.slice(2);
  const totalPages = Math.ceil(rest.length / SMALL_PAGE_SIZE);
  const pagedRest = rest.slice((page - 1) * SMALL_PAGE_SIZE, page * SMALL_PAGE_SIZE);

  const goToPage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <div className="bg-[#0A1628] pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[#C8102E] text-xs tracking-[0.3em] uppercase font-semibold">
            Latest Updates
          </span>
          <h1 className="text-white text-4xl md:text-5xl font-bold mt-4 tracking-tight">
            News & Insights
          </h1>
          <div className="w-12 h-0.5 bg-[#C8102E] mx-auto mt-6" />
          <p className="text-white/60 mt-6 text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Stay current with market trends, investment opportunities, and company announcements from Faris Lee Investments.
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-16">
        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#C8102E] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && stories.length === 0 && (
          <p className="text-center text-gray-400 py-16 text-lg">No news stories published yet.</p>
        )}

        {/* Featured Articles — 2 large side by side */}
        {!isLoading && featured.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-[#0A1628] text-sm tracking-[0.25em] uppercase font-semibold">Featured</h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className={`grid gap-8 ${featured.length === 1 ? "grid-cols-1 max-w-2xl" : "grid-cols-1 md:grid-cols-2"}`}>
              {featured.map((story, i) => (
                <FeaturedArticle
                  key={story.id}
                  story={story}
                  index={i}
                />
              ))}
            </div>
          </div>
        )}

        {/* Remaining Articles — smaller grid */}
        {!isLoading && pagedRest.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-[#0A1628] text-sm tracking-[0.25em] uppercase font-semibold">More Stories</h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pagedRest.map((story, i) => (
                <SmallArticle
                  key={story.id}
                  story={story}
                  index={i}
                />
              ))}
            </div>
          </div>
        )}

        {/* X.com timeline widget */}
        <XWidget />

        {/* Pagination for "More Stories" */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-16">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="flex items-center gap-1 px-4 py-2 border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`w-9 h-9 text-sm font-semibold border transition-colors ${
                  p === page
                    ? "bg-[#C8102E] border-[#C8102E] text-white"
                    : "border-gray-300 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-4 py-2 border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <FooterSection />
    </div>
  );
}