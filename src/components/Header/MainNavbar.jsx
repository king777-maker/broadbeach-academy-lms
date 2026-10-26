import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronRight, FaBars, FaTimes, FaClock } from "react-icons/fa";
import { navigationCategories } from "../../data/coursesData";
import BrandLogo from "./BrandLogo";
import SearchBar from "./SearchBar";

const MainNavbar = ({ onToggleMobile, isMobileOpen }) => {
  const navigate = useNavigate();
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [activeSubcategoryId, setActiveSubcategoryId] = useState("quality-management");
  const closeTimeoutRef = useRef(null);
  const navContainerRef = useRef(null);
  const categoryListRef = useRef(null);

  // Cancel any scheduled dropdown close
  const cancelClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  // Grace window prevents flicker during diagonal pointer movement
  const scheduleClose = () => {
    cancelClose();
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdownId(null);
    }, 180);
  };

  const handleMouseEnter = (categoryId) => {
    cancelClose();
    setOpenDropdownId(categoryId);
  };

  const handleMouseLeave = () => {
    scheduleClose();
  };

  const handleCloseDropdown = () => {
    cancelClose();
    setOpenDropdownId(null);
  };

  const getCategoryUrl = (cat) =>
    cat.id === "free-courses" ? "/free-courses" : `/${cat.slug || cat.id}`;

  const handleTriggerClick = (category) => {
    cancelClose();
    if (openDropdownId === category.id) {
      // If already open, clicking navigates to the category landing page
      handleCloseDropdown();
      navigate(getCategoryUrl(category));
    } else {
      setOpenDropdownId(category.id);
    }
  };

  const handleKeyDown = (e, category) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleTriggerClick(category);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      cancelClose();
      setOpenDropdownId(category.id);
    } else if (e.key === "Escape") {
      cancelClose();
      handleCloseDropdown();
    }
  };

  // Keyboard navigation inside category tabs
  const handleCategoryNavKeyDown = (e, subcategories) => {
    if (!subcategories || subcategories.length === 0) return;
    const currentIndex = subcategories.findIndex((sc) => sc.id === activeSubcategoryId);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % subcategories.length;
      setActiveSubcategoryId(subcategories[nextIndex].id);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + subcategories.length) % subcategories.length;
      setActiveSubcategoryId(subcategories[prevIndex].id);
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelClose();
      handleCloseDropdown();
    }
  };

  // Keep active category in view inside the scrollable left panel
  useEffect(() => {
    if (openDropdownId === "professional-certifications" && activeSubcategoryId && categoryListRef.current) {
      const activeBtn = categoryListRef.current.querySelector(`[data-subcat-id="${activeSubcategoryId}"]`);
      if (activeBtn) {
        activeBtn.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [activeSubcategoryId, openDropdownId]);

  // Close when clicking outside of the navbar or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(event.target)
      ) {
        cancelClose();
        setOpenDropdownId(null);
      }
    };

    const handleWindowKeyDown = (e) => {
      if (e.key === "Escape") {
        cancelClose();
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    window.addEventListener("keydown", handleWindowKeyDown);

    return () => {
      cancelClose();
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("keydown", handleWindowKeyDown);
    };
  }, []);

  return (
    <div
      ref={navContainerRef}
      className="w-full bg-gradient-to-r from-[#174b85] via-[#1a5597] to-[#174b85] text-white relative shadow-md select-none z-30 border-t border-white/10"
    >
      <div className="max-w-[1720px] mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[52px] sm:h-[56px] gap-2 sm:gap-3 min-w-0">
          
          {/* =======================================================
              LEFT: BRAND LOGO + HORIZONTAL NAVIGATION LINKS
          ======================================================= */}
          <div className="flex items-center gap-2 sm:gap-6 shrink-0 min-w-0">
            {/* Anchored Brand Logo on Far Left Corner */}
            <BrandLogo />

            {/* Desktop Navigation Links */}
            <nav
              className="hidden xl:flex items-center gap-1 2xl:gap-1.5"
              aria-label="Main Navigation Categories"
            >
              {navigationCategories.map((category, index) => {
                const isOpen = openDropdownId === category.id;
                // Align last two dropdowns to the right of their trigger to prevent right-edge viewport clipping
                const isRightAligned = index >= navigationCategories.length - 2;
                const hasSubcategories = Array.isArray(category.subcategories) && category.subcategories.length > 0;

                // Active subcategory for mega-menu
                const activeSubcat = hasSubcategories
                  ? category.subcategories.find((sc) => sc.id === activeSubcategoryId) || category.subcategories[0]
                  : null;

                return (
                  <div
                    key={category.id}
                    onMouseEnter={() => handleMouseEnter(category.id)}
                    onMouseLeave={handleMouseLeave}
                    className="relative py-2"
                  >
                    <button
                      type="button"
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                      aria-controls={`dropdown-menu-${category.id}`}
                      onClick={() => handleTriggerClick(category)}
                      onKeyDown={(e) => handleKeyDown(e, category)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] 2xl:text-[13.5px] font-medium transition-all duration-150 cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
                        isOpen
                          ? "bg-white/20 text-white shadow-xs ring-1 ring-white/30"
                          : "text-white/90 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span>{category.title}</span>
                      <FaChevronDown
                        className={`text-[9px] transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-amber-300" : "text-white/70"
                        }`}
                      />
                    </button>

                    {/* =========================================================
                        DROPDOWN MENUS (Fixed Height & Independent Scrolling)
                    ========================================================= */}
                    {isOpen && (
                      hasSubcategories ? (
                        /* TWO-PANEL CATEGORY-WISE MEGA MENU */
                        <div
                          id={`dropdown-menu-${category.id}`}
                          role="menu"
                          aria-label={`${category.title} categorized options`}
                          onMouseEnter={cancelClose}
                          onMouseLeave={scheduleClose}
                          className="absolute top-full right-0 w-[880px] max-w-[calc(100vw-32px)] mt-2 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-fadeInSlideDown before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-[''] flex flex-col h-[460px] max-h-[min(65vh,520px)]"
                          style={{ height: "460px", maxHeight: "min(65vh, 520px)" }}
                        >
                          {/* Fixed Top Header Strip */}
                          <div className="shrink-0 px-5 py-3 bg-gradient-to-r from-[#07162c] via-[#0B315B] to-[#124275] text-white flex items-center justify-between border-b border-white/10">
                            <div className="flex items-center gap-2.5">
                              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                              <span className="text-xs font-extrabold uppercase tracking-wider text-white">
                                {category.title} Directory
                              </span>
                              <span className="text-[10px] font-bold text-[#07162c] bg-amber-400 px-2.5 py-0.5 rounded-full shadow-xs">
                                {category.subcategories.length} Specialized Tracks • {category.courses.length} Credentials
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-300 font-medium hidden sm:inline">
                              Accredited & ISO Aligned • Phase 1 Offline Batches
                            </span>
                          </div>

                          {/* Two-Panel Body (Equal Fixed Height & Independent Scrolling) */}
                          <div className="flex-1 min-h-0 flex divide-x divide-slate-100 overflow-hidden">
                            
                            {/* LEFT PANEL: VERTICAL CATEGORY TABS WITH INDEPENDENT SCROLL */}
                            <div
                              className="w-[285px] shrink-0 h-full min-h-0 bg-slate-50/90 flex flex-col border-r border-slate-200/70 overflow-hidden"
                              role="tablist"
                              aria-label="Certification Categories"
                            >
                              <div className="shrink-0 px-4 py-2 border-b border-slate-200/50 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between bg-slate-100/60">
                                <span>Categories</span>
                                <span>Courses</span>
                              </div>

                              <div
                                ref={categoryListRef}
                                onKeyDown={(e) => handleCategoryNavKeyDown(e, category.subcategories)}
                                className="flex-1 min-h-0 overflow-y-auto custom-dropdown-scroll p-2 space-y-1 focus:outline-none"
                                tabIndex={0}
                                aria-label="Category list navigation (Use Up and Down arrow keys to switch)"
                              >
                                {category.subcategories.map((subcat) => {
                                  const isActive = activeSubcat?.id === subcat.id;
                                  return (
                                    <button
                                      key={subcat.id}
                                      data-subcat-id={subcat.id}
                                      type="button"
                                      role="tab"
                                      aria-selected={isActive}
                                      onMouseEnter={() => setActiveSubcategoryId(subcat.id)}
                                      onClick={() => setActiveSubcategoryId(subcat.id)}
                                      className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all duration-150 flex items-center justify-between group cursor-pointer text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                                        isActive
                                          ? "bg-[#0B315B] text-white shadow-md font-bold"
                                          : "text-slate-700 hover:bg-white hover:text-[#0B315B]"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 min-w-0 pr-1.5">
                                        <span
                                          className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                                            isActive ? "bg-amber-400" : "bg-slate-300 group-hover:bg-[#0B315B]"
                                          }`}
                                        />
                                        <span className="truncate leading-tight">
                                          {subcat.shortTitle || subcat.title}
                                        </span>
                                      </div>
                                      <span
                                        className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 font-medium ${
                                          isActive
                                            ? "bg-amber-400/20 text-amber-300 border border-amber-300/30"
                                            : "bg-slate-200/80 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-700"
                                        }`}
                                      >
                                        {subcat.courses.length}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* RIGHT PANEL: SELECTED CATEGORY COURSES WITH INDEPENDENT SCROLL */}
                            <div className="flex-1 h-full min-h-0 flex flex-col justify-between bg-white min-w-0 overflow-hidden">
                              
                              {/* Active Track Header Banner (Pinned at top of right panel) */}
                              <div className="shrink-0 p-4 pb-3 border-b border-slate-100 flex items-start justify-between gap-3 bg-white">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="text-sm font-extrabold text-[#0B315B] leading-tight">
                                      {activeSubcat?.title}
                                    </h4>
                                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold border border-blue-100">
                                      {activeSubcat?.badge || `${activeSubcat?.courses.length} Programs`}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-2">
                                    {activeSubcat?.description}
                                  </p>
                                </div>
                              </div>

                              {/* Vertical List of Courses (Independently scrollable) */}
                              <div className="flex-1 min-h-0 overflow-y-auto custom-dropdown-scroll p-4 space-y-1">
                                {activeSubcat?.courses.map((course) => (
                                  <Link
                                    key={course.id}
                                    role="menuitem"
                                    to={`/courses/${course.id}`}
                                    onClick={handleCloseDropdown}
                                    className="group/item flex items-center justify-between p-2.5 px-3 rounded-lg text-slate-700 hover:text-blue-700 hover:bg-slate-50 transition-all duration-150 border border-transparent hover:border-slate-100 focus-visible:outline-none focus-visible:bg-slate-100"
                                  >
                                    <div className="min-w-0 pr-3">
                                      <span className="text-[12.5px] font-semibold text-slate-900 group-hover/item:text-blue-700 transition-colors block leading-tight certification-course-name">
                                        {course.title}
                                      </span>
                                      <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 mt-1 text-[10.5px] text-slate-400">
                                        <span className="font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded text-[9.5px]">
                                          {course.code}
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1 text-slate-500">
                                          <FaClock className="text-[9px] text-slate-400" />
                                          {course.duration}
                                        </span>
                                        {course.tag && (
                                          <>
                                            <span>•</span>
                                            <span className="text-amber-700 font-medium text-[10px]">
                                              {course.tag}
                                            </span>
                                          </>
                                        )}
                                        <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded text-[9.5px] font-semibold">
                                          Offline Batch
                                        </span>
                                      </div>
                                    </div>

                                    <FaChevronRight
                                      aria-hidden="true"
                                      className="text-[9px] text-slate-300 group-hover/item:text-blue-600 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-150 shrink-0"
                                    />
                                  </Link>
                                ))}
                              </div>

                              {/* Right Panel Subcategory Footer (Pinned at bottom of right panel) */}
                              <div className="shrink-0 px-5 py-2.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs">
                                <span className="text-slate-500 text-[11px]">
                                  Phase 1: Registrations open for upcoming offline batches
                                </span>
                                <Link
                                  to={activeSubcat?.courses[0] ? `/courses/${activeSubcat.courses[0].id}` : getCategoryUrl(category)}
                                  onClick={handleCloseDropdown}
                                  className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 text-[11.5px]"
                                >
                                  <span>Enquire for this track</span>
                                  <FaChevronRight className="text-[9px]" />
                                </Link>
                              </div>

                            </div>

                          </div>
                        </div>
                      ) : (
                        /* STANDARD CONVENTIONAL DROPDOWN (Lead Auditor, Internal Auditor, HSE, Free Courses) */
                        <div
                          id={`dropdown-menu-${category.id}`}
                          role="menu"
                          aria-label={`${category.title} options`}
                          onMouseEnter={cancelClose}
                          onMouseLeave={scheduleClose}
                          className={`absolute top-full ${
                            isRightAligned ? "right-0" : "left-0"
                          } w-[360px] mt-2 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200/90 p-2 z-50 animate-fadeInSlideDown before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-[''] max-h-[65vh] flex flex-col`}
                        >
                          {/* Dropdown Header */}
                          <div className="shrink-0 px-3.5 py-2 mb-1.5 border-b border-slate-100 flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                              {category.title}
                            </span>
                            <span className="text-[10px] font-semibold text-blue-700 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100/80">
                              {category.courses?.length || 0} Specializations
                            </span>
                          </div>

                          {/* Scrollable Course List with Independent Scroll */}
                          <div className="max-h-[350px] overflow-y-auto overscroll-contain pr-1 custom-dropdown-scroll space-y-1 flex-1 min-h-0">
                            {category.courses?.map((course) => (
                              <Link
                                key={course.id}
                                role="menuitem"
                                to={`/courses/${course.id}`}
                                onClick={handleCloseDropdown}
                                className="flex items-start justify-between p-2.5 px-3 rounded-lg text-slate-700 hover:text-blue-700 hover:bg-slate-50 transition-colors duration-150 group/item focus-visible:outline-none focus-visible:bg-slate-100"
                              >
                                <div className="min-w-0 pr-2.5">
                                  <span className="text-[13px] font-semibold text-slate-900 group-hover/item:text-blue-700 transition-colors leading-snug line-clamp-2 block certification-course-name">
                                    {course.title}
                                  </span>
                                  <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 mt-1 text-[11px] text-slate-400">
                                    <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                                      {course.code}
                                    </span>
                                    <span className="text-slate-300">•</span>
                                    <span className="flex items-center gap-1 text-slate-500 font-normal">
                                      <FaClock className="text-[9px] text-slate-400" />
                                      {course.duration}
                                    </span>
                                    {course.tag && (
                                      <>
                                        <span className="text-slate-300">•</span>
                                        <span className="font-medium text-amber-700 text-[10.5px]">
                                          {course.tag}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>

                                <FaChevronRight
                                  aria-hidden="true"
                                  className="text-[9px] text-slate-300 group-hover/item:text-blue-600 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-150 shrink-0 mt-1.5"
                                />
                              </Link>
                            ))}
                          </div>

                          {/* Dropdown Footer Link */}
                          <div className="shrink-0 pt-2 mt-1.5 border-t border-slate-100 bg-slate-50/60 -mx-2 -mb-2 p-2 rounded-b-xl flex items-center justify-between">
                            <Link
                              role="menuitem"
                              to={getCategoryUrl(category)}
                              onClick={handleCloseDropdown}
                              className="w-full flex items-center justify-between px-3 py-2 text-[12px] font-bold text-blue-600 hover:text-blue-800 hover:bg-white rounded-lg transition-all"
                            >
                              <span>Explore all {category.title} programs</span>
                              <FaChevronRight className="text-[9.5px]" />
                            </Link>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* =======================================================
              TABLET / MOBILE HAMBURGER BUTTON
          ======================================================= */}
          <div className="flex xl:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              aria-label={
                isMobileOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={isMobileOpen}
              aria-controls="mobile-navigation-drawer"
              onClick={onToggleMobile}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer border border-white/20 transition-all"
            >
              {isMobileOpen ? (
                <FaTimes className="text-sm" />
              ) : (
                <FaBars className="text-sm" />
              )}
              <span className="hidden sm:inline">Browse Categories</span>
            </button>
          </div>

          {/* =======================================================
              RIGHT SIDE: SEARCH BAR
          ======================================================= */}
          <div className="flex items-center gap-2 pr-0 sm:pr-4 min-w-0 shrink">
            <SearchBar />
          </div>

        </div>
      </div>
    </div>
  );
};

export default MainNavbar;
