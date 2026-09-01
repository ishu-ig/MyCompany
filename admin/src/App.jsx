import React, { useEffect, useCallback } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Sidebar from "./Components/Sidebar";

// Auth Pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgetPasswordPage from "./pages/ForgetPassword";

// Platform Administration Pages
import Home from "./pages/Home";
import ProfilePage from "./pages/ProfilePage";
import UpdateProfilePage from "./pages/UpdateProfilePage";

import AdminUser from "./pages/user/AdminUser";
import AdminJob from "./pages/job/AdminJob";
import AdminCourse from "./pages/course/AdminCourse";
import AdminApplication from "./pages/application/AdminApplication";
import AdminInterview from "./pages/interview/AdminInterview";
import AdminPlacement from "./pages/placement/AdminPlacement";
import AdminCertificate from "./pages/certificate/AdminCertificate";
import AdminBlog from "./pages/blog/AdminBlog";
import AdminContactUs from "./pages/contactUs/AdminContactUs";

const publicRoutes = ["/login", "/register", "/forgot-password"];

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}

function Shell() {
  const location = useLocation();
  const isPublic = publicRoutes.includes(location.pathname);
  const isLoggedIn = !!localStorage.getItem("token") || localStorage.getItem("login") === "true";

  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 992px)").matches;
    const savedMini = localStorage.getItem("adminHMD.sidebarMini") === "true";
    if (isDesktop && savedMini && !isPublic) {
      document.body.classList.add("sidebar-mini");
    }
    return () => {
      if (isPublic)
        document.body.classList.remove("sidebar-mini", "sidebar-open");
    };
  }, [isPublic]);

  const toggleSidebar = useCallback(() => {
    const isDesktop = window.matchMedia("(min-width: 992px)").matches;
    if (isDesktop) {
      document.body.classList.toggle("sidebar-mini");
      localStorage.setItem(
        "adminHMD.sidebarMini",
        String(document.body.classList.contains("sidebar-mini"))
      );
    } else {
      document.body.classList.toggle("sidebar-open");
    }
  }, []);

  const closeMobileSidebar = useCallback(() => {
    document.body.classList.remove("sidebar-open");
  }, []);

  // Public pages
  if (isPublic) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgetPasswordPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Redirect unauthenticated users
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Protected Admin Pages
  return (
    <div className="admin-shell">
      <div className="sidebar-backdrop" onClick={closeMobileSidebar} />
      <Sidebar onLinkClick={closeMobileSidebar} />

      <div className="admin-main">
        <Navbar toggleSidebar={toggleSidebar} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user" element={<AdminUser />} />
          <Route path="/job" element={<AdminJob />} />
          <Route path="/course" element={<AdminCourse />} />
          <Route path="/application" element={<AdminApplication />} />
          <Route path="/interview" element={<AdminInterview />} />
          <Route path="/placement" element={<AdminPlacement />} />
          <Route path="/certificate" element={<AdminCertificate />} />
          <Route path="/blog" element={<AdminBlog />} />
          <Route path="/contactUs" element={<AdminContactUs />} />

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/update-profile" element={<UpdateProfilePage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Footer />
      </div>
    </div>
  );
}