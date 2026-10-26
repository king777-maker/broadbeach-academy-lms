import BlogCard from "./BlogCard";
import blogData from "./blogData";

const RecentBlogs = () => {
  return (
    <section className="bg-white py-14 lg:py-18 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <div className="w-8 sm:w-12 h-[3px] bg-amber-400 rounded-full"></div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0a1e38] tracking-tight">
              Recent Blog Posts
            </h2>
            <div className="w-8 sm:w-12 h-[3px] bg-amber-400 rounded-full"></div>
          </div>

          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Explore the latest articles on training, certifications, compliance,
            and career growth.
          </p>
        </div>

        {/* Blog Cards */}
        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-6 sm:gap-8
          "
        >
          {blogData.slice(0, 3).map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
            />
          ))}
        </div>

        {/* View All */}
        <div className="flex justify-center mt-12 sm:mt-14">
          <a
            href="https://medium.com/@broadbeach.in"
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex
              items-center
              justify-center
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-bold
              text-sm sm:text-base
              px-8
              py-3
              rounded-xl
              transition-all
              duration-200
              active:scale-98
              shadow-xs
              hover:shadow-md
            "
          >
            View All Blogs
          </a>
        </div>
      </div>
    </section>
  );
};

export default RecentBlogs;