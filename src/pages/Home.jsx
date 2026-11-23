import React from "react";
import HeroSection from "../components/home/HeroSection";
import StatsBar from "../components/home/StatsBar";
import AboutSection from "../components/home/AboutSection";
import FeaturedListings from "../components/home/FeaturedListings";
import BrokerTeam from "../components/home/BrokerTeam";
import SuccessStories from "../components/home/SuccessStories";
import NewsSection from "../components/home/NewsSection";
import FooterSection from "../components/home/FooterSection";

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      <HeroSection />
      <StatsBar />
      <FeaturedListings />
      <AboutSection />
      <BrokerTeam />
      <SuccessStories />
      <NewsSection />
      <FooterSection />
    </div>
  );
}