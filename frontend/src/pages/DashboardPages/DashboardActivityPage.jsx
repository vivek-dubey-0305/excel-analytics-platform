import React, { useEffect, useState } from "react";
import Activity from "../../components/Activity/Activity";
import { useDispatch, useSelector } from "react-redux";
import { clearUserLogs } from "../../redux/slice/activity/activity.slice"; // your redux action
import { getUser } from "../../redux/slice/user/user.slice";
import Loader from "../../components/Loader/Loader";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

// Custom Modal Component


const DashboardActivityPage = ({ theme, myActivities, isDeleting }) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const handleClearAll = async () => {
    // setLoading(true);
    try {
      await dispatch(clearUserLogs(user?._id)).unwrap();
      // Optimistic update — clear activities instantly
      // myActivities.length = 0;

      setModalOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      // setLoading(false);
      setModalOpen(false);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(myActivities, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `activities_${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="w-full flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-green-400" : "text-green-600"
          }`}
        >
          My Activities {myActivities?.length}
        </h2>

        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className={`px-4 py-2 rounded-xl border transition ${
              theme === "dark"
                ? "border-green-600 text-green-400 hover:bg-green-800/30"
                : "border-green-400 text-green-700 hover:bg-green-100"
            }`}
          >
            Export JSON
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className={`px-4 py-2 rounded-xl transition ${
              theme === "dark"
                ? "bg-red-600 text-white hover:bg-red-500"
                : "bg-red-500 text-white hover:bg-red-400"
            }`}
          >
            Delete All
          </button>
        </div>
      </div>

      {/* Loader */}
      {isDeleting && (
        <div className="flex justify-center mt-4">
          <Loader />
        </div>
      )}

      {/* Activity List */}
      {!isDeleting && <Activity theme={theme} myActivities={myActivities} />}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleClearAll}
        message="Are you sure you want to delete all activities? This action cannot be undone."
        theme={theme}
      />
    </div>
  );
};

export default DashboardActivityPage;
