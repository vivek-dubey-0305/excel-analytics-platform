// import React from "react";
// import { useDispatch } from "react-redux";
// import { Download, Trash } from "lucide-react";
// import moment from "moment";
// import { deleteFile } from "../../redux/slice/file/file.slice";

// const DashboardFilePage = ({ theme, files }) => {
//   const dispatch = useDispatch();

//   const handleDelete = async (fileId) => {
//     if (window.confirm("Are you sure you want to delete this file?")) {
//       await dispatch(deleteFile(fileId));
//       // optionally show toast or update UI
//     }
//   };

//   const formatFileSize = (size) => {
//     if (!size) return "0 KB";
//     const kb = size / 1024;
//     if (kb < 1024) return `${kb.toFixed(2)} KB`;
//     return `${(kb / 1024).toFixed(2)} MB`;
//   };

//   return (
//     <div className="w-full flex flex-col gap-6 p-6">
//       <h2
//         className={`text-2xl font-bold ${
//           theme === "dark" ? "text-green-400" : "text-green-600"
//         }`}
//       >
//         Uploaded Files {files?.length}
//       </h2>

//       {files && files.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {files.map((f) => (
//             <div
//               key={f._id}
//               className={`border rounded-xl p-4 shadow-md transition hover:shadow-lg ${
//                 theme === "dark"
//                   ? "bg-green-900/20 border-green-800 text-gray-200"
//                   : "bg-green-100 border-green-200 text-gray-800"
//               }`}
//             >
//               <div className="flex justify-between items-start">
//                 <h3 className="font-semibold text-lg truncate">{f.originalName}</h3>
//                 <div className="flex gap-2">
//                   <a
//                     href={f.fileUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className={`p-2 rounded-full transition hover:bg-green-500/20 ${
//                       theme === "dark" ? "text-green-400" : "text-green-600"
//                     }`}
//                   >
//                     <Download size={20} />
//                   </a>
//                   <button
//                     onClick={() => handleDelete(f._id)}
//                     className={`p-2 rounded-full transition hover:bg-red-500/20 ${
//                       theme === "dark" ? "text-red-400" : "text-red-600"
//                     }`}
//                   >
//                     <Trash size={20} />
//                   </button>
//                 </div>
//               </div>

//               <div className="mt-2 text-sm space-y-1">
//                 <p>
//                   <span className="font-semibold">Type:</span> {f.format || "N/A"}
//                 </p>
//                 <p>
//                   <span className="font-semibold">Size:</span> {formatFileSize(f.size)}
//                 </p>
//                 <p>
//                   <span className="font-semibold">Uploaded By:</span>{" "}
//                   {f.uploadedBy?.fullName || "User"}
//                 </p>
//                 <p>
//                   <span className="font-semibold">Uploaded At:</span>{" "}
//                   {moment(f.createdAt).fromNow()} {/* shows "5 minutes ago" */}
//                 </p>
//               </div>

//               {f.parsedSample && f.parsedSample.length > 0 && (
//                 <div className="mt-3 overflow-x-auto">
//                   <table className="min-w-full text-sm border-collapse">
//                     <thead>
//                       <tr className="border-b border-green-500/50">
//                         {Object.keys(f.parsedSample[0]).map((col) => (
//                           <th
//                             key={col}
//                             className={`px-2 py-1 text-left ${
//                               theme === "dark" ? "text-green-300" : "text-green-700"
//                             }`}
//                           >
//                             {col}
//                           </th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {f.parsedSample.map((row, idx) => (
//                         <tr
//                           key={idx}
//                           className={`${
//                             idx % 2 === 0
//                               ? theme === "dark"
//                                 ? "bg-green-800/10"
//                                 : "bg-green-50"
//                               : ""
//                           }`}
//                         >
//                           {Object.values(row).map((val, i) => (
//                             <td key={i} className="px-2 py-1 truncate">
//                               {typeof val === "object" ? JSON.stringify(val) : val}
//                             </td>
//                           ))}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p
//           className={`text-center text-gray-500 ${
//             theme === "dark" ? "text-gray-400" : ""
//           }`}
//         >
//           No files uploaded yet.
//         </p>
//       )}
//     </div>
//   );
// };

// export default DashboardFilePage;

// !-----------------------------
// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { Download, Trash } from "lucide-react";
// import moment from "moment";
// import { deleteFile } from "../../redux/slice/file/file.slice";

// // Simple green spinner
// const Loader = ({ size = 6 }) => (
//   <div className={`animate-spin rounded-full h-${size} w-${size} border-t-2 border-green-500 border-b-2 border-transparent`} />
// );

// const DashboardFilePage = ({ theme, files, loading }) => {
//   const dispatch = useDispatch();
//   const [deletingId, setDeletingId] = useState(null);
//   const [downloadingId, setDownloadingId] = useState(null);

//   const handleDelete = async (fileId) => {
//     if (!window.confirm("Are you sure you want to delete this file?")) return;
//     setDeletingId(fileId);
//     await dispatch(deleteFile(fileId));
//     setDeletingId(null);
//   };

//   const handleDownload = async (file) => {
//     setDownloadingId(file._id);
//     try {
//       const link = document.createElement("a");
//       link.href = file.fileUrl;
//       link.download = file.originalName;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (err) {
//       console.error("Download failed", err);
//     } finally {
//       setDownloadingId(null);
//     }
//   };

//   const formatFileSize = (size) => {
//     if (!size) return "0 KB";
//     const kb = size / 1024;
//     if (kb < 1024) return `${kb.toFixed(2)} KB`;
//     return `${(kb / 1024).toFixed(2)} MB`;
//   };

//   if (loading) {
//     return (
//       <div className="w-full flex justify-center items-center py-20">
//         <Loader size={10} />
//       </div>
//     );
//   }

//   return (
//     <div className="w-full flex flex-col gap-6 p-6">
//       <h2 className={`text-2xl font-bold ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>
//         Uploaded Files {files?.length || 0}
//       </h2>

//       {files && files.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {files.map((f) => (
//             <div
//               key={f._id}
//               className={`border rounded-xl p-4 shadow-md transition hover:shadow-lg ${
//                 theme === "dark" ? "bg-green-900/20 border-green-800 text-gray-200" : "bg-green-100 border-green-200 text-gray-800"
//               }`}
//             >
//               <div className="flex justify-between items-start">
//                 <h3 className="font-semibold text-lg truncate">{f.originalName}</h3>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => handleDownload(f)}
//                     disabled={downloadingId === f._id}
//                     className={`p-2 rounded-full transition hover:bg-green-500/20 flex justify-center items-center ${
//                       theme === "dark" ? "text-green-400" : "text-green-600"
//                     }`}
//                   >
//                     {downloadingId === f._id ? <Loader size={4} /> : <Download size={20} />}
//                   </button>
//                   <button
//                     onClick={() => handleDelete(f._id)}
//                     disabled={deletingId === f._id}
//                     className={`p-2 rounded-full transition hover:bg-red-500/20 flex justify-center items-center ${
//                       theme === "dark" ? "text-red-400" : "text-red-600"
//                     }`}
//                   >
//                     {deletingId === f._id ? <Loader size={4} /> : <Trash size={20} />}
//                   </button>
//                 </div>
//               </div>

//               <div className="mt-2 text-sm space-y-1">
//                 <p>
//                   <span className="font-semibold">Type:</span> {f.format || "N/A"}
//                 </p>
//                 <p>
//                   <span className="font-semibold">Size:</span> {formatFileSize(f.size)}
//                 </p>
//                 <p>
//                   <span className="font-semibold">Uploaded By:</span> {f.uploadedBy?.fullName || "User"}
//                 </p>
//                 <p>
//                   <span className="font-semibold">Uploaded At:</span> {moment(f.createdAt).fromNow()}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className={`text-center text-gray-500 ${theme === "dark" ? "text-gray-400" : ""}`}>
//           No files uploaded yet.
//         </p>
//       )}
//     </div>
//   );
// };

// export default DashboardFilePage;
// !-=----------------------------
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Download, Trash, Loader } from "lucide-react";
import moment from "moment";
import { deleteFile } from "../../redux/slice/file/file.slice";

const DashboardFilePage = ({ theme, files }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.file);
  const [deletingFiles, setDeletingFiles] = useState({}); // Track deleting state per file

  const handleDelete = async (fileId) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        // Set loading state for this specific file
        setDeletingFiles((prev) => ({ ...prev, [fileId]: true }));

        // Dispatch delete action
        await dispatch(deleteFile(fileId));

        // Refresh the files list after successful deletion
        // await dispatch(getMyFiles());

        // Show success message (you can add a toast notification here)
        console.log("File deleted successfully");
      } catch (error) {
        console.error("Failed to delete file:", error);
        // Show error message (you can add a toast notification here)
      } finally {
        // Remove loading state regardless of success/failure
        setDeletingFiles((prev) => {
          const newState = { ...prev };
          delete newState[fileId];
          return newState;
        });
      }
    }
  };

  const formatFileSize = (size) => {
    if (!size) return "0 KB";
    const kb = size / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  // Check if any file is currently being deleted
  const isAnyFileDeleting = Object.values(deletingFiles).some(
    (status) => status
  );

  return (
    <div className="w-full flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h2
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-green-400" : "text-green-600"
          }`}
        >
          Uploaded Files {files?.length || 0}
        </h2>

        {/* Global loading indicator */}
        {isAnyFileDeleting && (
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              theme === "dark"
                ? "bg-yellow-900/30 text-yellow-400"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            <Loader className="animate-spin" size={16} />
            <span>Deleting files...</span>
          </div>
        )}
      </div>

      {files && files.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.map((f) => {
            const isDeleting = deletingFiles[f._id];

            return (
              <div
                key={f._id}
                className={`border rounded-xl p-4 shadow-md transition-all duration-300 ${
                  isDeleting
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:shadow-lg transform hover:-translate-y-1"
                } ${
                  theme === "dark"
                    ? "bg-green-900/20 border-green-800 text-gray-200"
                    : "bg-green-100 border-green-200 text-gray-800"
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg truncate flex-1 mr-2">
                    {f.originalName}
                  </h3>
                  <div className="flex gap-2 flex-shrink-0">
                    <a
                      href={f.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-full transition hover:bg-green-500/20 ${
                        theme === "dark" ? "text-green-400" : "text-green-600"
                      } ${isDeleting ? "pointer-events-none opacity-50" : ""}`}
                      title="Download file"
                    >
                      <Download size={20} />
                    </a>
                    <button
                      onClick={() => !isDeleting && handleDelete(f._id)}
                      disabled={isDeleting}
                      className={`p-2 rounded-full transition ${
                        isDeleting
                          ? "cursor-not-allowed opacity-50"
                          : "hover:bg-red-500/20"
                      } ${theme === "dark" ? "text-red-400" : "text-red-600"}`}
                      title={isDeleting ? "Deleting..." : "Delete file"}
                    >
                      {isDeleting ? (
                        <Loader className="animate-spin" size={20} />
                      ) : (
                        <Trash size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-2 text-sm space-y-1">
                  <p>
                    <span className="font-semibold">Type:</span>{" "}
                    {f.format || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Size:</span>{" "}
                    {formatFileSize(f.size)}
                  </p>
                  <p>
                    <span className="font-semibold">Uploaded By:</span>{" "}
                    {f.uploadedBy?.fullName || "User"}
                  </p>
                  <p>
                    <span className="font-semibold">Uploaded At:</span>{" "}
                    {moment(f.createdAt).fromNow()}
                  </p>
                </div>

                {f.parsedSample && f.parsedSample.length > 0 && (
                  <div className="mt-3 overflow-x-auto">
                    <table className="min-w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-green-500/50">
                          {Object.keys(f.parsedSample[0]).map((col) => (
                            <th
                              key={col}
                              className={`px-2 py-1 text-left ${
                                theme === "dark"
                                  ? "text-green-300"
                                  : "text-green-700"
                              }`}
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {f.parsedSample.map((row, idx) => (
                          <tr
                            key={idx}
                            className={`${
                              idx % 2 === 0
                                ? theme === "dark"
                                  ? "bg-green-800/10"
                                  : "bg-green-50"
                                : ""
                            }`}
                          >
                            {Object.values(row).map((val, i) => (
                              <td
                                key={i}
                                className="px-2 py-1 truncate max-w-[100px]"
                              >
                                {typeof val === "object"
                                  ? JSON.stringify(val)
                                  : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* File deletion status indicator */}
                {isDeleting && (
                  <div className="mt-3 flex items-center gap-2">
                    <div
                      className={`w-full bg-gray-200 rounded-full h-1.5 ${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    >
                      <div className="bg-red-500 h-1.5 rounded-full animate-pulse"></div>
                    </div>
                    <span
                      className={`text-xs ${
                        theme === "dark" ? "text-red-400" : "text-red-600"
                      }`}
                    >
                      Deleting...
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className={`text-center py-12 rounded-xl ${
            theme === "dark" ? "bg-gray-900/50" : "bg-gray-100"
          }`}
        >
          <div
            className={`text-6xl mb-4 ${
              theme === "dark" ? "text-gray-700" : "text-gray-300"
            }`}
          >
            📁
          </div>
          <p
            className={`text-lg font-medium ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No files uploaded yet.
          </p>
          <p
            className={`text-sm mt-1 ${
              theme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Upload your first Excel file to get started
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardFilePage;
