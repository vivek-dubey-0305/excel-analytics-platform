// src/components/layout/Footer.jsx
import React from "react";
import { useTheme } from "../../context/ThemeContext";

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer
      className={`mt-10 px-6 py-6 text-center ${
        theme === "light"
          ? "bg-white text-green-700 border-t border-green-200"
          : "bg-black text-green-400 border-t border-green-700"
      }`}
    >
      <p className="mb-2 font-medium">
        © {new Date().getFullYear()} ExcelAnalytics. All rights reserved.
      </p>
      <div className="flex justify-center space-x-6">
        <a
          href="#privacy"
          className="hover:text-green-500 transition-colors"
        >
          Privacy Policy
        </a>
        <a
          href="#terms"
          className="hover:text-green-500 transition-colors"
        >
          Terms of Service
        </a>
        <a
          href="#support"
          className="hover:text-green-500 transition-colors"
        >
          Support
        </a>
      </div>
    </footer>
  );
};

export default Footer;
