import React from "react";
import { Link } from "react-router-dom";

const AccreditationsApprovals = () => {
    return (
        <div className="min-h-screen bg-[#F7F9FC]">

            {/* Hero */}
            <section className="relative overflow-hidden bg-[#183B73] text-white py-16 sm:py-20 lg:py-24">
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10" />
                <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[#F7C600]/10" />

                <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 text-center">
                    <div className="text-5xl mb-5">🏆</div>

                    <h1 className="!text-[34px] sm:!text-[42px] md:!text-[48px] font-bold">
                        Accreditations & Approvals
                    </h1>

                    <p className="mt-5 max-w-3xl mx-auto text-white/80 text-[16px] sm:text-[18px] leading-8">
                        Information about accreditation, certification and
                        quality-focused learning standards.
                    </p>
                </div>
            </section>

            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-4 flex gap-2 text-sm text-gray-500">
                    <Link to="/" className="hover:text-[#183B73]">
                        Home
                    </Link>
                    <span>/</span>
                    <span className="text-[#183B73] font-medium">
                        Accreditations & Approvals
                    </span>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12">

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 mb-10">
                    <p className="text-gray-700 text-[16px] sm:text-[17px] leading-8">
                        Broadbeach Learning provides structured learning and
                        certification pathways. Accreditation and approval
                        information should be understood in the context of
                        the specific course or program.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">

                    {[
                        ["✓", "Quality Focus", "Structured learning resources and processes."],
                        ["🎓", "Certification", "Course and assessment based certification pathways."],
                        ["🔎", "Verification", "Digital verification options where applicable."],
                    ].map(([icon, title, text]) => (
                        <div
                            key={title}
                            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-[#F7C600]/15 flex items-center justify-center text-2xl mb-5">
                                {icon}
                            </div>

                            <h2 className="!text-[20px] font-bold text-[#183B73] mb-3">
                                {title}
                            </h2>

                            <p className="text-gray-600 leading-7">
                                {text}
                            </p>
                        </div>
                    ))}

                </div>

                {[
                    ["Quality & Standards", "Learning programs may be structured around recognized quality and professional standards where applicable."],
                    ["Certification Pathways", "Course completion, assessment and certificate eligibility depend on the requirements of the relevant program."],
                    ["Program Information", "Learners should review individual course information for applicable certification, approval or recognition details."],
                    ["Verification", "Where verification services are provided, certificate information can be checked through the available verification process."],
                ].map(([title, text], index) => (
                    <section key={title} className="mb-10">
                        <div className="flex gap-4 items-start mb-4">
                            <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-[#183B73] text-white flex items-center justify-center font-bold">
                                {String(index + 1).padStart(2, "0")}
                            </div>

                            <h2 className="!text-[23px] sm:!text-[27px] font-bold text-[#183B73]">
                                {title}
                            </h2>
                        </div>

                        <p className="sm:pl-14 text-gray-600 leading-8">
                            {text}
                        </p>
                    </section>
                ))}

                <section className="mt-14 rounded-3xl bg-[#183B73] p-8 sm:p-12 text-center">
                    <h2 className="!text-[28px] sm:!text-[32px] font-bold text-white">
                        Explore Our Courses
                    </h2>

                    <p className="mt-3 text-white/80">
                        View available programs and learning opportunities.
                    </p>

                    <Link
                        to="/course"
                        className="inline-flex mt-7 px-7 py-3 rounded-xl bg-[#F7C600] text-[#183B73] font-bold hover:bg-white transition-all"
                    >
                        View Courses
                    </Link>
                </section>

            </main>
        </div>
    );
};

export default AccreditationsApprovals;