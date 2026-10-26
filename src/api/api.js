import axios from "axios";


// const API_BASE_URL =
//     "http://localhost/broadbeach-backend/api";

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV
        ? "/api"
        : "https://cadac.in/broadbeachlearning.com/broadbeach-backend/api");


const api = axios.create({

    baseURL: API_BASE_URL,

    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },

    withCredentials: true,

});

/* =========================================
   ENROLL IN COURSE
========================================= */

export const enrollCourse = (certificationId) => {
    return api.post(
        "/enroll-course",
        {
            certification_id: Number(certificationId),
        }
    );
};

export const testSession = () => {
    return api.get("/session-test");
};

/* =========================================
   GET MY COURSES
========================================= */

export const getMyCourses = () => {
    return api.get(
        "/my-courses"
    );
};

/* =========================================
   REGISTER USER
========================================= */

export const registerUser = (data) => {

    return api.post(
        "/register",
        data
    );

};


/* =========================================
   GET LESSON RESOURCES
========================================= */

export const getLessonResources = (lessonId) => {

    return api.get(
        "/lesson-resources",
        {
            params: {
                lesson_id: lessonId,
            },
        }
    );

};

/* =========================================
   LOGIN USER
========================================= */

export const loginUser = (data) => {

    return api.post(
        "/login",
        data
    );

};


/* =========================================
   LOGOUT USER
========================================= */

export const logoutUser = () => {

    return api.post(
        "/logout"
    );

};


/* =========================================
   GET USER PROFILE
========================================= */

export const getUserProfile = () => {

    return api.get(
        "/profile"
    );

};

/* =========================================
   UPDATE USER PROFILE
========================================= */

export const updateUserProfile = (data) => {
    return api.post(
        "/update-profile",
        data
    );
};

/* =========================================
   STUDENT SUPPORT TICKETS (REQ 3)
========================================= */

export const raiseStudentTicket = (data) => {
    return api.post(
        "/tickets",
        data
    );
};

export const getMyTickets = (params = {}) => {
    return api.get(
        "/tickets/my",
        { params }
    );
};



/* =========================================
   GET ALL FREE CERTIFICATIONS
========================================= */

export const getFreeCertifications = () => {

    return api.get(
        "/free-certifications"
    );

};


/* =========================================
   GET SINGLE FREE CERTIFICATION
========================================= */

export const getFreeCertification = (id) => {

    return api.get(
        "/free-certification",
        {
            params: {
                id: id,
            },
        }
    );

};


/* =========================================
   GET COURSE LESSONS
========================================= */

export const getCourseLessons = (
    certificationId
) => {

    return api.get(
        "/course-lessons",
        {
            params: {
                certification_id:
                    certificationId,
            },
        }
    );

};


/* =========================================
   GET ASSESSMENT
========================================= */

export const getAssessment = (id) => {

    return api.get(
        "/assessment",
        {
            params: {
                id: id,
            },
        }
    );

};


/* =========================================
   SUBMIT ASSESSMENT
========================================= */

export const submitAssessment = (data) => {

    return api.post(
        "/submit-assessment",
        data
    );

};


/* =========================================
   CREATE CERTIFICATE
========================================= */

export const createCertificate = (data) => {

    return api.post(
        "/create-certificate",
        data
    );

};


// =====================================================
// PUBLIC PROFESSIONAL CERTIFICATIONS MENU
// =====================================================

export const getProfessionalCertificationMenu = async () => {
    try {

        const response = await api.get(
            "/professional-certifications-menu"
        );

        console.log(
            "PUBLIC PROFESSIONAL CERTIFICATIONS:",
            response.data
        );

        return response.data;

    } catch (error) {

        console.error(
            "PUBLIC PROFESSIONAL CERTIFICATIONS ERROR:",
            error?.response?.data || error
        );

        throw error;
    }
};


// =========================================
// HEADER MENU
// =========================================

export const getHeaderMenu = () => {

    return api.get(
        "/header-menu"
    );

};
export const getCourseDetails = (slug) => {

    return api.get(
        `/courses/${encodeURIComponent(slug)}`
    );

};

export const redeemCourseCoupon = (
    data
) => {

    return api.post(
        "/redeem-course-coupon",
        data
    );
};


// =====================================================
// REDEEM CERTIFICATE COUPON
// =====================================================

export const redeemCertificateCoupon = (data) => {

    return api.post(
        "/redeem-certificate-coupon",
        data
    );

};


/* =========================================
   GET ALL FEATURED COURSES
========================================= */

export const getFeaturedCourses = () => {

    return api.get(
        "/featured-courses"
    );

};


/* =========================================
   GET SINGLE FEATURED COURSE
========================================= */

export const getFeaturedCourse = (id) => {

    return api.get(
        "/featured-course",
        {
            params: {
                id: id,
            },
        }
    );

};

/* =========================================
   SUBMIT COURSE OFFLINE ENQUIRY (PHASE 1)
========================================= */
export const submitCourseEnquiry = (data) => {
    return api.post(
        "/course-enquiry",
        data
    );
};

/* =========================================
   VERIFY CERTIFICATE
========================================= */
export const verifyCertificate = (certificateNumber) => {
    return api.get("/certificates/verify", {
        params: {
            certificate_number: certificateNumber,
        },
    });
};

export default api; 