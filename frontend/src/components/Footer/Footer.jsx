// src/components/layout/Footer.jsx
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { Link } from "react-router-dom";

const Footer = () => {
  const { theme } = useTheme();

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`relative transition-all duration-300 ${
        theme === "light"
          ? "bg-gradient-to-b from-gray-50 to-white border-t border-gray-200"
          : "bg-gradient-to-b from-gray-900 to-black border-t border-gray-700"
      }`}
    >
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600"></div>

      <div className="container mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-2">
              <div
                className={`text-2xl font-bold ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}
              >
                Excel
                <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                  Analytics
                </span>
              </div>
              <div
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  theme === "light"
                    ? "bg-green-100 text-green-700"
                    : "bg-green-900/50 text-green-300"
                }`}
              >
                Platform
              </div>
            </div>

            <p
              className={`text-lg leading-relaxed max-w-md ${
                theme === "light" ? "text-gray-600" : "text-gray-300"
              }`}
            >
              Transform your Excel data into beautiful, professional charts
              instantly. Trusted by thousands of users worldwide.
            </p>

            {/* Social Media Links */}
            <div className="flex space-x-4">
              {[
                { name: "LinkedIn", icon: "💼", href: "/linkedin" },
                { name: "Twitter", icon: "🐦", href: "/twitter" },
                { name: "Facebook", icon: "📘", href: "/facebook" },
                { name: "YouTube", icon: "📺", href: "/youtube" },
                { name: "GitHub", icon: "🐙", href: "/github" },
              ].map((social) => (
                <Link
                  key={social.name}
                  to={social.href}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${
                    theme === "light"
                      ? "bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600 shadow-md hover:shadow-lg"
                      : "bg-gray-800 text-gray-400 hover:bg-green-900/50 hover:text-green-400 shadow-lg hover:shadow-xl"
                  }`}
                  title={social.name}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h3
              className={`text-lg font-bold ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}
            >
              Product
            </h3>
            <ul className="space-y-3">
              {[
                { name: "API Documentation", href: "/api" },
                { name: "Integrations", href: "integrations" },
                { name: "Templates", href: "/templates" },
                { name: "Chart Gallery", href: "#gallery" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className={`text-base transition-colors duration-300 hover:translate-x-1 inline-block ${
                      theme === "light"
                        ? "text-gray-600 hover:text-green-600"
                        : "text-gray-400 hover:text-green-400"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h3
              className={`text-lg font-bold ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}
            >
              Support
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Help Center", href: "#help" },
                { name: "FAQ", href: "#faq" },
                { name: "Contact Us", href: "/contact" },
                { name: "Live Chat", href: "/chat" },
                { name: "Video Tutorials", href: "#tutorials" },
                { name: "Community Forum", href: "#forum" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className={`text-base transition-colors duration-300 hover:translate-x-1 inline-block ${
                      theme === "light"
                        ? "text-gray-600 hover:text-green-600"
                        : "text-gray-400 hover:text-green-400"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Company */}
          <div className="space-y-4">
            <h3
              className={`text-lg font-bold ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}
            >
              Company
            </h3>
            <ul className="space-y-3">
              {[
                { name: "About Us", href: "/about" },
                { name: "Careers", href: "/careers" },
                { name: "Press Kit", href: "/press" },
                { name: "Blog", href: "/blog" },
                { name: "Sitemap", href: "/sitemap" },
                { name: "Status Page", href: "/status" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className={`text-base transition-colors duration-300 hover:translate-x-1 inline-block ${
                      theme === "light"
                        ? "text-gray-600 hover:text-green-600"
                        : "text-gray-400 hover:text-green-400"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div
          className={`mb-12 p-8 rounded-2xl ${
            theme === "light"
              ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100"
              : "bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600"
          }`}
        >
          <div className="max-w-2xl mx-auto text-center">
            <h3
              className={`text-2xl font-bold mb-4 ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}
            >
              Stay Updated
            </h3>
            <p
              className={`text-lg mb-6 ${
                theme === "light" ? "text-gray-600" : "text-gray-300"
              }`}
            >
              Get the latest features, tips, and data visualization insights
              delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className={`flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                  theme === "light"
                    ? "bg-white border-gray-300 text-gray-900"
                    : "bg-gray-800 border-gray-600 text-white"
                }`}
              />
              <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Legal Links Bar */}
        <div
          className={`border-t pt-8 ${
            theme === "light" ? "border-gray-200" : "border-gray-700"
          }`}
        >
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <div
              className={`text-base font-medium ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              © {currentYear} ExcelAnalytics Platform. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Cookie Policy", href: "/cookies" },
                { name: "GDPR Compliance", href: "/gdpr" },
                { name: "Security", href: "/security" },
                { name: "Accessibility", href: "/accessibility" },
              ].map((link, index) => (
                <React.Fragment key={link.name}>
                  <Link
                    to={link.href}
                    className={`text-sm font-medium transition-colors duration-300 hover:scale-105 ${
                      theme === "light"
                        ? "text-gray-600 hover:text-green-600"
                        : "text-gray-400 hover:text-green-400"
                    }`}
                  >
                    {link.name}
                  </Link>
                  {index < 5 && (
                    <span
                      className={`text-sm ${
                        theme === "light" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      |
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div
            className={`mt-6 pt-6 border-t text-center ${
              theme === "light"
                ? "border-gray-100 text-gray-500"
                : "border-gray-800 text-gray-500"
            }`}
          >
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>All systems operational</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div>Made with ❤️ for data enthusiasts worldwide</div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center space-x-1">
                <span>🌍</span>
                <span>Serving 50+ countries</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating "Back to Top" Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 ${
          theme === "light"
            ? "bg-green-500 text-white hover:bg-green-600 shadow-green-500/25"
            : "bg-gray-700 text-green-400 hover:bg-gray-600 shadow-gray-700/50"
        }`}
        title="Back to top"
      >
        ↑
      </button>
    </footer>
  );
};

export default Footer;
