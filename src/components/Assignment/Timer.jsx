import { FaClock } from "react-icons/fa";

const Timer = ({ timeLeft }) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  const isWarning = timeLeft <= 5 * 60; // Last 5 minutes

  return (
    <div
      className={`flex items-center gap-3 px-5 py-3 rounded-xl border shadow-sm transition-all duration-300 ${
        isWarning
          ? "bg-red-50 border-red-300"
          : "bg-white border-gray-200"
      }`}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isWarning ? "bg-red-100" : "bg-blue-100"
        }`}
      >
        <FaClock
          className={`text-xl ${
            isWarning ? "text-red-600" : "text-blue-600"
          }`}
        />
      </div>

      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          Time Remaining
        </p>

        <h2
          className={`text-2xl font-bold ${
            isWarning ? "text-red-600" : "text-[#183B73]"
          }`}
        >
          {formattedTime}
        </h2>

        {isWarning && (
          <p className="text-xs text-red-500 mt-1">
            Less than 5 minutes remaining!
          </p>
        )}
      </div>
    </div>
  );
};

export default Timer;