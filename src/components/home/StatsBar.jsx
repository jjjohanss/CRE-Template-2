import React from "react";
import { motion } from "framer-motion";
import { DollarSign, Building2, MapPin, TrendingUp } from "lucide-react";
import CountUp from "./CountUp";

const stats = [
{ icon: DollarSign, target: 12, prefix: "$", suffix: "B+", label: "Transaction Volume" },
{ icon: Building2, target: 3500, suffix: "+", useComma: true, label: "Properties Sold" },
{ icon: MapPin, target: 48, suffix: "", label: "States Covered" },
{ icon: TrendingUp, target: 30, suffix: "+", label: "Years of Excellence" }];


export default function StatsBar() {
  return (
    <section className="relative z-20 -mt-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white shadow-2xl border-t-2 border-[#C8102E]">
          
          <div className="text-center pt-8 pb-2">
            <h2 className="text-xs tracking-[0.3em] uppercase text-gray-400 font-medium">
              Faris Lee Investments by the numbers
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
            {stats.map((stat, i) =>
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col items-center justify-center py-10 px-6">
              
                <stat.icon className="w-6 h-6 text-[#C8102E] mb-3" />
                <span className="text-3xl md:text-4xl font-bold text-[#0A1628] tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  <CountUp target={stat.target} prefix={stat.prefix} suffix={stat.suffix} useComma={stat.useComma} />
                </span>
                <span className="text-xs tracking-[0.2em] uppercase text-gray-500 mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {stat.label}
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>);

}