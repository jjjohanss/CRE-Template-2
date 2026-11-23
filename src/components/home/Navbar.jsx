import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import RatesPopup from "./RatesPopup";

const navLinks = [
  { label: "Team", href: "/Team", internal: true },
  { label: "Expertise", href: "/expertise", internal: true },
  { label: "Listings", href: "/listings", internal: true },
  { label: "News", href: "/news", internal: true },

  { label: "Today's Rates", popup: "rates" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showRates, setShowRates] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500" style={{ background: "linear-gradient(to bottom, #F0F0F0 75%, transparent 100%)" }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 flex-shrink-0"
          >
            <img
              src="https://pceiqkjwblulxhwejmxp.supabase.co/storage/v1/object/public/uploads/migrated/5a1dc198_076d4f48a_FLI-Logo-CMYK.webp"
              alt="Faris Lee Investments"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.internal ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-[#0A1628]/80 hover:text-[#C8102E] text-xs tracking-[0.15em] uppercase font-medium px-3 py-2 transition-colors duration-200"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {link.label}
                </Link>
              ) : link.popup ? (
                <button
                  key={link.label}
                  onClick={() => setShowRates(true)}
                  className="text-[#0A1628]/80 hover:text-[#C8102E] text-xs tracking-[0.15em] uppercase font-medium px-3 py-2 transition-colors duration-200"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {link.label}
                </button>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0A1628]/80 hover:text-[#C8102E] text-xs tracking-[0.15em] uppercase font-medium px-3 py-2 transition-colors duration-200"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {link.label}
                </a>
              )
            )}
          </nav>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-[#0A1628] p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white/90 border-t border-black/10 px-6 py-4">
          {navLinks.map((link) =>
            link.internal ? (
              <Link
                key={link.label}
                to={link.href}
                className="block text-[#0A1628]/80 hover:text-[#C8102E] text-xs tracking-[0.15em] uppercase font-medium py-3 border-b border-black/5 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ) : link.popup ? (
              <button
                key={link.label}
                onClick={() => { setMobileOpen(false); setShowRates(true); }}
                className="block text-left w-full text-[#0A1628]/80 hover:text-[#C8102E] text-xs tracking-[0.15em] uppercase font-medium py-3 border-b border-black/5 transition-colors"
              >
                {link.label}
              </button>
            ) : (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[#0A1628]/80 hover:text-[#C8102E] text-xs tracking-[0.15em] uppercase font-medium py-3 border-b border-black/5 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            )
          )}
        </div>
      )}
      {showRates && <RatesPopup onClose={() => setShowRates(false)} />}
    </header>
  );
}