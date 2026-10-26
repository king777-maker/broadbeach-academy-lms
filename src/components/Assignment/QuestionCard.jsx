import React from "react";

const QuestionCard = ({
    question,
    questionNumber,
    selectedAnswer,
    onSelectAnswer,
}) => {
    if (!question) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <p className="text-center text-red-500 font-medium">
                    Question not available.
                </p>
            </div>
        );
    }

    const questionText =
        question.question ??
        question.question_text ??
        question.title ??
        "";

    const options = Array.isArray(question.options)
        ? question.options
        : [
            question.option_a,
            question.option_b,
            question.option_c,
            question.option_d,
        ].filter(
            (option) =>
                option !== null &&
                option !== undefined &&
                option !== ""
        );

    return (
        <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 md:p-8">

            <div className="
                flex flex-col sm:flex-row
                sm:items-center sm:justify-between
                gap-3 mb-6
            ">
                <span className="
                    w-fit px-4 py-1.5
                    bg-blue-100 text-blue-700
                    rounded-full text-sm font-semibold
                ">
                    Question {questionNumber}
                </span>

                <span className="text-sm text-gray-500">
                    Select one correct answer
                </span>
            </div>

            <h2 className="
                !text-[18px]
                sm:!text-[20px]
                md:!text-[22px]
                lg:!text-[24px]
                font-bold
                text-[#183B73]
                leading-relaxed
            ">
                {questionText}
            </h2>

            <div className="mt-8 space-y-4">

                {options.length > 0 ? (
                    options.map((option, index) => {

                        let optionValue = option;

                        if (
                            typeof option === "object" &&
                            option !== null
                        ) {
                            optionValue =
                                option.option_text ??
                                option.text ??
                                option.value ??
                                option.answer ??
                                "";
                        }

                        const value = String(
                            optionValue ?? ""
                        );

                        const selected = String(
                            selectedAnswer ?? ""
                        );

                        const isSelected =
                            selected === value;

                        return (
                            <label
                                key={
                                    option?.id ??
                                    index
                                }
                                className={`
                                    flex items-center gap-4
                                    p-4 sm:p-5
                                    rounded-xl border
                                    cursor-pointer
                                    transition-all duration-300
                                    ${
                                        isSelected
                                            ? `
                                                border-blue-600
                                                bg-blue-50
                                                shadow-md
                                            `
                                            : `
                                                border-gray-200
                                                hover:border-blue-400
                                                hover:bg-gray-50
                                            `
                                    }
                                `}
                            >

                                <input
                                    type="radio"
                                    name={`question-${questionNumber}`}
                                    value={value}
                                    checked={isSelected}
                                    onChange={(event) => {
                                        onSelectAnswer(
                                            questionNumber,
                                            event.target.value
                                        );
                                    }}
                                    className="
                                        w-5 h-5
                                        flex-shrink-0
                                        accent-blue-600
                                        cursor-pointer
                                    "
                                />

                                <span className="
                                    text-[15px]
                                    sm:text-[16px]
                                    md:text-[17px]
                                    text-gray-700
                                    leading-relaxed
                                ">
                                    {value}
                                </span>

                            </label>
                        );
                    })
                ) : (
                    <div className="
                        p-5
                        bg-yellow-50
                        border border-yellow-200
                        rounded-xl
                        text-yellow-700
                        text-center
                    ">
                        No options available for this question.
                    </div>
                )}

            </div>
        </div>
    );
};

export default QuestionCard;