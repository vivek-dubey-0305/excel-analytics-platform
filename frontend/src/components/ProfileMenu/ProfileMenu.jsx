// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { ChevronDown, LogOut } from "lucide-react";
// import { logout } from "../../redux/slice/user/user.slice"; // adjust path

// const ProfileMenu = ({ user, theme }) => {
//   const [open, setOpen] = useState(false);
//   const dispatch = useDispatch();

//   const handleLogout = () => {
//     dispatch(logout());
//     setOpen(false);
//   };

//   return (
//     <div className="relative flex items-center gap-6">
//       {/* Profile Button */}
//       <div
//         onClick={() => setOpen((prev) => !prev)}
//         className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition-all ${
//           theme === "dark" ? "hover:bg-green-900/20" : "hover:bg-green-50"
//         }`}
//       >
//         <div
//           className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center ${
//             theme === "dark"
//               ? "bg-gradient-to-br from-green-500 to-green-600"
//               : "bg-gradient-to-br from-green-400 to-green-500"
//           }`}
//         >
//           <img
//             className="w-full h-full object-cover"
//             src={
//               user?.avatar?.secure_url
//                 ? user.avatar.secure_url
//                 : "https://cdn.pixabay.com/photo/2022/12/01/04/44/girl-7628309_1280.jpg"
//             }
//             alt="user avatar"
//           />
//         </div>

//         <div>
//           <p
//             className={`text-sm font-semibold ${
//               theme === "dark" ? "text-gray-200" : "text-gray-800"
//             }`}
//           >
//             {user?.fullName}
//           </p>
//           <p className="text-xs text-green-500">{user?.email}</p>
//         </div>
//         <ChevronDown
//           size={18}
//           className={theme === "dark" ? "text-green-500" : "text-green-600"}
//         />
//       </div>

//       {/* Dropdown */}
//       {open && (
//         <div
//           className={`absolute right-0 top-12 w-fit rounded-xl shadow-lg z-50 p-2 transition-all hover:bg-red-900/90 cursor-pointer ${
//             theme === "dark" ? "bg-gray-800" : "bg-white"
//           }`}
//         >
//           <button
//             onClick={handleLogout}
//             className="flex items-center cursor-pointer gap-4 w-full px-4 py-1 rounded-lg text-red-500 dark:hover:bg-red-900/30 transition-all"
//           >
//             <LogOut size={18} />
//             <span className="font-sm">Logout</span>
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfileMenu;
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { ChevronDown, LogOut, User, Settings, HelpCircle } from "lucide-react";
import { logout } from "../../redux/slice/user/user.slice"; // adjust path
import { useNavigate } from "react-router-dom";

const ProfileMenu = ({ user, theme }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const menuRef = useRef(null);
    const buttonRef = useRef(null);
    
    const navigate = useNavigate()

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [open]);

  const handleLogout = () => {
    dispatch(logout());
      setOpen(false);
      navigate("/")
  };

  const handleMenuItemClick = (action) => {
    setOpen(false);
    // Handle different actions here
    if (action === "profile") {
      console.log("Navigate to profile");
    } else if (action === "settings") {
      console.log("Navigate to settings");
    } else if (action === "help") {
navigate("/contact")
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
  };

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        ref={buttonRef}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition-all duration-300 group ${
          theme === "dark" 
            ? "hover:bg-green-900/20 hover:shadow-lg" 
            : "hover:bg-green-50 hover:shadow-md"
        } ${open ? (theme === "dark" ? "bg-green-900/20" : "bg-green-50") : ""}`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {/* Avatar */}
        <div className="relative">
          <div
            className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center ring-2 transition-all duration-300 ${
              theme === "dark"
                ? "bg-gradient-to-br from-green-500 to-green-600 ring-green-400/30 group-hover:ring-green-400/50"
                : "bg-gradient-to-br from-green-400 to-green-500 ring-green-300/50 group-hover:ring-green-400/70"
            }`}
          >
            {user?.avatar?.secure_url ? (
              <img
                className="w-full h-full object-cover"
                src={user.avatar.secure_url}
                alt={`${user?.fullName || "User"}'s avatar`}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className={`w-full h-full flex items-center justify-center text-sm font-bold text-white ${
                user?.avatar?.secure_url ? "hidden" : "flex"
              }`}
            >
              {getInitials(user?.fullName)}
            </div>
          </div>
          
          {/* Online Status Indicator */}
          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${
            theme === "dark" ? "border-gray-800 bg-green-400" : "border-white bg-green-500"
          }`}></div>
        </div>

        {/* User Info */}
        <div className="text-left min-w-0">
          <p
            className={`text-sm font-semibold truncate max-w-32 ${
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            }`}
            title={user?.fullName}
          >
            {user?.fullName || "User Name"}
          </p>
          <p 
            className="text-xs text-green-500 truncate max-w-32" 
            title={user?.email}
          >
            {user?.email || "user@email.com"}
          </p>
        </div>

        {/* Dropdown Arrow */}
        <ChevronDown
          size={18}
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          } ${theme === "dark" ? "text-green-400" : "text-green-600"}`}
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 z-400 md:hidden" 
            onClick={() => setOpen(false)}
          ></div>
          
          <div
            ref={menuRef}
            className={`absolute right-0 top-14 w-72 rounded-xl shadow-2xl z-50 border transition-all duration-300 transform origin-top-right ${
              theme === "dark" 
                ? "bg-gray-800 border-gray-700 shadow-black/50" 
                : "bg-white border-gray-200 shadow-gray-900/20"
            } ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
            role="menu"
            aria-orientation="vertical"
          >
            {/* User Info Header */}
            <div className={`px-6 py-4 border-b ${
              theme === "dark" ? "border-gray-700" : "border-gray-100"
            }`}>
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center ${
                    theme === "dark"
                      ? "bg-gradient-to-br from-green-500 to-green-600"
                      : "bg-gradient-to-br from-green-400 to-green-500"
                  }`}
                >
                  {user?.avatar?.secure_url ? (
                    <img
                      className="w-full h-full object-cover"
                      src={user.avatar.secure_url}
                      alt={`${user?.fullName || "User"}'s avatar`}
                    />
                  ) : (
                    <span className="text-white font-bold">
                      {getInitials(user?.fullName)}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`font-semibold text-base ${
                    theme === "dark" ? "text-gray-100" : "text-gray-900"
                  }`}>
                    {user?.fullName || "User Name"}
                  </p>
                  <p className="text-sm text-green-500 truncate">
                    {user?.email || "user@email.com"}
                  </p>
                  {user?.role && (
                    <p className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                      theme === "dark" 
                        ? "bg-blue-900/30 text-blue-300" 
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {user.role}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {/* <button
                onClick={() => handleMenuItemClick("profile")}
                className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-all duration-200 ${
                  theme === "dark"
                    ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
                role="menuitem"
              >
                <User size={18} />
                <span>View Profile</span>
              </button> */}

              {/* <button
                onClick={() => handleMenuItemClick("settings")}
                className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-all duration-200 ${
                  theme === "dark"
                    ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
                role="menuitem"
              >
                <Settings size={18} />
                <span>Settings</span>
              </button> */}

              <button
                onClick={() => handleMenuItemClick("help")}
                className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-all duration-200 ${
                  theme === "dark"
                    ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
                role="menuitem"
              >
                <HelpCircle size={18} />
                <span>Help & Support</span>
              </button>
            </div>

            {/* Logout Section */}
            <div className={`border-t ${theme === "dark" ? "border-gray-700" : "border-gray-100"}`}>
              <button
                onClick={handleLogout}
                className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all duration-200 ${
                  theme === "dark"
                    ? "text-red-400 hover:bg-red-900/20 hover:text-red-300"
                    : "text-red-600 hover:bg-red-50 hover:text-red-700"
                }`}
                role="menuitem"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileMenu;