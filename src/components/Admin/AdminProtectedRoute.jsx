import React from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import { adminRoutes } from "../../utils/adminRoutes";
import { FaLock, FaShieldAlt } from "react-icons/fa";

const AdminProtectedRoute = ({ children, allowedRoles }) => {
  const { currentAdmin, isAuthenticated, loading } = useAdmin();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07192F] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-300 text-sm font-semibold tracking-wide">
          Verifying Broadbeach Academy Administration Privileges...
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !currentAdmin) {
    return <Navigate to={adminRoutes.login} state={{ from: location }} replace />;
  }

  if (allowedRoles && Array.isArray(allowedRoles) && !allowedRoles.includes(currentAdmin.role)) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-slate-50">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-sm">
          <FaLock />
        </div>
        <h2 className="text-2xl font-bold text-[#0B315B] mb-2">Access Restricted</h2>
        <p className="text-slate-600 max-w-md text-sm mb-6 leading-relaxed">
          Your current role (<strong className="capitalize">{currentAdmin.role?.replace("_", " ")}</strong>) does not have permission to access this module. Please contact the Super Administrator if you require elevated privileges.
        </p>
        <div className="flex gap-3">
          <Link
            to={adminRoutes.base}
            className="px-5 py-2.5 bg-[#0B315B] hover:bg-[#183B73] text-white text-sm font-bold rounded-xl transition"
          >
            Return to Admin Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminProtectedRoute;
