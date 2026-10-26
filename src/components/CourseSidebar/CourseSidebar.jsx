import { FaFilter, FaRedo, FaCheck } from "react-icons/fa";

const CATEGORIES = [
  { label: "All Categories", value: "All" },
  { label: "Quality (ISO 9001)", value: "Quality" },
  { label: "Environmental (ISO 14001)", value: "Environment" },
  { label: "Safety & EHS (ISO 45001)", value: "Safety" },
  { label: "Information Security (ISO 27001)", value: "Security" },
  { label: "Food Safety (ISO 22000)", value: "Food" },
  { label: "Lean Six Sigma", value: "Lean" },
  { label: "Auditing & Inspection (ISO 19011)", value: "Auditing" },
  { label: "Root Cause Analysis (RCA)", value: "RCA" },
  { label: "5S & Workplace Organization", value: "5S" },
  { label: "7 QC Tools", value: "QC" },
  { label: "Project & Risk Management", value: "Project" },
  { label: "Management & HR", value: "Management" },
  { label: "Supply Chain & Analytics", value: "Supply Chain" },
];

const LEVELS = [
  { label: "All Levels", value: "All" },
  { label: "Beginner", value: "Beginner" },
  { label: "Intermediate", value: "Intermediate" },
  { label: "Advanced", value: "Advanced" },
];

const CourseSidebar = ({
  typeFilter = "all",
  selectedCategory = "All",
  selectedLevel = "All",
  onTypeFilterChange = () => {},
  onCategoryChange = () => {},
  onLevelChange = () => {},
  onResetFilters = () => {},
  totalCount = 0,
  freeCount = 0,
  paidCount = 0,
}) => {
  const hasActiveFilters =
    typeFilter !== "all" || selectedCategory !== "All" || selectedLevel !== "All";

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(15,23,42,0.08)] border border-slate-100 p-6 sticky top-24">
      {/* Header with Title & Reset Button */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
        <div className="flex items-center gap-2">
          <FaFilter className="text-[#1E3A66] text-sm" />
          <h2 className="text-base font-bold text-[#1E3A66]">
            Filter Courses
          </h2>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition cursor-pointer"
            title="Reset all filters"
          >
            <FaRedo className="text-[10px]" />
            Reset
          </button>
        )}
      </div>

      {/* ================= 1. COURSE TYPE (FREE / PAID) - TOP OF FILTER AREA ================= */}
      <div className="mb-7 bg-blue-50/50 p-4 rounded-xl border border-blue-100/80">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E3A66] mb-3 flex items-center justify-between">
          <span>Course Type</span>
          <span className="text-[10px] text-blue-600 font-semibold lowercase">Required</span>
        </h3>

        <div className="space-y-2.5">
          {/* All Courses */}
          <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-white transition text-sm">
            <div className="flex items-center gap-2.5">
              <input
                type="radio"
                name="course_type_filter"
                value="all"
                checked={typeFilter === "all"}
                onChange={() => onTypeFilterChange("all")}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
              <span className={`text-sm ${typeFilter === "all" ? "font-bold text-[#0B1B3D]" : "text-slate-600"}`}>
                All Courses
              </span>
            </div>
            {totalCount > 0 && (
              <span className="text-[11px] font-semibold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                {totalCount}
              </span>
            )}
          </label>

          {/* Free Certifications */}
          <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-white transition text-sm">
            <div className="flex items-center gap-2.5">
              <input
                type="radio"
                name="course_type_filter"
                value="free"
                checked={typeFilter === "free"}
                onChange={() => onTypeFilterChange("free")}
                className="w-4 h-4 accent-emerald-600 cursor-pointer"
              />
              <span className={`text-sm ${typeFilter === "free" ? "font-bold text-emerald-700" : "text-slate-600"}`}>
                Free Programs
              </span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
              {freeCount || 11}
            </span>
          </label>

          {/* Paid Courses */}
          <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-white transition text-sm">
            <div className="flex items-center gap-2.5">
              <input
                type="radio"
                name="course_type_filter"
                value="paid"
                checked={typeFilter === "paid"}
                onChange={() => onTypeFilterChange("paid")}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
              <span className={`text-sm ${typeFilter === "paid" ? "font-bold text-[#0B1B3D]" : "text-slate-600"}`}>
                Paid Courses
              </span>
            </div>
            {paidCount > 0 && (
              <span className="text-[11px] font-semibold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                {paidCount}
              </span>
            )}
          </label>
        </div>
      </div>

      {/* ================= 2. CATEGORY / SPECIALIZATION TRACK ================= */}
      <div className="mb-7">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E3A66] mb-3">
          Category
        </h3>

        <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <label
                key={cat.value}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition text-xs ${
                  isSelected ? "bg-blue-50 font-bold text-blue-900" : "hover:bg-slate-50 text-slate-600"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <input
                    type="radio"
                    name="course_category_filter"
                    value={cat.value}
                    checked={isSelected}
                    onChange={() => onCategoryChange(cat.value)}
                    className="w-3.5 h-3.5 accent-blue-600 cursor-pointer"
                  />
                  <span className="truncate">{cat.label}</span>
                </div>
                {isSelected && <FaCheck className="text-blue-600 text-[10px] shrink-0" />}
              </label>
            );
          })}
        </div>
      </div>

      {/* ================= 3. LEVEL ================= */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E3A66] mb-3">
          Difficulty Level
        </h3>

        <div className="space-y-1.5">
          {LEVELS.map((lvl) => {
            const isSelected = selectedLevel === lvl.value;
            return (
              <label
                key={lvl.value}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition text-xs ${
                  isSelected ? "bg-blue-50 font-bold text-blue-900" : "hover:bg-slate-50 text-slate-600"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="course_level_filter"
                    value={lvl.value}
                    checked={isSelected}
                    onChange={() => onLevelChange(lvl.value)}
                    className="w-3.5 h-3.5 accent-blue-600 cursor-pointer"
                  />
                  <span>{lvl.label}</span>
                </div>
                {isSelected && <FaCheck className="text-blue-600 text-[10px] shrink-0" />}
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseSidebar;