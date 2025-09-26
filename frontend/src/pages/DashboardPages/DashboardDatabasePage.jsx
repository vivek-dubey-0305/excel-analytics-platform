// import React, { useMemo } from "react";

// const DashboardDatabasePage = ({ theme = "light", files = [] }) => {
//   const TOTAL_STORAGE = 5 * 1024 * 1024 * 1024; // 5 GB in bytes

//   // Calculate total used storage
//   const usedStorage = useMemo(() => {
//     return files.reduce((acc, file) => acc + (file.size || 0), 0);
//   }, [files]);

//   const remainingStorage = TOTAL_STORAGE - usedStorage;

//   // Convert bytes → human readable
//   const formatBytes = (bytes) => {
//     if (bytes === 0) return "0 Bytes";
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
//   };

//   const usedPercent = Math.min((usedStorage / TOTAL_STORAGE) * 100, 100);

//   return (
//     <div
//       className={`p-6 rounded-2xl shadow-lg transition-all ${
//         theme === "dark"
//           ? "bg-black/80 text-green-300"
//           : "bg-white text-green-800"
//       }`}
//     >
//       <h2 className="text-2xl font-bold mb-4">Database Storage</h2>

//       {/* Progress Bar */}
//       <div className="relative w-full h-8 bg-gray-200 dark:bg-green-900/30 rounded-xl overflow-hidden">
//         <div
//           className="absolute top-0 left-0 h-full transition-all duration-700 ease-in-out
//           bg-gradient-to-r from-green-400 to-green-600"
//           style={{ width: `${usedPercent}%` }}
//         ></div>
//       </div>

//       {/* Hover Info */}
//       <div
//         className={`mt-3 p-3 rounded-lg text-sm shadow-md ${
//           theme === "dark"
//             ? "bg-green-900/40 text-green-200"
//             : "bg-green-50 text-green-700"
//         }`}
//       >
//         <p>
//           <span className="font-semibold">Used:</span>{" "}
//           {formatBytes(usedStorage)} / {formatBytes(TOTAL_STORAGE)}
//         </p>
//         <p>
//           <span className="font-semibold">Remaining:</span>{" "}
//           {formatBytes(remainingStorage)}
//         </p>
//         <p>
//           <span className="font-semibold">Files Stored:</span> {files.length}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default DashboardDatabasePage;


import React, { useMemo } from "react";
import { 
  Database, 
  HardDrive, 
  Activity, 
  FileText, 
  Server, 
  Zap,
  TrendingUp,
  Clock,
  Shield,
  AlertTriangle
} from "lucide-react";
import DangerZone from "../../components/DangerZone/DanzerZone";

const DashboardDatabasePage = ({ theme = "light", files = [] }) => {
  const TOTAL_STORAGE = 5 * 1024 * 1024 * 1024; // 5 GB in bytes

  // Calculate total used storage
  const usedStorage = useMemo(() => {
    return files.reduce((acc, file) => acc + (file.size || 0), 0);
  }, [files]);

  const remainingStorage = TOTAL_STORAGE - usedStorage;

  // Convert bytes → human readable
  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const usedPercent = Math.min((usedStorage / TOTAL_STORAGE) * 100, 100);
  const isLowStorage = usedPercent > 80;
  const isCriticalStorage = usedPercent > 90;

  // Mock database metrics for realistic appearance
  const dbMetrics = {
    status: "running",
    queries: 1247,
    uptime: "99.8%",
    responseTime: "12ms"
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className={`p-6 rounded-2xl shadow-lg border transition-all ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 text-white"
          : "bg-gradient-to-br from-white to-slate-50 border-slate-200 text-slate-900"
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${
              theme === "dark" 
                ? "bg-blue-500/20 text-blue-400" 
                : "bg-blue-500/10 text-blue-600"
            }`}>
              <Database size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Database Container</h2>
              <p className={`text-sm ${
                theme === "dark" ? "text-slate-400" : "text-slate-600"
              }`}>
                MongoDB 8.2 • Container ID: db-****-001
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className={`text-sm font-medium ${
              theme === "dark" ? "text-green-400" : "text-green-600"
            }`}>
              Online
            </span>
          </div>
        </div>

        {/* Database Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-xl border ${
            theme === "dark"
              ? "bg-slate-800/50 border-slate-700"
              : "bg-white border-slate-200"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Activity size={16} className="text-blue-500" />
              <span className={`text-xs font-medium ${
                theme === "dark" ? "text-slate-400" : "text-slate-600"
              }`}>
                STATUS
              </span>
            </div>
            <p className="text-xl font-bold text-green-500">{dbMetrics.status}</p>
          </div>

          <div className={`p-4 rounded-xl border ${
            theme === "dark"
              ? "bg-slate-800/50 border-slate-700"
              : "bg-white border-slate-200"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-green-500" />
              <span className={`text-xs font-medium ${
                theme === "dark" ? "text-slate-400" : "text-slate-600"
              }`}>
                QUERIES/MIN
              </span>
            </div>
            <p className="text-xl font-bold">{dbMetrics.queries}</p>
          </div>

          <div className={`p-4 rounded-xl border ${
            theme === "dark"
              ? "bg-slate-800/50 border-slate-700"
              : "bg-white border-slate-200"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} className="text-emerald-500" />
              <span className={`text-xs font-medium ${
                theme === "dark" ? "text-slate-400" : "text-slate-600"
              }`}>
                UPTIME
              </span>
            </div>
            <p className="text-xl font-bold text-emerald-500">{dbMetrics.uptime}</p>
          </div>

          <div className={`p-4 rounded-xl border ${
            theme === "dark"
              ? "bg-slate-800/50 border-slate-700"
              : "bg-white border-slate-200"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-yellow-500" />
              <span className={`text-xs font-medium ${
                theme === "dark" ? "text-slate-400" : "text-slate-600"
              }`}>
                AVG RESPONSE
              </span>
            </div>
            <p className="text-xl font-bold">{dbMetrics.responseTime}</p>
          </div>
        </div>
      </div>

      {/* Storage Section */}
      <div className={`p-6 rounded-2xl shadow-lg border transition-all ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 text-white"
          : "bg-gradient-to-br from-white to-slate-50 border-slate-200 text-slate-900"
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${
              isCriticalStorage 
                ? "bg-red-500/20 text-red-400" 
                : isLowStorage
                ? "bg-yellow-500/20 text-yellow-400"
                : theme === "dark" 
                ? "bg-green-500/20 text-green-400" 
                : "bg-green-500/10 text-green-600"
            }`}>
              <HardDrive size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Storage Management</h3>
              <p className={`text-sm ${
                theme === "dark" ? "text-slate-400" : "text-slate-600"
              }`}>
                Data volume monitoring & allocation
              </p>
            </div>
          </div>

          {(isLowStorage || isCriticalStorage) && (
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} className={isCriticalStorage ? "text-red-400" : "text-yellow-400"} />
              <span className={`text-sm font-medium ${
                isCriticalStorage ? "text-red-400" : "text-yellow-400"
              }`}>
                {isCriticalStorage ? "Critical" : "Warning"}
              </span>
            </div>
          )}
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className={`text-sm font-medium ${
              theme === "dark" ? "text-slate-300" : "text-slate-700"
            }`}>
              Storage Usage
            </span>
            <span className={`text-sm font-bold ${
              isCriticalStorage 
                ? "text-red-400" 
                : isLowStorage 
                ? "text-yellow-400"
                : theme === "dark" ? "text-green-400" : "text-green-600"
            }`}>
              {usedPercent.toFixed(1)}%
            </span>
          </div>
          
          <div className={`relative w-full h-4 rounded-full overflow-hidden ${
            theme === "dark" ? "bg-slate-700" : "bg-slate-200"
          }`}>
            <div
              className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-full ${
                isCriticalStorage
                  ? "bg-gradient-to-r from-red-500 to-red-600"
                  : isLowStorage
                  ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                  : "bg-gradient-to-r from-green-500 to-emerald-500"
              }`}
              style={{ width: `${usedPercent}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Storage Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className={`p-4 rounded-xl border ${
            theme === "dark"
              ? "bg-slate-800/30 border-slate-700"
              : "bg-slate-50 border-slate-200"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className={`text-xs font-medium uppercase tracking-wide ${
                theme === "dark" ? "text-slate-400" : "text-slate-600"
              }`}>
                Used Storage
              </span>
            </div>
            <p className="text-2xl font-bold mb-1">{formatBytes(usedStorage)}</p>
            <p className={`text-xs ${
              theme === "dark" ? "text-slate-500" : "text-slate-500"
            }`}>
              of {formatBytes(TOTAL_STORAGE)}
            </p>
          </div>

          <div className={`p-4 rounded-xl border ${
            theme === "dark"
              ? "bg-slate-800/30 border-slate-700"
              : "bg-slate-50 border-slate-200"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className={`text-xs font-medium uppercase tracking-wide ${
                theme === "dark" ? "text-slate-400" : "text-slate-600"
              }`}>
                Available
              </span>
            </div>
            <p className="text-2xl font-bold mb-1">{formatBytes(remainingStorage)}</p>
            <p className={`text-xs ${
              theme === "dark" ? "text-slate-500" : "text-slate-500"
            }`}>
              remaining space
            </p>
          </div>

          <div className={`p-4 rounded-xl border ${
            theme === "dark"
              ? "bg-slate-800/30 border-slate-700"
              : "bg-slate-50 border-slate-200"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <FileText size={14} className="text-purple-500" />
              <span className={`text-xs font-medium uppercase tracking-wide ${
                theme === "dark" ? "text-slate-400" : "text-slate-600"
              }`}>
                Total Files
              </span>
            </div>
            <p className="text-2xl font-bold mb-1">{files.length.toLocaleString()}</p>
            <p className={`text-xs ${
              theme === "dark" ? "text-slate-500" : "text-slate-500"
            }`}>
              objects stored
            </p>
          </div>
        </div>

        {/* Health Status */}
        <div className={`p-4 rounded-xl border ${
          isCriticalStorage
            ? theme === "dark"
              ? "bg-red-900/20 border-red-800 text-red-300"
              : "bg-red-50 border-red-200 text-red-800"
            : isLowStorage
            ? theme === "dark"
              ? "bg-yellow-900/20 border-yellow-800 text-yellow-300"
              : "bg-yellow-50 border-yellow-200 text-yellow-800"
            : theme === "dark"
            ? "bg-green-900/20 border-green-800 text-green-300"
            : "bg-green-50 border-green-200 text-green-800"
        }`}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span className="text-sm font-medium">System Status:</span>
            </div>
            <span className="text-sm">
              {isCriticalStorage 
                ? "Storage critically low - immediate action required"
                : isLowStorage
                ? "Storage running low - consider cleanup or expansion"
                : "Storage levels optimal - system running smoothly"
              }
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
 <DangerZone theme={theme} />
    </div>
  );
};

export default DashboardDatabasePage;