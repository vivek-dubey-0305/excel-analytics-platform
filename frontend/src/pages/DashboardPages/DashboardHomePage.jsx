import {
  BarChart2,
  BarChart3,
  Clock,
  Database,
  Download,
  Edit3,
  Eye,
  FileQuestionMarkIcon,
  FileSpreadsheet,
  Trash,
  Upload,
  X,
  Zap,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ChartBuilder from "../../components/ChartBuilder";
import { useDispatch } from "react-redux";
import { uploadFile } from "../../redux/slice/file/file.slice";
import Loader from "../../components/Loader/Loader";
import { actionColors } from "../../utils/activity.utils.js";
import RelativeTime from "../../components/RelativeTime/RelativeTime";
import Activity from "../../components/Activity/Activity.jsx";

const DashboardHomePage = ({ theme, myActivities, file, loading, success }) => {
  const slice = 7;
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("myActivities", myActivities);
  }, [dispatch]);

  const [generateChart, setGenerateChart] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  // Handle button click → open file picker
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Handle file selection
  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    // Check extension
    const allowedExtensions = [".xlsx", ".xls"];
    const fileExtension = file.name.substring(file.name.lastIndexOf("."));

    if (!allowedExtensions.includes(fileExtension)) {
      alert("Only .xlsx and .xls files are allowed!");
      event.target.value = ""; // reset input
      return;
    }

    // Dispatch Redux action with file
    try {
      await dispatch(uploadFile(file)).unwrap(); // 👈 unwrap to throw error on reject
    } catch (error) {
      alert(`❌ Upload failed: ${error.message || error}`);
    }

    setSelectedFile(file);
    // Reset input (so selecting same file again still triggers change)
    event.target.value = "";
  };

  // Remove file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    success = false;
  };

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: "Total Uploads",
            value: myActivities?.length || 0,
            icon: <Upload size={24} />,
            trend: "+12%",
            color:
              theme === "dark"
                ? "from-green-500 to-green-600"
                : "from-green-400 to-green-500",
          },
          {
            title: "Total Downloads",
            value: "89",
            icon: <Download size={24} />,
            trend: "+8%",
            color:
              theme === "dark"
                ? "from-blue-500 to-blue-600"
                : "from-blue-400 to-blue-500",
          },
          // {
          //   title: "Analytics Generated",
          //   value: "245",
          //   icon: <BarChart2 size={24} />,
          //   trend: "+25%",
          //   color:
          //     theme === "dark"
          //       ? "from-purple-500 to-purple-600"
          //       : "from-purple-400 to-purple-500",
          // },
          {
            title: "Storage Used",
            value: "2.3GB",
            icon: <Database size={24} />,
            trend: "75%",
            color:
              theme === "dark"
                ? "from-orange-500 to-orange-600"
                : "from-orange-400 to-orange-500",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-105 ${
              theme === "dark"
                ? "bg-gradient-to-br from-gray-900 to-black border border-green-900/30"
                : "bg-white shadow-lg shadow-green-100"
            }`}
          >
            <div
              className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -mr-16 -mt-16`}
            ></div>
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}
                >
                  <span className="text-white">{stat.icon}</span>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    theme === "dark"
                      ? "bg-green-900/30 text-green-400"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {stat.trend}
                </span>
              </div>
              <h3
                className={`text-sm font-medium mb-1 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {stat.title}
              </h3>
              <p
                className={`text-3xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* File Manager & Analytics */}
      <div className="mt-8">
        {" "}
        {/**Grid col */}
        {/* File Manager */}
        <div
          className={`lg:col-span-2 rounded-2xl p-8 transition-all duration-300 ${
            theme === "dark"
              ? "bg-gradient-to-br from-gray-900 to-black border border-green-900/30"
              : "bg-white shadow-lg"
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <FileSpreadsheet
                className={
                  theme === "dark" ? "text-green-400" : "text-green-600"
                }
                size={24}
              />
              <h2
                className={`text-xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                File Manager
              </h2>
            </div>

            {/* -------------------------- */}
            {/* Hidden File Input */}
            <input
              type="file"
              accept=".xlsx,.xls"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            {/* Custom Button */}
            <button
              onClick={handleButtonClick}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black"
                  : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
              }`}
            >
              <Upload size={18} />
              Upload File
            </button>
            {/* -------------------------- */}

            {/* <button className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${theme === "dark"
                                    ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black"
                                    : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                                    }`}>
                                    <Upload size={18} />
                                    Upload File
                                </button> */}
          </div>

          {/* *Slection previous code */}
          {/* {!selectedFile ? (
            <div
              onClick={handleButtonClick}
              className={`cursor-pointer border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                theme === "dark"
                  ? "border-green-900/50 hover:border-green-500/50 bg-green-900/10"
                  : "border-green-300 hover:border-green-500 bg-green-50/30"
              }`}
            >
              <Upload
                className={`mx-auto mb-4 ${
                  theme === "dark" ? "text-green-500" : "text-green-600"
                }`}
                size={48}
              />
              <p
                className={`text-lg font-semibold mb-2 ${
                  theme === "dark" ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Drag & drop your Excel files here
              </p>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-500" : "text-gray-500"
                }`}
              >
                or click to browse (.xlsx, .xls, .csv)
              </p>
            </div>
          ) : (
            // ================= FILE CARD =================
            <div
              className={`flex items-center justify-between w-full max-w-md px-6 py-3 rounded-xl shadow-md transition-all duration-200 ${
                theme === "dark"
                  ? "bg-green-900/30 text-gray-200"
                  : "bg-green-100 text-gray-800"
              }`}
            >
              <span className="truncate">{selectedFile.name}</span>
              <button
                onClick={handleRemoveFile}
                className="ml-4 text-red-500 hover:text-red-700 transition"
              >
                <X size={20} />
              </button>
            </div>
          )} */}

          {loading ? (
            // SHOW LOADER WHILE UPLOADING
            <div className="flex items-center justify-center w-full max-w-md p-12 border-2 border-dashed rounded-2xl transition-all duration-300">
              <Loader text="Uploading..." size={60} />
            </div>
          ) : !selectedFile ? (
            // DRAG & DROP BOX
            <div
              onClick={handleButtonClick}
              className={`cursor-pointer border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                theme === "dark"
                  ? "border-green-900/50 hover:border-green-500/50 bg-green-900/10"
                  : "border-green-300 hover:border-green-500 bg-green-50/30"
              }`}
            >
              <Upload
                className={`mx-auto mb-4 ${
                  theme === "dark" ? "text-green-500" : "text-green-600"
                }`}
                size={48}
              />
              <p
                className={`text-lg font-semibold mb-2 ${
                  theme === "dark" ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Drag & drop your Excel files here
              </p>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-500" : "text-gray-500"
                }`}
              >
                or click to browse (.xlsx, .xls, .csv)
              </p>
            </div>
          ) : (
            // ================= FILE CARD =================
            <div
              className={`flex items-center justify-between w-full max-w-md px-6 py-3 rounded-xl shadow-md transition-all duration-200 ${
                theme === "dark"
                  ? "bg-green-900/30 text-gray-200"
                  : "bg-green-100 text-gray-800"
              }`}
            >
              <span className="truncate">{selectedFile.name}</span>
              <button
                onClick={handleRemoveFile}
                className="ml-4 text-red-500 hover:text-red-700 transition"
              >
                <X size={20} />
              </button>
            </div>
          )}

          {/* File List */}

          <div className="mt-20">
            {success && <ChartBuilder fileObject={file} theme={theme} />}
          </div>
        </div>
        {/* Analytics Section */}
      </div>

      {/* Activity Feed & Quick Actions */}
      <Activity theme={theme} myActivities={myActivities} slice={slice} />
    </div>
  );
};

export default DashboardHomePage;
