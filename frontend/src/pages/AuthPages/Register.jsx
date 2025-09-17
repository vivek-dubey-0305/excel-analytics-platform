import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate?.() ?? (() => {});
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) { setErr("Please enter your name."); return false; }
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) { setErr("Please enter a valid email."); return false; }
    if (!form.password || form.password.length < 6) { setErr("Password should be at least 6 chars."); return false; }
    if (form.password !== form.confirm) { setErr("Passwords do not match."); return false; }
    setErr("");
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      // optionally auto-login or navigate to login
      navigate("/login");
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-6 py-12 ${
      theme === "light" ? "bg-white text-black" : "bg-black text-white"
    }`}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold">
            Create your account for <span className="text-green-500">ExcelAnalytics</span>
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Start turning spreadsheets into powerful visuals.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={submit} noValidate>
          <div className="rounded-md shadow-sm -space-y-px">
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              required
              placeholder="Full name"
              className={`appearance-none relative block w-full px-4 py-3 border ${
                theme === "light" ? "border-gray-200 bg-white" : "border-gray-700 bg-gray-900"
              } placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400`}
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
              placeholder="Email address"
              className={`appearance-none relative block w-full mt-3 px-4 py-3 border ${
                theme === "light" ? "border-gray-200 bg-white" : "border-gray-700 bg-gray-900"
              } placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400`}
            />

            <div className="relative mt-3">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={onChange}
                required
                placeholder="Password"
                className={`appearance-none relative block w-full px-4 py-3 border ${
                  theme === "light" ? "border-gray-200 bg-white" : "border-gray-700 bg-gray-900"
                } placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400`}
              />
            </div>

            <div className="relative mt-3">
              <input
                name="confirm"
                type={showPassword ? "text" : "password"}
                value={form.confirm}
                onChange={onChange}
                required
                placeholder="Confirm password"
                className={`appearance-none relative block w-full px-4 py-3 border ${
                  theme === "light" ? "border-gray-200 bg-white" : "border-gray-700 bg-gray-900"
                } placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {err && <div className="text-red-500 text-sm">{err}</div>}

          <button
            type="submit"
            disabled={loading}
            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              theme === "light"
                ? "bg-green-600 text-white hover:bg-green-700 focus:ring-green-400"
                : "bg-green-500 text-black hover:bg-green-600 focus:ring-green-300"
            }`}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <div className="text-center">
            <p className="text-sm">
              Already registered?{" "}
              <a href="/login" className="font-medium text-green-600 hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
