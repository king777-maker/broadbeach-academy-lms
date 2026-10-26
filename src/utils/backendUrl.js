const isProduction = import.meta.env.PROD;

const BACKEND_URL = isProduction
    ? "https://cadac.in/broadbeachlearning.com/broadbeach-backend"
    : "/backend";

const cleanPath = (path = "") => {
    return String(path)
        .trim()
        .replace(/^https?:\/\/localhost\/broadbeach-backend\/?/i, "")
        .replace(/^https?:\/\/localhost\/backend\/?/i, "")
        .replace(/^https?:\/\/cadac\.in\/broadbeachlearning\.com\/broadbeach-backend\/?/i, "")
        .replace(/^https?:\/\/cadac\.in\/backend\/?/i, "")
        .replace(/^\/?broadbeach-backend\/?/i, "")
        .replace(/^\/?backend\/?/i, "")
        .replace(/^\/+/, "");
};

export const backendUrl = (path = "") => {
    if (!path) return BACKEND_URL;

    return `${BACKEND_URL}/${cleanPath(path)}`;
};

export default backendUrl;