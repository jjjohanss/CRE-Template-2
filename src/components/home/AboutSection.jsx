import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Users, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const pillars = [
{
  icon: Shield,
  title: "Market Expertise",
  desc: "30+ years of knowledge across multiple product types and markets."
},
{
  icon: Users,
  title: "Collaborative Approach",
  desc: "Multidisciplinary teams delivering custom strategies for every client."
},
{
  icon: BarChart3,
  title: "Superior Results",
  desc: "Consistently maximizing value through creative, data-driven insight."
}];


export default function AboutSection() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}>
            
            <span className="text-[#C8102E] text-xs tracking-[0.3em] uppercase font-semibold">
              About Faris Lee
            </span>
            <h2 className="text-neutral-900 text-4xl md:text-5xl font-bold mt-4 tracking-tight leading-tight">
              Moving Markets &<br />
              <em className="italic">Maximizing Value</em>
            </h2>
            <div className="w-12 h-0.5 bg-[#C8102E] mt-6" />
            <p className="text-gray-500 mt-8 text-lg leading-relaxed font-light">
              Faris Lee Investments maximizes value with sound investment advice for
              retail property owners. To us, real estate is never a commodity. We
              analyze each property from every angle, applying our collective
              experience to produce exceptional results.
            </p>
            <p className="text-gray-500 mt-4 text-lg leading-relaxed font-light">
              Our retail advisory and brokerage services are multidisciplinary,
              allowing us to devise custom strategies and deliver results that
              exceed expectations in any market condition.
            </p>
            <Link
              to="/expertise"
              className="inline-flex items-center mt-8 px-7 py-3.5 bg-[#C8102E] text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#a00d24] transition-colors duration-300 group">
              
              Learn More About Us
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Right - Pillars */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-6">
            
            {pillars.map((pillar, i) =>
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="flex gap-6 p-6 bg-white hover:bg-white group transition-all duration-500 border border-gray-200 hover:border-gray-300 hover:shadow-lg">
              
                <div className="w-14 h-14 flex-shrink-0 bg-white flex items-center justify-center shadow-sm group-hover:bg-[#C8102E]/10 transition-colors duration-500">
                  <pillar.icon className="w-6 h-6 text-[#C8102E] transition-colors duration-500" />
                </div>
                <div>
                  <h3 className="text-neutral-900 group-hover:text-neutral-900 font-bold text-lg transition-colors duration-500">
                    {pillar.title}
                  </h3>
                  <p className="text-gray-500 group-hover:text-gray-600 text-sm mt-1 leading-relaxed transition-colors duration-500">
                    {pillar.desc}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>);

}