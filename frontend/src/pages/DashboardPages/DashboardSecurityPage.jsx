import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, AlertCircle, CheckCircle, X } from "lucide-react";
import {
  changePassword,
  sendResetLink,
} from "../../redux/slice/user/user.slice.js";
import Loader from "../../components/Loader/Loader";
import CustomAlert from "../../components/CustomAlert/CustomAlert";

// Password Input Component
const PasswordInput = ({ label, value, onChange, theme, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="block mb-2 font-medium text-sm">{label}</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 pr-12 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            theme === "dark"
              ? "bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:bg-slate-700"
              : "bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:bg-slate-50"
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors ${
            theme === "dark"
              ? "text-slate-400 hover:text-white hover:bg-slate-700"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          }`}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};

const DashboardSecurityPage = ({ theme }) => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.user);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [alert, setAlert] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Auto-hide alert after 5 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Show success/error from Redux state
  useEffect(() => {
    if (error) {
      setAlert({ type: "error", message: error });
    } else if (success) {
      setAlert({ type: "success", message: success });
    }
  }, [error, success]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  const validateForm = () => {
    const errors = {};

    if (!currentPassword.trim()) {
      errors.currentPassword = "Current password is required";
    }

    if (!newPassword.trim()) {
      errors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      errors.newPassword = "New password must be at least 6 characters long";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      errors.newPassword =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    if (!confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (currentPassword === newPassword) {
      errors.newPassword =
        "New password must be different from current password";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showAlert("error", "Please fix the validation errors below");
      return;
    }

    try {
      await dispatch(
        changePassword({ currentPassword, newPassword, confirmPassword })
      ).unwrap();

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setValidationErrors({});
      showAlert("success", "Password changed successfully!");
    } catch (err) {
      showAlert(
        "error",
        err?.message || "Failed to change password. Please try again."
      );
    }
  };

  return (
    <>
      {/* Custom Alert */}
      {alert && (
        <CustomAlert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div
        className={`p-8 rounded-2xl shadow-xl transition-all duration-300 ${
          theme === "dark"
            ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border border-slate-700"
            : "bg-gradient-to-br from-white via-slate-50 to-white text-slate-900 border border-slate-200"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <h2
            className={`text-3xl font-bold ${
              theme === "dark" ? "text-green-400" : "text-green-600"
            }`}
          >
            Security Settings
          </h2>
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              theme === "dark" ? "bg-green-400/10" : "bg-green-600/10"
            }`}
          >
            <AlertCircle
              className={`w-6 h-6 ${
                theme === "dark" ? "text-green-400" : "text-green-600"
              }`}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div>
            <PasswordInput
              label="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              theme={theme}
              placeholder="Enter your current password"
            />
            {validationErrors.currentPassword && (
              <p className="mt-2 text-red-500 text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {validationErrors.currentPassword}
              </p>
            )}
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className={`mt-2 text-sm transition-colors ${
                theme === "dark"
                  ? "text-green-400 hover:text-green-300"
                  : "text-green-600 hover:text-green-700"
              }`}
            >
              Forgot your current password?
            </button>
          </div>

          {/* New Password */}
          <div>
            <PasswordInput
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              theme={theme}
              placeholder="Enter your new password"
            />
            {validationErrors.newPassword && (
              <p className="mt-2 text-red-500 text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {validationErrors.newPassword}
              </p>
            )}
            <div className="mt-2 text-xs text-slate-500 space-y-1">
              <p>Password requirements:</p>
              <ul className="ml-4 space-y-1">
                <li
                  className={`${
                    newPassword.length >= 6 ? "text-green-500" : ""
                  }`}
                >
                  • At least 6 characters
                </li>
                <li
                  className={`${
                    /(?=.*[a-z])/.test(newPassword) ? "text-green-500" : ""
                  }`}
                >
                  • One lowercase letter
                </li>
                <li
                  className={`${
                    /(?=.*[A-Z])/.test(newPassword) ? "text-green-500" : ""
                  }`}
                >
                  • One uppercase letter
                </li>
                <li
                  className={`${
                    /(?=.*\d)/.test(newPassword) ? "text-green-500" : ""
                  }`}
                >
                  • One number
                </li>
              </ul>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <PasswordInput
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              theme={theme}
              placeholder="Confirm your new password"
            />
            {validationErrors.confirmPassword && (
              <p className="mt-2 text-red-500 text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {validationErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 ${
              theme === "dark"
                ? "bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-500 hover:to-green-400 disabled:from-green-900 disabled:to-green-800 disabled:text-green-300"
                : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 disabled:from-green-300 disabled:to-green-400 disabled:text-green-100"
            } ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            {loading ? (
              <>
                <Loader />
                Changing Password...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Change Password
              </>
            )}
          </button>
        </form>

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <ForgotPasswordModal
            theme={theme}
            onClose={() => setShowForgotPassword(false)}
            onAlert={showAlert}
          />
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

// Forgot Password Modal Component
const ForgotPasswordModal = ({ theme, onClose, onAlert }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      onAlert("error", "Email is required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      onAlert("error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = await dispatch(sendResetLink({ email })).unwrap();
      onAlert(
        "success",
        res?.message || "Password reset link sent to your email!"
      );
      onClose();
    } catch (err) {
      onAlert(
        "error",
        err?.message || "Failed to send reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={`max-w-md w-full rounded-2xl shadow-2xl p-8 transform transition-all ${
          theme === "dark"
            ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white border border-slate-700"
            : "bg-gradient-to-br from-white to-slate-50 text-slate-900 border border-slate-200"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-green-400" : "text-green-600"
            }`}
          >
            Forgot Password?
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              theme === "dark"
                ? "text-slate-400 hover:text-white hover:bg-slate-700"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        <p
          className={`text-sm mb-6 ${
            theme === "dark" ? "text-slate-300" : "text-slate-600"
          }`}
        >
          Enter your registered email address and we'll send you a link to reset
          your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium text-sm">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:bg-slate-700"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:bg-slate-50"
              }`}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 ${
              theme === "dark"
                ? "bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-500 hover:to-green-400 disabled:from-green-900 disabled:to-green-800"
                : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 disabled:from-green-300 disabled:to-green-400"
            }`}
          >
            {loading ? (
              <>
                <Loader />
                Sending Link...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardSecurityPage;
