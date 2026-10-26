import CategoryCard from "./CategoryCard";
import categoryData from "./categoryData";

const CourseCategories = () => {
    return (
        <section className="bg-white py-12 lg:py-16">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* HEADING */}
                <div className="text-center mb-10 lg:mb-14">
                    <div className="flex items-center justify-center gap-3 sm:gap-4">
                        <span className="w-8 sm:w-12 h-[3px] bg-amber-400 rounded-full"></span>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0a1e38] tracking-tight">
                            Explore Courses by Category
                        </h2>
                        <span className="w-8 sm:w-12 h-[3px] bg-amber-400 rounded-full"></span>
                    </div>

                    <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
                        Build in-demand skills through internationally recognized certification programs.
                    </p>
                </div>

                {/* CATEGORIES GRID */}
                <div
                    className="
                        grid
                        grid-cols-2
                        sm:grid-cols-3
                        md:grid-cols-4
                        lg:grid-cols-5
                        gap-4 sm:gap-6
                    "
                >

                    {categoryData.map((category) => (

                        <CategoryCard
                            key={category.id}
                            category={category}
                        />

                    ))}

                </div>

            </div>

        </section>
    );
};

export default CourseCategories;