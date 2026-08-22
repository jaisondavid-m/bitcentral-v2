import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import FullScreenLoader from "../Component/FullScreenLoader.jsx";
import SEO from "../Component/SEO.jsx";
import { ROUTE_SEO } from "../seo/routeSeo.js";

const Login = lazy(() => import("../Pages/Login.jsx"));
const LandingPage = lazy(() => import("../Pages/LandingPage.jsx"));
const Dashboard = lazy(() => import("../Pages/Dashboard.jsx"));
const Home = lazy(() => import("../Pages/Home.jsx"));
const About = lazy(() => import("../Pages/About.jsx"));
const Developer = lazy(() => import("../Pages/Developer.jsx"));
const Features = lazy(() => import("../Pages/Features.jsx"));
const FAQ = lazy(() => import("../Pages/FAQ.jsx"));
const Contact = lazy(() => import("../Pages/Contact.jsx"));
const PrivacyPolicy = lazy(() => import("../Pages/PrivacyPolicy.jsx"));
const Terms = lazy(() => import("../Pages/Terms.jsx"));
const Rpsite = lazy(() => import("../Pages/Rpsite.jsx"));
const Semester = lazy(() => import("../Pages/Semester.jsx"));
const MessMenu = lazy(() => import("../Pages/MessMenu.jsx"));
const PCDP = lazy(() => import("../Pages/PCDP.jsx"));
const FindMyWay = lazy(() => import("../Pages/FindMyWay.jsx"));
const Apsite = lazy(() => import("../Pages/Apsite.jsx"));
const NotFound = lazy(() => import("../Pages/NotFound.jsx"));
const LeaveDetails = lazy(() => import("../Pages/LeaveDetails.jsx"));
const ExamHall = lazy(() => import("../Pages/ExamHall.jsx"));
const ExamHallDownload = lazy(() => import("../Pages/ExamHallDownload.jsx"));
const UserDirectory = lazy(() => import("../Pages/UserDirectory.jsx"));
const StudentReportDetails = lazy(() => import("../Pages/StudentReportDetails.jsx"));
const SupportDev = lazy(() => import("../Pages/SupportDev.jsx"));
const PaymentSuccessful = lazy(() => import("../Pages/PaymentSuccessful.jsx"));
const AK22PH202 = lazy(() => import("../Pages/answers/AK__22PH202.jsx"));
const AnswerKey22HS006 = lazy(() => import("../Pages/answers/AnswerKey22HS006.jsx"));
// const DocsPage = lazy(() => import("../Pages/AboutDocs.jsx"));
const AuthScope = lazy(() => import("../routes/AuthScope.jsx"));
const ProtectedRoute = lazy(() => import("../routes/ProtectedRoute.jsx"));
const AdminRoute = lazy(() => import("../routes/AdminRoute.jsx"));
const ProtectedLayout = lazy(() => import("../routes/ProtectedLayout.jsx"));

const AdminDashboard = lazy(() =>
  import("../Pages/AdminDashboard.jsx").then((module) => ({ default: module.default }))
);
const AdminUsersPage = lazy(() =>
  import("../Pages/AdminDashboard.jsx").then((module) => ({ default: module.AdminUsersPage }))
);
const AdminSponsorsPage = lazy(() =>
  import("../Pages/AdminDashboard.jsx").then((module) => ({ default: module.AdminSponsorsPage }))
);
const AdminQBPage = lazy(() =>
  import("../Pages/AdminDashboard.jsx").then((module) => ({ default: module.AdminQBPage }))
);
const AdminPSRewardsPage = lazy(() =>
  import("../Pages/AdminDashboard.jsx").then((module) => ({ default: module.AdminPSRewardsPage }))
);
const AdminCardsPage = lazy(() =>
  import("../Pages/AdminDashboard.jsx").then((module) => ({ default: module.AdminCardsPage }))
);
const AdminMessPage = lazy(() =>
  import("../Pages/AdminDashboard.jsx").then((module) => ({ default: module.AdminMessPage }))
);

function App() {
  const location = useLocation();

  const currentMeta = ROUTE_SEO[location.pathname] || ROUTE_SEO["*"];

  // useEffect(() => {
  //   const handleKeyDown = (e) => {
  //     const key = (e.key || "").toLowerCase();

  //     // Block F12
  //     if (e.key === "F12") {
  //       e.preventDefault();
  //       e.stopPropagation();
  //       return false;
  //     }

  //     // Block Ctrl/Cmd + Shift + [I/J/C/K]
  //     if ((e.ctrlKey || e.metaKey) && e.shiftKey && (key === "i" || key === "j" || key === "c" || key === "k")) {
  //       e.preventDefault();
  //       e.stopPropagation();
  //       return false;
  //     }

  //     // Block Ctrl/Cmd + U (view source) and Ctrl/Cmd + S (save)
  //     if ((e.ctrlKey || e.metaKey) && (key === "u" || key === "s")) {
  //       e.preventDefault();
  //       e.stopPropagation();
  //       return false;
  //     }
  //   };

  //   const handleContext = (e) => {
  //     e.preventDefault();
  //     e.stopPropagation();
  //     return false;
  //   };

  //   // Best-effort devtools detection by measuring window sizes
  //   const checkDevTools = () => {
  //     try {
  //       const threshold = 160; // heuristic
  //       const widthDiff = window.outerWidth - window.innerWidth;
  //       const heightDiff = window.outerHeight - window.innerHeight;
  //       if (widthDiff > threshold || heightDiff > threshold) {
  //         // alert("Developer tools detected. Please close it to continue.");
  //       }
  //     } catch (err) {
  //       // ignore
  //     }
  //   };

  //   document.addEventListener("keydown", handleKeyDown, true);
  //   document.addEventListener("contextmenu", handleContext, true);
  //   window.addEventListener("resize", checkDevTools);
  //   const intervalId = setInterval(checkDevTools, 1500);

  //   return () => {
  //     document.removeEventListener("keydown", handleKeyDown, true);
  //     document.removeEventListener("contextmenu", handleContext, true);
  //     window.removeEventListener("resize", checkDevTools);
  //     clearInterval(intervalId);
  //   };
  // }, []);

  return (
    <>
      <SEO pathname={location.pathname} meta={currentMeta} />
      <Suspense fallback={<FullScreenLoader />}>
        <Routes>
          {/* Public */}
          <Route
            path="/login"
            element={
              <AuthScope>
                <Login />
              </AuthScope>
            }
          />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/developer" element={<Developer />} />
          <Route path="/features" element={<Features />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/support-dev" element={<SupportDev />} />
          <Route path="/payment-successful" element={<PaymentSuccessful />} />
          <Route path="/payment-successfull" element={<PaymentSuccessful />} />
          {/* <Route path="/docs/about" element={<DocsPage />} /> */}

          {/* Protected Layout */}
          <Route
            element={
              <AuthScope>
                <ProtectedRoute>
                  <ProtectedLayout />
                </ProtectedRoute>
              </AuthScope>
            }
          >
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/findmyway" element={<FindMyWay />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsersPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/sponsors"
              element={
                <AdminRoute>
                  <AdminSponsorsPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/qb"
              element={
                <AdminRoute>
                  <AdminQBPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/ps-rewards"
              element={
                <AdminRoute>
                  <AdminPSRewardsPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/cards"
              element={
                <AdminRoute>
                  <AdminCardsPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/mess"
              element={
                <AdminRoute>
                  <AdminMessPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/super"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route path="/profile" element={<Dashboard />} />
            {/* <Route path="/about" element={<About />} /> */}
            <Route path="/rpsite" element={<Rpsite />} />
            <Route path="/pcdp" element={<PCDP />} />
            <Route path="/exam-hall" element={<ExamHallDownload />} />
            <Route path="/exam-hall-manual" element={<ExamHall />} />
            <Route path="/apsite" element={<Apsite />} />
            <Route path="/leavedetails" element={<LeaveDetails />} />
            <Route path="/semester" element={<Semester />} />
            <Route path="/mess" element={<MessMenu />} />
            <Route path="/user-directory" element={<UserDirectory />} />
            <Route path="/student-report/:id" element={<StudentReportDetails />} />
            <Route path="/student-report" element={<StudentReportDetails />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/ak_22ph202" element={<AK22PH202 />} />
            <Route path="/tamil_ak" element={<AnswerKey22HS006 />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Analytics />
    </>
  );
}

export default App;
