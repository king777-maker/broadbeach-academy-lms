import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "/api"
    : "https://cadac.in/broadbeachlearning.com/broadbeach-backend/api");

const adminAxios = axios.create({
  baseURL: `${API_BASE_URL}/admin`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

adminAxios.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("bb_admin_token");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Helper for error formatting
const handleApiError = (err) => {
  const message =
    err.response?.data?.message ||
    err.response?.data?.error ||
    err.message ||
    "An unexpected error occurred.";
  const error = new Error(message);
  error.status = err.response?.status;
  error.data = err.response?.data;
  throw error;
};

/* ============================================================================
   1. ADMIN AUTHENTICATION (PASSWORD + 2-STEP TOTP & 4-DIGIT PIN)
============================================================================ */

export const adminLogin = async (credentials) => {
  try {
    const res = await adminAxios.post("/login", credentials);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const adminLogin2FA = async ({ challenge_id, code }) => {
  try {
    const res = await adminAxios.post("/login-2fa", { challenge_id, code });
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const verifyAdminPin = async ({ pin, action, target_id }) => {
  try {
    const res = await adminAxios.post(
      "/verify-pin",
      { pin, action, target_id },
      { headers: { "X-Admin-PIN": String(pin) } }
    );
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const getAdminMe = async () => {
  try {
    const res = await adminAxios.get("/me");
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const adminLogout = async () => {
  try {
    const res = await adminAxios.post("/logout");
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const getAdminOverview = async () => {
  try {
    const res = await adminAxios.get("/overview");
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const globalSearch = async (q) => {
  try {
    const res = await adminAxios.get("/global-search", { params: { q } });
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

/* ============================================================================
   2. MODULE ONE — ONLINE CERT MASTER
============================================================================ */

export const getOnlineCertificates = async (params = {}) => {
  try {
    const res = await adminAxios.get("/online-certificates", { params });
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const revokeOnlineCertificate = async (id, reason, pin = null) => {
  try {
    const headers = pin ? { "X-Admin-PIN": String(pin) } : {};
    const res = await adminAxios.post(
      `/online-certificates/${encodeURIComponent(id)}/revoke`,
      { reason, security_pin: pin },
      { headers }
    );
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const reissueOnlineCertificate = async (id, pin = null) => {
  try {
    const headers = pin ? { "X-Admin-PIN": String(pin) } : {};
    const res = await adminAxios.post(
      `/online-certificates/${encodeURIComponent(id)}/reissue`,
      { security_pin: pin },
      { headers }
    );
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const deleteOnlineCertificate = async (id) => {
  try {
    const res = await adminAxios.delete(`/online-certificates/${encodeURIComponent(id)}`);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

/* ============================================================================
   3. MODULE TWO — MANUAL CERT MASTER
============================================================================ */

export const getManualCertificates = async (params = {}) => {
  try {
    const res = await adminAxios.get("/manual-certificates", { params });
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const createManualCertificate = async (payload, pin = null) => {
  try {
    const headers = pin ? { "X-Admin-PIN": String(pin) } : {};
    const res = await adminAxios.post(
      "/manual-certificates",
      { ...payload, security_pin: pin },
      { headers }
    );
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const updateManualCertificate = async (id, payload, pin = null) => {
  try {
    const headers = pin ? { "X-Admin-PIN": String(pin) } : {};
    const res = await adminAxios.put(
      `/manual-certificates/${encodeURIComponent(id)}`,
      { ...payload, security_pin: pin },
      { headers }
    );
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const revokeManualCertificate = async (id, reason, pin = null) => {
  try {
    const headers = pin ? { "X-Admin-PIN": String(pin) } : {};
    const res = await adminAxios.post(
      `/manual-certificates/${encodeURIComponent(id)}/revoke`,
      { reason, security_pin: pin },
      { headers }
    );
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const deleteManualCertificate = async (id) => {
  try {
    const res = await adminAxios.delete(`/manual-certificates/${encodeURIComponent(id)}`);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

/* ============================================================================
   4. MODULE THREE — TICKET MASTER
============================================================================ */

export const getTickets = async (params = {}) => {
  try {
    const res = await adminAxios.get("/tickets", { params });
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const getTicket = async (id) => {
  try {
    const res = await adminAxios.get(`/tickets/${encodeURIComponent(id)}`);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const createTicket = async (payload) => {
  try {
    const res = await adminAxios.post("/tickets", payload);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const replyTicket = async (id, payload) => {
  try {
    const res = await adminAxios.post(`/tickets/${encodeURIComponent(id)}/reply`, payload);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const addTicketInternalNote = async (id, note) => {
  try {
    const res = await adminAxios.post(`/tickets/${encodeURIComponent(id)}/notes`, { note });
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const updateTicket = async (id, payload) => {
  try {
    const res = await adminAxios.put(`/tickets/${encodeURIComponent(id)}`, payload);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const deleteTicket = async (id) => {
  try {
    const res = await adminAxios.delete(`/tickets/${encodeURIComponent(id)}`);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

/* ============================================================================
   5. MODULE FOUR — TRASH BIN
============================================================================ */

export const getTrashItems = async (params = {}) => {
  try {
    const res = await adminAxios.get("/trash", { params });
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const restoreTrashItem = async (id) => {
  try {
    const res = await adminAxios.post(`/trash/${encodeURIComponent(id)}/restore`);
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const purgeTrashItem = async (id, pin = null) => {
  try {
    const headers = pin ? { "X-Admin-PIN": String(pin) } : {};
    const res = await adminAxios.delete(`/trash/${encodeURIComponent(id)}`, {
      headers,
      data: { security_pin: pin },
    });
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const purgeAllTrash = async (pin = null) => {
  try {
    const headers = pin ? { "X-Admin-PIN": String(pin) } : {};
    const res = await adminAxios.delete("/trash/purge-all", {
      headers,
      data: { security_pin: pin },
    });
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

/* ============================================================================
   6. MODULE FIVE — ADMIN ACCESS & AUDIT LOGS
============================================================================ */

export const getAdminUsers = async () => {
  try {
    const res = await adminAxios.get("/users");
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const createAdminUser = async (payload, pin = null) => {
  try {
    const headers = pin ? { "X-Admin-PIN": String(pin) } : {};
    const res = await adminAxios.post("/users", { ...payload, security_pin: pin }, { headers });
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const updateAdminUser = async (id, payload, pin = null) => {
  try {
    const headers = pin ? { "X-Admin-PIN": String(pin) } : {};
    const res = await adminAxios.put(
      `/users/${encodeURIComponent(id)}`,
      { ...payload, security_pin: pin },
      { headers }
    );
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const resetAdminMfa = async (id, pin = null) => {
  try {
    const headers = pin ? { "X-Admin-PIN": String(pin) } : {};
    const res = await adminAxios.post(
      `/users/${encodeURIComponent(id)}/reset-mfa`,
      { security_pin: pin },
      { headers }
    );
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const getAuditLogs = async (params = {}) => {
  try {
    const res = await adminAxios.get("/audit-logs", { params });
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const getRecentActivities = async (params = {}) => {
  try {
    const res = await adminAxios.get("/activities", { params });
    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export default {
  adminLogin,
  adminLogin2FA,
  verifyAdminPin,
  getAdminMe,
  adminLogout,
  getAdminOverview,
  getRecentActivities,
  getOnlineCertificates,
  revokeOnlineCertificate,
  reissueOnlineCertificate,
  deleteOnlineCertificate,
  getManualCertificates,
  createManualCertificate,
  updateManualCertificate,
  revokeManualCertificate,
  deleteManualCertificate,
  getTickets,
  getTicket,
  createTicket,
  replyTicket,
  addTicketInternalNote,
  updateTicket,
  deleteTicket,
  getTrashItems,
  restoreTrashItem,
  purgeTrashItem,
  purgeAllTrash,
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  resetAdminMfa,
  getAuditLogs,
  globalSearch,
};
