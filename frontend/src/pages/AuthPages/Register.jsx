import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, sendOtp } from "../../redux/slice/user/user.slice";
import { User, Mail, Phone, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import BackgroundAnimation from "../../components/BackgroundAnimation/BackgroundAnimation";
import ThemeToogleButton from "../../components/Buttons/ThemeToogleButton";

const Register = () => {
  const { user, loading, error, isAuthenticated, success } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate?.() ?? (() => {});

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const { fullName, email, phone, password } = formData;
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const validate = () => {
    if (!fullName.trim()) {
      setErr("Please enter your name.");
      return false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErr("Please enter a valid email.");
      return false;
    }
    if (!phone) {
      setErr("Please enter your phone number.");
      return false;
    }
    if (!password || password.length < 8) {
      setErr("Password should be at least 8 characters.");
      return false;
    }
    setErr(error);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const registerData = { fullName, email, phone, password };

    try {
      const result = await dispatch(register(registerData));
      console.log("Dispath result", result?.meta?.requestStatus);
      if (result?.meta?.requestStatus === "fulfilled") dispatch(sendOtp());
      navigate("/verify-otp", { state: { email: registerData.email } });
    } catch (err) {
      console.log("error at register : ", err?.message);
      console.log("error at register : ", error);
      setErr(error || `${err?.message} ...err `);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundAnimation theme={theme} />

      {/* Login Form */}
      <ThemeToogleButton theme={theme} setTheme={setTheme} />

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        {/* Your register form content */}

        <div
          className={`w-full max-w-md rounded-2xl shadow-lg p-8 
          ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}
        >
          <h2 className="text-2xl font-bold text-center mb-6">
            Create an Account
          </h2>

          {err && (
            <div className="mb-4 text-sm text-red-500 bg-red-100 p-2 rounded">
              {err}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="fullName"
                value={fullName}
                onChange={onChange}
                placeholder="Full Name"
                className={`w-full pl-10 pr-3 py-2 rounded-lg border 
                focus:outline-none focus:ring-2 
                ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 focus:ring-green-500"
                    : "bg-white border-gray-300 focus:ring-green-600"
                }`}
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Email"
                className={`w-full pl-10 pr-3 py-2 rounded-lg border 
                focus:outline-none focus:ring-2 
                ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 focus:ring-green-500"
                    : "bg-white border-gray-300 focus:ring-green-600"
                }`}
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="phone"
                value={phone}
                onChange={onChange}
                placeholder="Phone Number"
                className={`w-full pl-10 pr-3 py-2 rounded-lg border 
                focus:outline-none focus:ring-2 
                ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 focus:ring-green-500"
                    : "bg-white border-gray-300 focus:ring-green-600"
                }`}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Password"
                className={`w-full pl-10 pr-10 py-2 rounded-lg border 
                focus:outline-none focus:ring-2 
                ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 focus:ring-green-500"
                    : "bg-white border-gray-300 focus:ring-green-600"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-2.5 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg flex items-center justify-center font-medium 
              transition 
              ${
                theme === "dark"
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
              ) : null}
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="cursor-pointer font-semibold hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
