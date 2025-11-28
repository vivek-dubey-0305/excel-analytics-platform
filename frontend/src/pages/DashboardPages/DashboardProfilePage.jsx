import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Pencil,
  Trash2,
  Loader2,
  User,
  Phone,
  Mail,
  Camera,
  Link,
  Globe,
  Github,
  Youtube,
  Instagram,
  Facebook,
  Twitter,
  AlertTriangle,
} from "lucide-react";
import {
  deleteUser,
  getUser,
  updateAvatar,
  updateProfile,
} from "../../redux/slice/user/user.slice.js";

import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

const DashboardProfilePage = ({ theme }) => {
  const dispatch = useDispatch();
  const { user, loading, error, success } = useSelector((state) => state.user);

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [profileUpdating, setProfileUpdating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Load user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        await dispatch(getUser()).unwrap();
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "not specified",
        social_links: user.social_links || {
          youtube: "",
          instagram: "",
          facebook: "",
          twitter: "",
          github: "",
          website: "",
        },
      });
    }
  }, [user]);

  // Validation functions
  const validateForm = () => {
    const errors = {};

    // Full name validation
    if (!formData.fullName || formData.fullName.length < 4) {
      errors.fullName = "Name must be at least 4 characters long";
    }
    if (formData.fullName && formData.fullName.length > 100) {
      errors.fullName = "Name cannot be more than 100 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Phone validation (Indian mobile number)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone.toString())) {
      errors.phone = "Please enter a valid 10-digit Indian mobile number";
    }

    // Social links validation
    const urlRegex =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    Object.keys(formData.social_links || {}).forEach((key) => {
      const link = formData.social_links[key];
      if (link && !urlRegex.test(link)) {
        errors[`social_${key}`] = `Please enter a valid ${key} URL`;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setProfileUpdating(true);
    try {
      await dispatch(updateProfile(formData)).unwrap();
      setEditMode(false);
      setFormErrors({});
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setProfileUpdating(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size too large. Please choose image under 5MB.");
      return;
    }

    setAvatarUploading(true);
    try {
      await dispatch(updateAvatar({ file })).unwrap();
    } catch (err) {
      console.error("Avatar update failed:", err);
      alert("Failed to update avatar. Please try again.");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await dispatch(deleteUser()).unwrap();
      window.location.href = "/"; // redirect to home after account deletion
    } catch (err) {
      console.error("Delete user failed:", err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData((prev) => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value,
      },
    }));

    // Clear error when user starts typing
    if (formErrors[`social_${platform}`]) {
      setFormErrors((prev) => ({
        ...prev,
        [`social_${platform}`]: "",
      }));
    }
  };

  const getSocialIcon = (platform) => {
    const icons = {
      youtube: Youtube,
      instagram: Instagram,
      facebook: Facebook,
      twitter: Twitter,
      github: Github,
      website: Globe,
    };
    return icons[platform] || Link;
  };

  const isDark = theme === "dark";
  const bgClass = isDark ? "bg-slate-900" : "bg-white";
  const textClass = isDark ? "text-white" : "text-slate-900";
  const inputClass = isDark
    ? "bg-slate-800 border-slate-700 text-white focus:border-green-500"
    : "bg-white border-gray-300 text-slate-900 focus:border-green-500";
  const cardClass = isDark ? "bg-slate-800" : "bg-gray-50";

  return (
    <div
      className={`min-h-screen p-6 ${isDark ? "bg-slate-900" : "bg-gray-50"}`}
    >
      <div
        className={`max-w-full mx-auto ${bgClass} ${textClass} rounded-2xl shadow-2xl overflow-hidden`}
      >
        {/* Header Section with Avatar */}
        <div
          className={`${
            isDark
              ? "bg-gradient-to-r from-green-900 to-slate-800"
              : "bg-gradient-to-r from-green-500 to-green-600"
          } p-8 text-white relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center gap-8">
            <div className="relative group">
              <div
                className={`w-32 h-32 rounded-full border-4 border-white/20 overflow-hidden ${
                  avatarUploading ? "animate-pulse" : ""
                }`}
              >
                {avatarUploading ? (
                  <div className="w-full h-full bg-black/20 flex items-center justify-center">
                    <Loader2 className="animate-spin w-8 h-8 text-white" />
                  </div>
                ) : (
                  <img
                    src={
                      user?.avatar?.secure_url ||
                      "https://via.placeholder.com/128x128.png?text=Avatar"
                    }
                    alt="avatar"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/128x128.png?text=Error";
                    }}
                  />
                )}
              </div>
              <label
                htmlFor="avatarUpload"
                className="absolute bottom-2 right-2 bg-green-600 p-3 rounded-full cursor-pointer hover:bg-green-500 transition-all transform hover:scale-110 shadow-lg"
              >
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  id="avatarUpload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={avatarUploading}
                />
              </label>
            </div>

            <div className="flex-1">
              <h1 className="text-4xl font-bold capitalize mb-2">
                {user?.fullName}
              </h1>
              <p className="text-xl text-white/80 mb-4">{user?.email}</p>
              {avatarUploading && (
                <div className="flex items-center gap-2 text-green-200">
                  <Loader2 className="animate-spin w-4 h-4" />
                  <span className="text-sm">Updating avatar...</span>
                </div>
              )}
              <div className="flex items-center gap-4 text-white/60">
                <span className="capitalize">Role: {user?.role}</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    user?.isVerified
                      ? "bg-green-500/20 text-green-200"
                      : "bg-red-500/20 text-red-200"
                  }`}
                >
                  {user?.isVerified ? "Verified" : "Not Verified"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-8">
          {!editMode ? (
            <div className="space-y-8">
              {/* Basic Information */}
              <div className={`${cardClass} rounded-xl p-6`}>
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-green-500" />
                  Basic Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium capitalize">{user?.fullName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{user?.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="font-medium capitalize">{user?.gender}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className={`${cardClass} rounded-xl p-6`}>
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Link className="w-5 h-5 text-green-500" />
                  Social Links
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(user?.social_links || {}).map(
                    ([platform, url]) => {
                      const IconComponent = getSocialIcon(platform);
                      return (
                        <div key={platform} className="flex items-center gap-3">
                          <IconComponent className="w-5 h-5 text-gray-400" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-500 capitalize">
                              {platform}
                            </p>
                            {url ? (
                              <a
                                href={
                                  url.startsWith("http")
                                    ? url
                                    : `https://${url}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-500 hover:text-green-600 underline font-medium truncate block"
                              >
                                {url}
                              </a>
                            ) : (
                              <span className="text-gray-400">
                                Not provided
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              <button
                onClick={() => setEditMode(true)}
                className="w-full md:w-auto px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-500 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <Pencil className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleProfileUpdate} className="space-y-8">
              {profileUpdating && (
                <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <Loader2 className="animate-spin w-5 h-5" />
                  <span>Updating profile...</span>
                </div>
              )}

              {/* Basic Information Form */}
              <div className={`${cardClass} rounded-xl p-6`}>
                <h3 className="text-xl font-semibold mb-6">
                  Edit Basic Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName || ""}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      className={`w-full p-3 rounded-lg border transition-all ${inputClass} ${
                        formErrors.fullName ? "border-red-500" : ""
                      }`}
                      placeholder="Enter your full name"
                    />
                    {formErrors.fullName && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={`w-full p-3 rounded-lg border transition-all ${inputClass} ${
                        formErrors.email ? "border-red-500" : ""
                      }`}
                      placeholder="Enter your email"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone || ""}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className={`w-full p-3 rounded-lg border transition-all ${inputClass} ${
                        formErrors.phone ? "border-red-500" : ""
                      }`}
                      placeholder="Enter 10-digit mobile number"
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Gender
                    </label>
                    <select
                      value={formData.gender || "not specified"}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                      className={`w-full p-3 rounded-lg border transition-all ${inputClass}`}
                    >
                      <option value="not specified">Not Specified</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Social Links Form */}
              <div className={`${cardClass} rounded-xl p-6`}>
                <h3 className="text-xl font-semibold mb-6">Social Links</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.keys(formData.social_links || {}).map((platform) => {
                    const IconComponent = getSocialIcon(platform);
                    return (
                      <div key={platform}>
                        <label className="text-sm font-medium mb-2 capitalize flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          {platform}
                        </label>
                        <input
                          type="url"
                          value={formData.social_links?.[platform] || ""}
                          onChange={(e) =>
                            handleSocialLinkChange(platform, e.target.value)
                          }
                          className={`w-full p-3 rounded-lg border transition-all ${inputClass} ${
                            formErrors[`social_${platform}`]
                              ? "border-red-500"
                              : ""
                          }`}
                          placeholder={`Enter your ${platform} URL`}
                        />
                        {formErrors[`social_${platform}`] && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors[`social_${platform}`]}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  type="submit"
                  disabled={profileUpdating}
                  className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-500 disabled:opacity-50 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  {profileUpdating ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    setFormErrors({});
                  }}
                  className={`px-8 py-3 border rounded-xl transition-all transform hover:scale-105 ${
                    isDark
                      ? "border-slate-600 hover:bg-slate-800"
                      : "border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Danger Zone */}
          <div
            className={`mt-12 border-t ${
              isDark ? "border-red-800" : "border-red-200"
            } pt-8`}
          >
            <div
              className={`bg-gradient-to-r ${
                isDark
                  ? "from-rose-900/20 to-rose-900/40 border-red-800"
                  : "from-rose-300 to-red-200"
              } rounded-xl p-6 border border-red-200 relative overflow-hidden`}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(239, 68, 68, 0.1) 10px, rgba(239, 68, 68, 0.1) 20px)",
                  }}
                ></div>
              </div>

              <div className="relative">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className={`
            w-12 h-12 ${
              isDark ? "bg-red-900/50" : "bg-red-100"
            } rounded-full flex items-center justify-center
          `}
                    >
                      <AlertTriangle
                        className={`w-6 h-6 ${
                          isDark ? "text-red-400" : "text-red-600"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3
                      className={`font-bold text-lg mb-2 flex items-center gap-2 ${
                        isDark ? "text-red-400" : "text-red-600"
                      }`}
                    >
                      Danger Zone
                    </h3>
                    <div className="space-y-3">
                      <p
                        className={`${
                          isDark ? "text-red-300" : "text-red-700"
                        } text-sm leading-relaxed`}
                      >
                        Permanently delete your account and all associated data.
                        This action cannot be undone and you will lose:
                      </p>
                      <ul
                        className={`${
                          isDark ? "text-red-400" : "text-red-600"
                        } text-sm space-y-1 ml-4`}
                      >
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                          All profile information and settings
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                          Account history and activity data
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                          Access to all connected services
                        </li>
                      </ul>

                      <div
                        className={`
              pt-4 border-t ${isDark ? "border-red-700" : "border-red-200"}
            `}
                      >
                        <button
                          onClick={() => setConfirmDelete(true)}
                          className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25 group"
                        >
                          <Trash2 className="w-4 h-4 group-hover:animate-bounce" />
                          Delete Account Permanently
                        </button>
                        <p
                          className={`${
                            isDark ? "text-red-400" : "text-red-500"
                          } text-xs mt-2 opacity-75`}
                        >
                          This action is irreversible. Please be absolutely
                          certain.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDeleteUser}
        message="Are you sure you want to delete your account? This action cannot be undone and you will lose all your data permanently."
        theme={theme}
      />
    </div>
  );
};

export default DashboardProfilePage;
