export const CourseCardSkeleton = () => {
    return (
        <div
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col h-full animate-pulse"
            aria-busy="true"
            aria-label="Loading course information"
        >
            {/* Image Placeholder */}
            <div className="w-full h-48 bg-slate-200 relative">
                <div className="absolute top-3 left-3 w-20 h-6 bg-slate-300 rounded-full" />
            </div>

            {/* Content Placeholder */}
            <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                    {/* Meta tags line */}
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-4 w-16 bg-slate-200 rounded" />
                        <div className="h-4 w-16 bg-slate-200 rounded" />
                    </div>

                    {/* Title lines */}
                    <div className="h-5 bg-slate-200 rounded w-5/6 mb-2" />
                    <div className="h-5 bg-slate-200 rounded w-3/5 mb-4" />

                    {/* Description preview */}
                    <div className="h-3.5 bg-slate-100 rounded w-full mb-2" />
                    <div className="h-3.5 bg-slate-100 rounded w-4/5 mb-4" />
                </div>

                {/* Footer line */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <div className="h-5 w-20 bg-slate-200 rounded" />
                    <div className="h-8 w-24 bg-slate-200 rounded-lg" />
                </div>
            </div>
        </div>
    );
};

export default CourseCardSkeleton;
