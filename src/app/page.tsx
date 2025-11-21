"use client";

import { useState, useEffect } from "react";
import { FloatingParticles } from "@/components/home/FloatingParticles";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { Footer } from "@/components/home/Footer";

export default function Home() {
  const [copiedIP, setCopiedIP] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopyIP = () => {
    navigator.clipboard.writeText("play.hylandia.net");
    setCopiedIP(true);
    setTimeout(() => setCopiedIP(false), 2000);
  };

  return (
    <div className="w-screen overflow-x-hidden bg-neutral">
      {/* Floating particles background */}
      {mounted && <FloatingParticles count={30} />}

      {/* Hero Section */}
      <HeroSection onCopyIP={handleCopyIP} copiedIP={copiedIP} />

      {/* Stats Section */}
      <StatsSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Footer */}
      <Footer onCopyIP={handleCopyIP} copiedIP={copiedIP} />
    </div>
  );
}
