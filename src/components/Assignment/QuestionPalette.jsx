import React from "react";

const QuestionPalette = ({
    totalQuestions = 0,
    currentQuestion = 0,
    answers = {},
    onQuestionSelect,
}) => {

    const questionCount =
        Math.max(0, Number(totalQuestions) || 0);

    const isAnswered = (questionNumber) =>
        Object.prototype.hasOwnProperty.call(
            answers,
            questionNumber
        );

    const answeredCount = Array.from(
        { length: questionCount },
        (_, index) => index + 1
    ).filter(isAnswered).length;

    const progressPercentage =
        questionCount > 0
            ? Math.min(
                100,
                (answeredCount / questionCount) * 100
            )
            : 0;

    return (
        <div className="
            bg-white
            rounded-2xl
            shadow-lg
            p-6
            sticky
            top-24
        ">

            {/* TITLE */}
            <h2 className="
                text-xl
                font-bold
                text-[#183B73]
            ">
                Question Palette
            </h2>

            <p className="
                text-gray-500
                text-sm
                mt-1
            ">
                Click a question number to jump directly.
            </p>

            {/* QUESTIONS */}
            {questionCount > 0 ? (

                <div className="
                    grid
                    grid-cols-4
                    gap-3
                    mt-6
                ">

                    {Array.from(
                        { length: questionCount },
                        (_, index) => {

                            const questionNumber =
                                index + 1;

                            const isCurrent =
                                currentQuestion === index;

                            const answered =
                                isAnswered(
                                    questionNumber
                                );

                            let buttonClass = `
                                bg-gray-100
                                text-gray-700
                                hover:bg-gray-200
                            `;

                            if (answered) {
                                buttonClass = `
                                    bg-green-500
                                    text-white
                                    hover:bg-green-600
                                `;
                            }

                            if (isCurrent) {
                                buttonClass = `
                                    bg-blue-600
                                    text-white
                                    ring-4
                                    ring-blue-200
                                `;
                            }

                            return (
                                <button
                                    key={questionNumber}
                                    type="button"
                                    onClick={() =>
                                        onQuestionSelect(index)
                                    }
                                    className={`
                                        w-12
                                        h-12
                                        rounded-xl
                                        font-semibold
                                        flex
                                        items-center
                                        justify-center
                                        transition-all
                                        duration-200
                                        ${buttonClass}
                                    `}
                                >
                                    {questionNumber}
                                </button>
                            );
                        }
                    )}

                </div>

            ) : (

                <div className="
                    mt-6
                    p-4
                    rounded-xl
                    bg-gray-50
                    text-sm
                    text-gray-500
                    text-center
                ">
                    No questions available.
                </div>

            )}

            {/* LEGEND */}
            <div className="
                mt-8
                space-y-3
                border-t
                pt-5
            ">

                <div className="flex items-center gap-3">
                    <div className="
                        w-5 h-5
                        rounded
                        bg-blue-600
                    " />

                    <span className="text-sm text-gray-700">
                        Current Question
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="
                        w-5 h-5
                        rounded
                        bg-green-500
                    " />

                    <span className="text-sm text-gray-700">
                        Answered
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="
                        w-5 h-5
                        rounded
                        bg-gray-200
                        border
                        border-gray-800
                    " />

                    <span className="text-sm text-gray-700">
                        Not Answered
                    </span>
                </div>

            </div>

            {/* PROGRESS */}
            <div className="
                mt-8
                border-t
                pt-5
            ">

                <div className="
                    flex
                    justify-between
                    mb-2
                    text-sm
                    font-medium
                ">
                    <span>Progress</span>

                    <span>
                        {answeredCount} / {questionCount}
                    </span>
                </div>

                <div className="
                    w-full
                    h-3
                    bg-gray-200
                    rounded-full
                    overflow-hidden
                ">
                    <div
                        className="
                            h-full
                            bg-green-500
                            transition-all
                            duration-500
                        "
                        style={{
                            width: `${progressPercentage}%`,
                        }}
                    />
                </div>

            </div>

        </div>
    );
};

export default QuestionPalette;