import { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import { getFeaturedCourses } from "../../api/api";
import { courseData } from "../../data/courseData";

const FeaturedCourses = () => {
    const [courses, setCourses] = useState(courseData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // =====================================================
    // FETCH FEATURED COURSES
    // =====================================================
    useEffect(() => {
        let isMounted = true;

        const fetchFeaturedCourses = async () => {
            try {
                const response = await getFeaturedCourses();
                const apiData = response?.data;

                if (
                    apiData?.success &&
                    Array.isArray(apiData?.data) &&
                    apiData.data.length > 0
                ) {
                    if (isMounted) {
                        setCourses(apiData.data);
                        setError("");
                    }
                } else {
                    if (isMounted) {
                        setCourses(courseData);
                    }
                }
            } catch (err) {
                if (isMounted) {
                    setCourses(courseData);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchFeaturedCourses();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <section className="bg-[#f8faff] py-14 lg:py-18 border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* HEADING */}
                <div className="text-center mb-10 lg:mb-14">
                    <div className="flex items-center justify-center gap-3 sm:gap-4">
                        <div className="w-8 sm:w-12 h-[3px] bg-amber-400 rounded-full shrink-0"></div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0a1e38] tracking-tight">
                            Featured Courses
                        </h2>
                        <div className="w-8 sm:w-12 h-[3px] bg-amber-400 rounded-full shrink-0"></div>
                    </div>

                    <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
                        Build in-demand skills, earn respected credentials, and advance your professional career.
                    </p>
                </div>

                {/* LOADING */}
                {loading && (
                    <div className="py-16 text-center text-[#102F53] text-base font-semibold">
                        <div className="inline-flex items-center gap-3">
                            <span className="w-5 h-5 border-2 border-[#102F53] border-t-transparent rounded-full animate-spin"></span>
                            Loading featured courses...
                        </div>
                    </div>
                )}

                {/* ERROR */}
                {error && !courses.length && (
                    <div className="py-12 text-center text-red-500 font-medium">
                        {error}
                    </div>
                )}

                {/* COURSES GRID */}
                {!loading && courses.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {courses.slice(0, 8).map((course) => (
                            <CourseCard
                                key={course.id || course.slug}
                                course={course}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedCourses;