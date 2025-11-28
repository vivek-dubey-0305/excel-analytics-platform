// import React, { useEffect, useState } from "react";
// import { useTheme } from "../../context/ThemeContext";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { login } from "../../redux/slice/user/user.slice";
// import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

// const Login = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate?.() ?? (() => {});

//   const { loading, error, isAuthenticated } = useSelector((state) => state.user);
//   const { theme } = useTheme();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const { email, password } = formData;

//   const [showPassword, setShowPassword] = useState(false);
//   const [err, setErr] = useState("");

//   useEffect(() => {
//     // Sync Redux error -> local error message for display
//     if (error) setErr(typeof error === "string" ? error : error?.message || "");
//   }, [error]);

//   useEffect(() => {
//     // Redirect on successful login
//     if (isAuthenticated) {
//       navigate("/dashboard"); // change target as needed
//     }
//   }, [isAuthenticated, navigate]);

//   const onChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((s) => ({ ...s, [name]: value }));
//   };

//   const validate = () => {
//     if (!email || !/\S+@\S+\.\S+/.test(email)) {
//       setErr("Please enter a valid email.");
//       return false;
//     }
//     if (!password || password.length < 8) {
//       setErr("Password should be at least 8 characters.");
//       return false;
//     }
//     setErr(""); // clear local validation errors
//     return true;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     try {
//       dispatch(login({ email, password }));
//       // Do not setErr here — let slice's error populate via useEffect
//     } catch (dispatchError) {
//       // unlikely with Redux dispatch, but safe fallback
//       console.error("dispatch error:", dispatchError);
//       setErr(dispatchError?.message || "Something went wrong while logging in.");
//     }
//   };

//   return (
//     <div
//       className={`flex items-center justify-center min-h-screen px-4
//         ${theme === "dark" ? "bg-black text-green-400" : "bg-white text-green-600"}`}
//     >
//       <div
//         className={`w-full max-w-md rounded-2xl shadow-lg p-8
//           ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}
//       >
//         <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>

//         {err && (
//           <div className="mb-4 text-sm text-red-500 bg-red-100 p-2 rounded">
//             {err}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-5" noValidate>
//           {/* Email */}
//           <div className="relative">
//             <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//             <input
//               type="email"
//               name="email"
//               value={email}
//               onChange={onChange}
//               placeholder="Email"
//               className={`w-full pl-10 pr-3 py-2 rounded-lg border
//                 focus:outline-none focus:ring-2
//                 ${theme === "dark"
//                   ? "bg-gray-800 border-gray-700 focus:ring-green-500"
//                   : "bg-white border-gray-300 focus:ring-green-600"}`}
//               autoComplete="email"
//             />
//           </div>

//           {/* Password */}
//           <div className="relative">
//             <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               value={password}
//               onChange={onChange}
//               placeholder="Password"
//               className={`w-full pl-10 pr-10 py-2 rounded-lg border
//                 focus:outline-none focus:ring-2
//                 ${theme === "dark"
//                   ? "bg-gray-800 border-gray-700 focus:ring-green-500"
//                   : "bg-white border-gray-300 focus:ring-green-600"}`}
//               autoComplete="current-password"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword((prev) => !prev)}
//               className="absolute right-3 top-2.5 text-gray-400"
//               aria-label={showPassword ? "Hide password" : "Show password"}
//             >
//               {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//             </button>
//           </div>

//           <div className="w-[385px]">
//             <div className="flex justify-end">
//               <span onClick={() => navigate("/forgot-password")} className="text-blue-700 font-bold cursor-pointer">Forgot password ?</span>
//             </div>
//         </div>
//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-2 rounded-lg flex items-center justify-center font-medium
//               transition
//               ${theme === "dark"
//                 ? "bg-green-600 text-white hover:bg-green-700"
//                 : "bg-green-500 text-white hover:bg-green-600"}`}
//           >
//             {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
//             {loading ? "Signing in..." : "Sign In"}
//           </button>
//         </form>

//         <p className="mt-4 text-center text-sm">
//           Don't have an account?{" "}
//           <span
//             onClick={() => navigate("/signup")}
//             className="cursor-pointer font-semibold hover:underline"
//           >
//             Create one
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser, login } from "../../redux/slice/user/user.slice";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import BackgroundAnimation from "../../components/BackgroundAnimation/BackgroundAnimation";
import ThemeToogleButton from "../../components/Buttons/ThemeToogleButton";

const Login = ({ user, loading, error, isAuthenticated } ) => {
  const dispatch = useDispatch();
  const navigate = useNavigate?.() ?? (() => { });
  
  const { theme, setTheme } = useTheme();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");


  useEffect(() => {
    if (error) setErr(typeof error === "string" ? error : error?.message || "");
  }, [error]);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const validate = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErr("Please enter a valid email.");
      return false;
    }
    if (!password || password.length < 8) {
      setErr("Password should be at least 8 characters.");
      return false;
    }
    setErr("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      dispatch(login({ email, password }));
    } catch (dispatchError) {
      console.error("dispatch error:", dispatchError);
      setErr(
        dispatchError?.message || "Something went wrong while logging in."
      );
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Animation */}
      <BackgroundAnimation theme={theme} />

      {/* Login Form */}
<ThemeToogleButton theme={theme} setTheme={setTheme} />

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div
          className={`w-full max-w-md rounded-2xl shadow-2xl p-8 backdrop-blur-sm border
            ${
              theme === "dark"
                ? "bg-gray-900/80 border-gray-700 text-green-400"
                : "bg-white/80 border-gray-200 text-green-600"
            }`}
        >
          <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>

          {err && (
            <div
              className={`mb-4 text-sm p-3 rounded-lg border
              ${
                theme === "dark"
                  ? "text-red-400 bg-red-900/20 border-red-800"
                  : "text-red-600 bg-red-50 border-red-200"
              }`}
            >
              {err}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Email"
                className={`w-full pl-10 pr-3 py-3 rounded-lg border 
                  focus:outline-none focus:ring-2 transition-all
                  ${
                    theme === "dark"
                      ? "bg-gray-800/50 border-gray-700 focus:ring-green-500 focus:border-green-500"
                      : "bg-white/50 border-gray-300 focus:ring-green-600 focus:border-green-600"
                  }`}
                autoComplete="email"
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
                className={`w-full pl-10 pr-10 py-3 rounded-lg border 
                  focus:outline-none focus:ring-2 transition-all
                  ${
                    theme === "dark"
                      ? "bg-gray-800/50 border-gray-700 focus:ring-green-500 focus:border-green-500"
                      : "bg-white/50 border-gray-300 focus:ring-green-600 focus:border-green-600"
                  }`}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-300 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex justify-end">
              <span
                onClick={() => navigate("/forgot-password")}
                className={`text-sm cursor-pointer transition-colors
                  ${
                    theme === "dark"
                      ? "text-blue-400 hover:text-blue-300"
                      : "text-blue-600 hover:text-blue-500"
                  }`}
              >
                Forgot password?
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg flex items-center justify-center font-medium 
                transition-all duration-200 disabled:opacity-50
                ${
                  theme === "dark"
                    ? "bg-green-600 hover:bg-green-700 text-white shadow-lg"
                    : "bg-green-500 hover:bg-green-600 text-white shadow-md"
                }`}
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
              ) : null}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className={`cursor-pointer font-semibold transition-colors
                ${
                  theme === "dark"
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-500"
                }`}
            >
              Create one
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
