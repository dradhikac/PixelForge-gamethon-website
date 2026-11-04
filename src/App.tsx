import { useEffect, useState, useCallback } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Events from "./components/Events";
import Challenge from "./components/Challenge";
import Prizes from "./components/Prizes";
import Schedule from "./components/Schedule";
import Rules from "./components/Rules";
import FAQ from "./components/FAQ";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import Registration from "./components/Registration";
import Admin from "./components/Admin";
import Brochure from "./components/Brochure";
import Rulebook from "./components/Rulebook";
import PixelForgeIntro from "./components/PixelForgeIntro";

function App() {
  const path =
    window.location.pathname.replace(/\/+$/, "") || "/";

  // Check if intro should be shown on homepage
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    if (path !== "/") return false;
    if (typeof window !== "undefined") {
      const hasSeen = window.sessionStorage.getItem("pixelforge_intro_seen");
      if (hasSeen === "true") return false;
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return false;
    }
    return true;
  });

  // Listen for manual replay requests
  useEffect(() => {
    const handleReplay = () => {
      setShowIntro(true);
    };

    window.addEventListener("replay-pixelforge-intro", handleReplay);
    return () => {
      window.removeEventListener("replay-pixelforge-intro", handleReplay);
    };
  }, []);

  const scrollToSectionId = useCallback((sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const navbarHeight = 80;
      const sectionPosition =
        section.getBoundingClientRect().top +
        window.scrollY -
        navbarHeight;

      window.scrollTo({
        top: sectionPosition,
        behavior: "smooth",
      });
    }
  }, []);

  const handleIntroComplete = useCallback(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("pixelforge_intro_seen", "true");
    }
    setShowIntro(false);

    // If an initial hash exists in the URL, scroll to it now that the intro has cleared
    const hash = window.location.hash;
    if (hash) {
      const sectionId = decodeURIComponent(hash.substring(1));
      setTimeout(() => scrollToSectionId(sectionId), 300);
    }
  }, [scrollToSectionId]);

  useEffect(() => {
    // Only handle hash navigation on the homepage if intro is not blocking
    if (path !== "/" || showIntro) {
      return;
    }

    const hash = window.location.hash;

    if (!hash) {
      return;
    }

    // Remove the "#" from the URL hash
    const sectionId = decodeURIComponent(hash.substring(1));

    const timer = window.setTimeout(() => {
      scrollToSectionId(sectionId);
    }, 500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [path, showIntro, scrollToSectionId]);

  if (path === "/admin") {
    return (
      <div className="app">
        <Navbar />
        <Admin />
      </div>
    );
  }

  if (path === "/brochure") {
    return (
      <div className="app">
        <Navbar />
        <Brochure />
      </div>
    );
  }

  if (path === "/rulebook") {
    return (
      <div className="app">
        <Navbar />
        <Rulebook />
      </div>
    );
  }

  if (path === "/registration" || path === "/register") {
    return (
      <div className="app">
        <Navbar />
        <Registration />
      </div>
    );
  }

  return (
    <div className="app">
      {showIntro ? (
        <PixelForgeIntro
          onComplete={handleIntroComplete}
          onNavigateSection={scrollToSectionId}
        />
      ) : (
        <button
          type="button"
          className="pixelforge-replay-pill"
          onClick={() => setShowIntro(true)}
          title="Watch the Pixel Forge cinematic entrance"
          aria-label="Replay intro cinematic"
        >
          <span style={{ color: "#ffd000" }}>✦</span> Replay Intro
        </button>
      )}

      <Navbar />

      <main>
        <Hero />
        <About />
        <Events />
        <Challenge />
        <Prizes />
        <Schedule />
        <Rules />
        <FAQ />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}

export default App;
