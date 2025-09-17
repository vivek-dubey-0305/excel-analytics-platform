// src/pages/LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  // const { theme } = useTheme();

  return (
    <div

    >
      {/* 1. HERO SECTION */}
      <section
        id="hero"
        className="flex flex-col md:flex-row items-center justify-between px-10 py-20"
      >
        {/* Text */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight">
            Excel<span className="text-green-500">Analytics</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Upload your Excel files and transform them into beautiful,
            insightful charts instantly.
          </p>
          {/* <a
            href="/login"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            🚀 Get Started
          </a> */}
          <Link to={"/login"}
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          
          >
            Get Started
          </Link>

        </div>

        {/* Image */}
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <img
            src="https://img.freepik.com/free-vector/data-report-concept-illustration_114360-883.jpg"
            alt="Excel Analytics Hero"
            className="w-3/4 rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section
        id="features"
        className="px-10 py-20 text-center bg-green-50 dark:bg-gray-900"
      >
        <h2 className="text-4xl font-bold mb-10">
          What Can <span className="text-green-600">ExcelAnalytics</span> Do?
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition">
            <img
              src="https://img.icons8.com/fluency/96/upload-to-cloud.png"
              alt="Upload Excel"
              className="mx-auto"
            />
            <h3 className="text-2xl font-semibold mt-4">Upload Excel</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Drag & drop or select your Excel file securely.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition">
            <img
              src="https://img.icons8.com/color/96/combo-chart--v1.png"
              alt="Generate Charts"
              className="mx-auto"
            />
            <h3 className="text-2xl font-semibold mt-4">Auto Charts</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Instantly create bar, pie, and line charts from your data.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition">
            <img
              src="https://img.icons8.com/color/96/export-pdf.png"
              alt="Export PDF"
              className="mx-auto"
            />
            <h3 className="text-2xl font-semibold mt-4">Export Easily</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Save results in <b>PDF</b> or <b>Image</b> formats in one click.
            </p>
          </div>
        </div>
      </section>

      {/* 3. ELABORATION SECTION */}
      <section id="details" className="px-10 py-20">
        <h2 className="text-4xl font-bold mb-6 text-center">
          Why Choose <span className="text-green-600">ExcelAnalytics?</span>
        </h2>
        <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-700 dark:text-gray-300">
          <p>
            ⚡ <b>Fast & Reliable:</b> Get insights in seconds with our optimized
            algorithms.
          </p>
          <p>
            🔒 <b>Secure:</b> Your data stays private — we never store or share
            your files.
          </p>
          <p>
            🎨 <b>Customizable:</b> Generate professional charts tailored to your
            needs.
          </p>
          <p>
            📊 <b>Business Ready:</b> Export charts for presentations, reports,
            or research instantly.
          </p>
        </div>
      </section>

      {/* 4. TESTIMONIALS / USERS SECTION */}
      <section
        id="testimonials"
        className="px-10 py-20 text-center bg-green-50 dark:bg-gray-900"
      >
        <h2 className="text-4xl font-bold mb-10">
          Trusted by <span className="text-green-600">Thousands</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <p className="text-lg italic">
              “This platform saved me hours of manual chart-making. A game
              changer!”
            </p>
            <h4 className="mt-4 font-bold text-green-600">– Student</h4>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <p className="text-lg italic">
              “I generated professional reports in minutes. Highly recommend it
              to teams.”
            </p>
            <h4 className="mt-4 font-bold text-green-600">– Business Analyst</h4>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <p className="text-lg italic">
              “Over <b>10,000+</b> users already trust ExcelAnalytics. Join the
              community today!”
            </p>
            <h4 className="mt-4 font-bold text-green-600">– Platform Stats</h4>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
