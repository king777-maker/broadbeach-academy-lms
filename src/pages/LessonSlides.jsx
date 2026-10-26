import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaArrowRight,
  FaPlay,
  FaBookOpen,
  FaImages,
  FaCheckCircle,
  FaUsers,
  FaSearch,
  FaChartLine,
  FaCogs,
  FaHandshake,
  FaUserTie,
  FaLeaf,
  FaClipboardCheck,
  FaRecycle,
  FaLightbulb,
  FaShieldAlt,
  FaGlobe,
} from "react-icons/fa";

import { courseData } from "../data/courseData";

const LessonSlides = () => {

    const [activeLesson, setActiveLesson] = useState(0);

        const [lessons, setLessons] = useState([
        {
            id: 1,
            chapter: "Chapter 1",
            title: "Introduction to ISO 14001",
            duration: "08:30",
            type: "lesson",
            completed: false,
        },
        {
            id: 2,
            chapter: "Chapter 2",
            title: "Environmental Management System",
            duration: "12:15",
            type: "lesson",
            completed: false,
        },
        {
            id: 3,
            chapter: "Chapter 3",
            title: "Context of the Organization",
            duration: "10:45",
            type: "lesson",
            completed: false,
        },
        {
            id: 4,
            chapter: "Chapter 4",
            title: "Leadership & Commitment",
            duration: "14:20",
            type: "lesson",
            completed: false,
        },
        {
            id: 5,
            chapter: "Chapter 5",
            title: "Planning & Risk Assessment",
            duration: "13:40",
            type: "lesson",
            completed: false,
        },
        {
            id: 6,
            chapter: "Chapter 6",
            title: "Support & Resources",
            duration: "09:50",
            type: "lesson",
            completed: false,
        },
        {
            id: 7,
            chapter: "Chapter 7",
            title: "Operational Planning & Control",
            duration: "16:25",
            type: "lesson",
            completed: false,
        },
        {
            id: 8,
            chapter: "Chapter 8",
            title: "Performance Evaluation",
            duration: "11:10",
            type: "lesson",
            completed: false,
        },
        {
            id: 9,
            chapter: "Chapter 9",
            title: "Internal Audit Process",
            duration: "17:35",
            type: "lesson",
            completed: false,
        },
        {
            id: 10,
            chapter: "Chapter 10",
            title: "Corrective Actions",
            duration: "09:40",
            type: "lesson",
            completed: false,
        },
        {
            id: 11,
            chapter: "Chapter 11",
            title: "Continual Improvement",
            duration: "12:30",
            type: "lesson",
            completed: false,
        },
        {
            id: 12,
            chapter: "Chapter 12",
            title: "Course Summary",
            duration: "07:50",
            type: "lesson",
            completed: false,
        },
        {
            id: 13,
            chapter: "Assessment",
            title: "Final Assessment",
            duration: "30 Minutes",
            type: "assessment",
            completed: false,
        },
        {
            id: 14,
            chapter: "Certificate",
            title: "Course Certificate",
            duration: "",
            type: "certificate",
            completed: false,
        },
    ]);

    const toggleCompleted = (lessonId) => {
        setLessons((prev) =>
            prev.map((lesson) =>
                lesson.id === lessonId
                    ? { ...lesson, completed: !lesson.completed }
                    : lesson
            )
        );
    };
  const navigate = useNavigate();
  const { courseId, lessonId } = useParams();
    const currentLesson = lessons[activeLesson];
  const [currentSlide, setCurrentSlide] = useState(0);

  const course = courseData.find(
    (item) => item.id === Number(courseId)
  );

  /* =========================================
     SLIDES DATA
  ========================================= */

  const slides = [
    {
      title: "Environmental Management Principles",
      subtitle: "ISO 14001 - Introduction",
      description:
        "ISO 14001 provides a systematic framework that helps organizations manage their environmental responsibilities and improve environmental performance.",

      centerTitle: "Environmental Management",

      items: [
        {
          title: "Leadership",
          icon: <FaUserTie />,
        },
        {
          title: "People",
          icon: <FaUsers />,
        },
        {
          title: "Planning",
          icon: <FaSearch />,
        },
        {
          title: "Performance",
          icon: <FaChartLine />,
        },
        {
          title: "Processes",
          icon: <FaCogs />,
        },
        {
          title: "Improvement",
          icon: <FaLightbulb />,
        },
      ],
    },

    {
      title: "Environmental Management System",
      subtitle: "Understanding EMS",
      description:
        "An Environmental Management System helps organizations identify environmental impacts, establish objectives and implement processes for continuous improvement.",

      centerTitle: "EMS",

      items: [
        {
          title: "Policy",
          icon: <FaClipboardCheck />,
        },
        {
          title: "Planning",
          icon: <FaSearch />,
        },
        {
          title: "Implementation",
          icon: <FaCogs />,
        },
        {
          title: "Monitoring",
          icon: <FaChartLine />,
        },
        {
          title: "Improvement",
          icon: <FaLightbulb />,
        },
        {
          title: "Review",
          icon: <FaCheckCircle />,
        },
      ],
    },

    {
      title: "Leadership & Commitment",
      subtitle: "ISO 14001 Clause 5",
      description:
        "Top management plays an important role in ensuring that the environmental management system is integrated into the organization's strategic direction.",

      centerTitle: "Leadership",

      items: [
        {
          title: "Commitment",
          icon: <FaHandshake />,
        },
        {
          title: "Policy",
          icon: <FaClipboardCheck />,
        },
        {
          title: "Resources",
          icon: <FaUsers />,
        },
        {
          title: "Communication",
          icon: <FaGlobe />,
        },
        {
          title: "Objectives",
          icon: <FaChartLine />,
        },
        {
          title: "Accountability",
          icon: <FaUserTie />,
        },
      ],
    },

    {
      title: "Environmental Planning",
      subtitle: "ISO 14001 Clause 6",
      description:
        "Environmental planning identifies risks, opportunities, environmental aspects and compliance obligations that can affect environmental performance.",

      centerTitle: "Planning",

      items: [
        {
          title: "Risks",
          icon: <FaShieldAlt />,
        },
        {
          title: "Opportunities",
          icon: <FaLightbulb />,
        },
        {
          title: "Objectives",
          icon: <FaChartLine />,
        },
        {
          title: "Aspects",
          icon: <FaLeaf />,
        },
        {
          title: "Compliance",
          icon: <FaClipboardCheck />,
        },
        {
          title: "Actions",
          icon: <FaCogs />,
        },
      ],
    },

    {
      title: "Support & Resources",
      subtitle: "ISO 14001 Clause 7",
      description:
        "Organizations must provide appropriate resources, competence, awareness, communication and documented information to support the EMS.",

      centerTitle: "Support",

      items: [
        {
          title: "Resources",
          icon: <FaUsers />,
        },
        {
          title: "Competence",
          icon: <FaUserTie />,
        },
        {
          title: "Awareness",
          icon: <FaLightbulb />,
        },
        {
          title: "Communication",
          icon: <FaGlobe />,
        },
        {
          title: "Documents",
          icon: <FaBookOpen />,
        },
        {
          title: "Training",
          icon: <FaClipboardCheck />,
        },
      ],
    },

    {
      title: "Operational Control",
      subtitle: "ISO 14001 Clause 8",
      description:
        "Operational controls help organizations manage activities associated with significant environmental aspects and ensure that planned processes are followed.",

      centerTitle: "Operations",

      items: [
        {
          title: "Processes",
          icon: <FaCogs />,
        },
        {
          title: "Controls",
          icon: <FaShieldAlt />,
        },
        {
          title: "Planning",
          icon: <FaSearch />,
        },
        {
          title: "Suppliers",
          icon: <FaHandshake />,
        },
        {
          title: "Emergency",
          icon: <FaClipboardCheck />,
        },
        {
          title: "Monitoring",
          icon: <FaChartLine />,
        },
      ],
    },

    {
      title: "Performance Evaluation",
      subtitle: "ISO 14001 Clause 9",
      description:
        "Organizations must monitor, measure, analyze and evaluate their environmental performance to determine whether the EMS is achieving its intended results.",

      centerTitle: "Performance",

      items: [
        {
          title: "Monitoring",
          icon: <FaSearch />,
        },
        {
          title: "Measurement",
          icon: <FaChartLine />,
        },
        {
          title: "Analysis",
          icon: <FaClipboardCheck />,
        },
        {
          title: "Audit",
          icon: <FaCheckCircle />,
        },
        {
          title: "Review",
          icon: <FaUsers />,
        },
        {
          title: "Results",
          icon: <FaChartLine />,
        },
      ],
    },

    {
      title: "Internal Audit",
      subtitle: "Evaluating the EMS",
      description:
        "Internal audits provide objective evidence about whether the environmental management system conforms to planned requirements and is effectively implemented.",

      centerTitle: "Internal Audit",

      items: [
        {
          title: "Planning",
          icon: <FaSearch />,
        },
        {
          title: "Evidence",
          icon: <FaClipboardCheck />,
        },
        {
          title: "Auditors",
          icon: <FaUsers />,
        },
        {
          title: "Findings",
          icon: <FaBookOpen />,
        },
        {
          title: "Reporting",
          icon: <FaChartLine />,
        },
        {
          title: "Actions",
          icon: <FaCheckCircle />,
        },
      ],
    },

    {
      title: "Continual Improvement",
      subtitle: "ISO 14001 Clause 10",
      description:
        "Continual improvement helps organizations enhance environmental performance by addressing nonconformities, implementing corrective actions and improving the EMS.",

      centerTitle: "Improvement",

      items: [
        {
          title: "Identify",
          icon: <FaSearch />,
        },
        {
          title: "Correct",
          icon: <FaCogs />,
        },
        {
          title: "Prevent",
          icon: <FaShieldAlt />,
        },
        {
          title: "Improve",
          icon: <FaChartLine />,
        },
        {
          title: "Review",
          icon: <FaClipboardCheck />,
        },
        {
          title: "Repeat",
          icon: <FaRecycle />,
        },
      ],
    },

    {
      title: "Chapter Summary",
      subtitle: "ISO 14001 Internal Auditor",
      description:
        "This chapter introduced the major components of an Environmental Management System and the principles required to understand and audit ISO 14001 requirements.",

      centerTitle: "ISO 14001",

      items: [
        {
          title: "Leadership",
          icon: <FaUserTie />,
        },
        {
          title: "Planning",
          icon: <FaSearch />,
        },
        {
          title: "Support",
          icon: <FaUsers />,
        },
        {
          title: "Operations",
          icon: <FaCogs />,
        },
        {
          title: "Evaluation",
          icon: <FaChartLine />,
        },
        {
          title: "Improvement",
          icon: <FaLightbulb />,
        },
      ],
    },
  ];

  /* =========================================
     COURSE CHECK
  ========================================= */

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Course Not Found
      </div>
    );
  }

  const slide = slides[currentSlide];

  /* =========================================
     NEXT
  ========================================= */

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  /* =========================================
     PREVIOUS
  ========================================= */

  const previousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  /* =========================================
     COMPLETE
  ========================================= */

  const completeSlides = () => {
    navigate(`/learning/${courseId}`);
  };

 return (
  <section className="bg-[#F4F7FC] min-h-screen py-6">

    <div className="max-w-[1500px] mx-auto px-4">

      {/* BACK */}
      <button
        type="button"
        onClick={() => navigate(`/learning/${courseId}`)}
        className="
          flex items-center gap-2
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

      {/* =========================================
          MAIN GRID
      ========================================= */}

      <div className="grid grid-cols-12 gap-6">

        {/* =========================================
            LEFT SIDEBAR
        ========================================= */}

        <aside className="col-span-12 lg:col-span-3">

          <div
            className="
              bg-white
              rounded-2xl
              shadow-lg
              overflow-hidden
              h-[760px]
              flex
              flex-col
              sticky
              top-5
            "
          >

            {/* SIDEBAR HEADER */}

            <div className="bg-[#2563EB] text-white px-5 py-4 flex-shrink-0">

              <h2 className="text-[24px] font-bold">
                Course Content
              </h2>

              <p className="text-blue-100 text-sm mt-1">
                {lessons.filter((item) => item.type === "lesson").length} Lessons
              </p>

            </div>

            {/* LESSON LIST */}

            <div
              className="
                flex-1
                overflow-y-auto
                scrollbar-thin
                scrollbar-thumb-blue-500
                scrollbar-track-gray-100
              "
            >

              {lessons.map((lesson, index) => (

                <div
                  key={lesson.id}

                  onClick={() => {

                    /* ASSESSMENT */

                    if (lesson.type === "assessment") {

                      const completedLessons = lessons.filter(
                        (item) =>
                          item.type === "lesson" &&
                          item.completed
                      ).length;

                      if (completedLessons !== 12) {
                        alert(
                          "Please complete all 12 chapters first."
                        );

                        return;
                      }

                      navigate(
                        `/assignment/${courseId}`
                      );

                      return;
                    }

                    /* CERTIFICATE */

                    if (lesson.type === "certificate") {

                      navigate(
                        `/certificate/${courseId}`
                      );

                      return;
                    }

                    /* NORMAL LESSON */

                    setActiveLesson(index);

                    setCurrentSlide(0);

                  }}

                  className={`
                    cursor-pointer
                    transition-all
                    border-b
                    hover:bg-blue-50

                    ${
                      activeLesson === index
                        ? "bg-blue-50 border-l-4 border-[#2563EB]"
                        : "border-l-4 border-transparent"
                    }
                  `}
                >

                  <div className="flex items-start gap-3 px-4 py-4">

                    {/* CHECKBOX */}

                    {lesson.type === "lesson" && (

                      <input
                        type="checkbox"
                        checked={lesson.completed}

                        onClick={(e) =>
                          e.stopPropagation()
                        }

                        onChange={() =>
                          toggleCompleted(lesson.id)
                        }

                        className="
                          w-5
                          h-5
                          mt-1
                          accent-green-600
                          cursor-pointer
                          flex-shrink-0
                        "
                      />

                    )}

                    {/* LESSON DETAILS */}

                    <div className="flex-1 min-w-0">

                      <p
                        className="
                          text-[11px]
                          uppercase
                          text-gray-400
                          font-semibold
                        "
                      >
                        {lesson.chapter}
                      </p>

                      <h4
                        className="
                          font-semibold
                          text-[14px]
                          text-[#183B73]
                          leading-5
                          mt-1
                        "
                      >
                        {lesson.title}
                      </h4>

                      {lesson.duration && (

                        <span className="text-[12px] text-gray-500">
                          {lesson.duration}
                        </span>

                      )}

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </aside>

        {/* =========================================
            RIGHT SIDE
        ========================================= */}

        <main className="col-span-12 lg:col-span-9">

          {/* =========================================
              HEADER
          ========================================= */}

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-5">

            <div
              className="
                px-6
                py-4
                flex
                flex-wrap
                justify-between
                items-center
                gap-4
              "
            >

              {/* TITLE */}

              <div>

                <span className="text-xs text-[#2563EB] font-semibold">
                  {currentLesson?.chapter}
                </span>

                <h1 className="text-xl md:text-2xl font-bold text-[#183B73]">
                  {currentLesson?.title}
                </h1>

              </div>

              {/* VIDEO / CONTENT / SLIDES */}

              <div className="flex flex-wrap gap-2">

                {/* VIDEO */}

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/video/${courseId}/${currentLesson?.id}`
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    bg-gray-100
                    hover:bg-gray-200
                    px-4
                    py-2
                    rounded-lg
                    text-sm
                    transition
                  "
                >
                  <FaPlay />

                  Video
                </button>

                {/* CONTENT */}

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/content/${courseId}/${currentLesson?.id}`
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    bg-gray-100
                    hover:bg-gray-200
                    px-4
                    py-2
                    rounded-lg
                    text-sm
                    transition
                  "
                >
                  <FaBookOpen />

                  Content
                </button>

                {/* SLIDES */}

                <button
                  type="button"
                  className="
                    flex
                    items-center
                    gap-2
                    bg-[#2563EB]
                    text-white
                    px-4
                    py-2
                    rounded-lg
                    text-sm
                  "
                >
                  <FaImages />

                  Slides
                </button>

              </div>

            </div>

          </div>

          {/* =========================================
              16:9 PRESENTATION
          ========================================= */}

          <div
            className="
              relative
              w-full
              aspect-video
              bg-[#071C3C]
              rounded-xl
              overflow-hidden
              shadow-2xl
              border-[5px]
              border-[#0A2349]
            "
          >

            {/* =========================================
                WHITE SLIDE
            ========================================= */}

            <div
              key={currentSlide}
              className="
                absolute
                top-0
                left-0
                right-0
                bottom-[14%]
                bg-white
                overflow-hidden
                slide-enter
              "
            >

              {/* SLIDE NUMBER */}

              <div
                className="
                  absolute
                  top-4
                  left-4
                  z-40
                  bg-[#102F60]
                  text-white
                  text-[10px]
                  md:text-xs
                  px-3
                  py-1.5
                  rounded
                  shadow
                "
              >
                Slide {currentSlide + 1} of {slides.length}
              </div>

              {/* FULL SCREEN */}

              <button
                type="button"
                className="
                  absolute
                  top-4
                  right-4
                  z-40
                  w-8
                  h-8
                  rounded
                  border
                  bg-white
                  flex
                  items-center
                  justify-center
                  text-gray-500
                  hover:bg-gray-100
                "
              >
                ⛶
              </button>

              {/* TITLE */}

              <div
                className="
                  absolute
                  top-[7%]
                  left-0
                  w-full
                  text-center
                  px-16
                  slide-title
                "
              >

                <h2
                  className="
                    text-lg
                    sm:text-xl
                    md:text-2xl
                    lg:text-[30px]
                    font-bold
                    text-[#102F60]
                  "
                >
                  {slide.title}
                </h2>

                <p
                  className="
                    text-[9px]
                    sm:text-[10px]
                    md:text-xs
                    lg:text-sm
                    text-gray-500
                    font-semibold
                    mt-1
                  "
                >
                  {slide.subtitle}
                </p>

              </div>

              {/* =========================================
                  SLIDE CONTENT
              ========================================= */}

              <div
                className="
                  absolute
                  left-[5%]
                  right-[5%]
                  top-[27%]
                  bottom-[5%]
                  grid
                  grid-cols-[30%_70%]
                  items-center
                "
              >

                {/* DESCRIPTION */}

                <div className="pr-6 slide-description">

                  <p
                    className="
                      text-[#17345F]
                      text-[10px]
                      sm:text-xs
                      md:text-sm
                      lg:text-[15px]
                      leading-5
                      md:leading-6
                      lg:leading-7
                    "
                  >
                    {slide.description}
                  </p>

                </div>

                {/* =========================================
                    CIRCLE DIAGRAM
                ========================================= */}

                <div
                  className="
                    relative
                    h-full
                    flex
                    items-center
                    justify-center
                  "
                >

                  {/* OUTER CIRCLE */}

                  <div
                    className="
                      absolute
                      w-[58%]
                      aspect-square
                      rounded-full
                      border
                      border-gray-200
                    "
                  />

                  {/* INNER CIRCLE */}

                  <div
                    className="
                      absolute
                      w-[39%]
                      aspect-square
                      rounded-full
                      border
                      border-gray-100
                    "
                  />

                  {/* CENTER */}

                  <div
                    className="
                      absolute
                      z-20
                      w-[22%]
                      aspect-square
                      rounded-full
                      bg-[#0C3D78]
                      flex
                      items-center
                      justify-center
                      text-center
                      shadow-lg
                      p-2
                      center-circle-animation
                    "
                  >

                    <span
                      className="
                        text-white
                        text-[8px]
                        sm:text-[9px]
                        md:text-xs
                        lg:text-sm
                        font-bold
                        leading-tight
                      "
                    >
                      {slide.centerTitle}
                    </span>

                  </div>

                  {/* TOP */}

                  <div
                    className="
                      absolute
                      top-[0%]
                      left-1/2
                      -translate-x-1/2
                      flex
                      flex-col
                      items-center
                      diagram-item
                      diagram-item-1
                    "
                  >

                    <CircleIcon>
                      {slide.items[0].icon}
                    </CircleIcon>

                    <ItemText>
                      {slide.items[0].title}
                    </ItemText>

                  </div>

                  {/* TOP RIGHT */}

                  <div
                    className="
                      absolute
                      top-[18%]
                      right-[7%]
                      flex
                      items-center
                      gap-2
                      diagram-item
                      diagram-item-2
                    "
                  >

                    <CircleIcon>
                      {slide.items[1].icon}
                    </CircleIcon>

                    <ItemText>
                      {slide.items[1].title}
                    </ItemText>

                  </div>

                  {/* BOTTOM RIGHT */}

                  <div
                    className="
                      absolute
                      bottom-[16%]
                      right-[8%]
                      flex
                      items-center
                      gap-2
                      diagram-item
                      diagram-item-3
                    "
                  >

                    <CircleIcon>
                      {slide.items[2].icon}
                    </CircleIcon>

                    <ItemText>
                      {slide.items[2].title}
                    </ItemText>

                  </div>

                  {/* BOTTOM */}

                  <div
                    className="
                      absolute
                      bottom-[0%]
                      left-1/2
                      -translate-x-1/2
                      flex
                      flex-col
                      items-center
                      diagram-item
                      diagram-item-4
                    "
                  >

                    <CircleIcon>
                      {slide.items[3].icon}
                    </CircleIcon>

                    <ItemText>
                      {slide.items[3].title}
                    </ItemText>

                  </div>

                  {/* BOTTOM LEFT */}

                  <div
                    className="
                      absolute
                      bottom-[16%]
                      left-[7%]
                      flex
                      flex-row-reverse
                      items-center
                      gap-2
                      diagram-item
                      diagram-item-5
                    "
                  >

                    <CircleIcon>
                      {slide.items[4].icon}
                    </CircleIcon>

                    <ItemText>
                      {slide.items[4].title}
                    </ItemText>

                  </div>

                  {/* TOP LEFT */}

                  <div
                    className="
                      absolute
                      top-[18%]
                      left-[7%]
                      flex
                      flex-row-reverse
                      items-center
                      gap-2
                      diagram-item
                      diagram-item-6
                    "
                  >

                    <CircleIcon>
                      {slide.items[5].icon}
                    </CircleIcon>

                    <ItemText>
                      {slide.items[5].title}
                    </ItemText>

                  </div>

                </div>

              </div>

              {/* DECORATION */}

              <div
                className="
                  absolute
                  -bottom-[16%]
                  -right-[5%]
                  w-[45%]
                  h-[30%]
                  bg-[#0C3D78]
                  rounded-[50%]
                  rotate-[-5deg]
                "
              />

              <div
                className="
                  absolute
                  -bottom-[19%]
                  -right-[1%]
                  w-[35%]
                  h-[25%]
                  bg-[#2563EB]
                  rounded-[50%]
                "
              />

              {/* BRAND */}

              <div
                className="
                  absolute
                  bottom-3
                  left-4
                  text-[8px]
                  sm:text-[9px]
                  md:text-[10px]
                  font-bold
                  text-[#17345F]
                "
              >
                Broadbeach Online Academy
              </div>

            </div>

            {/* =========================================
                BOTTOM NAVIGATION
            ========================================= */}

            <div
              className="
                absolute
                bottom-0
                left-0
                right-0
                h-[14%]
                bg-[#071C3C]
                flex
                items-center
                justify-between
                px-4
                md:px-6
              "
            >

              {/* PREVIOUS */}

              <button
                type="button"
                onClick={previousSlide}
                disabled={currentSlide === 0}
                className="
                  flex
                  items-center
                  gap-2
                  border
                  border-gray-400
                  text-white
                  px-3
                  md:px-5
                  py-2
                  rounded
                  text-[10px]
                  md:text-sm
                  hover:bg-white/10
                  disabled:opacity-30
                  disabled:cursor-not-allowed
                  transition
                "
              >
                <FaArrowLeft />

                <span className="hidden sm:inline">
                  Previous
                </span>

              </button>

              {/* PROGRESS */}

              <div className="w-[45%] text-center">

                <p className="text-white text-[9px] md:text-xs mb-2">
                  Slide {currentSlide + 1} of {slides.length}
                </p>

                <div
                  className="
                    h-[4px]
                    bg-white/20
                    rounded-full
                    overflow-hidden
                  "
                >

                  <div
                    className="
                      h-full
                      bg-[#2563EB]
                      rounded-full
                      transition-all
                      duration-500
                      ease-out
                    "
                    style={{
                      width: `${
                        ((currentSlide + 1) / slides.length) * 100
                      }%`,
                    }}
                  />

                </div>

              </div>

              {/* NEXT */}

              {currentSlide === slides.length - 1 ? (

                <button
                  type="button"
                  onClick={completeSlides}
                  className="
                    flex
                    items-center
                    gap-2
                    bg-green-600
                    hover:bg-green-700
                    text-white
                    px-3
                    md:px-5
                    py-2
                    rounded
                    text-[10px]
                    md:text-sm
                    font-semibold
                    transition
                  "
                >
                  <FaCheckCircle />

                  Complete
                </button>

              ) : (

                <button
                  type="button"
                  onClick={nextSlide}
                  className="
                    flex
                    items-center
                    gap-2
                    bg-[#2563EB]
                    hover:bg-blue-700
                    text-white
                    px-3
                    md:px-5
                    py-2
                    rounded
                    text-[10px]
                    md:text-sm
                    font-semibold
                    transition
                  "
                >

                  <span className="hidden sm:inline">
                    Next
                  </span>

                  <FaArrowRight />

                </button>

              )}

            </div>

          </div>

        </main>

      </div>

    </div>

  </section>
);
};

/* =========================================
   CIRCLE ICON
========================================= */

const CircleIcon = ({ children }) => {
  return (
    <div
      className="
        w-7
        h-7
        sm:w-8
        sm:h-8
        md:w-10
        md:h-10
        lg:w-11
        lg:h-11

        rounded-full

        bg-[#2563EB]
        text-white

        flex
        items-center
        justify-center

        text-[10px]
        md:text-sm
        lg:text-base

        shadow-md

        border-[3px]
        border-white

        transition-all
        duration-300

        hover:scale-110
        hover:shadow-xl
      "
    >
      {children}
    </div>
  );
};

/* =========================================
   ITEM TEXT
========================================= */

const ItemText = ({ children }) => {
  return (
    <span
      className="
        text-[7px]
        sm:text-[8px]
        md:text-[10px]
        lg:text-xs

        font-semibold
        text-[#17345F]

        whitespace-nowrap
        mt-1
      "
    >
      {children}
    </span>
  );
};

export default LessonSlides;