import React from "react";
import { Link } from "react-router-dom";

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-[#F7F9FC]">

            {/* =================================================
                HERO
            ================================================= */}

            <section
                className="
                    relative
                    overflow-hidden
                    bg-[#183B73]
                    text-white
                    py-16
                    sm:py-20
                    lg:py-24
                "
            >

                <div
                    className="
                        absolute
                        -top-20
                        -right-20
                        w-64
                        h-64
                        rounded-full
                        bg-white/10
                    "
                />

                <div
                    className="
                        absolute
                        -bottom-24
                        -left-24
                        w-72
                        h-72
                        rounded-full
                        bg-[#F7C600]/10
                    "
                />

                <div
                    className="
                        relative
                        max-w-7xl
                        mx-auto
                        px-5
                        sm:px-8
                        lg:px-10
                        text-center
                    "
                >

                    <div className="text-5xl mb-5">
                        🎓
                    </div>

                    <h1
                        className="
                            !text-[34px]
                            sm:!text-[42px]
                            md:!text-[48px]
                            lg:!text-[54px]
                            font-bold
                            leading-tight
                        "
                    >
                        About Us
                    </h1>

                    <p
                        className="
                            mt-5
                            max-w-3xl
                            mx-auto
                            text-[16px]
                            sm:text-[18px]
                            text-white/80
                            leading-8
                        "
                    >
                        Discover Broadbeach Learning and our approach to
                        accessible online education and professional learning.
                    </p>

                </div>

            </section>


            {/* =================================================
                BREADCRUMB
            ================================================= */}

            <div className="bg-white border-b border-gray-100">

                <div
                    className="
                        max-w-7xl
                        mx-auto
                        px-5
                        sm:px-8
                        lg:px-10
                        py-4
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-sm
                            text-gray-500
                        "
                    >

                        <Link
                            to="/"
                            className="
                                hover:text-[#183B73]
                                transition-colors
                            "
                        >
                            Home
                        </Link>

                        <span>/</span>

                        <span className="text-[#183B73] font-medium">
                            About Us
                        </span>

                    </div>

                </div>

            </div>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main
                className="
                    max-w-7xl
                    mx-auto
                    px-5
                    sm:px-8
                    lg:px-10
                    py-10
                    sm:py-14
                    lg:py-16
                "
            >

                {/* Intro */}

                <div
                    className="
                        bg-[#F7F9FC]
                        rounded-2xl
                        p-6
                        sm:p-8
                        mb-10
                        border
                        border-gray-100
                    "
                >

                    <p
                        className="
                            text-[16px]
                            sm:text-[18px]
                            text-gray-700
                            leading-8
                        "
                    >
                        Broadbeach Learning is an online learning platform
                        designed to provide learners with accessible courses,
                        structured learning resources, assessments and
                        certification pathways.
                    </p>

                </div>


                {/* =================================================
                    CARDS
                ================================================= */}

                <div
                    className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-3
                        gap-5
                        mb-12
                    "
                >

                    {/* Card 1 */}

                    <div
                        className="
                            bg-white
                            rounded-2xl
                            border
                            border-gray-100
                            p-6
                            sm:p-7
                            shadow-sm
                            hover:shadow-lg
                            hover:-translate-y-1
                            transition-all
                            duration-300
                        "
                    >

                        <div
                            className="
                                w-14
                                h-14
                                rounded-2xl
                                bg-[#F7C600]/15
                                flex
                                items-center
                                justify-center
                                text-2xl
                                mb-5
                            "
                        >
                            📚
                        </div>

                        <h3
                            className="
                                !text-[19px]
                                sm:!text-[21px]
                                font-bold
                                text-[#183B73]
                                mb-3
                            "
                        >
                            Online Learning
                        </h3>

                        <p
                            className="
                                text-[15px]
                                sm:text-[16px]
                                text-gray-600
                                leading-7
                            "
                        >
                            Access structured learning content through a
                            convenient online platform.
                        </p>

                    </div>


                    {/* Card 2 */}

                    <div
                        className="
                            bg-white
                            rounded-2xl
                            border
                            border-gray-100
                            p-6
                            sm:p-7
                            shadow-sm
                            hover:shadow-lg
                            hover:-translate-y-1
                            transition-all
                            duration-300
                        "
                    >

                        <div
                            className="
                                w-14
                                h-14
                                rounded-2xl
                                bg-[#F7C600]/15
                                flex
                                items-center
                                justify-center
                                text-2xl
                                mb-5
                            "
                        >
                            🏆
                        </div>

                        <h3
                            className="
                                !text-[19px]
                                sm:!text-[21px]
                                font-bold
                                text-[#183B73]
                                mb-3
                            "
                        >
                            Certifications
                        </h3>

                        <p
                            className="
                                text-[15px]
                                sm:text-[16px]
                                text-gray-600
                                leading-7
                            "
                        >
                            Complete eligible courses and assessments
                            according to the applicable course requirements.
                        </p>

                    </div>


                    {/* Card 3 */}

                    <div
                        className="
                            bg-white
                            rounded-2xl
                            border
                            border-gray-100
                            p-6
                            sm:p-7
                            shadow-sm
                            hover:shadow-lg
                            hover:-translate-y-1
                            transition-all
                            duration-300
                        "
                    >

                        <div
                            className="
                                w-14
                                h-14
                                rounded-2xl
                                bg-[#F7C600]/15
                                flex
                                items-center
                                justify-center
                                text-2xl
                                mb-5
                            "
                        >
                            💻
                        </div>

                        <h3
                            className="
                                !text-[19px]
                                sm:!text-[21px]
                                font-bold
                                text-[#183B73]
                                mb-3
                            "
                        >
                            Digital Platform
                        </h3>

                        <p
                            className="
                                text-[15px]
                                sm:text-[16px]
                                text-gray-600
                                leading-7
                            "
                        >
                            Learn through online lessons, resources,
                            assessments and digital services.
                        </p>

                    </div>

                </div>


                {/* =================================================
                    SECTION 01
                ================================================= */}

                <section className="mb-10">

                    <div className="flex items-start gap-4 mb-4">

                        <div
                            className="
                                flex-shrink-0
                                w-10
                                h-10
                                rounded-xl
                                bg-[#183B73]
                                text-white
                                flex
                                items-center
                                justify-center
                                font-bold
                            "
                        >
                            01
                        </div>

                        <h2
                            className="
                                !text-[22px]
                                sm:!text-[25px]
                                md:!text-[28px]
                                font-bold
                                text-[#183B73]
                                leading-tight
                            "
                        >
                            Our Learning Approach
                        </h2>

                    </div>

                    <p
                        className="
                            sm:pl-14
                            text-gray-600
                            text-[15px]
                            sm:text-[16px]
                            leading-8
                        "
                    >
                        We aim to make learning simple, practical and
                        accessible through structured online lessons,
                        learning resources, assessments and certification
                        pathways.
                    </p>

                </section>


                {/* =================================================
                    SECTION 02
                ================================================= */}

                <section className="mb-10">

                    <div className="flex items-start gap-4 mb-4">

                        <div
                            className="
                                flex-shrink-0
                                w-10
                                h-10
                                rounded-xl
                                bg-[#183B73]
                                text-white
                                flex
                                items-center
                                justify-center
                                font-bold
                            "
                        >
                            02
                        </div>

                        <h2
                            className="
                                !text-[22px]
                                sm:!text-[25px]
                                md:!text-[28px]
                                font-bold
                                text-[#183B73]
                                leading-tight
                            "
                        >
                            Our Platform
                        </h2>

                    </div>

                    <p
                        className="
                            sm:pl-14
                            text-gray-600
                            text-[15px]
                            sm:text-[16px]
                            leading-8
                        "
                    >
                        Learners can browse available courses, enrol in
                        eligible programs, access lessons and complete
                        assessments through the platform.
                    </p>

                </section>


                {/* =================================================
                    SECTION 03
                ================================================= */}

                <section className="mb-10">

                    <div className="flex items-start gap-4 mb-4">

                        <div
                            className="
                                flex-shrink-0
                                w-10
                                h-10
                                rounded-xl
                                bg-[#183B73]
                                text-white
                                flex
                                items-center
                                justify-center
                                font-bold
                            "
                        >
                            03
                        </div>

                        <h2
                            className="
                                !text-[22px]
                                sm:!text-[25px]
                                md:!text-[28px]
                                font-bold
                                text-[#183B73]
                                leading-tight
                            "
                        >
                            Our Commitment
                        </h2>

                    </div>

                    <p
                        className="
                            sm:pl-14
                            text-gray-600
                            text-[15px]
                            sm:text-[16px]
                            leading-8
                        "
                    >
                        We continuously work to improve the learning
                        experience, course resources, platform functionality
                        and learner support.
                    </p>

                </section>


                {/* =================================================
                    CTA
                ================================================= */}

                <section
                    className="
                        mt-14
                        rounded-3xl
                        bg-[#183B73]
                        p-7
                        sm:p-10
                        lg:p-12
                        text-center
                        relative
                        overflow-hidden
                    "
                >

                    <div
                        className="
                            absolute
                            -top-16
                            -right-16
                            w-48
                            h-48
                            rounded-full
                            bg-white/10
                        "
                    />

                    <div
                        className="
                            absolute
                            -bottom-20
                            -left-20
                            w-56
                            h-56
                            rounded-full
                            bg-[#F7C600]/10
                        "
                    />

                    <div className="relative z-10">

                        <h2
                            className="
                                !text-[24px]
                                sm:!text-[28px]
                                md:!text-[32px]
                                font-bold
                                text-white
                            "
                        >
                            Ready to Start Learning?
                        </h2>

                        <p
                            className="
                                mt-3
                                max-w-2xl
                                mx-auto
                                text-white/80
                                text-[15px]
                                sm:text-[16px]
                                leading-7
                            "
                        >
                            Explore available courses and discover your next
                            learning opportunity.
                        </p>

                        <Link
                            to="/course"
                            className="
                                inline-flex
                                items-center
                                justify-center
                                mt-7
                                px-7
                                py-3
                                rounded-xl
                                bg-[#F7C600]
                                text-[#183B73]
                                font-bold
                                hover:bg-white
                                transition-all
                                duration-300
                            "
                        >
                            Explore Courses
                        </Link>

                    </div>

                </section>

            </main>

        </div>
    );
};

export default AboutUs;