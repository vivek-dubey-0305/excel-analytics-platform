import React, { Suspense, lazy, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { useTheme } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute/AdminProtectedRoute";

// ⏳ Lazy loaded imports
const Home = lazy(() => import("./pages/PublicPages/Home"));
const Layout = lazy(() => import("./components/Layout/Layout"));
const Register = lazy(() => import("./pages/AuthPages/Register"));
const Login = lazy(() => import("./pages/AuthPages/Login"));
const Dashboard = lazy(() => import("./pages/AuthPages/Dashboard"));
const About = lazy(() => import("./pages/PublicPages/About"));
const Contact = lazy(() => import("./pages/PublicPages/Contact"));
const AuthPageLayout = lazy(() => import("./components/Layout/AuthPageLayout"));

import AdminDashboard from "./pages/Admin/AdminDashboard";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./redux/slice/user/user.slice";
import Loader from "./components/Loader/Loader";
const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await dispatch(getUser());
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, [dispatch]);
  const { user, isAuthenticated, loading, error, success } = useSelector(
    (state) => state.user
  );


  const { theme, setTheme } = useTheme();
  // if (loading) {
  //   return (
  //     <Loader />
  //   )
  // }
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"></div>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<AuthPageLayout />}>
          <Route path="/signup" element={<Register />} />
          {isAuthenticated ? (
            <>
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </>
          ) : (
            <Route
              path="/login"
              element={
                <Login
                  user={user}
                  loading={loading}
                  error={error}
                  isAuthenticated={isAuthenticated}
                />
              }
            />
          )}
        </Route>

        <Route path="/" element={<Layout />}>
          <Route index element={<Home isAuthenticated={isAuthenticated} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route />

        <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
        <Route path="/admin/users" element={<AdminProtectedRoute><div>Users Page</div></AdminProtectedRoute>} />
        <Route path="/admin/reports" element={<AdminProtectedRoute><div>Reports Page</div></AdminProtectedRoute>} />
        <Route path="/admin/analytics" element={<AdminProtectedRoute><div>Analytics Page</div></AdminProtectedRoute>} />
        <Route path="/admin/settings" element={<AdminProtectedRoute><div>Settings Page</div></AdminProtectedRoute>} />
        <Route path="/admin/security" element={<AdminProtectedRoute><div>Security Page</div></AdminProtectedRoute>} />
      </Routes>
    </Suspense>
  );
};

export default App;
