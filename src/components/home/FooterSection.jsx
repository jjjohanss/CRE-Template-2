import React, { useState } from "react";
import { Phone, Mail, MapPin, Newspaper } from "lucide-react";
import { Link } from "react-router-dom";
import SocialLinks from "./SocialLinks";
import { servicePages, servicePath } from "@/data/servicePages";
import EmailSignupModal from "../listing/EmailSignupModal";

export default function FooterSection() {
  const [showSignup, setShowSignup] = useState(false);
  return (
    <footer className="bg-[#F5F5F7] border-t border-gray-200">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-neutral-900 text-xl font-bold tracking-tight">
              FARIS LEE
            </h3>
            <p className="text-[#C8102E] text-xs tracking-[0.2em] uppercase mt-1 font-medium">
              Investments
            </p>
            <p className="text-gray-500 text-sm mt-4 leading-relaxed">
              Setting the standard in retail investments since 1990.
            </p>
            <div className="mt-5">
              <SocialLinks variant="footer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-neutral-900 text-xs tracking-[0.2em] uppercase font-semibold mb-6">
              Navigation
            </h4>
            <ul className="space-y-3">
              {["Expertise", "Listings", "Team", "News"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href={`/${link.toLowerCase()}`}
                      className="text-gray-500 text-sm hover:text-[#C8102E] transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
              <li>
                <Link to="/team" className="text-gray-500 text-sm hover:text-[#C8102E] transition-colors duration-300">Contact</Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-500 text-sm hover:text-[#C8102E] transition-colors duration-300">Careers</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-neutral-900 text-xs tracking-[0.2em] uppercase font-semibold mb-6">
              Services
            </h4>
            <ul className="space-y-3">
              {servicePages.map((service) => (
                <li key={service.slug}>
                  <Link
                    to={servicePath(service.slug)}
                    className="text-gray-500 text-sm hover:text-[#C8102E] transition-colors duration-300"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-neutral-900 text-xs tracking-[0.2em] uppercase font-semibold mb-6">
              Contact
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C8102E] mt-0.5 flex-shrink-0" />
                <p className="text-gray-500 text-sm leading-relaxed">
                  18101 Von Karman Ave, Suite 1100
                  <br />
                  Irvine, CA 92612
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C8102E] flex-shrink-0" />
                <a
                  href="tel:949-221-1800"
                  className="text-gray-500 text-sm hover:text-[#C8102E] transition-colors"
                >
                  (949) 221-1800
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C8102E] flex-shrink-0" />
                <a
                  href="mailto:info@farislee.com"
                  className="text-gray-500 text-sm hover:text-[#C8102E] transition-colors"
                >
                  info@farislee.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Newspaper className="w-4 h-4 text-[#C8102E] flex-shrink-0" />
                <button
                  type="button"
                  onClick={() => setShowSignup(true)}
                  className="text-gray-500 text-sm hover:text-[#C8102E] transition-colors text-left"
                >
                  Subscribe to Property Updates
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-14 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs tracking-wider">
            © {new Date().getFullYear()} Faris Lee Investments. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="text-gray-600 text-xs hover:text-[#C8102E] transition-colors">
              Privacy Policy
            </Link>
            <a href="https://farislee.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 text-xs hover:text-[#C8102E] transition-colors">
              Terms of Use
            </a>
          </div>
        </div>
      </div>
      {showSignup && <EmailSignupModal onClose={() => setShowSignup(false)} />}
    </footer>
  );
}