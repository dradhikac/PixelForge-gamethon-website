import { useState, useEffect } from "react";
import type { MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Navbar.css";

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => {
    finished: Promise<void>;
  };
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  // Load saved theme or default to dark royal voxel theme
  useEffect(() => {
    const savedTheme = window.localStorage.getItem("gamecraft-theme");
    const isDark = savedTheme ? savedTheme === "dark" : true;

    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    setIsDarkTheme(isDark);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const nextTheme: "light" | "dark" = isDarkTheme ? "light" : "dark";

    const changeTheme = () => {
      document.documentElement.dataset.theme = nextTheme;
      window.localStorage.setItem("gamecraft-theme", nextTheme);
      setIsDarkTheme(nextTheme === "dark");
    };

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const viewTransitionDocument = document as ViewTransitionDocument;

    if (
      viewTransitionDocument.startViewTransition &&
      !prefersReducedMotion
    ) {
      viewTransitionDocument.startViewTransition(changeTheme);
    } else {
      changeTheme();
    }
  };

  // Handle navbar scroll state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#events", label: "Arena" },
    { href: "#challenge", label: "Build" },
    { href: "#prizes", label: "Prizes" },
    { href: "#schedule", label: "Schedule" },
    { href: "#rules", label: "Rules" },
    { href: "#faq", label: "FAQ" },
  ];

  // Handle homepage section navigation
  const scrollToSection = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    event.preventDefault();
    setIsMobileMenuOpen(false);

    const currentPath =
      window.location.pathname.replace(/\/+$/, "") || "/";

    if (currentPath !== "/") {
      window.location.href = `/${href}`;
      return;
    }

    const sectionId = href.substring(1);
    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      window.history.pushState(null, "", href);
    }
  };

  // Handle normal page navigation
  const handlePageNavigation = () => {
    setIsMobileMenuOpen(false);
  };

  // Handle logo click
  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setIsMobileMenuOpen(false);

    const currentPath =
      window.location.pathname.replace(/\/+$/, "") || "/";

    if (currentPath !== "/") {
      window.location.href = "/";
      return;
    }

    const hero = document.getElementById("hero");
    if (hero) {
      hero.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      window.history.pushState(null, "", "/");
    }
  };

  return (
    <motion.nav
      className={`navbar ${isScrolled ? "scrolled" : ""}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="navbar-container">
        {/* Left Side: PIXEL FORGE branding on one line + 2026 gold badge + divider */}
        <div className="navbar-left-group">
          <a href="/" className="navbar-logo" onClick={handleLogoClick}>
            <span className="navbar-logo-text">
              <span className="pf-nav-pixel">PIXEL</span>
              <span className="pf-nav-forge">FORGE</span>
            </span>
            <span className="navbar-year-badge">2026</span>
          </a>
          <span className="navbar-brand-divider" aria-hidden="true">|</span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="navbar-desktop-menu">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link"
              onClick={(event) => scrollToSection(event, link.href)}
            >
              {link.label}
            </a>
          ))}

          {/* Brochure */}
          <a
            href="/brochure"
            className="nav-link doc-link"
            onClick={handlePageNavigation}
          >
            Brochure
          </a>


        </div>

        {/* Right Side: Theme toggle and glowing orange Register Now button */}
        <div className="navbar-actions">
          {/* Theme Toggle */}
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDarkTheme ? "light" : "dark"} theme`}
            title={`Switch to ${isDarkTheme ? "light" : "dark"} theme`}
          >
            <span aria-hidden="true">{isDarkTheme ? "☀" : "☾"}</span>
          </button>

          {/* Glowing Orange Register Now Button */}
          <a
            href="/registration"
            className="nav-cta"
            onClick={handlePageNavigation}
          >
            <span>REGISTER NOW</span>
            <span className="nav-cta-arrow">→</span>
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className={`mobile-menu-toggle ${isMobileMenuOpen ? "open" : ""}`}
            onClick={() => setIsMobileMenuOpen((previous) => !previous)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="mobile-drawer-menu"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mobile-drawer-links">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="mobile-nav-link"
                    onClick={(event) => scrollToSection(event, link.href)}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="mobile-drawer-divider" />
                <a
                  href="/brochure"
                  className="mobile-nav-link"
                  onClick={handlePageNavigation}
                >
                  View Brochure
                </a>

                <a
                  href="/registration"
                  className="mobile-nav-cta"
                  onClick={handlePageNavigation}
                >
                  Register Your Team →
                </a>
              </div>
            </motion.div>

            <motion.div
              className="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;