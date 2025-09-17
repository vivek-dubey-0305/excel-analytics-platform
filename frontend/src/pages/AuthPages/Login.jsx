import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // if using react-router

const LoginPage = () => {
  const navigate = useNavigate?.() ?? (() => {}); // fallback if not using router
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      setErr("Please enter a valid email address.");
      return false;
    }
    if (!form.password || form.password.length < 6) {
      setErr("Password must be at least 6 characters long.");
      return false;
    }
    setErr("");
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErr("");
    try {
      // Example fetch call - adapt to your backend (axios also fine)
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // if backend sets cookies
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // success: backend should set cookie or return token
      // if you return token: store safely (httpOnly cookie preferred)
      // example: navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold">
            Welcome Back to <span className="text-green-500">ExcelAnalytics</span>
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Sign in to continue to your analytics dashboard.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={submit} noValidate>
          <div className="rounded-md shadow-sm -space-y-px">
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={onChange}
              required
              className={`appearance-none rounded-t-md relative block w-full px-4 py-3 border placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400`}
              placeholder="Email address"
            />

            <label htmlFor="password" className="sr-only">Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={form.password}
                onChange={onChange}
                required
                className={`appearance-none rounded-b-md relative block w-full px-4 py-3 border  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400`}
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm">
              <input
                name="remember"
                type="checkbox"
                checked={form.remember}
                onChange={onChange}
                className="mr-2"
              />
              Remember me
            </label>

            <div className="text-sm">
              <a href="/forgot" className="font-medium text-green-600 hover:underline">
                Forgot password?
              </a>
            </div>
          </div>

          {err && <div className="text-red-500 text-sm">{err}</div>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm">
              Don't have an account?{" "}
              <a href="/signup" className="font-medium text-green-600 hover:underline">
                Create one
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
