// src/pages/Verification.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, verifyOtp } from "../../redux/slice/user/user.slice";

// IMPORTANT: adjust import path to where your thunks live

const Verification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Try to get email from redux user object or from navigation state
  const reduxEmail = useSelector((state) => state.user?.user?.email);
  const reduxLoading = useSelector((state) => state.user?.loading);
  const reduxError = useSelector((state) => state.user?.error);

  const emailFromNav = location?.state?.email;
  const initialEmail = reduxEmail || emailFromNav || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false); // local loader for this page
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Keep redux error synced if any
  useEffect(() => {
    if (reduxError)
      setError(
        typeof reduxError === "string" ? reduxError : reduxError?.message || ""
      );
  }, [reduxError]);

  // If email is empty, redirect back to signup (or show message)
  useEffect(() => {
    if (!initialEmail) {
      // If you prefer to show a message instead of redirecting, change this behavior.
      navigate("/signup");
    }
  }, [initialEmail, navigate]);

  // validate OTP (basic)
  const validate = () => {
    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return false;
    }
    // optional: enforce 4-8 digit OTP depending on your backend
    if (!/^\d{4,8}$/.test(otp.trim())) {
      setError("OTP should be numeric (4-8 digits).");
      return false;
    }
    setError("");
    return true;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      // dispatch verify thunk - adjust payload shape if your API expects differently
      const res = await dispatch(verifyOtp({ email, otp })).unwrap();
      setMessage(res?.message || "Email verified successfully!");
      // On success redirect to login or dashboard
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      // err could be string or object depending on slice
      setError(err?.message || err || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("No email available to resend OTP.");
      return;
    }
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const res = await dispatch(sendOtp()).unwrap();
      setMessage(res?.message || "OTP resent to your email.");
    } catch (err) {
      setError(err?.message || err || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-center mb-4">
          Verify your email
        </h2>

        {message && (
          <div className="mb-3 text-sm text-green-700 bg-green-100 p-2 rounded">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-3 text-sm text-red-700 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <label className="block text-sm">
            Registered Email
            <input
              type="email"
              name="email"
              value={email}
              readOnly
              className="mt-1 w-full px-3 py-2 rounded border bg-gray-100 cursor-not-allowed"
            />
          </label>

          <label className="block text-sm">
            Enter OTP
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter code you received"
              className="mt-1 w-full px-3 py-2 rounded border"
              inputMode="numeric"
              maxLength={8}
              autoFocus
              required
            />
          </label>

          <button
            type="submit"
            onClick={() => navigate("/dashboard")}
            disabled={loading}
            className="w-full py-2 rounded bg-blue-600 text-white disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>

          <div className="flex items-center justify-between mt-2">
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className="text-sm underline text-blue-600 disabled:opacity-60"
            >
              Resend OTP
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-sm text-gray-600 hover:underline"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Verification;
