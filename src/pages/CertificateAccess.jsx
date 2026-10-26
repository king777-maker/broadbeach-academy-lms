import {
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    redeemCertificateCoupon,
} from "../api/api";
import { recordExamBypass } from "../utils/progressTracker";


const CertificateAccess = () => {

    // =====================================================
    // ROUTER
    // =====================================================

    const {
        id,
    } = useParams();

    const navigate =
        useNavigate();


    // =====================================================
    // STATES
    // =====================================================

    const [
        couponCode,
        setCouponCode
    ] = useState("");


    const [
        loading,
        setLoading
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    const [
        success,
        setSuccess
    ] = useState("");


    // =====================================================
    // GET LOGGED-IN USER
    // =====================================================

    const getLoggedInUser = () => {
        try {
            const raw = localStorage.getItem("bb_user") || localStorage.getItem("user");
            if (raw) return JSON.parse(raw);
        } catch (error) {
            console.error("Invalid user data:", error);
        }
        return null;
    };


    // =====================================================
    // VERIFY COUPON
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        // Clear messages

        setError("");

        setSuccess("");


        // =================================================
        // CHECK CODE
        // =================================================

        const code =
            couponCode
                .trim()
                .toUpperCase();


        if (!code) {

            setError(
                "Please enter your certificate code."
            );

            return;

        }


        // =================================================
        // CHECK LOGIN
        // =================================================

        const user =
            getLoggedInUser();


        if (!user) {

            setError(
                "Please login before accessing your certificate."
            );

            return;

        }


        const userId =
            Number(
                user.id
            );


        if (!userId) {

            setError(
                "Unable to identify your logged-in account."
            );

            return;

        }


        // =================================================
        // API
        // =================================================

        try {
            setLoading(true);

            const studentName = user.name || user.full_name || (user.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : "Learner");
            const studentEmail = user.email || "learner@broadbeach.in";

            const response = await redeemCertificateCoupon({
                code,
                user_id: userId,
                certification_id: id,
                student_name: studentName,
                candidate_email: studentEmail
            });

            if (!response.data?.success) {
                setError(
                    response.data?.message || "Invalid certificate code."
                );
                return;
            }

            setSuccess("Certificate code verified successfully. Bypassing exam and preparing certificate...");

            localStorage.setItem(`certificate_access_${id}`, "true");
            if (response.data?.certificate_number) {
                localStorage.setItem(`certificate_number_${id}`, response.data.certificate_number);
            }
            if (response.data?.certificate_id) {
                localStorage.setItem(`certificate_id_${id}`, String(response.data.certificate_id));
            }

            recordExamBypass(userId, id, response.data);

            setTimeout(() => {
                navigate(`/certificate/${id}`);
            }, 700);


        } catch (error) {

            console.error(
                "Certificate Coupon Error:",
                error
            );


            setError(
                error.response?.data?.message ||
                error.message ||
                "Unable to verify certificate code."
            );


        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <section
            className="
                min-h-screen
                bg-[#F4F7FC]
                flex
                items-center
                justify-center
                px-4
                py-10
            "
        >

            <div
                className="
                    w-full
                    max-w-xl
                "
            >

                {/* =================================================
                    CARD
                ================================================= */}

                <div
                    className="
                        bg-white
                        rounded-3xl
                        shadow-xl
                        border
                        border-gray-100
                        overflow-hidden
                    "
                >

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div
                        className="
                            bg-[#183B73]
                            px-6
                            md:px-10
                            py-8
                            text-center
                        "
                    >

                        <div
                            className="
                                mx-auto
                                mb-4
                                w-16
                                h-16
                                rounded-full
                                bg-white/10
                                border
                                border-white/20
                                flex
                                items-center
                                justify-center
                            "
                        >

                            <span
                                className="
                                    text-3xl
                                "
                            >
                                🎓
                            </span>

                        </div>


                        <h1
                            className="
                                text-2xl
                                md:text-3xl
                                font-bold
                                text-white
                            "
                        >
                            Certificate Access
                        </h1>


                        <p
                            className="
                                mt-2
                                text-sm
                                md:text-base
                                text-blue-100
                            "
                        >
                            Enter your certificate code
                            to access your certificate.
                        </p>

                    </div>


                    {/* =================================================
                        BODY
                    ================================================= */}

                    <div
                        className="
                            px-6
                            md:px-10
                            py-8
                        "
                    >

                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >

                            {/* =================================================
                                LABEL
                            ================================================= */}

                            <label
                                htmlFor="certificate-code"
                                className="
                                    block
                                    text-sm
                                    font-semibold
                                    text-[#183B73]
                                    mb-2
                                "
                            >
                                Certificate Code
                            </label>


                            {/* =================================================
                                INPUT
                            ================================================= */}

                            <input
                                id="certificate-code"

                                type="text"

                                value={
                                    couponCode
                                }

                                onChange={(event) => {

                                    setCouponCode(
                                        event.target.value
                                            .toUpperCase()
                                    );

                                    setError("");

                                    setSuccess("");

                                }}

                                placeholder="Enter certificate code"

                                autoComplete="off"

                                disabled={
                                    loading
                                }

                                className="
                                    w-full
                                    h-14
                                    px-4
                                    rounded-xl
                                    border
                                    border-gray-200
                                    bg-gray-50
                                    text-[#183B73]
                                    font-semibold
                                    tracking-wider
                                    outline-none
                                    uppercase
                                    focus:bg-white
                                    focus:border-[#2563EB]
                                    focus:ring-4
                                    focus:ring-blue-100
                                    transition
                                    disabled:opacity-60
                                "
                            />


                            {/* =================================================
                                ERROR
                            ================================================= */}

                            {error && (

                                <div
                                    className="
                                        mt-4
                                        p-3
                                        rounded-xl
                                        bg-red-50
                                        border
                                        border-red-100
                                        text-red-600
                                        text-sm
                                        font-medium
                                    "
                                >
                                    {error}
                                </div>

                            )}


                            {/* =================================================
                                SUCCESS
                            ================================================= */}

                            {success && (

                                <div
                                    className="
                                        mt-4
                                        p-3
                                        rounded-xl
                                        bg-green-50
                                        border
                                        border-green-100
                                        text-green-600
                                        text-sm
                                        font-medium
                                    "
                                >
                                    {success}
                                </div>

                            )}


                            {/* =================================================
                                BUTTON
                            ================================================= */}

                            <button
                                type="submit"

                                disabled={
                                    loading
                                }

                                className="
                                    w-full
                                    h-14
                                    mt-6
                                    rounded-xl
                                    bg-[#2563EB]
                                    hover:bg-[#183B73]
                                    text-white
                                    font-semibold
                                    transition
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    disabled:opacity-60
                                    disabled:cursor-not-allowed
                                "
                            >

                                {loading ? (

                                    <>
                                        <span
                                            className="
                                                w-5
                                                h-5
                                                border-2
                                                border-white/30
                                                border-t-white
                                                rounded-full
                                                animate-spin
                                            "
                                        />

                                        Verifying...

                                    </>

                                ) : (

                                    "Verify Certificate"

                                )}

                            </button>

                        </form>


                        {/* =================================================
                            INFORMATION
                        ================================================= */}

                        <div
                            className="
                                mt-6
                                p-4
                                rounded-xl
                                bg-blue-50
                                border
                                border-blue-100
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    md:text-sm
                                    text-[#183B73]
                                    leading-6
                                "
                            >
                                Enter the certificate access code
                                provided to you. A valid code will
                                automatically redirect you to your
                                certificate.
                            </p>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <p
                    className="
                        text-center
                        text-xs
                        text-gray-400
                        mt-5
                    "
                >
                    Your certificate access is linked
                    to your logged-in account.
                </p>

            </div>

        </section>

    );
};


export default CertificateAccess;