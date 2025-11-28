import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AlertTriangle, Trash2, Loader2, AlertCircle, CheckCircle, X } from "lucide-react";
import { deleteAllFiles } from "../../redux/slice/file/file.slice";

// Toast Component
const Toast = ({ message, type, onClose, theme }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-[60] animate-in slide-in-from-top-2 duration-300">
      <div
        className={`flex items-center gap-3 p-4 rounded-lg shadow-lg border min-w-[300px] ${
          type === "error"
            ? theme === "dark"
              ? "bg-red-900/90 border-red-700 text-red-200"
              : "bg-red-50 border-red-200 text-red-800"
            : type === "success"
            ? theme === "dark"
              ? "bg-green-900/90 border-green-700 text-green-200"
              : "bg-green-50 border-green-200 text-green-800"
            : theme === "dark"
            ? "bg-slate-800/90 border-slate-600 text-slate-200"
            : "bg-white border-slate-200 text-slate-800"
        }`}
      >
        {type === "error" && <AlertCircle size={20} className="text-red-500 flex-shrink-0" />}
        {type === "success" && <CheckCircle size={20} className="text-green-500 flex-shrink-0" />}
        {type === "info" && <AlertTriangle size={20} className="text-blue-500 flex-shrink-0" />}
        
        <span className="text-sm font-medium flex-1">{message}</span>
        
        <button
          onClick={onClose}
          className={`p-1 rounded-full hover:bg-black/10 transition-colors ${
            theme === "dark" ? "hover:bg-white/10" : "hover:bg-black/10"
          }`}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

const DangerZone = ({ theme }) => {
  const dispatch = useDispatch();
  const { deletingAll, files } = useSelector((state) => state.file); // Get files from state
  const [openConfirm, setOpenConfirm] = useState(false);
  const [toast, setToast] = useState(null);

  const totalFiles = files?.length || 0;
  const hasFiles = totalFiles > 0;

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleDelete = async () => {
    if (!hasFiles) {
      showToast("No files to delete", "info");
      setOpenConfirm(false);
      return;
    }

    try {
      await dispatch(deleteAllFiles()).unwrap();
      setOpenConfirm(false);
      showToast(`Successfully deleted ${totalFiles} file${totalFiles === 1 ? '' : 's'}`, "success");
    } catch (err) {
      console.error("❌ Delete failed:", err);
      showToast("Failed to delete files. Please try again.", "error");
      setOpenConfirm(false);
    }
  };

  const handleClearStorageClick = () => {
    if (!hasFiles) {
      showToast("No files to delete", "info");
      return;
    }
    setOpenConfirm(true);
  };

  return (
    <>
      <div
        className={`p-6 rounded-2xl shadow-lg border transition-all relative ${
          theme === "dark"
            ? "bg-gradient-to-br from-slate-900 to-slate-800 border-red-700 text-white"
            : "bg-gradient-to-br from-white to-red-50 border-red-200 text-red-900"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`p-3 rounded-xl ${
              theme === "dark"
                ? "bg-red-500/20 text-red-400"
                : "bg-red-500/10 text-red-600"
            }`}
          >
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold">Danger Zone</h3>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Critical actions for storage management
            </p>
          </div>
        </div>

        {/* File Count Info */}
        <div
          className={`p-4 rounded-xl mb-4 border ${
            theme === "dark"
              ? "bg-slate-800/30 border-slate-700"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[16px] font-medium ${
                theme === "dark" ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Current Files:
            </span>
            <span
              className={`text-lg font-bold ${
                hasFiles
                  ? theme === "dark"
                    ? "text-red-400"
                    : "text-red-600"
                  : theme === "dark"
                  ? "text-green-400"
                  : "text-green-600"
              }`}
            >
              {totalFiles.toLocaleString()}
            </span>
          </div>
          {!hasFiles && (
            <p
              className={`text-[14px] mt-1 ${
                theme === "dark" ? "text-green-400" : "text-green-600"
              }`}
            >
              Storage is clean - no files to delete
            </p>
          )}
        </div>

        {/* Clear Storage Button */}
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={handleClearStorageClick}
            disabled={deletingAll}
            className={`p-4 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
              hasFiles && !deletingAll ? "hover:scale-105" : ""
            } ${
              theme === "dark"
                ? hasFiles
                  ? "bg-slate-900 border-red-700 hover:bg-slate-800 text-red-400"
                  : "bg-slate-800 border-slate-600 text-slate-500"
                : hasFiles
                ? "bg-white border-red-300 hover:bg-red-50 text-red-600"
                : "bg-slate-100 border-slate-300 text-slate-400"
            } ${
              deletingAll || !hasFiles ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <Trash2 size={18} />
            {hasFiles ? `Clear Storage (${totalFiles} files)` : "No Files to Clear"}
          </button>
        </div>

        {/* Warning Message */}
        {hasFiles && (
          <div
            className={`mt-4 p-3 rounded-lg border-l-4 ${
              theme === "dark"
                ? "bg-red-900/20 border-red-600 text-red-200"
                : "bg-red-50 border-red-400 text-red-700"
            }`}
          >
            <p className="text-xs font-medium">
              ⚠️ This action will permanently delete all {totalFiles} file{totalFiles === 1 ? '' : 's'} and cannot be undone.
            </p>
          </div>
        )}

        {/* Confirmation Dialog */}
        {openConfirm && !deletingAll && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
            <div
              className={`p-6 rounded-2xl max-w-md w-full mx-4 shadow-2xl border ${
                theme === "dark" 
                  ? "bg-slate-900 text-white border-slate-700" 
                  : "bg-white text-black border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-red-500/20">
                  <AlertTriangle className="text-red-500" size={20} />
                </div>
                <h2 className="text-lg font-bold text-red-500">
                  Confirm Deletion
                </h2>
              </div>
              
              <div className="mb-6">
                <p className="text-sm mb-3">
                  Are you absolutely sure you want to delete <strong>all {totalFiles} file{totalFiles === 1 ? '' : 's'}</strong>?
                </p>
                <div
                  className={`p-3 rounded-lg text-xs ${
                    theme === "dark"
                      ? "bg-red-900/30 text-red-200"
                      : "bg-red-50 text-red-800"
                  }`}
                >
                  <strong>Warning:</strong> This action cannot be undone. All files will be permanently deleted from your storage.
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setOpenConfirm(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    theme === "dark"
                      ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  Delete All {totalFiles} Files
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full-Screen Loader - Covers Everything */}
      {deletingAll && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="relative">
              <Loader2 className="animate-spin text-red-500" size={48} />
              <div className="absolute inset-0 rounded-full border-2 border-red-500/20 animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <p className="text-white text-lg font-medium">Deleting all files...</p>
              <p className="text-slate-300 text-sm">Please wait, this may take a moment</p>
              <div className="flex items-center justify-center gap-1 mt-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          theme={theme}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default DangerZone;