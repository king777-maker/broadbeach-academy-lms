import { FaArrowLeft, FaArrowRight, FaCheckCircle, FaSpinner } from "react-icons/fa";

const NavigationButtons = ({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
  submitting = false,
}) => {
  const isFirst = currentQuestion === 0;
  const isLast = currentQuestion === totalQuestions - 1;

  return (
    <div className="mt-8 flex items-center justify-between">

      {/* Previous */}

      <button
        type="button"
        onClick={onPrevious}
        disabled={isFirst || submitting}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300
          ${
            isFirst || submitting
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
      >
        <FaArrowLeft />
        Previous
      </button>

      {/* Question Counter */}

      <div className="hidden md:flex items-center gap-2 px-5 py-3 rounded-xl bg-white shadow border">

        <span className="text-gray-500">
          Question
        </span>

        <span className="font-bold text-[#183B73]">
          {currentQuestion + 1}
        </span>

        <span className="text-gray-500">
          /
        </span>

        <span className="font-bold text-[#183B73]">
          {totalQuestions}
        </span>

      </div>

      {/* Next / Submit */}

      {!isLast ? (
        <button
          type="button"
          onClick={onNext}
          disabled={submitting}
          className="flex items-center gap-2 bg-[#183B73] hover:bg-[#0F2952] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Next
          <FaArrowRight />
        </button>
      ) : (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            if (!submitting && onSubmit) {
              onSubmit();
            }
          }}
          disabled={submitting}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-7 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-md hover:shadow-lg"
        >
          {submitting ? (
            <>
              <FaSpinner className="animate-spin text-lg" />
              Submitting...
            </>
          ) : (
            <>
              <FaCheckCircle className="text-lg" />
              Submit Assessment
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default NavigationButtons;