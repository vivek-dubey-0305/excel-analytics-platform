// import React from "react";
// import { useTheme } from "../../context/ThemeContext";

// const Header = () => {
//   const { theme, setTheme } = useTheme();

//   return (
//     <div>
//       <div className="text-2xl bg-white text-black dark:bg-gray-800 dark:text-white">
//         Header
//       </div>
//       <button
//         className={`bg-green ${
//           theme === "light" ? " text-2xl text-black" : "text-2xl text-white"
//         }`}
//         onClick={() => setTheme(theme === "light" ? "dark" : "light")}
//       >
//         Toogle Mode
//       </button>
//     </div>
//   );
// };

// export default Header;
// src/components/layout/Header.jsx
import React from "react";
import { useTheme } from "../../context/ThemeContext";

const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header
      className={`flex justify-between items-center px-6 py-4 shadow-md ${
        theme === "light"
          ? "bg-white text-green-700"
          : "bg-black text-green-400"
      }`}
    >
      {/* Logo / Title */}
      <div className="text-2xl font-bold tracking-wide">
        Excel<span className="text-green-500">Analytics</span>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex space-x-6 text-lg font-medium">
        <a href="#features" className="hover:text-green-500 transition-colors">
          Features
        </a>
        <a href="#pricing" className="hover:text-green-500 transition-colors">
          Pricing
        </a>
        <a href="#about" className="hover:text-green-500 transition-colors">
          About
        </a>
        <a href="#contact" className="hover:text-green-500 transition-colors">
          Contact
        </a>
      </nav>

      {/* Theme Toggle Button */}
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
          theme === "light"
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-green-500 text-black hover:bg-green-600"
        }`}
      >
        {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </button>
    </header>
  );
};

export default Header;
