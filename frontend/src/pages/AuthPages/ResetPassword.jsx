// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { useParams, useNavigate } from "react-router-dom";
// import { resetPassword } from "../../redux/slice/user/user.slice";

// const ResetPassword = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { token } = useParams();

//   const [password, setPassword] = useState("");
//   const [show, setShow] = useState(false);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");
//     try {
//       const res = await dispatch(
//         resetPassword({ token, passwordData: { password } })
//       ).unwrap();
//       setMessage(res?.message || "Password reset successful.");
//       setTimeout(() => navigate("/login"), 2000);
//     } catch (err) {
//       setMessage(err?.message || "Password reset failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded shadow-md w-full max-w-md"
//       >
//         <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

//         <div className="relative mb-4">
//           <input
//             type={show ? "text" : "password"}
//             placeholder="Enter new password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="border w-full p-2 rounded"
//             required
//           />
//           <button
//             type="button"
//             onClick={() => setShow(!show)}
//             className="absolute right-2 top-2 text-sm text-blue-600"
//           >
//             {show ? "Hide" : "Show"}
//           </button>
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700"
//         >
//           {loading ? "Resetting..." : "Reset Password"}
//         </button>

//         {message && (
//           <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
//         )}
//       </form>
//     </div>
//   );
// };

// export default ResetPassword;

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, CheckCircle, X, Lock, Shield, ArrowRight } from "lucide-react";
import { resetPassword } from "../../redux/slice/user/user.slice";
import CustomAlert from "../../components/CustomAlert/CustomAlert";



// Password Input Component
const PasswordInput = ({ label, value, onChange, theme, placeholder, showStrength = false }) => {
  const [showPassword, setShowPassword] = useState(false);

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) strength++;
    return strength;
  };

  const getStrengthColor = (strength) => {
    if (strength <= 1) return "bg-red-500";
    if (strength <= 2) return "bg-orange-500";
    if (strength <= 3) return "bg-yellow-500";
    if (strength <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength) => {
    if (strength <= 1) return "Very Weak";
    if (strength <= 2) return "Weak";
    if (strength <= 3) return "Fair";
    if (strength <= 4) return "Good";
    return "Strong";
  };

  const strength = getPasswordStrength(value);

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
      
      {showStrength && value && (
        <div className="mt-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium">Password Strength:</span>
            <span className={`text-xs font-semibold ${
              strength <= 2 ? 'text-red-500' : 
              strength <= 3 ? 'text-yellow-500' : 
              strength <= 4 ? 'text-blue-500' : 'text-green-500'
            }`}>
              {getStrengthText(strength)}
            </span>
          </div>
          <div className="flex gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  i < strength ? getStrengthColor(strength) : 
                  theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                }`}
              />
            ))}
          </div>
          <div className="text-xs space-y-1">
            <div className="flex flex-wrap gap-4">
              <span className={`flex items-center gap-1 ${
                value.length >= 6 ? 'text-green-500' : 
                theme === "dark" ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {value.length >= 6 ? <CheckCircle size={12} /> : <div className="w-3 h-3 rounded-full border border-current" />}
                6+ chars
              </span>
              <span className={`flex items-center gap-1 ${
                /(?=.*[a-z])/.test(value) ? 'text-green-500' : 
                theme === "dark" ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {/(?=.*[a-z])/.test(value) ? <CheckCircle size={12} /> : <div className="w-3 h-3 rounded-full border border-current" />}
                Lowercase
              </span>
              <span className={`flex items-center gap-1 ${
                /(?=.*[A-Z])/.test(value) ? 'text-green-500' : 
                theme === "dark" ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {/(?=.*[A-Z])/.test(value) ? <CheckCircle size={12} /> : <div className="w-3 h-3 rounded-full border border-current" />}
                Uppercase
              </span>
              <span className={`flex items-center gap-1 ${
                /(?=.*\d)/.test(value) ? 'text-green-500' : 
                theme === "dark" ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {/(?=.*\d)/.test(value) ? <CheckCircle size={12} /> : <div className="w-3 h-3 rounded-full border border-current" />}
                Number
              </span>
              <span className={`flex items-center gap-1 ${
                /(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(value) ? 'text-green-500' : 
                theme === "dark" ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(value) ? <CheckCircle size={12} /> : <div className="w-3 h-3 rounded-full border border-current" />}
                Special
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Success Animation Component
const SuccessAnimation = ({ theme }) => {
  return (
    <div className="text-center">
      <div className="relative mb-6">
        <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center animate-pulse ${
          theme === "dark" ? "bg-green-400/10" : "bg-green-600/10"
        }`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center animate-bounce ${
            theme === "dark" ? "bg-green-400/20" : "bg-green-600/20"
          }`}>
            <CheckCircle className={`w-8 h-8 ${
              theme === "dark" ? "text-green-400" : "text-green-600"
            }`} />
          </div>
        </div>
      </div>
      <h3 className={`text-2xl font-bold mb-2 ${
        theme === "dark" ? "text-green-400" : "text-green-600"
      }`}>
        Password Reset Successfully!
      </h3>
      <p className={`text-sm mb-4 ${
        theme === "dark" ? "text-slate-300" : "text-slate-600"
      }`}>
        Your password has been updated. You'll be redirected to login shortly.
      </p>
      <div className="flex items-center justify-center gap-2 text-sm">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent"></div>
        <span className={theme === "dark" ? "text-slate-400" : "text-slate-500"}>
          Redirecting to login...
        </span>
      </div>
    </div>
  );
};

const ResetPassword = ({ theme = "light" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Auto-hide alert after 5 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Check if token exists
  useEffect(() => {
    if (!token) {
      setAlert({ type: "error", message: "Invalid reset token. Please request a new password reset." });
      setTimeout(() => navigate("/forgot-password"), 3000);
    }
  }, [token, navigate]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  const validateForm = () => {
    const errors = {};

    if (!password.trim()) {
      errors.password = "New password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    if (!confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
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

    setLoading(true);
    try {
      const res = await dispatch(
        resetPassword({ token, passwordData: { password, confirmPassword } })
      ).unwrap();
      
      setSuccess(true);
      showAlert("success", res?.message || "Password reset successful!");
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      showAlert("error", err?.message || "Password reset failed. Please try again or request a new reset link.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gradient-to-br from-slate-100 via-white to-slate-100"
      }`}>
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-500 mb-2">Invalid Reset Token</h2>
          <p className="text-gray-600">Please request a new password reset.</p>
        </div>
      </div>
    );
  }

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

      <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gradient-to-br from-slate-100 via-white to-slate-100"
      }`}>
        <div className={`w-full max-w-md rounded-2xl shadow-2xl p-8 transition-all duration-300 ${
          theme === "dark"
            ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white border border-slate-700"
            : "bg-gradient-to-br from-white to-slate-50 text-slate-900 border border-slate-200"
        }`}>
          
          {success ? (
            <SuccessAnimation theme={theme} />
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                  theme === "dark" ? "bg-green-400/10" : "bg-green-600/10"
                }`}>
                  <Shield className={`w-8 h-8 ${
                    theme === "dark" ? "text-green-400" : "text-green-600"
                  }`} />
                </div>
                <h2 className={`text-3xl font-bold mb-2 ${
                  theme === "dark" ? "text-green-400" : "text-green-600"
                }`}>
                  Reset Your Password
                </h2>
                <p className={`text-sm ${
                  theme === "dark" ? "text-slate-300" : "text-slate-600"
                }`}>
                  Create a new secure password for your account
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password */}
                <div>
                  <PasswordInput
                    label="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    theme={theme}
                    placeholder="Enter your new password"
                    showStrength={true}
                  />
                  {validationErrors.password && (
                    <p className="mt-2 text-red-500 text-sm flex items-center gap-2">
                      <AlertCircle size={16} />
                      {validationErrors.password}
                    </p>
                  )}
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
                  {password && confirmPassword && password === confirmPassword && (
                    <p className="mt-2 text-green-500 text-sm flex items-center gap-2">
                      <CheckCircle size={16} />
                      Passwords match!
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !password || !confirmPassword}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-500 hover:to-green-400 disabled:from-green-900 disabled:to-green-800 disabled:text-green-300"
                      : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 disabled:from-green-300 disabled:to-green-400 disabled:text-green-100"
                  } ${loading || !password || !confirmPassword ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      <Lock size={20} />
                      Reset Password
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Security Note */}
              <div className={`mt-6 p-4 rounded-xl border ${
                theme === "dark" 
                  ? "bg-slate-800/50 border-slate-600 text-slate-300" 
                  : "bg-slate-50 border-slate-200 text-slate-600"
              }`}>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 mt-0.5 text-blue-500" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Security Tips:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Use a unique password you haven't used before</li>
                      <li>• Include a mix of letters, numbers, and symbols</li>
                      <li>• Avoid using personal information</li>
                    </ul>
                  </div>
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

export default ResetPassword;