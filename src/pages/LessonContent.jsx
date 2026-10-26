import { useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaPlay,
    FaBookOpen,
    FaImages,
    FaCheckCircle,
    FaLightbulb,
} from "react-icons/fa";

import { courseData } from "../data/courseData";

const LessonContent = () => {
    const navigate = useNavigate();
    const { courseId, lessonId } = useParams();

    // ============================================
    // FIND COURSE
    // ============================================

    const course = courseData.find(
        (item) => item.id === Number(courseId)
    );

    // ============================================
    // CHAPTER CONTENT
    // Later this can come from PHP / MySQL API
    // ============================================

    const chapterContents = {
        1: {
            chapterTitle: "Introduction to ISO 14001",

            chapterDescription:
                "This chapter provides an introduction to ISO 14001 and Environmental Management Systems.",

            sections: [
                {
                    title: "Introduction to ISO 14001",

                    paragraphs: [
                        "ISO 14001 is an internationally recognized standard for Environmental Management Systems (EMS). It provides organizations with a structured framework for managing environmental responsibilities.",

                        "The standard helps organizations identify environmental impacts, establish environmental objectives and improve their overall environmental performance.",

                        "ISO 14001 can be applied by organizations of different sizes and industries that want to manage their environmental responsibilities systematically."
                    ]
                },

                {
                    title: "What is ISO 14001?",

                    paragraphs: [
                        "ISO 14001 specifies requirements for establishing, implementing, maintaining and continually improving an Environmental Management System.",

                        "It provides organizations with a systematic framework for protecting the environment and responding to changing environmental conditions.",

                        "Organizations can use the standard to integrate environmental management practices into their regular business operations."
                    ]
                },

                {
                    title: "Purpose of ISO 14001",

                    paragraphs: [
                        "The purpose of ISO 14001 is to help organizations improve environmental performance while meeting regulatory and organizational requirements.",

                        "It encourages organizations to identify environmental risks and opportunities and establish appropriate controls.",

                        "The standard also promotes continual improvement so that environmental performance can improve over time."
                    ]
                },

                {
                    title: "Environmental Management System (EMS)",

                    paragraphs: [
                        "An Environmental Management System provides organizations with processes and procedures for identifying, managing, monitoring and improving environmental performance.",

                        "An EMS helps organizations understand how their activities, products and services interact with the environment.",

                        "Organizations can then establish controls and objectives to reduce negative environmental impacts."
                    ]
                },

                {
                    title: "Key Principles of ISO 14001",

                    paragraphs: [
                        "ISO 14001 is based on important principles such as leadership, environmental protection, risk-based thinking, compliance obligations and continual improvement.",

                        "Top management plays an important role in ensuring that environmental management is integrated into the organization's strategic direction.",

                        "Employees and other relevant stakeholders may also contribute to achieving environmental objectives."
                    ]
                },

                {
                    title: "Benefits of ISO 14001",

                    paragraphs: [
                        "Implementing ISO 14001 can help organizations improve environmental performance and reduce unnecessary consumption of resources.",

                        "It can also help organizations improve regulatory compliance, reduce environmental risks and strengthen stakeholder confidence.",

                        "Effective environmental management may also contribute to operational efficiency and long-term sustainability."
                    ]
                },

                {
                    title: "Chapter Summary",

                    paragraphs: [
                        "This chapter introduced the fundamental concepts of ISO 14001 and Environmental Management Systems.",

                        "ISO 14001 provides organizations with a systematic framework for identifying and managing environmental responsibilities.",

                        "The concepts introduced in this chapter provide the foundation for understanding the remaining requirements of the standard."
                    ]
                }
            ]
        }
    };

    // ============================================
    // GET CURRENT CHAPTER
    // ============================================

    const chapter =
        chapterContents[Number(lessonId)] || {
            chapterTitle: `Chapter ${lessonId}`,

            chapterDescription:
                "Learning material for this chapter will be available soon.",

            sections: [],
        };

    // ============================================
    // COMPLETE CHAPTER
    // ============================================

    const handleComplete = () => {
        console.log(`Chapter ${lessonId} completed`);

        // Later:
        // Save completion status to PHP/MySQL here.

        navigate(`/learning/${courseId}`);
    };

    // ============================================
    // COURSE NOT FOUND
    // ============================================

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Course Not Found
            </div>
        );
    }

    return (
        <section className="bg-[#F4F7FC] min-h-screen py-6">
            <div className="max-w-6xl mx-auto px-4 md:px-5">

                {/* BACK */}

                <button
                    type="button"
                    onClick={() => navigate(`/learning/${courseId}`)}
                    className="
            flex
            items-center
            gap-2
            text-[#2563EB]
            font-semibold
            mb-4
            hover:text-[#183B73]
            transition
          "
                >
                    <FaArrowLeft />

                    Back to Course
                </button>

                {/* MAIN CARD */}

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

                    {/* HEADER */}

                    <div className="px-5 md:px-7 py-4 border-b">
                        <div className="flex flex-wrap justify-between items-center gap-4">

                            {/* LEFT */}

                            <div>
                                {chapter.sections.map((section, index) => (
                                    <article
                                        key={index}
                                        className="
      py-9
      first:pt-0
      border-b
      border-gray-200
      last:border-b-0
    "
                                    >
                                        {/* SECTION HEADING */}

                                        <div className="flex items-start gap-4">

                                            <span
                                                className="
          shrink-0
          bg-[#2563EB]
          text-white
          font-bold
          text-sm
          px-3
          py-1.5
          rounded-md
          mt-1
        "
                                            >
                                                {lessonId}.{index + 1}
                                            </span>

                                            <h2 className="text-2xl md:text-[28px] font-bold text-[#183B73]">
                                                {section.title}
                                            </h2>

                                        </div>

                                        {/* PARAGRAPHS */}

                                        <div className="mt-5 space-y-4">

                                            {section.paragraphs.map((paragraph, paragraphIndex) => (
                                                <p
                                                    key={paragraphIndex}
                                                    className="
            text-gray-700
            text-[16px]
            leading-8
          "
                                                >
                                                    {paragraph}
                                                </p>
                                            ))}

                                        </div>

                                    </article>
                                ))}

                                
                            </div>

                            

                            
                        </div>
                    </div>

                  
                </div>
            </div>
        </section>
    );
};

export default LessonContent;