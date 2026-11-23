import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, TrendingUp, Building2, RefreshCw, Store, Download } from "lucide-react";
import Navbar from "../components/home/Navbar";
import FooterSection from "../components/home/FooterSection";

const expertise = [
  {
    icon: <Building2 className="w-7 h-7 text-[#C8102E]" />,
    title: "National Commercial Property Sales & Advisory",
    body: "Faris Lee Investments provides a comprehensive, multidisciplinary approach to commercial property sales, delivering exceptional outcomes for transactions ranging from single assets to massive portfolios. Our team offers over 150 years of collective experience, combining unparalleled capital markets expertise with deep, localized knowledge. By utilizing the X Team Retail Advisors national network, we leverage regional trends and extensive contact networks to provide our clients with absolute certainty of close in every state.",
  },
  {
    icon: <RefreshCw className="w-7 h-7 text-[#C8102E]" />,
    title: "Specialized 1031 Exchange Investment Services",
    body: "We are recognized 1031 exchange specialists, catering to the unique needs of both private and institutional capital. Faris Lee is adept at navigating the technical complexities of the exchange process, frequently employing innovative strategies such as fracturing large assets to access private capital. We focus on identifying high-quality replacement properties that align with long-term investment goals, ensuring a seamless transition and maximum value for 1031 investors.",
  },
  {
    icon: <TrendingUp className="w-7 h-7 text-[#C8102E]" />,
    title: "Single Tenant Net Lease (STNL) Specialists",
    body: "As a recognized leader in the Single Tenant Net Lease (STNL) sector, Faris Lee focuses on executing transactions for premium assets featuring investment-grade tenants with long-term NNN leases in affluent markets. Our expertise covers the full spectrum of STNL advisory, from managing &quot;covered land&quot; plays in world-class trade areas to advising on generational real estate with high intrinsic value.",
  },
  {
    icon: <Store className="w-7 h-7 text-[#C8102E]" />,
    title: "Neighborhood Strip Center & Community Retail Investment Sales",
    body: "Faris Lee has a proven track record in the strategic disposition of neighborhood retail centers and dominant community centers. We analyze every property from every angle, engineering tailored marketing strategies that attract high-net-worth family offices and institutional buyers. Our approach consistently produces exceptional results, often exceeding seller pricing expectations for both newly constructed assets and dominant grocery-anchored centers.",
  },
];

const caseStudies = [
  { name: "Sunset Esplanade", location: "Hillsboro, OR", value: "$65,900,000", desc: "Faris Lee successfully closed the sale of this dominant, 371,619 SF grocery-anchored community center to a pension fund, significantly exceeding the seller's pricing expectations." },
  { name: "Whole Foods Market", location: "New Orleans, LA", value: "$31,418,000", desc: "We executed the sale of this premium single-tenant asset, featuring an investment-grade tenant and a long-term NNN lease, to a New York-based family office in a 1031 exchange." },
  { name: "Algiers Plaza", location: "New Orleans, LA", value: "$35,000,000", desc: "This 288,000 SF dominant grocery-anchored center features essential anchors and a diverse tenant mix, ensuring resilience against e-commerce challenges." },
  { name: "Plaza Pacifica", location: "San Clemente, CA", value: "$21,000,000", desc: "A premier neighborhood retail center where Faris Lee generated multiple competitive offers, resulting in a closing in less than 60 days to a high-net-worth family office buyer." },
  { name: "Ross Dress For Less", location: "Pasadena, CA", value: "$28,500,000", desc: "We secured the sale of this generational Lake Avenue asset, positioned as an intrinsic real estate and covered land play with a recent 10-year lease extension." },
  { name: "Princeton Plaza", location: "Dallas, TX", value: null, desc: "Part of our recent deal velocity, we successfully secured this newly constructed, 100% occupied high-growth asset for a first-time commercial investor." },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }) };

export default function Expertise() {
  return (
    <div className="min-h-screen bg-[#F7F8FA]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <div className="bg-[#F5F5F7] pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
            className="text-[#C8102E] text-xs tracking-[0.3em] uppercase font-semibold"
          >
            Our Expertise
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-neutral-900 text-4xl md:text-5xl font-bold mt-4 leading-tight"
          >
            Expert Retail Real Estate<br />Advisory &amp; Sales
          </motion.h1>
          <div className="w-12 h-0.5 bg-[#C8102E] mx-auto mt-6" />
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="text-neutral-500 mt-6 max-w-3xl mx-auto text-lg font-light leading-relaxed"
          >
            Faris Lee Investments is a nationally recognized leader in the retail investment sector, dedicated to <span className="text-neutral-700 font-medium">"Moving Markets &amp; Maximizing Value"</span> for our clients through a sophisticated, multidisciplinary approach. For over 29 years, we have specialized exclusively in the uniquely complex, tenant-driven retail real estate market, leveraging creative insight and collaborative teamwork to yield superior results. With a track record spanning billions in closed transaction volume and the industry's highest closing percentage, we provide unmatched strategy and execution across 40 major U.S. and Canadian markets.
          </motion.p>
        </div>
      </div>

      {/* Lines of Expertise */}
      <div className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <span className="text-[#C8102E] text-xs tracking-[0.3em] uppercase font-semibold">What We Do</span>
          <h2 className="text-neutral-900 text-3xl md:text-4xl font-bold mt-3">Our Lines of Expertise Across The U.S.</h2>
          <div className="w-10 h-0.5 bg-[#C8102E] mx-auto mt-4" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {expertise.map((item, i) => (
            <motion.div
              key={item.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-[#F7F8FA] flex items-center justify-center mb-5">
                {item.icon}
              </div>
              <h3 className="text-neutral-900 text-lg font-bold mb-3">{item.title}</h3>
              <div className="w-6 h-0.5 bg-[#C8102E] mb-4" />
              <p className="text-gray-500 leading-relaxed text-sm">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Case Studies */}
      <div className="bg-[#F5F5F7] py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#C8102E] text-xs tracking-[0.3em] uppercase font-semibold">Proven Track Record</span>
            <h2 className="text-neutral-900 text-3xl md:text-4xl font-bold mt-3">Retail Investment Success Stories</h2>
            <div className="w-10 h-0.5 bg-[#C8102E] mx-auto mt-4" />
            <p className="text-neutral-500 mt-5 max-w-2xl mx-auto text-sm leading-relaxed">
              Our results-oriented philosophy is demonstrated through our consistent deal velocity and ability to move institutional-scale assets.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudies.map((c, i) => (
              <motion.div
                key={c.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle className="w-5 h-5 text-[#C8102E] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-neutral-900 font-bold text-base">{c.name}</h4>
                    <p className="text-gray-400 text-xs mt-0.5">{c.location}</p>
                  </div>
                </div>
                {c.value && (
                  <p className="text-[#C8102E] font-bold text-xl mb-3">{c.value}</p>
                )}
                <p className="text-gray-600 text-sm leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-[#C8102E] text-xs tracking-[0.3em] uppercase font-semibold">Get Started</span>
          <h2 className="text-neutral-900 text-3xl md:text-4xl font-bold mt-3">Ready to move your market?</h2>
          <div className="w-10 h-0.5 bg-[#C8102E] mx-auto mt-4" />
          <p className="text-gray-500 mt-5 text-lg leading-relaxed">
            Contact Faris Lee Investments to leverage our integrated financial and marketing processes for your next retail transaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <a
              href="https://farislee.com/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#C8102E] text-white text-sm font-semibold tracking-widest uppercase hover:bg-[#a00d24] transition-colors"
            >
              Contact Us <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              to="/listings"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-neutral-900 text-neutral-900 text-sm font-semibold tracking-widest uppercase hover:bg-neutral-900 hover:text-white transition-colors"
            >
              View Listings <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* X Team — image + text side by side (reversed) */}
      <div className="bg-[#F7F8FA] py-20 px-6">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="rounded-2xl overflow-hidden shadow-lg order-2 md:order-1"
          >
            <img
              src="https://pceiqkjwblulxhwejmxp.supabase.co/storage/v1/object/public/uploads/migrated/67ffe364_1e0a51088_cc7dfea929f847cfc31c87609cc5a7fa_Collab-Team-2-768-c-100.jpg"
              alt="Faris Lee collaboration"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="order-1 md:order-2"
          >
            <span className="text-[#C8102E] text-xs tracking-[0.3em] uppercase font-semibold">National Network</span>
            <h2 className="text-neutral-900 text-3xl font-bold mt-3 mb-2">X Team Retail Advisors</h2>
            <div className="w-8 h-0.5 bg-[#C8102E] mb-6" />
            <p className="text-gray-500 leading-relaxed mb-4">
              As the Capital Markets arm of the X Team Retail Advisors national platform of experienced retail leasing and tenant representation experts, Faris Lee is able to utilize localized knowledge in markets across the country, providing a deeper insight into regional trends.
            </p>
            <p className="text-gray-500 leading-relaxed mb-4">
              We do all this to provide our clients a higher level of service, maximizing the value of each transaction.
            </p>
            <div className="bg-white rounded-xl border border-gray-100 p-6 mt-6">
              <p className="text-xs text-[#C8102E] tracking-[0.2em] uppercase font-semibold mb-2">More on X Team</p>
              <p className="text-gray-500 text-sm leading-relaxed">
                X Team Retail Advisors is an integrated, retail specialized platform of tenured real estate professionals that offers coverage in 43 markets across the United States and Canada. X Team partners specialize in Tenant Representation &amp; Landlord Leasing, serving as a collaborative resource through sharing of relationships and industry insights — providing clients with a unique combination of national scope and local market expertise.
              </p>
              <a
                href="https://xteamretail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-[#C8102E] text-xs font-semibold tracking-widest uppercase hover:underline"
              >
                Visit X Team <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Corporate Book CTA */}
      <div className="bg-[#F5F5F7] py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-[#C8102E] text-xs tracking-[0.3em] uppercase font-semibold">Resources</span>
          <h2 className="text-neutral-900 text-2xl md:text-3xl font-bold mt-3">Download Our Corporate Book</h2>
          <div className="w-10 h-0.5 bg-[#C8102E] mx-auto mt-4 mb-6" />
          <p className="text-neutral-500 text-sm mb-8">
            Learn more about Faris Lee Investments — our people, our process, and our proven track record in retail real estate.
          </p>
          <a
            href="https://pceiqkjwblulxhwejmxp.supabase.co/storage/v1/object/public/uploads/migrated/de5f05b5_c8eb63587_CorpBookFLI_2026-27.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#C8102E] hover:bg-[#a00d24] text-white text-sm font-semibold tracking-widest uppercase transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Corporate Book
          </a>
        </div>
      </div>

      <FooterSection />
    </div>
  );
}