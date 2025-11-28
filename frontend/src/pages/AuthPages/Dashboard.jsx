import React, { useState, useRef } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import {
  Home,
  FileUp,
  BarChart2,
  Activity,
  User,
  Settings,
  Bell,
  Search,
  FileSpreadsheet,
  TrendingUp,
  PieChart,
  LineChart,
  Database,
  Grid,
  Layers,
  Shield,
  Calendar,
  Filter,
  ChevronDown,
  Moon,
  Sun,
  Package,
  BarChart3,
  GitBranch,
  Cpu,
  Target,
  Globe,
  Map,
  Compass,
  Box,
  Hexagon,
  Triangle,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getMyActivityLogs } from "../../redux/slice/activity/activity.slice";
import { getAllFilesByUser } from "../../redux/slice/file/file.slice";
import { navigationItems } from "../../utils/navigationItems.utils";

import DashboardHomePage from "../DashboardPages/DashboardHomePage";
import DashboardFilePage from "../DashboardPages/DashboardFilePage";
import DashboardActivityPage from "../DashboardPages/DashboardActivityPage";
import DashboardDatabasePage from "../DashboardPages/DashboardDatabasePage";
import DashboardSecurityPage from "../DashboardPages/DashboardSecurityPage";
import DashboardProfilePage from "../DashboardPages/DashboardProfilePage";
import { getUser } from "../../redux/slice/user/user.slice";
import ProfileMenu from "../../components/ProfileMenu/ProfileMenu";

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { myActivities, clearLogs } = useSelector((state) => state.activity);
  const {
    files,
    file,
    fileColumns,
    fileSampleValues,
    fileData,
    fileCount,
    loading,
    error,
    success,
  } = useSelector((state) => state.file);

  const dispatch = useDispatch();
  const location = useLocation();
  const [theme, setTheme] = useState("dark");
  const { user } = useSelector((state) => state.user);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const chartTypes = [
    { name: "Bar Chart", icon: <BarChart2 size={16} /> },
    { name: "Horizontal Bar Chart", icon: <BarChart3 size={16} /> },
    { name: "Line Chart", icon: <LineChart size={16} /> },
    { name: "Multi-line Chart", icon: <TrendingUp size={16} /> },
    { name: "Pie Chart", icon: <PieChart size={16} /> },
    { name: "Doughnut Chart", icon: <Target size={16} /> },
    { name: "Radar Chart", icon: <Compass size={16} /> },
    { name: "Polar Area Chart", icon: <Globe size={16} /> },
    { name: "Bubble Chart", icon: <Hexagon size={16} /> },
    { name: "Scatter Chart", icon: <Grid size={16} /> },
    { name: "Area Chart", icon: <Map size={16} /> },
    { name: "Mixed Chart", icon: <Layers size={16} /> },
    { name: "3D Bar Chart", icon: <Box size={16} /> },
    { name: "3D Pie Chart", icon: <Triangle size={16} /> },
    { name: "3D Line Chart", icon: <GitBranch size={16} /> },
    { name: "3D Surface Chart", icon: <Cpu size={16} /> },
    { name: "Waterfall Chart", icon: <Activity size={16} /> },
    { name: "Funnel Chart", icon: <Filter size={16} /> },
    { name: "Heatmap", icon: <Grid size={16} /> },
    { name: "Treemap", icon: <Package size={16} /> },
  ];

  // * Upload button logix

  // *USEEFFECT - activity logs
  useEffect(() => {
    dispatch(getAllFilesByUser());
    // console.log("result", result)
  }, []);
  useEffect(() => {
    dispatch(getUser());
    // console.log("result", result)
  }, []);
  useEffect(() => {
    console.log("File state updated:");
    console.log("files: []", files);
    console.log("file:", file);
    console.log("columns:", fileColumns);
    console.log("count:", fileCount);
    console.log("sample values:", fileSampleValues);
    console.log("data:", fileData);
  }, [files, file, fileColumns, fileSampleValues, fileData, fileCount]);
  useEffect(() => {
    dispatch(getMyActivityLogs());
  }, [dispatch]);

  // *----------------------------------------------------------------------------

  // Check if a nav item is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div
      className={`flex h-screen transition-all duration-300 ${
        theme === "dark"
          ? "bg-black"
          : "bg-gradient-to-br from-green-50 to-white"
      }`}
    >
      {/* Sidebar */}
      <aside
        className={`w-72 flex flex-col transition-all duration-300 ${
          theme === "dark"
            ? "bg-gradient-to-b from-gray-900 to-black border-r border-green-900/30"
            : "bg-white border-r border-green-200"
        }`}
      >
        <div
          className={`h-20 flex items-center justify-center border-b ${
            theme === "dark"
              ? "border-green-900/30 bg-black/50"
              : "border-green-200 bg-gradient-to-r from-green-500 to-green-600"
          }`}
        >
          <div className="flex items-center gap-3">
            <FileSpreadsheet
              className={`${
                theme === "dark" ? "text-green-400" : "text-white"
              }`}
              size={28}
            />
            <span
              className={`text-2xl font-bold ${
                theme === "dark" ? "text-green-400" : "text-white"
              }`}
            >
              Excel Analytics
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-5 space-y-1 overflow-y-auto">
          {navigationItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive(item.path)
                  ? theme === "dark"
                    ? "bg-green-900/30 border-l-4 border-green-400"
                    : "bg-green-100 border-l-4 border-green-500"
                  : theme === "dark"
                  ? "hover:bg-green-900/20 hover:border-l-4 hover:border-green-400"
                  : "hover:bg-green-50 hover:border-l-4 hover:border-green-500"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`transition-colors ${
                    isActive(item.path)
                      ? theme === "dark"
                        ? "text-green-400"
                        : "text-green-700"
                      : theme === "dark"
                      ? "text-green-500 group-hover:text-green-400"
                      : "text-green-600 group-hover:text-green-700"
                  }`}
                >
                  {<item.icon size={20} />}
                </span>
                <span
                  className={`font-medium ${
                    isActive(item.path)
                      ? theme === "dark"
                        ? "text-green-400"
                        : "text-green-700"
                      : theme === "dark"
                      ? "text-gray-300 group-hover:text-green-400"
                      : "text-gray-700 group-hover:text-green-700"
                  }`}
                >
                  {item.name}
                </span>
              </div>
              {item.badge && (
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    theme === "dark"
                      ? "bg-green-900/50 text-green-400"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div
          className={`p-5 border-t ${
            theme === "dark" ? "border-green-900/30" : "border-green-200"
          }`}
        >
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all ${
              theme === "dark"
                ? "bg-green-900/20 hover:bg-green-900/30 text-green-400"
                : "bg-green-100 hover:bg-green-200 text-green-700"
            }`}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            <span className="font-medium">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header
          className={`h-20 flex items-center justify-end px-8 border-b transition-all duration-300 ${
            theme === "dark"
              ? "bg-gray-900/50 border-green-900/30 backdrop-blur-sm"
              : "bg-white border-green-200 shadow-sm"
          }`}
        >
<ProfileMenu user={user} theme={theme} />
        </header>

        <main
          className={`flex-1 p-8 space-y-8 overflow-y-auto ${
            theme === "dark"
              ? "bg-black"
              : "bg-gradient-to-br from-green-50/50 to-white"
          }`}
        >
          <Routes>
            <Route
              path="/"
              element={
                <DashboardHomePage
                  theme={theme}
                  myActivities={myActivities}
                  file={file}
                  loading={loading}
                  error={error}
                  success={success}
                />
              }
            />
            <Route
              path="/files"
              element={<DashboardFilePage theme={theme} files={files} />}
            />
            <Route
              path="/security"
              element={<DashboardSecurityPage theme={theme} />}
            />
            <Route
              path="/activity"
              element={
                <DashboardActivityPage
                  theme={theme}
                  myActivities={myActivities}
                  isDeleting={clearLogs}
                />
              }
            />
            <Route
              path="/database"
              element={<DashboardDatabasePage theme={theme} files={files} />}
            />
            <Route
              path="/profile"
              element={<DashboardProfilePage theme={theme} />}
            />
            {/* Add more routes for other pages */}
          </Routes>
        </main>
        {/* Dashboard Content */}
      </div>
    </div>
  );
};

export default Dashboard;
