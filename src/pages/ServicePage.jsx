import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listingKeys } from "@/lib/queries";
import { ChevronRight, Phone, Mail, ArrowRight, Plus } from "lucide-react";
import { api } from "@/api/client";
import Navbar from "../components/home/Navbar";
import FooterSection from "../components/home/FooterSection";
import ListingRows from "../components/listing/ListingRows";
import PageNotFound from "@/lib/PageNotFound";
import { useDocumentHead } from "@/hooks/useDocumentHead";
import LoadError from "@/components/LoadError";
import {
  findServicePage, servicePages, servicePath, parseLinks, serviceJsonLd,
  SITE_ORIGIN, PHONE, PHONE_HREF, EMAIL,
} from "@/data/servicePages";

function RichText({ text }) {
  return parseLinks(text).map((part, i) =>
    part.href ? (
      <Link key={i} to={part.href} className="text-[#C8102E] font-medium underline underline-offset-2 decoration-[#C8102E]/30 hover:decoration-[#C8102E]">
        {part.text}
      </Link>
    ) : (
      <React.Fragment key={i}>{part.text}</React.Fragment>
    )
  );
}

function ServiceListings({ page }) {
  const { data: listings = [], isLoading, isError, refetch } = useQuery({
    queryKey: listingKeys.service(page.slug),
    queryFn: () => api.entities.Listing.filter({ status: "active", property_type: page.propertyTypes }, "-price", 200),
  });

  return (
    <section className="py-20 bg-[#F7F8FA]" aria-labelledby="listings-heading">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-[#C8102E] text-xs tracking-[0.3em] uppercase font-semibold">Investment Opportunities</span>
          <h2 id="listings-heading" className="text-neutral-900 text-3xl md:text-4xl font-bold mt-3 tracking-tight">
            {page.listingsHeading}
          </h2>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#C8102E] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isError ? (
          <LoadError onRetry={refetch} className="bg-white border border-gray-200" />
        ) : listings.length === 0 ? (
          <div className="bg-white border border-gray-200 px-6 py-12 text-center">
            <p className="text-gray-500">{page.emptyListings}</p>
            <p className="text-gray-500 text-sm mt-2">
              New properties come to market regularly. <Link to="/Team" className="text-[#C8102E] font-semibold hover:underline">Contact our team</Link> to hear about opportunities first.
            </p>
          </div>
        ) : (
          <ListingRows listings={listings} />
        )}
        <div className="text-center mt-10">
          <Link
            to="/listings"
            className="inline-flex items-center px-10 py-4 bg-neutral-900 text-white text-sm font-semibold tracking-widest uppercase hover:bg-neutral-700 transition-colors duration-300"
          >
            View All Listings
            <ArrowRight className="w-4 h-4 ml-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function ServicePage() {
  const { slug } = useParams();
  const page = findServicePage(slug);
  const jsonLd = useMemo(() => (page ? serviceJsonLd(page) : null), [page]);

  useDocumentHead({
    title: page?.seoTitle ?? "Page Not Found | Faris Lee Investments",
    description: page?.metaDescription,
    canonical: page ? SITE_ORIGIN + servicePath(page.slug) : undefined,
    jsonLd,
  });

  if (!page) return <PageNotFound />;

  const others = servicePages.filter((p) => p.slug !== page.slug);

  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <header className="bg-[#F5F5F7] pt-32 pb-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs tracking-widest uppercase text-gray-400 mb-8">
            <Link to="/" className="hover:text-[#C8102E] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/expertise" className="hover:text-[#C8102E] transition-colors">Services</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-600" aria-current="page">{page.title}</span>
          </nav>
          <div className="w-16 h-0.5 bg-[#C8102E] mb-6" />
          <span className="text-[#C8102E] text-xs tracking-[0.3em] uppercase font-semibold">{page.eyebrow}</span>
          <h1 className="text-neutral-900 text-4xl md:text-6xl font-bold mt-4 tracking-tight max-w-4xl">{page.title}</h1>
          <p className="text-neutral-600 mt-6 max-w-3xl text-lg font-light leading-relaxed">{page.intro}</p>
        </div>
      </header>

      {/* Article + sidebar */}
      <div className="max-w-[1200px] mx-auto px-6 py-16 grid lg:grid-cols-3 gap-12">
        <article className="lg:col-span-2 space-y-12">
          {page.sections.map((s) => (
            <section key={s.heading}>
              <div className="w-12 h-0.5 bg-[#C8102E] mb-4" />
              <h2 className="text-neutral-900 text-2xl md:text-3xl font-bold leading-tight">{s.heading}</h2>
              <div className="mt-5 space-y-5">
                {s.paragraphs.map((p, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed text-[1.02rem]"><RichText text={p} /></p>
                ))}
              </div>
            </section>
          ))}
          {page.disclaimer && (
            <p className="text-xs text-gray-400 border-t border-gray-100 pt-6 leading-relaxed">{page.disclaimer}</p>
          )}
        </article>

        <aside className="space-y-6 lg:sticky lg:top-28 self-start">
          <div className="bg-neutral-900 text-white p-7">
            <h2 className="text-lg font-bold">Talk to an Advisor</h2>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              Buying or selling? Get a confidential consultation from our retail investment specialists.
            </p>
            <a href={PHONE_HREF} className="flex items-center gap-3 mt-5 text-sm hover:text-[#ff8a9b] transition-colors">
              <Phone className="w-4 h-4 text-[#C8102E]" /> {PHONE}
            </a>
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-3 mt-3 text-sm hover:text-[#ff8a9b] transition-colors">
              <Mail className="w-4 h-4 text-[#C8102E]" /> {EMAIL}
            </a>
            <Link
              to="/Team"
              className="mt-6 inline-flex items-center px-5 py-3 bg-[#C8102E] text-white text-xs font-semibold tracking-widest uppercase hover:bg-[#a00d24] transition-colors"
            >
              Meet Our Team <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </Link>
          </div>
          <nav aria-labelledby="other-services" className="border border-gray-200 p-7">
            <h2 id="other-services" className="text-neutral-900 text-xs tracking-[0.2em] uppercase font-semibold mb-4">Other Services</h2>
            <ul className="space-y-3">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link to={servicePath(o.slug)} className="text-gray-600 text-sm hover:text-[#C8102E] transition-colors">{o.title}</Link>
                </li>
              ))}
              <li>
                <Link to="/expertise" className="text-gray-600 text-sm hover:text-[#C8102E] transition-colors">Our Expertise</Link>
              </li>
            </ul>
          </nav>
        </aside>
      </div>

      {page.propertyTypes.length > 0 && <ServiceListings page={page} />}

      {/* FAQs */}
      <section className="py-20" aria-labelledby="faq-heading">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-[#C8102E] text-xs tracking-[0.3em] uppercase font-semibold">FAQ</span>
            <h2 id="faq-heading" className="text-neutral-900 text-3xl md:text-4xl font-bold mt-3 tracking-tight">
              {page.title}: Frequently Asked Questions
            </h2>
          </div>
          <div className="divide-y divide-gray-200 border-y border-gray-200">
            {page.faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                  <h3 className="text-neutral-900 font-semibold text-base md:text-lg">{f.q}</h3>
                  <Plus className="w-5 h-5 text-[#C8102E] flex-shrink-0 transition-transform group-open:rotate-45" />
                </summary>
                <p className="text-gray-600 leading-relaxed mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
