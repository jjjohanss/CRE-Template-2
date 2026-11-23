import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import EmailSignupModal from "../listing/EmailSignupModal";

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const [showSignup, setShowSignup] = useState(false);
  const [videoSrc] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768 ? "/videos/hero-480.mp4" : "/videos/hero-720.mp4"
  );
  const videoRef = useRef(null);

  // React doesn't write `muted` into the HTML, and Safari/iOS (and some Chrome setups)
  // only allow autoplay for videos muted *in the HTML*. Set it directly, then start playback.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();
    v.addEventListener("canplay", tryPlay, { once: true });
    // If the browser still refused (e.g. power-saving mode), start on the first tap or scroll.
    const onInteract = () => { if (v.paused) tryPlay(); };
    window.addEventListener("pointerdown", onInteract, { once: true });
    window.addEventListener("scroll", onInteract, { once: true, passive: true });
    return () => {
      v.removeEventListener("canplay", tryPlay);
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("scroll", onInteract);
    };
  }, [videoSrc]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Navbar />
      {/* Video Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Self-hosted, muted, looping background video (public/videos).
            Phones get a lighter 480p file; the poster shows while it loads.
            It plays for everyone, including devices set to reduce motion. */}
        <video
          ref={videoRef}
          key={videoSrc}
          src={videoSrc}
          poster="/videos/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Light frosted glass overlay */}
        <div className="absolute inset-0" style={{ background: "rgba(249,249,249,0.7)", backdropFilter: "blur(2px)" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl">
          
          {/* Red accent line */}
          <div className="w-16 h-0.5 bg-[#C8102E] mx-auto mb-8" />

          <p className="text-neutral-500 tracking-[0.3em] uppercase text-xs md:text-sm mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
            Faris Lee Investments
          </p>

          <h1 className="text-neutral-900 text-4xl md:text-6xl lg:text-7xl leading-tight font-bold">
            Setting the Standard
            <br />
            <em className="text-[#C8102E] not-italic" style={{ fontStyle: "italic" }}>in Retail Investments</em>
          </h1>

          <p className="text-neutral-900 text-lg md:text-xl mt-8 max-w-2xl mx-auto leading-relaxed">
            Relying on market expertise, collaborative teamwork, and creative
            insight to yield superior results for our clients nationwide.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <a
              href="/listings"
              className="px-12 py-5 bg-[#C8102E] text-white text-base font-semibold tracking-widest uppercase hover:bg-[#a00d24] transition-all duration-300 rounded-2xl">VIEW INVESTMENTS


            </a>
            <button
              onClick={() => setShowSignup(true)}
              className="px-12 py-5 border border-neutral-400 text-base font-semibold tracking-widest uppercase hover:bg-neutral-100 transition-all duration-300 bg-white/80 text-neutral-900 rounded-2xl">
              
              Sign Up for Updates
            </button>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-neutral-900/50"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}>
          
          <span className="text-xs tracking-[0.3em] uppercase mb-2">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </div>
      {showSignup && <EmailSignupModal onClose={() => setShowSignup(false)} />}
    </section>);

}