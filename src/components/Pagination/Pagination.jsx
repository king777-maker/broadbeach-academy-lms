const Pagination = () => {
  return (
    <div className="mt-16 flex flex-wrap items-center justify-center gap-3">

      {/* Previous */}

      <button
        className="
          px-5
          h-12
          rounded-xl
          border
          border-[#D7DFF3]
          bg-white
          text-[#1E3A66]
          font-medium
          hover:bg-[#2563EB]
          hover:text-white
          transition
        "
      >
        ← Previous
      </button>

      {/* Page Numbers */}

      {[1, 2, 3, 4, 5].map((page) => (
        <button
          key={page}
          className={`
            w-12
            h-12
            rounded-xl
            font-semibold
            transition
            ${
              page === 1
                ? "bg-[#2563EB] text-white"
                : "bg-white border border-[#D7DFF3] text-[#1E3A66] hover:bg-[#2563EB] hover:text-white"
            }
          `}
        >
          {page}
        </button>
      ))}

      {/* Ellipsis */}

      <span className="px-2 text-xl text-gray-500">...</span>

      {/* Last Page */}

      <button
        className="
          w-12
          h-12
          rounded-xl
          border
          border-[#D7DFF3]
          bg-white
          text-[#1E3A66]
          font-semibold
          hover:bg-[#2563EB]
          hover:text-white
          transition
        "
      >
        12
      </button>

      {/* Next */}

      <button
        className="
          px-5
          h-12
          rounded-xl
          bg-[#2563EB]
          text-white
          font-medium
          hover:bg-[#1E3A66]
          transition
        "
      >
        Next →
      </button>

    </div>
  );
};

export default Pagination;