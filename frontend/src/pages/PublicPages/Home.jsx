// src/pages/LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const LandingPage = ({isAuthenticated}) => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === "light" ? "bg-gray-50" : "bg-gray-900"
    }`}>
      {/* 1. HERO SECTION */}
      <section
        id="hero"
        className="relative overflow-hidden"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute -top-40 -right-28 w-220 h-80 rounded-full opacity-20 ${
            theme === "light" ? "bg-gradient-to-br from-green-400 to-blue-500" : "bg-gradient-to-br from-green-600 to-emerald-800"
          }`}></div>
          <div className={`absolute -bottom-32 -left-22 w-150 h-64 rounded-full opacity-20 ${
            theme === "light" ? "bg-gradient-to-tr from-emerald-400 to-green-600" : "bg-gradient-to-tr from-green-500 to-emerald-700"
          }`}></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-20 lg:py-32">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Text Content */}
            <div className="lg:w-1/2 space-y-8">
              <div className="space-y-4">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  theme === "light" 
                    ? "bg-green-100 text-green-700 border border-green-200" 
                    : "bg-green-900/30 text-green-300 border border-green-700/50"
                }`}>
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Transform Data Into Insights
                </div>
                
                <h1 className={`text-5xl lg:text-7xl font-black leading-tight ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}>
                  Excel
                  <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 bg-clip-text text-transparent">
                    Analytics
                  </span>
                  <div className="text-3xl lg:text-4xl mt-2 font-bold">
                    Made Simple
                  </div>
                </h1>
              </div>

              <p className={`text-xl lg:text-2xl leading-relaxed ${
                theme === "light" ? "text-gray-600" : "text-gray-300"
              }`}>
                Upload your Excel files and transform them into 
                <span className="font-semibold text-green-600"> beautiful, insightful charts</span> 
                instantly. No coding required.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to={isAuthenticated ? "/dashboard" : "/login"}
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transform hover:scale-105 transition-all duration-300"
                >
                  <span className="flex items-center">
                    🚀 Get Started Free
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                
                <button className={`px-8 py-4 text-lg font-semibold rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                  theme === "light"
                    ? "border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600"
                    : "border-gray-600 text-gray-300 hover:border-green-400 hover:text-green-400"
                }`}>
                  📊 View Demo
                </button>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-8 pt-8">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>10K+</div>
                  <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>Active Users</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>50K+</div>
                  <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>Charts Generated</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>99.9%</div>
                  <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>Uptime</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="lg:w-1/2 relative">
              <div className="relative z-10">
                <img
                  src="https://img.freepik.com/free-vector/data-report-concept-illustration_114360-883.jpg"
                  alt="Excel Analytics Dashboard"
                  className="w-full max-w-lg mx-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              {/* Floating Elements */}
              <div className={`absolute top-10 -left-4 w-16 h-16 rounded-xl shadow-lg flex items-center justify-center animate-bounce ${
                theme === "light" ? "bg-white" : "bg-gray-800"
              }`}>
                📈
              </div>
              <div className={`absolute bottom-10 -right-4 w-20 h-20 rounded-xl shadow-lg flex items-center justify-center animate-pulse ${
                theme === "light" ? "bg-green-100" : "bg-green-900/50"
              }`}>
                💡
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section
        id="features"
        className={`py-50 ${theme === "light" ? "bg-white" : "bg-gray-800"}`}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}>
              What Can <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">ExcelAnalytics</span> Do?
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              theme === "light" ? "text-gray-600" : "text-gray-300"
            }`}>
              Powerful features designed to make data visualization effortless and professional
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: "📤",
                title: "Smart Upload",
                description: "Drag & drop or select your Excel files with intelligent data detection and validation.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: "🎨",
                title: "Auto Charts",
                description: "AI-powered chart generation creates beautiful bar, pie, line charts and more automatically.",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: "💾",
                title: "Export Anywhere",
                description: "Download in PDF, PNG, SVG formats. Perfect for presentations and reports.",
                gradient: "from-purple-500 to-pink-500"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`group relative p-8 rounded-2xl transition-all duration-300 hover:scale-105 ${
                  theme === "light" 
                    ? "bg-gray-50 hover:bg-white hover:shadow-xl" 
                    : "bg-gray-700 hover:bg-gray-600 hover:shadow-2xl"
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl mb-6 group-hover:rotate-12 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}>
                  {feature.title}
                </h3>
                <p className={`text-lg leading-relaxed ${
                  theme === "light" ? "text-gray-600" : "text-gray-300"
                }`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE US SECTION */}
      <section id="details" className={`py-50 ${
        theme === "light" ? "bg-gradient-to-br from-green-50 to-blue-50" : "bg-gradient-to-br from-gray-900 to-gray-800"
      }`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}>
              Why Choose <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">ExcelAnalytics?</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              { icon: "⚡", title: "Lightning Fast", desc: "Get insights in seconds with our optimized algorithms and cloud processing." },
              { icon: "🔒", title: "Bank-Level Security", desc: "Your data stays private — we never store or share your files. End-to-end encryption." },
              { icon: "🎨", title: "Fully Customizable", desc: "Generate professional charts tailored to your brand with custom colors and themes." },
              { icon: "📊", title: "Business Ready", desc: "Export charts for presentations, reports, or research with publication-quality output." }
            ].map((item, index) => (
              <div 
                key={index}
                className={`flex items-start space-x-6 p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${
                  theme === "light" ? "bg-white/80 backdrop-blur-sm shadow-lg" : "bg-gray-800/80 backdrop-blur-sm shadow-2xl"
                }`}
              >
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-2xl">
                  {item.icon}
                </div>
                <div>
                  <h3 className={`text-xl font-bold mb-2 ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  }`}>
                    {item.title}
                  </h3>
                  <p className={`text-lg leading-relaxed ${
                    theme === "light" ? "text-gray-600" : "text-gray-300"
                  }`}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TESTIMONIALS SECTION */}
      <section
        id="testimonials"
        className={`py-50 ${theme === "light" ? "bg-white" : "bg-gray-800"}`}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}>
              Trusted by <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">Thousands</span>
            </h2>
            <p className={`text-xl ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>
              See what our users are saying about their experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote: "This platform saved me hours of manual chart-making. The AI suggestions are incredibly accurate!",
                author: "Sarah Chen",
                role: "Data Analyst",
                avatar: "👩‍💼"
              },
              {
                quote: "I generated professional reports in minutes. My team's productivity has increased by 300%.",
                author: "Michael Rodriguez",
                role: "Business Intelligence Manager",
                avatar: "👨‍💻"
              },
              {
                quote: "The export quality is amazing. My presentations have never looked better. Highly recommended!",
                author: "Emily Watson",
                role: "Marketing Director",
                avatar: "👩‍🎨"
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className={`relative p-8 rounded-2xl transition-all duration-300 hover:scale-105 ${
                  theme === "light" ? "bg-gray-50 hover:shadow-xl" : "bg-gray-700 hover:shadow-2xl"
                }`}
              >
                <div className="absolute top-4 left-4 text-4xl opacity-20">"</div>
                <div className="relative z-10">
                  <p className={`text-lg italic mb-6 leading-relaxed ${
                    theme === "light" ? "text-gray-700" : "text-gray-300"
                  }`}>
                    {testimonial.quote}
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className={`font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                        {testimonial.author}
                      </h4>
                      <p className="text-green-600 font-medium">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className={`py-50 ${
        theme === "light" ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-gradient-to-r from-gray-800 to-gray-900"
      }`}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Data?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already streamlined their data visualization workflow
          </p>
          <Link 
            to="/login"
            className="inline-flex items-center px-8 py-4 text-xl font-bold text-green-600 bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Start Free Today
            <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;