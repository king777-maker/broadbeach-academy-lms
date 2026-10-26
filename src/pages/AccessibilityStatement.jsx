import React from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  CheckCircle2,
  Keyboard,
  Monitor,
  Volume2,
  Mail,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

const AccessibilityStatement = () => {
  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Header Banner */}
      <section className="bg-[#183B73] text-white py-16 sm:py-20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-5 relative z-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 flex items-center justify-center text-[#FFDB58]">
            <Eye size={36} />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Accessibility Statement
          </h1>

          <p className="mt-4 text-white/80 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Broadbeach Academy is committed to ensuring digital accessibility
            for all learners, including individuals with disabilities.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-slate-200">
            <span>Standard: WCAG 2.2 Level AA</span>
            <span>•</span>
            <span>Status: Continual Conformance</span>
          </div>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 py-3.5 flex items-center gap-2 text-xs sm:text-sm text-gray-500">
          <Link to="/" className="hover:text-[#183B73] transition">
            Home
          </Link>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-[#183B73] font-semibold">
            Accessibility Statement
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-12 space-y-10">
        {/* Commitment Overview */}
        <section className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73] flex items-center gap-2.5">
            <ShieldCheck size={24} />
            <span>Our Commitment</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            At Broadbeach Academy, we firmly believe that education should be
            accessible to everyone regardless of ability or technology. We are
            actively working to increase the accessibility and usability of our
            website, course catalog, interactive lessons, and digital assessment
            portal in accordance with the{" "}
            <strong>Web Content Accessibility Guidelines (WCAG) 2.2 Level AA</strong>.
          </p>
        </section>

        {/* Core Accessibility Pillars */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#183B73] flex items-center justify-center font-bold">
              <Keyboard size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Keyboard Operability
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              All major navigation menus, course filters, buttons, modal dialogs,
              and assessment quizzes are fully operable using keyboard tab sequences.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Monitor size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Visual Contrast & Scaling
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Color contrast ratios meet or exceed 4.5:1 for body text and 3:1 for
              large UI headings. Content scales smoothly up to 200% zoom without loss of functionality.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Volume2 size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Screen-Reader Support
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We employ semantic HTML5 markup, ARIA roles, descriptive alt texts,
              and unambiguous form labels to support assistive technologies (NVDA, JAWS, VoiceOver).
            </p>
          </div>
        </section>

        {/* Standards & Technical Measures */}
        <section className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73]">
            Technical Measures & Conformance Actions
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-slate-700">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Accessible Focus Indicators:</strong> High-visibility outline rings assist keyboard navigation across all interactive elements.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Semantic Form Controls:</strong> Every registration, login, and support input is linked to an explicit label and clear error status.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Video Captions & Transcripts:</strong> Video lectures utilize YouTube's caption infrastructure where available, supplemented by syllabus slide decks.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Reduced Motion Respect:</strong> We honor the user's OS-level <code className="bg-slate-100 px-1 rounded">prefers-reduced-motion</code> setting to minimize distracting animation.
              </span>
            </div>
          </div>
        </section>

        {/* Known Limitations */}
        <section className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xs space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <AlertCircle size={22} className="text-amber-600" />
            <span>Known Limitations & Ongoing Refinements</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            While we strive for complete compliance, some legacy course slide
            PDFs or third-party video presentations may have variable caption
            accuracy. We are actively reviewing our curriculum library to replace
            any non-compliant materials with accessible formats.
          </p>
        </section>

        {/* Feedback & Contact */}
        <section className="bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-2xl border border-blue-200/60 p-6 sm:p-8 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183B73]">
            Accessibility Feedback & Assistance
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            If you encounter an accessibility barrier or require course materials
            in an alternate format, please contact our Accessibility Coordinator:
          </p>
          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-slate-700">
              <Mail size={16} className="text-[#183B73]" />
              <a
                href="mailto:info@broadbeach.in?subject=Accessibility%20Inquiry"
                className="font-bold text-[#183B73] hover:underline"
              >
                info@broadbeach.in
              </a>
            </div>
            <div className="text-slate-500">
              Response commitment: Within 3 business days
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AccessibilityStatement;
