import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaGraduationCap,
  FaGlobeAmericas,
  FaClipboardCheck,
  FaChartLine,
  FaAward,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaShieldAlt,
} from "react-icons/fa";

const courseSlides = [
  {
    id: "internal-auditor",
    title: "Internal Auditor",
    category: "ISO 9001 / ISO 14001 Quality Audit",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&auto=format&fit=crop&q=80",
    alt: "Internal audit professional reviewing compliance documentation and management system records",
    badge: "ISO 19011 Aligned",
    learners: "6,450+ Learners",
    slideIndex: 0,
  },
  {
    id: "lead-auditor",
    title: "Lead Auditor",
    category: "Executive Assessment & Certification",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&auto=format&fit=crop&q=80",
    alt: "Lead auditor conducting formal executive compliance assessment and audit closing meeting",
    badge: "ISO/IEC 17024",
    learners: "1,890+ Learners",
    slideIndex: 1,
  },
  {
    id: "lean-six-sigma",
    title: "Lean Six Sigma",
    category: "Operational Excellence & DMAIC",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&auto=format&fit=crop&q=80",
    alt: "Quality engineering team analyzing DMAIC process improvement and defect reduction data",
    badge: "DMAIC Methodology",
    learners: "3,200+ Learners",
    slideIndex: 2,
  },
  {
    id: "aerospace-quality",
    title: "Aerospace Quality",
    category: "AS9100D Aviation, Space & Defense",
    image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=1200&auto=format&fit=crop&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=1200&auto=format&fit=crop&q=80",
    alt: "Aerospace engineer conducting precision quality assurance and technical compliance inspection on aircraft propulsion systems",
    badge: "AS9100D Conformant",
    learners: "1,420+ Learners",
    slideIndex: 3,
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToPrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + courseSlides.length) % courseSlides.length);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % courseSlides.length);
  }, []);

  const goToSlide = useCallback((idx) => {
    setCurrentSlide(idx);
  }, []);

  // Auto-advance slider with visibility & prefers-reduced-motion checks
  useEffect(() => {
    if (isPaused) return;

    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) return;
    }

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % courseSlides.length);
    }, 4500);

    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isPaused]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      goToPrev();
    } else if (e.key === "ArrowRight") {
      goToNext();
    }
  };

  return (
    <section className="relative bg-gradient-to-b from-[#f2f6fc] via-[#f8faff] to-white py-3 sm:py-5 lg:py-4 xl:py-6 lg:min-h-[min(650px,calc(100svh-104px))] flex items-center overflow-hidden">
      {/* Subtle Ambient Background Accents */}
      <div
        className="absolute top-0 right-1/4 w-[450px] h-[450px] rounded-full bg-blue-100/40 blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-10 w-[320px] h-[320px] rounded-full bg-amber-100/30 blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-center">
          
          {/* =========================================================
              LEFT CONTENT COLUMN: Authoritative, Balanced, & Accessible
              (Strictly Preserved - No Headline or CTA Modifications)
          ========================================================= */}
          <div className="lg:col-span-6 flex flex-col items-start gap-3.5 sm:gap-4 lg:gap-3.5 xl:gap-4">
            
            {/* Accreditation Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/95 border border-slate-200/90 shadow-xs text-slate-800 text-xs sm:text-[13px] font-semibold select-none">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="tracking-tight text-slate-700">Internationally Recognized Certifications</span>
            </div>

            {/* Headline with Executive Typography */}
            <h1 className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[40px] font-extrabold text-[#0a1e38] leading-[1.18] tracking-tight">
              Learn New Skills. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700">
                Build Your Future.
              </span>
            </h1>

            {/* Description Paragraph */}
            <p className="text-slate-600 text-xs sm:text-sm lg:text-[15px] leading-relaxed max-w-[500px] font-normal">
              Broadbeach Innovation offers internationally recognized certification and training programs that empower individuals and organizations to achieve excellence, compliance, and continuous improvement.
            </p>

            {/* Statistics Row: High-Scannability Executive Metrics */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-3 py-2 sm:py-2.5 px-2.5 sm:px-4 bg-white/90 backdrop-blur-xs rounded-xl border border-slate-200/80 shadow-xs w-full max-w-xl">
              
              {/* Stat 1: Students */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100/80">
                    <FaUsers className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                  </div>
                  <span className="text-base sm:text-xl font-black text-[#0a1e38] tracking-tight">
                    10k+
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5 pl-0.5 leading-tight">
                  Students
                </span>
              </div>

              {/* Stat 2: Courses */}
              <div className="flex flex-col border-l border-slate-150 pl-2 sm:pl-3">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100/80">
                    <FaGraduationCap className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                  </div>
                  <span className="text-base sm:text-xl font-black text-[#0a1e38] tracking-tight">
                    150+
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5 pl-0.5 leading-tight">
                  Courses
                </span>
              </div>

              {/* Stat 3: Global Reach */}
              <div className="flex flex-col border-l border-slate-150 pl-2 sm:pl-3">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100/80">
                    <FaGlobeAmericas className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                  </div>
                  <span className="text-base sm:text-xl font-black text-[#0a1e38] tracking-tight">
                    45+
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5 pl-0.5 leading-tight">
                  Countries
                </span>
              </div>

            </div>

            {/* Action Buttons: Unified Height & Clear Hierarchy */}
            <div className="flex flex-wrap items-center gap-3 pt-0.5 w-full sm:w-auto">
              {/* Primary Action */}
              <Link
                to="/course"
                className="group h-[42px] sm:h-[44px] px-5 sm:px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Browse Courses</span>
                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform duration-200" />
              </Link>

              {/* Secondary Action */}
              <Link
                to="/contact"
                className="h-[42px] sm:h-[44px] px-5 sm:px-6 rounded-xl bg-white hover:bg-slate-50 hover:border-slate-300 active:scale-98 text-slate-700 hover:text-slate-900 font-bold text-xs sm:text-sm border border-slate-200 shadow-xs hover:shadow-sm transition-all duration-200 flex items-center justify-center whitespace-nowrap"
              >
                Contact Us
              </Link>
            </div>

          </div>

          {/* =========================================================
              RIGHT SIDE: Course Image Slider & Synchronized Floating Cards
          ========================================================= */}
          <div className="lg:col-span-6 relative flex justify-center mt-2 lg:mt-0">
            <div className="relative w-full max-w-[500px]">
              
              {/* Soft Layered Ambient Background Frame */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-indigo-600/10 to-amber-400/10 rounded-[24px] transform rotate-1 scale-102 filter blur-xs" />

              {/* Course Image Slider Container */}
              <div
                className="relative z-10 rounded-[20px] overflow-hidden shadow-xl border-3 border-white bg-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 select-none group/slider"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onFocus={() => setIsPaused(true)}
                onBlur={() => setIsPaused(false)}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="region"
                aria-roledescription="carousel"
                aria-label="Course categories showcase slider"
              >
                {/* Images Stack with Smooth Crossfade (Zero Layout Shift) */}
                <div className="relative w-full h-[280px] sm:h-[320px] lg:h-[330px] xl:h-[360px]">
                  {courseSlides.map((slide, index) => {
                    const isActive = index === currentSlide;
                    return (
                      <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                          isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                        }`}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${index + 1} of ${courseSlides.length}: ${slide.title}`}
                        aria-hidden={!isActive}
                      >
                        <img
                          src={slide.image}
                          alt={slide.alt}
                          loading={index === 0 ? "eager" : "lazy"}
                          onError={(e) => {
                            if (slide.fallbackImage && e.currentTarget.src !== slide.fallbackImage) {
                              e.currentTarget.src = slide.fallbackImage;
                            } else {
                              e.currentTarget.src = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200";
                            }
                          }}
                          className="w-full h-full object-cover object-center"
                        />
                        {/* High-legibility vignette gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                      </div>
                    );
                  })}

                  {/* Top Right Accreditation Track Badge */}
                  <div className="absolute top-3 right-3 z-20">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider bg-black/60 backdrop-blur-md text-amber-300 border border-white/15 shadow-xs">
                      {courseSlides[currentSlide].badge}
                    </span>
                  </div>

                  {/* Bottom Left Slide Meta */}
                  <div className="absolute left-3.5 sm:left-5 bottom-3.5 sm:bottom-4 z-20 max-w-[65%]">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] sm:text-[11px] text-slate-300 font-semibold uppercase tracking-wider">
                        {courseSlides[currentSlide].category}
                      </span>
                    </div>
                    <h3 className="text-white text-sm sm:text-lg font-black drop-shadow-md leading-tight">
                      {courseSlides[currentSlide].title}
                    </h3>
                    <p className="text-amber-300 text-[11px] sm:text-xs font-bold mt-0.5">
                      {courseSlides[currentSlide].learners}
                    </p>
                  </div>

                  {/* Visible & Accessible Arrow Controls with High Contrast */}
                  <div className="absolute inset-y-0 left-2 sm:left-3 right-2 sm:right-3 flex items-center justify-between z-30 pointer-events-none">
                    <button
                      type="button"
                      onClick={goToPrev}
                      aria-label="Previous course image"
                      className="pointer-events-auto w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950/80 hover:bg-blue-600 text-white border border-white/30 backdrop-blur-md flex items-center justify-center transition-all duration-200 active:scale-90 hover:scale-110 shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    >
                      <FaChevronLeft className="text-xs" />
                    </button>

                    <button
                      type="button"
                      onClick={goToNext}
                      aria-label="Next course image"
                      className="pointer-events-auto w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950/80 hover:bg-blue-600 text-white border border-white/30 backdrop-blur-md flex items-center justify-center transition-all duration-200 active:scale-90 hover:scale-110 shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    >
                      <FaChevronRight className="text-xs" />
                    </button>
                  </div>

                  {/* Compact Slide Indicators */}
                  <div
                    className="absolute bottom-3 sm:bottom-4 right-3 sm:right-5 z-20 flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-2 py-1 rounded-full border border-white/10"
                    role="tablist"
                    aria-label="Slide Selection"
                  >
                    {courseSlides.map((slide, idx) => {
                      const isActive = idx === currentSlide;
                      return (
                        <button
                          key={slide.id}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
                          onClick={() => goToSlide(idx)}
                          className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                            isActive ? "w-5 bg-amber-400" : "w-1.5 bg-white/50 hover:bg-white"
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* FLOATING CARD 1: Internal Auditor (Top Left) - Clickable & Synchronized */}
              <button
                type="button"
                onClick={() => goToSlide(0)}
                aria-label="View Internal Auditor Track"
                className={`hidden sm:flex absolute -left-2 sm:-left-4 top-2 sm:top-4 z-20 backdrop-blur-md rounded-xl p-2 sm:p-2.5 items-center gap-2.5 w-48 sm:w-52 transition-all duration-300 cursor-pointer text-left ${
                  currentSlide === 0
                    ? "bg-white shadow-[0_12px_24px_rgba(37,99,235,0.18)] border-2 border-blue-500 scale-103 ring-2 ring-blue-500/10"
                    : "bg-white/95 shadow-[0_8px_20px_rgba(10,30,56,0.08)] border border-slate-200/80 hover:scale-102"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                  currentSlide === 0
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-blue-50 text-blue-700 border-blue-100"
                }`}>
                  <FaClipboardCheck className="text-sm" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    Internal Auditor
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                    6,450+ Learners
                  </p>
                </div>
              </button>

              {/* FLOATING CARD 2: Lean Six Sigma (Bottom Left) - Clickable & Synchronized */}
              <button
                type="button"
                onClick={() => goToSlide(2)}
                aria-label="View Lean Six Sigma Track"
                className={`hidden sm:flex absolute left-2 sm:left-3 bottom-2 sm:bottom-4 z-20 backdrop-blur-md rounded-xl p-2 sm:p-2.5 items-center gap-2.5 w-48 sm:w-56 transition-all duration-300 cursor-pointer text-left ${
                  currentSlide === 2
                    ? "bg-white shadow-[0_12px_24px_rgba(245,166,35,0.20)] border-2 border-amber-500 scale-103 ring-2 ring-amber-500/10"
                    : "bg-white/95 shadow-[0_8px_20px_rgba(10,30,56,0.08)] border border-slate-200/80 hover:scale-102"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                  currentSlide === 2
                    ? "bg-amber-500 text-white border-amber-500"
                    : "bg-amber-50 text-amber-700 border-amber-100"
                }`}>
                  <FaChartLine className="text-sm" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    Lean Six Sigma
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                    3,200+ Learners
                  </p>
                </div>
              </button>

              {/* FLOATING CARD 3: Lead Auditor (Upper Right) - Clickable, Synchronized */}
              <button
                type="button"
                onClick={() => goToSlide(1)}
                aria-label="View Lead Auditor Track"
                className={`hidden sm:flex absolute -right-2 sm:-right-4 top-6 sm:top-8 z-20 backdrop-blur-md rounded-xl p-2 sm:p-2.5 items-center gap-2.5 w-44 sm:w-52 transition-all duration-300 cursor-pointer text-left ${
                  currentSlide === 1
                    ? "bg-white shadow-[0_12px_24px_rgba(16,185,129,0.20)] border-2 border-emerald-500 scale-103 ring-2 ring-emerald-500/10"
                    : "bg-white/95 shadow-[0_8px_20px_rgba(10,30,56,0.08)] border border-slate-200/80 hover:scale-102"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                  currentSlide === 1
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-emerald-50 text-emerald-700 border-emerald-100"
                }`}>
                  <FaAward className="text-sm" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    Lead Auditor
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                    1,890+ Learners
                  </p>
                </div>
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;