import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiSliders, FiBookOpen, FiAward } from "react-icons/fi";
import CertificateCard from "./CertificateCard";
import { getFreeCertifications } from "../../api/api";

const fallbackFreeCerts = [
    {
        id: "1",
        name: "ISO 9001:2015 Quality Management Foundation",
        category: "Quality",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900",
        students_count: 2850,
        rating: 4.9,
        duration: "12 Hours",
        description: "Master the foundational concepts of quality management systems with official certification.",
    },
    {
        id: "2",
        name: "ISO 14001:2015 Environmental Foundation",
        category: "Environment",
        image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=900",
        students_count: 1960,
        rating: 4.8,
        duration: "12 Hours",
        description: "Understand environmental impact analysis, sustainability, and compliance obligations.",
    },
    {
        id: "3",
        name: "ISO 45001:2018 OH&S Awareness Course",
        category: "Health & Safety",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900",
        students_count: 3240,
        rating: 4.9,
        duration: "14 Hours",
        description: "Key principles for mitigating workplace risks, occupational health, and safety protocols.",
    },
    {
        id: "4",
        name: "ISO/IEC 27001:2022 Information Security Essentials",
        category: "Cybersecurity",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=900",
        students_count: 4500,
        rating: 5.0,
        duration: "16 Hours",
        description: "Introduction to ISMS, security controls, and cyber risk management frameworks.",
    },
    {
        id: "5",
        name: "Lean Six Sigma Yellow Belt Certification",
        category: "Operational Excellence",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900",
        students_count: 5120,
        rating: 4.9,
        duration: "10 Hours",
        description: "Master DMAIC fundamentals to participate effectively in process improvement initiatives.",
    },
    {
        id: "6",
        name: "HACCP & Food Safety Awareness Program",
        category: "Food Safety",
        image: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=900",
        students_count: 1720,
        rating: 4.8,
        duration: "10 Hours",
        description: "Critical control points, hazard analysis, and hygienic practices in food handling.",
    },
];

const FreeCertifications = () => {
    const [certificates, setCertificates] = useState(fallbackFreeCerts);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("popular");

    useEffect(() => {
        const fetchCertifications = async () => {
            try {
                const response = await getFreeCertifications();
                if (response.data?.success && Array.isArray(response.data?.data) && response.data.data.length > 0) {
                    setCertificates(response.data.data);
                } else {
                    setCertificates(fallbackFreeCerts);
                }
            } catch (err) {
                setCertificates(fallbackFreeCerts);
            }
        };
        fetchCertifications();
    }, []);

    // Unique Categories List
    const categories = useMemo(() => {
        const set = new Set();
        certificates.forEach((c) => {
            if (c.category) set.add(c.category);
        });
        return ["All", ...Array.from(set)];
    }, [certificates]);

    // Filter & Sort Logic
    const filteredCertificates = useMemo(() => {
        return certificates
            .filter((c) => {
                const matchesSearch =
                    !searchQuery ||
                    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.category?.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesCategory =
                    selectedCategory === "All" || c.category === selectedCategory;
                return matchesSearch && matchesCategory;
            })
            .sort((a, b) => {
                if (sortBy === "rating") {
                    return Number(b.rating || 0) - Number(a.rating || 0);
                }
                if (sortBy === "name") {
                    return (a.name || "").localeCompare(b.name || "");
                }
                return Number(b.students_count || 0) - Number(a.students_count || 0);
            });
    }, [certificates, searchQuery, selectedCategory, sortBy]);

    return (
        <section className="py-16 bg-white relative overflow-hidden">
            {/* Background Subtle Gradient */}
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-slate-50 to-transparent pointer-events-none" />

            <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-800 text-xs font-semibold mb-3">
                            <FiAward className="text-amber-500" />
                            <span>100% Free Certifications</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a1e38] tracking-tight">
                            Explore Free Certified Programs
                        </h2>
                        <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
                            Start building verified credentials at zero cost. Complete the course, pass the assessment, and download your globally recognized certificate instantly.
                        </p>
                    </div>

                    {/* Quick Stats Pill */}
                    <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/80 rounded-2xl p-3 sm:px-5 shrink-0 shadow-xs">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold border border-blue-100">
                                <FiBookOpen />
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 font-medium">Free Access</div>
                                <div className="text-sm font-bold text-[#0a1e38]">6+ Tracks</div>
                            </div>
                        </div>
                        <div className="w-px h-8 bg-slate-200" />
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold border border-amber-100">
                                <FiAward />
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 font-medium">Accreditation</div>
                                <div className="text-sm font-bold text-[#0a1e38]">Verified</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters & Search Control Bar */}
                <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-3 sm:p-4 mb-8 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-xs">
                    {/* Category Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                                    selectedCategory === cat
                                        ? "bg-[#0a1e38] text-white shadow-xs"
                                        : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search & Sort */}
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                            <input
                                type="text"
                                placeholder="Search free courses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600"
                            />
                        </div>

                        <div className="relative shrink-0">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-700 font-medium focus:outline-none focus:border-blue-600 cursor-pointer"
                            >
                                <option value="popular">Most Enrolled</option>
                                <option value="rating">Top Rated</option>
                                <option value="name">Alphabetical</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Cards Grid */}
                {filteredCertificates.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                        {filteredCertificates.map((cert) => (
                            <CertificateCard key={cert.id} certificate={cert} />
                        ))}
                    </div>
                ) : (
                    <div className="py-16 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                        <FiBookOpen className="text-3xl text-slate-400 mx-auto mb-2" />
                        <h4 className="text-base font-bold text-slate-700">No free certifications found</h4>
                        <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or category filter.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FreeCertifications;