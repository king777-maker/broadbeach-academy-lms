import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaPlay,
  FaBookOpen,
  FaImages,
  FaCheckCircle,
} from "react-icons/fa";

import { courseData } from "../data/courseData";

const LessonVideo = () => {

  const navigate = useNavigate();

  const { courseId, lessonId } = useParams();

  const course = courseData.find(
    (item) => item.id === Number(courseId)
  );

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Course Not Found
      </div>
    );
  }

  return (

    <section className="bg-[#F4F7FC] min-h-screen py-6">

      <div className="max-w-6xl mx-auto px-5">


        {/* Back */}

        <button
          onClick={() =>
            navigate(`/learning/${courseId}`)
          }
          className="
            flex items-center gap-2
            text-[#2563EB]
            font-semibold
            mb-4
          "
        >
          <FaArrowLeft />

          Back to Course
        </button>


        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">


          {/* HEADER */}

          <div className="px-6 py-4 border-b">

            <div className="flex flex-wrap justify-between items-center gap-4">


              <div>

                <span className="text-xs text-[#2563EB] font-semibold">
                  Chapter {lessonId}
                </span>

                <h1 className="text-2xl font-bold text-[#183B73] mt-1">
                  Course Video
                </h1>

              </div>


              {/* Tabs */}

              <div className="flex gap-2">

                <button
                  className="
                    flex items-center gap-2
                    bg-[#2563EB]
                    text-white
                    px-4 py-2
                    rounded-lg
                    text-sm
                  "
                >
                  <FaPlay />

                  Video
                </button>


                <button
                  onClick={() =>
                    navigate(
                      `/content/${courseId}/${lessonId}`
                    )
                  }
                  className="
                    flex items-center gap-2
                    bg-gray-100
                    hover:bg-blue-50
                    text-gray-700
                    px-4 py-2
                    rounded-lg
                    text-sm
                  "
                >
                  <FaBookOpen />

                  Content
                </button>


                <button
                  onClick={() =>
                    navigate(
                      `/slides/${courseId}/${lessonId}`
                    )
                  }
                  className="
                    flex items-center gap-2
                    bg-gray-100
                    hover:bg-blue-50
                    text-gray-700
                    px-4 py-2
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


          {/* VIDEO */}

          <div className="p-6">

            <div
              className="
                relative
                bg-black
                rounded-2xl
                overflow-hidden
                h-[430px]
              "
            >

              <img
                src={course.image}
                alt={course.title}
                className="
                  w-full
                  h-full
                  object-cover
                  opacity-40
                "
              />


              <div
                className="
                  absolute inset-0
                  flex flex-col
                  items-center
                  justify-center
                "
              >

                <button
                  className="
                    w-16 h-16
                    rounded-full
                    bg-white
                    flex items-center
                    justify-center
                    shadow-xl
                    hover:scale-110
                    transition
                  "
                >
                  <FaPlay
                    className="
                      text-[#2563EB]
                      text-2xl
                      ml-1
                    "
                  />
                </button>


                <h2 className="text-white text-2xl font-bold mt-5">
                  Chapter {lessonId}
                </h2>


                <p className="text-gray-300 mt-1">
                  {course.title}
                </p>

              </div>

            </div>


            {/* Bottom */}

            <div className="flex justify-between items-center mt-5">

              <div>

                <h2 className="text-xl font-bold text-[#183B73]">
                  Chapter {lessonId} Video
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Watch the complete lesson before continuing.
                </p>

              </div>


              <button
                className="
                  flex items-center gap-2
                  bg-green-600
                  hover:bg-green-700
                  text-white
                  px-5 py-2.5
                  rounded-lg
                  font-semibold
                "
              >
                <FaCheckCircle />

                Mark Complete
              </button>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default LessonVideo;