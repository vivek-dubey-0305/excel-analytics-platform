import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AlertCircle, CheckCircle, X, Mail, ArrowLeft } from "lucide-react";
import { sendResetLink } from "../../redux/slice/user/user.slice";
import { useNavigate } from "react-router-dom";
import CustomAlert from "../CustomAlert/CustomAlert";

const ForgotPassword = ({ theme = "light" }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  const navigate = useNavigate();

  // Auto-hide alert after 5 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      showAlert("error", "Email address is required");
      return;
    }

    if (!validateEmail(email)) {
      showAlert("error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = await dispatch(sendResetLink({ email })).unwrap();
      setEmailSent(true);
      showAlert(
        "success",
        res?.message || "Password reset link sent successfully!"
      );
    } catch (err) {
      showAlert(
        "error",
        err?.message || "Failed to send reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setEmailSent(false);
    await handleSubmit(new Event("submit"));
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
        className={`min-h-screen flex items-center justify-center p-4 transition-all duration-300 ${
          theme === "dark"
            ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
            : "bg-gradient-to-br from-slate-100 via-white to-slate-100"
        }`}
      >
        <div
          className={`w-full max-w-md rounded-2xl shadow-2xl p-8 transition-all duration-300 ${
            theme === "dark"
              ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white border border-slate-700"
              : "bg-gradient-to-br from-white to-slate-50 text-slate-900 border border-slate-200"
          }`}
        >
          {!emailSent ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    theme === "dark" ? "bg-green-400/10" : "bg-green-600/10"
                  }`}
                >
                  <AlertCircle
                    className={`w-8 h-8 ${
                      theme === "dark" ? "text-green-400" : "text-green-600"
                    }`}
                  />
                </div>
                <h2
                  className={`text-3xl font-bold mb-2 ${
                    theme === "dark" ? "text-green-400" : "text-green-600"
                  }`}
                >
                  Forgot Password?
                </h2>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  No worries! Enter your email address and we'll send you a link
                  to reset your password.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block mb-2 font-medium text-sm">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-4 py-3 pl-12 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        theme === "dark"
                          ? "bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:bg-slate-700"
                          : "bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:bg-slate-50"
                      }`}
                      required
                    />
                    <Mail
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                        theme === "dark" ? "text-slate-400" : "text-slate-500"
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-500 hover:to-green-400 disabled:from-green-900 disabled:to-green-800"
                      : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 disabled:from-green-300 disabled:to-green-400"
                  } ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Sending Link...
                    </>
                  ) : (
                    <>
                      <Mail size={20} />
                      Send Reset Link
                    </>
                  )}
                </button>
              </form>

              {/* Back to Login */}

              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate("/login")}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                    theme === "dark"
                      ? "bg-slate-700 text-white hover:bg-slate-600 border border-slate-600"
                      : "bg-slate-200 text-slate-800 hover:bg-slate-300 border border-slate-300"
                  }`}
                >
                  <ArrowLeft size={16} />
                  Back to Login
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    theme === "dark" ? "bg-green-400/10" : "bg-green-600/10"
                  }`}
                >
                  <CheckCircle
                    className={`w-8 h-8 ${
                      theme === "dark" ? "text-green-400" : "text-green-600"
                    }`}
                  />
                </div>
                <h2
                  className={`text-3xl font-bold mb-2 ${
                    theme === "dark" ? "text-green-400" : "text-green-600"
                  }`}
                >
                  Check Your Email!
                </h2>
                <p
                  className={`text-sm mb-6 ${
                    theme === "dark" ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  We've sent a password reset link to{" "}
                  <span className="font-semibold">{email}</span>. Click the link
                  in the email to reset your password.
                </p>

                <div className="space-y-4">
                  <p
                    className={`text-xs ${
                      theme === "dark" ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Didn't receive the email? Check your spam folder or try
                    again.
                  </p>

                  <button
                    onClick={handleResendEmail}
                    disabled={loading}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 border-2 ${
                      theme === "dark"
                        ? "border-green-400 text-green-400 hover:bg-green-400 hover:text-slate-900 disabled:border-green-600 disabled:text-green-600"
                        : "border-green-600 text-green-600 hover:bg-green-600 hover:text-white disabled:border-green-400 disabled:text-green-400"
                    }`}
                  >
                    {loading ? "Sending..." : "Resend Email"}
                  </button>

                  <button
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                      theme === "dark"
                        ? "bg-slate-800 text-white hover:bg-slate-700 border border-slate-600"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300"
                    }`}
                    onClick={() => navigate("/login")}
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
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

export default ForgotPassword;
