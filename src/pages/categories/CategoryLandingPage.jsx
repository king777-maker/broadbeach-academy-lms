import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCheckCircle,
  FaCertificate,
  FaClock,
  FaGraduationCap,
  FaUsers,
  FaBookOpen,
  FaSearch,
  FaStar,
  FaShieldAlt,
  FaGlobe,
  FaBriefcase,
  FaPaperPlane,
} from "react-icons/fa";
import SEO from "../../components/common/SEO";
import EnrollmentEnquiryForm from "../../components/course/EnrollmentEnquiryForm";

const CategoryLandingPage = ({
  title,
  eyebrow,
  description,
  heroDescription,
  courses = [],
  stats = [],
  benefits = [],
  icon: CategoryIcon = FaGraduationCap,
}) => {
  const [selectedCourseForEnquiry, setSelectedCourseForEnquiry] = useState(courses[0] || null);

  return (
    <div className="min-h-screen bg-[#F8F7F3] text-[#18251F]">
      <SEO
        title={`${title} Training & Accreditations`}
        description={description || heroDescription || `Explore ${title} courses and certifications at Broadbeach Online Academy.`}
        breadcrumbs={[
          { name: "Courses", url: "/course" },
          { name: title },
        ]}
      />

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#06182E] via-[#092244] to-[#0D2E57] text-white pt-5 pb-7 sm:py-8 lg:py-9">

        {/* Ambient Golden & Azure Waves */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[1200px] h-[450px] bg-gradient-to-b from-amber-400/10 via-blue-500/10 to-transparent rounded-[100%] blur-3xl opacity-50" />
        </div>

        <div className="relative page-container">

          {/* Breadcrumb */}
          <div className="pb-3 sm:pb-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Link
                to="/"
                className="hover:text-amber-300 transition"
              >
                Home
              </Link>

              <span>/</span>

              <span className="text-[#FFC72C] font-semibold">
                {title}
              </span>
            </div>
          </div>

          <div className="page-hero-layout">

            {/* Left */}
            <div className="page-content space-y-3.5 sm:space-y-4">

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#FFC72C] animate-pulse" />
                <span>Phase 1 — Coming soon, Enroll now • Offline Batches</span>
              </div>

              <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl xl:text-[40px] font-black tracking-tight leading-tight">
                {title}
              </h1>

              <p className="text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl">
                {heroDescription || description}
              </p>

              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">

                <a
                  href="#enquiry-section"
                  className="inline-flex items-center gap-2 bg-[#FFC72C] hover:bg-[#E0A708] text-[#08182D] px-6 h-[44px] rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 shadow-md active:scale-95"
                >
                  <FaPaperPlane className="text-xs" />
                  <span>Coming soon, Enroll now</span>
                  <FaArrowRight className="text-[10px]" />
                </a>

                <a
                  href="#courses"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 h-[44px] rounded-xl font-semibold text-xs sm:text-sm transition active:scale-95"
                >
                  <span>Explore Programs ({courses.length})</span>
                </a>

              </div>

              {/* Trust points */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 text-white/70 text-xs sm:text-sm">

                <div className="flex items-center gap-1.5">
                  <FaCheckCircle className="text-[#D19A32]" />
                  Industry-focused learning
                </div>

                <div className="flex items-center gap-1.5">
                  <FaCheckCircle className="text-[#D19A32]" />
                  Certification-focused programs
                </div>

                <div className="flex items-center gap-1.5">
                  <FaCheckCircle className="text-[#D19A32]" />
                  Learn at your own pace
                </div>

              </div>

            </div>

            {/* Right visual */}
            <div className="hero-right-card">

              <div className="relative">

                {/* Main card */}
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 shadow-xl">

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FFC72C] text-[#08182D] flex items-center justify-center shrink-0">
                      <CategoryIcon className="text-xl" />
                    </div>
                    <div>
                      <p className="text-white/60 uppercase tracking-[2px] text-[10px] font-bold">
                        Learning Category
                      </p>
                      <h3 className="text-white text-base font-bold leading-snug">
                        {title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-white/80 text-xs leading-relaxed mb-4">
                    Professional, industry-accredited training mapped to international standards.
                  </p>

                  <div className="grid grid-cols-2 gap-2.5">

                    <div className="rounded-xl bg-black/15 border border-white/10 p-3">
                      <FaCertificate className="text-[#FFC72C] mb-1.5 text-base" />
                      <p className="text-white font-bold text-xs">
                        Certified
                      </p>
                      <p className="text-white/60 text-[10px]">
                        Accredited Programs
                      </p>
                    </div>

                    <div className="rounded-xl bg-black/15 border border-white/10 p-3">
                      <FaGlobe className="text-[#FFC72C] mb-1.5 text-base" />
                      <p className="text-white font-bold text-xs">
                        Global
                      </p>
                      <p className="text-white/60 text-[10px]">
                        ISO Schemes
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>
      </section>


      {/* =========================================================
          STATS
      ========================================================= */}
      <section className="bg-white border-b border-gray-100">

        <div className="page-container">

          <div className="grid grid-cols-2 lg:grid-cols-4">

            {stats.map((stat, index) => (
              <div
                key={index}
                className="py-10 lg:py-12 px-6 border-r last:border-r-0 border-gray-100"
              >

                <div className="text-[#B57D20] text-3xl lg:text-4xl font-bold">
                  {stat.value}
                </div>

                <div className="mt-2 text-gray-500 text-sm">
                  {stat.label}
                </div>

              </div>
            ))}

          </div>

        </div>

      </section>


      {/* =========================================================
          INTRO
      ========================================================= */}
      <section className="bg-[#F8F7F3]">

        <div className="page-container py-16 lg:py-20">

          <div className="grid lg:grid-cols-[0.75fr_1.25fr] gap-12 lg:gap-16">

            <div>

              <div className="flex items-center gap-3 mb-5">

                <span className="w-8 h-[2px] bg-[#C9912D]" />

                <span className="text-[#B57D20] text-xs uppercase tracking-[3px] font-semibold">
                  Explore Your Path
                </span>

              </div>

              <h2 className="text-3xl lg:text-4xl font-bold leading-tight text-[#102B4E]">
                Build knowledge that works in the real world.
              </h2>

            </div>

            <div>

              <p className="text-gray-600 text-base sm:text-lg leading-8">
                {description}
              </p>

              <p className="text-gray-500 leading-7 mt-6">
                Our learning programs are designed to help professionals,
                students and organizations develop practical knowledge,
                understand recognized standards and build confidence in
                applying what they learn.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          COURSES
      ========================================================= */}
      <section
        id="courses"
        className="bg-white"
      >

        <div className="page-container py-16 lg:py-20">

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">

            <div>

              <div className="flex items-center gap-3 mb-5">

                <span className="w-8 h-[2px] bg-[#C9912D]" />

                <span className="text-[#B57D20] text-xs uppercase tracking-[3px] font-semibold">
                  Available Programs
                </span>

              </div>

              <h2 className="text-4xl lg:text-5xl font-semibold text-[#183A2C]">
                Explore our courses
              </h2>

              <p className="text-gray-500 mt-4 max-w-[650px]">
                Choose a program that matches your professional goals and
                start building valuable knowledge.
              </p>

            </div>

            {/* Search visual */}
            <div className="w-full lg:w-[320px]">

              <div className="relative">

                <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full bg-[#F8F7F3] border border-gray-200 rounded-full py-4 pl-12 pr-5 outline-none focus:border-[#C9912D] transition"
                />

              </div>

            </div>

          </div>


          {/* Course cards */}
          {courses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">

              {courses.map((course, index) => (

                <div
                  key={course.id || index}
                  className="group border border-gray-200 rounded-[24px] overflow-hidden bg-white hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500"
                >

                  {/* Image */}
                  <div className="relative h-[220px] overflow-hidden bg-[#EDEBE4]">

                    {course.image ? (
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#EDEBE4]">
                        <FaBookOpen className="text-[#B58A3B] text-5xl" />
                      </div>
                    )}

                    {/* Level */}
                    {course.level && (
                      <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-semibold text-[#183A2C]">
                        {course.level}
                      </div>
                    )}

                  </div>


                  {/* Content */}
                  <div className="p-7">

                    <div className="flex items-center gap-1 text-[#C48A27] text-sm mb-4">

                      <FaStar />

                      <span className="font-semibold">
                        {course.rating || "4.9"}
                      </span>

                    </div>

                    <h3 className="text-xl font-semibold text-[#183A2C] leading-snug min-h-[58px]">
                      {course.title}
                    </h3>

                    <p className="text-gray-500 text-sm leading-6 mt-4 line-clamp-3">
                      {course.description ||
                        "Develop practical knowledge and professional skills through this focused learning program."}
                    </p>


                    {/* Details */}
                    <div className="flex flex-wrap gap-5 mt-6 pt-5 border-t border-gray-100 text-sm text-gray-500">

                      <div className="flex items-center gap-2">
                        <FaClock className="text-[#B9872A]" />
                        {course.duration || "Self-paced"}
                      </div>

                      <div className="flex items-center gap-2">
                        <FaUsers className="text-[#B9872A]" />
                        {course.students || "100+"} learners
                      </div>

                    </div>


                    {/* Action Buttons */}
                    <div className="mt-7 grid grid-cols-2 gap-2">
                      <Link
                        to={`/courses/${course.slug || course.id}`}
                        className="py-3 px-4 rounded-full border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-bold text-center transition"
                      >
                        Syllabus
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCourseForEnquiry(course);
                          const el = document.getElementById("enquiry-section");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="py-3 px-3 rounded-full bg-amber-400 hover:bg-amber-500 text-[#07162c] text-xs font-bold text-center transition shadow cursor-pointer active:scale-95 flex items-center justify-center gap-1"
                      >
                        <span>Coming soon, Enroll now</span>
                      </button>
                    </div>

                  </div>

                </div>

              ))}

            </div>
          ) : (

            <div className="py-20 text-center border border-dashed border-gray-300 rounded-3xl">

              <FaBookOpen className="mx-auto text-4xl text-gray-300 mb-5" />

              <h3 className="text-xl font-semibold text-gray-700">
                Phase 1 Offline Batches Available
              </h3>

              <p className="text-gray-500 mt-2">
                New online programs are launching soon. Enquire below for offline classroom schedules.
              </p>

            </div>

          )}

        </div>

      </section>

      {/* =========================================================
          OFFLINE BATCH ENQUIRY SECTION
      ========================================================= */}
      <section id="enquiry-section" className="py-16 bg-[#F3F1EA] border-t border-gray-200 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-300 px-3.5 py-1 rounded-full">
              Phase 1 — Coming soon, Enroll now • Offline Batches
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#073B2A] mt-3">
              Enquiry & Pre-Enrollment Form
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Interested in our {title} certifications? Submit your details to reserve your seat in the upcoming offline classroom batch or receive launch alerts for online courses.
            </p>
          </div>

          <EnrollmentEnquiryForm
            course={selectedCourseForEnquiry || courses[0]}
            availableCourses={courses}
            onCourseChange={(c) => setSelectedCourseForEnquiry(c)}
          />
        </div>
      </section>


      {/* =========================================================
          WHY US
      ========================================================= */}
      <section
        id="why-us"
        className="bg-[#F3F1EA]"
      >

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20 lg:py-28">

          <div className="max-w-[700px]">

            <div className="flex items-center gap-3 mb-5">

              <span className="w-8 h-[2px] bg-[#C9912D]" />

              <span className="text-[#B57D20] text-xs uppercase tracking-[3px] font-semibold">
                Why Broadbeach
              </span>

            </div>

            <h2 className="text-4xl lg:text-5xl font-semibold text-[#183A2C]">
              Learning designed around your professional goals.
            </h2>

          </div>


          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">

            {benefits.map((benefit, index) => {

              const icons = [
                FaCertificate,
                FaBriefcase,
                FaGlobe,
                FaShieldAlt,
              ];

              const Icon = icons[index % icons.length];

              return (
                <div
                  key={index}
                  className="bg-white rounded-[24px] p-8 border border-gray-100"
                >

                  <div className="w-14 h-14 rounded-2xl bg-[#F4E8D0] flex items-center justify-center">
                    <Icon className="text-[#B57D20] text-xl" />
                  </div>

                  <h3 className="text-xl font-semibold text-[#183A2C] mt-7">
                    {benefit.title}
                  </h3>

                  <p className="text-gray-500 leading-7 mt-4">
                    {benefit.description}
                  </p>

                </div>
              );
            })}

          </div>

        </div>

      </section>


      {/* =========================================================
          LEARNING JOURNEY
      ========================================================= */}
      <section className="bg-white">

        <div className="max-w-[1200px] mx-auto px-6 py-20 lg:py-28 text-center">

          <div className="flex items-center justify-center gap-3 mb-5">

            <span className="w-8 h-[2px] bg-[#C9912D]" />

            <span className="text-[#B57D20] text-xs uppercase tracking-[3px] font-semibold">
              Your Learning Journey
            </span>

            <span className="w-8 h-[2px] bg-[#C9912D]" />

          </div>

          <h2 className="text-4xl lg:text-5xl font-semibold text-[#183A2C]">
            From learning to certification
          </h2>

          <p className="text-gray-500 max-w-[650px] mx-auto mt-5 leading-7">
            A simple learning experience designed to help you move from
            understanding concepts to applying them with confidence.
          </p>


          <div className="grid md:grid-cols-4 gap-6 mt-16">

            {[
              {
                number: "01",
                title: "Choose",
                text: "Select a course that matches your goals.",
              },
              {
                number: "02",
                title: "Learn",
                text: "Study structured lessons at your own pace.",
              },
              {
                number: "03",
                title: "Assess",
                text: "Test your understanding through assessments.",
              },
              {
                number: "04",
                title: "Certify",
                text: "Complete your journey and earn your certificate.",
              },
            ].map((step) => (

              <div
                key={step.number}
                className="relative"
              >

                <div className="text-[#D5C8AE] text-5xl font-bold">
                  {step.number}
                </div>

                <h3 className="text-xl font-semibold text-[#183A2C] mt-3">
                  {step.title}
                </h3>

                <p className="text-gray-500 text-sm leading-6 mt-3">
                  {step.text}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =========================================================
          CTA
      ========================================================= */}
      <section className="bg-[#073B2A]">

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20 lg:py-24">

          <div className="bg-[#0D4A36] rounded-[32px] border border-white/10 px-8 lg:px-16 py-12 lg:py-16 flex flex-col lg:flex-row items-center justify-between gap-10">

            <div className="max-w-[750px]">

              <p className="text-[#D4A44C] text-xs uppercase tracking-[3px] font-semibold">
                Start Your Journey
              </p>

              <h2 className="text-white text-3xl lg:text-5xl font-semibold mt-4 leading-tight">
                Ready to build your professional knowledge?
              </h2>

              <p className="text-white/60 mt-5 leading-7">
                Explore our programs and find the right learning path for
                your career.
              </p>

            </div>

            <a
              href="#courses"
              className="shrink-0 inline-flex items-center gap-3 bg-[#D19A32] hover:bg-[#E1AA43] text-white px-8 py-4 rounded-full font-semibold transition"
            >
              Explore Courses
              <FaArrowRight />
            </a>

          </div>

        </div>

      </section>

    </div>
  );
};

export default CategoryLandingPage;