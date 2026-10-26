import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaWhatsapp,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaUserCircle,
  FaSignOutAlt,
  FaAward,
  FaGraduationCap,
  FaChevronDown,
  FaUser,
  FaTicketAlt,
} from "react-icons/fa";

const TopBar = ({
  onRequestCertificate,
  onOpenLogin,
  onOpenRegister,
  currentUser,
  onLogout,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click or escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
        if (triggerRef.current) {
          triggerRef.current.focus();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Compute initials avatar
  const userInitials = useMemo(() => {
    if (!currentUser) return "ST";
    const name = currentUser.name || currentUser.full_name || "Student User";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return (name.slice(0, 2) || "ST").toUpperCase();
  }, [currentUser]);

  return (
    <div className="w-full bg-[#07162c] text-slate-200 border-b border-white/10 text-xs select-none relative z-50">
      <div className="max-w-[1720px] mx-auto px-2 sm:px-6 lg:px-8 flex items-center justify-between h-[44px] sm:h-[48px] gap-1 sm:gap-3 min-w-0">
        
        {/* =========================================================
            LEFT: CONTACT EMAIL
        ========================================================= */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 flex items-center justify-center shadow-xs shrink-0">
              <FaEnvelope className="text-[9px] sm:text-[10px]" />
            </span>
            <a
              href="mailto:certification@broadbeach.in"
              aria-label="Send email to certification@broadbeach.in"
              className="text-slate-100 hover:text-amber-300 text-[11px] sm:text-[12px] font-medium transition-colors tracking-tight truncate max-w-[100px] min-[400px]:max-w-[130px] sm:max-w-none"
            >
              <span className="hidden min-[360px]:inline">certification@broadbeach.in</span>
            </a>
          </div>

          <div className="h-3.5 w-px bg-white/15" />

          {/* WhatsApp Direct Chat - on Left Side of Header Only */}
          <a
            href="https://wa.me/917338649737?text=Hello%20Broadbeach%20Academy%2C%20I%20would%20like%20to%20inquire%20about%20courses%20and%20certifications."
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact Broadbeach Academy on WhatsApp (+91 7338649737)"
            className="flex items-center gap-1.5 text-slate-100 hover:text-emerald-400 text-[11px] sm:text-[12px] font-medium transition-colors group cursor-pointer"
          >
            <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center shadow-xs shrink-0 transition-all">
              <FaWhatsapp className="text-[10px] sm:text-[11px]" />
            </span>
            <span className="hidden sm:inline font-medium text-slate-200 group-hover:text-emerald-300 transition-colors">
              WhatsApp
            </span>
          </a>
        </div>

        {/* =========================================================
            RIGHT: SOCIALS + BLOG + CONTACT + CTAs
        ========================================================= */}
        <div className="flex items-center gap-1 sm:gap-2.5 lg:gap-4 shrink-0">
          
          {/* Social Icons (Desktop & Tablet) */}
          <div className="hidden md:flex items-center gap-1.5 text-slate-300">
            <a
              href="https://www.facebook.com/broadbeach.innovations.71/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-all duration-200"
            >
              <FaFacebookF className="text-[11px]" />
            </a>
            <a
              href="https://www.linkedin.com/company/37528405/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#0A66C2] hover:text-white flex items-center justify-center transition-all duration-200"
            >
              <FaLinkedinIn className="text-[11px]" />
            </a>
            <a
              href="https://www.instagram.com/broadbeachinnovations"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#E4405F] hover:text-white flex items-center justify-center transition-all duration-200"
            >
              <FaInstagram className="text-[11px]" />
            </a>
          </div>

          <div className="hidden md:block h-3.5 w-px bg-white/15" />

          {/* Informational Links */}
          <div className="hidden lg:flex items-center gap-3.5 text-[12px]">
            <a
              href="https://medium.com/@broadbeach.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white font-medium transition-colors"
            >
              Blogs
            </a>
            <Link
              to="/contact"
              className="text-slate-300 hover:text-white font-medium transition-colors"
            >
              Contact Us
            </Link>
          </div>

          {/* Verify Certificate CTA */}
          <Link
            to="/verify-certificate"
            className="group flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-95 text-[#07162c] font-bold text-[11px] sm:text-[12px] rounded-full shadow-xs transition-all duration-200 hover:shadow-md cursor-pointer whitespace-nowrap"
          >
            <FaAward className="text-[10px] sm:text-[11px] text-[#07162c] group-hover:rotate-12 transition-transform duration-200 shrink-0" />
            <span className="hidden min-[360px]:inline">Verify Certificate</span>
            <span className="min-[360px]:hidden">Verify</span>
          </Link>

          {/* User Logged In State or Auth Buttons */}
          {currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                ref={triggerRef}
                id="profile-dropdown-button"
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setIsDropdownOpen((prev) => !prev);
                  }
                }}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                aria-controls="profile-dropdown-menu"
                aria-label="User profile, courses and certificates menu"
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1 bg-white/10 hover:bg-white/20 active:scale-95 rounded-full text-slate-100 text-xs font-semibold border border-white/20 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {/* Initials Avatar */}
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 text-[#07162c] font-extrabold text-[10px] flex items-center justify-center shrink-0 shadow-xs border border-white/20">
                  {userInitials}
                </div>
                <span className="max-w-[70px] sm:max-w-[100px] truncate">{currentUser.name}</span>
                <FaChevronDown className={`text-[9px] text-slate-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Accessible Dropdown Panel */}
              {isDropdownOpen && (
                <div
                  id="profile-dropdown-menu"
                  role="menu"
                  aria-labelledby="profile-dropdown-button"
                  aria-orientation="vertical"
                  className="absolute right-0 top-full mt-2 w-60 max-w-[calc(100vw-20px)] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl py-2 z-[9999] animate-fadeInSlideDown overflow-hidden"
                >
                  {/* User Profile Header */}
                  <div className="px-3.5 py-2.5 border-b border-slate-800 bg-slate-950/40">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-400 text-[#07162c] font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                        {userInitials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                        <p className="text-[10.5px] text-slate-400 truncate">{currentUser.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="py-1">
                    <Link
                      to="/my-profile"
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-200 hover:text-white hover:bg-slate-800/80 transition-colors"
                    >
                      <FaUser className="text-amber-400 text-xs shrink-0" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/my-courses"
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-200 hover:text-white hover:bg-slate-800/80 transition-colors"
                    >
                      <FaGraduationCap className="text-blue-400 text-xs shrink-0" />
                      <span>My Courses</span>
                    </Link>

                    <Link
                      to="/my-profile?tab=certificates"
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-200 hover:text-white hover:bg-slate-800/80 transition-colors"
                    >
                      <FaAward className="text-emerald-400 text-xs shrink-0" />
                      <span>My Certificates</span>
                    </Link>

                    <Link
                      to="/verify-certificate"
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-200 hover:text-white hover:bg-slate-800/80 transition-colors"
                    >
                      <FaAward className="text-amber-400 text-xs shrink-0" />
                      <span>Verify Certificate</span>
                    </Link>

                    <Link
                      to="/my-profile?tab=tickets"
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-200 hover:text-white hover:bg-slate-800/80 transition-colors"
                    >
                      <FaTicketAlt className="text-blue-400 text-xs shrink-0" />
                      <span>Support Tickets</span>
                    </Link>
                  </div>

                  {/* Logout Action */}
                  <div className="pt-1 border-t border-slate-800">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors cursor-pointer"
                    >
                      <FaSignOutAlt className="text-xs shrink-0" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={onOpenLogin}
                className="text-slate-300 hover:text-white font-semibold text-[11px] sm:text-[12px] px-1.5 sm:px-2.5 py-1 transition-colors cursor-pointer"
              >
                Log In
              </button>

              <button
                type="button"
                onClick={onOpenRegister}
                className="text-slate-300 hover:text-white font-semibold text-[11px] sm:text-[12px] px-1.5 sm:px-2.5 py-1 transition-colors cursor-pointer"
              >
                Register
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default TopBar;
