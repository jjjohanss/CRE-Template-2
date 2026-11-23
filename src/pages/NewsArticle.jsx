import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { createPageUrl } from "@/utils";
import Navbar from "../components/home/Navbar";
import FooterSection from "../components/home/FooterSection";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default function NewsArticle() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Look the story up by its web address; older links that use the story's ID
  // (from before every story had an address) still work.
  const { data: story, isLoading, isError, refetch } = useQuery({
    queryKey: ["news-story", slug],
    queryFn: async () => {
      const bySlug = await api.entities.NewsStory.filter({ slug, published: true });
      if (bySlug.length) return bySlug[0];
      const byId = await api.entities.NewsStory.filter({ id: slug, published: true });
      return byId[0] ?? null;
    },
    enabled: !!slug,
  });

  // Found by ID: switch the address bar to the story's proper address.
  useEffect(() => {
    if (story?.slug && story.slug !== slug) navigate(`/news/${story.slug}`, { replace: true });
  }, [story, slug, navigate]);

  return (
    <div className="min-h-screen bg-[#F7F8FA]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <div className="bg-[#0A1628] pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          {story?.category && (
            <span className="text-[#C8102E] text-xs tracking-[0.3em] uppercase font-semibold">
              {story.category}
            </span>
          )}
          <h1 className="text-white text-3xl md:text-4xl font-bold mt-4 tracking-tight leading-tight">
            {story?.title || "News & Insights"}
          </h1>
          {story?.publish_date && (
            <span className="flex items-center justify-center text-white/60 text-sm gap-1 mt-5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(story.publish_date)}
            </span>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-[#C8102E] text-sm font-semibold hover:text-[#a00d24] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to News
        </Link>

        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#C8102E] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && isError && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">This article couldn't be loaded.</p>
            <button onClick={() => refetch()} className="text-[#C8102E] underline">Try again</button>
          </div>
        )}

        {!isLoading && !isError && !story && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">Article not found.</p>
            <Link to="/news" className="text-[#C8102E] underline">Back to News</Link>
          </div>
        )}

        {!isLoading && story && (
          <article>
            {story.image_url && (
              <div className="overflow-hidden rounded-lg mb-8 shadow-md">
                <img
                  src={story.image_url}
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {story.excerpt && (
              <p className="text-gray-500 text-lg leading-relaxed mb-8 font-light">
                {story.excerpt}
              </p>
            )}
            {story.body && (
              <div
                className="text-gray-600 leading-relaxed prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: story.body }}
              />
            )}
          </article>
        )}
      </div>

      <FooterSection />
    </div>
  );
}