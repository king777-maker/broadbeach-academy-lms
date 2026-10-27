import { useState, useEffect } from "react";
import {
    FaCheckCircle,
    FaTimesCircle,
    FaAward,
    FaRedo,
    FaDownload,
    FaSpinner,
} from "react-icons/fa";

import {
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";
import { getAuthoritativeCourseName } from "../data/freeCoursesData";
import { markCourseCompleted } from "../utils/progressTracker";
import { useAuth } from "../context/AuthContext";


const Result = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const { user: authUser } = useAuth();

    // Cache and retrieve assessment result across reloads
    const [state, setState] = useState(() => {
        if (location.state) {
            try {
                sessionStorage.setItem(`assessment_result_${id}`, JSON.stringify(location.state));
            } catch (e) {
                // Ignore storage error
            }
            return location.state;
        }
        try {
            const cached = sessionStorage.getItem(`assessment_result_${id}`);
            if (cached) return JSON.parse(cached);
        } catch (e) {
            // Ignore
        }
        return null;
    });

    const [downloading, setDownloading] = useState(false);


    // =========================================================
    // NO RESULT STATE
    // =========================================================

    if (!state) {
        return (
            <div className="
                min-h-screen
                flex
                flex-col
                gap-5
                items-center
                justify-center
                bg-[#F4F7FC]
            ">

                <h2 className="text-2xl font-bold text-red-600">
                    No Result Found
                </h2>

                <p className="text-gray-500">
                    Assessment result data is not available.
                </p>

                <button
                    type="button"
                    onClick={() => navigate(`/learning/${id}`)}
                    className="
                        bg-[#183B73]
                        hover:bg-[#102b55]
                        text-white
                        px-6
                        py-3
                        rounded-xl
                        transition
                    "
                >
                    Back to Course
                </button>

            </div>
        );
    }


    // =========================================================
    // RESULT DATA
    // =========================================================

    const {
        score = 0,
        total = 0,
        courseName = "",
        studentName = "",
    } = state;


    // =========================================================
    // CALCULATE PERCENTAGE
    // =========================================================

    const percentage =
        total > 0
            ? Math.round(
                (Number(score) / Number(total)) * 100
            )
            : 0;


    // =========================================================
    // PASS / FAIL
    // =========================================================

    const authoritativeCourseName = getAuthoritativeCourseName(id, courseName);
    const isPassed = state.passed !== undefined ? Boolean(state.passed) : (percentage >= (state.passingPercentage || 70));


    // =========================================================
    // WRONG ANSWERS
    // =========================================================

    const wrongAnswers =
        Number(total) - Number(score);

    const getResolvedStudentName = () => {
        if (studentName && typeof studentName === "string" && studentName.trim() && !["learner", "student", "test student", "candidate", "—"].includes(studentName.trim().toLowerCase())) {
            return studentName.trim();
        }
        if (authUser) {
            const authName = authUser.name || authUser.full_name || [authUser.first_name, authUser.last_name].filter(Boolean).join(" ").trim();
            if (authName && authName.trim()) return authName.trim();
        }
        try {
            const raw = localStorage.getItem("bb_user") || localStorage.getItem("user");
            if (raw) {
                const u = JSON.parse(raw);
                const n = u.name || u.full_name || [u.first_name, u.last_name].filter(Boolean).join(" ").trim() || u.username;
                if (n && n.trim()) return n.trim();
            }
        } catch (e) {}
        return studentName?.trim() || "Verified Learner";
    };

    const resolvedStudentName = getResolvedStudentName();

    useEffect(() => {
        if (isPassed && id) {
            try {
                const uId = state?.userId || null;
                markCourseCompleted(uId, id, {
                    certificate_number: state?.certificate_number || state?.certificate?.certificate_number,
                    student_name: resolvedStudentName,
                    course_name: authoritativeCourseName,
                    score,
                    total,
                    percentage
                });
            } catch (e) {
                // Ignore
            }
        }
    }, [isPassed, id, state, score, total, percentage, resolvedStudentName, authoritativeCourseName]);


    // =========================================================
    // VIEW CERTIFICATE
    // =========================================================

    const viewCertificate = () => {

        if (!isPassed) {
            return;
        }

        const certificateData = {
            score: Number(score),
            total: Number(total),
            percentage: Number(percentage),
            studentName: resolvedStudentName,
            courseName: authoritativeCourseName || courseName || "",
            certificate_number: state?.certificate_number || state?.certificate?.certificate_number,
        };

        navigate(
            `/certificate/${id}`,
            {
                state: certificateData,
            }
        );
    };


    // =========================================================
    // DOWNLOAD RESULT AS PDF
    // =========================================================

    const downloadPDF = async () => {

        if (downloading) {
            return;
        }

        const target =
            document.getElementById(
                "result-pdf"
            );

        if (!target) {
            toast.error(
                "Result content not found."
            );
            return;
        }

        const safeCourseName =
            (courseName || "Assessment")
                .replace(
                    /[^a-z0-9]/gi,
                    "-"
                )
                .replace(
                    /-+/g,
                    "-"
                )
                .replace(
                    /^-|-$/g,
                    ""
                );

        const fileName =
            `${safeCourseName || "Assessment"}-Result.pdf`;

        setDownloading(true);
        const toastId = toast.loading("Generating result PDF...");

        try {
            // Ensure fonts & images are fully loaded
            if (document.fonts?.ready) {
                await document.fonts.ready;
            }

            // Capture directly via html2canvas with OKLCH sanitization in onclone
            const canvas = await html2canvas(target, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: "#ffffff",
                logging: false,
                scrollX: 0,
                scrollY: 0,
                windowWidth: target.scrollWidth,
                windowHeight: target.scrollHeight,
                onclone: (clonedDoc) => {
                    try {
                        const styleTags = clonedDoc.querySelectorAll("style");
                        const helperCanvas = document.createElement("canvas");
                        const ctx = helperCanvas.getContext("2d");
                        const toSafeRgb = (color) => {
                            try {
                                ctx.fillStyle = color;
                                return ctx.fillStyle;
                            } catch {
                                return "#ffffff";
                            }
                        };

                        styleTags.forEach((tag) => {
                            if (tag.textContent && /(oklch|oklab|color|lab|lch)\([^)]+\)/.test(tag.textContent)) {
                                tag.textContent = tag.textContent.replace(
                                    /(?:oklch|oklab|color|lab|lch)\([^)]+\)/g,
                                    (m) => toSafeRgb(m)
                                );
                            }
                        });
                    } catch (e) {
                        console.warn("Style sanitization skipped:", e);
                    }
                },
            });

            const imgData = canvas.toDataURL("image/jpeg", 0.95);

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
                compress: true,
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 10;
            const availableWidth = pageWidth - margin * 2;
            const availableHeight = pageHeight - margin * 2;

            const imgWidth = availableWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            if (imgHeight <= availableHeight) {
                pdf.addImage(imgData, "JPEG", margin, margin, imgWidth, imgHeight, undefined, "FAST");
            } else {
                let heightLeft = imgHeight;
                let position = margin;

                pdf.addImage(imgData, "JPEG", margin, position, imgWidth, imgHeight, undefined, "FAST");
                heightLeft -= availableHeight;

                while (heightLeft > 0) {
                    position = heightLeft - imgHeight + margin;
                    pdf.addPage();
                    pdf.addImage(imgData, "JPEG", margin, position, imgWidth, imgHeight, undefined, "FAST");
                    heightLeft -= availableHeight;
                }
            }

            pdf.save(fileName);
            toast.success("Result PDF downloaded successfully!", { id: toastId });

        } catch (error) {
            console.error("html2canvas PDF generation failed, using direct jsPDF vector fallback:", error);

            try {
                // Guaranteed vector PDF fallback
                const pdf = new jsPDF({
                    orientation: "portrait",
                    unit: "mm",
                    format: "a4",
                });

                // Header Banner
                pdf.setFillColor(isPassed ? 22 : 220, isPassed ? 163 : 38, isPassed ? 74 : 38);
                pdf.rect(0, 0, 210, 48, "F");

                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(22);
                pdf.setFont("helvetica", "bold");
                pdf.text(isPassed ? "Assessment Result - PASS" : "Assessment Result - FAIL", 105, 20, { align: "center" });

                pdf.setFontSize(12);
                pdf.setFont("helvetica", "normal");
                if (courseName) {
                    pdf.text(courseName, 105, 30, { align: "center" });
                }
                if (studentName) {
                    pdf.text(`Student: ${studentName}`, 105, 39, { align: "center" });
                }

                // Summary Cards
                pdf.setDrawColor(220, 225, 235);
                pdf.setFillColor(245, 247, 250);
                pdf.roundedRect(15, 58, 180, 28, 3, 3, "FD");

                pdf.setTextColor(100, 110, 130);
                pdf.setFontSize(10);
                pdf.text("SCORE", 45, 67, { align: "center" });
                pdf.text("PERCENTAGE", 105, 67, { align: "center" });
                pdf.text("RESULT", 165, 67, { align: "center" });

                pdf.setFont("helvetica", "bold");
                pdf.setFontSize(16);
                pdf.setTextColor(24, 59, 115);
                pdf.text(`${score} / ${total}`, 45, 78, { align: "center" });

                pdf.setTextColor(isPassed ? 22 : 220, isPassed ? 163 : 38, isPassed ? 74 : 38);
                pdf.text(`${percentage}%`, 105, 78, { align: "center" });
                pdf.text(isPassed ? "PASS" : "FAIL", 165, 78, { align: "center" });

                // Performance Details Table
                pdf.setFontSize(14);
                pdf.setTextColor(24, 59, 115);
                pdf.text("Performance Summary", 15, 102);

                const details = [
                    ["Total Questions", String(total)],
                    ["Correct Answers", String(score)],
                    ["Wrong Answers", String(wrongAnswers)],
                    ["Negative Marking", "No"],
                    ["Passing Marks", "60%"],
                ];

                let startY = 112;
                pdf.setFontSize(11);
                details.forEach(([label, val]) => {
                    pdf.setFont("helvetica", "normal");
                    pdf.setTextColor(80, 90, 105);
                    pdf.text(label, 20, startY);

                    pdf.setFont("helvetica", "bold");
                    pdf.setTextColor(30, 40, 55);
                    pdf.text(val, 190, startY, { align: "right" });

                    pdf.setDrawColor(235, 240, 245);
                    pdf.line(15, startY + 3, 195, startY + 3);
                    startY += 12;
                });

                // Status Message Box
                startY += 8;
                if (isPassed) {
                    pdf.setFillColor(240, 253, 244);
                    pdf.setDrawColor(187, 247, 208);
                    pdf.roundedRect(15, startY, 180, 24, 3, 3, "FD");
                    pdf.setTextColor(21, 128, 61);
                    pdf.setFont("helvetica", "bold");
                    pdf.setFontSize(12);
                    pdf.text("You are eligible for certification", 105, startY + 10, { align: "center" });
                    pdf.setFont("helvetica", "normal");
                    pdf.setFontSize(10);
                    pdf.setTextColor(75, 85, 99);
                    pdf.text("Your certificate is ready to be generated.", 105, startY + 18, { align: "center" });
                } else {
                    pdf.setFillColor(254, 242, 242);
                    pdf.setDrawColor(254, 202, 202);
                    pdf.roundedRect(15, startY, 180, 24, 3, 3, "FD");
                    pdf.setTextColor(185, 28, 28);
                    pdf.setFont("helvetica", "bold");
                    pdf.setFontSize(12);
                    pdf.text("Certification Not Achieved", 105, startY + 10, { align: "center" });
                    pdf.setFont("helvetica", "normal");
                    pdf.setFontSize(10);
                    pdf.setTextColor(75, 85, 99);
                    pdf.text("Please review the course and retake the assessment.", 105, startY + 18, { align: "center" });
                }

                pdf.save(fileName);
                toast.success("Result PDF downloaded successfully!", { id: toastId });

            } catch (fallbackError) {
                console.error("Direct jsPDF export also failed:", fallbackError);
                toast.error("Failed to generate PDF. Please try again.", { id: toastId });
            }

        } finally {
            setDownloading(false);
        }
    };


    // =========================================================
    // RETAKE ASSESSMENT
    // =========================================================

    const retakeAssessment = () => {

        navigate(
            `/assignment/${id}`
        );

    };


    // =========================================================
    // BACK TO COURSE
    // =========================================================

    const backToCourse = () => {

        navigate(
            `/learning/${id}`
        );

    };


    return (
        <section className="
            min-h-screen
            bg-[#F4F7FC]
            py-10
        ">

            <div className="
                max-w-4xl
                mx-auto
                px-5
            ">


                {/* =================================================
                    RESULT CONTENT
                    THIS SECTION WILL BE DOWNLOADED
                ================================================= */}

                <div
                    id="result-pdf"
                    className="
                        bg-white
                        rounded-3xl
                        shadow-xl
                        overflow-hidden
                    "
                >


                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div
                        className={`
                            p-8
                            text-center
                            text-white
                            ${
                                isPassed
                                    ? "bg-green-600"
                                    : "bg-red-600"
                            }
                        `}
                    >

                        {isPassed ? (

                            <FaCheckCircle
                                className="
                                    mx-auto
                                    text-7xl
                                    mb-5
                                "
                            />

                        ) : (

                            <FaTimesCircle
                                className="
                                    mx-auto
                                    text-7xl
                                    mb-5
                                "
                            />

                        )}


                        <h1 className="
                            text-3xl
                            md:text-4xl
                            font-bold
                        ">
                            {isPassed
                                ? "Congratulations!"
                                : "Assessment Failed"}
                        </h1>


                        {courseName && (

                            <p className="
                                mt-3
                                text-lg
                            ">
                                {authoritativeCourseName || courseName}
                            </p>

                        )}


                        {studentName && (

                            <p className="
                                mt-2
                                text-sm
                                opacity-90
                            ">
                                {studentName}
                            </p>

                        )}

                    </div>


                    {/* =================================================
                        BODY
                    ================================================= */}

                    <div className="
                        p-5
                        md:p-10
                    ">


                        {/* =================================================
                            SCORE CARDS
                        ================================================= */}

                        <div className="
                            grid
                            grid-cols-1
                            md:grid-cols-3
                            gap-6
                        ">


                            {/* SCORE */}

                            <div className="
                                bg-blue-50
                                rounded-2xl
                                p-6
                                text-center
                            ">

                                <h2 className="
                                    text-gray-500
                                ">
                                    Score
                                </h2>

                                <p className="
                                    text-4xl
                                    font-bold
                                    text-blue-700
                                    mt-2
                                ">
                                    {score}/{total}
                                </p>

                            </div>


                            {/* PERCENTAGE */}

                            <div className="
                                bg-green-50
                                rounded-2xl
                                p-6
                                text-center
                            ">

                                <h2 className="
                                    text-gray-500
                                ">
                                    Percentage
                                </h2>

                                <p className="
                                    text-4xl
                                    font-bold
                                    text-green-600
                                    mt-2
                                ">
                                    {percentage}%
                                </p>

                            </div>


                            {/* RESULT */}

                            <div className="
                                bg-yellow-50
                                rounded-2xl
                                p-6
                                text-center"
                            >

                                <h2 className="
                                    text-gray-500
                                ">
                                    Result
                                </h2>

                                <p
                                    className={`
                                        text-3xl
                                        font-bold
                                        mt-2
                                        ${
                                            isPassed
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }
                                    `}
                                >
                                    {isPassed
                                        ? "PASS"
                                        : "FAIL"}
                                </p>

                            </div>

                        </div>


                        {/* =================================================
                            PERFORMANCE SUMMARY
                        ================================================= */}

                        <div className="
                            mt-10
                            bg-gray-50
                            rounded-2xl
                            p-6
                        ">

                            <h2 className="
                                text-2xl
                                font-bold
                                text-[#183B73]
                                mb-5
                            ">
                                Performance Summary
                            </h2>


                            <ul className="
                                space-y-4
                                text-gray-700
                            ">


                                <li className="
                                    flex
                                    justify-between
                                    border-b
                                    border-gray-200
                                    pb-3
                                ">

                                    <span>
                                        Total Questions
                                    </span>

                                    <strong>
                                        {total}
                                    </strong>

                                </li>


                                <li className="
                                    flex
                                    justify-between
                                    border-b
                                    border-gray-200
                                    pb-3
                                ">

                                    <span>
                                        Correct Answers
                                    </span>

                                    <strong className="
                                        text-green-600
                                    ">
                                        {score}
                                    </strong>

                                </li>


                                <li className="
                                    flex
                                    justify-between
                                    border-b
                                    border-gray-200
                                    pb-3
                                ">

                                    <span>
                                        Wrong Answers
                                    </span>

                                    <strong className="
                                        text-red-600
                                    ">
                                        {wrongAnswers}
                                    </strong>

                                </li>


                                <li className="
                                    flex
                                    justify-between
                                    border-b
                                    border-gray-200
                                    pb-3
                                ">

                                    <span>
                                        Negative Marking
                                    </span>

                                    <strong>
                                        No
                                    </strong>

                                </li>


                                <li className="
                                    flex
                                    justify-between
                                ">

                                    <span>
                                        Passing Marks
                                    </span>

                                    <strong>
                                        60%
                                    </strong>

                                </li>

                            </ul>

                        </div>


                        {/* =================================================
                            PASS MESSAGE
                        ================================================= */}

                        {isPassed && (

                            <div className="
                                mt-8
                                border
                                border-green-200
                                bg-green-50
                                rounded-2xl
                                p-6
                                text-center
                            ">

                                <FaAward
                                    className="
                                        text-5xl
                                        text-green-600
                                        mx-auto
                                        mb-3
                                    "
                                />

                                <h2 className="
                                    text-xl
                                    font-bold
                                    text-green-700
                                ">
                                    You are eligible for certification
                                </h2>

                                <p className="
                                    text-gray-600
                                    mt-2
                                ">
                                    Your certificate is ready to be generated.
                                </p>

                                <p className="
                                    text-sm
                                    text-gray-500
                                    mt-2
                                ">
                                    Click the button below to view your certificate.
                                </p>

                            </div>

                        )}


                        {/* =================================================
                            FAILED MESSAGE
                        ================================================= */}

                        {!isPassed && (

                            <div className="
                                mt-8
                                border
                                border-red-200
                                bg-red-50
                                rounded-2xl
                                p-6
                                text-center
                            ">

                                <FaTimesCircle
                                    className="
                                        text-5xl
                                        text-red-500
                                        mx-auto
                                        mb-3
                                    "
                                />

                                <h2 className="
                                    text-xl
                                    font-bold
                                    text-red-700
                                ">
                                    Certification Not Achieved
                                </h2>

                                <p className="
                                    text-gray-600
                                    mt-2
                                ">
                                    You need at least 60% to pass this assessment.
                                </p>

                                <p className="
                                    text-sm
                                    text-gray-500
                                    mt-2
                                ">
                                    Please review the course and retake the assessment.
                                </p>

                            </div>

                        )}

                    </div>

                </div>


                {/* =================================================
                    ACTION BUTTONS
                    THESE ARE NOT INCLUDED IN PDF
                ================================================= */}

                <div className="
                    mt-10
                    flex
                    flex-col
                    sm:flex-row
                    flex-wrap
                    gap-4
                    justify-center
                ">


                    {/* VIEW CERTIFICATE / RETAKE */}

                    {isPassed ? (

                        <button
                            type="button"
                            onClick={viewCertificate}
                            className="
                                bg-green-600
                                hover:bg-green-700
                                text-white
                                px-8
                                py-4
                                rounded-xl
                                flex
                                items-center
                                justify-center
                                gap-3
                                font-semibold
                                transition
                            "
                        >

                            <FaAward />

                            View Certificate

                        </button>

                    ) : (

                        <button
                            type="button"
                            onClick={retakeAssessment}
                            className="
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                px-8
                                py-4
                                rounded-xl
                                flex
                                items-center
                                justify-center
                                gap-3
                                font-semibold
                                transition
                            "
                        >

                            <FaRedo />

                            Retake Assessment

                        </button>

                    )}


                    {/* DOWNLOAD PDF */}

                    <button
                        type="button"
                        onClick={downloadPDF}
                        disabled={downloading}
                        className="
                            bg-[#0d1084]
                            hover:bg-[#080a60]
                            disabled:opacity-60
                            disabled:cursor-not-allowed
                            text-white
                            px-8
                            py-4
                            rounded-xl
                            flex
                            items-center
                            justify-center
                            gap-3
                            font-semibold
                            transition
                            cursor-pointer
                        "
                    >

                        {downloading ? (
                            <>
                                <FaSpinner className="animate-spin text-lg" />
                                Generating PDF...
                            </>
                        ) : (
                            <>
                                <FaDownload />
                                Download PDF
                            </>
                        )}

                    </button>


                    {/* BACK TO COURSE */}

                    <button
                        type="button"
                        onClick={backToCourse}
                        className="
                            border
                            border-gray-300
                            hover:bg-gray-100
                            px-8
                            py-4
                            rounded-xl
                            font-semibold
                            transition
                        "
                    >
                        Back to Course
                    </button>

                </div>

            </div>

        </section>
    );
};


export default Result;