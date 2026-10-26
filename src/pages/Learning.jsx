import { getCourseProgress, toggleLessonCompleted, markCourseCompleted, resolveUserId, normalizeCourseId, recordExamBypass } from "../utils/progressTracker";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaCheckCircle,
    FaImages,
    FaChevronLeft,
    FaChevronRight,
    FaDownload,
    FaExclamationTriangle,
    FaRedo,
    FaPlay,
    FaClipboardCheck,
    FaAward,
    FaLock,
    FaChevronDown,
    FaChevronUp,
    FaBars,
    FaTimes,
    FaBookOpen,
    FaArrowRight,
} from "react-icons/fa";

import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

import {
    getFreeCertification,
    getCourseLessons,
    getLessonResources,
    redeemCertificateCoupon,
} from "../api/api";

import {
    resolveCourse,
    generateCurriculumForCourse,
} from "../data/coursesResolver";

import {
    isCourseOnlineAvailable,
    LAUNCH_STATUS_CONFIG,
    FREE_COURSE_DB_MAP,
} from "../constants/courseAvailability";
import backendUrl from "../utils/backendUrl";
import { getAuthoritativeCourseName, freeCoursesData, AUTHORITATIVE_FREE_COURSE_NAMES } from "../data/freeCoursesData";
import { getAssessmentForCourse } from "../data/assessmentCatalog";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;


/* =========================================================
   ASSET URL
========================================================= */

const assetUrl = (value = "") => {
    if (!value) return "";

    const url = String(value).trim();

    if (/^https?:\/\//i.test(url)) {
        return url;
    }

    return backendUrl(url);
};

/* =========================================================
   YOUTUBE VIDEOS
========================================================= */

/*
 * Chapter-specific sample videos.
 *
 * These are used only when the backend does not provide
 * video_url / youtube_url for a lesson.
 *
 * Later you can replace these URLs with your own training
 * videos, or store the actual URL in course_lessons.video_url.
 */
const CHAPTER_VIDEO_MAP = {
    "Introduction to ISO 9001:2026 QMS":
        "https://www.youtube.com/watch?v=18mZGIpwAZY",

    "Understanding ISO 9001:2026 Requirements":
        "https://www.youtube.com/watch?v=3Fxss-nYTEI",

    "Quality Management Principles":
        "https://www.youtube.com/watch?v=mGX1jYNElHg",

    "Risk-Based Thinking and Process Approach":
        "https://www.youtube.com/watch?v=nmr38RfxqKU",
};

const DEFAULT_YOUTUBE_VIDEO =
    "https://www.youtube.com/watch?v=18mZGIpwAZY";


const getYouTubeVideoId = (value = "") => {

    if (!value) {
        return "";
    }

    const url = String(value).trim();

    // Direct YouTube video ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
        return url;
    }

    // youtube.com/watch?v=VIDEO_ID
    const watchMatch = url.match(
        /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/
    );

    if (watchMatch?.[1]) {
        return watchMatch[1];
    }

    // youtube-nocookie.com/embed/VIDEO_ID
    const noCookieMatch = url.match(
        /youtube-nocookie\.com\/embed\/([a-zA-Z0-9_-]{11})/
    );

    if (noCookieMatch?.[1]) {
        return noCookieMatch[1];
    }

    // youtube.com/embed/VIDEO_ID
    const embedMatch = url.match(
        /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/
    );

    if (embedMatch?.[1]) {
        return embedMatch[1];
    }

    // youtube.com/shorts/VIDEO_ID
    const shortsMatch = url.match(
        /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
    );

    if (shortsMatch?.[1]) {
        return shortsMatch[1];
    }

    // youtu.be/VIDEO_ID
    const shortUrlMatch = url.match(
        /youtu\.be\/([a-zA-Z0-9_-]{11})/
    );

    if (shortUrlMatch?.[1]) {
        return shortUrlMatch[1];
    }

    return "";
};


const getYouTubeEmbedUrl = (value = "") => {

    const videoId =
        getYouTubeVideoId(value);

    if (!videoId) {
        return "";
    }

    // Privacy-Enhanced Mode (No-Cookie Domain) to prevent third-party profiling cookies
    return (
        `https://www.youtube-nocookie.com/embed/${videoId}` +
        `?rel=0&controls=1&playsinline=1&modestbranding=1`
    );
};


/* =========================================================
   COMPONENT
========================================================= */

const Learning = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const resolvedCourseId = FREE_COURSE_DB_MAP[String(id).toLowerCase().trim()] || id;


    /* =====================================================
       COURSE
    ===================================================== */

    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [activeLesson, setActiveLesson] = useState(0);
    const [expandedChapters, setExpandedChapters] = useState({});
    const [mobileOutlineOpen, setMobileOutlineOpen] = useState(false);


    /* =====================================================
       LESSON RESOURCES
    ===================================================== */

    const [lessonResources, setLessonResources] = useState([]);
    const [resourceLoading, setResourceLoading] = useState(false);


    /* =====================================================
       GENERAL
    ===================================================== */

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    /* =====================================================
       PDF SLIDES
    ===================================================== */

    const [showSlides, setShowSlides] = useState(false);
    const [pdfPages, setPdfPages] = useState([]);
    const [pdfPage, setPdfPage] = useState(1);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [pdfError, setPdfError] = useState("");


    /* =====================================================
       CERTIFICATE ACCESS
    ===================================================== */

    const [accessCode, setAccessCode] = useState("");
    const [accessCodeLoading, setAccessCodeLoading] = useState(false);
    const [accessCodeError, setAccessCodeError] = useState("");
    const [accessCodeSuccess, setAccessCodeSuccess] = useState("");


    const [retryKey, setRetryKey] = useState(0);

    /* =====================================================
       LOAD COURSE + LESSONS (MULTI-TIER RESOLUTION)
    ===================================================== */

    useEffect(() => {

        const loadData = async () => {

            try {

                setLoading(true);
                setError("");

                let loadedCourse = null;
                let loadedLessons = [];

                /* -----------------------------------------
                   1. ATTEMPT REMOTE BACKEND API
                ----------------------------------------- */
                try {
                    const courseResponse = await getFreeCertification(resolvedCourseId);

                    if (
                        courseResponse.data?.success &&
                        courseResponse.data?.data
                    ) {
                        loadedCourse = courseResponse.data.data;

                        try {
                            const lessonResponse = await getCourseLessons(loadedCourse?.id || resolvedCourseId);
                            if (
                                lessonResponse.data?.success &&
                                Array.isArray(lessonResponse.data?.data) &&
                                lessonResponse.data.data.length > 0
                            ) {
                                loadedLessons = lessonResponse.data.data;
                            }
                        } catch (lessonErr) {
                            console.warn("Notice: Lessons from API unavailable, will construct from curriculum:", lessonErr?.message);
                        }
                    }
                } catch (apiErr) {
                    console.info(
                        `Notice: Remote certification API did not resolve course id "${id}". Falling back to catalog resolver.`
                    );
                }

                /* -----------------------------------------
                   2. FALLBACK TO CATALOG RESOLVER
                ----------------------------------------- */
                if (!loadedCourse) {
                    const local = resolveCourse(id);
                    if (local) {
                        loadedCourse = {
                            id: local.id,
                            name: local.name || local.title,
                            title: local.title || local.name,
                            category: local.category,
                            description: local.description,
                            duration: local.duration,
                            image: local.course_image || local.image,
                            price: local.price || 0,
                            modules: local.modules,
                        };
                    }
                }

                if (!loadedCourse) {
                    throw new Error(`The requested course (#${id}) could not be found.`);
                }

                const canonicalId = Number(loadedCourse.certification_id || loadedCourse.id || resolvedCourseId || normalizeCourseId(id) || 322);
                const authCourseName = getAuthoritativeCourseName(canonicalId, loadedCourse.title || loadedCourse.name);
                if (authCourseName) {
                    loadedCourse.name = authCourseName;
                    loadedCourse.title = authCourseName;
                }
                setCourse(loadedCourse);

                // Auto-register enrollment in local storage for learner dashboard sync
                try {
                    const enrolled = JSON.parse(localStorage.getItem("bb_enrolled_courses") || "[]");
                    if (!enrolled.some(c => Number(c.id || c.certification_id) === canonicalId)) {
                        enrolled.push({
                            id: canonicalId,
                            certification_id: canonicalId,
                            course_name: authCourseName || loadedCourse.name || loadedCourse.title,
                            title: authCourseName || loadedCourse.title || loadedCourse.name,
                            category: loadedCourse.category || "Free Awareness Courses",
                            enrolledAt: new Date().toISOString(),
                            status: "active"
                        });
                        localStorage.setItem("bb_enrolled_courses", JSON.stringify(enrolled));
                    }
                } catch (e) {}

                /* -----------------------------------------
                   3. CONSTRUCT / FORMAT LESSONS (STANDARDIZED 5 CHAPTERS)
                ----------------------------------------- */
                const staticCourse = freeCoursesData.find(
                    (c) =>
                        String(c.id) === String(canonicalId) ||
                        String(c.altId) === String(canonicalId) ||
                        String(c.id) === String(id) ||
                        String(c.slug).toLowerCase() === String(id).toLowerCase() ||
                        String(c.altSlug).toLowerCase() === String(id).toLowerCase() ||
                        c.title.toLowerCase() === String(authCourseName).toLowerCase()
                );

                const isFreeTrack = Boolean(staticCourse || AUTHORITATIVE_FREE_COURSE_NAMES[canonicalId] || FREE_COURSE_DB_MAP[String(id).toLowerCase().trim()]);

                if (isFreeTrack) {
                    const cName = authCourseName || staticCourse?.title || "Course";
                    const ch1Topics = staticCourse?.curriculum?.[0]?.lessons || [
                        `Purpose, Scope & Foundations of ${cName}`,
                        "Harmonized Structure & Key Objectives",
                        "Fundamental Principles & Application"
                    ];
                    const ch2Topics = staticCourse?.curriculum?.[1]?.lessons || [
                        "Essential Concepts, Terminology & Principles",
                        "Framework Operations & Methodologies",
                        "Risk Assessment & Strategic Alignment"
                    ];
                    const ch3Topics = staticCourse?.curriculum?.[2]?.lessons || [
                        "Operational Synthesis & Review of Key Principles",
                        "Performance Evaluation, Verification & Auditing",
                        "Continual Improvement & Knowledge Consolidation"
                    ];

                    const freeChapters = [
                        {
                            id: 1,
                            certification_id: canonicalId,
                            chapter: "Chapter 1",
                            title: `Introduction to ${cName}`,
                            duration: "45 Mins",
                            type: "lesson",
                            topics: ch1Topics,
                            video_url: CHAPTER_VIDEO_MAP[`Introduction to ${cName}`] || CHAPTER_VIDEO_MAP[cName] || DEFAULT_YOUTUBE_VIDEO,
                            pdf_url: "",
                            slides_url: "",
                            thumbnail_url: staticCourse?.image || loadedCourse?.image || "",
                            sort_order: 1,
                            completed: false,
                        },
                        {
                            id: 2,
                            certification_id: canonicalId,
                            chapter: "Chapter 2",
                            title: "Understands Core Concepts",
                            duration: "1 Hour 15 Mins",
                            type: "lesson",
                            topics: ch2Topics,
                            video_url: CHAPTER_VIDEO_MAP["Understands Core Concepts"] || DEFAULT_YOUTUBE_VIDEO,
                            pdf_url: "",
                            slides_url: "",
                            thumbnail_url: staticCourse?.image || loadedCourse?.image || "",
                            sort_order: 2,
                            completed: false,
                        },
                        {
                            id: 3,
                            certification_id: canonicalId,
                            chapter: "Chapter 3",
                            title: "Course Summary",
                            duration: "45 Mins",
                            type: "lesson",
                            topics: ch3Topics,
                            video_url: CHAPTER_VIDEO_MAP["Course Summary"] || DEFAULT_YOUTUBE_VIDEO,
                            pdf_url: "",
                            slides_url: "",
                            thumbnail_url: staticCourse?.image || loadedCourse?.image || "",
                            sort_order: 3,
                            completed: false,
                        },
                        {
                            id: 4,
                            certification_id: canonicalId,
                            chapter: "Chapter 4",
                            title: "Assessment",
                            duration: "30 Mins",
                            type: "assessment",
                            topics: [`${cName} Official Assessment (10 Questions, 70% to Pass)`],
                            video_url: DEFAULT_YOUTUBE_VIDEO,
                            pdf_url: "",
                            slides_url: "",
                            thumbnail_url: "",
                            sort_order: 4,
                            completed: false,
                        },
                        {
                            id: 5,
                            certification_id: canonicalId,
                            chapter: "Chapter 5",
                            title: "Download Certificate",
                            duration: "Immediate",
                            type: "certificate",
                            topics: ["Official Verifiable Certificate of Achievement with Instant QR Verification"],
                            video_url: DEFAULT_YOUTUBE_VIDEO,
                            pdf_url: "",
                            slides_url: "",
                            thumbnail_url: "",
                            sort_order: 5,
                            completed: false,
                        }
                    ];

                    const userId = resolveUserId(user?.id);
                    const savedProg = getCourseProgress(userId, canonicalId, 5);
                    const doneSet = new Set(savedProg.completedLessonIds || []);
                    const isFullyCompleted = Boolean(savedProg.isCompleted || savedProg.percentage === 100 || savedProg.certificateRecord);

                    const hydratedChapters = freeChapters.map((chap) => ({
                        ...chap,
                        completed: isFullyCompleted ? true : (chap.id === 5 ? (isFullyCompleted || doneSet.has(5) || (doneSet.has(4) && doneSet.size >= 4)) : doneSet.has(chap.id))
                    }));

                    setLessons(hydratedChapters);

                    // Restore last accessed lesson or default to first incomplete
                    if (typeof savedProg.lastAccessedLesson === "number" && savedProg.lastAccessedLesson >= 0 && savedProg.lastAccessedLesson < hydratedChapters.length) {
                        setActiveLesson(savedProg.lastAccessedLesson);
                    } else {
                        const firstIncomplete = hydratedChapters.findIndex(l => !l.completed);
                        if (firstIncomplete > 0) {
                            setActiveLesson(firstIncomplete);
                        }
                    }
                } else if (loadedLessons.length > 0) {
                    const formattedLessons = loadedLessons.map((lesson) => ({
                        ...lesson,
                        id: Number(lesson.id),
                        certification_id: Number(lesson.certification_id || loadedCourse.id),
                        sort_order: Number(lesson.sort_order),
                        completed: false,
                        video_url:
                            lesson.video_url ||
                            lesson.youtube_url ||
                            CHAPTER_VIDEO_MAP[
                                String(lesson.title || "").trim()
                            ] ||
                            DEFAULT_YOUTUBE_VIDEO,
                        pdf_url:
                            lesson.pdf_url ||
                            lesson.slides_url ||
                            "",
                        slides_url:
                            lesson.slides_url ||
                            lesson.pdf_url ||
                            "",
                        thumbnail_url:
                            lesson.thumbnail_url ||
                            lesson.thumbnail ||
                            lesson.image_url ||
                            lesson.image ||
                            "",
                    }));

                    const userId = resolveUserId(user?.id);
                    const savedProg = getCourseProgress(userId, canonicalId, formattedLessons.length);
                    const doneSet = new Set(savedProg.completedLessonIds || []);
                    const hydratedLessons = formattedLessons.map(l => ({
                        ...l,
                        completed: doneSet.has(Number(l.id)) || Boolean(savedProg.isCompleted)
                    }));
                    setLessons(hydratedLessons);

                    if (typeof savedProg.lastAccessedLesson === 'number' && savedProg.lastAccessedLesson >= 0 && savedProg.lastAccessedLesson < hydratedLessons.length) {
                        setActiveLesson(savedProg.lastAccessedLesson);
                    } else {
                        const firstIncomplete = hydratedLessons.findIndex(l => !l.completed);
                        if (firstIncomplete > 0) {
                            setActiveLesson(firstIncomplete);
                        }
                    }
                } else {
                    const modules =
                        loadedCourse.modules && loadedCourse.modules.length > 0
                            ? loadedCourse.modules
                            : generateCurriculumForCourse(
                                  loadedCourse.name || loadedCourse.title,
                                  loadedCourse.category
                              );

                    const generated = [];
                    let sortIndex = 1;

                    modules.forEach((mod, modIdx) => {
                        const chapterName = mod.title || `Module ${modIdx + 1}`;
                        (mod.lessons || []).forEach((lsn, lsnIdx) => {
                            generated.push({
                                id: lsn.id || ((modIdx + 1) * 100 + lsnIdx + 1),
                                certification_id: Number(loadedCourse.id) || 1,
                                chapter: chapterName,
                                title: lsn.title || `Lesson ${lsnIdx + 1}`,
                                duration: lsn.duration || "30 Mins",
                                type: "lesson",
                                video_url:
                                    lsn.video_url ||
                                    CHAPTER_VIDEO_MAP[
                                        String(lsn.title || "").trim()
                                    ] ||
                                    DEFAULT_YOUTUBE_VIDEO,
                                pdf_url: lsn.pdf_url || lsn.slides_url || "",
                                slides_url: lsn.slides_url || lsn.pdf_url || "",
                                thumbnail_url: lsn.thumbnail_url || "",
                                sort_order: sortIndex++,
                                completed: false,
                            });
                        });
                    });

                    generated.push({
                        id: 9999,
                        certification_id: Number(loadedCourse.id) || 1,
                        chapter: "Assessment",
                        title: "Final Certification Assessment",
                        duration: "30 Minutes",
                        type: "assessment",
                        video_url: DEFAULT_YOUTUBE_VIDEO,
                        pdf_url: "",
                        slides_url: "",
                        thumbnail_url: "",
                        sort_order: sortIndex++,
                        completed: false,
                    });

                    const userIdGen = user?.id || 13;
                    const canonicalIdGen = Number(loadedCourse.id || resolvedCourseId || 322);
                    const savedProgGen = getCourseProgress(userIdGen, canonicalIdGen, generated.length);
                    const doneSetGen = new Set(savedProgGen.completedLessonIds || []);
                    const hydratedGenerated = generated.map(l => ({
                        ...l,
                        completed: doneSetGen.has(Number(l.id)) || Boolean(savedProgGen.isCompleted)
                    }));
                    setLessons(hydratedGenerated);

                    if (typeof savedProgGen.lastAccessedLesson === 'number' && savedProgGen.lastAccessedLesson >= 0 && savedProgGen.lastAccessedLesson < hydratedGenerated.length) {
                        setActiveLesson(savedProgGen.lastAccessedLesson);
                    }
                }


            } catch (err) {

                console.error(
                    "Learning load error:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to load course. Please check your connection and try again."
                );

            } finally {

                setLoading(false);

            }

        };


        if (id) {
            loadData();
        }

        // Listen for progress and assessment completion events in real time
        const handleProgressUpdate = () => {
            if (id) loadData();
        };

        window.addEventListener("bb_progress_updated", handleProgressUpdate);
        return () => {
            window.removeEventListener("bb_progress_updated", handleProgressUpdate);
        };

    }, [id, retryKey]);


    /* =====================================================
       CURRENT LESSON
    ===================================================== */

    const currentLesson =
        lessons[activeLesson];


    /* =====================================================
       LOAD LESSON RESOURCES
       
       NOTE:
       These resources are ONLY for Download PDF.
       They do NOT control See Slides.
    ===================================================== */

    useEffect(() => {

        const loadResources = async () => {

            if (!currentLesson?.id) {

                setLessonResources([]);

                return;
            }

            try {

                setResourceLoading(true);

                const response =
                    await getLessonResources(
                        currentLesson.id
                    );

                if (
                    response?.data?.success &&
                    Array.isArray(response?.data?.data)
                ) {

                    const resources =
                        response.data.data
                            .filter(
                                (resource) =>
                                    resource.status === undefined ||
                                    resource.status === "active"
                            )
                            .sort(
                                (a, b) =>
                                    Number(a.sort_order || 0) -
                                    Number(b.sort_order || 0)
                            );

                    setLessonResources(resources);

                } else {

                    setLessonResources([]);

                }

            } catch (err) {

                console.error(
                    "Lesson resources error:",
                    err
                );

                setLessonResources([]);

            } finally {

                setResourceLoading(false);

            }

        };


        loadResources();

    }, [currentLesson?.id]);


    /* =====================================================
       RESOURCE FILE URL
    ===================================================== */

    const getResourceUrl = (resource) => {

        if (!resource) return "";

        return assetUrl(
            resource.file_url ||
            resource.pdf_url ||
            resource.slides_url ||
            ""
        );
    };


    /* =====================================================
       PRIMARY SLIDES URL
       
       IMPORTANT:
       See Slides gets PDF ONLY from currentLesson.slides_url
       / course_lessons.
       
       It does NOT use lesson_resources.
    ===================================================== */

    const getSlidesUrl = () => {

        if (!currentLesson) {
            return "";
        }

        return assetUrl(
            currentLesson.slides_url ||
            currentLesson.pdf_url ||
            ""
        );
    };


    /* =====================================================
       YOUTUBE VIDEO URL
    ===================================================== */

    const getVideoUrl = () => {

        if (!currentLesson) {
            return "";
        }

        const videoSource =
            currentLesson.video_url ||
            currentLesson.youtube_url ||
            CHAPTER_VIDEO_MAP[
                String(
                    currentLesson.title || ""
                ).trim()
            ] ||
            DEFAULT_YOUTUBE_VIDEO;

        return getYouTubeEmbedUrl(
            videoSource
        );
    };


    /* =====================================================
       THUMBNAIL
    ===================================================== */

    const getThumbnail = () => {

        if (!course) {
            return "";
        }

        const lessonThumbnail =
            currentLesson?.thumbnail_url ||
            currentLesson?.thumbnail ||
            currentLesson?.image_url ||
            currentLesson?.image;

        const courseThumbnail =
            course?.thumbnail_url ||
            course?.thumbnail ||
            course?.image_url ||
            course?.image ||
            course?.course_image ||
            course?.course_thumbnail;

        if (lessonThumbnail) {
            return assetUrl(lessonThumbnail);
        }

        if (courseThumbnail) {
            return assetUrl(courseThumbnail);
        }

        return assetUrl(
            `uploads/thumbnails/course-${id}.jpg`
        );
    };


    /* =====================================================
       LOAD PDF
    ===================================================== */

    const loadPdf = async () => {

        const url = getSlidesUrl();

        console.log(
            "Dynamic lesson slides URL:",
            url
        );

        if (!url) {

            setPdfPages([]);

            setPdfError(
                "PDF slides are not available for this lesson."
            );

            return;
        }

        try {

            setPdfLoading(true);
            setPdfError("");
            setPdfPages([]);
            setPdfPage(1);

            const pdf =
                await pdfjsLib
                    .getDocument({
                        url,
                        withCredentials: false,
                    })
                    .promise;

            console.log(
                "PDF pages:",
                pdf.numPages
            );

            const pages = [];

            for (
                let pageNumber = 1;
                pageNumber <= pdf.numPages;
                pageNumber++
            ) {

                const page =
                    await pdf.getPage(pageNumber);

                const viewport =
                    page.getViewport({
                        scale: 1.4,
                    });

                const canvas =
                    document.createElement("canvas");

                const context =
                    canvas.getContext("2d");

                if (!context) {
                    continue;
                }

                canvas.width =
                    viewport.width;

                canvas.height =
                    viewport.height;

                await page.render({
                    canvasContext: context,
                    viewport,
                }).promise;

                pages.push(
                    canvas.toDataURL(
                        "image/jpeg",
                        0.92
                    )
                );
            }

            setPdfPages(pages);

        } catch (err) {

            console.error(
                "PDF loading error:",
                err
            );

            setPdfPages([]);

            setPdfError(
                "Unable to load course slides."
            );

        } finally {

            setPdfLoading(false);

        }
    };


    /* =====================================================
       OPEN SLIDES
    ===================================================== */

    const openSlides = async () => {

        const url = getSlidesUrl();

        if (!url) {
            setPdfError(
                "Slides are not available for this lesson."
            );
            return;
        }

        setShowSlides(true);
        setPdfPage(1);
        setPdfPages([]);
        setPdfError("");

        await loadPdf();
    };


    /* =====================================================
       CLOSE SLIDES
    ===================================================== */

    const closeSlides = () => {

        setShowSlides(false);
        setPdfPage(1);
        setPdfPages([]);
        setPdfError("");
    };


    /* =====================================================
       PDF NAVIGATION
    ===================================================== */

    const nextSlide = () => {

        setPdfPage((page) =>
            Math.min(
                page + 1,
                pdfPages.length
            )
        );
    };


    const previousSlide = () => {

        setPdfPage((page) =>
            Math.max(
                page - 1,
                1
            )
        );
    };


    /* =====================================================
       CERTIFICATE ACCESS
    ===================================================== */

    const handleAccessCode = async (event) => {

        event.preventDefault();

        setAccessCodeError("");
        setAccessCodeSuccess("");

        const code =
            accessCode
                .trim()
                .toUpperCase();

        if (!code) {

            setAccessCodeError(
                "Please enter your access code."
            );

            return;
        }


        let user = null;

        try {

            const savedUser =
                localStorage.getItem("bb_user") ||
                localStorage.getItem("user");

            if (savedUser) {

                user =
                    JSON.parse(savedUser);

            }

        } catch (err) {

            console.error(
                "Invalid user data:",
                err
            );
        }


        if (!user) {

            setAccessCodeError(
                "Please login before using the access code."
            );

            return;
        }


        const userId =
            Number(
                user.id ||
                user.user_id ||
                user.userId ||
                0
            );

        const certificationId =
            Number(id);


        if (!userId) {

            setAccessCodeError(
                "Unable to identify the logged-in user."
            );

            return;
        }


        try {

            setAccessCodeLoading(true);

            const response =
                await redeemCertificateCoupon({
                    code,
                    user_id: userId,
                    certification_id:
                        certificationId,
                });


            if (!response?.data?.success) {

                setAccessCodeError(
                    response?.data?.message ||
                    "Invalid or expired access code."
                );

                return;
            }


            setAccessCodeSuccess(
                "Access code verified. Redirecting..."
            );


            localStorage.setItem(
                `certificate_access_${certificationId}`,
                "true"
            );


            if (
                response.data
                    .certificate_number
            ) {

                localStorage.setItem(
                    `certificate_number_${certificationId}`,
                    response.data.certificate_number
                );
            }


            if (
                response.data
                    .certificate_id
            ) {

                localStorage.setItem(
                    `certificate_id_${certificationId}`,
                    String(
                        response.data.certificate_id
                    )
                );
            }

            recordExamBypass(userId, certificationId, response?.data || {});

            setTimeout(() => {

                navigate(
                    `/certificate/${certificationId}`
                );

            }, 500);

        } catch (err) {

            console.error(
                "Access code error:",
                err
            );

            setAccessCodeError(
                err?.response?.data?.message ||
                "Unable to verify access code."
            );

        } finally {

            setAccessCodeLoading(false);
        }
    };


    /* =====================================================
       SELECT LESSON
    ===================================================== */

    const handleLessonClick = (lesson, index) => {
        setActiveLesson(index);

        try {
            const currentUserId = resolveUserId(user?.id);
            const currentCourseId = Number(course?.certification_id || course?.id || resolvedCourseId || id || 322);
            const prog = getCourseProgress(currentUserId, currentCourseId, lessons.length);
            prog.lastAccessedLesson = index;
            localStorage.setItem(`bb_course_progress_${currentUserId}_${currentCourseId}`, JSON.stringify(prog));
        } catch (e) {
            // ignore storage errors
        }

        setShowSlides(false);
        setPdfPage(1);
        setPdfPages([]);
        setPdfError("");
        setLessonResources([]);
    };


    /* =====================================================
       COMPLETE LESSON
    ===================================================== */

    const toggleCompleted = (lessonId) => {
        const targetLesson = lessons.find((l) => Number(l.id) === Number(lessonId));
        if (!targetLesson || targetLesson.type === "assessment" || targetLesson.type === "certificate") {
            return;
        }
        const newStatus = targetLesson ? !targetLesson.completed : true;

        const updatedLessons = lessons.map((lesson) =>
            Number(lesson.id) === Number(lessonId)
                ? {
                    ...lesson,
                    completed: newStatus,
                }
                : lesson
        );

        setLessons(updatedLessons);

        // Persist lesson completion to authoritative progress tracker
        try {
            const currentUserId = user?.id || 13;
            const currentCourseId = Number(course?.certification_id || course?.id || resolvedCourseId || id || 322);
            const totalCount = updatedLessons.length;

            toggleLessonCompleted(
                currentUserId,
                currentCourseId,
                lessonId,
                totalCount
            );
        } catch (err) {
            console.error("Progress persistence error:", err);
        }
    };


    /* =====================================================
       LOADING
    ===================================================== */

    
    // Guard against direct player URL access for offline-only certification courses in Phase 1
    if (!loading && course && !isCourseOnlineAvailable(id, course)) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="max-w-lg w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center text-white shadow-2xl">
                    <div className="w-16 h-16 rounded-2xl bg-amber-400/20 text-amber-400 border border-amber-400/40 flex items-center justify-center mx-auto mb-5 text-2xl font-bold">
                        🚀
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-slate-950 mb-3">
                        {LAUNCH_STATUS_CONFIG.label}
                    </span>
                    <h2 className="text-2xl font-bold text-white mb-3">
                        {course?.title || course?.name || "Professional Certification"}
                    </h2>
                    <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl p-4 text-xs sm:text-sm text-amber-200 mb-6 leading-relaxed">
                        {LAUNCH_STATUS_CONFIG.notice}
                    </div>
                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={() => navigate(`/courses/${id}#offline-enquiry-section`)}
                            className="w-full py-3.5 px-4 bg-[#F8D85A] hover:bg-amber-300 text-[#0B315B] font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer"
                        >
                            {LAUNCH_STATUS_CONFIG.cta}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/free-courses")}
                            className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-xl text-sm transition-all cursor-pointer"
                        >
                            Browse Available Free Courses
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {

        return (
            <div className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-[#F4F7FC]
            ">

                <div className="
                    w-10
                    h-10
                    border-4
                    border-gray-200
                    border-t-[#2563EB]
                    rounded-full
                    animate-spin
                " />

            </div>
        );
    }


    /* =====================================================
       ERROR
    ===================================================== */

    if (error) {

        return (
            <div className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-[#F4F7FC]
                p-4
            ">

                <div className="
                    bg-white
                    p-8
                    rounded-2xl
                    shadow-xl
                    border
                    border-slate-200
                    max-w-md
                    w-full
                    text-center
                ">
                    <div className="
                        w-16
                        h-16
                        mx-auto
                        mb-4
                        rounded-full
                        bg-amber-50
                        text-amber-600
                        flex
                        items-center
                        justify-center
                    ">
                        <FaExclamationTriangle size={28} />
                    </div>

                    <h2 className="
                        text-xl
                        font-bold
                        text-[#0B315B]
                        mb-2
                    ">
                        Course Unavailable
                    </h2>

                    <p className="
                        text-slate-600
                        text-sm
                        mb-6
                        leading-relaxed
                    ">
                        {error}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            type="button"
                            onClick={() => setRetryKey((k) => k + 1)}
                            className="
                                px-5
                                py-2.5
                                bg-[#2563EB]
                                hover:bg-[#1d4ed8]
                                text-white
                                font-semibold
                                text-sm
                                rounded-xl
                                transition
                                cursor-pointer
                                flex
                                items-center
                                justify-center
                                gap-2
                            "
                        >
                            <FaRedo size={12} />
                            Retry Loading
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/free-courses")}
                            className="
                                px-5
                                py-2.5
                                bg-slate-100
                                hover:bg-slate-200
                                text-slate-700
                                font-semibold
                                text-sm
                                rounded-xl
                                transition
                                cursor-pointer
                            "
                        >
                            Browse All Courses
                        </button>
                    </div>

                </div>

            </div>
        );
    }


    /* =====================================================
       NO DATA
    ===================================================== */

    if (
        !course ||
        !lessons.length
    ) {

        return (
            <div className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-[#F4F7FC]
            ">

                <p className="
                    font-semibold
                    text-[#183B73]
                ">
                    No course data available.
                </p>

            </div>
        );
    }


    const videoUrl =
        getVideoUrl();

    const slidesUrl =
        getSlidesUrl();


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <section className="
            min-h-screen
            bg-[#F4F7FC]
            py-7
        ">

            <div className="
                max-w-[1450px]
                mx-auto
                px-4
                sm:px-5
                lg:px-6
            ">

                <div className="
                    grid
                    grid-cols-12
                    gap-6
                    items-start
                ">


                    {/* =====================================
                        SIDEBAR
                    ===================================== */}

                    {/* MOBILE COURSE OUTLINE TRIGGER */}
                    <div className="col-span-12 lg:hidden mb-1">
                        <div className="bg-[#0B1B3D] text-white p-3.5 rounded-xl flex items-center justify-between shadow-md">
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setMobileOutlineOpen(true)}
                                    className="p-2 bg-white/10 hover:bg-white/20 text-amber-400 rounded-lg transition"
                                    aria-label="Open Course Outline"
                                >
                                    <FaBars className="text-base" />
                                </button>
                                <div>
                                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">Course Content</span>
                                    <span className="text-xs font-semibold text-slate-200">
                                        {lessons.filter(l => Boolean(l.completed)).length}/{lessons.length} Modules ({lessons.length > 0 ? Math.round((lessons.filter(l => Boolean(l.completed)).length / lessons.length) * 100) : 0}%)
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setMobileOutlineOpen(true)}
                                className="text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-900 px-3 py-1.5 rounded-lg shadow transition"
                            >
                                Outline
                            </button>
                        </div>
                    </div>

                    {/* =====================================
                        SIDEBAR (DESKTOP + MOBILE DRAWER)
                    ===================================== */}
                    {/* Mobile Drawer Backdrop */}
                    {mobileOutlineOpen && (
                        <div
                            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 lg:hidden"
                            onClick={() => setMobileOutlineOpen(false)}
                            aria-hidden="true"
                        />
                    )}

                    <aside className={`
                        col-span-12
                        lg:col-span-4
                        xl:col-span-3
                        ${mobileOutlineOpen
                            ? "fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-50 shadow-2xl overflow-y-auto block p-4"
                            : "hidden lg:block"}
                    `}>
                        <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(15,23,42,0.08)] border border-slate-100 overflow-hidden sticky top-24">

                            {/* COMPACT SIDEBAR HEADER */}
                            <div className="bg-[#0B1B3D] text-white px-4 py-3.5 border-b border-slate-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Course Content</span>
                                        <h3 className="text-sm font-bold text-white leading-tight truncate max-w-[200px]" title={course?.title || "Curriculum"}>
                                            {course?.title || "Curriculum"}
                                        </h3>
                                    </div>
                                    {mobileOutlineOpen && (
                                        <button
                                            type="button"
                                            onClick={() => setMobileOutlineOpen(false)}
                                            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 lg:hidden"
                                            aria-label="Close Course Outline"
                                        >
                                            <FaTimes className="text-base" />
                                        </button>
                                    )}
                                </div>

                                {/* Progress stats & slim bar */}
                                <div className="mt-2.5">
                                    <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
                                        <span>{lessons.length} Modules • {lessons.filter(l => Boolean(l.completed)).length} Done</span>
                                        <span className="font-bold text-amber-300">
                                            {lessons.length > 0 ? Math.round((lessons.filter(l => Boolean(l.completed)).length / lessons.length) * 100) : 0}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-white/15 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 h-full rounded-full transition-all duration-300"
                                            style={{
                                                width: `${lessons.length > 0 ? Math.round((lessons.filter(l => Boolean(l.completed)).length / lessons.length) * 100) : 0}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* CHAPTER ACCORDION & LESSON ROWS */}
                            <div className="divide-y divide-slate-100 max-h-[calc(100vh-220px)] overflow-y-auto">
                                {lessons.map((lesson, index) => {
                                    const isActive = activeLesson === index;
                                    const isCompleted = Boolean(lesson.completed);
                                    const isExpanded = Boolean(expandedChapters[index]);
                                    const hasTopics = Array.isArray(lesson.topics) && lesson.topics.length > 0;

                                    // Lesson Type Icon & Color
                                    let typeIcon = <FaPlay className="text-[10px] text-blue-600" />;
                                    if (lesson.type === "assessment") {
                                        typeIcon = <FaClipboardCheck className="text-[11px] text-purple-600" />;
                                    } else if (lesson.type === "certificate") {
                                        typeIcon = <FaAward className="text-[12px] text-amber-500" />;
                                    } else if (lesson.type === "document" || lesson.type === "slides") {
                                        typeIcon = <FaBookOpen className="text-[10px] text-slate-600" />;
                                    }

                                    return (
                                        <div
                                            key={lesson.id || index}
                                            className={`
                                                transition-colors
                                                ${isActive ? "bg-blue-50/70 border-l-4 border-l-[#1E40AF]" : "bg-white hover:bg-slate-50"}
                                            `}
                                        >
                                            <div
                                                onClick={() => {
                                                    handleLessonClick(lesson, index);
                                                    if (mobileOutlineOpen) setMobileOutlineOpen(false);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" || e.key === " ") {
                                                        e.preventDefault();
                                                        handleLessonClick(lesson, index);
                                                        if (mobileOutlineOpen) setMobileOutlineOpen(false);
                                                    }
                                                }}
                                                role="button"
                                                tabIndex={0}
                                                aria-current={isActive ? "true" : undefined}
                                                className="cursor-pointer py-3 px-3.5 flex items-start gap-2.5 focus:outline-none focus:bg-blue-50/90"
                                            >
                                                {/* Status Checkbox / Completion Icon */}
                                                <div className="shrink-0 mt-0.5">
                                                    {lesson.type === "assessment" || lesson.type === "certificate" ? (
                                                        isCompleted ? (
                                                            <FaCheckCircle className="text-emerald-600 text-base" />
                                                        ) : (
                                                            <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                                            </div>
                                                        )
                                                    ) : (
                                                        <input
                                                            type="checkbox"
                                                            checked={isCompleted}
                                                            onClick={(e) => e.stopPropagation()}
                                                            onChange={() => toggleCompleted(lesson.id)}
                                                            className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                                                            aria-label={`Mark ${lesson.title} complete`}
                                                        />
                                                    )}
                                                </div>

                                                {/* Chapter Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="p-0.5 bg-slate-100 rounded text-slate-600">{typeIcon}</span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                                                            {lesson.chapter || `Module ${index + 1}`}
                                                        </span>
                                                    </div>

                                                    <h4 className={`
                                                        text-xs font-semibold leading-snug mt-1 break-words
                                                        ${isActive ? "text-[#0B1B3D] font-bold" : "text-slate-700"}
                                                    `}>
                                                        {lesson.title}
                                                    </h4>

                                                    {lesson.duration && (
                                                        <span className="inline-block text-[11px] text-slate-400 font-medium mt-1">
                                                            {lesson.duration}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Expand Chevron if module has subtopics */}
                                                {hasTopics && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setExpandedChapters((prev) => ({
                                                                ...prev,
                                                                [index]: !prev[index],
                                                            }));
                                                        }}
                                                        className="shrink-0 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition"
                                                        aria-label="Toggle Subtopics"
                                                    >
                                                        {isExpanded ? (
                                                            <FaChevronUp className="text-[10px]" />
                                                        ) : (
                                                            <FaChevronDown className="text-[10px]" />
                                                        )}
                                                    </button>
                                                )}
                                            </div>

                                            {/* Subsections / Topics accordion */}
                                            {hasTopics && isExpanded && (
                                                <div className="bg-slate-50/80 border-t border-slate-100 px-3.5 py-2 space-y-1">
                                                    {lesson.topics.map((topic, tIdx) => (
                                                        <div key={tIdx} className="text-[11px] text-slate-600 flex items-start gap-2 pl-4 py-0.5">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0 mt-1" />
                                                            <span className="leading-tight">{topic}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </aside>


                    {/* =====================================
                        MAIN
                    ===================================== */}

                    <main className="
                        col-span-12
                        lg:col-span-8
                        xl:col-span-9
                    ">

                        <div className="
                            bg-white
                            rounded-2xl
                            shadow-[0_10px_30px_rgba(15,23,42,0.10)]
                            overflow-hidden
                        ">


                            {/* =================================
                                HEADER
                            ================================= */}

                            <div className="
                                px-6
                                lg:px-8
                                py-7
                            ">

                                <div className="
                                    flex
                                    flex-col
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                    gap-5
                                ">

                                    <div>

                                        <span className="
                                            inline-flex
                                            bg-[#2563EB]
                                            text-white
                                            px-5
                                            py-2
                                            rounded-full
                                            text-xs
                                            font-semibold
                                        ">
                                            {course.category}
                                        </span>

                                        <h1 className="
                                            text-2xl
                                            sm:text-3xl
                                            font-bold
                                            text-[#183B73]
                                            mt-5
                                        ">
                                            {course.name}
                                        </h1>

                                    </div>


                                    {/* =================================
                                        SEE SLIDES
                                        
                                        IMPORTANT:
                                        Uses course_lessons.slides_url
                                        NOT lesson_resources.
                                    ================================= */}

                                    <button
                                        type="button"
                                        onClick={openSlides}
                                        disabled={!slidesUrl}
                                        className="
                                            flex
                                            items-center
                                            justify-center
                                            gap-2
                                            px-5
                                            py-3
                                            rounded-xl
                                            text-sm
                                            font-semibold
                                            bg-[#2563EB]
                                            text-white
                                            hover:bg-blue-700
                                            transition
                                            shrink-0
                                            disabled:opacity-50
                                            disabled:cursor-not-allowed
                                        "
                                    >

                                        <FaImages />

                                        {!slidesUrl
                                            ? "Slides Unavailable"
                                            : showSlides
                                                ? "Slides Open"
                                                : "See Slides"
                                        }

                                    </button>

                                </div>

                            </div>


                            <div className="
                                border-t
                                border-gray-100
                                p-5
                                sm:p-7
                            ">


                                {/* =================================
                                    THUMBNAIL
                                    
                                    Hidden while slides are open.
                                ================================= */}

                                {!showSlides && (
                                    <div>
                                        {/* CHAPTER 4: ASSESSMENT VIEW */}
                                        {currentLesson?.type === "assessment" && (
                                            <div className="space-y-6">
                                                <div className="bg-gradient-to-br from-[#102B4E] to-[#1E5FA8] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                                                    <div className="relative z-10">
                                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-3 border border-white/10">
                                                            <FaAward />
                                                            <span>Official Certification Assessment</span>
                                                        </div>
                                                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                                                            {currentLesson.title} — {course.name}
                                                        </h2>
                                                        <p className="mt-2 text-blue-100 text-sm sm:text-base max-w-2xl leading-relaxed">
                                                            Test your comprehensive understanding of the foundational concepts, terminology, and operational requirements presented across Chapters 1 to 3.
                                                        </p>

                                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mt-6 pt-6 border-t border-white/15 text-xs sm:text-sm">
                                                            <div className="bg-white/10 rounded-xl p-3">
                                                                <span className="text-blue-200 block text-xs font-medium">Questions</span>
                                                                <span className="text-lg font-bold text-white">10 Questions</span>
                                                            </div>
                                                            <div className="bg-white/10 rounded-xl p-3">
                                                                <span className="text-blue-200 block text-xs font-medium">Passing Threshold</span>
                                                                <span className="text-lg font-bold text-amber-300">70% to Pass</span>
                                                            </div>
                                                            <div className="bg-white/10 rounded-xl p-3 col-span-2 sm:col-span-1">
                                                                <span className="text-blue-200 block text-xs font-medium">Format</span>
                                                                <span className="text-lg font-bold text-white">Timed Multiple Choice</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Assessment Status & Action Card */}
                                                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                                                    {currentLesson.completed ? (
                                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl bg-emerald-50 border border-emerald-200">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                                                                    <FaCheckCircle className="text-lg" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-bold text-emerald-950 text-base">Assessment Passed!</h4>
                                                                    <p className="text-xs text-emerald-700 mt-0.5">
                                                                        You have met or exceeded the 70% passing threshold for {course.name}.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-wrap items-center gap-2.5">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const targetAssignmentId = Number(FREE_COURSE_DB_MAP[String(id).toLowerCase().trim()] || resolvedCourseId || id || 322);
                                                                        navigate(`/assignment/${targetAssignmentId}`);
                                                                    }}
                                                                    className="px-4 py-2.5 rounded-xl font-bold text-xs bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition cursor-pointer"
                                                                >
                                                                    Retake Assessment
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setActiveLesson(4)}
                                                                    className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#1E5FA8] hover:bg-[#164C82] text-white transition flex items-center gap-1.5 cursor-pointer"
                                                                >
                                                                    <span>Download Certificate</span>
                                                                    <FaArrowRight size={11} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-5">
                                                            <div className="flex items-start gap-4">
                                                                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1E5FA8] flex items-center justify-center shrink-0 text-xl font-bold">
                                                                    📝
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-lg font-bold text-slate-900">Ready to take your certification exam?</h3>
                                                                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                                                                        Once you start, you will have 30 minutes to answer 10 multiple-choice questions. A score of 70% or higher is required to earn your credential and unlock Chapter 5.
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-3 pt-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const targetAssignmentId = Number(FREE_COURSE_DB_MAP[String(id).toLowerCase().trim()] || resolvedCourseId || id || 322);
                                                                        navigate(`/assignment/${targetAssignmentId}`);
                                                                    }}
                                                                    className="px-6 py-3.5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                                                                >
                                                                    <span>Launch Chapter 4 Assessment</span>
                                                                    <FaArrowRight size={12} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* CHAPTER 5: CERTIFICATE VIEW */}
                                        {currentLesson?.type === "certificate" && (
                                            <div className="space-y-6">
                                                <div className="bg-gradient-to-br from-[#102B4E] to-[#0A192F] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-[#E8B95D]/30">
                                                    <div className="relative z-10">
                                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8B95D]/20 text-[#E8B95D] text-xs font-semibold mb-3 border border-[#E8B95D]/30">
                                                            <FaAward />
                                                            <span>Verifiable Digital Credential</span>
                                                        </div>
                                                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                                                            {currentLesson.title} — {course.name}
                                                        </h2>
                                                        <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                                                            Official Broadbeach Academy Certificate of Achievement. Recognized across quality, environmental, safety, and business operations worldwide.
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Certificate Eligibility State */}
                                                {(lessons[3]?.completed || lessons[4]?.completed || lessons.every(l => l.completed)) ? (
                                                    <div className="bg-white rounded-2xl border border-emerald-200 p-6 sm:p-8 shadow-sm space-y-6">
                                                        <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                                                            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xl font-bold">
                                                                <FaAward />
                                                            </div>
                                                            <div>
                                                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Requirements Satisfied</span>
                                                                <h3 className="text-lg font-bold text-emerald-950">Congratulations! Your Certificate is Ready</h3>
                                                                <p className="text-xs sm:text-sm text-emerald-700 mt-0.5">
                                                                    You have successfully passed the assessment and met all completion criteria for {course.name}.
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const targetCertId = Number(FREE_COURSE_DB_MAP[String(id).toLowerCase().trim()] || resolvedCourseId || id || 322);
                                                                    navigate(`/certificate/${targetCertId}`);
                                                                }}
                                                                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#102B4E] to-[#1E5FA8] hover:from-[#164C82] hover:to-[#2563EB] text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                                                            >
                                                                <FaDownload size={14} />
                                                                <span>Download & View Certificate</span>
                                                            </button>
                                                            <span className="text-xs text-slate-500">
                                                                Includes verifiable QR code & permanent certification identifier.
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="bg-white rounded-2xl border border-amber-200 p-6 sm:p-8 shadow-sm space-y-5">
                                                        <div className="flex items-start gap-4">
                                                            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0 text-xl font-bold">
                                                                <FaLock />
                                                            </div>
                                                            <div>
                                                                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full inline-block mb-1">
                                                                    Certificate Locked
                                                                </span>
                                                                <h3 className="text-lg font-bold text-slate-900">
                                                                    Complete the Course Requirements to Unlock Your Certificate
                                                                </h3>
                                                                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                                                                    Your certificate will become available immediately upon passing the final assessment. Here is what remains incomplete:
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                                                            {lessons.slice(0, 4).map((item, idx) => (
                                                                <div key={item.id || idx} className="p-3.5 flex items-center justify-between gap-3 text-xs sm:text-sm">
                                                                    <div className="flex items-center gap-3">
                                                                        {item.completed ? (
                                                                            <FaCheckCircle className="text-emerald-600 shrink-0" size={16} />
                                                                        ) : (
                                                                            <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
                                                                        )}
                                                                        <span className={item.completed ? "font-medium line-through text-slate-400" : "font-semibold text-slate-800"}>
                                                                            {item.chapter} — {item.title}
                                                                        </span>
                                                                    </div>
                                                                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${item.completed ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                                                                        {item.completed ? "Complete" : "Pending"}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div className="pt-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => setActiveLesson(3)}
                                                                className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-[#1E5FA8] hover:bg-[#164C82] text-white shadow-sm transition flex items-center gap-2 cursor-pointer"
                                                            >
                                                                <span>Go to Chapter 4 Assessment</span>
                                                                <FaArrowRight size={11} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* CHAPTERS 1-3: STANDARD LESSON VIEW */}
                                        {currentLesson?.type !== "assessment" && currentLesson?.type !== "certificate" && (
                                            <div>
                                                {/* YOUTUBE VIDEO */}
                                                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-[0_10px_30px_rgba(15,23,42,0.12)]">
                                                    {videoUrl ? (
                                                        <iframe
                                                            key={videoUrl}
                                                            src={videoUrl}
                                                            title={currentLesson?.title || course?.name || "Course Video"}
                                                            className="absolute inset-0 w-full h-full border-0"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                            allowFullScreen
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center text-white text-center px-6">
                                                            <p className="font-semibold">Video is not available for this lesson.</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
                                                    <div>
                                                        <span className="text-xs font-bold text-[#1E5FA8] uppercase tracking-wider block mb-1">
                                                            {currentLesson.chapter}
                                                        </span>
                                                        <h2 className="text-xl sm:text-2xl font-bold text-[#183B73]">
                                                            {currentLesson.title}
                                                        </h2>
                                                        <p className="text-gray-500 mt-1 text-xs sm:text-sm">
                                                            Watch the lecture before marking this chapter complete.
                                                        </p>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => toggleCompleted(currentLesson.id)}
                                                        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold shrink-0 cursor-pointer ${
                                                            currentLesson.completed ? "bg-green-100 text-green-700" : "bg-green-600 hover:bg-green-700 text-white"
                                                        }`}
                                                    >
                                                        <FaCheckCircle />
                                                        {currentLesson.completed ? "Completed" : "Mark Complete"}
                                                    </button>
                                                </div>

                                                {/* Topics List */}
                                                {currentLesson?.topics?.length > 0 && (
                                                    <div className="mt-6 p-5 rounded-xl bg-slate-50 border border-slate-200">
                                                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                                                            Topics Covered in this Chapter
                                                        </h4>
                                                        <ul className="space-y-2">
                                                            {currentLesson.topics.map((top, tIdx) => (
                                                                <li key={tIdx} className="text-xs sm:text-sm text-slate-600 flex items-start gap-2">
                                                                    <span className="text-blue-500 font-bold">•</span>
                                                                    <span>{typeof top === "string" ? top : top.title}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}


                                {/* =================================
                                    LESSON RESOURCES
                                    
                                    Hidden when slides are open.
                                    These come ONLY from lesson_resources.
                                ================================= */}

                                {!showSlides &&
                                    lessonResources.length > 0 && (

                                        <div className="
                                            mt-8
                                            space-y-4
                                        ">

                                            <h3 className="
                                                text-xl
                                                font-bold
                                                text-[#183B73]
                                            ">
                                                Lesson Resources
                                            </h3>


                                            {lessonResources.map(
                                                (resource, index) => {

                                                    const fileUrl =
                                                        getResourceUrl(
                                                            resource
                                                        );

                                                    const fileName =
                                                        resource.file_url
                                                            ?.split("/")
                                                            .pop() ||
                                                        resource.pdf_url
                                                            ?.split("/")
                                                            .pop() ||
                                                        resource.slides_url
                                                            ?.split("/")
                                                            .pop() ||
                                                        "Lesson Resource";


                                                    return (

                                                        <div
                                                            key={
                                                                resource.id ||
                                                                index
                                                            }
                                                            className="
                                                                flex
                                                                flex-col
                                                                sm:flex-row
                                                                sm:items-center
                                                                sm:justify-between
                                                                gap-4
                                                                p-5
                                                                bg-white
                                                                border
                                                                border-gray-200
                                                                rounded-xl
                                                            "
                                                        >

                                                            <div>

                                                                <p className="
                                                                    font-semibold
                                                                    text-[#183B73]
                                                                ">
                                                                    {
                                                                        resource.title ||
                                                                        currentLesson.title
                                                                    }
                                                                </p>

                                                                <p className="
                                                                    text-xs
                                                                    text-gray-500
                                                                    mt-1
                                                                ">
                                                                    {fileName}
                                                                </p>

                                                            </div>


                                                            {fileUrl && (

                                                                <a
                                                                    href={fileUrl}
                                                                    download
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="
                                                                        shrink-0
                                                                        inline-flex
                                                                        items-center
                                                                        justify-center
                                                                        gap-2
                                                                        px-5
                                                                        py-2.5
                                                                        rounded-lg
                                                                        bg-[#2563EB]
                                                                        text-white
                                                                        text-sm
                                                                        font-semibold
                                                                        hover:bg-blue-700
                                                                    "
                                                                >

                                                                    <FaDownload />

                                                                    Download PDF

                                                                </a>

                                                            )}

                                                        </div>

                                                    );
                                                }
                                            )}

                                        </div>

                                    )}


                                {/* =================================
                                    NO RESOURCES
                                ================================= */}

                                {!showSlides &&
                                    !resourceLoading &&
                                    !lessonResources.length &&
                                    currentLesson?.type === "lesson" && (

                                        <div className="
                                            mt-8
                                            p-5
                                            bg-gray-50
                                            border
                                            border-gray-200
                                            rounded-xl
                                            text-sm
                                            text-gray-500
                                        ">
                                            No resources available for this lesson.
                                        </div>

                                    )}


                                {/* =================================
                                    CERTIFICATE ACCESS
                                    
                                    Hidden when slides are open.
                                ================================= */}

                                {!showSlides && (

                                    <div className="
                                        mt-8
                                        bg-white
                                        border
                                        border-gray-200
                                        rounded-2xl
                                        p-5
                                        sm:p-6
                                    ">

                                        <h3 className="
                                            text-lg
                                            font-bold
                                            text-[#183B73]
                                            mb-1
                                        ">
                                            Certificate Access
                                        </h3>

                                        <p className="
                                            text-xs
                                            text-gray-500
                                            mb-3
                                        ">
                                            Enter your access code to continue to your certificate.
                                        </p>


                                        <form
                                            onSubmit={
                                                handleAccessCode
                                            }
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                                flex-wrap
                                            "
                                        >

                                            <input
                                                type="text"
                                                value={accessCode}
                                                onChange={(e) =>
                                                    setAccessCode(
                                                        e.target.value.toUpperCase()
                                                    )
                                                }
                                                placeholder="Access code"
                                                maxLength={50}
                                                className="
                                                    w-[170px]
                                                    h-9
                                                    px-3
                                                    rounded-lg
                                                    border
                                                    border-gray-300
                                                    text-xs
                                                    outline-none
                                                    focus:border-[#2563EB]
                                                    focus:ring-2
                                                    focus:ring-blue-100
                                                "
                                            />


                                            <button
                                                type="submit"
                                                disabled={
                                                    accessCodeLoading
                                                }
                                                className="
                                                    h-9
                                                    px-4
                                                    rounded-lg
                                                    bg-[#2563EB]
                                                    text-white
                                                    text-xs
                                                    font-semibold
                                                    hover:bg-blue-700
                                                    disabled:opacity-60
                                                "
                                            >
                                                {
                                                    accessCodeLoading
                                                        ? "Verifying..."
                                                        : "Verify"
                                                }
                                            </button>

                                        </form>


                                        {accessCodeError && (

                                            <p className="
                                                mt-2
                                                text-xs
                                                text-red-500
                                            ">
                                                {accessCodeError}
                                            </p>

                                        )}


                                        {accessCodeSuccess && (

                                            <p className="
                                                mt-2
                                                text-xs
                                                text-green-600
                                            ">
                                                {accessCodeSuccess}
                                            </p>

                                        )}

                                    </div>

                                )}


                                {/* =================================
                                    PDF SLIDES VIEWER
                                ================================= */}

                                {showSlides && (

                                    <div className="
                                        mt-2
                                        bg-[#F8FBFF]
                                        rounded-2xl
                                        p-4
                                        sm:p-6
                                    ">

                                        <div className="
                                            flex
                                            items-center
                                            justify-between
                                            mb-5
                                        ">

                                            <div>

                                                <p className="
                                                    text-xs
                                                    uppercase
                                                    tracking-wider
                                                    font-semibold
                                                    text-[#2563EB]
                                                ">
                                                    Course Slides
                                                </p>

                                                <h2 className="
                                                    text-xl
                                                    sm:text-2xl
                                                    font-bold
                                                    text-[#183B73]
                                                    mt-1
                                                ">
                                                    {currentLesson.title}
                                                </h2>

                                            </div>


                                            <button
                                                type="button"
                                                onClick={
                                                    closeSlides
                                                }
                                                className="
                                                    text-sm
                                                    font-semibold
                                                    text-gray-500
                                                    hover:text-[#2563EB]
                                                "
                                            >
                                                Close
                                            </button>

                                        </div>


                                        {/* =========================
                                            PDF VIEWER
                                        ========================= */}

                                        <div className="
                                            relative
                                            overflow-hidden
                                            bg-white
                                            rounded-2xl
                                            border
                                            border-gray-200
                                            shadow-[0_10px_30px_rgba(15,23,42,0.08)]
                                        ">


                                            {/* LOADING */}

                                            {pdfLoading && (

                                                <div className="
                                                    h-[500px]
                                                    sm:h-[650px]
                                                    lg:h-[750px]
                                                    flex
                                                    items-center
                                                    justify-center
                                                ">

                                                    <div className="text-center">

                                                        <div className="
                                                            w-10
                                                            h-10
                                                            mx-auto
                                                            border-4
                                                            border-gray-200
                                                            border-t-[#2563EB]
                                                            rounded-full
                                                            animate-spin
                                                        " />

                                                        <p className="
                                                            text-gray-500
                                                            mt-4
                                                        ">
                                                            Loading slides...
                                                        </p>

                                                    </div>

                                                </div>

                                            )}


                                            {/* ERROR */}

                                            {!pdfLoading &&
                                                pdfError && (

                                                    <div className="
                                                        h-[500px]
                                                        sm:h-[650px]
                                                        lg:h-[750px]
                                                        flex
                                                        items-center
                                                        justify-center
                                                        text-center
                                                        px-6
                                                    ">

                                                        <p className="
                                                            text-red-500
                                                            font-semibold
                                                        ">
                                                            {pdfError}
                                                        </p>

                                                    </div>

                                                )}


                                            {/* SLIDES */}

                                            {!pdfLoading &&
                                                !pdfError &&
                                                pdfPages.length > 0 && (

                                                    <div className="
                                                        relative
                                                        overflow-hidden
                                                        w-full
                                                    ">

                                                        <div
                                                            className="
                                                                flex
                                                                w-full
                                                                transition-transform
                                                                duration-300
                                                                ease-in-out
                                                            "
                                                            style={{
                                                                transform:
                                                                    `translateX(-${
                                                                        (pdfPage - 1) *
                                                                        100
                                                                    }%)`,
                                                            }}
                                                        >

                                                            {pdfPages.map(
                                                                (
                                                                    page,
                                                                    index
                                                                ) => (

                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="
                                                                            w-full
                                                                            min-w-full
                                                                            shrink-0
                                                                            h-[500px]
                                                                            sm:h-[650px]
                                                                            lg:h-[750px]
                                                                            flex
                                                                            items-center
                                                                            justify-center
                                                                            bg-white
                                                                        "
                                                                    >

                                                                        <img
                                                                            src={
                                                                                page
                                                                            }
                                                                            alt={
                                                                                `Slide ${
                                                                                    index +
                                                                                    1
                                                                                }`
                                                                            }
                                                                            draggable="false"
                                                                            className="
                                                                                w-full
                                                                                h-full
                                                                                
                                                                                select-none
                                                                            "
                                                                        />

                                                                    </div>

                                                                )
                                                            )}

                                                        </div>

                                                    </div>

                                                )}

                                        </div>


                                        {/* =================================
                                            SLIDE CONTROLS
                                        ================================= */}

                                        {pdfPages.length > 0 && (

                                            <div className="
                                                flex
                                                items-center
                                                justify-center
                                                gap-4
                                                mt-5
                                            ">

                                                <button
                                                    type="button"
                                                    disabled={
                                                        pdfPage === 1
                                                    }
                                                    onClick={
                                                        previousSlide
                                                    }
                                                    className="
                                                        w-11
                                                        h-11
                                                        rounded-full
                                                        border
                                                        border-gray-200
                                                        bg-white
                                                        flex
                                                        items-center
                                                        justify-center
                                                        text-[#183B73]
                                                        hover:bg-[#EEF4FF]
                                                        disabled:opacity-40
                                                        disabled:cursor-not-allowed
                                                    "
                                                >
                                                    <FaChevronLeft />
                                                </button>


                                                <div className="
                                                    px-5
                                                    py-2.5
                                                    rounded-xl
                                                    bg-[#2563EB]
                                                    text-white
                                                    font-semibold
                                                    text-sm
                                                ">
                                                    Slide {pdfPage} /{" "}
                                                    {pdfPages.length}
                                                </div>


                                                <button
                                                    type="button"
                                                    disabled={
                                                        pdfPage ===
                                                        pdfPages.length
                                                    }
                                                    onClick={
                                                        nextSlide
                                                    }
                                                    className="
                                                        w-11
                                                        h-11
                                                        rounded-full
                                                        bg-[#2563EB]
                                                        flex
                                                        items-center
                                                        justify-center
                                                        text-white
                                                        hover:bg-blue-700
                                                        disabled:opacity-40
                                                        disabled:cursor-not-allowed
                                                    "
                                                >
                                                    <FaChevronRight />
                                                </button>

                                            </div>

                                        )}

                                    </div>

                                )}

                            </div>

                        </div>

                    </main>

                </div>

            </div>

        </section>
    );
};

export default Learning;