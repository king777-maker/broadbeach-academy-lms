import React from "react";
import { FaGraduationCap, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const SubBanner = () => {
  return (
    <div className="w-full bg-slate-50/80 border-b border-slate-200/60 py-2 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-[1720px] mx-auto">
        {/* Floating modern card with 12px rounded corners and soft blurry shadow */}
        <div className="bg-white rounded-[12px] border border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.05)] px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          
          {/* Banner Left: Clear typography hierarchy with bold core label & slate-gray secondary text */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-[8px] bg-blue-50 text-blue-700 text-[11px] shrink-0">
              <FaGraduationCap />
            </span>
            
            {/* Core Label (Bold, dark slate) */}
            <span className="font-bold text-slate-900">
              Broadbeach Academy :
            </span>

            {/* Email link (Clear accent) */}
            <a
              href="mailto:certification@broadbeach.in"
              className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
            >
              certification@broadbeach.in
            </a>

            <span className="hidden lg:inline text-slate-300">|</span>

            {/* Structural Secondary Text (Clear slate-gray, readable) */}
            <span className="hidden lg:inline text-slate-500 font-normal">
              Global Accreditation Portal & Lead Auditor Learning Management System
            </span>
          </div>

          {/* Banner Right: Informational badges with matching 12px rounded corners */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[12px] bg-slate-50 border border-slate-200/80 text-[11px] font-medium text-slate-700 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span>2026 ISO Schedules Live</span>
            </div>

            <Link
              to="/courses"
              className="hidden sm:inline-flex items-center gap-1 text-[11.5px] font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              <span>Browse Certifications</span>
              <FaChevronRight className="text-[9px]" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SubBanner;
