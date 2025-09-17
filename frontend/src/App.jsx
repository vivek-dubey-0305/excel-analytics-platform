import React from "react";
import { useTheme } from "./context/ThemeContext";

import { Route, Routes } from "react-router-dom";
import Home from "./pages/PublicPages/Home";
import Layout from "./components/Layout/Layout";
import LoginPage from "./pages/AuthPages/Login";
import SignupPage from "./pages/AuthPages/Register";

const App = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>
      <Route />
    </Routes>
  );
};

export default App;
