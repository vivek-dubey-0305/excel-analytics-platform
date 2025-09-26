import React from 'react';
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from 'react-router-dom';

const About = () => {
  const { theme } = useTheme();
  const navigate = useNavigate()

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === "light" ? "bg-gray-50" : "bg-gray-900"
    }`}>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-20 left-10 w-72 h-72 rounded-full opacity-10 ${
            theme === "light" ? "bg-gradient-to-br from-green-400 to-blue-500" : "bg-gradient-to-br from-green-600 to-emerald-800"
          }`}></div>
          <div className={`absolute bottom-20 right-10 w-64 h-64 rounded-full opacity-10 ${
            theme === "light" ? "bg-gradient-to-tr from-emerald-400 to-green-600" : "bg-gradient-to-tr from-green-500 to-teal-700"
          }`}></div>
        </div>

        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-medium mb-8 ${
              theme === "light" 
                ? "bg-green-100 text-green-700 border border-green-200" 
                : "bg-green-900/30 text-green-300 border border-green-700/50"
            }`}>
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></span>
              Our Story
            </div>
            
            <h1 className={`text-5xl lg:text-7xl font-black leading-tight mb-8 ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}>
              About 
              <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 bg-clip-text text-transparent">
                ExcelAnalytics
              </span>
            </h1>

            <p className={`text-xl lg:text-2xl leading-relaxed max-w-3xl mx-auto ${
              theme === "light" ? "text-gray-600" : "text-gray-300"
            }`}>
              We're on a mission to make data visualization accessible to everyone, 
              transforming complex spreadsheets into beautiful insights that drive better decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className={`py-20 ${theme === "light" ? "bg-white" : "bg-gray-800"}`}>
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className={`text-4xl lg:text-5xl font-bold mb-8 ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}>
                Our <span className="text-green-600">Mission</span>
              </h2>
              <div className="space-y-6">
                <p className={`text-lg leading-relaxed ${
                  theme === "light" ? "text-gray-600" : "text-gray-300"
                }`}>
                  In today's data-driven world, the ability to visualize and understand information 
                  is crucial for success. Yet, creating professional charts and graphs often requires 
                  expensive software, technical expertise, or hours of manual work.
                </p>
                <p className={`text-lg leading-relaxed ${
                  theme === "light" ? "text-gray-600" : "text-gray-300"
                }`}>
                  ExcelAnalytics was born from a simple belief: <strong>everyone should have access 
                  to powerful data visualization tools</strong>, regardless of their technical background 
                  or budget constraints.
                </p>
                <div className="flex items-center space-x-4 pt-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-2xl">
                    🎯
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                      Democratizing Data Visualization
                    </h3>
                    <p className={`${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                      Making professional charts accessible to everyone
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img
                src="https://img.freepik.com/free-vector/business-mission-concept-illustration_114360-8854.jpg"
                alt="Our Mission"
                className="w-full rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
              <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-2xl shadow-lg flex items-center justify-center animate-bounce ${
                theme === "light" ? "bg-white" : "bg-gray-700"
              }`}>
                🚀
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Team Section */}
<section class="py-24 bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
  <div class="container mx-auto px-6">
    <div class="text-center mb-16">
      <h2 class="text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
        Meet Our <span class="text-green-600">Team</span>
      </h2>
      <p class="text-xl text-gray-600 dark:text-gray-300">
        The passionate people behind ExcelAnalytics
      </p>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {/* <!-- Vivek Dubey --> */}
      <div class="text-center p-8 rounded-2xl transition-all duration-300 hover:scale-105 bg-white shadow-lg hover:shadow-xl dark:bg-gray-800 dark:shadow-2xl dark:hover:shadow-3xl">
        <div class="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto">
          👨‍💻
        </div>
        <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">Vivek Dubey</h3>
        <div class="text-green-600 font-semibold mb-4">Fullstack Engineer</div>
        <p class="leading-relaxed text-gray-600 dark:text-gray-300">
          Skilled in building scalable web apps, backend systems, and seamless integrations.
        </p>
      </div>

      {/* <!-- Abhinaya K --> */}
      <div class="text-center p-8 rounded-2xl transition-all duration-300 hover:scale-105 bg-white shadow-lg hover:shadow-xl dark:bg-gray-800 dark:shadow-2xl dark:hover:shadow-3xl">
        <div class="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto">
          👩‍💻
        </div>
        <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">Abhinaya K</h3>
        <div class="text-green-600 font-semibold mb-4">Frontend Developer</div>
        <p class="leading-relaxed text-gray-600 dark:text-gray-300">
          Passionate about crafting pixel-perfect, responsive, and accessible UIs.
        </p>
      </div>

      {/* <!-- Dhivakar J --> */}
      <div class="text-center p-8 rounded-2xl transition-all duration-300 hover:scale-105 bg-white shadow-lg hover:shadow-xl dark:bg-gray-800 dark:shadow-2xl dark:hover:shadow-3xl">
        <div class="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto">
          🧪
        </div>
        <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">Dhivakar J</h3>
        <div class="text-green-600 font-semibold mb-4">API Tester</div>
        <p class="leading-relaxed text-gray-600 dark:text-gray-300">
          Ensures the reliability and performance of APIs with rigorous testing.
        </p>
      </div>

      {/* <!-- Arnav Patel --> */}
      <div class="text-center p-8 rounded-2xl transition-all duration-300 hover:scale-105 bg-white shadow-lg hover:shadow-xl dark:bg-gray-800 dark:shadow-2xl dark:hover:shadow-3xl">
        <div class="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto">
          ⚛️
        </div>
        <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">Arnav Patel</h3>
        <div class="text-green-600 font-semibold mb-4">React Developer</div>
        <p class="leading-relaxed text-gray-600 dark:text-gray-300">
          Builds dynamic, interactive, and optimized React-based solutions.
        </p>
      </div>

      {/* <!-- Tharani Mj --> */}
      <div class="text-center p-8 rounded-2xl transition-all duration-300 hover:scale-105 bg-white shadow-lg hover:shadow-xl dark:bg-gray-800 dark:shadow-2xl dark:hover:shadow-3xl">
        <div class="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto">
          🎨
        </div>
        <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">Tharani Mj</h3>
        <div class="text-green-600 font-semibold mb-4">Collaboration & Design</div>
        <p class="leading-relaxed text-gray-600 dark:text-gray-300">
          Focused on teamwork, creative designs, and enhancing user experiences.
        </p>
      </div>

      {/* <!-- Deepika --> */}
      <div class="text-center p-8 rounded-2xl transition-all duration-300 hover:scale-105 bg-white shadow-lg hover:shadow-xl dark:bg-gray-800 dark:shadow-2xl dark:hover:shadow-3xl">
        <div class="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto">
          🛠️
        </div>
        <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">Deepika</h3>
        <div class="text-green-600 font-semibold mb-4">Quality Assurance</div>
        <p class="leading-relaxed text-gray-600 dark:text-gray-300">
          Dedicated to testing, refining, and ensuring flawless product quality.
        </p>
      </div>
    </div>
  </div>
</section>


      {/* Journey Section */}
      <section className={`py-20 ${theme === "light" ? "bg-white" : "bg-gray-800"}`}>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}>
                Our <span className="text-green-600">Journey</span>
              </h2>
              <p className={`text-xl ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>
                From idea to impact
              </p>
            </div>

            <div className="space-y-12">
              {[
                {
                  year: "2023",
                  title: "The Idea",
                  description: "Frustrated by complex data visualization tools, we envisioned a simpler solution for everyone.",
                  icon: "💡"
                },
                {
                  year: "2024",
                  title: "First Launch",
                  description: "Released our MVP with basic chart generation. Our first 1,000 users helped shape the platform.",
                  icon: "🚀"
                },
                {
                  year: "2025",
                  title: "Scaling Up",
                  description: "Reached 10,000+ users, added advanced features, and expanded to serve 50+ countries worldwide.",
                  icon: "📈"
                }
              ].map((milestone, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-2xl`}>
                    {milestone.icon}
                  </div>
                  <div>
                    <div className="text-green-600 font-bold text-lg mb-2">{milestone.year}</div>
                    <h3 className={`text-2xl font-bold mb-3 ${
                      theme === "light" ? "text-gray-900" : "text-white"
                    }`}>
                      {milestone.title}
                    </h3>
                    <p className={`text-lg leading-relaxed ${
                      theme === "light" ? "text-gray-600" : "text-gray-300"
                    }`}>
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-24 ${
        theme === "light" ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-gradient-to-r from-gray-800 to-gray-900"
      }`}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Join Our Mission?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Be part of the community that's making data visualization accessible to everyone
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
            onClick={()=> navigate("/login")}
              className="inline-flex items-center px-8 py-4 text-xl font-bold text-green-600 bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Get Started Free
              <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

          </div>
        </div>
      </section>
    </div>
  );
};

export default About;